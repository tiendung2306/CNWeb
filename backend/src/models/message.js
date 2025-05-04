module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define(
      'Message',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id',
          }
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        }
      },
      {
        timestamps: true
      }
    );
  
    Message.associate = function (models) {
      Message.belongsTo(models.User, { 
        foreignKey: 'userId', 
        as: 'user' 
      });
    };
  
    return Message;
};
