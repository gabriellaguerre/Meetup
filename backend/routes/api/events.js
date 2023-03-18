const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, GroupImage, Venue, EventImage, Membership } = require('../../db/models');
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
    if(event) {
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

    const {url, preview} = req.body

    if(event) {
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

    const {venueId, name, type, capacity, price, description, startDate, endDate} = req.body

    if(!venueId) {
        res.status(404).json({
            message: "Venue couldn't be found",
            statusCode: 404
        })
    }

    if(event) {
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

    if(event) {
        await event.destroy()
        res.status(200).json({message: "Successfully deleted"})
    } else {
        res.status(404).json({
            message: "Event couldn't be found",
            statusCode: 404
    })
    }
})



module.exports = router;
