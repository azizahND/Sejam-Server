'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sesi extends Model {
    
    static associate(models) {
      Sesi.hasMany(models.Pengajuan, {
        foreignKey: 'id_sesi',
        as: 'Pengajuan',
      });
    }
  }
  Sesi.init({
    id_sesi: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    jam_mulai:{
      type: DataTypes.TIME
    },
     
    jam_akhir: {
      type: DataTypes.TIME
    },
    
  }, {
    sequelize,
    modelName: 'Sesi',
  });
  return Sesi;
};