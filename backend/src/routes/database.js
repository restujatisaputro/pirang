import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// GET /api/database
router.get("/", async (req, res) => {
  try {
    const [users] = await pool.query("SELECT id, username, fullName, role FROM users ORDER BY id");
    const [rooms] = await pool.query("SELECT * FROM rooms ORDER BY id");
    const [lecturers] = await pool.query("SELECT * FROM lecturers ORDER BY id");
    const [courses] = await pool.query("SELECT * FROM courses ORDER BY id");
    const [schedules] = await pool.query("SELECT * FROM schedules ORDER BY id");
    const [bookings] = await pool.query("SELECT * FROM bookings ORDER BY id");
    const [items] = await pool.query("SELECT * FROM items ORDER BY id");
    const [itemBorrowings] = await pool.query("SELECT * FROM itemBorrowings ORDER BY id");

    res.json({ rooms, lecturers, courses, schedules, bookings, items, itemBorrowings, users });
  } catch (e) {
    res.status(500).json({ message: "Failed to load database", error: String(e?.message || e) });
  }
});

export default router;
