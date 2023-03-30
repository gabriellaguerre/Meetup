const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, GroupImage, Venue, EventImage, Event, Membership, Attendee } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')

const router = express.Router();

/**************Delete an Event Image*********************/
router.delete('/:imageId', requireAuth, async (req, res) => {
    const imageId = req.params.imageId

    const user = req.user.id

    const eventImage = await EventImage.findByPk(imageId)

    if (eventImage) {
        const eventId = eventImage.eventId

        const event = await Event.findByPk(eventId)

        const groupId = event.groupId

        const member = await Membership.findOne({
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
        if (group.organizerId === user || member.status === 'co-host') {
            await eventImage.destroy();
            res.status(200).json({
                message: "Successfully deleted",
                statusCode: 200
            })
        }

    } else {
        const err = new Error("Event Image couldn't be found")
        err.status = 404
        res.json({
            message: err.message,
            statusCode: err.status
        })

    }
})

module.exports = router;
