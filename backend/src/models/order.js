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
    },
    orderDate: {
      type: DataTypes.DATE,
    },
    deliveryAddress: {
      type: DataTypes.STRING,
    },
  }, {});
  Order.associate = function(models) {
    Order.belongsTo(models.User, { foreignKey: 'userId' });
    Order.hasMany(models.OrderItem, { foreignKey: 'orderId' });
    Order.hasOne(models.Payment, { foreignKey: 'orderId' });
  };
  return Order;
};
