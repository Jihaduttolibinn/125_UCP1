const express = require('express');
const app = express();
const port = process.env.PORT || 5200;
const db = require('./models');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create
app.post('/hotel', async (req, res) => {
  const { Tipe_Kamar, Kapasitas_Tamu, Lantai, Fasilitas, Tanggal_Pesan } = req.body;
  
  if (!Tipe_Kamar || !Kapasitas_Tamu || !Lantai || !Fasilitas  || !Tanggal_Pesan ) {
    return res.status(400).json({ error: 'Tipe_Kamar, Kapasitas_Tamu, Lantai, Fasilitas dan Tanggal_Pesan wajib diisi' });
  }

  try {
    const hotel = await db.hotel.create({ Tipe_Kamar, Kapasitas_Tamu, Lantai, Fasilitas, Tanggal_Pesan  });
    res.status(201).json(hotel);
  } catch (error) {
    console.error('POST /hotel error:', error);
    res.status(500).json({ error: 'Gagal menambahkan hotel', details: error.message });
  }
});

// Read all
app.get('/hotel', async (req, res) => {
  try {
    const hotels = await db.hotel.findAll();
    res.status(200).json(hotels);
  } catch (error) {
    console.error('GET /hotel error:', error);
    res.status(500).json({ error: 'Gagal mengambil data hotel' });
  }
});

// Update
app.put('/hotel/:id', async (req, res) => {
  const hotelId = req.params.id;
  const { Tipe_Kamar, Kapasitas_Tamu, Lantai, Fasilitas, Tanggal_Pesan } = req.body;

  try {
    const hotel = await db.hotel.findByPk(hotelId);
    if (!hotel) return res.status(404).json({ error: 'hotel tidak ditemukan' });

    await hotel.update({ Tipe_Kamar, Kapasitas_Tamu, Lantai, Fasilitas, Tanggal_Pesan });
    res.status(200).json(hotel);
  } catch (error) {
    console.error(`PUT /hotel/${hotelId} error:`, error);
    res.status(500).json({ error: 'Gagal memperbarui data hotel' });
  }
});

// Delete
app.delete('/hotel/:id', async (req, res) => {
  const hotelId = req.params.id;
  try {
    const hotel = await db.hotel.findByPk(hotelId);
    if (!hotel) return res.status(404).json({ error: 'hotel tidak ditemukan' });

    await hotel.destroy();
    res.status(200).json({ message: 'hotel berhasil dihapus' });
  } catch (error) {
    console.error(`DELETE /hotel/${hotelId} error:`, error);
    res.status(500).json({ error: 'Gagal menghapus data hotel' });
  }
});

// Initialize DB and start server
db.sequelize
  .authenticate()
  .then(() => db.sequelize.sync())
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('DB connection or sync error:', err);
    process.exit(1);
  });