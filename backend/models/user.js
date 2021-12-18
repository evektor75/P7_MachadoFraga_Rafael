'use strict';
const {
  Model, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Message, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
      
      this.hasMany(models.Comment,
        {
          foreignKey: 'userId',
          onDelete: 'CASCADE'
        });

        this.hasMany(models.Like,
          {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
          });
    }
  };
  User.init({
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    bio: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};