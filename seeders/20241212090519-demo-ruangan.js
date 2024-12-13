'use strict';
const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const imagePath1 = path.join(__dirname, '../public/image/SI_1.jpg');
    const imageBuffer1 = fs.readFileSync(imagePath1);

    const imagePath2 = path.join(__dirname, '../public/image/Tekkom_1.jpg');
    const imageBuffer2 = fs.readFileSync(imagePath2);


    return queryInterface.bulkInsert('Ruangans', [
      {
        nama_ruangan: 'Seminar SI',
        deskripsi : 'Tersedia AC, Proyektor, Galon Minum, Monitor ',
        gambar : imageBuffer1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nama_ruangan: 'Seminar Teknik Komputer',
        deskripsi : 'Tersedia AC, Proyektor, Galon Minum, Monitor ',
        gambar : imageBuffer2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
    ]);
  },
  

  async down (queryInterface, Sequelize) {
   
  }
};
