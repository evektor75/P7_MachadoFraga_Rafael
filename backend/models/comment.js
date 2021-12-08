'use strict';
const {
  Model, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.belongsToMany(models.Message, {
        through: models.Comment,
        foreignKey: 'userId',
        otherKey: 'messageId'
      });

      models.Message.belongsToMany(models.User, {
        through: models.Comment,
        foreignKey: 'messageId',
        otherKey: 'userId'
      });

      models.Comment.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });

      models.Comment.belongsTo(models.Message, {
        foreignKey: 'messageId',
        as: 'message',
        onDelete: 'CASCADE'
      });
    }
  };
  Comment.init({
    messageId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Message',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};