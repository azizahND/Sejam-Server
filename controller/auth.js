const bcrypt = require('bcryptjs');
const { User } = require('../models');  // Pastikan path model User benar

// Controller untuk login
exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    // Log untuk debugging
    console.log('Request body:', req.body);

    console.log('Email:', email);
    console.log('Password:', password);
  
    try {
      // Cari user berdasarkan email
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return res.status(401).json({ message: 'Email atau password salah' });
      }
  
      // Bandingkan password yang diberikan dengan yang ada di database
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Email atau password salah' });
      }
  
      // Simpan data user ke session jika login sukses
      req.session.user = {
        id_user: user.id_user,
        email: user.email,
        nama: user.nama,
        role: user.role,
        asal: user.asal,
        fakultas: user.fakultas,
        nim: user.nim,
      };
  
      return res.status(200).json({ message: 'Login sukses', user: req.session.user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
  };
  

// Controller untuk register
exports.register = async (req, res) => {
    const { email, password, nama, role, asal, fakultas, nim } = req.body;
  
    // Validasi data yang diterima
    if (!email || !password || !nama || !role || !asal || !fakultas || !nim) {
      return res.status(400).json({ message: 'Semua field harus diisi' });
    }
  
    try {
      // Cek apakah email sudah terdaftar
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email sudah terdaftar' });
      }
  
      // Enkripsi password menggunakan bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Simpan user baru ke database
      const newUser = await User.create({
        email,
        password: hashedPassword,
        nama,
        role,
        asal,
        fakultas,
        nim
      });
  
      // Kembalikan response sukses
      return res.status(201).json({
        message: 'Registrasi berhasil',
        user: {
          id_user: newUser.id_user,
          email: newUser.email,
          nama: newUser.nama,
          role: newUser.role,
          asal: newUser.asal,
          fakultas: newUser.fakultas,
          nim: newUser.nim
        }
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
  };

  exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
  
    // Periksa apakah pengguna sudah login
    if (!req.session.user) {
      return res.status(401).json({ message: 'Silakan login terlebih dahulu' });
    }
  
    // Validasi input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Password lama dan baru harus diisi' });
    }
  
    try {
      // Cari user berdasarkan ID yang tersimpan di session
      const user = await User.findByPk(req.session.user.id_user);
  
      if (!user) {
        return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
      }
  
      // Verifikasi password lama
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Password lama salah' });
      }
  
      // Hash password baru
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  
      // Update password di database
      user.password = hashedNewPassword;
      await user.save();
  
      return res.status(200).json({ message: 'Password berhasil diubah' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
  };