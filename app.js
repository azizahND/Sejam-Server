const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./routes/ruangan');
const session = require('express-session');

const app = express();
const PORT = 3000;

app.use(express.json()); 
app.use(bodyParser.json());


// Setup express-session
app.use(session({
  secret: 'secretKey',   // Ganti dengan key yang aman
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Gunakan secure: true jika menggunakan HTTPS
    maxAge: 60 * 60 * 1000 // Durasi sesi: 1 jam dalam milidetik
  }  // Gunakan secure: true jika menggunakan HTTPS
}));

// Middleware untuk parse JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route lainnya
const ruanganRoutes = require('./routes/ruangan');
app.use('/ruangan', ruanganRoutes);
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);





app.use(cors({
    origin: function (origin, callback) { 
      const allowedOrigins = [
        'http://10.0.2.2:3000',  
        'http://localhost:3000', 
      ];
  
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));


  app.use((req, res, next) => {
    if (!req.session.isUsed) {
      req.session.isUsed = false; // Inisialisasi jika belum ada
    }
    next();
  });
  
  // Contoh route untuk mengecek status session
  app.get('/check-session', (req, res) => {
    if (req.session.isUsed) {
      res.send('Session sudah digunakan.');
    } else {
      req.session.isUsed = true; // Tandai session sudah digunakan
      res.send('Session belum digunakan, sekarang sudah ditandai sebagai digunakan.');
    }
  });
  


app.get('/', (req, res) => {
    res.json("selamat datang bes");
});


app.get('/api/data', (req, res) => {
    const responseData = { message: "backend" };
    res.json(responseData); // Mengirimkan respons JSON
  });





app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
