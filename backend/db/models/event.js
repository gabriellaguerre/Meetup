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
    }
  }
  Event.init({
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
            throw new Error("Name must be at least 5 characters")
          }
        }
      }

    },
    type: {
      type: DataTypes.STRING,
      validate: {
        checkType(value) {
          if(!(value === "In person" || value === "Online")) {
            throw new Error("Type must be Online or In person")
          }
        }
      }

    },
    capacity: {
      type: DataTypes.INTEGER,
      validate: {
        checkInteger(value) {
          if(!(Number.isInteger(value))) {
            throw new Error("Capacity must be an integer")
          }
        }
      }

    },
    price: {
      type: DataTypes.NUMERIC,
      validate: {
        checkPrice(value) {
          if(typeof value !== 'number') {
            throw new Error("Price is invalid")
          }
        }
      }

    },
    description: {
      type: DataTypes.STRING,
      validate: {
        checkDescription(value) {
          if(value.length === 0) {
            throw new Error("Description is required")
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
            throw new Error("Start date must be in the future")
          }
        }
      }

    },
    endDate: {
      type: DataTypes.DATE,
      validate: {
        checkEndDate(value) {
          let endingDate = Date.parse(value)
          if(endingDate < this.startingDate) {
            throw new Error("End date is less than start date")
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
