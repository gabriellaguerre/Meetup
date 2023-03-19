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

    const groupImage = await GroupImage.findByPk(imageId)

    const groupId = groupImage.groupId

    const group = await Group.findByPk(groupId)

    const members = await Membership.findAll({
        where: groupId
    })

    const member = await members.findOne({
        where: {
            userId: user
        }
    })

    if(groupImage) {
        if(group.organizerId === user || member.status === 'co-host') {
            await groupImage.destroy()
            res.status(200).json({
                message: "Successfully deleted",
                statusCode: 200
            })
        }

    } else {
        res.status(404).json({
            message: "Group Image couldn't be found",
            statusCode: 404
        })
    }
})


module.exports = router;
