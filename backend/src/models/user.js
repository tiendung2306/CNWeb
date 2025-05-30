module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user',
      },
      verifyToken: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      defaultScope: {
        attributes: { exclude: ['password', 'verifyToken'] },
      },
      scopes: {
        withSecretColumns: {
          attributes: { include: ['password', 'verifyToken'] },
        },
      },
    },
  );
  User.associate = function (models) {
    User.hasMany(models.Order, { foreignKey: 'userId', as: 'orders' });
    User.hasMany(models.Review, { foreignKey: 'userId', as: 'reviews' });
  };
  return User;
};