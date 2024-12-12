'use strict';

const bcrypt = require('bcrypt');
const saltRounds = 10; 

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const hashedPassword1 = await bcrypt.hash('jijahuwu', saltRounds);
    const hashedPassword2 = await bcrypt.hash('henikiw', saltRounds);


    return queryInterface.bulkInsert('Users', [
      {
        email: '2211522022_azizah@student.unand.ac.id',
        password: hashedPassword1,
        nama: 'Azizah Novi Delfianti',
        role: 'mahasiswa',
        asal : 'Neo Telemetri',
        fakultas :'Teknologi Informasi',
        nim : '2211522022',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: '2211523008_heni@student.unand.ac.id',
        password: hashedPassword2,
        nama: 'Heni Yunida',
        role: 'mahasiswa',
        asal : 'HMSI',
        fakultas :'Teknologi Informasi',
        nim : '2211523008',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
