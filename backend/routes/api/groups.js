const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, GroupImage, Venue, Membership, Event, Attendee, EventImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')

const router = express.Router();

//************POST Create a Group*****************/
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
      status: "host"
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

/*************GET All Groups*******************/
router.get('/', async (req, res) => {
   let Groups = []

   const group = await Group.findAll(
      {
      order: [['id', 'DESC']]}
      );



   for (let i = 0; i < group.length; i++) {
      let data = {};

      let eachGroup = group[i];

      let previewimage = await GroupImage.findOne({
         where: {
            groupId: eachGroup.id
         }
      })
      if (previewimage) {
         urlImage = previewimage.url
      } else {
         urlImage = "No Image posted"
      }
      let members = await Membership.count({
         where: {
            groupId: eachGroup.id
         }
      })

      data.id = eachGroup.id;
      data.organizerId = eachGroup.organizerId,
         data.name = eachGroup.name,
         data.about = eachGroup.about,
         data.type = eachGroup.type,
         data.private = eachGroup.private,
         data.city = eachGroup.city,
         data.state = eachGroup.state,
         data.createdAt = eachGroup.createdAt,
         data.updatedAt = eachGroup.updatedAt,
         data.numMembers = members,
         data.previewImage = urlImage

      Groups.push(data)
   }
   
   res.json({ Groups })
})

/********GET All Groups (joined/organized) By Current User***********/
router.get('/current', requireAuth, async (req, res) => {
   const id = req.user.id

   const allGroups = []

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

   if (member && !organizedGroups) {
      for (let i = 0; i < member.length; i++) {
         let membership = member[i]
         let groupId = membership.groupId
         let group = await Group.findOne({
            where: { groupId }
         })
         let previewimage = await GroupImage.findOne({
            where: {
               groupId
            }
         })
         if (previewimage) {
            urlImage = previewimage.url
         } else {
            urlImage = "No Image posted"
         }
         let members = await Membership.count({
            where: {
               groupId
            }
         })

         let data = {}
         data.id = group.id,
            data.organizerId = group.organizerId,
            data.name = group.name,
            data.about = group.about,
            data.type = group.type,
            data.private = group.private,
            data.city = group.city,
            data.state = group.state,
            data.createdAt = group.createdAt,
            data.updatedAt = group.updatedAt,
            data.numMembers = members,
            data.previewImage = urlImage

         allGroups.push(data)
      }
   }


   if (organizedGroups) {
      for (let i = 0; i < organizedGroups.length; i++) {
         let data = {}
         let group = organizedGroups[i]
         let groupId = group.id

         let previewimage = await GroupImage.findOne({
            where: {
               groupId
            }
         })
         if (previewimage) {
            urlImage = previewimage.url
         } else {
            urlImage = "No Image posted"
         }
         let members = await Membership.count({
            where: {
               groupId
            }
         })

         data.id = group.id,
            data.organizerId = group.organizerId,
            data.name = group.name,
            data.about = group.about,
            data.type = group.type,
            data.private = group.private,
            data.city = group.city,
            data.state = group.state,
            data.createdAt = group.createdAt,
            data.updatedAt = group.updatedAt,
            data.numMembers = members,
            data.previewImage = urlImage

         allGroups.push(data)
      }
   }

   res.json({ Groups: allGroups })
})


/******GET Details of a Group By Id****************/
router.get('/:groupId', async (req, res) => {
   const groupId = req.params.groupId

   const countMembers = await Membership.count({
      where: { groupId }
   })

   const group = await Group.findOne({
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

   group.dataValues.numMembers = countMembers


   if (group) {
      res.json(group)
   } else {
      const err = new Error("Group couldn't be found")
      err.status = 404
      res.json({
         message: err.message,
         statusCode: err.status
      })
   }

})

/*******POST Add an Image to a Group*********************/
router.post('/:groupId/images', requireAuth, async (req, res) => {
   const groupId = req.params.groupId;

   const user = req.user.id

   const group = await Group.findByPk(groupId)

   let data = {};

   if (group) {
      if (user === group.organizerId) {
         const { url, preview } = req.body
         const addImage = await GroupImage.create({
            groupId,
            url,
            preview
         })
         data.id = addImage.id,
            data.url = addImage.url,
            data.preview = addImage.preview
         res.json(data)
      } else {
         const err = new Error("Forbidden")
         err.status = 403
         res.json({
            message: err.message,
            statusCode: err.status
         })
      }

   } else {
      res.json({
         message: "Group couldn't be found",
         statusCode: 404
      })
   }
})

/***********PUT Edit a Group*******************/
router.put('/:groupId', requireAuth, async (req, res) => {

   const groupId = req.params.groupId

   const user = req.user.id

   const { name, about, type, private, city, state } = req.body

   const group = await Group.findOne({
      where: { id: groupId }
   })

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
         const err = new Error("Forbidden")
         err.status = 403
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

/*************DELETE a Group*****************/
router.delete('/:groupId', requireAuth, async (req, res) => {

   const groupId = req.params.groupId

   const group = await Group.findByPk(groupId)

   const organizer = req.user.id

   if (group) {
      if (organizer === group.organizerId) {
         await group.destroy();
         return res.json({
            message: "Successfully deleted",
            statusCode: 200
         })
      } else {
         const err = new Error("Forbidden")
         err.status = 403
         res.json({
            message: err.message,
            statusCode: err.status
         })
      }

   } else {
      res.json({
         message: "Group couldn't be found",
         statusCode: 404
      })
   }

})

/***********************VENUES***************************/

/**********GET All Venues for a Group******************/
router.get('/:groupId/venues', requireAuth, async (req, res) => {
   const groupId = req.params.groupId

   const user = req.user.id

   const group = await Group.findOne({
      where: {
         id: groupId
      }
   })
   if (group) {
      const member = await Membership.findOne({
         where: {
            userId: user,
            groupId
         }
      })

      const venues = await Venue.findAll({
         where: { groupId },
         attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
      })
      if (venues) {
         if (user === group.organizerId || member.status === 'co-host') {
            res.json({ Venues: venues })
         } else {
            const err = new Error("Forbidden")
            err.status = 403
            res.json({
               message: err.message,
               statusCode: err.status
            })
         }

      } else {
         const err = new Error("Venue counldn't be found")
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

/********POST Create a Venue for a Group***************/
router.post('/:groupId/venues', requireAuth, handleValidationErrors, async (req, res) => {
   const groupId = req.params.groupId

   const user = req.user.id

   const { address, city, state, lat, lng } = req.body

   const group = await Group.findOne({
      where: {
         id: groupId
      }
   })

   if (group) {
      const member = await Membership.findOne({
         where: {
            userId: user,
            groupId
         }
      })
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
         const err = new Error("Forbidden")
         err.status = 403
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


/************GET All Events by Group ID***********/
router.get('/:groupId/events', async (req, res) => {
   const groupId = req.params.groupId

   let Events = []

   const group = await Group.findOne({
      where: {
         id: groupId
      }
   })
   if (group) {
      const events = await Event.findAll({
         where: { groupId },
         attributes: ['id', 'groupId', 'venueId', 'name', 'type', 'startDate', 'endDate'],
         include: [
            {
               model: Group,
               attributes: ['id', 'name', 'city', 'state']
            },
            {
               model: Venue,
               attributes: ['id', 'city', 'state']

            }]
      })
      if (events) {
         for (let i = 0; i < events.length; i++) {
            let event = events[i]
            let eventId = event.id
            let data = event.toJSON()

            let previewimage = await EventImage.findOne({
               where: {
                  eventId
               }
            })
            if (!previewimage) {
               urlImage = "No Image posted"
            } else {
               urlImage = previewimage.url

            }

            let attending = await Attendee.count({
               where: {
                  eventId
               }
            })
            data.numAttending = attending,
               data.previewImage = urlImage


            Events.push(data)
         }

         res.json({ Events })

      } else {
         res.status(404).json({
            message: "Event couldn't be found",
            statusCode: 404
         })
      }

   } else {
      const err = new Error("Group couldn't be found")
      err.status = 404
      return res.json({
         message: err.message,
         statusCode: err.satus
      })
   }
})

/*************POST Create an Event by Group ID***********/
router.post('/:groupId/events', requireAuth, handleValidationErrors, async (req, res) => {
   const groupId = req.params.groupId

   const user = req.user.id

   const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body

   // if(!venueId) {
   //    const err = new Error("Validation Error")
   //    err.status = 400
   //    err.errors = {venueId: "Venue does not exist"}
   //    res.json({
   //       message: err.message,
   //       statusCode: err.status,
   //       errors: err.errors
   //    })
   // }
   const group = await Group.findByPk(groupId)

   const member = await Membership.findOne({
      where: {
          userId: user,
          groupId
      }

   })

   if (group) {
      if (user === group.organizerId || member.status === 'co-host') {

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

         let data = {}
         data.id = createEvent.id,
            data.groupId = createEvent.groupId,
            data.venueId = createEvent.venueId,
            data.name = createEvent.name,
            data.type = createEvent.type,
            data.capacity = createEvent.capacity,
            data.price = createEvent.price,
            data.description = createEvent.description,
            data.startDate = createEvent.startDate,
            data.endDate = createEvent.endDate

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
      const err = new Error("Group couldn't be found")
      err.status = 404
      res.json({
         message: err.message,
         statusCode: err.status
      })
   }
})

/*********************MEMBERSHIPS***************************/

/**************POST Request Membership to a Group*********/
router.post('/:groupId/membership', requireAuth, async (req, res) => {
   const groupId = req.params.groupId

   const group = await Group.findByPk(groupId)

   const user = req.user.id

   if (group) {
      const member = await Membership.findOne({
         userId: user,
         groupId
      })
      if (member && member.status === "pending") {
         const err = new Error("Membership has already been requested")
         err.status = 400
         res.json({
            message: err.message,
            statusCode: err.status
         })
      } else if (member && member.status === 'member') {
         const err = new Error("User is already a member of the group")
         err.status = 400
         res.json({
            message: err.message,
            statusCode: err.status
         })
      } else {
         const newMember = await Membership.create({
            userId: user,
            groupId,
            status: "pending"
         })
         let data = {}
         data.memberId = newMember.userId,
            data.status = newMember.status
         res.status(200).json(data)
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

/*********PUT Change Membership Status*************/
router.put('/:groupId/membership', requireAuth, async (req, res) => {
   const groupId = req.params.groupId

   const { memberId, status } = req.body

   const group = await Group.findByPk(groupId)

   const user = req.user.id

   if (group) {
      const organizer = group.organizerId
      const authorizedMember = await Membership.findOne({
         where: {
            userId: user,
            groupId
         }
      })
      const member = await Membership.findOne({
         where: {
            userId: memberId,
            groupId
         }
      })
      if (member) {
         if (user === organizer || authorizedMember.status === 'co-host') {
            if (member.status === 'pending' && status === 'member') {
               await member.update({
                  userId: memberId,
                  groupId,
                  status
               })
               member.save()
               let singleMember = {}
               singleMember.id = member.id,
                  singleMember.groupId = member.groupId,
                  singleMember.memberId = member.userId,
                  singleMember.status = member.status

               res.json(singleMember)

            }
            if (member.status === 'member' && status === 'pending') {
               err = new Error("Validation Error"),
               err.status = 400
               err.errors = {status: "Cannot change a membership status to pending"}
               res.json({
                  message: err.message,
                  statusCode: err.status,
                  errors: err.errors
               })
            }
         }
      } else {
         const err = new Error("Validation Error")
         err.status = 400
         err.errors = { memberId: "User couldn't be found" }
         res.json({
            message: err.message,
            statusCode: err.status,
            errors: err.errors
         })
      }
   } else {
      const err = new Error("Membership between the user and the group does not exist")
      err.status = 404
      res.json({
         message: err.message,
         statusCode: err.status
      })
   }
})

/**************GET Members of Group by ID************/
router.get('/:groupId/members', async (req, res) => {

   const user = req.user.id

   const groupId = req.params.groupId

   let allMembersArray = []
   let someMembersArray = []

   const allMembers = await Membership.findAll({
      where: { groupId },
      attributes: ['status'],
      include: {
         model: User,
         attributes: ['id', 'firstName', 'lastName']
      }
   })
   for (let i = 0; i < allMembers.length; i++) {
      let data = {};
      let oneMember = allMembers[i];
      data.id = oneMember.User.id
      data.firstName = oneMember.User.firstName
      data.lastName = oneMember.User.lastName
      data.Membership = {}
      data.Membership.status = oneMember.dataValues.status
      allMembersArray.push(data)
   }

   const someMembers = await Membership.findAll({
      where: {
         [Op.and]: {
            groupId,
            status: { [Op.notLike]: '%pending%' }
         }
      },
      attributes: ['status'],
      include: {
         model: User,
         attributes: ['id', 'firstName', 'lastName']
      }
   })
   for (let i = 0; i < someMembers.length; i++) {
      let data = {};
      let oneMember = allMembers[i];
      data.id = oneMember.User.id
      data.firstName = oneMember.User.firstName
      data.lastName = oneMember.User.lastName
      data.Membership = {}
      data.Membership.status = oneMember.dataValues.status
      someMembersArray.push(data)
   }

   const group = await Group.findByPk(groupId)
   const coHost = await Membership.findOne({
      where: {
         userId: user,
         groupId
      }
   })

   if (group) {
      if (user === group.organizerId || coHost.status === 'co-host') {
         res.status(200).json({ Members: allMembersArray })
      } else {
         res.status(200).json({ Members: someMembersArray })
      }

   } else {
      res.status(200).json({
         message: "Group couldn't be found",
         statusCode: 404
      })
   }
})



/**********DELETE a Membership************/
router.delete('/:groupId/membership', requireAuth, async (req, res) => {
   const groupId = req.params.groupId

   const group = await Group.findByPk(groupId)

   const user = req.user.id

   const { memberId } = req.body

   if (group) {
      const host = await Membership.findOne({
         where: {
            userId: user,
            groupId
         }
      })

      const member = await Membership.findOne({
         where: {
            userId: memberId,
            groupId
         }
      })
      if (member) {
         if (user === memberId || host.status === 'host') {
            await member.destroy()
            res.status(200).json({ message: "Successfully deleted membership from group" })
         } else {
            const err = new ValidationError("Validation Error")
            err.status = 400
            res.json({
               message: err.message,
               statusCode: err.status,
               errors: {
                  memberId: "User couldn't be found"
               }

            })
         }
      } else {
         const err = new Error("Membership does not exist for this User")
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


module.exports = router;
