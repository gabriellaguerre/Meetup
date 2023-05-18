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
      name: "Evening Tennis",
      about: "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
      type: "In person",
      private: true,
      city: "New York",
      state: "NY",
      groupImg: "https://media.istockphoto.com/id/1171084311/photo/tennis-rackets-and-balls-leaned-against-the-net.jpg?s=612x612&w=0&k=20&c=SnDgfU30k0PMfVjSHTv4umDQWwKtUHJ8AEgofJXg6w4="
   },
   {
      organizerId: 1,
      name: "Swimming across Lake Cool-Waters",
      about: "Come join us in swimming across this fantastic lake. Singles or doubles.",
      type: "In person",
      private: true,
      city: "New York",
      state: "NY",
      groupImg: "https://images.pexels.com/photos/518485/pexels-photo-518485.jpeg?cs=srgb&dl=pexels-eberhard-grossgasteiger-518485.jpg&fm=jpg"
   },
   {
      organizerId: 1,
      name: "Chess mini championship",
      about: "Enjoy rounds of chess with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
      type: "In person",
      private: true,
      city: "New York",
      state: "NY",
      groupImg: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hlc3N8ZW58MHx8MHx8&w=1000&q=80"
  },
  {
    organizerId: 1,
    name: "Boat Lovers",
    about: "Come join us in boating across this fantastic lake. Singles or doubles.",
    type: "In person",
    private: true,
    city: "Miami",
    state: "FL",
    groupImg: "https://images.pexels.com/photos/163236/luxury-yacht-boat-speed-water-163236.jpeg?cs=srgb&dl=pexels-pixabay-163236.jpg&fm=jpg",
 },
 {
  organizerId: 1,
  name: "Crocodile Hunters",
  about: "Come join us in hunting down crocodiles by this fantastic lake.",
  type: "In person",
  private: true,
  city: "Tampa",
  state: "FL",
  groupImg:"https://thumbs.dreamstime.com/b/crocodile-isolated-white-19653652.jpg",
}])
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Evening Tennis on the Water'] }
    }, {});
  }
};
