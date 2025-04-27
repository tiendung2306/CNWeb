'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {});
  Category.associate = function(models) {
    Category.belongsToMany(models.MenuItem, {
      through: 'MenuItemsCategory',
      foreignKey: 'categoryId',
      as: 'menuItems',
    });
  };
  return Category;
};
