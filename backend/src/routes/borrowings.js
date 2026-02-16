import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// POST /api/borrowings
router.post("/", async (req, res) => {
  try {
    const { userId, itemId, borrowDate, returnDate, purpose } = req.body || {};
    if (!userId || !itemId || !borrowDate) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const [r] = await pool.query(
      "INSERT INTO itemBorrowings (userId, itemId, borrowDate, returnDate, purpose, status) VALUES (?,?,?,?,?,?)",
      [userId, itemId, borrowDate, returnDate || null, purpose || "", "PENDING"]
    );

    res.json({
      id: String(r.insertId),
      userId, itemId, borrowDate,
      returnDate: returnDate || null,
      purpose: purpose || "",
      status: "PENDING"
    });
  } catch (e) {
    res.status(500).json({ message: "Failed to create item borrowing", error: String(e?.message || e) });
  }
});

// PATCH /api/borrowings/:id/status  (APPROVED/REJECTED/RETURNED)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body || {};
    if (!status) return res.status(400).json({ message: "Missing status" });

    // Ambil borrow dulu
    const [rows] = await pool.query("SELECT * FROM itemBorrowings WHERE id=? LIMIT 1", [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "Borrowing not found" });

    const borrow = rows[0];
    await pool.query("UPDATE itemBorrowings SET status=? WHERE id=?", [status, req.params.id]);

    // Ikuti logic api.ts untuk update item status
    if (status === "APPROVED" || status === "RETURNED" || status === "REJECTED") {
      const itemStatus = status === "APPROVED" ? "Dipinjam" : "Tersedia";
      const userPeminjam = status === "APPROVED" ? "Member" : null;

      await pool.query(
        "UPDATE items SET status_pinjam=?, user_peminjam=? WHERE id=?",
        [itemStatus, userPeminjam, borrow.itemId]
      );
    }

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ message: "Failed to update borrowing status", error: String(e?.message || e) });
  }
});

export default router;
