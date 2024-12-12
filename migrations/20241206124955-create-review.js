'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id_review: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_ruangan: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Ruangans', 
          key: 'id_ruangan' 
        }
      },
      id_user: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', 
          key: 'id_user' 
        }
      },
      review: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('Reviews');
  }
};