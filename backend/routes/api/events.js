const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, GroupImage, Venue, EventImage, Event, Membership, Attendee } = require('../../db/models');
const { check, query } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')

const router = express.Router();

const validateQuery = [
    query('page')
        .if((value, { req }) => req.query.page)
        .custom((value, { req }) => value >= 1)
        .withMessage('Page must be greater than or equal to 1'),
    query('size')
        .if((value, { req }) => req.query.size)
        .custom((value, { req }) => value >= 1)
        .withMessage('Size must be greater than or equal to 1'),
    query('name')
        .if((value, { req }) => req.query.name)
        .custom((value, { req }) => typeof value === 'string')
        .withMessage("Name must be a string"),
    query('type')
        .if((value, { req }) => req.query.type)
        .custom((value, { req }) => value === 'Online' || value === 'In person')
        .withMessage("Type must be 'Online' or 'In Person'"),
    query('startDate')
        .if((value, { req }) => req.query.startDate)
        .isDate()
        .withMessage('Start date must be a valid datetime'),
    handleValidationErrors,

];


/*******Get All Events*******************/
router.get('/', validateQuery, async (req, res) => {
    let { page, size, name, type, startDate } = req.query

    if (!page || page > 10) {
        page = 1
    } else {
        page = Number.parseInt(page)
    }

    if (!size || size > 20) {
        size = 1000
    } else {
        size = Number.parseInt(size)
    }

    limit = size;
    offset = limit * (page - 1)

    let where = {}

    if (name) {
        where.name = { [Op.substring]: name }
    }

    if (type) {
        where.type = { [Op.substring]: type }
    }

    if (startDate) {
        where.startDate = { [Op.substring]: startDate }
    }

    let result = {};

    let activities = []

    const events = await Event.findAll({
        where,
        attributes: ['id', 'groupId', 'venueId', 'name', 'type', 'startDate', 'endDate', 'price', 'description', 'eventImg', 'startTime', 'endTime'],
        include: [
            {
                model: Group,
                attributes: ['id', 'name', 'city', 'state', 'groupImg', 'organizerId']
            },
            {
                model: Venue,
                attributes: ['id', 'city', 'state']
            }
        ],
        limit,
        offset
    })

    for (let i = 0; i < events.length; i++) {
        let event = events[i]
        let eventOne = event.toJSON()

        let attending = await Attendee.count("userId", {
            where: {
                eventId: event.id
            }
        })
        let previewimage = await EventImage.findOne({
            where: {
                preview: true
            }
        })
        let countUp = 0;
        let countPast = 0

        if (Date.parse(eventOne.startDate) > Date.now()) {
            countUp++
        }
        if (Date.parse(eventOne.startDate) < Date.now()) {
            countPast++
        }

        if (!eventOne.venueId) eventOne.venueId = null
        if (!eventOne.Venue) eventOne.Venue = null

        result.id = eventOne.id,
        result.groupId = eventOne.groupId,
        result.venueId = eventOne.venueId,
        result.name = eventOne.name,
        result.type = eventOne.type,
        result.startDate = eventOne.startDate,
        result.endDate = eventOne.endDate,
        result.price = eventOne.price,
        result.description = eventOne.description,
        result.eventImg = eventOne.eventImg,
        result.startTime = eventOne.startTime,
        result.endTime = eventOne.endTime,
        result.countUp = countUp,
        result.countPast = countPast

        // eventOne.numAttending = attending
        // eventOne.countUp = countUp
        // eventOne.countPast = countPast

        activities.push(result)
    }
    //console.log(result, "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
 //   result.Events = activities,
        result.page = page,
        result.size = limit

    res.json(activities)
})

/*****Get Details of an Event by Id***************/
router.get('/:eventId', async (req, res) => {
    const eventId = req.params.eventId

    const event = await Event.findOne({
        where: { id: eventId },
        attributes: ['id', 'groupId', 'venueId', 'name', 'description', 'type', 'capacity', 'price', 'startDate', 'endDate'],
    })
    if (event) {
        const group = await Group.findOne({
            where: { id: event.groupId },
            attributes: ['id', 'name', 'private', 'city', 'state']
        })

        const venue = await Venue.findOne({
            where: { id: event.venueId },
            attributes: ['id', 'address', 'city', 'state', 'lat', 'lng']
        })
        const eventImage = await EventImage.findAll({
            where: { eventId },
            attributes: ['id', 'url', 'preview']
        })

        const numAttending = await Attendee.count({
            where: { eventId }
        })

        const data = event.toJSON()
        data.numAttending = numAttending
        data.Group = group
        data.Venue = venue
        data.EventImages = eventImage
        res.json(data)

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

    const { url, preview } = req.body

    const user = req.user.id

    const event = await Event.findByPk(eventId)

    if (event) {
        const attendee = await Attendee.findOne({
            where: {
                eventId,
                userId: user
            }
        })

        if (attendee.status === 'attending' || attendee.status === 'host' || attendee.status === 'co-host') {
            const addImage = await EventImage.create({
                eventId,
                url,
                preview
            })
            let image = {}
            image.id = addImage.id,
                image.url = addImage.url,
                image.preview = addImage.preview

            res.status(200).json(image)
        } else {
            const err = new Error("Forbidden")
            err.status = 403
            res.json({
                message: err.message,
                statusCode: err.status
            })
        }

    } else {
        res.status(200).json({
            message: "Event couldn't be found",
            statusCode: 404
        })
    }
})

/***********Edit an Event******************/
router.put('/:eventId', requireAuth, handleValidationErrors, async (req, res) => {
    const eventId = req.params.eventId

    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body

    const event = await Event.findByPk(eventId)

    const user = req.user.id

    if (event) {
        const groupId = event.groupId

        const group = await Group.findOne({
            where: groupId
        })
        const member = await Membership.findOne({
            where: {
                userId: user,
                groupId
            }
        })
        const venue = await Venue.findOne({
            where: {
                id: venueId
            }
        })
        if (!venue) {
            res.json({
                message: "Venue couldn't be found",
                statusCode: 404
            })
        }

        if (user === group.organizerId || member.status === 'co-host') {

            await event.update({
                venueId,
                groupId,
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
            const err = new Error("Forbidden")
            err.status = 403
            res.json({
                message: err.message,
                statusCode: err.status
            })
        }

    } else {
        res.status(404).json({
            message: "Event couldn't be found",
            statusCode: 404
        })
    }
})

/**************Delete an Event**********************/
router.delete('/:eventId', requireAuth, async (req, res) => {

    const eventId = req.params.eventId

    console.log(eventId, "EVENT ID IN BACKEND")

    const event = await Event.findByPk(eventId)

    const user = req.user.id


    if (event) {
        const groupId = event.groupId

        const group = await Group.findOne({
            where: { id: groupId }
        })

        const member = await Membership.findOne({
            where: {
                userId: user,
                groupId
            }
        })
        if (group.organizerId) {
            if (user === group.organizerId || member.status === 'co-host') {
                await event.destroy();
                res.json({
                    message: "Successfully deleted",
                    statusCode: 200
                })
            } else {
                const err = new Error("Forbidden")
                err.status = 403
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

/******************ATTENDEES*************************/

/**********Get All Attendees of an Event***********/
router.get('/:eventId/attendees', async (req, res) => {
    const eventId = req.params.eventId

    const user = req.user.id

    const event = await Event.findOne({
        where: { id: eventId }
    })
    if (event) {
        const groupId = event.groupId

        const group = await Group.findOne({
            where: {
                id: groupId
            }
        })

        const members = await Membership.findOne({
            where: {
                userId: user,
                groupId
            }
        })
        let attends = []

        if (members) {
            if (group.organizerId === user || members.status === 'co-host') {
                const attendees = await Attendee.findAll({
                    where: { eventId },
                    attributes: ['status'],
                    include: {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']

                    }
                })
                for (let i = 0; i < attendees.length; i++) {
                    let data = {}
                    let attendee = attendees[i]
                    let attendor = attendee.toJSON()

                    data.id = attendor.User.id,
                        data.firstName = attendor.User.firstName
                    data.lastName = attendor.User.lastName
                    data.Attendance = {}
                    data.Attendance.status = attendor.status
                    attends.push(data)
                }
                res.json({ Attendees: attends })

            } else {
                const attendees = await Attendee.findAll({
                    where: {
                        status: { [Op.notLike]: '%pending%' }
                    },
                    attributes: ['status'],
                    include: {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    }
                })
                for (let i = 0; i < attendees.length; i++) {
                    let data = {}
                    let attendee = attendees[i]
                    let attendor = attendee.toJSON()

                    data.id = attendor.User.id,
                        data.firstName = attendor.User.firstName
                    data.lastName = attendor.User.lastName
                    data.Attendance = {}
                    data.Attendance.status = attendor.status
                    attends.push(data)
                }
                res.json({ Attendees: attends })
            }
        }

    } else {
        const err = new Error("Event couldn't be found")
        err.status = 404
        return res.json({
            message: err.message,
            statusCode: err.status
        })
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
        const member = await Membership.findOne({
            where: {
                userId: user,
                groupId
            }
        })

        if (!member) {
            const err = new Error("User is not a member of this group")
            err.status = 404
            res.json({
                message: err.message,
                statusCode: 404
            })
        }

        if (member && !attendance) {
            if (member.status === 'pending') {
                const err = new Error("You must be a member of the group. Your current member status is pending")
                err.status = 400
                res.json({
                    message: err.message,
                    statusCode: 400
                })
            }
            if (member.status === 'member') {
                const attend = await Attendee.create({
                    eventId,
                    userId: user,
                    status: "pending"
                })
                let data = {}
                //  data.id = attend.id,
                data.userId = attend.userId,
                    data.status = attend.status
                res.json(data)
            }
        } else if (member && attendance) {
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

    if (event) {
        const groupId = event.groupId

        const group = await Group.findOne({
            where: {
                id: groupId
            }
        })

        const authorizedMember = await Membership.findOne({
            where: {
                userId: user,
                groupId
            }
        })
        const member = await Membership.findOne({
            where: {
                userId: userId,
                groupId
            }
        })

        const attendance = await Attendee.findOne({
            where: {
                eventId,
                userId: userId
            }
        })
        if (member) {
            if (group.organizerId === user || authorizedMember.status === 'co-host') {
                if (status === 'pending') {
                    res.status(400).json({
                        message: "Cannot change an attendance status to pending",
                        statusCode: 400
                    })
                } else {
                    await attendance.update({
                        eventId,
                        userId,
                        status
                    })
                    attendance.save()

                    let attendanceOne = attendance.toJSON()

                    let going = {}

                    going.id = attendanceOne.id,
                        going.eventId = attendanceOne.eventId,
                        going.userId = attendanceOne.userId,
                        going.status = attendanceOne.status

                    res.status(200).json(going)
                }

            } else {
                const err = new Error("Forbidden")
                err.status = 403
                res.json({
                    message: err.message,
                    statusCode: err.status
                })
            }

            if (!attendance) {
                res.status(404).json({
                    message: "Attendance between the user and the event does not exist",
                    statusCode: 404
                })
            }
        } else {
            const err = new Error("User is not a member of the group")
            err.status = 404
            res.json({
                message: err.message,
                statusCode: err.status
            })
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

/*******************Delete an Attendance************/
router.delete('/:eventId/attendance', requireAuth, async (req, res) => {
    const eventId = req.params.eventId

    const event = await Event.findByPk(eventId)

    const user = req.user.id

    const { memberId } = req.body

    if (event) {
        const groupId = event.groupId

        const group = await Group.findByPk(groupId)

        const attendance = await Attendee.findOne({
            where: {
                userId: memberId,
                eventId
            }
        })
        if (!attendance) {
            const err = new Error("Attendance does not exist for this User")
            err.status = 404
            res.json({
                message: err.message,
                statusCode: err.status
            })
        }
        if (user === group.organizerId || user === attendance.userId) {
            await attendance.destroy()
            return res.json({
                message: "Successfully deleted attendance from event"
            })

        } else {
            const err = new Error("Forbidden")
            err.status = 403
            res.json({
                message: err.message,
                statusCode: err.status
            })
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

/**************Delete an Event******************/
router.delete('/:eventId', requireAuth, async (req, res) => {

    const eventId = req.params.eventId

    const user = req.user.id

    const event = await Event.findByPk(eventId)

    if (event) {
        const groupId = event.groupId

        const members = await Membership.findOne({
            where: {
                userId: user,
                groupId
            }
        })
        const group = await Group.findOne({
            where: {
                id: groupId
            }
        })

        if (group.organizerId === user || members.status === 'co-host') {
            await event.destroy();
            return res.status(200).json({
                message: "Successfully deleted",
                statusCode: 200
            })
        } else {
            const err = new Error("Forbidden")
            err.status = 403
            res.json({
                message: err.message,
                statusCode: err.status
            })
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




module.exports = router;
