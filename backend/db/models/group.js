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
        otherKey: 'userId'
      })

      Group.belongsTo(models.User, {
        foreignKey: 'organizerId'
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
            throw new Error('Name must be 60 characters or less')
          }
        }
      }
    },
    about: {
      type: DataTypes.STRING,
      validate: {
        checkLength(value) {
          if (value.length < 50) {
            throw new Error('About must be 50 characters or more')
          }
        }
      }
    },
    type: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [['Online', 'In person']],
          msg: "Type must be 'Online' or 'In person'"
        }
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
      validate: {
        checkType(value) {
          if (typeof value !== 'boolean') {
            throw new Error('Private must be a boolean')
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
            throw new Error('City is required')
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
            throw new Error('State is required')
          }
        }
      }
    },
    venueId: DataTypes.INTEGER

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
