import { Router } from "express";
import { pool } from "../db.js";

const router = Router();
const ALLOWED = new Set(["rooms", "lecturers", "courses", "schedules", "items"]);

function ensureAllowed(type, res) {
  if (!ALLOWED.has(type)) {
    res.status(400).json({ message: `Type '${type}' not allowed` });
    return false;
  }
  return true;
}

// GET /api/crud/:type
router.get("/:type", async (req, res) => {
  const type = req.params.type;
  if (!ensureAllowed(type, res)) return;
  const [rows] = await pool.query("SELECT * FROM ?? ORDER BY id", [type]);
  res.json(rows);
});

// POST /api/crud/:type
router.post("/:type", async (req, res) => {
  const type = req.params.type;
  if (!ensureAllowed(type, res)) return;

  const payload = req.body || {};
  const [r] = await pool.query("INSERT INTO ?? SET ?", [type, payload]);
  res.json({ success: true, id: String(r.insertId) });
});

// PUT /api/crud/:type/:id
router.put("/:type/:id", async (req, res) => {
  const type = req.params.type;
  if (!ensureAllowed(type, res)) return;

  await pool.query("UPDATE ?? SET ? WHERE id=?", [type, req.body || {}, req.params.id]);
  res.json({ success: true });
});

// DELETE /api/crud/:type/:id
router.delete("/:type/:id", async (req, res) => {
  const type = req.params.type;
  if (!ensureAllowed(type, res)) return;

  await pool.query("DELETE FROM ?? WHERE id=?", [type, req.params.id]);
  res.json({ success: true });
});

export default router;
