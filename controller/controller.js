'use strict';
const { Pengajuan, Ruangan, Sesi, User, Review } = require('../models');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');

// Konfigurasi multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Controller untuk mendapatkan semua ruangan
async function getAllRuangans(req, res) {
  try {
    const ruangan = await Ruangan.findAll();
    console.log('Data ruangan:', ruangan);
    res.status(200).json({
      message: 'Data ruangan berhasil diambil',
      ruangan,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Terjadi kesalahan saat mengambil data ruangan',
      error: error.message,
    });
  }
}

// Controller untuk mendapatkan ruangan berdasarkan ID
async function getRuanganById(req, res) {
  try {
    const { id } = req.params;
    const ruangan = await Ruangan.findOne({
      where: { id_ruangan: id },
      attributes: ['id_ruangan', 'nama_ruangan', 'deskripsi', 'gambar'],
    });

    if (!ruangan) {
      return res.status(404).json({ message: 'Ruangan tidak ditemukan' });
    }

    // Konversi gambar jika ada
    if (ruangan.gambar && Buffer.isBuffer(ruangan.gambar)) {
      const gambarBase64 = ruangan.gambar.toString('base64');
      ruangan.gambar = `data:image/png;base64,${gambarBase64}`;
    }

    return res.status(200).json(ruangan);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
}

// Controller untuk peminjaman ruangan
async function peminjamanRuangan(req, res) {
    const { id_ruangan, kegiatan, jamMulai, jamBerakhir } = req.body;
  
    // Validasi login
    if (!req.session.user) {
      return res.status(401).json({ message: 'Silakan login terlebih dahulu' });
    }
  
    // Validasi input
    if (!id_ruangan || !kegiatan || !jamMulai || !jamBerakhir) {
      return res.status(400).json({ message: 'Data tidak lengkap. Pastikan semua data terisi.' });
    }
  
    try {
      // Cek bentrok dengan peminjaman lain
      const sesiBentrok = await Pengajuan.findOne({
        where: {
          id_ruangan,
          [Op.or]: [
            {
              jamMulai: { [Op.lt]: jamBerakhir },
              jamBerakhir: { [Op.gt]: jamMulai },
            },
          ],
        },
      });
  
      if (sesiBentrok) {
        return res.status(409).json({ message: 'Ruangan tidak tersedia pada waktu tersebut.' });
      }
  
      // Jika tidak ada jadwal bentrok, otomatis disetujui
      const pengajuanBaru = await Pengajuan.create({
        id_user: req.session.user.id_user,
        id_ruangan,
        kegiatan,
        jamMulai,
        jamBerakhir,
        surat_peminjaman: req.file?.path,
        status: 'Disetujui', // Status otomatis disetujui
      });
  
      return res.status(201).json({
        message: 'Peminjaman berhasil diajukan dan telah disetujui secara otomatis.',
        pengajuan: pengajuanBaru,
      });
    } catch (error) {
      console.error('Error saat memproses peminjaman:', error);
      return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
  }

  // Create a new review
  async function createReview(req, res) {
    try {
      const { id_ruangan, id_user, review } = req.body;

      // Validate input
      if (!id_ruangan || !id_user || !review) {
        return res.status(400).json({ message: 'Isi data terlebi dahulu.' });
      }

      const newReview = await Review.create({
        id_ruangan,
        id_user,
        review,
      });

      res.status(201).json(newReview);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'gagal create review.', error });
    }
  }

  // Get all reviews for a specific ruangan
  async function getReviewsByRuangan(req, res) {
    try {
      const { id_ruangan } = req.params;

      const reviews = await Review.findAll({
        where: { id_ruangan },
        include: [
          { model: Ruangan, as: 'Ruangan' },
          { model: User, as: 'User', attributes: ['id_user', 'nama'] },
        ],
      });

      res.status(200).json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch reviews.', error });
    }
  }

  // Update a review
  async function updateReview(req, res) {
    try {
      const { id_review } = req.params;
      const { review } = req.body;

      if (!review) {
        return res.status(400).json({ message: 'Review content is required.' });
      }

      const updatedReview = await Review.update(
        { review },
        { where: { id_review }, returning: true }
      );

      if (!updatedReview[1][0]) {
        return res.status(404).json({ message: 'Review not found.' });
      }

      res.status(200).json(updatedReview[1][0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update review.', error });
    }
  }

  // Delete a review
  async function deleteReview(req, res) {
    try {
      const { id_review } = req.params;

      const deletedReview = await Review.destroy({ where: { id_review } });

      if (!deletedReview) {
        return res.status(404).json({ message: 'Review not found.' });
      }

      res.status(200).json({ message: 'Review deleted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to delete review.', error });
    }
  }

  




  

// Middleware untuk menangani upload
const uploadSuratPeminjaman = upload.single('surat_peminjaman');

module.exports = {
  getAllRuangans,
  getRuanganById,
  peminjamanRuangan,
  uploadSuratPeminjaman,
  createReview,
  getReviewsByRuangan,
  updateReview,
  deleteReview

};
