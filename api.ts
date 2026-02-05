
import { Database, Booking, ItemBorrowing, User, UserRole, DayOfWeek } from './types';

const DB_KEY = 'eduschedule_db';

// --- DATA DUMMY AWAL (Jika LocalStorage kosong) ---
const INITIAL_DATA: Database = {
  rooms: [
    { id: '1', name: 'R. Teori 1 (Gd. A)', capacity: 40, building: 'Gedung A', type: 'Kelas Teori' },
    { id: '2', name: 'R. Teori 2 (Gd. A)', capacity: 40, building: 'Gedung A', type: 'Kelas Teori' },
    { id: '3', name: 'Lab Komputer 1', capacity: 30, building: 'Gedung B', type: 'Laboratorium' },
    { id: '4', name: 'Auditorium Mini', capacity: 100, building: 'Gedung C', type: 'Auditorium' },
  ],
  lecturers: [
    { 
      id: '1', nip: '198001012005011001', nama: 'Dr. Budi Santoso, M.M.', prodi: 'Administrasi Bisnis', 
      status_kepegawaian: 'PNS', golongan: 'IV/a', pangkat: 'Pembina', pendidikan: 'S3', 
      nidn: '001018001', nuptk: '123456789', hp: '08123456789', email: 'budi@pija.ac.id', alamat: 'Depok', foto: '', tanggallahir: '1980-01-01' 
    },
    { 
      id: '2', nip: '198502022008012002', nama: 'Siti Aminah, S.E., M.Ak.', prodi: 'Akuntansi', 
      status_kepegawaian: 'Tetap', golongan: 'III/c', pangkat: 'Penata', pendidikan: 'S2', 
      nidn: '002028502', nuptk: '987654321', hp: '08987654321', email: 'siti@pija.ac.id', alamat: 'Jakarta', foto: '', tanggallahir: '1985-02-02' 
    }
  ],
  courses: [
    { id: '1', name: 'Pengantar Bisnis', credits: 3 },
    { id: '2', name: 'Akuntansi Dasar', credits: 3 },
    { id: '3', name: 'Manajemen Pemasaran', credits: 2 },
    { id: '4', name: 'Hukum Dagang', credits: 2 }
  ],
  schedules: [
    { 
      id: '1', courseId: '1', lecturerId: '1', roomId: '1', day: DayOfWeek.Senin, 
      startTime: '08:00', endTime: '10:30', studyProgram: 'AB Terapan', classGroup: 'AB-1A', 
      semester: 1, jpm: 150, weeks: [1,2,3,4,5,6,7,8] 
    },
    { 
      id: '2', courseId: '2', lecturerId: '2', roomId: '2', day: DayOfWeek.Selasa, 
      startTime: '10:00', endTime: '12:30', studyProgram: 'Manajemen Keuangan', classGroup: 'MK-3B', 
      semester: 3, jpm: 150, weeks: [1,2,3,4,5,6,7,8] 
    }
  ],
  bookings: [],
  items: [
    { 
      id: '1', nama_barang: 'Proyektor Epson EB-X500', merek: 'Epson', tahun_perolehan: '2023', 
      serial_number: 'EPS-23-001', kondisi: 'Baik', keterangan: 'Aset Prodi AB', ruang: 'Gedung A', status_pinjam: 'Tersedia' 
    },
    { 
      id: '2', nama_barang: 'Kamera DSLR Canon', merek: 'Canon', tahun_perolehan: '2022', 
      serial_number: 'CN-22-555', kondisi: 'Baik', keterangan: 'Dokumentasi', ruang: 'Lab Media', status_pinjam: 'Tersedia' 
    }
  ],
  itemBorrowings: []
};

// Users Dummy (Disimpan terpisah atau digabung, disini kita gabung logika sederhana)
const USERS_KEY = 'eduschedule_users';
const INITIAL_USERS: User[] = [
  { id: '1', username: 'admin', role: UserRole.ADMIN, fullName: 'Administrator' },
  { id: '2', username: 'user', role: UserRole.USER, fullName: 'Mahasiswa Umum' }
];

// Helper untuk simulasi delay network
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Load Database dari LocalStorage
  async getDatabase(): Promise<Database> {
    await delay(300); // Simulasi loading
    const stored = localStorage.getItem(DB_KEY);
    if (!stored) {
      localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_DATA));
      return INITIAL_DATA;
    }
    return JSON.parse(stored);
  },

  // Simpan seluruh state DB
  async saveDatabase(db: Database) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  },

  // Login Mock
  async login(username: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> {
    await delay(500);
    // Hardcoded password check untuk demo
    // Password default: admin/admin atau user/user
    const storedUsers = JSON.parse(localStorage.getItem(USERS_KEY) || JSON.stringify(INITIAL_USERS));
    const user = storedUsers.find((u: any) => u.username === username);

    if (user && password === username) { // Simple logic: password sama dengan username
      return { success: true, user };
    }
    return { success: false, message: 'Username atau password salah (Coba: admin/admin)' };
  },

  async register(data: any): Promise<{ success: boolean; message: string }> {
    await delay(500);
    const storedUsers = JSON.parse(localStorage.getItem(USERS_KEY) || JSON.stringify(INITIAL_USERS));
    if (storedUsers.find((u: any) => u.username === data.username)) {
      throw new Error('Username sudah digunakan');
    }
    const newUser = {
      id: String(Date.now()),
      username: data.username,
      role: UserRole.USER,
      fullName: data.fullName
    };
    storedUsers.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(storedUsers));
    return { success: true, message: 'Registrasi berhasil' };
  },

  // --- CRUD GENERIC ---
  
  async add<T>(type: keyof Database, data: any): Promise<T> {
    await delay(200);
    const db = await this.getDatabase();
    const newItem = { ...data, id: String(Date.now()) };
    
    // Type assertion karena TypeScript butuh kepastian tipe array
    (db[type] as any[]).push(newItem);
    
    await this.saveDatabase(db);
    return newItem as T;
  },

  async delete(type: keyof Database, id: string): Promise<void> {
    await delay(200);
    const db = await this.getDatabase();
    // Filter array
    (db[type] as any[]) = (db[type] as any[]).filter((item: any) => item.id !== id);
    await this.saveDatabase(db);
  },

  // --- SPECIFIC METHODS ---

  async getUsers(): Promise<User[]> {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : INITIAL_USERS;
  },

  async updateUser(id: string, data: any): Promise<void> {
    const users = await this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...data };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  },

  async deleteUser(id: string): Promise<void> {
    let users = await this.getUsers();
    users = users.filter(u => u.id !== id);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  async createBooking(bookingData: any): Promise<Booking> {
    return this.add('bookings', { ...bookingData, status: 'PENDING' }) as Promise<Booking>;
  },

  async updateBookingStatus(id: string, status: 'APPROVED' | 'REJECTED'): Promise<void> {
    const db = await this.getDatabase();
    const booking = db.bookings.find(b => b.id === id);
    if (booking) {
      booking.status = status;
      await this.saveDatabase(db);
    }
  },

  async createItemBorrowing(data: any): Promise<ItemBorrowing> {
    return this.add('itemBorrowings', { ...data, status: 'PENDING' }) as Promise<ItemBorrowing>;
  },

  async updateItemBorrowingStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'RETURNED'): Promise<void> {
    const db = await this.getDatabase();
    const borrowing = db.itemBorrowings.find(b => b.id === id);
    
    if (borrowing) {
      borrowing.status = status;
      
      // Update status item juga
      const item = db.items.find(i => i.id === borrowing.itemId);
      if (item) {
        if (status === 'APPROVED') {
          item.status_pinjam = 'Dipinjam';
          // Cari nama user peminjam (simplified)
          const users = await this.getUsers();
          const user = users.find(u => u.id === borrowing.userId);
          item.user_peminjam = user ? user.fullName : 'Unknown';
        } else if (status === 'RETURNED' || status === 'REJECTED') {
          item.status_pinjam = 'Tersedia';
          item.user_peminjam = undefined;
        }
      }
      
      await this.saveDatabase(db);
    }
  }
};
