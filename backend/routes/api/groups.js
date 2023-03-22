const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, GroupImage, Venue, Membership, Event, Attendee } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')

const router = express.Router();

//************Create a Group*****************/
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
   await Membership.create({
      userId: userId,
      groupId: newGroup.id,
      status: "member"
   })

   let data = {};

   data.id = newGroup.id,
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

/*************Get All Groups*******************/
router.get('/', async (req, res) => {
   const group = await Group.findAll();
   res.json(group)
})

/********Get All Groups By Current User***********/
router.get('/current', requireAuth, async (req, res) => {
   const id = req.user.id
   const group = []

   const member = await Membership.findAll({
      where: {
         userId: id
      }
   })

   const organizedGroups = await Group.findAll({
      where: {
         organizerId: id
      }
   })
   group.push(member)
   group.push(organizedGroups)

   res.json({ Groups: group })
})


/******Get Details of a Group By Id****************/
router.get('/:groupId', async (req, res) => {
   const groupId = req.params.groupId

   const group = await Group.findAll({
      where: {
         id: groupId
      },
      attributes: ['id', 'organizerId', 'name', 'about', 'type', 'private', 'city', 'state', 'createdAt', 'updatedAt'],
      include: [
         {
            model: GroupImage,
            attributes: ['id', 'url', 'preview']
         },
         {
            model: User, as: 'Organizer',
            attributes: ['id', 'firstName', 'lastName']
         },
         { model: Venue },
      ],
   })

   const countMembers = await Membership.findAll({
      where: { groupId }
   })

   if (group) {
      res.json({ Groups: group })
   } else {
      const err = new Error("Group couldn't be found")
      err.status = 404
      res.json({
         message: err.message,
         statusCode: err.status
      })
   }
   //group.numMembers = countMembers

   console.log(countMembers)
   res.json({ Groups: group })
})

/*******Add an Image to a Group*********************/
router.post('/:groupId/images', requireAuth, async (req, res) => {
   const groupId = req.params.groupId;

   const group = await Group.findByPk(groupId)

   let data = {};

   if (group) {
      const { url, preview } = req.body
      const addImage = await GroupImage.create({
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

/***********Edit a Group*******************/
router.put('/:groupId', requireAuth, async (req, res) => {
   const groupId = req.params.groupId

   const user = req.user.id

   const { name, about, type, private, city, state } = req.body

   const group = await Group.findOne({
      where: { id: groupId }
   })


   // if(!group) {
   //    const err = new Error("Group couldn't be found")
   //    err.status = 404
   //    res.json({
   //       message: err.message,
   //       statusCode: err.status
   //    })
   //}
   if (group) {
      if (group.organizerId === user) {
         const update = await group.update({
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
         const err = new Error("You are not the organizer of this group")
         err.status = 400
         res.json({
            message: err.message,
            statusCode: err.status
         })
      }

   } else {
      const err = new Error("Group couldn't be found")
      err.status = 404
      res.json({
         message: err.message,
         statusCode: err.status
      })
   }
})

/*************Delete a Group*****************/
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

/**********Get All Venues for a Group******************/
router.get('/:groupId/venues', requireAuth, async (req, res) => {
   const groupId = req.params.groupId

   const venues = await Venue.findAll({
      where: { groupId },
      attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
   })
   if (venues) {
      res.json({ Venues: venues })
   } else {
      const err = new Error("Venue counldn't be found")
      err.status = 404
      res.json({
         message: err.message,
         statusCode: err.status
      })
   }

})

/********Create a Venue for a Group***************/
router.post('/:groupId/venues', requireAuth, handleValidationErrors, async (req, res) => {
   const groupId = req.params.groupId
   const user = req.user.id


   const member = await Membership.findOne({
      where: {
         userId: user,
         groupId
      }
   })

   const { address, city, state, lat, lng } = req.body

   const group = await Group.findOne({
      where: {
         id: groupId
      }
   })

   if (group) {
      if (user === group.organizerId || member.status === "co-host") {
         const venue = await Venue.create({
            groupId,
            address,
            city,
            state,
            lat,
            lng
         })
         const newVenue = {};
         newVenue.id = venue.id
         newVenue.groupId = venue.groupId
         newVenue.address = venue.address
         newVenue.city = venue.city
         newVenue.state = venue.state
         newVenue.lat = venue.lat
         newVenue.lng = venue.lng
         
         res.status(200).json(newVenue)
      } else {
         const err = new Error("You are not authorized to create a venue for this group")
         err.status = 400
         res.json({
            message: err.message,
            statusCode: err.status
         })
      }

   } else {
      const err = new Error("Group couldn't be found")
      err.status = 404
      res.json({
         message: err.message,
         statusCode: err.status
      })
   }
})

/********************EVENTS*********************/


/************Get All Events by Group ID***********/
router.get('/:groupId/events', async (req, res) => {
   const groupId = req.params.groupId

   const events = await Event.findAll({
      where: {groupId},
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

/*************Create an Event by Group ID***********/
router.post('/:groupId/events', requireAuth, handleValidationErrors, async (req, res) => {
   const groupId = req.params.groupId

   const user = req.user.id

   const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body

   const group = await Group.findByPk(groupId)

   const member = await Membership.findOne({
      userId: user,
      groupId
   })


   if (group) {
      if(user === group.organizerId || member.status === 'co-host') {

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
      await Attendee.create({
         eventId: createEvent.id,
         userId: user,
         status: "host"
      })
      res.status(200).json(createEvent)
      } else {
         const err = new Error("You are not authorized to create an Event for this Group")
         err.status = 404
         res.json({
            message: err.message,
            statusCode: err.status
         })
      }

   } else {
      const err = new Error("Group couldn't be found")
         err.status = 404
         res.json({
            message: err.message,
            statusCode: err.status
      })
   }
})

/*********************MEMBERSHIPS***************************/

/**************Get Members of Group by ID************/
router.get('/:groupId/members', async (req, res) => {

   const groupId = req.params.groupId

   const allMembers = await Membership.findAll({
      where: {groupId}
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
   const coHost = await Membership.findAll({
      where: {
         groupId,
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


/**************Request Membership to a Group*********/
router.post('/:groupId/membership', requireAuth, async (req, res) => {
   const groupId = req.params.groupId

   const group = await Group.findByPk(groupId)

   const user = req.user.id

   const members = await Membership.findOne({
      where: {
         userId: user,
         groupId
      }
   })

   // const member = await members.findOne({
   //    where: {
   //       userId: user
   //    }
   // })

   if (group) {
      if (!members) {
         await Membership.create({
            userId: user,
            groupId,
            status: "pending"
         })
         res.status(200).json({
            memberId: user,
            status: "pending"
         })
      } else if (members && members.status === "pending") {
         const err = new Error("Membership has already been requested")
         err.status = 400
         res.json({
            message: err.message,
            statusCode: err.status
         })
      } else if (members && members.status === 'member') {
         const err = new Error("User is already a member of the group")
         err.status = 400
         res.json({
            message: err.message,
            statusCode: err.status
         })
      }
   } else {
         const err = new Error("Group couldn't be found")
         err.status = 404
         res.json({
            message: err.message,
            statusCode: err.status
         })

   }
})

/*********Change Membership Status*************/
router.put('/:groupId/membership', requireAuth, async (req, res) => {
   const groupId = req.params.groupId

   const group = await Group.findByPk(groupId)

   const user = req.user.id

   const { status } = req.body

   const members = await Membership.findOne({
      where: {
         userId: user,
         groupId}
   })

   // const member = await members.findOne({
   //    where: {
   //       userId: user
   //    }
   // })

   if (members) {
      if (group && members) {
         if (members.status === 'member' && status === 'pending') {
            res.status(400).json({
               message: "Validations Error",
               statusCode: 400,
               errors: {
                  status: "Cannot change a membership status to pending"
               }
            })
         }
         if (members.userId === group.organizerId || members.status === "co-host") {
            await members.update({
               memberId: user,
               status
            })
            members.save()
            res.status(200).json(members)
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
         message: "Membership between the user and the group does not exist",
         statusCode: 404
      })
   }
})

/**********Delete a Membership************/
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
   if (!member) {
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
