'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Orders', // Tên bảng Orders
        key: 'id',
      },
    },
    menuItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'MenuItems', // Tên bảng MenuItems
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  }, {});
  
  OrderItem.associate = function(models) {
    // Liên kết với bảng Orders
    OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });
    
    // Liên kết với bảng MenuItems
    OrderItem.belongsTo(models.MenuItem, { foreignKey: 'menuItemId' });
  };
  
  return OrderItem;
};
