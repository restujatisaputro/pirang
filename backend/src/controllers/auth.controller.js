const pool = require("../db");

async function login(req, res, next) {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ message: "username/password wajib" });

    const [rows] = await pool.query(
      "SELECT id, username, fullName, role FROM users WHERE username=? AND password=? LIMIT 1",
      [username, password]
    );

    if (!rows.length) return res.status(401).json({ message: "Login gagal" });
    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
}

module.exports = { login };
