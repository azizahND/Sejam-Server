'use strict';
const { Pengajuan, Ruangan, Sesi, User, Review, Panduan } = require('../models');
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


async function daftarRuangan(req, res) {
  try {
    // Ambil hanya kolom 'nama_ruangan' dari tabel Ruangan
    const ruangan = await Ruangan.findAll({
      attributes: ['nama_ruangan'], // Menentukan kolom yang ingin diambil
    });

    console.log('Data ruangan:', ruangan);
    
    // Kirim response dengan data nama ruangan
    res.status(200).json({
      message: 'Data ruangan berhasil diambil',
      ruangan: ruangan.map(r => r.nama_ruangan), // Hanya mengirimkan nama ruangan
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

  async function getRiwayatPeminjamanByRuangan(req, res) {
    try {
      const { id } = req.params; // Ambil id_ruangan dari parameter URL
  
      // Query untuk mengambil riwayat peminjaman berdasarkan id_ruangan
      const riwayatPeminjaman = await Pengajuan.findAll({
        where: { id_ruangan: id },
        attributes: ['id_pengajuan', 'id_user','id_sesi' ,'id_jadwal','id_ruangan', 'status', 'createdAt'],
        include: [
          {
            model: Ruangan,
            as: 'Ruangan',
            attributes: ['nama_ruangan'], // Ambil nama ruangan
          },
          {
            model: User,
            as: 'User',
            attributes: ['nama'], // Ambil nama peminjam
          },
        ],
        order: [['createdAt', 'DESC']], // Urutkan berdasarkan waktu pengajuan terbaru
      });
  
      // Cek jika data tidak ditemukan
      if (!riwayatPeminjaman || riwayatPeminjaman.length === 0) {
        return res.status(404).json({ message: 'Riwayat peminjaman tidak ditemukan untuk ruangan ini.' });
      }
  
      // Kirim respons JSON
      return res.status(200).json({
        message: 'Riwayat peminjaman berhasil ditampilkan',
        data: riwayatPeminjaman,
      });
    } catch (error) {
      console.error('Error saat mengambil riwayat peminjaman:', error);
      return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
  }


  async function getPanduan(req, res) {
    try {
      // Mencari panduan pertama yang tersedia (misalnya, hanya ada satu panduan umum)
      const panduan = await Panduan.findOne();
  
      // Jika panduan tidak ditemukan
      if (!panduan) {
        return res.status(404).json({ message: 'Panduan tidak ditemukan' });
      }
  
      // Mengecek apakah file ada dan berupa BLOB
      if (panduan.file && Buffer.isBuffer(panduan.file)) {
        // Mengonversi BLOB menjadi file yang dapat diunduh
        res.setHeader('Content-Disposition', 'attachment; filename=Panduan.docx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.send(panduan.file); // Mengirimkan file dalam format BLOB
      } else {
        return res.status(400).json({ message: 'File panduan tidak tersedia' });
      }
    } catch (error) {
      console.error('Error saat mengambil file panduan:', error);
      return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
  }

  async function editPeminjamanRuangan(req, res) {
    const { id_pengajuan, id_ruangan, kegiatan, jamMulai, jamBerakhir } = req.body;
    
    // Validasi login
    if (!req.session.user) {
      return res.status(401).json({ message: 'Silakan login terlebih dahulu' });
    }
  
    // Validasi input
    if (!id_pengajuan || !id_ruangan || !kegiatan || !jamMulai || !jamBerakhir) {
      return res.status(400).json({ message: 'Data tidak lengkap. Pastikan semua data terisi.' });
    }
  
    try {
      // Cek apakah peminjaman dengan id_pengajuan ada dan apakah user yang login adalah peminjamnya
      const peminjaman = await Pengajuan.findOne({
        where: {
          id_pengajuan,
          id_user: req.session.user.id_user, // Pastikan yang mengedit adalah peminjamnya
        },
      });
  
      if (!peminjaman) {
        return res.status(404).json({ message: 'Peminjaman tidak ditemukan atau Anda tidak berhak mengedit peminjaman ini.' });
      }
  
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
          id_pengajuan: { [Op.ne]: id_pengajuan }, // Pastikan peminjaman yang diubah tidak bentrok dengan yang lain
        },
      });
  
      if (sesiBentrok) {
        return res.status(409).json({ message: 'Ruangan tidak tersedia pada waktu tersebut.' });
      }
  
      // Update peminjaman
      peminjaman.kegiatan = kegiatan;
      peminjaman.jamMulai = jamMulai;
      peminjaman.jamBerakhir = jamBerakhir;
      await peminjaman.save();
  
      return res.status(200).json({
        message: 'Peminjaman berhasil diperbarui.',
        peminjaman,
      });
    } catch (error) {
      console.error('Error saat mengedit peminjaman:', error);
      return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
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
  deleteReview,
  getRiwayatPeminjamanByRuangan,
  getPanduan,
  editPeminjamanRuangan,
  daftarRuangan

};
