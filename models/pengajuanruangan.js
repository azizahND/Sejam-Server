'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PengajuanRuangan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PengajuanRuangan.belongsTo(models.Pengajuan, {
        foreignKey: 'id_pengajuan',
        as: 'Pengajuan',
      });
      PengajuanRuangan.belongsTo(models.Ruangan, {
        foreignKey: 'id_ruangan',
        as: 'Ruangan',
      });
    }
  }
  PengajuanRuangan.init({
    id_pengajuan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Pengajuans',
        key: 'id_pengajuan'
      }
    },
    id_ruangan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Ruangans',
        key: 'id_ruangan'
      }
    },
  }, {
    sequelize,
    modelName: 'PengajuanRuangan',
  });
  return PengajuanRuangan;
};