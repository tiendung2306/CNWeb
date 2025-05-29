'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    userId: {
      type: DataTypes.INTEGER,
      references: { model: 'Users', key: 'id' },
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Preparing', 'Delivering', 'Completed'),
      defaultValue: 'Pending',
    },
    orderDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deliveryAddress: {
      type: DataTypes.STRING,
    },
  }, {});
  Order.associate = function(models) {
    Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'orderItems' });
    Order.hasOne(models.Payment, { foreignKey: 'orderId', as: 'payment' });
  };
  return Order;
};
