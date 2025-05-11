'use strict';
module.exports = (sequelize, DataTypes) => {
  const MenuItem = sequelize.define('MenuItem', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM('available', 'unavailable'),
      allowNull: false,
      defaultValue: 'available',
    },
  }, {});
  MenuItem.associate = function(models) {
    MenuItem.hasMany(models.OrderItem, { foreignKey: 'menuItemId', as: 'orderItems' });
    MenuItem.hasMany(models.Review, { foreignKey: 'menuItemId', as: 'reviews' });
    MenuItem.belongsToMany(models.Category, {
      through: 'MenuItemsCategory',
      foreignKey: 'menuItemId',
      as: 'categories',
    });
  };
  return MenuItem;
};
