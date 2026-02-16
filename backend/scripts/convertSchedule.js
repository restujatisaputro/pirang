import fs from "fs";
import path from "path";
import csv from "csv-parser";

// ganti path file kalau perlu
const CSV_PATH = path.join(process.cwd(), "jdwl.csv"); 
// kalau file ada di folder scripts: path.join(process.cwd(), "scripts", "jdwl.csv")

const weeks = JSON.stringify([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);

// helper: normalisasi header (hapus BOM, trim)
function normalizeHeader({ header }) {
  return header.replace(/^\uFEFF/, "").trim();
}

function normTimeRange(jam) {
  // "07.30 - 08.20" => ["07:30","08:20"]
  const parts = String(jam).split("-").map(s => s.trim());
  if (parts.length < 2) return [null, null];
  return [parts[0].replace(".", ":"), parts[1].replace(".", ":")];
}

const values = [];
const debugFirstRows = [];

fs.createReadStream(CSV_PATH)
  .pipe(csv({ separator: ";", mapHeaders: normalizeHeader }))
  .on("data", (row) => {
    // simpan 3 row pertama untuk debug jika masih salah
    if (debugFirstRows.length < 3) debugFirstRows.push(row);

    const jam = row["Jam"];
    if (!jam) return; // skip baris yang tidak punya jam

    const [startTime, endTime] = normTimeRange(jam);
    if (!startTime || !endTime) return;

    const classGroup = row["kelas"];        // contoh: MICE-A
    const day = row["Hari"];                // Senin
    const studyProgram = String(classGroup || "").split("-")[0] || null; // MICE
    const semester = row["prof"] ? Number(row["prof"]) : null; // kamu pakai prof=2/4 (sementara dipakai sebagai semester)

    const jpm = row["JPM"] ? Number(row["JPM"]) : 0;

    // ====== PENTING ======
    // courseId/lecturerId/roomId itu butuh mapping (dari tabel courses/lecturers/rooms)
    // Untuk sementara kita isi 0 dulu biar convert jalan.
    // Nanti kalau kamu mau mapping otomatis, aku bikinkan versi lookup ke DB.
    const courseId = 0;
    const lecturerId = 0;
    const roomId = 0;

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
      weeks
    ]);
  })
  .on("end", () => {
    if (!values.length) {
      console.log("Tidak ada data yang berhasil diparse. Contoh row terbaca:", debugFirstRows);
      return;
    }

    console.log(
`await pool.query(
  "INSERT INTO schedules(courseId, lecturerId, roomId, day, startTime, endTime, studyProgram, classGroup, semester, jpm, weeks) VALUES ?",
  [[
${values.map(v => "    " + JSON.stringify(v)).join(",\n")}
  ]]
);`
    );
  })
  .on("error", (err) => {
    console.error("Read/parse error:", err);
  });
