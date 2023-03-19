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
   const { name, about, type, private, city, state } = req.body

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
         { model: GroupImage },
         { model: User, as: 'Organizer' },
         { model: Venue }
      ]
   })
   res.json(group)
})

router.post('/:groupId/images', requireAuth, async (req, res) => {
   const groupId = req.params.groupId;

   const group = await Group.findByPk(groupId)

   let data = {};

   if (group) {
      const { url, preview } = req.body
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

   const { name, about, type, private, city, state } = req.body

   const group = await Group.findOne({
      where: groupId
   })

   if (group) {
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
   } else {
      res.json({
         message: "Group couldn't be found",
         statusCode: 404
      })
   }
})

router.delete('/:groupId', requireAuth, async (req, res) => {
   const groupId = req.params.groupId

   const group = await Group.findByPk(groupId)

   if (group) {
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

/***********************VENUES***************************/
router.get('/:groupId/venues', requireAuth, async (req, res) => {
   const groupId = req.params.groupId

   const venues = await Venue.findAll({
      where: groupId
   })
   if (venues) {
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

   const { address, city, state, lat, lng } = req.body

   const group = await Group.findOne({
      where: groupId
   })

   if (group) {
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

/********************EVENTS*********************/

router.get('/:groupId/events', async (req, res) => {
   const groupId = req.params.groupId

   const events = await Event.findAll({
      where: groupId,
      include: [
         {
            model: Group
         },
         {
            model: Venue

         }]
   })
   if (events) {
      res.status(200).json(events)
   } else {
      res.status(404).json({
         message: "Group couldn't be found",
         statusCode: 404
      })
   }
})

router.post('/:groupId/events', requireAuth, handleValidationErrors, async (req, res) => {
   const groupId = req.params.groupId

   const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body

   const group = await Group.findByPk(groupId)

   if (group) {
      const createEvent = await Event.create({
         groupId,
         venueId,
         name,
         type,
         capacity,
         price,
         description,
         startDate,
         endDate
      })
      res.status(200).json(createEvent)
   } else {
      res.status(404).json({
         message: "Group couldn't be found",
         statusCode: 404
      })
   }
})

/*********************MEMBERSHIPS***************************/

router.get('/:groupId/members', async (req, res) => {

   const groupId = req.params.groupId

   const allMembers = await Membership.findAll({
      where: groupId
   })

   const someMembers = await Membership.findAll({
      where: {
         [Op.and]: {
            groupId,
            status: { [Op.notLike]: '%pending%' }
         }
      }

   })

   const group = await Group.findByPk(groupId)
   const coHost = await Membership.findOne({
      where: {
         status: "co-host"
      }
   })

   if (group) {
      if (req.user.id === group.organizerId || req.user.id === coHost.userId) {
         res.status(200).json(allMembers)
      } else {
         res.status(200).json(someMembers)
      }

   } else {
      res.status(200).json({
         message: "Group couldn't be found",
         statusCode: 404
      })
   }
})

router.post('/:groupId/membership', requireAuth, async (req, res) => {
   const groupId = req.params.groupId

   const group = await Group.findByPk(groupId)

   const user = req.user.id

   const members = await Membership.findAll({
      where: groupId
   })

   const member = await members.findOne({
      where: {
         userId: user
      }
   })

   if (group) {
      if (!member) {
         await members.create({
            userId: user,
            groupId,
            status: "pending"
         })
         res.status(200).json({
            id: { as: 'memberId' },
            status: "pending"
         })
      } else if (member && member.status === "pending") {
         res.statusCode(400).json({
            message: "Membership has already been requested",
            statusCode: 400
         })
      } else if (member && member.status === 'member') {
         res.statusCode(400).json({
            message: "User is already a member of the group",
            statusCode: 400
         })
      }
   } else {
      res.status(404).json({
         message: "Group couldn't be found",
         statusCode: 404
      })
   }
})

router.put('/:groupId/membership', requireAuth, async (req, res) => {
   const groupId = req.params.groupId

   const group = await Group.findByPk(groupId)

   const user = req.user.id

   const { status } = req.body

   const members = await Membership.findAll({
      where: groupId
   })

   const member = await members.findOne({
      where: {
         userId: user
      }
   })

   if (members) {
      if (group && member) {
         if (member.status === 'member' && status === 'pending') {
            res.status(400).json({
               message: "Validations Error",
               statusCode: 400,
               errors: {
                  status: "Cannot change a membership status to pending"
               }
            })
         }
         if (member.userId === group.organizerId || member.status === "co-host") {
            await member.update({
               user: { as: "memberId" },
               status
            })
            member.save()
            res.status(200).json(member)
         }
      } else {
         res.status(400).json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
               memberId: "User couldn't be found"
            }
         })
      }
   } else {
      res.status(404).json({
         message: "Membership between the user and the group does not exits",
         statusCode: 404
      })
   }
})

router.delete('/:groupId/membership', requireAuth, async (req, res) => {
   const groupId = req.params.groupId

   const group = await Group.findByPk(groupId)

   const user = req.user.id

   const { memberId } = req.body

   const members = await Membership.findAll({
      where: groupId
   })

   const member = await members.findOne({
      where: {
         userId: user
      }
   })
   if(!member) {
      res.json({
         message: "Membership does not exist for this User",
         statusCode: 404
      })
   }

   if (group) {
      if (member) {
         if (member.userId === group.organizerId || member.status === "co-host" || member.userId === memberId) {
            await member.destroy()
            res.status(200).json({ message: "Successfully deleted membership from group" })
         }
      } else {
         const err = new ValidationError("Validatio Error")
         err.statusCode = 400
         return res.json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
              memberId: "User couldn't be found"
            }

         })
      }
   } else {
      res.status(404).json({
         message: "Group couldn't be found",
         statusCode: 404
      })
   }



})


module.exports = router;
