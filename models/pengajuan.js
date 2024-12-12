'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pengajuan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Pengajuan.belongsTo(models.User, {
        foreignKey: 'id_user',
        as: 'User',
      });
      Pengajuan.belongsTo(models.Sesi, {
        foreignKey: 'id_sesi',
        as: 'Sesi',
      });
      Pengajuan.belongsTo(models.Jadwal, {
        foreignKey: 'id_jadwal',
        as: 'Jadwal',
      });
      Pengajuan.belongsTo(models.Ruangan, {
        foreignKey: 'id_ruangan',
        as: 'Ruangan',
      });
    }
  }
  Pengajuan.init({
    id_pengajuan: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    id_user: {
      type:DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // nama tabel dari model User
        key: 'id_user'
    }
    },
    id_sesi: {
      type:DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Sesis', // nama tabel dari model User
        key: 'id_sesi'
    }
    },
    
    id_jadwal: {
      type:  DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Jadwals', // nama tabel dari model User
        key: 'id_jadwal'
    }
    },
   
    id_ruangan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ruangans', // nama tabel dari model User
        key: 'id_ruangan'
    }
    },
    
    surat_peminjaman:{
      type: DataTypes.BLOB
    }, 
    kegiatan: {
      type:  DataTypes.STRING
    },
   
    status: {
      type: DataTypes.STRING
    },
    
  }, {
    sequelize,
    modelName: 'Pengajuan',
  });
  return Pengajuan;
};