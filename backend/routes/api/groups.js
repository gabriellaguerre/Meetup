const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, GroupImage, Venue, Membership } = require('../../db/models');
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

router.get('/:groupId', async (req, res) => {
   const groupId = req.params.groupId

   const group = await Group.findOne({
      where: groupId,
      include: [
         {model: GroupImage},
         {model: User, as: 'Organizer'},
         {model: Venue}
      ]
   })
   res.json(group)
})

router.post('/:groupId/images', requireAuth, async (req, res) => {
   const groupId = req.params.groupId;

   const group = await Group.findByPk(groupId)

   let data = {};

   if(group) {
      const {url, preview} = req.body
      const addImage = await GroupImage.create({
         id,
         groupId,
         url,
         preview
      })
      data.id = addImage.id,
      data.url = addImage.url
      data.preview = addImage.preview
      res.json(data)
   } else {
      res.json({
         message: "Group couldn't be found",
         statusCode: 404
      })
   }
})

router.put('/:groupId', requireAuth, async (req, res) => {
   const groupId = req.params.id

   const {name, about, type, private, city, state} = req.body

   const group = await Group.findOne({
      where: groupId
   })

   if(group) {
      const update = await group.Update({
         name,
         about,
         type,
         private,
         city,
         state
      })
      update.save()
      res.json(group)
   } else{
      res.json({
         message: "Group couldn't be found",
         statusCode: 404
      })
   }
})

router.delete('/:groupId', requireAuth, async (req, res) => {
   const groupId = req.params.groupId

   const group = await Group.findByPk(groupId)

   if(group) {
      group.destroy();
      res.json({
         message: "Successfully deleted",
         statusCode: 200
   })
   } else {
      res.json({
         message: "Group couldn't be found",
         statusCode: 404
      })
   }

})

router.get('/:groupId/venues', requireAuth, async (req, res) => {
   const groupId = req.params.groupId

   const venues = await Venue.findAll({
      where: groupId
   })
   if(venues) {
      res.json(venues)
   } else {
      res.statusCode(404).json({
         message: "Group couldn't be found",
         statusCode: 404
      })
   }

})

router.post('/:groupId/venues', requireAuth, handleValidationErrors, async (req, res) => {
   const groupId = req.params.groupId

   const {address, city, state, lat, lng} = req.body

   const group = await Group.findOne({
      where: groupId
   })

   if(group) {
      const venue = await Venue.create({
         groupId,
         address,
         city,
         state,
         lat,
         lng
      })
      res.status(200).json(venue)
   } else {
      res.status(404).json({
         message: "Group couldn't be found",
         statusCode: 404
      })
   }


})




module.exports = router;
