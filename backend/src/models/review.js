'use strict';
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
    },
    menuItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'MenuItems', key: 'id' },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
    },
  }, {});
  Review.associate = function(models) {
    Review.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    Review.belongsTo(models.MenuItem, { foreignKey: "menuItemId", as: "menuItem" });  };
  return Review;
};
