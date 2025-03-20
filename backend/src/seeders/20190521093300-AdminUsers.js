

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Users',
    [
      {
        username: 'Admin',
        email: 'admin@gmail.com',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        role: "admin",
      },
      {
        username: 'User',
        email: 'user@gmail.com',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        role: "user",
      },
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {}),
};
