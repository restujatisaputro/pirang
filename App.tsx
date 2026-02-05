
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  Search, Calendar, User as UserIcon, MapPin, Settings, Plus, Trash2, Clock, 
  Menu, Loader2, AlertCircle, BookOpen, LogOut, LogIn, Lock, ShieldCheck, 
  Globe, ChevronRight, GraduationCap, WifiOff, Filter, X, ChevronDown, 
  Book, Users, Award, ClipboardList, Send, Package, Box, Tag, Camera, Check, XCircle, UserPlus, RotateCcw, Info, Coffee, Flag, KeyRound, Database as DatabaseIcon
} from 'lucide-react';
import { Database, DayOfWeek, Schedule, Room, Lecturer, Course, User, UserRole, Booking, Item, ItemBorrowing, getDayFromDate } from './types';
import { api } from './api';

// --- SidebarLink Component ---
interface SidebarLinkProps {
  item: any;
  isActive: boolean;
  onClick: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ item, isActive, onClick }) => {
  const Icon = item.icon;
  return (
    <Link to={item.path} onClick={onClick} className={`flex items-center justify-between px-5 py-3 rounded-2xl transition-all duration-300 group ${isActive ? 'sidebar-active-item text-white font-bold' : 'text-teal-50 hover:text-white hover:bg-white/5'}`}>
      <div className="flex items-center gap-4">
        <Icon size={18} className={isActive ? 'text-white' : 'text-teal-200/50 group-hover:text-teal-100'} />
        <span className="text-sm tracking-wide">{item.label}</span>
      </div>
      {isActive && <ChevronRight size={14} />}
    </Link>
  );
};

// --- Sidebar Component ---
const Sidebar = ({ isOpen, toggle, user, onLogout }: { isOpen: boolean, toggle: () => void, user: User | null, onLogout: () => void }) => {
  const location = useLocation();
  
  const publicItems = [
    { path: '/', label: 'Jadwal & Pencarian', icon: Calendar },
    { path: '/empty-rooms', label: 'Cek Status Ruangan', icon: MapPin },
    { path: '/inventory', label: 'Inventaris Barang', icon: Package },
  ];

  const userItems = [
    { path: '/my-requests', label: 'Permintaan Saya', icon: ClipboardList },
    { path: '/settings', label: 'Pengaturan Akun', icon: Settings },
  ];

  const adminItems = [
    { path: '/admin', label: 'Manajemen Data', icon: Settings },
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm" onClick={toggle} />}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 academic-gradient text-white z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-500 ease-out flex flex-col border-r border-teal-900/20 shadow-2xl lg:shadow-none`}>
        <div className="p-8">
          <div className="mb-8 flex flex-col items-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl mb-4 group overflow-hidden">
               <GraduationCap className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-serif font-bold text-white tracking-tight leading-none">JURUSAN <span className="text-teal-200 italic font-medium">ADMINISTRASI NIAGA</span></h1>
              <p className="text-[9px] uppercase tracking-[0.3em] text-teal-100/60 mt-1 font-bold">Politeknik Negeri Jakarta</p>
            </div>
          </div>
          <div className="h-px w-full bg-white/10 mb-8"></div>
          
          <nav className="space-y-1 flex-1 overflow-y-auto max-h-[calc(100vh-300px)] lg:max-h-full">
            <p className="text-[9px] font-bold text-teal-200/40 uppercase tracking-widest mb-2 px-5">Menu Utama</p>
            {publicItems.map((item) => (
              <SidebarLink key={item.path} item={item} isActive={location.pathname === item.path} onClick={toggle} />
            ))}

            {user && (
              <>
                <p className="text-[9px] font-bold text-teal-200/40 uppercase tracking-widest mt-6 mb-2 px-5">Member Area</p>
                {userItems.map((item) => (
                  <SidebarLink key={item.path} item={item} isActive={location.pathname === item.path} onClick={toggle} />
                ))}
              </>
            )}

            {user?.role === UserRole.ADMIN && (
              <>
                <p className="text-[9px] font-bold text-teal-200/40 uppercase tracking-widest mt-6 mb-2 px-5">Control Panel</p>
                {adminItems.map((item) => (
                  <SidebarLink key={item.path} item={item} isActive={location.pathname === item.path} onClick={toggle} />
                ))}
              </>
            )}
          </nav>
        </div>

        <div className="p-8 mt-auto border-t border-white/10 bg-black/5">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-lg bg-teal-400/20 flex items-center justify-center text-teal-200 font-bold text-xs uppercase">
                  {user.username[0]}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold truncate">{user.fullName || user.username}</p>
                  <p className="text-[9px] text-teal-200/50 uppercase tracking-widest">{user.role}</p>
                </div>
              </div>
              <button onClick={onLogout} className="w-full flex items-center gap-3 px-5 py-3 text-white hover:bg-rose-500/20 rounded-2xl transition-all font-medium border border-white/10">
                <LogOut size={16} /> <span className="text-sm">Log Out</span>
              </button>
            </div>
          ) : (
            <Link to="/login" onClick={toggle} className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-white text-[#008787] rounded-2xl transition-all font-bold text-sm shadow-xl">
              <LogIn size={16} /> Login Portal
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};

// --- User Settings Component ---
const UserSettings = ({ user }: { user: User }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleUpdate = async () => {
    if (password !== confirmPassword) {
      setMessage({ text: 'Konfirmasi password tidak cocok', type: 'error' });
      return;
    }
    if (password.length < 4) {
      setMessage({ text: 'Password minimal 4 karakter', type: 'error' });
      return;
    }

    try {
      await api.updateUser(user.id, { password });
      setMessage({ text: 'Password berhasil diperbarui', type: 'success' });
      setPassword('');
      setConfirmPassword('');
    } catch (e) {
      setMessage({ text: 'Gagal memperbarui password', type: 'error' });
    }
  };

  return (
    <div className="space-y-8 md:space-y-10 animate-academic">
      <header className="border-b border-slate-200 pb-6 md:pb-10">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight">Pengaturan Akun</h2>
        <p className="text-slate-500 mt-3 text-base md:text-lg italic font-serif">Kelola keamanan dan informasi akun Anda.</p>
      </header>

      <div className="bg-white p-6 md:p-10 rounded-[2rem] border border-slate-100 luxury-shadow max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-[#008787] text-2xl font-bold uppercase border border-teal-100">
            {user.username[0]}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{user.fullName}</h3>
            <p className="text-slate-500 text-sm">@{user.username} • {user.role}</p>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Lock size={18} className="text-[#008787]" /> Ganti Password
          </h4>
          
          {message && (
            <div className={`p-4 rounded-xl border flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
              {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
              <span className="text-sm font-bold">{message.text}</span>
            </div>
          )}

          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password Baru</label>
              <input 
                type="password" 
                placeholder="Masukkan password baru" 
                className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:border-[#008787] transition-all"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Konfirmasi Password</label>
              <input 
                type="password" 
                placeholder="Ulangi password baru" 
                className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:border-[#008787] transition-all"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            onClick={handleUpdate}
            className="w-full md:w-auto px-8 py-4 bg-[#008787] text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            <KeyRound size={16} /> Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

// --- User Manager (Admin) ---
const UserManager = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      await api.deleteUser(id);
      fetchUsers();
    }
  };

  const handleUpdate = async () => {
    if (editUser && newPassword) {
      await api.updateUser(editUser.id, { password: newPassword });
      alert('Password user berhasil diubah.');
      setEditUser(null);
      setNewPassword('');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-3xl font-serif font-bold text-slate-900">Manajemen User</h3>
        <p className="text-slate-400 text-sm">Kelola akses pengguna sistem.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map(u => (
          <div key={u.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 luxury-shadow flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg ${u.role === 'ADMIN' ? 'bg-rose-500' : 'bg-[#008787]'}`}>
                {u.username[0].toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{u.fullName}</h4>
                <p className="text-xs text-slate-400 uppercase tracking-widest">{u.role}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-50 flex gap-2">
              <button 
                onClick={() => setEditUser(u)} 
                className="flex-1 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
              >
                <KeyRound size={12}/> Reset Pass
              </button>
              <button 
                onClick={() => handleDelete(u.id)} 
                className="flex-1 py-2 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={12}/> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {editUser && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-8 rounded-[2.5rem] animate-academic">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif font-bold text-slate-900">Reset Password User</h3>
              <button onClick={() => {setEditUser(null); setNewPassword('');}} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
            </div>
            <p className="text-sm text-slate-500 mb-4">Mengubah password untuk user: <b>{editUser.username}</b></p>
            <input 
              type="text" 
              placeholder="Password Baru" 
              className="w-full p-4 mb-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-[#008787]"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <button 
              onClick={handleUpdate}
              disabled={!newPassword}
              className="w-full py-4 bg-[#008787] text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:shadow-lg disabled:opacity-50 transition-all"
            >
              Simpan Password Baru
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Inventory View ---
const InventoryView = ({ db, user, refresh }: { db: Database, user: User | null, refresh: () => void }) => {
  const [search, setSearch] = useState('');
  const [filterRoom, setFilterRoom] = useState('');
  const [borrowModal, setBorrowModal] = useState<Item | null>(null);
  const [borrowForm, setBorrowForm] = useState({ date: new Date().toISOString().split('T')[0], return: '', purpose: '' });

  const filteredItems = useMemo(() => {
    return db.items.filter(item => {
      const matchSearch = item.nama_barang.toLowerCase().includes(search.toLowerCase()) || 
                          item.merek.toLowerCase().includes(search.toLowerCase()) ||
                          item.serial_number.toLowerCase().includes(search.toLowerCase());
      const matchRoom = filterRoom === '' || item.ruang === filterRoom;
      return matchSearch && matchRoom;
    });
  }, [db.items, search, filterRoom]);

  const uniqueRooms = useMemo(() => {
    return Array.from(new Set(db.items.map(i => i.ruang)));
  }, [db.items]);

  const handleBorrowRequest = async () => {
    if (!user) return alert('Silakan login terlebih dahulu.');
    if (!borrowForm.return || !borrowForm.purpose) return alert('Mohon lengkapi formulir.');

    // Validasi Tanggal: Tanggal kembali tidak boleh sebelum tanggal pinjam
    if (new Date(borrowForm.return) < new Date(borrowForm.date)) {
        return alert('Tanggal pengembalian tidak boleh lebih awal dari tanggal peminjaman.');
    }

    try {
      await api.createItemBorrowing({
        userId: user.id,
        itemId: borrowModal?.id,
        borrowDate: borrowForm.date,
        returnDate: borrowForm.return,
        purpose: borrowForm.purpose
      });
      alert('Permintaan peminjaman berhasil dikirim! Silakan cek status di menu Member Area.');
      setBorrowModal(null);
      refresh();
    } catch (e) {
      alert('Gagal mengirim permintaan.');
    }
  };

  return (
    <div className="space-y-8 md:space-y-10 animate-academic">
      <header className="border-b border-slate-200 pb-6 md:pb-10">
        <div className="flex items-center gap-2 text-[#008787] mb-2">
          <Package size={18} />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Asset Inventory</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight">Inventaris Barang</h2>
        <p className="text-slate-500 mt-3 text-base md:text-lg italic font-serif">Data sarana dan prasarana penunjang akademik Universitas.</p>
      </header>

      <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 luxury-shadow flex flex-col md:flex-row gap-4 md:gap-6 items-stretch md:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Cari nama barang, merek, atau S/N..." 
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none focus:border-[#008787] transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative md:w-64">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <select 
            className="w-full pl-12 pr-10 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none focus:border-[#008787] appearance-none"
            value={filterRoom}
            onChange={(e) => setFilterRoom(e.target.value)}
          >
            <option value="">Semua Ruang</option>
            {uniqueRooms.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>
      </div>

      <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden luxury-shadow hover:border-teal-200 transition-all group flex flex-col">
            <div className="h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden">
              {item.foto ? (
                <img src={item.foto} alt={item.nama_barang} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <Box size={48} className="text-slate-300" strokeWidth={1} />
              )}
              <div className="absolute top-4 right-4">
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-lg ${item.status_pinjam === 'Tersedia' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                  {item.status_pinjam}
                </span>
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <p className="text-[10px] font-bold text-[#008787] uppercase tracking-widest mb-2 flex items-center gap-2">
                <Tag size={12}/> {item.merek} • {item.tahun_perolehan}
              </p>
              <h4 className="text-xl font-serif font-bold text-slate-900 mb-2">{item.nama_barang}</h4>
              <p className="text-slate-400 text-xs mb-6 line-clamp-2 italic">"{item.keterangan}"</p>
              
              <div className="space-y-3 pt-6 border-t border-slate-50 mt-auto">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">S/N</span>
                  <span className="font-bold text-slate-700">{item.serial_number}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Kondisi</span>
                  <span className={`font-bold ${item.kondisi === 'Baik' ? 'text-emerald-600' : 'text-rose-600'}`}>{item.kondisi}</span>
                </div>
                {item.status_pinjam === 'Dipinjam' ? (
                  <div className="mt-4 p-3 bg-rose-50 rounded-xl border border-rose-100">
                    <p className="text-[9px] font-bold text-rose-400 uppercase tracking-widest">Peminjam</p>
                    <p className="text-xs font-bold text-rose-700 flex items-center gap-2 mt-1">
                      <UserIcon size={12}/> {item.user_peminjam}
                    </p>
                  </div>
                ) : (
                  <button 
                    onClick={() => setBorrowModal(item)}
                    className="w-full py-3 bg-[#008787] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest mt-4 shadow-xl shadow-teal-900/10 hover:-translate-y-1 transition-all"
                  >
                    Pinjam Barang
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {borrowModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] animate-academic max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-2xl font-serif font-bold text-slate-900">Pinjam Barang</h3>
               <button onClick={() => setBorrowModal(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
             </div>
             
             <div className="space-y-6">
                <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100 flex gap-4 items-center">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                    <Box className="text-[#008787]" size={20}/>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#008787] uppercase tracking-widest">Barang Terpilih</p>
                    <p className="font-bold text-slate-700">{borrowModal.nama_barang}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tgl Pinjam</label>
                    <input type="date" className="w-full p-4 rounded-xl border border-slate-100 bg-slate-50 text-sm" value={borrowForm.date} onChange={e => setBorrowForm({...borrowForm, date: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estimasi Kembali</label>
                    <input type="date" className="w-full p-4 rounded-xl border border-slate-100 bg-slate-50 text-sm" value={borrowForm.return} onChange={e => setBorrowForm({...borrowForm, return: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Keperluan</label>
                  <textarea 
                    className="w-full p-4 rounded-xl border border-slate-100 bg-slate-50 text-sm min-h-[100px]" 
                    placeholder="Sebutkan alasan peminjaman..."
                    value={borrowForm.purpose}
                    onChange={e => setBorrowForm({...borrowForm, purpose: e.target.value})}
                  />
                </div>

                <button 
                  onClick={handleBorrowRequest}
                  className="w-full py-4 bg-[#008787] text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-3"
                >
                  <Send size={16}/> Kirim Permintaan
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- User Dashboard ---
const UserRequestsPage = ({ db, user, refresh }: { db: Database, user: User | null, refresh: () => void }) => {
  const myBookings = useMemo(() => db.bookings.filter(b => b.userId === user?.id), [db.bookings, user]);
  const myBorrowings = useMemo(() => db.itemBorrowings.filter(b => b.userId === user?.id), [db.itemBorrowings, user]);

  return (
    <div className="space-y-12 animate-academic">
      <header className="border-b border-slate-200 pb-10">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight">Permintaan Saya</h2>
        <p className="text-slate-500 mt-3 text-base md:text-lg italic font-serif">Monitoring status peminjaman ruang dan inventaris.</p>
      </header>

      <section className="space-y-8">
        <div className="flex items-center gap-3 text-[#008787]">
          <MapPin size={24}/>
          <h3 className="text-2xl font-serif font-bold">Booking Ruangan</h3>
        </div>
        <div className="grid gap-6">
          {myBookings.map(b => (
            <div key={b.id} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 luxury-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex gap-6 items-center">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shrink-0"><MapPin size={20}/></div>
                <div>
                  <h4 className="font-bold text-slate-800">{db.rooms.find(r => r.id === b.roomId)?.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{b.date} • {b.startTime} - {b.endTime}</p>
                </div>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${b.status === 'APPROVED' ? 'bg-emerald-500 text-white' : b.status === 'REJECTED' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'}`}>
                {b.status}
              </span>
            </div>
          ))}
          {myBookings.length === 0 && <p className="text-slate-400 italic">Belum ada booking ruangan.</p>}
        </div>
      </section>

      <section className="space-y-8 pt-8 border-t border-slate-100">
        <div className="flex items-center gap-3 text-[#008787]">
          <Package size={24}/>
          <h3 className="text-2xl font-serif font-bold">Peminjaman Barang</h3>
        </div>
        <div className="grid gap-6">
          {myBorrowings.map(b => (
            <div key={b.id} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 luxury-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex gap-6 items-center">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shrink-0"><Box size={20}/></div>
                <div>
                  <h4 className="font-bold text-slate-800">{db.items.find(i => i.id === b.itemId)?.nama_barang}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{b.borrowDate} s/d {b.returnDate}</p>
                </div>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${b.status === 'APPROVED' ? 'bg-emerald-500 text-white' : b.status === 'REJECTED' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'}`}>
                {b.status}
              </span>
            </div>
          ))}
          {myBorrowings.length === 0 && <p className="text-slate-400 italic">Belum ada peminjaman barang.</p>}
        </div>
      </section>
    </div>
  );
};

// --- Generic Entity Manager ---
const EntityManager = ({ title, items, fields, onAdd, onDelete, db }: any) => {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<any>({});
  
  const handleAdd = async () => {
    // Logic khusus untuk konversi range minggu ke array
    if (title === 'Jadwal' && (form.weekStart || form.weekEnd)) {
       const start = parseInt(form.weekStart) || 1;
       const end = parseInt(form.weekEnd) || 16;
       // Buat array minggu, misal start=1 end=8 -> [1,2,3,4,5,6,7,8]
       const weeksArray = Array.from({length: (end - start) + 1}, (_, i) => start + i);
       
       const payload = { ...form, weeks: weeksArray };
       delete payload.weekStart;
       delete payload.weekEnd;
       
       await onAdd(payload);
    } else {
       await onAdd(form);
    }
    setShowAdd(false); 
    setForm({}); 
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">Database {title}</h3>
        <button onClick={() => setShowAdd(!showAdd)} className="px-6 py-3 bg-[#008787] text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all">
          {showAdd ? <X size={16}/> : <Plus size={16} />} {showAdd ? 'Batal' : 'Tambah Baru'}
        </button>
      </div>

      {showAdd && (
        <div className="p-6 md:p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-academic">
          {fields.map((f: any) => (
            <div key={f.key} className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{f.label}</label>
              {f.type === 'select' ? (
                <select className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:border-[#008787]" value={form[f.key] || ''} onChange={e => setForm({...form, [f.key]: e.target.value})}>
                  <option value="">Pilih {f.label}</option>
                  {(f.options || []).map((opt: any) => (
                    <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
                  ))}
                </select>
              ) : (
                <input type={f.type || 'text'} placeholder={f.label} className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:border-[#008787]" value={form[f.key] || ''} onChange={e => setForm({...form, [f.key]: e.target.value})} />
              )}
            </div>
          ))}
          <button onClick={handleAdd} className="lg:col-span-3 py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest">Simpan Data</button>
        </div>
      )}

      <div className="overflow-x-auto rounded-[2rem] border border-slate-100">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-slate-50/80 border-b">
            <tr>
              {fields.filter((f: any) => f.key !== 'courseId' && f.key !== 'lecturerId' && f.key !== 'roomId' && f.key !== 'weekStart' && f.key !== 'weekEnd').map((f: any) => (
                <th key={f.key} className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{f.label}</th>
              ))}
              {title === 'Jadwal' && (
                <>
                  <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Matkul / Dosen / Ruang</th>
                  <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Minggu Aktif</th>
                </>
              )}
              <th className="p-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((i: any) => (
              <tr key={i.id} className="group hover:bg-slate-50 transition-colors">
                {fields.filter((f: any) => f.key !== 'courseId' && f.key !== 'lecturerId' && f.key !== 'roomId' && f.key !== 'weekStart' && f.key !== 'weekEnd').map((f: any) => (
                  <td key={f.key} className="p-6 text-sm font-medium text-slate-600">{i[f.key] || '-'}</td>
                ))}
                {title === 'Jadwal' && db && (
                  <>
                    <td className="p-6 text-xs text-slate-500">
                      <p className="font-bold text-slate-800">{db.courses.find((c: any) => c.id === i.courseId)?.name}</p>
                      <p>{db.lecturers.find((l: any) => l.id === i.lecturerId)?.nama}</p>
                      <p className="italic text-[#008787]">{db.rooms.find((r: any) => r.id === i.roomId)?.name}</p>
                    </td>
                    <td className="p-6 text-xs text-slate-500 max-w-xs truncate">
                       {i.weeks ? (
                         i.weeks.length === 16 ? 'Full (1-16)' : i.weeks.join(', ')
                       ) : 'All'}
                    </td>
                  </>
                )}
                <td className="p-6 text-right">
                  <button onClick={() => onDelete(i.id)} className="p-2 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 size={18}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Booking Manager ---
const BookingManager = ({ bookings, rooms, refresh }: any) => {
  const handleStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await api.updateBookingStatus(id, status);
      alert(`Reservasi berhasil di-${status === 'APPROVED' ? 'setujui' : 'tolak'}.`);
      refresh();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <h3 className="text-3xl font-serif font-bold text-slate-900">Persetujuan Reservasi Ruangan</h3>
        <p className="text-slate-400 text-sm">Verifikasi permohonan penggunaan ruangan oleh civitas akademika.</p>
      </div>
      
      <div className="grid gap-6">
        {bookings.map((b: any) => (
          <div key={b.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center group hover:bg-white hover:border-[#008787]/20 transition-all duration-300 gap-6">
             <div className="flex gap-6 items-center">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm shrink-0">
                  <MapPin className="text-[#008787]" size={28}/>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-bold text-slate-300"># {b.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                      b.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      b.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                      'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg">{rooms.find((r:any)=>r.id===b.roomId)?.name}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-xs text-slate-500 flex items-center gap-1"><Calendar size={12}/> {b.date}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12}/> {b.startTime} - {b.endTime}</p>
                  </div>
                  <p className="text-xs italic mt-3 text-slate-400 font-serif">" {b.purpose} "</p>
                </div>
             </div>
             
             {b.status === 'PENDING' && (
               <div className="flex gap-3 w-full md:w-auto">
                 <button onClick={() => handleStatus(b.id, 'APPROVED')} className="flex-1 md:flex-none px-6 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-emerald-500/10 hover:scale-105 transition-all flex items-center justify-center gap-2">
                   <Check size={14}/> Setujui
                 </button>
                 <button onClick={() => handleStatus(b.id, 'REJECTED')} className="flex-1 md:flex-none px-6 py-3 bg-rose-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-rose-500/10 hover:scale-105 transition-all flex items-center justify-center gap-2">
                   <XCircle size={14}/> Tolak
                 </button>
               </div>
             )}
          </div>
        ))}
        {bookings.length === 0 && (
          <div className="py-12 text-center text-slate-300 italic font-serif">Belum ada data reservasi.</div>
        )}
      </div>
    </div>
  );
};

// --- Admin Panel Component ---
const AdminPanel = ({ db, refresh }: { db: Database, refresh: () => void }) => {
  const [activeTab, setActiveTab] = useState<'rooms' | 'lecturers' | 'courses' | 'schedules' | 'bookings' | 'items' | 'item-loans' | 'users'>('rooms');

  const tabs = [
    { id: 'rooms', label: 'Ruangan', icon: MapPin },
    { id: 'lecturers', label: 'Dosen', icon: UserIcon },
    { id: 'courses', label: 'Matkul', icon: BookOpen },
    { id: 'items', label: 'Inventaris', icon: Box },
    { id: 'schedules', label: 'Jadwal', icon: Calendar },
    { id: 'bookings', label: 'Booking Ruang', icon: ClipboardList },
    { id: 'item-loans', label: 'Pinjam Barang', icon: Package },
    { id: 'users', label: 'Manajemen User', icon: Users },
  ] as const;

  return (
    <div className="space-y-10 animate-academic">
      <header className="border-b border-slate-200 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight">Control Panel</h2>
          <p className="text-slate-500 mt-3 text-base md:text-lg italic font-serif">manajemen data.</p>
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-3xl border border-slate-200 overflow-x-auto max-w-full w-full md:w-auto no-scrollbar">
          {tabs.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#008787] text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] border border-slate-100 luxury-shadow">
        {activeTab === 'item-loans' && (
          <div className="space-y-10">
             <div className="flex flex-col gap-2">
               <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">Modul Pengembalian Barang</h3>
               <p className="text-slate-400 text-sm">Kelola siklus peminjaman dan pastikan inventaris kembali tepat waktu.</p>
             </div>
             
             <div className="grid gap-8">
               <div className="space-y-6">
                 <h4 className="text-[10px] font-extrabold text-[#008787] uppercase tracking-[0.3em] flex items-center gap-2">
                   <AlertCircle size={14}/> Permintaan Peminjaman Baru
                 </h4>
                 <div className="grid gap-4">
                   {db.itemBorrowings.filter(b => b.status === 'PENDING').map(b => {
                     const item = db.items.find(i => i.id === b.itemId);
                     return (
                       <div key={b.id} className="p-6 md:p-8 bg-slate-50 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center group hover:bg-white hover:border-[#008787]/20 transition-all duration-300 gap-6">
                         <div className="flex gap-6 items-center">
                           <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm shrink-0">
                             <Package className="text-[#008787]" size={28}/>
                           </div>
                           <div>
                             <div className="flex items-center gap-3 mb-1">
                               <span className="text-[10px] font-bold text-slate-300"># {b.id}</span>
                               <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border bg-amber-50 text-amber-600 border-amber-100">MENUNGGU</span>
                             </div>
                             <h4 className="font-bold text-slate-800 text-lg">{item?.nama_barang}</h4>
                             <p className="text-xs text-slate-500 italic">" {b.purpose} "</p>
                           </div>
                         </div>
                         <div className="flex gap-3 w-full md:w-auto">
                           <button onClick={async () => { await api.updateItemBorrowingStatus(b.id, 'APPROVED'); refresh(); }} className="flex-1 md:flex-none px-6 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-emerald-500/10 hover:scale-105 transition-all flex items-center justify-center"><Check size={16}/></button>
                           <button onClick={async () => { await api.updateItemBorrowingStatus(b.id, 'REJECTED'); refresh(); }} className="flex-1 md:flex-none px-6 py-3 bg-rose-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-rose-500/10 hover:scale-105 transition-all flex items-center justify-center"><XCircle size={16}/></button>
                         </div>
                       </div>
                     );
                   })}
                   {db.itemBorrowings.filter(b => b.status === 'PENDING').length === 0 && <p className="text-slate-300 italic text-sm py-4">Tidak ada permintaan peminjaman baru.</p>}
                 </div>
               </div>

               <div className="space-y-6 pt-6 border-t border-slate-100">
                 <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                   <Clock size={14}/> Peminjaman Aktif (Sedang Dipinjam)
                 </h4>
                 <div className="grid gap-4">
                   {db.itemBorrowings.filter(b => b.status === 'APPROVED').map(b => {
                     const item = db.items.find(i => i.id === b.itemId);
                     return (
                       <div key={b.id} className="p-6 md:p-8 bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center group luxury-shadow gap-6">
                         <div className="flex gap-6 items-center">
                           <div className="w-16 h-16 bg-teal-50 rounded-3xl flex items-center justify-center shadow-sm shrink-0">
                             <Box className="text-[#008787]" size={28}/>
                           </div>
                           <div>
                             <div className="flex items-center gap-3 mb-1">
                               <span className="text-[10px] font-bold text-slate-300"># {b.id}</span>
                               <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-600 border-emerald-100">DIPINJAM</span>
                             </div>
                             <h4 className="font-bold text-slate-800 text-lg">{item?.nama_barang}</h4>
                             <p className="text-xs text-slate-500">Estimasi Kembali: <span className="font-bold text-rose-500">{b.returnDate}</span></p>
                           </div>
                         </div>
                         <button onClick={async () => { await api.updateItemBorrowingStatus(b.id, 'RETURNED'); refresh(); }} className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-[#008787] transition-all">
                           <RotateCcw size={14}/> Tandai Dikembalikan
                         </button>
                       </div>
                     );
                   })}
                   {db.itemBorrowings.filter(b => b.status === 'APPROVED').length === 0 && <p className="text-slate-300 italic text-sm py-4">Tidak ada peminjaman aktif.</p>}
                 </div>
               </div>
             </div>
          </div>
        )}
        
        {activeTab === 'users' && <UserManager />}

        {activeTab === 'items' && (
          <EntityManager 
            title="Barang" 
            items={db.items} 
            fields={[
              { key: 'nama_barang', label: 'Nama Barang' },
              { key: 'merek', label: 'Merek' },
              { key: 'serial_number', label: 'S/N' },
              { key: 'ruang', label: 'Ruang' },
              { key: 'status_pinjam', label: 'Status' }
            ]} 
            onAdd={(data: any) => api.add('items', { ...data, status_pinjam: 'Tersedia' }).then(refresh)} 
            onDelete={(id: string) => api.delete('items', id).then(refresh)} 
          />
        )}
        
        {activeTab === 'rooms' && (
          <EntityManager title="Ruangan" items={db.rooms} fields={[{key:'name', label:'Nama'}, {key:'capacity', label:'Kapasitas', type:'number'}, {key:'building', label:'Gedung'}]} onAdd={(d:any)=>api.add('rooms',d).then(refresh)} onDelete={(id:any)=>api.delete('rooms',id).then(refresh)} />
        )}
        {activeTab === 'lecturers' && (
          <EntityManager 
            title="Dosen" 
            items={db.lecturers} 
            fields={[
              { key: 'nip', label: 'NIP' },
              { key: 'nama', label: 'Nama Lengkap' },
              { key: 'prodi', label: 'Prodi' },
              { key: 'status_kepegawaian', label: 'Status Kepegawaian' },
              { key: 'golongan', label: 'Golongan' },
              { key: 'pangkat', label: 'Pangkat' },
              { key: 'pendidikan', label: 'Pendidikan Terakhir' },
              { key: 'nidn', label: 'NIDN' },
              { key: 'nuptk', label: 'NUPTK' },
              { key: 'tanggallahir', label: 'Tanggal Lahir', type: 'date' },
              { key: 'hp', label: 'No. HP' },
              { key: 'email', label: 'Email' },
              { key: 'alamat', label: 'Alamat' },
              { key: 'foto', label: 'URL Foto' }
            ]} 
            onAdd={(d:any)=>api.add('lecturers',d).then(refresh)} 
            onDelete={(id:any)=>api.delete('lecturers',id).then(refresh)} 
          />
        )}
        {activeTab === 'courses' && <EntityManager title="Matkul" items={db.courses} fields={[{key:'name', label:'Nama'}, {key:'credits', label:'SKS', type:'number'}]} onAdd={(d:any)=>api.add('courses',d).then(refresh)} onDelete={(id:any)=>api.delete('courses',id).then(refresh)} />}
        {activeTab === 'schedules' && (
          <EntityManager 
            title="Jadwal" 
            items={db.schedules} 
            db={db}
            fields={[
              { key: 'day', label: 'Hari Rutin', type: 'select', options: Object.values(DayOfWeek) },
              { key: 'date', label: 'Tanggal (Opsional)', type: 'date' },
              { key: 'weekStart', label: 'Mulai Minggu Ke- (1-16)', type: 'number' },
              { key: 'weekEnd', label: 'Sampai Minggu Ke- (1-16)', type: 'number' },
              { key: 'courseId', label: 'Matkul', type: 'select', options: db.courses.map(c => ({ value: c.id, label: c.name })) },
              { key: 'lecturerId', label: 'Dosen', type: 'select', options: db.lecturers.map(l => ({ value: l.id, label: l.nama })) },
              { key: 'roomId', label: 'Ruangan', type: 'select', options: db.rooms.map(r => ({ value: r.id, label: r.name })) },
              { key: 'startTime', label: 'Jam Mulai', type: 'time' },
              { key: 'endTime', label: 'Jam Selesai', type: 'time' },
              { key: 'classGroup', label: 'Kelas' },
              { key: 'studyProgram', label: 'Prodi' },
              { key: 'semester', label: 'Sms', type: 'number' },
              { key: 'jpm', label: 'JPM', type: 'number' }
            ]} 
            onAdd={(d:any) => api.add('schedules', d).then(refresh)} 
            onDelete={(id:any) => api.delete('schedules', id).then(refresh)} 
          />
        )}
        {activeTab === 'bookings' && <BookingManager bookings={db.bookings} rooms={db.rooms} refresh={refresh} />}
      </div>
    </div>
  );
};

// --- ScheduleCard Component (Extracted) ---
interface ScheduleCardProps {
  s: any;
  conflicts: Set<string>;
  db: Database;
  globalSearch: boolean;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ s, conflicts, db, globalSearch }) => {
    const isConflicting = conflicts.has(s.id);
    const course = db.courses.find(c => c.id === s.courseId);
    const lecturer = db.lecturers.find(l => l.id === s.lecturerId);
    const room = db.rooms.find(r => r.id === s.roomId);

    return (
      <div className={`bg-white p-6 md:p-8 rounded-[2rem] border luxury-shadow flex flex-col gap-4 group transition-all duration-300 relative overflow-hidden h-full ${isConflicting ? 'border-rose-500 bg-rose-50/50' : s.isBooking ? 'border-indigo-100 bg-indigo-50/10' : 'border-slate-100 hover:border-teal-200'}`}>
        {!globalSearch && (
           <div className={`absolute top-0 right-0 px-6 py-1 text-white text-[9px] font-bold uppercase tracking-widest rounded-bl-3xl shadow-lg ${s.isBooking ? 'bg-indigo-600' : s.date ? 'bg-amber-600' : 'bg-[#008787]'}`}>
              {s.isBooking ? 'RESERVASI' : s.date ? 'KHUSUS' : 'RUTIN'}
           </div>
        )}
        
        <div className="w-full">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`text-[9px] font-extrabold px-2 py-1 rounded-full uppercase tracking-wider ${isConflicting ? 'bg-rose-500 text-white' : s.isBooking ? 'bg-indigo-600 text-white' : 'bg-teal-50 text-[#008787]'}`}>{s.classGroup}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[120px]">{s.studyProgram}</span>
            {isConflicting && <div className="flex items-center gap-1 px-2 py-1 bg-rose-100 text-rose-600 rounded-full text-[8px] font-extrabold uppercase animate-pulse border border-rose-200"><AlertCircle size={10}/> BENTROK</div>}
          </div>
          <h4 className={`font-serif font-bold text-lg leading-tight mb-3 transition-colors ${isConflicting ? 'text-rose-900' : s.isBooking ? 'text-indigo-900' : 'text-slate-900 group-hover:text-[#008787]'}`}>{s.isBooking ? (s.bookingPurpose || 'Keperluan Umum') : (course?.name || 'Mata Kuliah')}</h4>
          <div className="flex flex-col gap-2 text-slate-500 text-xs">
             <div className="flex items-center gap-2">
               <UserIcon size={12} className={s.isBooking ? 'text-indigo-600' : 'text-[#008787]'}/>
               <span className="font-semibold text-slate-700 truncate">{s.isBooking ? 'Peminjam Umum' : (lecturer?.nama || 'Dosen')}</span>
             </div>
             <div className="flex items-center gap-2">
               <MapPin size={12} className={s.isBooking ? 'text-indigo-600' : 'text-[#008787]'}/>
               <span className={`font-semibold truncate ${isConflicting ? 'text-rose-600 underline decoration-wavy' : 'text-slate-700'}`}>{room?.name}</span>
             </div>
             <div className="flex items-center gap-2">
               <Clock size={12} className={s.isBooking ? 'text-indigo-600' : 'text-[#008787]'} />
               <span className="font-bold">{s.startTime} - {s.endTime}</span>
             </div>
             {(s.isBooking || s.date) && <div className="flex items-center gap-2 text-indigo-500"><Info size={12}/><span className="text-[9px] font-bold uppercase tracking-widest italic">{s.date}</span></div>}
          </div>
        </div>
      </div>
    );
};

// --- Schedule View ---
const ScheduleView = ({ db }: { db: Database }) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [globalSearch, setGlobalSearch] = useState(false);
  const [searchText, setSearchText] = useState(''); // New Search Text State
  const [filters, setFilters] = useState({
    course: '',
    lecturer: '',
    room: '',
    classGroup: '',
    studyProgram: ''
  });

  const activeDay = useMemo(() => getDayFromDate(selectedDate), [selectedDate]);
  
  // Default to week 1 implicitly since we removed the semester start config
  const currentWeekNumber = 1;

  const mergedSchedules = useMemo(() => {
    const regularSchedules = db.schedules.map(s => ({ ...s, isBooking: false }));
    const bookingSchedules = db.bookings
      .filter(b => b.status === 'APPROVED')
      .map(b => {
        const day = getDayFromDate(b.date);
        return {
          id: `booking-${b.id}`,
          courseId: 'RESERVATION',
          lecturerId: 'PIC',
          roomId: b.roomId,
          day: day || DayOfWeek.Senin,
          startTime: b.startTime,
          endTime: b.endTime,
          studyProgram: 'Public Reservation',
          classGroup: 'EXT-REQ',
          semester: 0,
          jpm: 0,
          weeks: Array.from({length: 16}, (_, i) => i + 1), // Booking valid di semua minggu jika tanggal cocok
          date: b.date,
          isBooking: true,
          bookingPurpose: b.purpose,
          bookingUser: `User ID: ${b.userId}`
        };
      });
      
    return [...regularSchedules, ...bookingSchedules];
  }, [db.schedules, db.bookings]);

  // Extract Unique Class Groups for dropdown
  const uniqueClassGroups = useMemo(() => {
    const classes = new Set(db.schedules.map(s => s.classGroup).filter(c => c && c.trim() !== ''));
    return Array.from(classes).sort();
  }, [db.schedules]);

  // Extract Unique Study Programs for dropdown
  const uniqueStudyPrograms = useMemo(() => {
    const programs = new Set(db.schedules.map(s => s.studyProgram).filter(p => p && p.trim() !== ''));
    return Array.from(programs).sort();
  }, [db.schedules]);

  // Helper to get week date range based on selectedDate
  const weekDateRange = useMemo(() => {
    const current = new Date(selectedDate);
    const day = current.getDay(); // 0 (Sun) to 6 (Sat)
    // Adjust to Monday (1)
    const diffToMonday = current.getDate() - day + (day === 0 ? -6 : 1); 
    const monday = new Date(current.setDate(diffToMonday));
    const friday = new Date(new Date(monday).setDate(monday.getDate() + 4));
    return { 
      start: monday.toISOString().split('T')[0], 
      end: friday.toISOString().split('T')[0] 
    };
  }, [selectedDate]);

  const filteredSchedules = useMemo(() => {
    return mergedSchedules.filter(s => {
      // Logic for Day Matching
      let matchDay = false;

      if (globalSearch) {
        // WEEKLY VIEW: Show schedules for Mon-Fri of the selected week
        const isRecurring = !s.date && ['Senin','Selasa','Rabu','Kamis','Jumat'].includes(s.day);
        const isSpecificInWeek = s.date && s.date >= weekDateRange.start && s.date <= weekDateRange.end;
        const isActiveInCurrentWeek = s.weeks ? s.weeks.includes(currentWeekNumber) : true;
        
        matchDay = (isRecurring && isActiveInCurrentWeek) || isSpecificInWeek;
      } else {
        // DAILY VIEW: Existing Logic
        const isForSpecificDate = s.date === selectedDate;
        const isActiveInCurrentWeek = s.weeks ? s.weeks.includes(currentWeekNumber) : true;
        const isRecurringForDay = !s.date && s.day === activeDay && isActiveInCurrentWeek;
        matchDay = isForSpecificDate || isRecurringForDay;
      }
      
      // Strict matching for IDs from dropdowns
      const matchCourse = filters.course === '' || s.courseId === filters.course;
      const matchLecturer = filters.lecturer === '' || s.lecturerId === filters.lecturer;
      const matchRoom = filters.room === '' || s.roomId === filters.room;
      const matchClass = filters.classGroup === '' || s.classGroup === filters.classGroup;
      const matchStudyProgram = filters.studyProgram === '' || s.studyProgram === filters.studyProgram;
      
      // Text Search Logic (Matches any field, including Day and Time)
      let matchText = true;
      if (searchText) {
         const lowerText = searchText.toLowerCase();
         const courseName = db.courses.find(c => c.id === s.courseId)?.name.toLowerCase() || '';
         const lecturerName = db.lecturers.find(l => l.id === s.lecturerId)?.nama.toLowerCase() || '';
         const roomName = db.rooms.find(r => r.id === s.roomId)?.name.toLowerCase() || '';
         const purpose = s.bookingPurpose?.toLowerCase() || '';
         const dayName = s.day.toLowerCase();
         const timeRange = `${s.startTime} - ${s.endTime}`;
         
         matchText = courseName.includes(lowerText) || 
                     lecturerName.includes(lowerText) || 
                     roomName.includes(lowerText) || 
                     purpose.includes(lowerText) ||
                     dayName.includes(lowerText) ||
                     timeRange.includes(lowerText);
      }
      
      return matchDay && matchCourse && matchLecturer && matchRoom && matchClass && matchStudyProgram && matchText;
    });
  }, [mergedSchedules, selectedDate, activeDay, filters, globalSearch, currentWeekNumber, weekDateRange, searchText, db]);

  const conflicts = useMemo(() => {
    const conflictIds = new Set<string>();
    filteredSchedules.forEach(s1 => {
      filteredSchedules.forEach(s2 => {
        if (s1.id !== s2.id && s1.roomId === s2.roomId) {
            // Check day collision first
            if (s1.day === s2.day || (s1.date && s2.date && s1.date === s2.date)) {
               if (s1.startTime < s2.endTime && s1.endTime > s2.startTime) {
                 conflictIds.add(s1.id);
               }
            }
        }
      });
    });
    return conflictIds;
  }, [filteredSchedules]);

  const resetFilters = () => {
    setFilters({ course: '', lecturer: '', room: '', classGroup: '', studyProgram: '' });
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setGlobalSearch(false);
    setSearchText('');
  };

  const hasActiveFilters = filters.course || filters.lecturer || filters.room || filters.classGroup || filters.studyProgram || globalSearch || searchText;

  return (
    <div className="space-y-8 md:space-y-10 animate-academic">
      <header className="border-b border-slate-200 pb-6 md:pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 md:mb-10">
          <div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight">Jadwal Akademik Administrasi Niaga</h2>
            <p className="text-slate-500 mt-3 text-base md:text-lg italic font-serif">Integrasi Jadwal Rutin Perkuliahan.</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
             <button onClick={() => setGlobalSearch(false)} className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${!globalSearch ? 'bg-white text-[#008787] shadow-sm' : 'text-slate-400'}`}>Filter Tanggal</button>
             <button onClick={() => setGlobalSearch(true)} className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${globalSearch ? 'bg-[#008787] text-white shadow-sm' : 'text-slate-400'}`}>Minggu Ini</button>
          </div>
        </div>

        <div className="mb-6 md:mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
           {/* Date Picker */}
           <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 luxury-shadow flex flex-col justify-center">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 ml-2">Pilih Tanggal Pantauan</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#008787]" size={20} />
                <input type="date" className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/30 outline-none focus:border-[#008787] font-bold text-slate-700" value={selectedDate} onChange={(e) => { setSelectedDate(e.target.value); setGlobalSearch(false); }} />
              </div>
           </div>

           {/* Global Search Box (New Feature) */}
           <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 luxury-shadow flex flex-col justify-center">
              <label className="text-[10px] font-extrabold text-[#008787] uppercase tracking-widest mb-3 ml-2">Cari Cepat (Dosen / Matkul / Ruang / Hari)</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#008787]" size={20} />
                <input 
                    type="text" 
                    placeholder="Ketik nama dosen, mata kuliah, ruangan, atau hari..." 
                    className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/30 outline-none focus:border-[#008787] font-bold text-slate-700" 
                    value={searchText} 
                    onChange={(e) => setSearchText(e.target.value)} 
                />
              </div>
           </div>
        </div>

        {/* Detailed Filters Dropdowns */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white p-6 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 luxury-shadow mb-8">
           <div className="relative">
             <Book className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
             <select className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 outline-none focus:border-[#008787] text-xs font-medium appearance-none" value={filters.course} onChange={e => setFilters({...filters, course: e.target.value})}>
               <option value="">Semua Mata Kuliah</option>
               {db.courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
             </select>
             <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
           </div>
           
           <div className="relative">
             <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
             <select className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 outline-none focus:border-[#008787] text-xs font-medium appearance-none" value={filters.lecturer} onChange={e => setFilters({...filters, lecturer: e.target.value})}>
               <option value="">Semua Dosen</option>
               {db.lecturers.map(l => <option key={l.id} value={l.id}>{l.nama}</option>)}
             </select>
             <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
           </div>

           <div className="relative">
             <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
             <select className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 outline-none focus:border-[#008787] text-xs font-medium appearance-none" value={filters.room} onChange={e => setFilters({...filters, room: e.target.value})}>
               <option value="">Semua Ruangan</option>
               {db.rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
             </select>
             <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
           </div>

           <div className="relative">
             <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
             <select className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 outline-none focus:border-[#008787] text-xs font-medium appearance-none" value={filters.classGroup} onChange={e => setFilters({...filters, classGroup: e.target.value})}>
               <option value="">Semua Kelas</option>
               {uniqueClassGroups.map(cg => <option key={cg} value={cg}>{cg}</option>)}
             </select>
             <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
           </div>
           
           <div className="relative sm:col-span-2 lg:col-span-4">
             <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
             <select className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 outline-none focus:border-[#008787] text-xs font-medium appearance-none" value={filters.studyProgram} onChange={e => setFilters({...filters, studyProgram: e.target.value})}>
               <option value="">Semua Program Studi</option>
               {uniqueStudyPrograms.map(sp => <option key={sp} value={sp}>{sp}</option>)}
             </select>
             <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
           </div>
        </div>

        <div className="flex flex-wrap items-center justify-end">
          {hasActiveFilters && (
            <button onClick={resetFilters} className="px-6 py-3 text-rose-500 font-bold text-[10px] uppercase tracking-widest hover:bg-rose-50 rounded-2xl transition-all flex items-center gap-2">
              <RotateCcw size={14}/> Reset Semua Filter
            </button>
          )}
        </div>
      </header>
      
      {/* View Content */}
      {globalSearch ? (
        // WEEKLY GRID VIEW
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map((day) => {
                const daySchedules = filteredSchedules
                    .filter(s => s.day === day)
                    .sort((a, b) => a.startTime.localeCompare(b.startTime));
                
                return (
                    <div key={day} className="flex flex-col gap-4">
                        <div className="bg-[#008787]/10 p-4 rounded-2xl border border-[#008787]/20 text-center">
                            <h3 className="font-bold text-[#008787] uppercase tracking-widest text-sm">{day}</h3>
                            <p className="text-[10px] text-teal-700/60 font-bold">
                                {daySchedules.length} Sesi
                            </p>
                        </div>
                        <div className="space-y-4">
                            {daySchedules.map(s => <ScheduleCard key={s.id} s={s} conflicts={conflicts} db={db} globalSearch={globalSearch} />)}
                            {daySchedules.length === 0 && (
                                <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-center text-slate-400 text-xs italic">
                                    Kosong
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      ) : (
        // DAILY LIST VIEW
        <div className="grid gap-6">
            {filteredSchedules.map(s => <ScheduleCard key={s.id} s={s} conflicts={conflicts} db={db} globalSearch={globalSearch} />)}
            {filteredSchedules.length === 0 && (
            <div className="py-20 md:py-32 text-center border-2 border-dashed rounded-[3rem] md:rounded-[4rem] border-slate-100 bg-white/50 backdrop-blur-sm px-4">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6"><Search className="text-slate-200" size={48} strokeWidth={1} /></div>
                <p className="font-serif font-bold text-slate-400 text-2xl md:text-3xl italic">
                   {searchText ? `Tidak ditemukan jadwal untuk "${searchText}"` : `Tidak ada aktivitas pada tanggal (${selectedDate}).`}
                </p>
                <button onClick={resetFilters} className="mt-8 text-[#008787] font-bold text-sm uppercase tracking-widest hover:underline flex items-center justify-center gap-2 mx-auto"><RotateCcw size={16}/> Reset Timeline</button>
            </div>
            )}
        </div>
      )}
    </div>
  );
};

// --- Empty Room View ---
const EmptyRoomView = ({ db, user, refresh }: { db: Database, user: User | null, refresh: () => void }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
  const [duration, setDuration] = useState(60); // minutes
  const [bookingModal, setBookingModal] = useState<Room | null>(null);
  const [purpose, setPurpose] = useState('');

  const availableRooms = useMemo(() => {
    const checkStart = time;
    const [h, m] = time.split(':').map(Number);
    const endMinutes = h * 60 + m + duration;
    const endH = Math.floor(endMinutes / 60) % 24;
    const endM = endMinutes % 60;
    const checkEnd = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    const day = getDayFromDate(date);
    if (!day) return [];

    return db.rooms.filter(room => {
      // Check schedules
      const hasSchedule = db.schedules.some(s => {
        if (s.roomId !== room.id) return false;
        // Check day/date
        const isDayMatch = s.date === date || (!s.date && s.day === day);
        if (!isDayMatch) return false;
        // Check time overlap
        return (s.startTime < checkEnd && s.endTime > checkStart);
      });

      // Check bookings
      const hasBooking = db.bookings.some(b => {
        if (b.roomId !== room.id) return false;
        if (b.status === 'REJECTED') return false;
        if (b.date !== date) return false;
        return (b.startTime < checkEnd && b.endTime > checkStart);
      });

      return !hasSchedule && !hasBooking;
    });
  }, [db, date, time, duration]);

  const handleBooking = async () => {
    if (!user) return alert("Login diperlukan");
    if (!bookingModal) return;
    
    // Calculate End Time
    const [h, m] = time.split(':').map(Number);
    const endMinutes = h * 60 + m + duration;
    const endH = Math.floor(endMinutes / 60) % 24;
    const endM = endMinutes % 60;
    const checkEnd = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    try {
        await api.createBooking({
            userId: user.id,
            roomId: bookingModal.id,
            date,
            startTime: time,
            endTime: checkEnd,
            purpose
        });
        alert("Booking berhasil diajukan!");
        setBookingModal(null);
        refresh();
    } catch(e) {
        alert("Gagal booking");
    }
  };

  return (
    <div className="space-y-8 animate-academic">
        <header className="border-b border-slate-200 pb-10">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight">Cek Ruang Kosong</h2>
            <p className="text-slate-500 mt-3 italic font-serif">Temukan ruangan yang tersedia untuk penggunaan insidental.</p>
        </header>

        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 luxury-shadow grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tanggal</label>
                <input type="date" className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 font-bold text-slate-700" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Jam Mulai</label>
                <input type="time" className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 font-bold text-slate-700" value={time} onChange={e => setTime(e.target.value)} />
            </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Durasi (Menit)</label>
                <select className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 font-bold text-slate-700" value={duration} onChange={e => setDuration(Number(e.target.value))}>
                    <option value={30}>30 Menit</option>
                    <option value={60}>60 Menit</option>
                    <option value={90}>90 Menit</option>
                    <option value={120}>120 Menit</option>
                </select>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRooms.map(room => (
                <div key={room.id} className="bg-white p-6 rounded-[2rem] border border-emerald-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1 rounded-bl-2xl text-[10px] font-bold uppercase tracking-widest">
                        Available
                    </div>
                    <h4 className="font-bold text-slate-800 text-lg mb-1">{room.name}</h4>
                    <p className="text-xs text-slate-400 mb-4">{room.building} • Kapasitas {room.capacity}</p>
                    
                    {user ? (
                        <button onClick={() => setBookingModal(room)} className="w-full py-3 bg-[#008787] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#006d6d] transition-colors">
                            Booking Ruangan Ini
                        </button>
                    ) : (
                        <div className="text-center py-2 bg-slate-50 rounded-xl text-[10px] font-bold text-slate-400 uppercase">
                            Login untuk Booking
                        </div>
                    )}
                </div>
            ))}
            {availableRooms.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-400 italic">
                    Tidak ada ruangan kosong pada waktu yang dipilih.
                </div>
            )}
        </div>

        {bookingModal && (
            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-md p-8 rounded-[2.5rem] animate-academic">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-900">Booking {bookingModal.name}</h3>
                        <button onClick={() => setBookingModal(null)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-xl text-sm">
                            <p className="flex justify-between"><span>Tanggal:</span> <span className="font-bold">{date}</span></p>
                            <p className="flex justify-between"><span>Jam:</span> <span className="font-bold">{time} ({duration} menit)</span></p>
                        </div>
                        <textarea 
                            className="w-full p-4 rounded-xl border border-slate-200 text-sm" 
                            placeholder="Tujuan penggunaan ruangan..." 
                            value={purpose}
                            onChange={e => setPurpose(e.target.value)}
                        />
                        <button onClick={handleBooking} className="w-full py-4 bg-[#008787] text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest">
                            Konfirmasi Booking
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

// --- Auth Page ---
const AuthPage = ({ onLoginSuccess }: { onLoginSuccess: (user: User) => void }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', fullName: '' });
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
        if (isRegister) {
            await api.register(formData);
            alert("Registrasi berhasil, silakan login.");
            setIsRegister(false);
        } else {
            const res = await api.login(formData.username, formData.password);
            if (res.success && res.user) {
                onLoginSuccess(res.user);
                navigate('/');
            } else {
                alert(res.message);
            }
        }
    } catch (e: any) {
        alert(e.message || "Terjadi kesalahan");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
        <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 luxury-shadow w-full max-w-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#008787] to-teal-400"></div>
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-[#008787]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#008787]">
                    <GraduationCap size={32} />
                </div>
                <h2 className="text-3xl font-serif font-bold text-slate-900">{isRegister ? 'Daftar Akun' : 'Selamat Datang'}</h2>
                <p className="text-slate-500 mt-2 text-sm">Sistem Informasi Akademik & Fasilitas</p>
            </div>

            <div className="space-y-4">
                {isRegister && (
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                        <input type="text" className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:border-[#008787]" placeholder="Nama Lengkap" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                    </div>
                )}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
                    <input type="text" className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:border-[#008787]" placeholder="Username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                    <input type="password" className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:border-[#008787]" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>

                <button onClick={handleSubmit} className="w-full py-4 bg-[#008787] text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all mt-6">
                    {isRegister ? 'Daftar Sekarang' : 'Masuk Aplikasi'}
                </button>

                <p className="text-center text-xs text-slate-400 mt-6 cursor-pointer hover:text-[#008787]" onClick={() => setIsRegister(!isRegister)}>
                    {isRegister ? 'Sudah punya akun? Login' : 'Belum punya akun? Daftar'}
                </p>
            </div>
        </div>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [db, setDb] = useState<Database | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDatabase();
      setDb(data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat database.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#f8fafb]"><Loader2 className="animate-spin text-[#008787]" size={48}/></div>;

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-[#f8fafb]">
        <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} user={currentUser} onLogout={handleLogout} />
        <main className="flex-1 px-4 py-6 md:px-12 md:py-16 overflow-x-hidden relative">
          
          <div className="lg:hidden flex items-center justify-between mb-8 sticky top-0 z-30 bg-[#f8fafb]/90 backdrop-blur-md py-2">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#008787] to-[#005d5d] rounded-xl flex items-center justify-center text-white shadow-lg">
                   <GraduationCap size={20} />
                </div>
                <div>
                   <h1 className="font-serif font-bold text-slate-800 text-lg leading-none">JURUSAN <span className="text-[#008787]">AN</span></h1>
                </div>
             </div>
             <button onClick={() => setSidebarOpen(true)} className="p-3 bg-white text-slate-600 rounded-xl shadow-lg border border-slate-100 active:scale-95 transition-transform">
                <Menu size={20} />
             </button>
          </div>

          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={db ? <ScheduleView db={db} /> : null} />
              <Route path="/empty-rooms" element={db ? <EmptyRoomView db={db} user={currentUser} refresh={loadData} /> : null} />
              <Route path="/inventory" element={db ? <InventoryView db={db} user={currentUser} refresh={loadData} /> : null} />
              <Route path="/login" element={<AuthPage onLoginSuccess={handleLoginSuccess} />} />
              <Route path="/my-requests" element={db ? <UserRequestsPage db={db} user={currentUser} refresh={loadData} /> : null} />
              <Route path="/settings" element={currentUser ? <UserSettings user={currentUser} /> : <Navigate to="/login" />} />
              <Route path="/admin" element={currentUser?.role === UserRole.ADMIN ? (db ? <AdminPanel db={db} refresh={loadData} /> : null) : <Navigate to="/login" />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
}
