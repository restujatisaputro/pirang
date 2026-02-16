import bcrypt from "bcrypt";
import { pool } from "../src/db.js";

async function run() {
  // buat schema dulu (anggap schema sudah dibuat via init.sql atau manual)
  // seed users
  const users = [
    { username: "admin", password: "admin", fullName: "Administrator Sistem", role: "ADMIN" },
    { username: "restu", password: "restu", fullName: "Restu Jati Saputro", role: "ADMIN" }
  ];

  // bersihkan isi (opsional)
  await pool.query("DELETE FROM itemBorrowings");
  await pool.query("DELETE FROM bookings");
  await pool.query("DELETE FROM schedules");
  await pool.query("DELETE FROM courses");
  await pool.query("DELETE FROM lecturers");
  await pool.query("DELETE FROM items");
  await pool.query("DELETE FROM rooms");
  await pool.query("DELETE FROM users");

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    await pool.query(
      "INSERT INTO users(username, password_hash, fullName, role) VALUES(?,?,?,?)",
      [u.username, hash, u.fullName, u.role]
    );
  }

  // rooms
  await pool.query(
  "INSERT INTO rooms(name, capacity, building, type) VALUES ?",
  [[
    ["101 - R baca", 20, "Gedung H", "Lainnya"],
    ["102 - Bisnis Center", 20, "Gedung H", "Laboratorium"],
    ["103", 40, "Gedung H", "Kelas"],
    ["104 - MICE Center", 20, "Gedung H", "Laboratorium"],
    ["105", 40, "Gedung H", "Kelas"],
    ["106", 40, "Gedung H", "Kelas"],
    ["107", 40, "Gedung H", "Kelas"],
    ["108", 40, "Gedung H", "Kelas"],
    ["109 - Ruang Piala", 20, "Gedung H", "Lainnya"],
    ["110 - Lab Logistik", 20, "Gedung H", "Laboratorium"],
    ["111 - Smart Classroom", 40, "Gedung H", "Kelas"],
    ["112", 40, "Gedung H", "Kelas"],
    ["113", 40, "Gedung H", "Kelas"],
    ["114", 40, "Gedung H", "Kelas"],
    ["115", 40, "Gedung H", "Kelas"],
    ["116", 40, "Gedung H", "Kelas"],
    ["117", 40, "Gedung H", "Kelas"],
    ["118 - Ruang Peralatan", 20, "Gedung H", "Lainnya"],
    ["200 - Ruang Pojok", 20, "Gedung H", "Lainnya"],
    ["201", 40, "Gedung H", "Kelas"],
    ["202 - Meeting Room", 20, "Gedung H", "Lainnya"],
    ["203", 40, "Gedung H", "Kelas"],
    ["204 - Model Office", 30, "Gedung H", "Laboratorium"],
    ["205 - Ruang Dosen", 20, "Gedung H", "Lainnya"],
    ["206 - TUK", 20, "Gedung H", "Lainnya"],
    ["207 - Eksekutif", 40, "Gedung H", "Kelas"],
    ["208 - Lab Komputer 1", 30, "Gedung H", "Laboratorium"],
    ["209 - Ruang Dosen", 20, "Gedung H", "Lainnya"],
    ["210 - Ruang Dosen", 20, "Gedung H", "Lainnya"],
    ["211 - Multipurpose", 20, "Gedung H", "Lainnya"],
    ["212 - Ruang Dosen", 20, "Gedung H", "Lainnya"],
    ["213 - Ruang Struktural", 20, "Gedung H", "Lainnya"],
    ["214 - Ruang Kajur", 20, "Gedung H", "Lainnya"],
    ["215 - Musholla", 20, "Gedung H", "Lainnya"],
    ["300 - Ruang Pojok/Gudang", 20, "Gedung H", "Lainnya"],
    ["301 - Lab Komputer 3", 32, "Gedung H", "Laboratorium"],
    ["302", 40, "Gedung H", "Kelas"],
    ["303 - Lab Komputer 2", 32, "Gedung H", "Laboratorium"],
    ["304", 40, "Gedung H", "Kelas"],
    ["305", 40, "Gedung H", "Kelas"],
    ["306", 40, "Gedung H", "Kelas"],
    ["307", 40, "Gedung H", "Kelas"],
    ["308 - Teleconference", 30, "Gedung H", "Lainnya"],
    ["309", 40, "Gedung H", "Kelas"],
    ["310", 40, "Gedung H", "Kelas"],
    ["311 - Musholla", 20, "Gedung H", "Lainnya"],
    ["312", 40, "Gedung H", "Kelas"],
    ["001 - LAB GSG", 30, "Gedung G", "Laboratorium"]
  ]]
);


  // lecturers
await pool.query(
  "INSERT INTO lecturers(nip, nama, prodi, hp, email, foto) VALUES ?",
  [[
    // === AB (Administrasi Bisnis) ===
    ["196309131988031002","Dr. M. Ikhsan, M.Si.","Administrasi Bisnis","081384073325","m.ikhsan@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["197404032001121002","Riza Hadikusuma, M.Ag.","Administrasi Bisnis","08179813065","riza.hadikusuma@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["198007112015041001","Dr. Wahyudi Utomo, S.Sos., M.Si.","Administrasi Bisnis","081908183234","wahyudi.utomo@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["198409132018031001","Taufik Akbar, M.S.M.","Administrasi Bisnis","082123167606","taufik.akbar@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["198609082020122006","Risya Zahrotul Firdaus, M.Si.","Administrasi Bisnis","081282300242","risya.zahrotulfirdaus@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["198801142019031005","Restu Jati Saputro, S.SI., M.Sc.","Administrasi Bisnis","081398123953","restujati.saputro@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199004272025062006","Friscila Purba, M.M.","Administrasi Bisnis","081319349577","friscila.purba@lecturer.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199102062022031005","Fachri Aditya, M.M.","Administrasi Bisnis","081299949389","fachri.aditya@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199411042024062001","Hana Nurdina, S.S.T., M.B.A.","Administrasi Bisnis","081377731775","hana.nurdina@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199508222025062006","Laras Afifah, M.M.","Administrasi Bisnis","085782594894","laras.afifah@lecturer.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199701232025062011","Annisa Nur Hasanah, M.A.B","Administrasi Bisnis","87887844331","annisa.nurhasanah@lecturer.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["196203061990032001","Dra. Mawarta Onida Sinaga, M.Si.","Administrasi Bisnis","081388738673","mawarta.onida@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["196310161990031009","Riskon Ginting, S.E., M.Si.","Administrasi Bisnis","08129545510","riskon.ginting@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["196405071992012001","Dra. Ni Made Widhi Sugianingsih, M.M.","Administrasi Bisnis","082112795710","nm.widhi@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["196410161991031003","Drs. Anwar Mustofa, M.Hum.","Administrasi Bisnis","085312122730","anwar.mustofa@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["196410191989032001","Endah Wartiningsih, S.E., M.M.","Administrasi Bisnis","085714229192","endah.wartiningsih@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["196410221990122001","Dr. Narulita Syarweny, S.E., M.E.","Administrasi Bisnis","085764492491","narulita.syarweni@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],

    // === ABT (Administrasi Bisnis Terapan) ===
    ["198310222015042001","Dr. Nidia Sofa, S.Pd.I., M.Pd.","Administrasi Bisnis Terapan","081360061931","nidia.sofa@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["198711122019032011","Erlyn Rosalina, S.Hum., M.Pd.","Administrasi Bisnis Terapan","085778168896","erlyn.rosalina@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["198807012014041002","Husnil Barry, S.E., M.S.M.","Administrasi Bisnis Terapan","081318183094","husnil.barry71@gmail.com","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199001042019032026","Yanita Ella Nilla Chandra, S.A.B, M.Si.","Administrasi Bisnis Terapan","081901668882","yanitaella.nillachandra@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["197305112024212001","Nuria Puspitasari, S.E., M.Ec.Dev.","Administrasi Bisnis Terapan","082114172121","nuria.puspitasari73@gmail.com","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["198711112022031003","Arizal Putra Pratama, B.O.M., M.A.B","Administrasi Bisnis Terapan","081809977764","arizal.putra.pratama@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199109152022032007","Ratri Kurniasari, M.Ak.","Administrasi Bisnis Terapan","087820283737","ratri.kurniasari@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199209152024061001","Haris Satria Putra, M.M.S.I.","Administrasi Bisnis Terapan","085719001064","haris.satriaputra@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199303052025062008","Adilah Permananingrum, S.E., M.Sc.","Administrasi Bisnis Terapan","08562795959",null,"https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199411092024061001","Yoshua Ardy Putra, S.Si., M.T.","Administrasi Bisnis Terapan","087714434546","yoshua.ardyputra@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199507152024062001","Imas Chandra Pratiwi, M.S.M","Administrasi Bisnis Terapan","087741415757","imas.chandra.pratiwi@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199512272025061007","Irfan Rusydi Triyanto., M.T.","Administrasi Bisnis Terapan","081235309960",null,"https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199806272025061006","Arif Santoso., M.Ak.","Administrasi Bisnis Terapan","081225521479",null,"https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["196501311989032001","Dr. Dra. Iis Mariam, M.Si.","Administrasi Bisnis Terapan","087878640614","iis.mariam@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["196510101991031007","Dr. Syamsurizal, S.E., M.M.","Administrasi Bisnis Terapan","0818981117","syamsurizal@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["196209121988032003","Titik Purwinarti, S.Sos., M.Pd.","Administrasi Bisnis Terapan","08179813052","titik.purwinarti@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["196209301992032001","Dr. Nining Latianingsih, S.H., M.Hum.","Administrasi Bisnis Terapan","082121661082","nining.latianingsih@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["196201261984031001","Dr. Ridwan Roy Tutupoho, S.H., S.E., M.Si.","Administrasi Bisnis Terapan","08985270057","ridwan.roytutupoho@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],

    // === BISPRO (Bisnis Profesional) ===
    ["198109162023212018","Septina Indrayani, S.Pd., M.Tesol.","Bisnis Profesional","081362641718",null,"https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["198204262014041001","Sujiwo Priambodo, S.E., M.M.","Bisnis Profesional","081511061428",null,"https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199103022023212042","Farizka Humolungo, S.Pd., M.A.","Bisnis Profesional","085173157628",null,"https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199208022024062002","Fanny Puji Rakhmi, S.Hum. M.Hum.","Bisnis Profesional","08979719134",null,"https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199309142025062005","Rizki Hardiyanti, M.Hum","Bisnis Profesional","081360980633",null,"https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199603102024061001","Taufik Eryadi Abdillah, S.S., M.Hum.","Bisnis Profesional","085777913537",null,"https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["232022020119860315","Eky Erlanda Edel, S.Pd., M.Pd.","Bisnis Profesional","085375965788",null,"https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["196104121987032004","Dr. Dra. Ina Sukaesih, M.M., M.Hum.","Bisnis Profesional","081281030460","ina.sukaesih@akuntansi.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["196201291988111001","Dr. Drs. Supriatnoko, M.Hum.","Bisnis Profesional","0857710886139","supriatnoko@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["196609161992031002","Dr. Drs. Nur Hasyim, M.Si., M.Hum.","Bisnis Profesional","087877342282","nur.hasyim@akuntansi.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],

    // === MICE ===
    ["196312081991031003","Drs. Heri Setyawan, M.Si.","MICE","081310091121","heri.setyawan@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["197510122008121001","Imam Syafganti, M.Si., P.hD","MICE","08118776806","imam.syafganti@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["198312102018031001","Firman Syah, S.Sos.I., M.M.","MICE","08567170783","firman_tegal@yahoo.com","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["198701232020121004","Muhammad Iqbal Katik R.E., S.ST., MPPar.","MICE","082112841434","muhammad.iqbalkatikrajoendah@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["198804182019031008","Fauzi Mubarak, S.ST., M.T.","MICE","085692444641","fauzi.mubarak@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199111222025062003","Noni Noerkaisar, M.M.","MICE","085695913955","noni.noerkaisar@lecturer.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199205032024062002","Meisa Sofia, S.Tr., M.Par.","MICE","081294925598","meisa.sofia@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199206182025062002","Yuningsih, M.Si.","MICE","08966074443","yuningsih@lecturer.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199512222025062006","Karbala Madania, M.Si.","MICE","082194951300",null,"https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199702072024062003","Raden Ayu Trisnayoni, S.Tr.Par., M.Tr.Pr","MICE","0812367663594","raden.ayutrisnayoni@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["196212111989101001","Rimsky Kartika Judisseno, S.E., M.M., P.hD.","MICE","081280097271","rimsky.judisseno@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["196308031990031002","Sudarno, S.E., M.Si.","MICE","081586336372","sudarnothok@gmail.com","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["196108211988032001","Dr. Etty Khongrat, S.E., M.Si.","MICE","08179813054","etty.khongrad@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["196311151988032002","Dr. Christina Lipuringtyas Rudatin, S.E., M.Si.","MICE","082299602578","christina.lr@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["196206231990031002","Drs. Djuni Akbar, M.Si.","MICE","081295162398","djuni.akbar@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["198708132019032012","Annisa Wardhani, S.ST., M.T.","MICE","08569832717","annisa.wardhani@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],

    // === MICE DEMAK ===
    ["198710302024211008","Mulyono, S.Kom., M.Kom.","MICE DEMAK","085741271887",null,"https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199005152024062001","Mella Narolita, S.Hum., M.A.","MICE DEMAK","0857274440393",null,"https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199103152022032008","Tantri Sari Safitry, S.Pd., M.Pd.","MICE DEMAK","087781950982","tantrisarisafitry@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199208122022032009","Asterina Anggraini, M.M.","MICE DEMAK","08577324388","asterina.anggraini@bisnis.pnj.ac.id","https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199304132023211025","Mochamad Nuruz Zaman, S.Pd., M.Li.","MICE DEMAK",null,null,"https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199509212025062006","Karina Rizka Mentari, M.M.","MICE DEMAK","081226784323",null,"https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199708242025062015","Besya Salsabilla Azani Arif, M.M.","MICE DEMAK","081229200113",null,"https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199812262025062008","Rahmi Fadhella, M.Par","MICE DEMAK","082376685003",null,"https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199901152025062008","Ifta Almazah Suhaya, M.A.","MICE DEMAK","085694584444",null,"https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["199904142024062002","Aulia Restu Ariyanto Putri, M.Par.","MICE DEMAK","081224500740",null,"https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"],
    ["198504302025212028","Dewi Kurniawati, M.Pd.","MICE DEMAK","082137161310",null,"https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"]
  ]]
);



  // courses
await pool.query(
  "INSERT INTO courses(code, name, credits) VALUES ?",
  [[
    // === Mata Kuliah Umum PNJ ===
    ["PNJ101","Pendidikan Agama",2],
    ["PNJ102","Pendidikan Kewarganegaraan",2],
    ["PNJ103","Bahasa Indonesia",2],
    ["PNJ104","Pendidikan Pancasila",2],

    // === AB ===
    ["ANI102","Komunikasi Bisnis 1",2],
    ["ANI103","Korespondensi Niaga Bahasa Indonesia",2],
    ["ANI105","Pengantar Teknologi Informasi",2],
    ["ANI206","Etika Profesi dan Bisnis",2],
    ["ANI408","Public Relations",2],
    ["ANI307","Aspek Hukum dalam Bisnis",2],
    ["ANI809","Manajemen Sumber Daya Manusia",2],
    ["ANI810","Kewirausahaan",2],
    ["ANB101","Bahasa Inggris 1",2],
    ["ANB102","Pengantar Bisnis",2],
    ["ANB103","Dasar Pengetikan",2],
    ["ANB105","Matematika Keuangan",2],
    ["ANB106","Pengantar Akuntansi",2],
    ["ANB107","Pengantar Manajemen",2],
    ["ANB319","Komunikasi Bisnis 2",2],
    ["ANB320","Kecepatan Mengetik",2],
    ["ANB321","Korespondensi Bahasa Inggris",2],
    ["ANB322","Kesekretariatan 2",2],
    ["ANB323","Aplikasi Komputer Lanjutan",2],
    ["ANB326","Statistik Bisnis",2],
    ["ANB327","Komputer Akuntansi",2],
    ["ANB328","Bahasa Mandarin",2],
    ["ANB430","Pemasaran",2],
    ["ANB431","Kearsipan",2],
    ["ANB432","Administrasi Kantor",2],
    ["ANB435","Manajemen Keuangan",2],
    ["ANB436","Pelayanan Prima",2],
    ["ANB437","Bahasa Jepang",2],
    ["ANB438","Bahasa Inggris untuk Bisnis",2],
    ["ANB539","Administrasi Penjualan",2],
    ["ANB540","Perpajakan",2],
    ["ANB541","Manajemen Produksi & Operasi",2],
    ["ANB542","Perdagangan Internasional",2],
    ["ANB543","Bahasa Inggris untuk Komunikasi Publik",2],
    ["ANB544","Teknik Penulisan Laporan",2],
    ["ANB545","Perdagangan Elektronik",2],
    ["ANB547","Simulasi Bisnis",2],
    ["ANB648","Praktek Kerja Lapangan/Magang Industri",20],

    // === ABT ===
    ["ANI123","Basic English",2],
    ["ANI124","Pengantar Bisnis",2],
    ["ABT125","Akuntansi Dagang dan Jasa",3],
    ["ABT126","Pengetikan Bisnis",2],
    ["ABT128","Matematika Keuangan Bisnis",3],
    ["ABT221","Pengantar Ilmu Ekonomi",2],
    ["ABT223","Akuntansi Biaya",2],
    ["ABT227","Pemasaran dan Pelayanan Pelanggan",2],
    ["ABT228","Ilmu Administrasi Bisnis",2],
    ["ABT229","English for Business",2],
    ["ABT230","Pengantar logistik dan supply chain",2],
    ["ABT231","Pengantar Manajemen",2],
    ["ABT322","Manajemen Pemasaran",2],
    ["ABT324","Manajemen Produksi dan operasi",3],
    ["ABT325","Teknologi dan Digital",3],
    ["ABT328","Korespondensi Bisnis Indonesia",2],
    ["ABT333","Ekonomi Manajerial",2],
    ["ABT334","Manajemen transportasi dan MultiModa",3],
    ["ABT335","Perdagangan Internasional",3],
    ["ABT438","Pemasaran Digital",2],
    ["ABT439","Manajemen Pergudangan",3],
    ["ABT440","Perencanaan dan Pengendalian Logistik",2],
    ["ABT441","Manajemen Pengadaan Barang dan Jasa",3],
    ["ABT442","Manajemen Distribusi dan Delivery",3],
    ["ABT443","Manajemen Risiko",2],
    ["ABT422","Manajemen Keuangan",3],
    ["ABT526","Laporan Magang/Laporan Praktik Kerja Industri",8],
    ["ABT544","Teori Pengambilan Keputusan",3],
    ["ABT546","Infrastruktur Logistik",3],
    ["ABT547","Manajemen SDM dan Organisasi Logistik",3],
    ["ABT556","Proses Bisnis Logistik",3],
    ["ABT621","Statistik Bisnis",3],
    ["ABT629","Budgeting",3],
    ["ABT637","Metodologi Penelitian Bisnis Terapan",3],
    ["ABT648","E-Logistics",2],
    ["ABT649","Manajemen Inventory",2],
    ["ABT650","Manajemen Asuransi Transportasi",3],
    ["ABT651","Freight Logistik",3],
    ["ABT726","Laporan Magang/Laporan Praktik Kerja Industri",8],
    ["ABT752","ERP (Entreprise Resource Planning)",3],
    ["ABT753","Bisnis Proses Improvement",3],
    ["ABT754","Keselamatan Kesehatan Kerja",3],
    ["ABT755","Manajemen Project",3],
    ["ABT865","Tugas Akhir (Skripsi)",8],

    // === BISPRO ===
    ["ANI104","Pengantar Administrasi Bisnis",2],
    ["BIS104","Dasar-Dasar Linguistik",2],
    ["BIS105","Kelas Kata Bahasa Inggris",2],
    ["BIS106","Analisis Kalimat Bahasa Inggris",2],
    ["BIS107","Teks Deskriptif Bahasa Inggris",3],
    ["BIS108","Pengantar Penerjemahan",3],
    ["BIS201","Menulis Teks Akademik Dasar (Bahasa Indonesia)",2],
    ["BIS202","Membaca Analitis (Bahasa Inggris)",3],
    ["BIS203","Menulis Teks Akademik Dasar (Bahasa Inggris)",3],
    ["BIS204","Mendengarkan dan Mengungkapkan dalam Bahasa Inggris",3],
    ["BIS205","Takarir",2],
    ["BIS206","Pendalaman Tata Bahasa Indonesia untuk Penerjemahan",2],
    ["BIS207","Pendalaman Tata Bahasa Inggris untuk Penerjemahan",2],
    ["BIS208","Kosa Kata Dwibahasa",2],
    ["BIS301","Menulis Teks Akademik Lanjutan (Bahasa Indonesia)",2],
    ["BIS302","Membaca Kritis",2],
    ["BIS303","Menulis Teks Akademik Lanjutan (Bahasa Inggris)",2],
    ["BIS304","Komunikasi Bisnis Lanjutan",2],
    ["BIS305","Penerjemahan Teks Bisnis Dasar",3],
    ["BIS306","Pengantar Alat Bantu Penerjemahan",2],
    ["BIS307","Penerjemahan Teks Sastra",3],
    ["BIS401","Penerjemahan Teks Akademik",3],
    ["BIS402","Menulis Kreatif Bahasa Indonesia",3],
    ["BIS403","Penerjemahan Teks Jurnalistik Dasar",3],
    ["BIS404","Penerjemahan Dokumen Pribadi",3],
    ["BIS405","Teori Penyuntingan Terjemahan",3],
    ["BIS406","Penerjemahan Teks Bisnis Lanjutan",3],
    ["BIS407","Etika Profesi Penerjemah dan Juru Bahasa",2],
    ["BIS501","Penerjemahan Teks Kenotariatan",3],
    ["BIS502","Praktik Penyuntingan Terjemahan",2],
    ["BIS503","Penerjemahan Teks Peraturan Perundang-undangan",3],
    ["BIS504","Kajian Lintas Budaya",2],
    ["BIS505","Praktik Penjurubahasaan",3],
    ["BIS506","Penerjemahan Teks Jurnalistik Lanjutan",3],
    ["BIS507","Pengembangan Karakter",2],
    ["BIS508","Metodologi Penelitian",2],
    ["BIS601","Merdeka Belajar",20],
    ["BIS602","Penulisan Teks Bisnis",5],
    ["BIS603","Pendalaman Penerjemahan Teks Bisnis",5],
    ["BIS604","Pendalaman Gramatika untuk Penerjemahan",5],
    ["BIS605","Pendalaman Penyuntingan untuk Penerjemahan",5],
    ["BIS701","Magang Industri",20],
    ["BIS801","Seminar",2],
    ["BIS802","Skripsi",8],
    ["BIS803","Mandarin",3],
    ["BIS804","Jepang",3],
    ["BIS805","Arab",3],

    // === MICE ===
    ["ANI101","Bahasa Inggris 1",2],
    ["MIC108","Pengantar Bisnis MICE",2],
    ["MIC111","Kebijakan Pariwisata Nasional",2],
    ["MIC209","Bahasa Inggris 2",2],
    ["MIC210","Dasar-dasar Akuntansi",2],
    ["MIC213","Praktik Perkantoran",2],
    ["MIC216","Keprotokolan",2],
    ["MIC231","Manajemen Logistik MICE",2],
    ["MIC232","Registrasi",2],
    ["MIC264","Geografi Destinasi Pariwisata",2],
    ["MIC265","Pengantar Marketing",2],
    ["MIC319","Bahasa Inggris 3",2],
    ["MIC320","Bahasa Jepang 1",2],
    ["MIC321","Site Inspection",2],
    ["MIC326","Anggaran Kegiatan MICE",2],
    ["MIC327","Bidding",2],
    ["MIC328","Statistik",2],
    ["MIC333","Manajemen Proyek MICE",2],
    ["MIC335","Event Technology",2],
    ["MIC366","Pemprograman Web Statis",2],
    ["MIC422","CIQ (Custom Immigration Quarantine)",2],
    ["MIC423","Desain Grafis",2],
    ["MIC429","Bahasa Inggris 4",2],
    ["MIC430","Bahasa Jepang 2",2],
    ["MIC439","Bahasa Mandarin 1",2],
    ["MIC440","Manajemen Keuangan",2],
    ["MIC446","Pemprograman Web Dinamis",2],
    ["MIC457","Self Manajemen dan Interperspnal Skill",2],
    ["MIC467","Perencanaan Incentive Travel",2],
    ["MIC515","Special Event (Kegiatan Khusus)",2],
    ["MIC534","Event Marketing & Sponsorship",2],
    ["MIC545","Teknik Pengambilan Keputusan",2],
    ["MIC544","Perencanaan Konvensi",2],
    ["MIC548","Perencanaan Pameran",2],
    ["MIC549","Bahasa Mandarin 2",2],
    ["MIC552","Manajemen Risiko",2],
    ["MIC553","Penelitian dan Pengembangan",2],
    ["MIC555","Event Korporasi (Corporate Event)",2],
    ["MIC562","Pemasaran Destinasi",2],
    ["MIC651","Penyelenggaraan Pameran (MBKM)",6],
    ["MIC637","Penyelenggaraan Konvensi (MBKM)",6],
    ["MIC675","Penerapan Manajemen Proyek Pameran/Konvensi",4],
    ["MIC676","Pengelolaan Acara dalam Pameran/Konvensi",4],
    ["MIC677","Pengelolaan Produksi Pameran/Konvensi",4],
    ["MIC678","Pengelolaan Pemasaran Pameran/Konvensi",4],
    ["MIC679","Pengelolaan Lokasi Penyelenggaraan Pameran/Konvensi",4],
    ["MIC680","Pengelolaan Kesekretariatan Pameran/Konvensi",4],
    ["MIC775","Magang",6],
    ["MIC776","Laporan Magang",6],
    ["MIC777","Presentasi Laporan Magang",3],
    ["MIC778","Penerapan Rencana Pengelolaan Acara / Event Management Plan Implementation",3],
    ["MIC779","Penerapan Manajemen Diri / Self Management Implementation",2],
    ["MIC710","PROGRAM MBKM (Magang/Studi Independen/Kampus Mengajar/IISMA/PMM/KKN/Proyek Kemanusiaan/Riset)",20],
    ["MIC860","Manajemen Strategik",2],
    ["MIC863","Rancangan Bisnis",8],

    // === MICE DEMAK ===
    ["MCE106","Pengantar MICE",2],
    ["MCE107","Kebijakan Pariwisata Nasional",2],
    ["MCE202","Bahasa Inggris 2",2],
    ["MCE203","Dasar-dasar Akuntansi",2],
    ["MCE204","Geografi Destinasi Pariwisata",2],
    ["MCE205","Keprotokolan",2],
    ["MCE206","Praktik Perkantoran",2],
    ["MCE207","Pengantar Marketing",2],
    ["MCE208","Registrasi",2],
    ["MCE209","Manajemen Logistik MICE",2],
    ["MCE302","Bahasa Inggris 3",2],
    ["MCE303","Bahasa Jepang 1",2],
    ["MCE304","Bidding",2],
    ["MCE305","Site Inspection",2],
    ["MCE306","Pemprograman Web Statis",2],
    ["MCE307","Anggaran Kegiatan MICE",2],
    ["MCE308","Event Technology",2],
    ["MCE309","Statistik",2],
    ["MCE310","Manajemen Proyek MICE",2],
    ["MCE401","Bahasa Inggris 4",2],
    ["MCE402","CIQ (Custom Immigration Quarantine)",2],
    ["MCE403","Perencanaan Incentive Travel",2],
    ["MCE404","Pemprograman Web Dinamis",2],
    ["MCE406","Desain Grafis",2],
    ["MCE407","Bahasa Mandarin I",2],
    ["MCE408","Bahasa Jepang 2",2],
    ["MCE409","Manajemen Keuangan",2],
    ["MCE410","Self Manajemen dan Interpersonal Skill",2],
    ["MCE501","Bahasa Mandarin 2",2],
    ["MCE502","Teknik Pengambilan Keputusan",2],
    ["MCE503","Perencanaan Konvensi",2],
    ["MCE504","Manajemen Risiko",2],
    ["MCE505","Penelitian dan Pengembangan",2],
    ["MCE506","Pemasaran Destinasi",2],
    ["MCE507","Event Korporasi (Corporate Event)",2],
    ["MCE508","Perencanaan Pameran",2],
    ["MCE509","Event Marketing & Sponsorship",2],
    ["MCE510","Special Event (Kegiatan Khusus)",2],
    ["MCE601","Penyelenggaraan Pameran (MBKM)",6],
    ["MCE602","Penyelenggaraan Konvensi (MBKM)",6],
    ["MCE603","Penerapan Manajemen Proyek Pameran/Konvensi",4],
    ["MCE604","Pengelolaan Acara dalam Pameran/Konvensi",4],
    ["MCE605","Pengelolaan Produksi Pameran/Konvensi",4],
    ["MCE606","Pengelolaan Pemasaran Pameran/Konvensi",4],
    ["MCE607","Pengelolaan Lokasi Penyelenggaraan Pameran/Konvensi",4],
    ["MCE608","Pengelolaan Kesekretariatan Pameran/Konvensi",4],
    ["MCE701","Magang",6],
    ["MCE702","Laporan Magang",6],
    ["MCE703","Presentasi Laporan Magang",3],
    ["MCE704","Penerapan Rencana Pengelolaan Acara / Event Management Plan Implementation",3],
    ["MCE705","Penerapan Manajemen Diri / Self Management Implementation",2],
    ["MCE700","PROGRAM MBKM (Magang/Studi Independen/Kampus Mengajar/IISMA/PMM/KKN/Proyek Kemanusiaan/Riset)",20],
    ["MCE801","Manajemen Strategik",2],
    ["MCE802","Rancangan Bisnis",8]
  ]]
);


  // schedules (weeks disimpan sebagai JSON string)
// await pool.query(
//   "INSERT INTO schedules(courseId, lecturerId, roomId, day, startTime, endTime, studyProgram, classGroup, semester, jpm, weeks) VALUES ?",
//   [[
//     [0,0,0,"Senin","07:30","08:20","MICE","MICE-A",2,4,"[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]"],
//     [0,0,0,"Jumat","16:05","16:55","MICE DEMAK","MICE DEMAK-A",8,4,"[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]"]
//   ]]
// );

  // items
  await pool.query(
    "INSERT INTO items(nama_barang, merek, tahun_perolehan, serial_number, kondisi, keterangan, ruang, status_pinjam, user_peminjam, foto) VALUES ?",
    [[
      ["Proyektor Epson EB-X500", "Epson", "2023", "EPS-23-001", "Baik", "Aset Prodi AB", "Gedung A", "Tersedia", null,
        "https://images.unsplash.com/photo-1517436075966-291771146603?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"],
      ["Kamera DSLR Canon", "Canon", "2022", "CN-22-555", "Baik", "Dokumentasi", "Lab Media", "Dipinjam", "Member",
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"],
      ["Sound System Portable", "Yamaha", "2021", "YM-21-003", "Rusak Ringan", "Mic kadang mati", "Gedung C", "Tersedia", null,
        "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"]
    ]]
  );

  // bookings (contoh: user mahasiswa id=2 booking room auditorium id=4)
  const today = new Date();
  const d2 = new Date(today); d2.setDate(today.getDate() + 2);
  const dateStr = d2.toISOString().split("T")[0];

  await pool.query(
    "INSERT INTO bookings(userId, roomId, date, startTime, endTime, purpose, status) VALUES (?,?,?,?,?,?,?)",
    [2, 4, dateStr, "09:00", "12:00", "Seminar Mahasiswa", "APPROVED"]
  );

  // itemBorrowings (mahasiswa pinjam item kamera id=2)
  const borrowDate = today.toISOString().split("T")[0];
  const d3 = new Date(today); d3.setDate(today.getDate() + 3);
  const returnDate = d3.toISOString().split("T")[0];

  await pool.query(
    "INSERT INTO itemBorrowings(userId, itemId, borrowDate, returnDate, purpose, status) VALUES (?,?,?,?,?,?)",
    [2, 2, borrowDate, returnDate, "Dokumentasi Acara Kampus", "APPROVED"]
  );

  console.log("✅ Seed selesai.");
  process.exit(0);
}

run().catch((e) => {
  console.error("❌ Seed gagal:", e);
  process.exit(1);
});
