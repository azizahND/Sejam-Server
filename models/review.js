'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.Ruangan, {
        foreignKey: 'id_ruangan',
        as: 'Ruangan',
      });
      Review.belongsTo(models.User, {
        foreignKey: 'id_user',
        as: 'User',
      });
    }
  }
  Review.init({
    id_review: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    id_ruangan: {
      type:  DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Ruangans', // nama tabel dari model User
        key: 'id_ruangan'
    }
    },
   
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // nama tabel dari model User
        key: 'id_user'
    }
    },
   
    review: {
      type: DataTypes.TEXT
    },
   
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};