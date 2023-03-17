const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Membership } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')

const router = express.Router();


router.post('/', requireAuth, handleValidationErrors, async (req, res) => {
   const userId = req.user.id
   const organizerId = userId
   const {name, about, type, private, city, state} = req.body

   const newGroup = await Group.create({
      organizerId,
      name,
      about,
      type,
      private,
      city,
      state
   })
   let data = {};

   data.id = userId,
   data.organizerId = organizerId,
   data.name = newGroup.name,
   data.about = newGroup.about,
   data.type = newGroup.type,
   data.private = newGroup.private,
   data.city = newGroup.city,
   data.state = newGroup.state
   data.createdAt = newGroup.createdAt,
   data.updatedAt = newGroup.updatedAt

   res.json(data)
})


router.get('/', async (req, res) => {
   const group = await Group.findAll();
   res.json(group)
})

router.get('/current', requireAuth, async (req, res) => {
   const id = req.user.id
   const organizerId = id

   const organizedGroups = await Group.findAll({
      where: organizerId
   })

   res.json(organizedGroups)
})




module.exports = router;
