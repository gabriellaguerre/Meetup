'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {

    static associate(models) {
      Event.belongsToMany(models.User, {
        through: models.Attendee,
        foreignKey: 'eventId',
        otherKey: 'userId'
      })
      Event.belongsTo(models.Group, {
        foreignKey: 'groupId'
      })
      Event.belongsTo(models.Venue, {
        foreignKey: 'venueId'
      })
      Event.hasMany(models.EventImage, {
        foreignKey: 'eventId'
      })
      Event.hasMany(models.Attendee, {
        foreignKey: 'eventId'
      })
    }
  }
  Event.init({
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        checkVenueId(value) {
          if(value === null) {
            throw new Error("Venue does not exist")
          }
        }
      }
    },
    groupId: DataTypes.INTEGER,

    name: {
      type: DataTypes.STRING,
      validate: {
        checkLength(value) {
          if(value.length < 5) {
            throw new Error("*Name must be at least 5 characters")
          }
        },
        checkTooLong(value) {
          if(value.length > 60) {
            throw new Error("*Name must be 60 characters or less")
          }
        }
      }

    },
    type: {
      type: DataTypes.STRING,
      validate: {
        checkType(value) {
          if(!(value === "In person" || value === "Online")) {
            throw new Error("*Type must be Online or In person")
          }
        }
      }

    },
    capacity: {
      type: DataTypes.INTEGER,
      validate: {
        checkInteger(value) {
          if(!(Number.isInteger(value))) {
            throw new Error("*Capacity must be an integer")
          }
        }
      }

    },
    price: {
      type: DataTypes.NUMERIC,
      validate: {
        isNumeric: true,
        checkPrice(value) {
          if(typeof value !== 'number') {
            throw new Error("*Price is invalid")
          }
        }
      }

    },
    description: {
      type: DataTypes.STRING,
      validate: {
        checkDescription(value) {
          if(value.length < 50) {
            throw new Error("*Description needs to have a minimum of 50 characters")
          }
        }
      }

    },
    startDate: {
      type: DataTypes.DATE,
      validate: {
        checkStartDate(value) {
          let date = Date.now()
          let startingDate = Date.parse(value)
          if(startingDate < date) {
            throw new Error("*Start date must be in the future")
          }
        }
      }

    },
    endDate: {
      type: DataTypes.DATE,
      validate: {
        checkEndDate(value) {
          let startDate = Date.parse(this.startDate)
          let endingDate = Date.parse(value)
          if(endingDate < startDate) {
            throw new Error("*End date cannot be before the start date")
          }
        }
      }

    },

    startTime: {
      type: DataTypes.TIME,
      // validate: {
      //   checkTime(value) {
      //     let re = /^(0[1-9]|1[0-2]):[0-5][0-9]([ap]m)?$/;
      //     let updateValue = value.replace(/\s/g, "");
      //     let newValue = updateValue.toLowerCase();
      //     if(!re.test(newValue)) {
      //       throw new Error("*Use format MM/DD/YYYY, HH:mm AM/PM")
      //     }
      //   }
      // }
    },

    endTime: {
      type: DataTypes.TIME,
      // validate: {
      //   checkTime(value) {
      //     let re = /^(0[1-9]|1[0-2]):[0-5][0-9]([ap]m)?$/;
      //     let updateValue = value.replace(/\s/g, "");
      //     let newValue = updateValue.toLowerCase();
      //     if(!re.test(newValue)) {
      //       throw new Error("*Use format MM/DD/YYYY, HH:mm AM/PM")
      //     }
      //   }
      // }
    },

    eventImg: {
      type: DataTypes.STRING,
      validate: {
        checkLength(value) {
          if(value.length > 255) {
            throw new Error('*Image address is too long')
          }
        }
      }
    },

  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
