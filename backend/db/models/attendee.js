'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendee extends Model {

    static associate(models) {
      Attendee.belongsTo(models.User, {
        foreignKey: 'userId'
      })
      Attendee.belongsTo(models.Event, {
        foreignKey: 'eventId'
      })
    }
  }
  Attendee.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    eventId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Attendee',
  });
  return Attendee;
};
