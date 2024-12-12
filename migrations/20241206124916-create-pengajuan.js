'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pengajuans', {
      id_pengajuan: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_user: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', 
          key: 'id_user' 
        }
      },
      id_sesi: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Sesis', 
          key: 'id_sesi' 
        }
      },
      id_jadwal: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Jadwals', 
          key: 'id_jadwal' 
        }
      },
      id_ruangan: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Ruangans', 
          key: 'id_ruangan' 
        }
      },
      surat_peminjaman: {
        type: Sequelize.BLOB
      },
      kegiatan: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Pengajuans');
  }
};