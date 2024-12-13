// routes/auth.js
const express = require('express');
const router = express.Router();

const Controller = require('../controller/auth');  // Pastikan path controller benar

// Route untuk login
router.get('/login', Controller.login);
router.post('/login', Controller.login);

router.get('/register', Controller.register);
router.post('/register', Controller.register);

router.get('/gantiPassword', Controller.changePassword);
router.post('/gantiPassword', Controller.changePassword);

module.exports = router;
