const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, GroupImage, Venue, EventImage, Event, Membership, Attendee } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')

const router = express.Router();

router.get('/', async (req, res) => {

    const events = await Event.findAll({
        include: [{
            model: Group
        },
        {
            model: Venue
        }
        ]
    })
    res.json(events)
})

router.get('/:eventsId', async (req, res) => {
    const id = req.params.eventsId

    const event = await Event.findAll({
        where: id,
        inlcude: [{
            model: Group
        },
        {
            model: Venue
        },
        {
            model: EventImage,
            as: "EventImages"
        }]
    })
    if (event) {
        res.status(200).json(event)
    } else {
        res.status(404).json({
            message: "Event couldn't be found",
            statusCode: 404
        })
    }
})

router.post('/:eventId/images', requireAuth, async (req, res) => {
    const eventId = req.params.eventId;

    const event = await Event.findByPk(eventId)

    const { url, preview } = req.body

    if (event) {
        const addImage = await EventImage.create({
            eventId,
            url,
            preview
        })
        res.status(200).json(addImage)
    } else {
        res.status(200).json({
            message: "Event couldn't be found",
            statusCode: 404
        })
    }
})

router.put('/:eventId', requireAuth, handleValidationErrors, async (req, res) => {
    const id = req.params.eventId

    const event = await Event.findByPk(id)

    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body

    if (!venueId) {
        res.status(404).json({
            message: "Venue couldn't be found",
            statusCode: 404
        })
    }

    if (event) {
        await event.update({
            venueId,
            name,
            type,
            capacity,
            price,
            description,
            startDate,
            endDate
        })
        event.save()
        res.status(200).json(event)
    } else {
        res.status(404).json({
            message: "Event couldn't be found",
            statusCode: 404
        })
    }
})

router.delete('/:eventId', requireAuth, async (req, res) => {

    const id = req.params.eventId

    const event = await Event.findByPk(id)

    if (event) {
        await event.destroy()
        res.status(200).json({ message: "Successfully deleted" })
    } else {
        res.status(404).json({
            message: "Event couldn't be found",
            statusCode: 404
        })
    }
})

/******************ATTENDEES*************************/

router.get('/:eventId/attendees', async (req, res) => {
    const eventId = req.params.eventId

    const event = await Event.findByPk(eventId)

    const user = req.user.id

    const groupId = event.groupId

    const group = await Group.findAll({
        where: {
            id: groupId
        }
    })

    const members = await Membership.findAll({
        where: groupId
    })

    const member = await members.findAll({
        where: {
            userId: user
        }
    })
    if (event) {
        if (member) {
            if (group.organizerId === user || member.status === 'co-host') {
                const attendees = await Attendee.findAll()
                res.json(attendees)
            } else {
                const attendees = await Attendee.findAll({
                    where: {
                        status: { [Op.notLike]: '%pending%' }
                    }
                })
                res.json(attendees)
            }
        }

    } else {
        res.status(404).json({
            message: "Event couldn't be found",
            statusCode: 404
        })
    }
})

router.post('/:eventId/attendance', requireAuth, async (req, res) => {
    const eventId = req.params.eventId

    const attendance = await Attendee.findAll({
        where: eventId
    })

    const user = req.user.id

    const attendee = await attendance.findAll({
        where: {
            userId: user
        }
    })

    const event = await Event.findByPk(eventId)

    const groupId = event.groupId

    const members = await Membership.findAll({
        where: groupId
    })

    const member = await members.findOne({
        where: {
            userId: user
        }
    })

    if (event) {
        if (member && member.status === 'member') {
            if (attendee.status === 'pending') {
                return res.status(400).json({
                    message: "Attendance has already been requested",
                    statusCode: 400
                })
            } else if (attendee.status === 'attending') {
                return res.status(400).json({
                    message: "User is already an attendee of the event",
                    statusCode: 400
                })
            } else {
                res.status(200).json({
                    userId: user,
                    status: "pending"
                })
            }
        }
    } else {
        res.status(404).json({
            message: "Event couldn't be found",
            statusCode: 404
        })
    }
})

router.put('/:eventId/attendance', requireAuth, async (req, res) => {
    const eventId = req.params.eventId

    const { userId, status } = req.body

    const attendance = await Attendee.findAll({
        where: eventId
    })

    const attendee = await attendance.findAll({
        where: userId
    })

    const user = req.user.id

    const event = await Event.findByPk(eventId)

    const groupId = event.groupId

    const members = await Membership.findAll({
        where: groupId
    })

    const member = await members.findOne({
        where: {
            userId: user
        }
    })
    const group = await Group.findAll({
        where: {
            id: groupId
        }
    })

    if (event) {
        if (member) {
            if (group.organizerId === user || member.status === 'co-host') {
                if (status === 'pending') {
                    res.status(400).json({
                        message: "Cannot change an attendance status to pending",
                        statusCode: 400
                    })
                }
                if (!attendee) {
                    res.status(404).json({
                        message: "Attendance between the user and the event does not exist",
                        statusCode: 404
                    })
                } else {

                    await attendance.update({
                        userId,
                        status
                    })
                    res.status(200).json(attendance)
                }
            }

        } else {
            res.status(404).json({
                message: "Event couldn't be found",
                statusCode: 404
            })
        }
    }
})

router.delete('/:eventId/attendance', requireAuth, async (req, res) => {
    const eventId = req.params.eventId

    const event = await Event.findByPk(eventId)

    const user = req.user.id

    const groupId = event.groupId

    const group = await Group.findByPk(groupId)

    const attendance = await Attendee.findAll({
        where: eventId
    })

    const attendee = await attendance.findOne({
        where: {
            userId: user
        }
    })

    if(user !== group.organizerId || user !== attendee.userId) {
        res.status(403).json({
            message: "Only the User or organizer may delete an Attendance",
            statusCode: 403
        })
    }


    if(event) {
        if(attendee) {
            await attendee.destroy()

        } else {
            res.status(404).json({
                message: "Attendance does not exist for this User",
                statusCode: 404
            })
        }


    } else {
        res.status(404).json({
            message: "Event couldn't be found",
            statusCode: 404
        })
    }
})








module.exports = router;
