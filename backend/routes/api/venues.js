const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, GroupImage, Venue, Membership } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')

const router = express.Router();

router.put('/:venueId', requireAuth, handleValidationErrors, async (req, res) => {
    const venueId = req.params.venueId

    const {address, city, state, lat, lng} = req.body

    const venue = await Venue.findByPk(venueId)

    if(venue) {
        const updateVenue = venue.update({
            address,
            city,
            state,
            lat,
            lng
        })
        updateVenue.save();

        res.status(200).json(updateVenue)
    } else {
        res.status(404).json({
            message: "Venue couldn't be found",
            statusCode: 404
        })
    }
})

router.put('/:venueId', requireAuth, async (req, res) => {
    const venueId = req.params.venueId;

    const {address, city, state, lat, lng} = req.body

    const venue = await Venue.findByPk(venueId)

    if(venue){
        await venue.update({
            address,
            city,
            state,
            lat,
            lng
        })
        venue.save()
        res.status(200).json(venue)
    } else {
        res.status(404).json({
            message: "Venue couldn't be found",
            statusCode: 404
        })
    }
})




module.exports = router;
