const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, GroupImage, Venue, EventImage, Event, Membership, Attendee } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')

const router = express.Router();

/********Delete a Group Image****************/
router.delete('/:imageId', requireAuth, async (req, res) => {
    const imageId = req.params.imageId

    const user = req.user.id

    const groupImage = await GroupImage.findByPk(imageId)

    const groupId = groupImage.groupId

    const group = await Group.findByPk(groupId)

    const member = await Membership.findOne({
        where: {
            userId: user,
            groupId
        }
    })

    if(groupImage) {
        if(group.organizerId === user || member.status === 'co-host') {
            await groupImage.destroy()
            res.json({
                message: "Successfully deleted",
                statusCode: 200
            })
        }

    } else {
        const err = new Error("Group Image couldn't be found")
        err.status = 404
        res.json({
            message: err.message,
            statusCode: err.status
        })
    }
})


module.exports = router;
