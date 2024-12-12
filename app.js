const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());


app.use(cors({
    origin: function (origin, callback) {
      // Izinkan request dari Android emulator atau device
      const allowedOrigins = [
        'http://10.0.2.2:3000',  
        'http://localhost:3000', 
      ];
  
      // Izinkan request tanpa origin (misal dari mobile app)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

// Endpoint contoh
const users = [
    { id: 1, name: "Azizah", email: "azizah@example.com" },
    { id: 2, name: "Rizal", email: "rizal@example.com" }
];

app.get('/', (req, res) => {
    res.json("selamat datang bes");
});

app.get('/api/data', (req, res) => {
    const responseData = { message: "backend" };
    res.json(responseData); // Mengirimkan respons JSON
  });

app.get('/users', (req, res) => {
    res.json(users);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
