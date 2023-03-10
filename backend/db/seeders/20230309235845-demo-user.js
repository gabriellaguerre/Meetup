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
        firstName: "Gabriel",
        lastName: "Laguerre",
        email: "gus@popo.com",
        username: "Gustolop",
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: "Gabrielo",
        lastName: "Laguerrep",
        email: "gus@popol.com",
        username: "Gustoloper",
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        firstName: "Gabrielle",
        lastName: "Laguirre",
        email: "gusto@popo.com",
        username: "Gustlop",
        hashedPassword: bcrypt.hashSync('password2')
      }

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Gustolop', 'Gustoloper', 'Gustlop'] }
    }, {});
  }
};
