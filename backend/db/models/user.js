'use strict';

const bcrypt = require('bcryptjs')

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    toSafeObject() {
      const { id, firstName, lastName, username, email } = this;
      return { id, firstName, lastName, username, email };
    }
    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    }
    static getCurrentUserById(id) {
      return User.scope("currentUser").findByPk(id);
    }
    static async login({ credential, password }) {
      const { Op } = require('sequelize');
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });
      if (user && user.validatePassword(password)) {
        return await User.scope('currentUser').findByPk(user.id);
      }
    }
    static async signup({ firstName, lastName, email, username, password }) {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        firstName,
        lastName,
        email,
        username,
        hashedPassword
      });
      return await User.scope('currentUser').findByPk(user.id);
    }
    static associate(models) {
      User.belongsToMany(models.Group, {
        through: models.Membership,
        foreignKey: 'userId',
        otherKey: 'groupId'
      })

      User.hasMany(models.Membership, {
        foreignKey: 'userId'
      })

      User.hasMany(models.Group, {
        foreignKey: 'organizerId',
        as: 'Organizer'
      })
      User.belongsToMany(models.Event, {
        through: models.Attendee,
        foreignKey: 'userId',
        otherKey: 'eventId'
      })
      User.hasOne(models.Attendee, {
        foreignKey: 'userId'
      })
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        checkLength(value) {
          if (value.length > 30) {
            throw new Error("*First name must be less than 30 characters")
          }
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        checkLength(value) {
          if (value.length > 30) {
            throw new Error("*Last name must be less than 30 characters")
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 256],
        isEmail: true,
        checkLength(value) {
          if (value.length > 255) {
            throw new Error("*Email must be less than 255 characters")
          }
        }

      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        checkUser(value) {
          if (value.includes('@') || value.includes('.com')) {
            throw new Error("Username cannot be an email")
          }
        },
        checkLength(value) {
          if (value.length > 30) {
            throw new Error("*Name must be less than 30 characters")
          }
        }

      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    },
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword', 'createdAt', 'updatedAt']
      }
    },
    scopes: {
      currentUser: {
        attributes: {
          exclude: ['hashedPassword']
        }
      },
      loginUser: {
        attributes: {
          include: ['id', 'firstName', 'lastName', 'email', 'username']
        }
      }
    }
  });
  return User;
};
