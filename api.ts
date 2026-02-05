
import { Database, Room, Lecturer, Course, Schedule, DayOfWeek, User, UserRole, Booking, Item, ItemBorrowing } from './types';

const API_BASE_URL = 'http://localhost:3001/api';
const STORAGE_KEY = 'pija_local_db';
const USER_STORAGE_KEY = 'pija_users'; // Key khusus untuk user di offline mode

// --- Local Storage Helper for Offline Mode ---
const getLocalDb = (): Database => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  const initial: Database = {
    rooms: [
      { id: '1', name: 'R. 101', capacity: 40, building: 'Gedung A', type: 'Ruang Kelas' },
      { id: '2', name: 'Lab Komputer', capacity: 30, building: 'Gedung C', type: 'Laboratorium' },
      { id: '3', name: 'Aula Utama', capacity: 200, building: 'Gedung B', type: 'Aula' }
    ],
    lecturers: [
      { 
        id: '1', 
        nip: '198001012005011001',
        nama: 'Dr. Budi Santoso, M.Kom', 
        prodi: 'Teknik Informatika',
        status_kepegawaian: 'PNS',
        foto: '',
        tanggallahir: '1980-01-01',
        nidn: '0401018001',
        nuptk: '1234567890123456',
        hp: '081234567890',
        email: 'budi@university.ac.id',
        alamat: 'Jl. Pendidikan No. 1',
        golongan: 'IV/a',
        pangkat: 'Pembina',
        pendidikan: 'S3'
      },
      { 
        id: '2', 
        nip: '199002022015012001',
        nama: 'Siti Aminah, M.T', 
        prodi: 'Sistem Informasi',
        status_kepegawaian: 'Tetap Yayasan',
        foto: '',
        tanggallahir: '1990-02-02',
        nidn: '0402029001',
        nuptk: '9876543210987654',
        hp: '081987654321',
        email: 'siti@university.ac.id',
        alamat: 'Jl. Kampus No. 5',
        golongan: '-',
        pangkat: 'Lektor',
        pendidikan: 'S2'
      }
    ],
    courses: [
      { id: '1', name: 'Pemrograman Web', credits: 3 },
      { id: '2', name: 'Basis Data', credits: 4 }
    ],
    schedules: [],
    bookings: [],
    items: [
      { id: '1', nama_barang: 'Proyektor Epson', merek: 'Epson', tahun_perolehan: '2023', serial_number: 'EPS-001', kondisi: 'Baik', keterangan: 'Inventaris Lab', ruang: 'Lab Komputer', status_pinjam: 'Tersedia' },
      { id: '2', nama_barang: 'Kamera DSLR', merek: 'Canon', tahun_perolehan: '2022', serial_number: 'CAM-99', kondisi: 'Baik', keterangan: 'Inventaris UKM', ruang: 'Gedung C', status_pinjam: 'Tersedia' }
    ],
    itemBorrowings: []
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

// Helper for Users in Offline Mode
const getLocalUsers = (): any[] => {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    const initialUsers = [
        { id: '1', username: 'admin', password: 'admin', role: UserRole.ADMIN, fullName: 'Administrator' },
        { id: '2', username: 'user', password: 'user', role: UserRole.USER, fullName: 'Mahasiswa' }
    ];
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(initialUsers));
    return initialUsers;
}

const saveLocalUsers = (users: any[]) => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
}

const saveLocalDb = (db: Database) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

const mapIdToString = (item: any) => ({ ...item, id: String(item.id) });

let isOffline = false;

export const api = {
  async getDatabase(): Promise<Database> {
    try {
      const [rooms, lecturers, courses, schedules, bookings, items, itemBorrowings] = await Promise.all([
        fetch(`${API_BASE_URL}/rooms`).then(r => r.json()),
        fetch(`${API_BASE_URL}/lecturers`).then(r => r.json()),
        fetch(`${API_BASE_URL}/courses`).then(r => r.json()),
        fetch(`${API_BASE_URL}/schedules`).then(r => r.json()),
        fetch(`${API_BASE_URL}/bookings`).then(r => r.json()),
        fetch(`${API_BASE_URL}/items`).then(r => r.json()),
        fetch(`${API_BASE_URL}/item-borrowings`).then(r => r.json())
      ]);

      isOffline = false;

      return {
        rooms: rooms.map(mapIdToString),
        lecturers: lecturers.map(mapIdToString),
        courses: courses.map(mapIdToString),
        schedules: schedules.map((s: any) => ({
            ...mapIdToString(s),
            courseId: String(s.courseId),
            lecturerId: String(s.lecturerId),
            roomId: String(s.roomId),
            weeks: typeof s.weeks === 'string' ? JSON.parse(s.weeks) : s.weeks
        })),
        bookings: bookings.map((b: any) => ({
            ...mapIdToString(b),
            userId: String(b.userId),
            roomId: String(b.roomId)
        })),
        items: items.map(mapIdToString),
        itemBorrowings: itemBorrowings.map((b: any) => ({
            ...mapIdToString(b),
            userId: String(b.userId),
            itemId: String(b.itemId)
        }))
      };
    } catch (error) {
      console.warn("Backend unavailable, switching to local storage mode.");
      isOffline = true;
      return getLocalDb();
    }
  },

  async login(username: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> {
    if (isOffline) {
        const users = getLocalUsers();
        const found = users.find(u => u.username === username && u.password === password);
        if (found) {
            return { success: true, user: { id: found.id, username: found.username, role: found.role, fullName: found.fullName } };
        }
        return { success: false, message: 'Offline Mode: Username atau password salah' };
    }

    const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success && data.user) {
        return { success: true, user: { ...data.user, id: String(data.user.id) } };
    }
    throw new Error(data.message || 'Login failed');
  },

  async register(data: any): Promise<{ success: boolean; message: string }> {
    if (isOffline) {
        const users = getLocalUsers();
        if (users.find(u => u.username === data.username)) {
            throw new Error('Username sudah digunakan');
        }
        users.push({ id: String(Date.now()), ...data, role: UserRole.USER });
        saveLocalUsers(users);
        return { success: true, message: 'Registrasi berhasil (Offline)' };
    }
    const res = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.success) return result;
    throw new Error(result.message || 'Registration failed');
  },

  // User Management
  async getUsers(): Promise<User[]> {
    if (isOffline) {
        const users = getLocalUsers();
        // Remove password before returning
        return users.map(({ password, ...u }) => ({ ...u }));
    }
    const res = await fetch(`${API_BASE_URL}/users`);
    const data = await res.json();
    return data.map(mapIdToString);
  },

  async updateUser(id: string, data: { password?: string, fullName?: string }): Promise<void> {
    if (isOffline) {
        const users = getLocalUsers();
        const idx = users.findIndex(u => u.id === id);
        if (idx > -1) {
            users[idx] = { ...users[idx], ...data };
            saveLocalUsers(users);
        }
        return;
    }
    await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
  },

  async deleteUser(id: string): Promise<void> {
    if (isOffline) {
        let users = getLocalUsers();
        users = users.filter(u => u.id !== id);
        saveLocalUsers(users);
        return;
    }
    await fetch(`${API_BASE_URL}/users/${id}`, { method: 'DELETE' });
  },

  async createBooking(bookingData: any): Promise<Booking> {
    if (isOffline) {
        const db = getLocalDb();
        const newBooking = { id: String(Date.now()), status: 'PENDING', ...bookingData };
        db.bookings.push(newBooking);
        saveLocalDb(db);
        return newBooking as Booking;
    }
    const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
    });
    const data = await res.json();
    return { ...mapIdToString(data), userId: String(data.userId), roomId: String(data.roomId) };
  },

  async updateBookingStatus(id: string, status: 'APPROVED' | 'REJECTED'): Promise<void> {
    if (isOffline) {
        const db = getLocalDb();
        const booking = db.bookings.find(b => b.id === id);
        if (booking) {
            booking.status = status;
            saveLocalDb(db);
        }
        return;
    }
    await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
  },

  async createItemBorrowing(data: any): Promise<ItemBorrowing> {
    if (isOffline) {
        const db = getLocalDb();
        const newBorrowing = { id: String(Date.now()), status: 'PENDING', ...data };
        db.itemBorrowings.push(newBorrowing);
        saveLocalDb(db);
        return newBorrowing as ItemBorrowing;
    }
    const res = await fetch(`${API_BASE_URL}/item-borrowings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const result = await res.json();
    return { ...mapIdToString(result), userId: String(result.userId), itemId: String(result.itemId) };
  },

  async updateItemBorrowingStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'RETURNED', adminUser?: string): Promise<void> {
    if (isOffline) {
        const db = getLocalDb();
        const borrowing = db.itemBorrowings.find(b => b.id === id);
        if (borrowing) {
            borrowing.status = status;
            
            // Update item status in offline mode
            const item = db.items.find(i => i.id === borrowing.itemId);
            if (item) {
                if (status === 'APPROVED') {
                    item.status_pinjam = 'Dipinjam';
                    item.user_peminjam = 'Member';
                } else if (status === 'RETURNED' || status === 'REJECTED') {
                    item.status_pinjam = 'Tersedia';
                    item.user_peminjam = undefined;
                }
            }
            saveLocalDb(db);
        }
        return;
    }
    await fetch(`${API_BASE_URL}/item-borrowings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminUser })
    });
  },

  async add<T>(type: string, data: any): Promise<T> {
    if (isOffline) {
        const db = getLocalDb();
        const newId = String(Date.now());
        const newItem = { id: newId, ...data };
        
        // Ensure the type exists on the database object
        if ((db as any)[type] && Array.isArray((db as any)[type])) {
            (db as any)[type].push(newItem);
            saveLocalDb(db);
            return newItem as T;
        }
        throw new Error(`Offline storage error: Unknown table ${type}`);
    }

    const res = await fetch(`${API_BASE_URL}/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const result = await res.json();
    return mapIdToString(result) as T;
  },

  async delete(type: string, id: string): Promise<void> {
    if (isOffline) {
        const db = getLocalDb();
        if ((db as any)[type] && Array.isArray((db as any)[type])) {
            (db as any)[type] = (db as any)[type].filter((item: any) => item.id !== id);
            saveLocalDb(db);
            return;
        }
        return;
    }
    await fetch(`${API_BASE_URL}/${type}/${id}`, { method: 'DELETE' });
  }
};
