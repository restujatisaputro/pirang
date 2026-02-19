import { Database, Booking, ItemBorrowing, User, UserRole, DayOfWeek } from './types';

// --- MOCK DATA INITIALIZATION ---
const INITIAL_DATA = {
  users: [
    { id: '1', username: 'admin', password: 'admin', fullName: 'Administrator Sistem', role: UserRole.ADMIN },
    { id: '2', username: 'mahasiswa', password: 'mahasiswa', fullName: 'Budi Santoso', role: UserRole.USER },
    { id: '3', username: 'dosen', password: 'dosen', fullName: 'Dr. Siti Aminah', role: UserRole.USER }
  ],
  rooms: [
    { id: '1', name: 'R. Teori 1 (Gd. A)', capacity: 40, building: 'Gedung A', type: 'Kelas Teori' },
    { id: '2', name: 'R. Teori 2 (Gd. A)', capacity: 40, building: 'Gedung A', type: 'Kelas Teori' },
    { id: '3', name: 'Lab Komputer 1', capacity: 30, building: 'Gedung B', type: 'Laboratorium' },
    { id: '4', name: 'Auditorium Mini', capacity: 100, building: 'Gedung C', type: 'Auditorium' }
  ],
  lecturers: [
    { 
      id: '1', nip: '19800101', nama: 'Dr. Budi Santoso, M.M.', prodi: 'Administrasi Bisnis', 
      hp: '08123456789', email: 'budi@pija.ac.id',
      foto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80'
    },
    { 
      id: '2', nip: '19850202', nama: 'Siti Aminah, S.E., M.Ak.', prodi: 'Akuntansi', 
      hp: '08987654321', email: 'siti@pija.ac.id',
      foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80'
    },
    { 
      id: '3', nip: '19900303', nama: 'Rahmat Hidayat, S.Kom., M.T.', prodi: 'Manajemen Informatika', 
      hp: '081122334455', email: 'rahmat@pija.ac.id',
      foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80' 
    }
  ],
  courses: [
    { id: '1', code: 'BUS101', name: 'Pengantar Bisnis', credits: 3 },
    { id: '2', code: 'ACC101', name: 'Akuntansi Dasar', credits: 3 },
    { id: '3', code: 'MKT201', name: 'Manajemen Pemasaran', credits: 2 },
    { id: '4', code: 'LAW202', name: 'Hukum Dagang', credits: 2 },
    { id: '5', code: 'COM301', name: 'Aplikasi Komputer Bisnis', credits: 3 }
  ],
  schedules: [
    { 
      id: '1', courseId: '1', lecturerId: '1', roomId: '1', day: DayOfWeek.Senin, 
      startTime: '08:00', endTime: '10:30', studyProgram: 'AB Terapan', 
      classGroup: 'AB-1A', semester: 1, jpm: 150, weeks: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16] 
    },
    { 
      id: '2', courseId: '2', lecturerId: '2', roomId: '2', day: DayOfWeek.Selasa, 
      startTime: '10:00', endTime: '12:30', studyProgram: 'Manajemen Keuangan', 
      classGroup: 'MK-3B', semester: 3, jpm: 150, weeks: [1,2,3,4,5,6,7,8] 
    },
    { 
      id: '3', courseId: '5', lecturerId: '3', roomId: '3', day: DayOfWeek.Rabu, 
      startTime: '13:00', endTime: '15:30', studyProgram: 'AB Terapan', 
      classGroup: 'AB-1B', semester: 1, jpm: 150, weeks: [1,2,3,4,5,6,7,8] 
    }
  ],
  bookings: [
    { 
      id: '1', userId: '2', roomId: '4', date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0], 
      startTime: '09:00', endTime: '12:00', purpose: 'Seminar Mahasiswa', status: 'APPROVED' 
    }
  ],
  items: [
    { 
      id: '1', nama_barang: 'Proyektor Epson EB-X500', merek: 'Epson', tahun_perolehan: '2023', 
      serial_number: 'EPS-23-001', kondisi: 'Baik', keterangan: 'Aset Prodi AB', ruang: 'Gedung A', 
      status_pinjam: 'Tersedia',
      foto: 'https://images.unsplash.com/photo-1517436075966-291771146603?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    { 
      id: '2', nama_barang: 'Kamera DSLR Canon', merek: 'Canon', tahun_perolehan: '2022', 
      serial_number: 'CN-22-555', kondisi: 'Baik', keterangan: 'Dokumentasi', ruang: 'Lab Media', 
      status_pinjam: 'Dipinjam', user_peminjam: 'Member',
      foto: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    { 
      id: '3', nama_barang: 'Sound System Portable', merek: 'Yamaha', tahun_perolehan: '2021', 
      serial_number: 'YM-21-003', kondisi: 'Rusak Ringan', keterangan: 'Mic kadang mati', ruang: 'Gedung C', 
      status_pinjam: 'Tersedia',
      foto: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' 
    }
  ],
  itemBorrowings: [
    {
      id: '1', userId: '2', itemId: '2', borrowDate: new Date().toISOString().split('T')[0], 
      returnDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
      purpose: 'Dokumentasi Acara Kampus', status: 'APPROVED'
    }
  ]
};

// --- LOCAL STORAGE HELPER ---
const STORAGE_KEY = 'eduschedule_data_v1';

const getLocalData = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Initialize with a DEEP COPY of INITIAL_DATA to ensure we don't mutate the const directly
    // and subsequent writes to localStorage work as expected.
    const initialCopy = JSON.parse(JSON.stringify(INITIAL_DATA));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCopy));
    return initialCopy;
  }
  return JSON.parse(stored);
};

const setLocalData = (data: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- API IMPLEMENTATION ---

export const api = {
  async getDatabase(): Promise<Database> {
    await delay(300); 
    const data = getLocalData();
    return {
      rooms: data.rooms,
      lecturers: data.lecturers,
      courses: data.courses,
      schedules: data.schedules,
      bookings: data.bookings,
      items: data.items,
      itemBorrowings: data.itemBorrowings,
      users: data.users
    };
  },

  async login(username: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> {
    await delay(500);
    const data = getLocalData();
    const user = data.users.find((u: any) => u.username === username && u.password === password);
    
    if (user) {
      return { success: true, user: { ...user } }; 
    }
    return { success: false, message: 'Username atau password salah.' };
  },

  async register(registerData: any): Promise<{ success: boolean; message: string }> {
    await delay(500);
    const data = getLocalData();
    
    if (data.users.find((u: any) => u.username === registerData.username)) {
      throw new Error('Username sudah digunakan');
    }

    const newUser = {
      id: String(Date.now()),
      ...registerData,
      role: UserRole.USER
    };
    
    data.users.push(newUser);
    setLocalData(data);
    return { success: true, message: 'Registrasi berhasil' };
  },

  // User Management
  async getUsers(): Promise<User[]> {
    await delay(200);
    return getLocalData().users;
  },

  async updateUser(id: string, updateData: { password?: string, fullName?: string, role?: UserRole }): Promise<void> {
    await delay(200);
    const data = getLocalData();
    const index = data.users.findIndex((u: any) => String(u.id) === String(id));
    if (index !== -1) {
      data.users[index] = { ...data.users[index], ...updateData };
      setLocalData(data);
    }
  },

  async deleteUser(id: string): Promise<void> {
    await delay(200);
    const data = getLocalData();
    // Ensure ID comparison is robust (String vs String)
    const initialLength = data.users.length;
    data.users = data.users.filter((u: any) => String(u.id) !== String(id));
    
    if (data.users.length === initialLength) {
        console.warn(`User with ID ${id} not found.`);
    }
    setLocalData(data);
  },

  // Bookings
  async createBooking(bookingData: any): Promise<Booking> {
    await delay(300);
    const data = getLocalData();
    const newBooking = {
      id: String(Date.now()),
      ...bookingData,
      status: 'PENDING'
    };
    data.bookings.push(newBooking);
    setLocalData(data);
    return newBooking;
  },

  async updateBookingStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING'): Promise<void> {
    await delay(200);
    const data = getLocalData();
    const booking = data.bookings.find((b: any) => String(b.id) === String(id));
    if (booking) {
      booking.status = status;
      setLocalData(data);
    }
  },

  // Item Borrowing
  async createItemBorrowing(borrowData: any): Promise<ItemBorrowing> {
    await delay(300);
    const data = getLocalData();
    const newBorrow = {
      id: String(Date.now()),
      ...borrowData,
      status: 'PENDING'
    };
    data.itemBorrowings.push(newBorrow);
    setLocalData(data);
    return newBorrow;
  },

  async updateItemBorrowingStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'RETURNED'): Promise<void> {
    await delay(200);
    const data = getLocalData();
    const borrow = data.itemBorrowings.find((b: any) => String(b.id) === String(id));
    
    if (borrow) {
      borrow.status = status;
      
      if (status === 'APPROVED' || status === 'RETURNED' || status === 'REJECTED') {
        const itemIndex = data.items.findIndex((i: any) => String(i.id) === String(borrow.itemId));
        if (itemIndex !== -1) {
           const itemStatus = status === 'APPROVED' ? 'Dipinjam' : 'Tersedia';
           const userPeminjam = status === 'APPROVED' ? 'Member' : undefined;
           
           data.items[itemIndex].status_pinjam = itemStatus;
           data.items[itemIndex].user_peminjam = userPeminjam;
        }
      }
      setLocalData(data);
    }
  },

  // General CRUD
  async add(type: string, itemData: any): Promise<any> {
    await delay(200);
    const data = getLocalData();
    const keyMap: {[key: string]: string} = {
        'rooms': 'rooms',
        'lecturers': 'lecturers',
        'courses': 'courses',
        'schedules': 'schedules',
        'items': 'items'
    };
    const dbKey = keyMap[type] || type;
    
    if (!data[dbKey]) {
        throw new Error(`Tabel ${type} tidak ditemukan di penyimpanan lokal`);
    }

    const newItem = {
        id: String(Date.now()),
        ...itemData
    };
    
    data[dbKey].push(newItem);
    setLocalData(data);
    return newItem;
  },

  async update(type: string, id: string, itemData: any): Promise<void> {
    await delay(200);
    const data = getLocalData();
    const keyMap: {[key: string]: string} = {
        'rooms': 'rooms',
        'lecturers': 'lecturers',
        'courses': 'courses',
        'schedules': 'schedules',
        'items': 'items'
    };
    const dbKey = keyMap[type] || type;

    if (data[dbKey]) {
        const index = data[dbKey].findIndex((i: any) => String(i.id) === String(id));
        if (index !== -1) {
            data[dbKey][index] = { ...data[dbKey][index], ...itemData };
            setLocalData(data);
        }
    }
  },

  async delete(type: string, id: string): Promise<void> {
    await delay(200);
    const data = getLocalData();
    const keyMap: {[key: string]: string} = {
        'rooms': 'rooms',
        'lecturers': 'lecturers',
        'courses': 'courses',
        'schedules': 'schedules',
        'items': 'items'
    };
    const dbKey = keyMap[type] || type;

    if (data[dbKey]) {
        // Safe string comparison for ID
        const originalLength = data[dbKey].length;
        data[dbKey] = data[dbKey].filter((i: any) => String(i.id) !== String(id));
        
        if (data[dbKey].length === originalLength) {
            console.warn(`Item with ID ${id} not found in ${dbKey} during delete operation.`);
        }
        
        setLocalData(data);
    } else {
        console.error(`Tabel ${dbKey} tidak ditemukan untuk penghapusan`);
    }
  }
};