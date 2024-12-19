'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Panduan extends Model {
    
    static associate(models) {
      Panduan.belongsTo(models.User, {
        foreignKey: 'id_user',
        as: 'User',
      });
    }
  }
  Panduan.init({
    id_panduan:
    {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    id_user: 
    {
      type: DataTypes.INTEGER
    },
    file: {
      type: DataTypes.BLOB
    },
    
  }, {
    sequelize,
    modelName: 'Panduan',
  });
  return Panduan;
};