
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors()); // Mengaktifkan CORS untuk semua rute (penting untuk mode dev)
app.use(express.json());

// Middleware Logging Request
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pija',
  port: process.env.DB_PORT || 3306,
  multipleStatements: true // Mengizinkan eksekusi multiple statements untuk schema
};

let pool = null;

// Inisialisasi Koneksi Database dan Schema
const initDB = async () => {
  try {
    console.log(`Menghubungkan ke MySQL di ${dbConfig.host}:${dbConfig.port} user=${dbConfig.user}...`);
    // 1. Buat koneksi untuk membuat DB jika belum ada
    const connection = await mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        port: dbConfig.port
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    await connection.end();

    // 2. Hubungkan ke Database
    pool = mysql.createPool(dbConfig);
    
    // 3. Cek konektivitas
    await pool.query('SELECT 1');
    console.log("Terhubung ke Database MySQL!");

    // 4. Jalankan Schema jika tabel belum ada
    const [rows] = await pool.query("SHOW TABLES LIKE 'users'");
    if (rows.length === 0) {
        console.log("Database kosong, menjalankan schema.sql...");
        const schemaPath = path.join(__dirname, 'schema.sql');
        if (fs.existsSync(schemaPath)) {
            const sql = fs.readFileSync(schemaPath, 'utf8');
            // Menggunakan multipleStatements: true memungkinkan eksekusi skrip penuh
            await pool.query(sql);
            console.log("Schema berhasil dijalankan.");
        } else {
            console.warn("File schema.sql tidak ditemukan!");
        }
    }

  } catch (err) {
    console.error("GAGAL KONEKSI DATABASE:", err.message);
    console.error("Pastikan MySQL berjalan dan kredensial (root/password) benar.");
    pool = null; 
  }
};

initDB();

const query = async (sql, params) => {
  if (!pool) {
    await initDB();
    if (!pool) throw new Error("Koneksi Database Terputus. Pastikan MySQL berjalan.");
  }
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error("Query Error:", error.message);
    throw error;
  }
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch((err) => {
      console.error("API Error Handler:", err);
      res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
    });
};

// --- ROUTES ---

// Health Check
app.get('/api/health', (req, res) => res.json({ status: 'ok', database: pool ? 'connected' : 'disconnected' }));

// Auth
app.post('/api/login', asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const users = await query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
  if (users.length > 0) {
    const u = users[0];
    res.json({ success: true, user: { id: u.id, username: u.username, role: u.role, fullName: u.fullName } });
  } else {
    res.status(401).json({ success: false, message: 'Username atau password salah' });
  }
}));

app.post('/api/register', asyncHandler(async (req, res) => {
  const { username, password, fullName } = req.body;
  try {
    await query('INSERT INTO users (username, password, fullName, role) VALUES (?, ?, ?, "USER")', [username, password, fullName]);
    res.json({ success: true, message: 'Registrasi berhasil' });
  } catch (e) {
    res.status(400).json({ success: false, message: 'Username sudah digunakan' });
  }
}));

// User Management
app.get('/api/users', asyncHandler(async (req, res) => {
  const users = await query('SELECT id, username, fullName, role FROM users');
  res.json(users);
}));

app.put('/api/users/:id', asyncHandler(async (req, res) => {
  const { password, fullName } = req.body;
  const userId = req.params.id;
  if (password && fullName) {
    await query('UPDATE users SET password = ?, fullName = ? WHERE id = ?', [password, fullName, userId]);
  } else if (password) {
    await query('UPDATE users SET password = ? WHERE id = ?', [password, userId]);
  } else if (fullName) {
    await query('UPDATE users SET fullName = ? WHERE id = ?', [fullName, userId]);
  }
  res.json({ success: true });
}));

app.delete('/api/users/:id', asyncHandler(async (req, res) => {
  await query('DELETE FROM users WHERE id = ?', [req.params.id]);
  res.json({ success: true });
}));

// Rooms
app.get('/api/rooms', asyncHandler(async (req, res) => res.json(await query('SELECT * FROM rooms'))));
app.post('/api/rooms', asyncHandler(async (req, res) => {
  const { name, capacity, building } = req.body;
  const result = await query('INSERT INTO rooms (name, capacity, building) VALUES (?, ?, ?)', [name, capacity, building]);
  res.json({ id: result.insertId, ...req.body });
}));
app.delete('/api/rooms/:id', asyncHandler(async (req, res) => res.json(await query('DELETE FROM rooms WHERE id = ?', [req.params.id]))));

// Lecturers
app.get('/api/lecturers', asyncHandler(async (req, res) => res.json(await query('SELECT * FROM lecturers'))));
app.post('/api/lecturers', asyncHandler(async (req, res) => {
  const { nip, nama, prodi, status_kepegawaian, foto, tanggallahir, nidn, nuptk, hp, email, alamat, golongan, pangkat, pendidikan } = req.body;
  const result = await query(
    'INSERT INTO lecturers (nip, nama, prodi, status_kepegawaian, foto, tanggallahir, nidn, nuptk, hp, email, alamat, golongan, pangkat, pendidikan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [nip, nama, prodi, status_kepegawaian, foto, tanggallahir, nidn, nuptk, hp, email, alamat, golongan, pangkat, pendidikan]
  );
  res.json({ id: result.insertId, ...req.body });
}));
app.delete('/api/lecturers/:id', asyncHandler(async (req, res) => res.json(await query('DELETE FROM lecturers WHERE id = ?', [req.params.id]))));

// Courses
app.get('/api/courses', asyncHandler(async (req, res) => res.json(await query('SELECT * FROM courses'))));
app.post('/api/courses', asyncHandler(async (req, res) => {
  const { name, credits } = req.body;
  const result = await query('INSERT INTO courses (name, credits) VALUES (?, ?)', [name, credits]);
  res.json({ id: result.insertId, ...req.body });
}));
app.delete('/api/courses/:id', asyncHandler(async (req, res) => res.json(await query('DELETE FROM courses WHERE id = ?', [req.params.id]))));

// Schedules
app.get('/api/schedules', asyncHandler(async (req, res) => res.json(await query('SELECT * FROM schedules ORDER BY FIELD(day, "Senin", "Selasa", "Rabu", "Kamis", "Jumat"), startTime'))));
app.post('/api/schedules', asyncHandler(async (req, res) => {
  const { courseId, lecturerId, roomId, day, startTime, endTime, studyProgram, classGroup, semester, jpm, weeks, date } = req.body;
  const result = await query(
    'INSERT INTO schedules (courseId, lecturerId, roomId, day, startTime, endTime, studyProgram, classGroup, semester, jpm, weeks, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [courseId, lecturerId, roomId, day, startTime, endTime, studyProgram, classGroup, semester, jpm, JSON.stringify(weeks), date]
  );
  res.json({ id: result.insertId, ...req.body });
}));
app.delete('/api/schedules/:id', asyncHandler(async (req, res) => res.json(await query('DELETE FROM schedules WHERE id = ?', [req.params.id]))));

// Bookings
app.get('/api/bookings', asyncHandler(async (req, res) => res.json(await query('SELECT * FROM bookings'))));
app.post('/api/bookings', asyncHandler(async (req, res) => {
    const { userId, roomId, date, startTime, endTime, purpose } = req.body;
    const result = await query(
        'INSERT INTO bookings (userId, roomId, date, startTime, endTime, purpose) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, roomId, date, startTime, endTime, purpose]
    );
    res.json({ id: result.insertId, status: 'PENDING', ...req.body });
}));
app.put('/api/bookings/:id/status', asyncHandler(async (req, res) => {
    const { status } = req.body;
    await query('UPDATE bookings SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true });
}));

// Items
app.get('/api/items', asyncHandler(async (req, res) => res.json(await query('SELECT * FROM items'))));
app.post('/api/items', asyncHandler(async (req, res) => {
    const { nama_barang, merek, tahun_perolehan, serial_number, kondisi, keterangan, ruang } = req.body;
    const result = await query(
        'INSERT INTO items (nama_barang, merek, tahun_perolehan, serial_number, kondisi, keterangan, ruang) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nama_barang, merek, tahun_perolehan, serial_number, kondisi, keterangan, ruang]
    );
    res.json({ id: result.insertId, status_pinjam: 'Tersedia', ...req.body });
}));
app.delete('/api/items/:id', asyncHandler(async (req, res) => res.json(await query('DELETE FROM items WHERE id = ?', [req.params.id]))));

// Item Borrowings
app.get('/api/item-borrowings', asyncHandler(async (req, res) => res.json(await query('SELECT * FROM item_borrowings'))));
app.post('/api/item-borrowings', asyncHandler(async (req, res) => {
    const { userId, itemId, borrowDate, returnDate, purpose } = req.body;
    const result = await query(
        'INSERT INTO item_borrowings (userId, itemId, borrowDate, returnDate, purpose) VALUES (?, ?, ?, ?, ?)',
        [userId, itemId, borrowDate, returnDate, purpose]
    );
    res.json({ id: result.insertId, status: 'PENDING', ...req.body });
}));
app.put('/api/item-borrowings/:id/status', asyncHandler(async (req, res) => {
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
}));

// --- Static Files & 404 Handling ---

// Serve static files from dist (placed after API routes to avoid conflicts)
if (fs.existsSync(path.join(__dirname, 'dist'))) {
  app.use(express.static(path.join(__dirname, 'dist')));
}

// Fallback logic for undefined routes
app.use((req, res) => {
  // If it's an API route that wasn't handled above, return 404 JSON
  if (req.path.startsWith('/api')) {
     return res.status(404).json({ success: false, message: 'API Route Not Found: ' + req.path });
  }

  // Serve static files (SPA) for GET requests only
  if (req.method === 'GET') {
      const distIndex = path.join(__dirname, 'dist', 'index.html');
      if (fs.existsSync(distIndex)) {
        return res.sendFile(distIndex);
      }
  }

  // Default response if not API and not serving SPA
  res.status(404).send(`
     <div style="font-family: sans-serif; text-align: center; padding: 50px;">
       <h1>EduSchedule Pro Backend</h1>
       <p>Backend berjalan di port ${PORT}.</p>
       <p>404 Not Found: ${req.path}</p>
     </div>
   `);
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server backend berjalan di http://localhost:${PORT}`));
