import { Router } from "express";
import { pool } from "../db.js";
import bcrypt from "bcrypt";

const router = Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Missing username/password" });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE username = ? LIMIT 1", [username]);
    if (!rows.length) return res.json({ success: false, message: "Username atau password salah." });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.json({ success: false, message: "Username atau password salah." });

    res.json({
      success: true,
      user: { id: String(user.id), username: user.username, fullName: user.fullName, role: user.role }
    });
  } catch (e) {
    res.status(500).json({ success: false, message: "Login error", error: String(e?.message || e) });
  }
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, password, fullName } = req.body || {};
    if (!username || !password || !fullName) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const [exist] = await pool.query("SELECT id FROM users WHERE username=? LIMIT 1", [username]);
    if (exist.length) return res.status(400).json({ success: false, message: "Username sudah digunakan" });

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (username, password_hash, fullName, role) VALUES (?,?,?,?)",
      [username, hash, fullName, "USER"]
    );

    res.json({ success: true, message: "Registrasi berhasil" });
  } catch (e) {
    res.status(500).json({ success: false, message: "Register error", error: String(e?.message || e) });
  }
});

export default router;
