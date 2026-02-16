import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// GET /api/dbdump/ping
router.get("/ping", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ ok: true, db: rows[0].ok });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
});

// GET /api/dbdump/tables
router.get("/tables", async (req, res) => {
  const [rows] = await pool.query("SHOW TABLES");
  res.json(rows);
});

export default router;
