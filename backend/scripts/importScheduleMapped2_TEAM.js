import fs from "fs";
import path from "path";
import csv from "csv-parser";
import * as db from "../src/db.js";

// Support both: export default pool  OR  export const pool
const pool = db.default ?? db.pool;
if (!pool || typeof pool.query !== "function") {
  throw new Error(
    "DB pool not found. Pastikan src/db.js men-export default pool ATAU named export pool (export const pool = ...)."
  );
}

const CSV_PATH = path.resolve("/app/scripts/jdwl.csv");

// ---- helpers ----
const clean = (v) => (v ?? "").toString().trim();
const normalizeHeader = (h) => clean(h).replace(/^\uFEFF/, ""); // remove BOM

function parseTimeRange(jam) {
  // examples: "07.30 - 08.20" , "07:30-08:20" , "07.30 – 08.20"
  const s = clean(jam);
  if (!s) return { startTime: null, endTime: null };
  const parts = s
    .replace(/\./g, ":")
    .replace(/[–—]/g, "-")
    .split("-")
    .map((x) => clean(x));

  if (parts.length < 2) return { startTime: null, endTime: null };
  const start = parts[0];
  const end = parts[1];

  // normalize to HH:MM
  const toHHMM = (t) => {
    const m = t.match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return null;
    const hh = m[1].padStart(2, "0");
    const mm = m[2];
    return `${hh}:${mm}`;
  };

  return { startTime: toHHMM(start), endTime: toHHMM(end) };
}

function splitLecturers(raw) {
  const s = clean(raw);
  if (!s) return [];

  // common separators in your data: " / ", "/", ";", "," or " dan "
  const parts = s
    .replace(/\s+dan\s+/gi, "/")
    .split(/[\/;]|\s*\|\s*/)
    .map((x) => clean(x))
    .filter(Boolean);

  // if still one long string with commas but commas are part of titles, keep as-is.
  // However sometimes multiple lecturers are separated by "," only.
  // Heuristic: if we have exactly 1 part and it contains "," and ALSO contains " / "? already handled.
  return [...new Set(parts)];
}

function roomNameFromCell(rawRoom) {
  const s = clean(rawRoom);
  if (!s) return null;
  const lower = s.toLowerCase();
  if (lower === "online" || lower === "zoom" || lower === "daring") return "ONLINE";

  // If purely numeric (e.g., 201) -> H201
  if (/^\d+$/.test(s)) return `H${s}`;
  return s;
}

function studyProgramFromClassGroup(classGroup) {
  const s = clean(classGroup);
  if (!s) return null;
  const idx = s.indexOf("-");
  return idx > 0 ? s.slice(0, idx) : s;
}

async function getOrCreateCourseId(name) {
  const key = name.toLowerCase();
  if (cache.course.has(key)) return cache.course.get(key);

  const [rows] = await pool.query("SELECT id FROM courses WHERE name=? LIMIT 1", [name]);
  if (rows.length) {
    cache.course.set(key, rows[0].id);
    return rows[0].id;
  }

  const [ins] = await pool.query(
    "INSERT INTO courses (name, code) VALUES (?, ?)",
    [name, null]
  );
  cache.course.set(key, ins.insertId);
  return ins.insertId;
}

async function getOrCreateLecturerId(nama) {
  const key = nama.toLowerCase();
  if (cache.lecturer.has(key)) return cache.lecturer.get(key);

  const [rows] = await pool.query("SELECT id FROM lecturers WHERE nama=? LIMIT 1", [nama]);
  if (rows.length) {
    cache.lecturer.set(key, rows[0].id);
    return rows[0].id;
  }

  const [ins] = await pool.query(
    "INSERT INTO lecturers (nama) VALUES (?)",
    [nama]
  );
  cache.lecturer.set(key, ins.insertId);
  return ins.insertId;
}

async function getOrCreateRoomId(roomName) {
  const key = roomName.toLowerCase();
  if (cache.room.has(key)) return cache.room.get(key);

  const [rows] = await pool.query("SELECT id FROM rooms WHERE name=? LIMIT 1", [roomName]);
  if (rows.length) {
    cache.room.set(key, rows[0].id);
    return rows[0].id;
  }

  // minimal defaults for NOT NULL columns
  const [ins] = await pool.query(
    "INSERT INTO rooms (name, capacity, building, type) VALUES (?, ?, ?, ?)",
    [roomName, 0, "-", "-"]
  );
  cache.room.set(key, ins.insertId);
  return ins.insertId;
}

function weeksDefault() {
  return JSON.stringify([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
}

const cache = {
  course: new Map(),
  lecturer: new Map(),
  room: new Map(),
};

async function main() {
  if (!fs.existsSync(CSV_PATH)) {
    throw new Error(`CSV tidak ditemukan: ${CSV_PATH}`);
  }

  let inserted = 0;
  let skipped = 0;
  const skipReasons = {
    missing_required_fields: 0,
    bad_time_range: 0,
    db_error: 0,
  };

  const rows = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(CSV_PATH)
      .pipe(
        csv({
          separator: ";",
          mapHeaders: ({ header }) => normalizeHeader(header),
          strict: false,
        })
      )
      .on("data", (row) => rows.push(row))
      .on("end", resolve)
      .on("error", reject);
  });

  for (const row of rows) {
    // Accept multiple possible header variants
    const kelas = clean(row.kelas || row.Kelas || row.CLASS || row.classGroup);
    const day = clean(row.Hari || row.hari || row.day);
    const jam = clean(row.Jam || row.jam || row.time);
    const courseName = clean(row["Mata Kuliah"] || row.matakuliah || row.course || row.courseName);
    const dosenRaw = clean(row.Dosen || row.dosen || row.lecturer || row.lecturers);
    const ruangRaw = clean(row.Ruang || row.ruang || row.room);
    const semesterRaw = clean(row.prof || row.Prof || row.semester);
    const jpmRaw = clean(row.JPM || row.jpm);

    if (!kelas || !day || !jam || !courseName || !ruangRaw) {
      skipped++;
      skipReasons.missing_required_fields++;
      continue;
    }

    const { startTime, endTime } = parseTimeRange(jam);
    if (!startTime || !endTime) {
      skipped++;
      skipReasons.bad_time_range++;
      continue;
    }

    try {
      const courseId = await getOrCreateCourseId(courseName);

      const roomName = roomNameFromCell(ruangRaw);
      const roomId = roomName ? await getOrCreateRoomId(roomName) : null;

      const lecturerNames = splitLecturers(dosenRaw);
      const lecturerIds = [];
      for (const n of lecturerNames) {
        const id = await getOrCreateLecturerId(n);
        lecturerIds.push(id);
      }

      // Backward-compatible: if only one lecturer, also fill lecturerId
      const lecturerId = lecturerIds.length ? lecturerIds[0] : null;

      const studyProgram = clean(row.studyProgram) || studyProgramFromClassGroup(kelas);
      const classGroup = kelas;

      const semester = semesterRaw ? Number(semesterRaw) : null;
      const jpm = jpmRaw ? Number(jpmRaw) : null;

      const weeks = weeksDefault();

      // avoid duplicates: same courseId, roomId, day, startTime, classGroup
      const [exists] = await pool.query(
        `SELECT id FROM schedules WHERE courseId=? AND roomId=? AND day=? AND startTime=? AND classGroup=? LIMIT 1`,
        [courseId, roomId, day, startTime, classGroup]
      );

      if (exists.length) {
        skipped++;
        continue;
      }

      await pool.query(
        `INSERT INTO schedules
          (courseId, lecturerId, lecturerIds, roomId, day, startTime, endTime, studyProgram, classGroup, semester, jpm, weeks)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          courseId,
          lecturerId,
          JSON.stringify(lecturerIds),
          roomId,
          day,
          startTime,
          endTime,
          studyProgram,
          classGroup,
          Number.isFinite(semester) ? semester : null,
          Number.isFinite(jpm) ? jpm : null,
          weeks,
        ]
      );

      inserted++;
    } catch (e) {
      skipped++;
      skipReasons.db_error++;
      console.error("Insert error:", e?.message || e);
    }
  }

  console.log(`Done. inserted=${inserted}, skipped=${skipped}`);
  console.log("Skip reasons:");
  for (const [k, v] of Object.entries(skipReasons)) console.log(`- ${k}: ${v}`);
}

main().catch((e) => {
  console.error("Import failed:", e);
  process.exit(1);
});
