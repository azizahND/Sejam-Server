'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ruangan extends Model {
    
    static associate(models) {
      Ruangan.hasMany(models.Review, {
        foreignKey: 'id_ruangan',
        as: 'Review',
      });
    }
  }
  Ruangan.init({
    id_ruangan: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nama_ruangan: {
      type:DataTypes.STRING
    },
     
    deskripsi: {
      type: DataTypes.TEXT
    },
    gambar: {
      type: DataTypes.BLOB, 
      allowNull: true,
    },
    
  }, {
    sequelize,
    modelName: 'Ruangan',
  });
  return Ruangan;
};