'use strict';

const bcrypt = require('bcryptjs')

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
   toSafeObject() {
    const {id, firstName, lastName, username, email} = this;
    return {id, firstName, lastName, username, email};
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
      // define association here
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 256],
        isEmail: true
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 30],
        checkEmail(value) {
          if (value.includes("@")) {
            throw new Error("Username cannot be an email address")

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
        attributes: {}
      }
    }
  });
  return User;
};
