
CREATE DATABASE IF NOT EXISTS pija;
USE pija;

-- 1. Tabel Users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fullName VARCHAR(100),
    role ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER'
);

-- Data Dummy Users
INSERT IGNORE INTO users (username, password, fullName, role) VALUES 
('admin', 'admin', 'Administrator Sistem', 'ADMIN'),
('mahasiswa', 'mahasiswa', 'Budi Santoso', 'USER'),
('dosen', 'dosen', 'Dr. Siti Aminah', 'USER');

-- 2. Tabel Rooms
CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    building VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'Ruang Kelas'
);

-- Data Dummy Rooms
INSERT IGNORE INTO rooms (id, name, capacity, building, type) VALUES 
(1, 'R. Teori 1 (Gd. A)', 40, 'Gedung A', 'Kelas Teori'),
(2, 'R. Teori 2 (Gd. A)', 40, 'Gedung A', 'Kelas Teori'),
(3, 'Lab Komputer 1', 30, 'Gedung B', 'Laboratorium'),
(4, 'Auditorium Mini', 100, 'Gedung C', 'Auditorium');

-- 3. Tabel Lecturers
CREATE TABLE IF NOT EXISTS lecturers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nip VARCHAR(50) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    prodi VARCHAR(100),
    status_kepegawaian VARCHAR(50),
    foto VARCHAR(255),
    tanggallahir DATE,
    nidn VARCHAR(50),
    nuptk VARCHAR(50),
    hp VARCHAR(20),
    email VARCHAR(100),
    alamat TEXT,
    golongan VARCHAR(50),
    pangkat VARCHAR(100),
    pendidikan VARCHAR(50)
);

-- Data Dummy Lecturers
INSERT IGNORE INTO lecturers (id, nip, nama, prodi, status_kepegawaian, hp, email) VALUES 
(1, '198001012005011001', 'Dr. Budi Santoso, M.M.', 'Administrasi Bisnis', 'PNS', '08123456789', 'budi@pija.ac.id'),
(2, '198502022008012002', 'Siti Aminah, S.E., M.Ak.', 'Akuntansi', 'Tetap', '08987654321', 'siti@pija.ac.id'),
(3, '199003032015011003', 'Rahmat Hidayat, S.Kom., M.T.', 'Manajemen Informatika', 'Kontrak', '081122334455', 'rahmat@pija.ac.id');

-- 4. Tabel Courses
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    credits INT NOT NULL
);

-- Data Dummy Courses
INSERT IGNORE INTO courses (id, name, credits) VALUES 
(1, 'Pengantar Bisnis', 3),
(2, 'Akuntansi Dasar', 3),
(3, 'Manajemen Pemasaran', 2),
(4, 'Hukum Dagang', 2),
(5, 'Aplikasi Komputer Bisnis', 3);

-- 5. Tabel Schedules
CREATE TABLE IF NOT EXISTS schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    courseId INT,
    lecturerId INT,
    roomId INT,
    day ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat') NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    studyProgram VARCHAR(100) NOT NULL,
    classGroup VARCHAR(50) NOT NULL,
    semester INT NOT NULL,
    jpm INT NOT NULL,
    weeks JSON DEFAULT NULL,
    date DATE DEFAULT NULL,
    FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (lecturerId) REFERENCES lecturers(id) ON DELETE CASCADE,
    FOREIGN KEY (roomId) REFERENCES rooms(id) ON DELETE CASCADE
);

-- Data Dummy Schedules
INSERT IGNORE INTO schedules (courseId, lecturerId, roomId, day, startTime, endTime, studyProgram, classGroup, semester, jpm, weeks) VALUES 
(1, 1, 1, 'Senin', '08:00', '10:30', 'AB Terapan', 'AB-1A', 1, 150, '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]'),
(2, 2, 2, 'Selasa', '10:00', '12:30', 'Manajemen Keuangan', 'MK-3B', 3, 150, '[1,2,3,4,5,6,7,8]'),
(5, 3, 3, 'Rabu', '13:00', '15:30', 'AB Terapan', 'AB-1B', 1, 150, '[1,2,3,4,5,6,7,8]');

-- 6. Tabel Bookings
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    roomId INT,
    date DATE NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    purpose TEXT NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (roomId) REFERENCES rooms(id) ON DELETE CASCADE
);

-- Data Dummy Bookings (Pastikan tanggal dinamis atau update manual jika kadaluarsa)
INSERT IGNORE INTO bookings (userId, roomId, date, startTime, endTime, purpose, status) VALUES 
(2, 4, CURDATE() + INTERVAL 2 DAY, '09:00', '12:00', 'Seminar Mahasiswa', 'APPROVED'),
(2, 1, CURDATE() + INTERVAL 5 DAY, '14:00', '16:00', 'Rapat Himpunan', 'PENDING');

-- 7. Tabel Items
CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_barang VARCHAR(255) NOT NULL,
    merek VARCHAR(100),
    tahun_perolehan VARCHAR(4),
    serial_number VARCHAR(100),
    kondisi ENUM('Baik', 'Rusak Ringan', 'Rusak Berat') NOT NULL,
    foto VARCHAR(255),
    keterangan TEXT,
    ruang VARCHAR(100),
    status_pinjam ENUM('Tersedia', 'Dipinjam') DEFAULT 'Tersedia',
    user_peminjam VARCHAR(100)
);

-- Data Dummy Items
INSERT IGNORE INTO items (id, nama_barang, merek, tahun_perolehan, serial_number, kondisi, keterangan, ruang, status_pinjam, user_peminjam) VALUES 
(1, 'Proyektor Epson EB-X500', 'Epson', '2023', 'EPS-23-001', 'Baik', 'Aset Prodi AB', 'Gedung A', 'Tersedia', NULL),
(2, 'Kamera DSLR Canon', 'Canon', '2022', 'CN-22-555', 'Baik', 'Dokumentasi', 'Lab Media', 'Dipinjam', 'Member'),
(3, 'Sound System Portable', 'Yamaha', '2021', 'YM-21-003', 'Rusak Ringan', 'Mic kadang mati', 'Gedung C', 'Tersedia', NULL);

-- 8. Tabel Item Borrowings
CREATE TABLE IF NOT EXISTS item_borrowings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    itemId INT,
    borrowDate DATE NOT NULL,
    returnDate DATE NOT NULL,
    purpose TEXT NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'RETURNED') DEFAULT 'PENDING',
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (itemId) REFERENCES items(id) ON DELETE CASCADE
);

-- Data Dummy Item Borrowings
INSERT IGNORE INTO item_borrowings (userId, itemId, borrowDate, returnDate, purpose, status) VALUES 
(2, 2, CURDATE(), CURDATE() + INTERVAL 3 DAY, 'Dokumentasi Acara Kampus', 'APPROVED');
