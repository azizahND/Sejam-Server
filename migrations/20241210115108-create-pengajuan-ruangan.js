'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PengajuanRuangans', {
      id_pengajuan: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Pengajuans', 
          key: 'id_pengajuan' 
        }
      },
      id_ruangan: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Ruangans', 
          key: 'id_ruangan' 
        }
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
    await queryInterface.dropTable('PengajuanRuangans');
  }
};