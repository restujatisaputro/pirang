CREATE DATABASE IF NOT EXISTS pija;
USE pija;

DROP TABLE IF EXISTS itemBorrowings;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS lecturers;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  fullName VARCHAR(150) NOT NULL,
  role ENUM('ADMIN','USER') NOT NULL DEFAULT 'USER'
);

CREATE TABLE rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  capacity INT NOT NULL,
  building VARCHAR(100) NOT NULL,
  type VARCHAR(100) NOT NULL
);

CREATE TABLE lecturers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nip VARCHAR(50),
  nama VARCHAR(150),
  prodi VARCHAR(150),
  hp VARCHAR(50),
  email VARCHAR(150),
  foto TEXT
);

CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50),
  name VARCHAR(150),
  credits INT
);

CREATE TABLE schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  courseId INT,
  lecturerId INT,
  roomId INT,
  day VARCHAR(20),
  startTime VARCHAR(10),
  endTime VARCHAR(10),
  studyProgram VARCHAR(100),
  classGroup VARCHAR(50),
  semester INT,
  jpm INT,
  weeks TEXT
);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  roomId INT,
  date VARCHAR(20),
  startTime VARCHAR(10),
  endTime VARCHAR(10),
  purpose VARCHAR(255),
  status ENUM('APPROVED','REJECTED','PENDING') DEFAULT 'PENDING'
);

CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_barang VARCHAR(255),
  merek VARCHAR(100),
  tahun_perolehan VARCHAR(10),
  serial_number VARCHAR(100),
  kondisi VARCHAR(100),
  keterangan TEXT,
  ruang VARCHAR(100),
  status_pinjam VARCHAR(50),
  user_peminjam VARCHAR(50),
  foto TEXT
);

CREATE TABLE itemBorrowings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  itemId INT,
  borrowDate VARCHAR(20),
  returnDate VARCHAR(20),
  purpose VARCHAR(255),
  status ENUM('APPROVED','REJECTED','PENDING','RETURNED') DEFAULT 'PENDING'
);
