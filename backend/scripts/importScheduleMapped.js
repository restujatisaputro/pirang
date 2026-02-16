import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { pool } from "../src/db.js";

/** === SET PATH CSV ===
 * Taruh jdwl.csv di folder backend (sejajar package.json),
 * lalu jalankan script dari folder backend.
 */
const CSV_PATH = path.join(process.cwd(), "jdwl.csv");

// default minggu perkuliahan
const WEEKS_16 = JSON.stringify([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);

/** Normalisasi header (hapus BOM + trim) */
function normalizeHeader({ header }) {
  return header.replace(/^\uFEFF/, "").trim();
}

/** Normalisasi string untuk matching */
function norm(s) {
  return String(s ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[().,]/g, "")
    .trim();
}

/** Ambil jam: "07.30 - 08.20" -> ["07:30","08:20"] */
function parseTimeRange(jam) {
  const parts = String(jam).split("-").map((x) => x.trim());
  if (parts.length < 2) return [null, null];
  return [parts[0].replace(".", ":"), parts[1].replace(".", ":")];
}

/** Room code: "201" -> "H201" , "117" -> "H117" */
function roomKey(roomRaw) {
  const r = String(roomRaw ?? "").trim();
  if (!r || r.toLowerCase() === "x") return null;

  // angka murni: 201 => H201
  if (/^\d+$/.test(r)) return `h${r.padStart(3, "0")}`;

  // kalau sudah Hxxx
  if (/^h\d{3}$/i.test(r)) return r.toLowerCase();

  // selain itu: "LAB 1", "minicon", dll -> pakai norm untuk contains
  return norm(r);
}

/** Ambil nama dosen pertama jika ada 2 dosen: "A/B" -> "A" */
function firstLecturerName(dosenRaw) {
  const s = String(dosenRaw ?? "").trim();
  if (!s) return "";
  return s.split("/")[0].trim();
}

/** Buang gelar agar matching lebih stabil */
function stripTitlesAndDegrees(name) {
  const s = String(name ?? "")
    .replace(/\b(dr|dra|drs|prof)\b\.?/gi, "")
    .replace(/\b(se|ssi|sos|hum|kom|pd|spt|st|s\.tr|tr|mt|m\.t|mm|msi|m\.si|mba|mpar|m\.par|phd|ph\.d)\b\.?/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  return s;
}

/** Skor kemiripan sederhana berdasarkan token overlap */
function tokenScore(a, b) {
  const ta = new Set(norm(a).split(" ").filter(Boolean));
  const tb = new Set(norm(b).split(" ").filter(Boolean));
  if (ta.size === 0 || tb.size === 0) return 0;
  let hit = 0;
  for (const t of ta) if (tb.has(t)) hit++;
  return hit / Math.max(ta.size, tb.size);
}

async function buildLookups() {
  // rooms: pakai prefix "H201" (case-insensitive)
  const [rooms] = await pool.query(`SELECT id, name FROM rooms`);
  const roomByPrefix = new Map(); // key: "h201" => id
  for (const r of rooms) {
    const name = String(r.name ?? "");
    const m = name.match(/^(H\d{3})/i); // ambil prefix H###
    if (m) roomByPrefix.set(m[1].toLowerCase(), r.id);
  }

  // courses: minimal SELECT id,name,code (sesuaikan kalau kolom code ada)
  // Jika tabel courses kamu hanya punya name, tetap bisa (lihat fallback).
  let courses = [];
  try {
    const [rows] = await pool.query(`SELECT id, name, code FROM courses`);
    courses = rows;
  } catch {
    const [rows] = await pool.query(`SELECT id, name FROM courses`);
    courses = rows;
  }
  const courseByName = new Map(); // norm(name) => id
  for (const c of courses) {
    courseByName.set(norm(c.name), c.id);
    if (c.code) courseByName.set(norm(c.code), c.id);
  }

  // lecturers
  const [lecturers] = await pool.query(`SELECT id, nama FROM lecturers`);
  // simpan list untuk fuzzy match
  const lecturerList = lecturers.map((l) => ({
    id: l.id,
    nama: String(l.nama ?? ""),
    key: norm(stripTitlesAndDegrees(l.nama)),
  }));

  return { roomByPrefix, courseByName, lecturerList };
}

function findCourseId(courseByName, mataKuliah) {
  const key = norm(mataKuliah);
  if (courseByName.has(key)) return courseByName.get(key);

  // fallback: coba variasi kecil (mis. public relation(s))
  const alt = key
    .replace(/\bpublic relation\b/g, "public relations")
    .replace(/\bpemprograman\b/g, "pemrograman");
  if (courseByName.has(alt)) return courseByName.get(alt);

  return null;
}

function findLecturerId(lecturerList, dosenRaw) {
  const dosen = stripTitlesAndDegrees(firstLecturerName(dosenRaw));
  const key = norm(dosen);
  if (!key) return null;

  // exact match by normalized key
  const exact = lecturerList.find((l) => l.key === key);
  if (exact) return exact.id;

  // fuzzy: pilih skor token overlap tertinggi
  let best = { id: null, score: 0 };
  for (const l of lecturerList) {
    const s = tokenScore(key, l.key);
    if (s > best.score) best = { id: l.id, score: s };
  }

  // threshold agar tidak salah pasang
  return best.score >= 0.55 ? best.id : null;
}

function findRoomId(roomByPrefix, ruangRaw) {
  const key = roomKey(ruangRaw);
  if (!key) return null;

  // kalau key = h201/h117 -> prefix match
  if (/^h\d{3}$/.test(key)) {
    return roomByPrefix.get(key) ?? null;
  }

  // selain itu (LAB 1, minicon, dll) -> tidak ada mapping pasti dari prefix
  // (opsional: bisa dibuat mapping manual)
  return null;
}

async function main() {
  const { roomByPrefix, courseByName, lecturerList } = await buildLookups();

  const values = [];
  const unresolved = []; // simpan yang gagal mapping

  await new Promise((resolve, reject) => {
    fs.createReadStream(CSV_PATH)
      .pipe(csv({ separator: ";", mapHeaders: normalizeHeader }))
      .on("data", (row) => {
        const jam = row["Jam"];
        if (!jam) return;

        const [startTime, endTime] = parseTimeRange(jam);
        if (!startTime || !endTime) return;

        const classGroup = row["kelas"];            // MICE-A / MICE-B / dst
        const day = row["Hari"];                    // Senin, dst
        const studyProgram = String(classGroup || "").split("-")[0] || null;

        // "prof" pada CSV kamu: 2/4 (kalau itu semester, OK; kalau bukan, ubah di sini)
        const semester = row["prof"] ? Number(row["prof"]) : null;

        const jpm = row["JPM"] ? Number(row["JPM"]) : 0;

        const courseId = findCourseId(courseByName, row["Mata Kuliah"]);
        const lecturerId = findLecturerId(lecturerList, row["Dosen"]);
        const roomId = findRoomId(roomByPrefix, row["Ruang"]);

        if (!courseId || !lecturerId || !roomId) {
          unresolved.push({
            kelas: classGroup,
            hari: day,
            jam,
            mk: row["Mata Kuliah"],
            dosen: row["Dosen"],
            ruang: row["Ruang"],
            courseId,
            lecturerId,
            roomId,
          });
          // tetap boleh insert meski roomId null? tergantung schema
          // kalau kolom kamu NOT NULL, sebaiknya SKIP biar tidak gagal insert massal
          return;
        }

        values.push([
          courseId,
          lecturerId,
          roomId,
          day,
          startTime,
          endTime,
          studyProgram,
          classGroup,
          semester,
          jpm,
          WEEKS_16,
        ]);
      })
      .on("end", resolve)
      .on("error", reject);
  });

  console.log("Rows ready to insert:", values.length);
  console.log("Rows unresolved (skipped):", unresolved.length);

  // tampilkan 20 contoh yang gagal mapping
  if (unresolved.length) {
    console.log("=== UNRESOLVED SAMPLE (first 20) ===");
    console.log(unresolved.slice(0, 20));
  }

  if (!values.length) {
    console.log("Tidak ada row yang bisa diinsert karena mapping gagal.");
    process.exit(0);
  }

  // Optional: bersihkan dulu schedules agar tidak dobel
  // await pool.query("TRUNCATE TABLE schedules");

  const [result] = await pool.query(
    `INSERT INTO schedules
      (courseId, lecturerId, roomId, day, startTime, endTime, studyProgram, classGroup, semester, jpm, weeks)
     VALUES ?`,
    [values]
  );

  console.log("Inserted:", result.affectedRows);
  process.exit(0);
}

main().catch((e) => {
  console.error("IMPORT ERROR:", e);
  process.exit(1);
});
