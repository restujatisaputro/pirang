
CREATE DATABASE IF NOT EXISTS pija;
USE pija;

CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    building VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'Ruang Kelas'
);

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

CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    credits INT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fullName VARCHAR(100),
    role ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER'
);

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
