const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, GroupImage, Venue, Membership } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')

const router = express.Router();

/*****************Edit a Venue********************/
router.put('/:venueId', requireAuth, handleValidationErrors, async (req, res) => {
    const id = req.params.venueId

    const user = req.user.id

    const { address, city, state, lat, lng } = req.body

    const venue = await Venue.findByPk(id)

    if (venue) {
        const groupId = venue.groupId

        const group = await Group.findOne({
            where: {
                id: groupId
            }
        })

        const member = await Membership.findOne({
            where: {
                userId: user,
                groupId: group.id
            }
        })
        if (user === group.organizerId || member.status === 'co-host') {
            await venue.update({
                groupId: group.id,
                address,
                city,
                state,
                lat,
                lng
            })
            venue.save();
            let data = {}
            data.id = venue.id,
                data.groupId = venue.groupId,
                data.address = venue.address,
                data.city = venue.city,
                data.state = venue.state,
                data.lat = venue.lat,
                data.lng = venue.lng

            res.status(200).json(data)
        } else {
            const err = new Error("Forbidden")
            err.status = 403
            res.json({
                message: err.message,
                statusCode: err.status
            })
        }

    } else {
        const err = new Error("Venue couldn't be found")
        err.status = 404
        res.json({
            message: err.message,
            statusCode: err.status
        })
    }
})



module.exports = router;
