'use strict';
module.exports = (sequelize, DataTypes) => {
  const MenuItemsCategory = sequelize.define('MenuItemsCategory', {
    menuItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'MenuItems', key: 'id' },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Categories', key: 'id' },
    },
  }, {
    tableName: 'MenuItemsCategory',
  });
  return MenuItemsCategory;
};
