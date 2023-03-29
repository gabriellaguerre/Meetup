'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Venue.belongsTo(models.Group, {
        foreignKey: 'groupId'
      })
      Venue.hasMany(models.Event, {
        foreignKey: 'venueId'
      })
    }
  }
  Venue.init({
    groupId: DataTypes.INTEGER,
    address: {
      type: DataTypes.STRING,
      validate: {
        checkAddress(value) {
          if(value.length === 0) {
            throw new Error("Street address is required")
          }
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      validate: {
        checkAddress(value) {
          if(value.length === 0) {
            throw new Error("City is required")
          }
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      validate: {
        checkAddress(value) {
          if(value.length === 0) {
            throw new Error("State is required")
          }
        }
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: {
          args: true,
          message: "Latitude is not valid"
        }
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: {
          args: true,
          message: "Longitude is not valid"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Venue',
    defaultScope: {
      attributes: {
        include: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
      }
    }
  });
  return Venue;
};
