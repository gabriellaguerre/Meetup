const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, GroupImage, Venue, EventImage, Event, Membership, Attendee } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res) => {
    const imageId = req.params.imageId

    const user = req.user.id

    const eventImage = await EventImage.findByPk(imageId)

    const eventId = eventImage.eventId

    const event = await Event.findByPk(eventId)

    const groupId = event.groupId

    const members = await Membership.findAll({
        where: groupId
    })

    const group = await Group.findOne({
        where: {
            id: groupId
        }
    })

    const member = await members.findOne({
        where: {
            userId: user
        }
    })

    if(eventImage) {
        if(group.organizerId === user || member.status === 'co-host') {
            await eventImage.destroy()
            res.status(200).json({
                message: "Successfully deleted",
                statusCode: 200
            })
        }

    } else {
        res.status(404).json({
            message: "Event Image couldn't be found",
            statusCode: 404
        })
    }
})
