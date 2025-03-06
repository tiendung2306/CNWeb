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
  }, {});
  MenuItem.associate = function(models) {
    MenuItem.hasMany(models.OrderItem, { foreignKey: 'menuItemId' });
    MenuItem.hasMany(models.Review, { foreignKey: 'menuItemId' });
  };
  return MenuItem;
};
