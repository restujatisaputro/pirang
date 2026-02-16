import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// POST /api/bookings
router.post("/", async (req, res) => {
  try {
    const { userId, roomId, date, startTime, endTime, purpose } = req.body || {};
    if (!userId || !roomId || !date || !startTime || !endTime) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const [r] = await pool.query(
      "INSERT INTO bookings (userId, roomId, date, startTime, endTime, purpose, status) VALUES (?,?,?,?,?,?,?)",
      [userId, roomId, date, startTime, endTime, purpose || "", "PENDING"]
    );

    res.json({
      id: String(r.insertId),
      userId, roomId, date, startTime, endTime,
      purpose: purpose || "",
      status: "PENDING"
    });
  } catch (e) {
    res.status(500).json({ message: "Failed to create booking", error: String(e?.message || e) });
  }
});

// PATCH /api/bookings/:id/status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body || {};
    if (!status) return res.status(400).json({ message: "Missing status" });

    await pool.query("UPDATE bookings SET status=? WHERE id=?", [status, req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ message: "Failed to update booking status", error: String(e?.message || e) });
  }
});

export default router;
