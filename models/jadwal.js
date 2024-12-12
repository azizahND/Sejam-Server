'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Jadwal extends Model {
    
    static associate(models) {
      Jadwal.hasMany(models.Pengajuan, {
        foreignKey: 'id_jadwal',
        as: 'Pengajuan',
      });
    }
  }
  Jadwal.init({
    id_jadwal: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    tanggal: {
      type: DataTypes.DATE,
    },
    
  }, {
    sequelize,
    modelName: 'Jadwal',
  });
  return Jadwal;
};