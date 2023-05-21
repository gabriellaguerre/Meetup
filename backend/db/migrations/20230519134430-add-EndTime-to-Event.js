'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Events', 'endTime', {

      type: Sequelize.TIME,

    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Events";
    await queryInterface.removeColumn(options);
  }
};
