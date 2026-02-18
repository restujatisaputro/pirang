import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

function toInt(v, fallback = null) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeLecturerIds(body) {
  // kompatibel:
  // - lecturerIds: [1,2]
  // - lecturerIds: "1,2"
  // - lecturerId: 1 (lama)
  const ids = [];

  if (Array.isArray(body.lecturerIds)) {
    for (const x of body.lecturerIds) {
      const n = toInt(x, null);
      if (n != null) ids.push(n);
    }
  } else if (typeof body.lecturerIds === "string") {
    for (const part of body.lecturerIds.split(",")) {
      const n = toInt(part.trim(), null);
      if (n != null) ids.push(n);
    }
  } else if (body.lecturerId != null) {
    const n = toInt(body.lecturerId, null);
    if (n != null) ids.push(n);
  }

  // unique
  return [...new Set(ids)];
}

function validateSchedulePayload(body) {
  const required = ["courseId", "roomId", "day", "startTime", "endTime", "classGroup"];
  for (const k of required) {
    if (body[k] == null || body[k] === "") {
      return `Field '${k}' wajib diisi`;
    }
  }
  return null;
}

// GET /api/schedules?day=&classGroup=&courseId=&roomId=&lecturerId=&q=&page=&perPage=
router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, toInt(req.query.page, 1));
    const perPage = Math.min(100, Math.max(5, toInt(req.query.perPage, 20)));
    const offset = (page - 1) * perPage;

    const where = [];
    const params = [];

    // filter dasar
    if (req.query.day) {
      where.push("s.day = ?");
      params.push(String(req.query.day));
    }
    if (req.query.classGroup) {
      where.push("s.classGroup = ?");
      params.push(String(req.query.classGroup));
    }
    if (req.query.courseId) {
      where.push("s.courseId = ?");
      params.push(toInt(req.query.courseId));
    }
    if (req.query.roomId) {
      where.push("s.roomId = ?");
      params.push(toInt(req.query.roomId));
    }

    // filter dosen (penting untuk team teaching)
    if (req.query.lecturerId) {
      where.push(
        "EXISTS (SELECT 1 FROM schedule_lecturers sl WHERE sl.scheduleId = s.id AND sl.lecturerId = ?)"
      );
      params.push(toInt(req.query.lecturerId));
    }

    // keyword bebas (opsional) untuk studyProgram / classGroup / day
    if (req.query.q) {
      where.push("(s.studyProgram LIKE ? OR s.classGroup LIKE ? OR s.day LIKE ?)");
      const q = `%${String(req.query.q)}%`;
      params.push(q, q, q);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    // total
    const [countRows] = await pool.query(
      `SELECT COUNT(DISTINCT s.id) AS total
       FROM schedules s
       ${whereSql}`,
      params
    );
    const total = Number(countRows?.[0]?.total || 0);
    const totalPages = Math.max(1, Math.ceil(total / perPage));

    // data (lecturerIds digabung)
    const [rows] = await pool.query(
      `SELECT
         s.*,
         COALESCE(JSON_ARRAYAGG(sl.lecturerId), JSON_ARRAY()) AS lecturerIds
       FROM schedules s
       LEFT JOIN schedule_lecturers sl ON sl.scheduleId = s.id
       ${whereSql}
       GROUP BY s.id
       ORDER BY s.day, s.startTime, s.classGroup, s.id
       LIMIT ? OFFSET ?`,
      [...params, perPage, offset]
    );

    // parse JSON array (mysql2 kadang return string)
    const data = rows.map((r) => ({
      ...r,
      lecturerIds: Array.isArray(r.lecturerIds)
        ? r.lecturerIds
        : (r.lecturerIds ? JSON.parse(r.lecturerIds) : []),
    }));

    res.json({
      data,
      pagination: { page, perPage, total, totalPages },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch schedules", error: String(err?.message || err) });
  }
});

// POST /api/schedules
router.post("/", async (req, res) => {
  const error = validateSchedulePayload(req.body);
  if (error) return res.status(400).json({ message: error });

  const lecturerIds = normalizeLecturerIds(req.body);

  const payload = {
    courseId: toInt(req.body.courseId),
    roomId: toInt(req.body.roomId),
    day: String(req.body.day),
    startTime: String(req.body.startTime),
    endTime: String(req.body.endTime),
    studyProgram: req.body.studyProgram != null ? String(req.body.studyProgram) : null,
    classGroup: String(req.body.classGroup),
    semester: req.body.semester != null ? toInt(req.body.semester) : null,
    jpm: req.body.jpm != null ? toInt(req.body.jpm, 0) : 0,
    weeks: req.body.weeks != null ? JSON.stringify(req.body.weeks) : null,
  };

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [ins] = await conn.query(
      `INSERT INTO schedules
       (courseId, roomId, day, startTime, endTime, studyProgram, classGroup, semester, jpm, weeks)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.courseId,
        payload.roomId,
        payload.day,
        payload.startTime,
        payload.endTime,
        payload.studyProgram,
        payload.classGroup,
        payload.semester,
        payload.jpm,
        payload.weeks,
      ]
    );

    const scheduleId = ins.insertId;

    if (lecturerIds.length) {
      const values = lecturerIds.map((lid) => [scheduleId, lid]);
      await conn.query(
        `INSERT INTO schedule_lecturers (scheduleId, lecturerId) VALUES ?`,
        [values]
      );
    }

    await conn.commit();
    res.status(201).json({ message: "Schedule created", id: scheduleId, lecturerIds });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: "Failed to create schedule", error: String(err?.message || err) });
  } finally {
    conn.release();
  }
});

// PUT /api/schedules/:id
router.put("/:id", async (req, res) => {
  const scheduleId = toInt(req.params.id);
  if (!scheduleId) return res.status(400).json({ message: "Invalid schedule id" });

  const error = validateSchedulePayload(req.body);
  if (error) return res.status(400).json({ message: error });

  const lecturerIds = normalizeLecturerIds(req.body);

  const payload = {
    courseId: toInt(req.body.courseId),
    roomId: toInt(req.body.roomId),
    day: String(req.body.day),
    startTime: String(req.body.startTime),
    endTime: String(req.body.endTime),
    studyProgram: req.body.studyProgram != null ? String(req.body.studyProgram) : null,
    classGroup: String(req.body.classGroup),
    semester: req.body.semester != null ? toInt(req.body.semester) : null,
    jpm: req.body.jpm != null ? toInt(req.body.jpm, 0) : 0,
    weeks: req.body.weeks != null ? JSON.stringify(req.body.weeks) : null,
  };

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [upd] = await conn.query(
      `UPDATE schedules SET
        courseId=?, roomId=?, day=?, startTime=?, endTime=?,
        studyProgram=?, classGroup=?, semester=?, jpm=?, weeks=?
       WHERE id=?`,
      [
        payload.courseId,
        payload.roomId,
        payload.day,
        payload.startTime,
        payload.endTime,
        payload.studyProgram,
        payload.classGroup,
        payload.semester,
        payload.jpm,
        payload.weeks,
        scheduleId,
      ]
    );

    if (upd.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ message: "Schedule not found" });
    }

    // replace lecturer relations
    await conn.query(`DELETE FROM schedule_lecturers WHERE scheduleId=?`, [scheduleId]);

    if (lecturerIds.length) {
      const values = lecturerIds.map((lid) => [scheduleId, lid]);
      await conn.query(
        `INSERT INTO schedule_lecturers (scheduleId, lecturerId) VALUES ?`,
        [values]
      );
    }

    await conn.commit();
    res.json({ message: "Schedule updated", id: scheduleId, lecturerIds });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: "Failed to update schedule", error: String(err?.message || err) });
  } finally {
    conn.release();
  }
});

// DELETE /api/schedules/:id
router.delete("/:id", async (req, res) => {
  const scheduleId = toInt(req.params.id);
  if (!scheduleId) return res.status(400).json({ message: "Invalid schedule id" });

  try {
    const [del] = await pool.query(`DELETE FROM schedules WHERE id=?`, [scheduleId]);
    if (del.affectedRows === 0) return res.status(404).json({ message: "Schedule not found" });
    // schedule_lecturers auto kehapus karena ON DELETE CASCADE
    res.json({ message: "Schedule deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete schedule", error: String(err?.message || err) });
  }
});

export default router;
