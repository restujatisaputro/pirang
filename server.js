
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pija',
  port: process.env.DB_PORT || 3306
};

// Retry connection logic for Docker startup
const connectWithRetry = async () => {
  try {
    return await mysql.createPool(dbConfig);
  } catch (err) {
    console.error('Gagal koneksi ke DB, mencoba lagi dalam 5 detik...', err);
    await new Promise(res => setTimeout(res, 5000));
    return connectWithRetry();
  }
};

let pool;
(async () => {
  pool = await connectWithRetry();
  console.log("Terhubung ke Database!");
})();

const query = async (sql, params) => {
  if (!pool) pool = await connectWithRetry();
  const [rows] = await pool.execute(sql, params);
  return rows;
};

// Auth
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const users = await query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    if (users.length > 0) {
      const u = users[0];
      res.json({ success: true, user: { id: u.id, username: u.username, role: u.role, fullName: u.fullName } });
    } else {
      res.status(401).json({ success: false, message: 'Username atau password salah' });
    }
  } catch (e) {
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

app.post('/api/register', async (req, res) => {
  const { username, password, fullName } = req.body;
  try {
    await query('INSERT INTO users (username, password, fullName, role) VALUES (?, ?, ?, "USER")', [username, password, fullName]);
    res.json({ success: true, message: 'Registrasi berhasil' });
  } catch (e) {
    res.status(400).json({ success: false, message: 'Username sudah digunakan' });
  }
});

// User Management
app.get('/api/users', async (req, res) => {
  try {
    const users = await query('SELECT id, username, fullName, role FROM users');
    res.json(users);
  } catch (e) { res.status(500).json([]); }
});

app.put('/api/users/:id', async (req, res) => {
  const { password, fullName } = req.body;
  const userId = req.params.id;
  try {
    if (password && fullName) {
      await query('UPDATE users SET password = ?, fullName = ? WHERE id = ?', [password, fullName, userId]);
    } else if (password) {
      await query('UPDATE users SET password = ? WHERE id = ?', [password, userId]);
    } else if (fullName) {
      await query('UPDATE users SET fullName = ? WHERE id = ?', [fullName, userId]);
    }
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Rooms
app.get('/api/rooms', async (req, res) => res.json(await query('SELECT * FROM rooms')));
app.post('/api/rooms', async (req, res) => {
  const { name, capacity, building } = req.body;
  const result = await query('INSERT INTO rooms (name, capacity, building) VALUES (?, ?, ?)', [name, capacity, building]);
  res.json({ id: result.insertId, ...req.body });
});
app.delete('/api/rooms/:id', async (req, res) => res.json(await query('DELETE FROM rooms WHERE id = ?', [req.params.id])));

// Lecturers
app.get('/api/lecturers', async (req, res) => res.json(await query('SELECT * FROM lecturers')));
app.post('/api/lecturers', async (req, res) => {
  const { nip, nama, prodi, status_kepegawaian, foto, tanggallahir, nidn, nuptk, hp, email, alamat, golongan, pangkat, pendidikan } = req.body;
  const result = await query(
    'INSERT INTO lecturers (nip, nama, prodi, status_kepegawaian, foto, tanggallahir, nidn, nuptk, hp, email, alamat, golongan, pangkat, pendidikan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [nip, nama, prodi, status_kepegawaian, foto, tanggallahir, nidn, nuptk, hp, email, alamat, golongan, pangkat, pendidikan]
  );
  res.json({ id: result.insertId, ...req.body });
});
app.delete('/api/lecturers/:id', async (req, res) => res.json(await query('DELETE FROM lecturers WHERE id = ?', [req.params.id])));

// Courses
app.get('/api/courses', async (req, res) => res.json(await query('SELECT * FROM courses')));
app.post('/api/courses', async (req, res) => {
  const { name, credits } = req.body;
  const result = await query('INSERT INTO courses (name, credits) VALUES (?, ?)', [name, credits]);
  res.json({ id: result.insertId, ...req.body });
});
app.delete('/api/courses/:id', async (req, res) => res.json(await query('DELETE FROM courses WHERE id = ?', [req.params.id])));

// Schedules
app.get('/api/schedules', async (req, res) => res.json(await query('SELECT * FROM schedules ORDER BY FIELD(day, "Senin", "Selasa", "Rabu", "Kamis", "Jumat"), startTime')));
app.post('/api/schedules', async (req, res) => {
  const { courseId, lecturerId, roomId, day, startTime, endTime, studyProgram, classGroup, semester, jpm, weeks, date } = req.body;
  const result = await query(
    'INSERT INTO schedules (courseId, lecturerId, roomId, day, startTime, endTime, studyProgram, classGroup, semester, jpm, weeks, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [courseId, lecturerId, roomId, day, startTime, endTime, studyProgram, classGroup, semester, jpm, JSON.stringify(weeks), date]
  );
  res.json({ id: result.insertId, ...req.body });
});
app.delete('/api/schedules/:id', async (req, res) => res.json(await query('DELETE FROM schedules WHERE id = ?', [req.params.id])));

// Bookings
app.get('/api/bookings', async (req, res) => res.json(await query('SELECT * FROM bookings')));
app.post('/api/bookings', async (req, res) => {
    const { userId, roomId, date, startTime, endTime, purpose } = req.body;
    const result = await query(
        'INSERT INTO bookings (userId, roomId, date, startTime, endTime, purpose) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, roomId, date, startTime, endTime, purpose]
    );
    res.json({ id: result.insertId, status: 'PENDING', ...req.body });
});
app.put('/api/bookings/:id/status', async (req, res) => {
    const { status } = req.body;
    await query('UPDATE bookings SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true });
});

// Items
app.get('/api/items', async (req, res) => res.json(await query('SELECT * FROM items')));
app.post('/api/items', async (req, res) => {
    const { nama_barang, merek, tahun_perolehan, serial_number, kondisi, keterangan, ruang } = req.body;
    const result = await query(
        'INSERT INTO items (nama_barang, merek, tahun_perolehan, serial_number, kondisi, keterangan, ruang) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nama_barang, merek, tahun_perolehan, serial_number, kondisi, keterangan, ruang]
    );
    res.json({ id: result.insertId, status_pinjam: 'Tersedia', ...req.body });
});
app.delete('/api/items/:id', async (req, res) => res.json(await query('DELETE FROM items WHERE id = ?', [req.params.id])));

// Item Borrowings
app.get('/api/item-borrowings', async (req, res) => res.json(await query('SELECT * FROM item_borrowings')));
app.post('/api/item-borrowings', async (req, res) => {
    const { userId, itemId, borrowDate, returnDate, purpose } = req.body;
    const result = await query(
        'INSERT INTO item_borrowings (userId, itemId, borrowDate, returnDate, purpose) VALUES (?, ?, ?, ?, ?)',
        [userId, itemId, borrowDate, returnDate, purpose]
    );
    res.json({ id: result.insertId, status: 'PENDING', ...req.body });
});
app.put('/api/item-borrowings/:id/status', async (req, res) => {
    const { status } = req.body;
    await query('UPDATE item_borrowings SET status = ? WHERE id = ?', [status, req.params.id]);
    
    // Auto update item status
    const rows = await query('SELECT itemId FROM item_borrowings WHERE id = ?', [req.params.id]);
    if (rows.length > 0) {
        const { itemId } = rows[0];
        if (status === 'APPROVED') {
            await query('UPDATE items SET status_pinjam = "Dipinjam", user_peminjam = "Member" WHERE id = ?', [itemId]);
        } else if (status === 'RETURNED' || status === 'REJECTED') {
            await query('UPDATE items SET status_pinjam = "Tersedia", user_peminjam = NULL WHERE id = ?', [itemId]);
        }
    }
    res.json({ success: true });
});

// Fallback for Frontend Routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server backend berjalan di http://localhost:${PORT}`));
