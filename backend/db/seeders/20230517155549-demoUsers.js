'use strict';
const bcrypt = require('bcryptjs')

let options = {};
if(process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // async up (queryInterface, Sequelize) {

  // //  await queryInterface.bulkInsert('Users', [
  // //   {

  // //   },{},{}])
  // },
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        firstName: "Demo",
        lastName: "User",
        email: "demo@user.com",
        username: "DemoUser",
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: "Johnny",
        lastName: "Smith",
        email: "john.smith@gmail.com",
        username: "johnnysmith",
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: "Gabriel",
        lastName: "Laguerre",
        email: "gabriel.laguerre@gmail.com",
        username: "gabriel",
        hashedPassword: bcrypt.hashSync('password')
      }


    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['DemoUser', 'johnnysmith', 'gabriel'] }
    }, {});
  }
};
