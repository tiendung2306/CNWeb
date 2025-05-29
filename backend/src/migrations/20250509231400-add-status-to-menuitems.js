'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Thêm cột status kiểu ENUM
    await queryInterface.addColumn('MenuItems', 'status', {
      type: Sequelize.ENUM('available', 'unavailable'),
      allowNull: false,
      defaultValue: 'available',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Xóa cột status
    await queryInterface.removeColumn('MenuItems', 'status');
    // Xóa type ENUM khỏi DB (Postgres)
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_MenuItems_status";');
  }
};
