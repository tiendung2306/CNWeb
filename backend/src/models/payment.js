'use strict';
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    orderId: {
      type: DataTypes.INTEGER,
      references: { model: 'Orders', key: 'id' },
    },
    paymentMethod: {
      type: DataTypes.ENUM('Cash', 'Momo'),
      allowNull: false,
    },
    amount: { //so tien can thanh toan
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM('Pending', 'Completed', 'Failed'),
    },
    paymentDate: {
      type: DataTypes.DATE,
    },
  }, {});
  Payment.associate = function(models) {
    Payment.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
  };
  return Payment;
};
