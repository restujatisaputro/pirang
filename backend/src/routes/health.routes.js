const router = require("express").Router();
const pool = require("../db");

router.get("/health", async (req, res) => {
  const [r] = await pool.query("SELECT 1 as ok");
  res.json({ ok: true, db: r[0].ok });
});

module.exports = router;
