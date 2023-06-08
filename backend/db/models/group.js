'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Group.belongsToMany(models.User, {
        through: models.Membership,
        foreignKey: 'groupId',
        otherKey: 'userId',
      })

      Group.belongsTo(models.User, {
        foreignKey: 'organizerId',
        as: 'Organizer'
      })
      Group.hasMany(models.Event, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
        hooks: true
      })
      Group.hasMany(models.Venue, {
        foreignKey: 'groupId'
      })
      Group.hasMany(models.GroupImage, {
        foreignKey: 'groupId'
      })
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        checkLength(value) {
          if (value.length > 60) {
            throw new Error('*Name must be 60 characters or less')
          }
        },
        checkEmptyString(value) {
          if(value.length === 0) {
            throw new Error('*Name cannot be empty')
          }
        }
      }
    },
    about: {
      type: DataTypes.STRING,
      validate: {
        checkLength(value) {
          if (value.length < 50) {
            throw new Error('*About must be 50 characters or more')
          }
        }
      }
    },
    type: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [['Online', 'In Person']],
          msg: "*Type must be 'Online' or 'In Person'"
        }
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
      validate: {
        checkType(value) {
          if (typeof value !== 'boolean') {
            throw new Error('*Private must be a boolean')
          }
        }
      }

    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        checkCity(value) {
          if(value.length === 0) {
            throw new Error('*City is required')
          }
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        checkCity(value) {
          if(value.length === 0) {
            throw new Error('*State is required')
          }
        }
      }
    },
    groupImg: {
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
    modelName: 'Group',
    defaultScope: {
      attributes: {
        include: ['createdAt', 'updatedAt']
      }
    }
  });
  return Group;
};
