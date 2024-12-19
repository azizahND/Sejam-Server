'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    
    static associate(models) {
      User.hasMany(models.Pengajuan, {
        foreignKey: 'id_user',
        as: 'Pengajuan',
      });
      User.hasMany(models.Review, {
        foreignKey: 'id_user',
        as: 'Review',
      });
      User.hasMany(models.Panduan, {
        foreignKey: 'id_user',
        as: 'Panduan',
      });
    }
  }
  User.init({
    id_user: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    email: {
      type: DataTypes.STRING,
      unique:true,
    },
      
    password: { 
      type: DataTypes.STRING
    },
   
    nama: {
      type: DataTypes.STRING
    },
    
    role: { 
      type: DataTypes.STRING

    },
   
    asal: {
      type: DataTypes.STRING
    },
    
    fakultas: {
      type: DataTypes.STRING
    },
    
    nim: {
      type: DataTypes.STRING
    },
    
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};