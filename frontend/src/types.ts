
export enum DayOfWeek {
  Senin = 'Senin',
  Selasa = 'Selasa',
  Rabu = 'Rabu',
  Kamis = 'Kamis',
  Jumat = 'Jumat'
}

export const getDayFromDate = (dateString: string): DayOfWeek | null => {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  const dayIndex = date.getDay();
  const dayName = days[dayIndex];
  if (Object.values(DayOfWeek).includes(dayName as DayOfWeek)) {
    return dayName as DayOfWeek;
  }
  return null;
};

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  fullName?: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  building: string;
  type: string; 
}

export interface Item {
  id: string;
  nama_barang: string;
  merek: string;
  tahun_perolehan: string;
  serial_number: string;
  kondisi: 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
  foto?: string;
  keterangan: string;
  ruang: string;
  status_pinjam: 'Tersedia' | 'Dipinjam';
  user_peminjam?: string;
}

export interface ItemBorrowing {
  id: string;
  userId: string;
  itemId: string;
  borrowDate: string;
  returnDate: string;
  purpose: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED';
}

export interface Lecturer {
  id: string;
  nip: string;
  nama: string;
  prodi: string;
  status_kepegawaian: string;
  foto?: string;
  tanggallahir: string;
  nidn: string;
  nuptk: string;
  hp: string;
  email: string;
  alamat: string;
  golongan: string;
  pangkat: string;
  pendidikan: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
}

export interface Schedule {
  id: string;
  courseId: string;
  lecturerId: string;
  roomId: string;
  day: DayOfWeek;
  startTime: string; 
  endTime: string;   
  studyProgram: string;
  classGroup: string;
  semester: number;
  jpm: number;
  weeks?: number[]; // Array minggu aktif, misal [1, 2, ... 16]
  date?: string; 
  isBooking?: boolean;
  bookingPurpose?: string;
  bookingUser?: string;
}

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Database {
  rooms: Room[];
  lecturers: Lecturer[];
  courses: Course[];
  schedules: Schedule[];
  bookings: Booking[];
  items: Item[];
  itemBorrowings: ItemBorrowing[];
  users: User[];
}