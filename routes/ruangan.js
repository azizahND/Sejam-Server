var express = require('express');
const app = express();
var router = express.Router();

const Controller = require('../controller/controller');


// Middleware untuk cek session
const checkAuth = (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Silakan login terlebih dahulu' });
    }
    next();
  };
 

router.get('/daftarRuangan', Controller.daftarRuangan);
router.get('/ruang', checkAuth, Controller.getAllRuangans);
router.get('/pilihRuang/:id', checkAuth, Controller.getRuanganById);
router.get('/peminjaman', checkAuth, Controller.peminjamanRuangan);
router.post('/peminjaman', checkAuth, Controller.peminjamanRuangan);
router.get('/review', checkAuth, Controller.createReview);
router.post('/review', checkAuth, Controller.createReview);
router.get('/editReview', checkAuth, Controller.updateReview);
router.post('/editReview', checkAuth, Controller.updateReview);
router.get('/reviewall', checkAuth, Controller.getReviewsByRuangan);
router.get('/riwayatPeminjaman/:id', Controller.getRiwayatPeminjamanByRuangan);
router.get('/panduan', Controller.getPanduan);
router.put('/editPeminjaman', checkAuth, Controller.editPeminjamanRuangan);

module.exports = router;
  
