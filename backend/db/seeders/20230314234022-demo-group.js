'use strict';

let options = {};
if(process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    return queryInterface.bulkInsert(options, [
      {
      organizerId: 1,
      name: "Evening Tennis on the Water",
      about: "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
      type: "In person",
      private: true,
      city: "New York",
      state: "NY"
   },
   {
      organizerId: 1,
      name: "Swimming across Lake Cool-Waters",
      about: "Come join us in swimming across this fantastic lake. Singles or doubles.",
      type: "In person",
      private: true,
      city: "New York",
      state: "NY"
   },
   {
      organizerId: 2,
      name: "Chess mini championship",
      about: "Enjoy rounds of chess with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
      type: "In person",
      private: true,
      city: "New York",
      state: "NY"
   }])
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Evening Tennis on the Water', 'Swimming across Lake Cool-Waters', 'Chess mini championship'] }
    }, {});
  }
};

