const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, GroupImage, Venue, EventImage, Event, Membership, Attendee } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')

const router = express.Router();

/*******Get All Events*******************/
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

/*****Get Details of an Event by Id***************/
router.get('/:eventsId', async (req, res) => {
    const id = req.params.eventsId

    const event = await Event.findAll({
        where: { id },
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
        console.log(event)
        res.status(200).json(event)
    } else {
        const err = new Error("Event couldn't be found")
        err.status = 404
        res.json({
            message: err.message,
            statusCode: err.status
        })
    }
})

/*************Add an Image to an Event**************/
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

/***********Edit an Event******************/
router.put('/:eventId', requireAuth, handleValidationErrors, async (req, res) => {
    const id = req.params.eventId

    const event = await Event.findByPk(id)

    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body

    // if (!venueId) {
    //     res.status(404).json({
    //         message: "Venue couldn't be found",
    //         statusCode: 404
    //     })
    // }

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

/**********Get All Attendees of an Event***********/
router.get('/:eventId/attendees', async (req, res) => {
    const eventId = req.params.eventId

    const event = await Event.findByPk(eventId)

    if (!event) {
        const err = new Error("Event couldn't be found")
        err.status = 404
        res.json({
            message: err.message,
            statusCode: err.status
        })
    }

    const user = req.user.id

    const groupId = event.groupId

    const group = await Group.findAll({
        where: {
            id: groupId
        }
    })

    const members = await Membership.findAll({
        where: {
            userId: user,
            groupId
        }
    })

    // const member = await members.findAll({
    //     where: {
    //         userId: user
    //     }
    // })
    if (event) {
        if (members) {
            if (group.organizerId === user || members.status === 'co-host') {
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

        // } else {
        //     res.status(404).json({
        //         message: "Event couldn't be found",
        //         statusCode: 404
        //     })
    }
})

/*************Request Attendance to an Event***********/
router.post('/:eventId/attendance', requireAuth, async (req, res) => {
    const eventId = req.params.eventId

    const event = await Event.findByPk(eventId)

    const user = req.user.id

    if (event) {
        const groupId = event.groupId
        const attendance = await Attendee.findOne({
            where: {
                eventId,
                userId: user
            }
        })
        const members = await Membership.findOne({
            where: {
                userId: user,
                groupId
            }
        })

        if(!members && !attendance) {
            const err = new Error("User is not a member of this group")
            err.status = 404
            res.json({
                message: err.message,
                statusCode: 404
            })
        }

        if (members && !attendance) {
            if (members.status === 'pending') {
                const err = new Error("You must be a member of the group. Your current member status is pending")
                err.status = 400
                res.json({
                    message: err.message,
                    statusCode: 400
                })
            }
            if (members.status === 'member') {
                const attend = await Attendee.create({
                    eventId,
                    userId: user,
                    status: "pending"
                })
                res.json(attend)
                    // userId: user,
                    // status: attend.status
                // })
            }
        } else if (members && attendance) {
            if (attendance.status === 'pending') {
                const err = new Error("Attendance has already been requested")
                err.status = 400
                res.json({
                    message: err.message,
                    statusCode: err.status
                })
            }
            if (attendance.status === 'attending') {
                const err = new Error("User is already an attendee of the event")
                err.status = 400
                res.json({
                    message: err.message,
                    statusCode: err.status
                })
            }
        }

    } else {
        const err = new Error("Event couldn't be found")
        err.status = 404
        res.json({
            message: err.message,
            statusCode: err.status
        })
    }
})

/****************Change Attendance Status***********/
router.put('/:eventId/attendance', requireAuth, async (req, res) => {
    const eventId = req.params.eventId
    const { userId, status } = req.body

    const user = req.user.id

    const event = await Event.findByPk(eventId)

    if (!event) {
        const err = new Error("Event couldn't be found")
        err.status = 404
        res.json({
            message: err.message,
            statusCode: err.status
        })
    }

    const groupId = event.groupId

    const group = await Group.findOne({
        where: {
            id: groupId
        }
    })

    const members = await Membership.findOne({
        where: {
            userId,
            groupId
        }
    })

    const attendance = await Attendee.findAll({
        where: {
            eventId,
            userId
        }
    })

    if (event) {
        if (members) {
            if (members.status === 'pending') {
                const err = new Error("You are not authorized to change the status")
                err.status = 404
                res.json({
                    message: err.message,
                    statusCode: err.status
                })
            }
            if (group.organizerId === user || members.status === 'co-host') {
                if (status === 'pending') {
                    res.status(400).json({
                        message: "Cannot change an attendance status to pending",
                        statusCode: 400
                    })
                }
                if (!attendance) {
                    res.status(404).json({
                        message: "Attendance between the user and the event does not exist",
                        statusCode: 404
                    })
                } else {
                    await Attendee.update({
                        eventId,
                        userId,
                        status
                    })

                    res.status(200).json(attendance)
                }
            }

            // } else {
            //     res.status(404).json({
            //         message: "Event couldn't be found",
            //         statusCode: 404
            //     })
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

    if (user !== group.organizerId || user !== attendee.userId) {
        res.status(403).json({
            message: "Only the User or organizer may delete an Attendance",
            statusCode: 403
        })
    }


    if (event) {
        if (attendee) {
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
