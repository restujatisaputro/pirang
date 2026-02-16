import { Router } from "express";
import { pool } from "../db.js";
import bcrypt from "bcrypt";

const router = Router();

// GET /api/users
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, username, fullName, role FROM users ORDER BY id");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: "Failed to load users", error: String(e?.message || e) });
  }
});

// PUT /api/users/:id  (password/fullName/role)
router.put("/:id", async (req, res) => {
  try {
    const { password, fullName, role } = req.body || {};
    const id = req.params.id;

    const fields = [];
    const values = [];

    if (fullName != null) { fields.push("fullName=?"); values.push(fullName); }
    if (role != null) { fields.push("role=?"); values.push(role); }

    if (password != null && password !== "") {
      const hash = await bcrypt.hash(password, 10);
      fields.push("password_hash=?");
      values.push(hash);
    }

    if (!fields.length) return res.status(400).json({ message: "No fields to update" });

    values.push(id);
    await pool.query(`UPDATE users SET ${fields.join(", ")} WHERE id=?`, values);

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ message: "Failed to update user", error: String(e?.message || e) });
  }
});

// DELETE /api/users/:id
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM users WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ message: "Failed to delete user", error: String(e?.message || e) });
  }
});

export default router;
