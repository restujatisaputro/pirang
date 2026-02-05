const pool = require("../db");

async function getDatabase(req, res, next) {
  try {
    const [users] = await pool.query("SELECT id, username, fullName, role FROM users");
    const [rooms] = await pool.query("SELECT * FROM rooms");
    const [lecturers] = await pool.query("SELECT * FROM lecturers");
    const [courses] = await pool.query("SELECT * FROM courses");
    const [schedules] = await pool.query("SELECT * FROM schedules");
    const [bookings] = await pool.query("SELECT * FROM bookings");
    const [items] = await pool.query("SELECT * FROM items");
    const [itemBorrowings] = await pool.query("SELECT * FROM item_borrowings");

    res.json({ users, rooms, lecturers, courses, schedules, bookings, items, itemBorrowings });
  } catch (e) {
    next(e);
  }
}

module.exports = { getDatabase };
