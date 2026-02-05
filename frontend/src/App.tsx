import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  Search, Calendar, User as UserIcon, MapPin, Settings, Clock, 
  Menu, Loader2, AlertCircle, LogOut, LogIn, 
  ChevronRight, GraduationCap, 
  ClipboardList, Package, Check, Info,
  Database as DatabaseIcon, Filter, X,
  Trash2, Plus, Edit, Save, Lock, UserCog,
  BookOpen, Box, CalendarDays, DoorOpen, Users, KeyRound,
  Timer, CheckCircle, XCircle, ArrowLeftRight, Briefcase
} from 'lucide-react';
import { Database, DayOfWeek, Room, User, UserRole, Schedule, Item } from './types';
import { api } from './api';
import { getDayFromDate } from './types';

// --- SidebarLink Component ---
// ... (code omitted for brevity, SidebarLink is same)
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
// ... (code omitted for brevity, Sidebar is same)
const Sidebar = ({ isOpen, toggle, user, onLogout }: { isOpen: boolean, toggle: () => void, user: User | null, onLogout: () => void }) => {
  const location = useLocation();
  
  const publicItems = [
    { path: '/', label: 'Cari Jadwal', icon: Search },
    { path: '/empty-rooms', label: 'Cek Status Ruangan', icon: MapPin },
    { path: '/inventory', label: 'Inventaris Barang', icon: Package },
  ];

  const userItems = [
    { path: '/my-requests', label: 'Permintaan Saya', icon: ClipboardList },
    { path: '/settings', label: 'Pengaturan Akun', icon: Settings },
  ];

  const adminItems = [
    { path: '/admin', label: 'Manajemen Data', icon: DatabaseIcon },
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm" onClick={toggle} />}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 academic-gradient text-white z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-500 ease-out flex flex-col border-r border-teal-900/20 shadow-2xl lg:shadow-none h-screen`}>
        {/* Logo Section - Fixed Top */}
        <div className="p-8 pb-4 flex-none">
          <div className="mb-4 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl mb-4 group overflow-hidden">
               <GraduationCap className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <h1 className="text-lg font-serif font-bold text-white tracking-tight leading-none">JURUSAN <span className="text-teal-200 italic font-medium">AN</span></h1>
              <p className="text-[8px] uppercase tracking-[0.3em] text-teal-100/60 mt-1 font-bold">PNJ</p>
            </div>
          </div>
          <div className="h-px w-full bg-white/10"></div>
        </div>
          
        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar">
            <p className="text-[9px] font-bold text-teal-200/40 uppercase tracking-widest mb-2 px-5 mt-2">Menu Utama</p>
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

        {/* Footer/User Section - Fixed Bottom */}
        <div className="p-6 mt-auto border-t border-white/10 bg-black/10 flex-none">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-xl bg-teal-400/20 flex items-center justify-center text-teal-200 font-bold text-sm uppercase border border-white/10">
                  {user.username[0]}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold truncate text-white">{user.fullName || user.username}</p>
                  <p className="text-[10px] text-teal-200/70 uppercase tracking-widest font-semibold">{user.role}</p>
                </div>
              </div>
              <button onClick={() => { onLogout(); toggle(); }} className="w-full flex items-center justify-center gap-2 px-5 py-3 text-white hover:bg-rose-500/80 rounded-2xl transition-all font-bold border border-white/10 text-xs uppercase tracking-wide group">
                <LogOut size={14} className="group-hover:-translate-x-1 transition-transform"/> Log Out
              </button>
            </div>
          ) : (
            <Link to="/login" onClick={toggle} className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-white text-[#008787] rounded-2xl transition-all font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-[1.02]">
              <LogIn size={16} /> Login Portal
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};

// --- ScheduleCard Component ---

// Fix: Added ScheduleCardProps definition
interface ScheduleCardProps {
  s: Schedule;
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
      <div className={`bg-white p-6 md:p-8 rounded-[2rem] border luxury-shadow flex flex-col gap-4 group transition-all duration-300 relative overflow-hidden h-full hover:-translate-y-1 ${isConflicting ? 'border-rose-500 bg-rose-50/50' : s.isBooking ? 'border-indigo-100 bg-indigo-50/10' : 'border-slate-100 hover:border-teal-200'}`}>
        {!globalSearch && (
           <div className={`absolute top-0 right-0 px-6 py-1 text-white text-[9px] font-bold uppercase tracking-widest rounded-bl-3xl shadow-lg ${s.isBooking ? 'bg-indigo-600' : s.date ? 'bg-amber-600' : 'bg-[#008787]'}`}>
              {s.isBooking ? 'RESERVASI' : s.date ? 'KHUSUS' : 'RUTIN'}
           </div>
        )}
        
        <div className="w-full">
          <div className="flex flex-wrap items-center gap-2 mb-3">
             {globalSearch && (
                 <span className="text-[9px] font-extrabold px-2 py-1 rounded-full uppercase tracking-wider bg-slate-100 text-slate-500">{s.date ? s.date : s.day}</span>
             )}
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
  const [globalSearch, setGlobalSearch] = useState('');
  
  // Specific Filters
  const [filterLecturer, setFilterLecturer] = useState('');
  const [filterRoom, setFilterRoom] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterClass, setFilterClass] = useState('');

  const [useDateFilter, setUseDateFilter] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const activeDay = useMemo(() => getDayFromDate(selectedDate), [selectedDate]);

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
          weeks: Array.from({length: 16}, (_, i) => i + 1),
          date: b.date,
          isBooking: true,
          bookingPurpose: b.purpose,
          bookingUser: `User ID: ${b.userId}`
        };
      });
      
    return [...regularSchedules, ...bookingSchedules];
  }, [db.schedules, db.bookings]);

  const uniqueClasses = useMemo(() => {
      const classes = new Set<string>();
      mergedSchedules.forEach(s => classes.add(s.classGroup));
      return Array.from(classes).sort();
  }, [mergedSchedules]);

  const filteredSchedules = useMemo(() => {
    return mergedSchedules.filter(s => {
      // 1. Date Filter (Base Layer)
      let matchesDate = true;
      if (useDateFilter) {
         const isForSpecificDate = s.date === selectedDate;
         const isRecurringForDay = !s.date && s.day === activeDay;
         matchesDate = isForSpecificDate || isRecurringForDay;
      }
      if (!matchesDate) return false;

      // 2. Specific Filters (Overlapping / AND Logic)
      if (filterLecturer && s.lecturerId !== filterLecturer) return false;
      if (filterRoom && s.roomId !== filterRoom) return false;
      if (filterCourse && s.courseId !== filterCourse) return false;
      if (filterClass && s.classGroup !== filterClass) return false;

      // 3. Global Search (Optional Overlay)
      if (globalSearch.trim()) {
         const lowerText = globalSearch.toLowerCase();
         const courseName = db.courses.find(c => c.id === s.courseId)?.name.toLowerCase() || '';
         const lecturerName = db.lecturers.find(l => l.id === s.lecturerId)?.nama.toLowerCase() || '';
         const roomName = db.rooms.find(r => r.id === s.roomId)?.name.toLowerCase() || '';
         const purpose = s.bookingPurpose?.toLowerCase() || '';
         const className = s.classGroup.toLowerCase();
         
         const matchesGlobal = courseName.includes(lowerText) || 
                       lecturerName.includes(lowerText) || 
                       roomName.includes(lowerText) || 
                       purpose.includes(lowerText) ||
                       className.includes(lowerText);
         if (!matchesGlobal) return false;
      }

      return true;
    }).sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [mergedSchedules, filterLecturer, filterRoom, filterCourse, filterClass, globalSearch, useDateFilter, selectedDate, activeDay, db]);

  const conflicts = useMemo(() => new Set<string>(), []);

  const resetFilters = () => {
      setGlobalSearch('');
      setFilterLecturer('');
      setFilterRoom('');
      setFilterCourse('');
      setFilterClass('');
      setUseDateFilter(false);
  };

  return (
    <div className="space-y-8 animate-academic">
      <div className="bg-[#008787] rounded-[3rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
         
         <div className="relative z-10 max-w-5xl mx-auto space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight mb-2">Jadwal Kuliah & Ruangan</h1>
                <p className="text-teal-100 text-lg opacity-90">Filter berdasarkan berbagai kategori secara bersamaan.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-inner">
                {/* Top Row: Date & Global Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                     <div className={`bg-white rounded-2xl p-1 flex items-center shadow-lg transition-all ${useDateFilter ? 'ring-2 ring-teal-300' : 'opacity-90'}`}>
                        <button 
                            onClick={() => setUseDateFilter(!useDateFilter)}
                            className={`px-4 py-3 rounded-xl font-bold text-xs md:text-sm uppercase tracking-wider transition-all flex items-center gap-2 ${useDateFilter ? 'bg-[#008787] text-white shadow-md' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}
                        >
                            <Calendar size={16} />
                            {useDateFilter ? 'Filter Tanggal' : 'Semua Hari'}
                        </button>
                        
                        {useDateFilter && (
                             <div className="flex items-center px-3 border-l border-slate-100">
                                <input 
                                    type="date" 
                                    className="bg-transparent font-bold text-slate-700 outline-none text-sm cursor-pointer"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                             </div>
                        )}
                    </div>
                    
                    <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="text-teal-200" size={20} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Cari kata kunci tambahan..." 
                            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white/20 text-white placeholder:text-teal-100/70 font-semibold border border-white/10 focus:bg-white/30 focus:border-white/50 outline-none transition-all backdrop-blur-sm"
                            value={globalSearch}
                            onChange={(e) => setGlobalSearch(e.target.value)}
                        />
                        {globalSearch && (
                            <button onClick={() => setGlobalSearch('')} className="absolute inset-y-0 right-3 flex items-center text-teal-100 hover:text-white">
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Bottom Row: Specific Filters Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <select 
                        value={filterLecturer} 
                        onChange={(e) => setFilterLecturer(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white text-slate-700 text-sm font-bold border border-transparent focus:border-teal-300 focus:ring-4 focus:ring-teal-500/20 outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-all"
                    >
                        <option value="">Semua Dosen</option>
                        {db.lecturers.map(l => (
                            <option key={l.id} value={l.id}>{l.nama}</option>
                        ))}
                    </select>

                    <select 
                        value={filterCourse} 
                        onChange={(e) => setFilterCourse(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white text-slate-700 text-sm font-bold border border-transparent focus:border-teal-300 focus:ring-4 focus:ring-teal-500/20 outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-all"
                    >
                        <option value="">Semua Mata Kuliah</option>
                        {db.courses.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    <select 
                        value={filterRoom} 
                        onChange={(e) => setFilterRoom(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white text-slate-700 text-sm font-bold border border-transparent focus:border-teal-300 focus:ring-4 focus:ring-teal-500/20 outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-all"
                    >
                        <option value="">Semua Ruangan</option>
                        {db.rooms.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>

                    <select 
                        value={filterClass} 
                        onChange={(e) => setFilterClass(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white text-slate-700 text-sm font-bold border border-transparent focus:border-teal-300 focus:ring-4 focus:ring-teal-500/20 outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-all"
                    >
                        <option value="">Semua Kelas</option>
                        {uniqueClasses.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>

             {/* Active Filter Badges */}
             {(filterLecturer || filterRoom || filterCourse || filterClass || globalSearch) && (
                <div className="flex flex-wrap justify-center gap-2 animate-fadeIn pt-4">
                    <button onClick={resetFilters} className="px-4 py-1.5 rounded-full bg-rose-500/90 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wide transition-colors flex items-center gap-1 shadow-lg">
                        <X size={12} /> Reset Semua Filter
                    </button>
                </div>
             )}
         </div>
      </div>

      <div className="flex items-center justify-between px-4">
          <div>
            <h3 className="font-bold text-slate-700 text-xl">
                {filterLecturer || filterRoom || filterCourse || filterClass || globalSearch ? 'Hasil Pencarian Terfilter' : (useDateFilter ? `Jadwal: ${activeDay}, ${selectedDate}` : 'Semua Jadwal')}
            </h3>
            <p className="text-sm text-slate-400 font-medium">Ditemukan {filteredSchedules.length} jadwal</p>
          </div>
      </div>

      {filteredSchedules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2 pb-10">
            {filteredSchedules.map((s) => (
              <ScheduleCard key={`${s.id}-${s.day}-${s.startTime}`} s={s} conflicts={conflicts} db={db} globalSearch={!useDateFilter} />
            ))}
          </div>
      ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
               <Search size={40} />
             </div>
             <h3 className="text-xl font-serif font-bold text-slate-700 mb-2">Tidak ada jadwal ditemukan</h3>
             <p className="text-slate-400">Coba kurangi kombinasi filter Anda.</p>
             <button onClick={resetFilters} className="mt-6 text-[#008787] font-bold hover:underline">Reset Semua Filter</button>
          </div>
      )}
    </div>
  );
};

// --- Empty Rooms View ---
const EmptyRoomsView = ({ db, user, onBookingSuccess }: { db: Database, user: User | null, onBookingSuccess: () => void }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string>('08:00');
  const [duration, setDuration] = useState<number>(60);
  
  // Modal Booking State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingPurpose, setBookingPurpose] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  
  const activeDay = getDayFromDate(selectedDate);

  // Helper: Convert time string "HH:MM" to minutes
  const getMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  // Helper: Convert minutes back to "HH:MM"
  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const availableRooms = useMemo(() => {
    if (!activeDay) return [];

    const startMin = getMinutes(selectedTime);
    const endMin = startMin + duration;
    const endTime = formatTime(endMin);

    const occupiedRoomIds = new Set<string>();

    // 1. Check Schedules
    db.schedules.forEach(s => {
      if (s.day === activeDay) {
        const sStart = getMinutes(s.startTime);
        const sEnd = getMinutes(s.endTime);
        // Overlap logic: (StartA < EndB) and (EndA > StartB)
        if (startMin < sEnd && endMin > sStart) {
          occupiedRoomIds.add(s.roomId);
        }
      }
    });

    // 2. Check Bookings
    db.bookings.forEach(b => {
      if (b.status === 'APPROVED' && b.date === selectedDate) {
         const bStart = getMinutes(b.startTime);
         const bEnd = getMinutes(b.endTime);
         if (startMin < bEnd && endMin > bStart) {
           occupiedRoomIds.add(b.roomId);
         }
      }
    });

    return db.rooms.filter(r => !occupiedRoomIds.has(r.id));
  }, [db, selectedDate, selectedTime, duration, activeDay]);

  const handleBookingClick = (room: Room) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setSelectedRoom(room);
    setIsBookingOpen(true);
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedRoom) return;
    
    setBookingLoading(true);
    try {
      const endTime = formatTime(getMinutes(selectedTime) + duration);
      
      await api.createBooking({
        userId: user.id,
        roomId: selectedRoom.id,
        date: selectedDate,
        startTime: selectedTime,
        endTime: endTime,
        purpose: bookingPurpose
      });
      
      // Refresh DB data so the room becomes unavailable for subsequent searches
      onBookingSuccess();

      alert("Permintaan booking berhasil dikirim! Silakan cek status di menu 'Permintaan Saya'.");
      setIsBookingOpen(false);
      setBookingPurpose('');
      setSelectedRoom(null);
    } catch (err) {
      alert("Gagal melakukan booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-academic">
      {/* Header Info */}
      <div className="mb-4">
        <h1 className="text-3xl font-serif font-bold text-slate-800">Cek Status Ruangan</h1>
        <p className="font-serif italic text-slate-400">Temukan ruangan yang tersedia untuk penggunaan insidental.</p>
      </div>

      {/* Filter Bar - White Card Style */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 luxury-shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tanggal */}
              <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                   <Calendar size={12}/> TANGGAL
                 </label>
                 <div className="relative">
                    <input 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-slate-50 px-4 py-3 rounded-xl font-bold text-slate-700 outline-none border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
                    />
                 </div>
              </div>

              {/* Jam Mulai */}
              <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                   <Clock size={12}/> JAM MULAI
                 </label>
                 <div className="relative">
                    <input 
                      type="time" 
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full bg-slate-50 px-4 py-3 rounded-xl font-bold text-slate-700 outline-none border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
                    />
                 </div>
              </div>

              {/* Durasi */}
              <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                   <Timer size={12}/> DURASI (MENIT)
                 </label>
                 <select 
                   value={duration}
                   onChange={(e) => setDuration(Number(e.target.value))}
                   className="w-full bg-slate-50 px-4 py-3 rounded-xl font-bold text-slate-700 outline-none border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all cursor-pointer appearance-none"
                 >
                   <option value="30">30 Menit</option>
                   <option value="60">60 Menit</option>
                   <option value="90">90 Menit</option>
                   <option value="120">120 Menit (2 Jam)</option>
                   <option value="180">180 Menit (3 Jam)</option>
                 </select>
              </div>
          </div>
      </div>

      {/* Available Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableRooms.length > 0 ? availableRooms.map(room => (
            <div key={room.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-teal-200 hover:shadow-xl transition-all group relative overflow-hidden flex flex-col justify-between min-h-[220px]">
               {/* Available Badge */}
               <div className="absolute top-0 right-0">
                  <div className="bg-[#00bfa5] text-white text-[10px] font-extrabold px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest shadow-md">
                    Available
                  </div>
               </div>

               <div className="mt-2">
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{room.name}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{room.building} • Kapasitas {room.capacity}</p>
               </div>
               
               <div className="mt-8">
                  <button 
                    onClick={() => handleBookingClick(room)}
                    className="w-full py-3 bg-[#008787] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#006e6e] transition-all shadow-lg shadow-teal-500/20 active:scale-95"
                  >
                    Booking Ruangan Ini
                  </button>
               </div>
            </div>
          )) : (
            <div className="col-span-full py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 text-center">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                 <AlertCircle size={32} />
               </div>
               <p className="text-slate-500 font-bold text-lg">Tidak ada ruangan tersedia</p>
               <p className="text-slate-400 text-sm">Coba ganti jam atau kurangi durasi pemakaian.</p>
            </div>
          )}
      </div>

      {/* Login Required Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
           <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl text-center relative overflow-hidden border border-slate-100">
              {/* Decorative top bar */}
              <div className="absolute top-0 left-0 w-full h-2 bg-rose-500"></div>

              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-rose-100">
                <Lock size={28} strokeWidth={2.5} />
              </div>

              <h2 className="text-xl font-serif font-bold text-slate-800 mb-2">Akses Terbatas</h2>
              <p className="text-slate-500 text-sm mb-8 font-medium leading-relaxed">
                Anda harus login terlebih dahulu untuk dapat mengajukan peminjaman ruangan.
              </p>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => navigate('/login')}
                  className="w-full py-3.5 bg-[#008787] text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[#006e6e] transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 group"
                >
                  <LogIn size={16} className="group-hover:translate-x-0.5 transition-transform"/> Login Sekarang
                </button>
                <button 
                  onClick={() => setShowLoginModal(false)}
                  className="w-full py-3.5 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-slate-200 transition-all hover:text-slate-700"
                >
                  Nanti Saja
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Booking Modal */}
      {isBookingOpen && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
           <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative">
              <button 
                onClick={() => setIsBookingOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
              >
                <X size={20}/>
              </button>

              <h2 className="text-2xl font-serif font-bold text-slate-800 mb-1">Konfirmasi Booking</h2>
              <p className="text-slate-400 text-sm mb-6">Lengkapi data untuk meminjam ruangan.</p>

              <div className="bg-teal-50 p-4 rounded-xl mb-6 flex items-start gap-3">
                 <div className="p-2 bg-white rounded-lg text-[#008787] shadow-sm">
                   <MapPin size={20} />
                 </div>
                 <div>
                    <h3 className="font-bold text-slate-800">{selectedRoom.name}</h3>
                    <p className="text-xs text-slate-500 font-semibold">{selectedDate} • {selectedTime} ({duration} Menit)</p>
                 </div>
              </div>

              <form onSubmit={submitBooking}>
                 <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Keperluan Peminjaman</label>
                    <textarea 
                      required
                      value={bookingPurpose}
                      onChange={(e) => setBookingPurpose(e.target.value)}
                      placeholder="Contoh: Rapat Himpunan, Seminar, Kelas Pengganti..."
                      className="w-full bg-slate-50 p-4 rounded-xl font-semibold text-slate-700 outline-none border border-slate-200 focus:border-teal-500 h-28 resize-none"
                    ></textarea>
                 </div>

                 <button 
                   type="submit" 
                   disabled={bookingLoading}
                   className="w-full py-4 bg-[#008787] text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[#006e6e] transition-all shadow-xl shadow-teal-500/20 disabled:opacity-70 flex items-center justify-center gap-2"
                 >
                   {bookingLoading ? <Loader2 size={18} className="animate-spin"/> : <Check size={18}/>}
                   Ajukan Booking
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

// --- Inventory View ---
const InventoryView = ({ db, user, onBorrowSuccess }: { db: Database, user: User | null, onBorrowSuccess: () => void }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isBorrowingOpen, setIsBorrowingOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [borrowPurpose, setBorrowPurpose] = useState('');
  const [returnDate, setReturnDate] = useState<string>('');
  const [borrowLoading, setBorrowLoading] = useState(false);

  const filteredItems = useMemo(() => {
    if (!search) return db.items;
    const lower = search.toLowerCase();
    return db.items.filter(item => 
      item.nama_barang.toLowerCase().includes(lower) ||
      item.merek.toLowerCase().includes(lower) ||
      item.ruang.toLowerCase().includes(lower) ||
      item.kondisi.toLowerCase().includes(lower)
    );
  }, [db.items, search]);

  const handleBorrowClick = (item: Item) => {
    if (!user) {
        setShowLoginModal(true);
        return;
    }
    setSelectedItem(item);
    // Default return date = tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setReturnDate(tomorrow.toISOString().split('T')[0]);
    setIsBorrowingOpen(true);
  };

  const submitBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedItem) return;

    setBorrowLoading(true);
    try {
        await api.createItemBorrowing({
            userId: user.id,
            itemId: selectedItem.id,
            borrowDate: new Date().toISOString().split('T')[0],
            returnDate: returnDate,
            purpose: borrowPurpose
        });

        onBorrowSuccess();
        alert("Permintaan peminjaman barang berhasil dikirim! Silakan ambil barang setelah disetujui.");
        setIsBorrowingOpen(false);
        setBorrowPurpose('');
        setSelectedItem(null);
    } catch (err) {
        alert("Gagal melakukan peminjaman.");
    } finally {
        setBorrowLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-academic">
       <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-800">Inventaris Barang</h1>
            <p className="text-slate-500">Daftar aset dan peralatan fasilitas jurusan.</p>
          </div>
       </div>

       {/* Search Bar */}
       <div className="bg-white p-6 rounded-[2rem] border border-slate-100 luxury-shadow mb-8">
         <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="text-slate-400 group-focus-within:text-[#008787] transition-colors" size={20} />
            </div>
            <input 
                type="text" 
                placeholder="Cari nama barang, merek, atau lokasi..." 
                className="w-full pl-12 pr-10 py-4 rounded-xl bg-slate-50 text-slate-700 font-bold border border-slate-100 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
                <button onClick={() => setSearch('')} className="absolute inset-y-0 right-4 flex items-center text-slate-300 hover:text-rose-500 transition-colors">
                    <X size={18} />
                </button>
            )}
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.length > 0 ? filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all group flex flex-col h-full">
               <div className="h-40 bg-slate-100 flex items-center justify-center relative">
                  {item.foto ? (
                    <img src={item.foto} alt={item.nama_barang} className="w-full h-full object-cover"/>
                  ) : (
                    <Package size={48} className="text-slate-300" />
                  )}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.status_pinjam === 'Tersedia' ? 'bg-teal-500 text-white' : 'bg-rose-500 text-white'}`}>
                    {item.status_pinjam}
                  </div>
               </div>
               <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-slate-800 mb-1">{item.nama_barang}</h3>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-4">{item.merek} • {item.tahun_perolehan}</p>
                  
                  <div className="space-y-2 text-sm text-slate-600 mb-4">
                     <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span>Kondisi</span>
                        <span className={`font-bold ${item.kondisi === 'Baik' ? 'text-teal-600' : 'text-amber-500'}`}>{item.kondisi}</span>
                     </div>
                     <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span>Lokasi</span>
                        <span className="font-semibold">{item.ruang}</span>
                     </div>
                  </div>
                  
                  {item.status_pinjam === 'Dipinjam' ? (
                    <div className="mt-auto p-3 bg-rose-50 rounded-xl text-rose-700 text-xs font-semibold text-center border border-rose-100">
                       Dipinjam oleh: {item.user_peminjam || 'Unknown'}
                    </div>
                  ) : (
                    <button 
                        onClick={() => handleBorrowClick(item)}
                        className="mt-auto w-full py-3 bg-[#008787] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#006e6e] transition-all shadow-lg shadow-teal-500/20 active:scale-95"
                    >
                        Pinjam Barang Ini
                    </button>
                  )}
               </div>
            </div>
          )) : (
            <div className="col-span-full py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 text-center">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                 <Search size={32} />
               </div>
               <p className="text-slate-500 font-bold text-lg">Tidak ada barang ditemukan</p>
               <p className="text-slate-400 text-sm">Coba kata kunci lain.</p>
            </div>
          )}
       </div>

        {/* Login Required Modal */}
        {showLoginModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl text-center relative overflow-hidden border border-slate-100">
                <div className="absolute top-0 left-0 w-full h-2 bg-rose-500"></div>
                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-rose-100">
                    <Lock size={28} strokeWidth={2.5} />
                </div>
                <h2 className="text-xl font-serif font-bold text-slate-800 mb-2">Akses Terbatas</h2>
                <p className="text-slate-500 text-sm mb-8 font-medium leading-relaxed">
                    Anda harus login terlebih dahulu untuk meminjam barang inventaris.
                </p>
                <div className="flex flex-col gap-3">
                    <button onClick={() => navigate('/login')} className="w-full py-3.5 bg-[#008787] text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[#006e6e] transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 group">
                        <LogIn size={16} className="group-hover:translate-x-0.5 transition-transform"/> Login Sekarang
                    </button>
                    <button onClick={() => setShowLoginModal(false)} className="w-full py-3.5 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-slate-200 transition-all hover:text-slate-700">
                        Nanti Saja
                    </button>
                </div>
            </div>
            </div>
        )}

        {/* Borrowing Form Modal */}
        {isBorrowingOpen && selectedItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative">
                <button onClick={() => setIsBorrowingOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
                    <X size={20}/>
                </button>
                <h2 className="text-2xl font-serif font-bold text-slate-800 mb-1">Form Peminjaman</h2>
                <p className="text-slate-400 text-sm mb-6">Lengkapi data untuk meminjam aset.</p>

                <div className="bg-teal-50 p-4 rounded-xl mb-6 flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg text-[#008787] shadow-sm">
                        <Box size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">{selectedItem.nama_barang}</h3>
                        <p className="text-xs text-slate-500 font-semibold">Kondisi: {selectedItem.kondisi}</p>
                    </div>
                </div>

                <form onSubmit={submitBorrow}>
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tanggal Pengembalian</label>
                        <input 
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            className="w-full bg-slate-50 px-4 py-3 rounded-xl font-bold text-slate-700 outline-none border border-slate-200 focus:border-teal-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Keperluan Peminjaman</label>
                        <textarea 
                            required
                            value={borrowPurpose}
                            onChange={(e) => setBorrowPurpose(e.target.value)}
                            placeholder="Contoh: Dokumentasi acara seminar..."
                            className="w-full bg-slate-50 p-4 rounded-xl font-semibold text-slate-700 outline-none border border-slate-200 focus:border-teal-500 h-28 resize-none"
                        ></textarea>
                    </div>
                    <button type="submit" disabled={borrowLoading} className="w-full py-4 bg-[#008787] text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[#006e6e] transition-all shadow-xl shadow-teal-500/20 disabled:opacity-70 flex items-center justify-center gap-2">
                        {borrowLoading ? <Loader2 size={18} className="animate-spin"/> : <Check size={18}/>}
                        Ajukan Peminjaman
                    </button>
                </form>
            </div>
            </div>
        )}
    </div>
  );
};

// --- Settings View ---
const SettingsView = ({ user, setUser }: { user: User, setUser: (u: User) => void }) => {
    const [fullName, setFullName] = useState(user.fullName || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setFullName(user.fullName || '');
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        
        if (password && password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Konfirmasi password tidak sesuai.' });
            return;
        }

        setIsSaving(true);
        try {
            await api.updateUser(user.id, { 
                fullName, 
                password: password ? password : undefined 
            });
            
            // Update local state
            setUser({ ...user, fullName });
            setPassword('');
            setConfirmPassword('');
            setMessage({ type: 'success', text: 'Profil berhasil diperbarui.' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Gagal memperbarui profil.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-academic max-w-2xl mx-auto">
            <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 luxury-shadow">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-teal-50 rounded-2xl text-[#008787]">
                        <UserCog size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-slate-800">Pengaturan Akun</h1>
                        <p className="text-slate-400">Perbarui informasi profil dan keamanan Anda.</p>
                    </div>
                </div>

                {message && (
                    <div className={`p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-teal-50 text-teal-700' : 'bg-rose-50 text-rose-600'}`}>
                        {message.type === 'success' ? <Check size={16}/> : <AlertCircle size={16}/>}
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Username</label>
                        <input type="text" value={user.username} disabled className="w-full p-4 rounded-xl bg-slate-50 text-slate-500 font-bold border border-slate-100" />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nama Lengkap</label>
                        <input 
                            type="text" 
                            value={fullName} 
                            onChange={e => setFullName(e.target.value)}
                            className="w-full p-4 rounded-xl bg-white text-slate-800 font-bold border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all" 
                            placeholder="Masukkan nama lengkap Anda"
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Lock size={16}/> Ganti Password (Opsional)</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password Baru</label>
                                <input 
                                    type="password" 
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full p-4 rounded-xl bg-white text-slate-800 font-bold border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all" 
                                    placeholder="Kosongkan jika tidak ingin mengubah"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Konfirmasi Password Baru</label>
                                <input 
                                    type="password" 
                                    value={confirmPassword} 
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    className="w-full p-4 rounded-xl bg-white text-slate-800 font-bold border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all" 
                                    placeholder="Ulangi password baru"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button 
                            type="submit" 
                            disabled={isSaving}
                            className="px-8 py-3 bg-[#008787] text-white rounded-xl font-bold hover:bg-[#006e6e] transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 size={18} className="animate-spin"/> : <Save size={18} />} Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- My Requests View ---
const MyRequestsView = ({ db, user }: { db: Database, user: User }) => {
    const [activeTab, setActiveTab] = useState<'bookings' | 'items'>('bookings');

    const myBookings = useMemo(() => {
        return db.bookings.filter(b => b.userId === user.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [db.bookings, user.id]);

    const myItems = useMemo(() => {
        return db.itemBorrowings.filter(b => b.userId === user.id).sort((a,b) => new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime());
    }, [db.itemBorrowings, user.id]);

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'APPROVED': return 'bg-teal-100 text-teal-700 border-teal-200';
            case 'REJECTED': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'RETURNED': return 'bg-slate-100 text-slate-600 border-slate-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    return (
        <div className="space-y-6 animate-academic">
            <div className="bg-white p-8 rounded-[3rem] luxury-shadow border border-slate-100">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-teal-50 rounded-2xl text-[#008787]">
                        <ClipboardList size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-slate-800">Permintaan Saya</h1>
                        <p className="text-slate-400">Riwayat pengajuan peminjaman ruangan dan barang.</p>
                    </div>
                </div>

                <div className="flex gap-2 mb-8 border-b border-slate-100 pb-1">
                    <button 
                        onClick={() => setActiveTab('bookings')}
                        className={`px-6 py-3 rounded-t-2xl font-bold text-sm transition-all ${activeTab === 'bookings' ? 'bg-[#008787] text-white' : 'text-slate-400 hover:text-[#008787] hover:bg-teal-50'}`}
                    >
                        Reservasi Ruangan
                    </button>
                    <button 
                        onClick={() => setActiveTab('items')}
                        className={`px-6 py-3 rounded-t-2xl font-bold text-sm transition-all ${activeTab === 'items' ? 'bg-[#008787] text-white' : 'text-slate-400 hover:text-[#008787] hover:bg-teal-50'}`}
                    >
                        Peminjaman Barang
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeTab === 'bookings' && (
                        myBookings.length > 0 ? myBookings.map(booking => {
                            const room = db.rooms.find(r => r.id === booking.roomId);
                            return (
                                <div key={booking.id} className="p-6 rounded-3xl border border-slate-100 hover:border-teal-300 transition-all bg-slate-50/50 group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-[#008787]" />
                                            <span className="font-bold text-slate-700 text-sm">{new Date(booking.date).toLocaleDateString('id-ID', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})}</span>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-800 mb-1">{booking.purpose}</h3>
                                    <p className="text-slate-500 text-xs font-semibold mb-4">{room?.name || 'Unknown Room'}</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-400 bg-white p-2 rounded-xl border border-slate-100 w-fit">
                                        <Clock size={14}/> {booking.startTime} - {booking.endTime}
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="col-span-full py-12 text-center text-slate-400 font-serif italic">Belum ada riwayat reservasi ruangan.</div>
                        )
                    )}

                    {activeTab === 'items' && (
                        myItems.length > 0 ? myItems.map(item => {
                            const itemData = db.items.find(i => i.id === item.itemId);
                            return (
                                <div key={item.id} className="p-6 rounded-3xl border border-slate-100 hover:border-teal-300 transition-all bg-slate-50/50 group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <Package size={16} className="text-[#008787]" />
                                            <span className="font-bold text-slate-700 text-sm">{itemData?.nama_barang}</span>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-sm text-slate-500 mb-4">{item.purpose}</h3>
                                    <div className="flex items-center justify-between text-xs text-slate-400 bg-white p-3 rounded-xl border border-slate-100">
                                        <div>
                                            <span className="block text-[8px] uppercase tracking-widest text-slate-300">Pinjam</span>
                                            <span className="font-bold text-slate-600">{new Date(item.borrowDate).toLocaleDateString('id-ID')}</span>
                                        </div>
                                        <ChevronRight size={14} className="text-slate-300"/>
                                        <div className="text-right">
                                            <span className="block text-[8px] uppercase tracking-widest text-slate-300">Kembali</span>
                                            <span className="font-bold text-slate-600">{new Date(item.returnDate).toLocaleDateString('id-ID')}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                             <div className="col-span-full py-12 text-center text-slate-400 font-serif italic">Belum ada riwayat peminjaman barang.</div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Admin View ---
const AdminView = ({ db, onDataChange }: { db: Database, onDataChange: () => void }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'schedules' | 'rooms' | 'courses' | 'items' | 'bookings' | 'borrowings' | 'lecturers'>('users');
  
  // State untuk Modal Tambah Data
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemData, setNewItemData] = useState<any>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      try {
        await api.deleteUser(id);
        onDataChange();
      } catch (e: any) {
        alert("Gagal menghapus user: " + e.message);
      }
    }
  };

  const handleDeleteGeneral = async (id: string) => {
    if (window.confirm(`Hapus data dari ${activeTab}?`)) {
      try {
        await api.delete(activeTab, id);
        onDataChange();
      } catch (e: any) {
        alert("Gagal menghapus data: " + e.message);
      }
    }
  };

  const handleResetPassword = async (id: string) => {
    if (window.confirm('Reset password menjadi "123456"?')) {
      await api.updateUser(id, { password: '123456' });
      alert('Password berhasil direset menjadi "123456"');
    }
  };

  const handleRoleChange = async (id: string, newRole: UserRole) => {
    await api.updateUser(id, { role: newRole });
    onDataChange();
  };

  const handleBookingAction = async (id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') => {
    await api.updateBookingStatus(id, status);
    onDataChange();
  };

  const handleBorrowAction = async (id: string, status: 'APPROVED' | 'REJECTED' | 'RETURNED') => {
      await api.updateItemBorrowingStatus(id, status);
      onDataChange();
  };

  const handleAddClick = () => {
    setNewItemData({});
    setEditingId(null);
    setIsAddModalOpen(true);
  };

  const handleEditClick = (item: any) => {
    setNewItemData({ ...item });
    setEditingId(item.id);
    setIsAddModalOpen(true);
  };

  const handleInputChange = (field: string, value: any) => {
    setNewItemData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSaveNewItem = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          if (activeTab === 'users') {
             if (editingId) {
                 await api.updateUser(editingId, newItemData);
             } else {
                 await api.register(newItemData);
             }
          } else {
             if (editingId) {
                 await api.update(activeTab, editingId, newItemData);
             } else {
                 await api.add(activeTab, newItemData);
             }
          }
          onDataChange();
          setIsAddModalOpen(false);
          alert(editingId ? 'Data berhasil diperbarui!' : 'Data berhasil ditambahkan!');
      } catch (err: any) {
          alert('Gagal menyimpan data: ' + err.message);
      }
  };

  // ... (renderAddFormInputs is same as before)
  const renderAddFormInputs = () => {
      switch (activeTab) {
          case 'users':
              return (
                  <>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Username</label>
                          <input required type="text" value={newItemData.username || ''} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" onChange={(e) => handleInputChange('username', e.target.value)} />
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Password</label>
                          <input required={!editingId} type="password" value={newItemData.password || ''} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" onChange={(e) => handleInputChange('password', e.target.value)} placeholder={editingId ? "Kosongkan jika tidak ubah" : ""} />
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Lengkap</label>
                          <input required type="text" value={newItemData.fullName || ''} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" onChange={(e) => handleInputChange('fullName', e.target.value)} />
                      </div>
                  </>
              );
          case 'lecturers':
              return (
                  <>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Lengkap</label>
                          <input required type="text" value={newItemData.nama || ''} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" onChange={(e) => handleInputChange('nama', e.target.value)} />
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">NIP</label>
                          <input required type="text" value={newItemData.nip || ''} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" onChange={(e) => handleInputChange('nip', e.target.value)} />
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Program Studi</label>
                          <input required type="text" value={newItemData.prodi || ''} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" onChange={(e) => handleInputChange('prodi', e.target.value)} />
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">No. HP</label>
                          <input type="text" value={newItemData.hp || ''} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" onChange={(e) => handleInputChange('hp', e.target.value)} />
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email</label>
                          <input type="email" value={newItemData.email || ''} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" onChange={(e) => handleInputChange('email', e.target.value)} />
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">URL Foto Dosen (Opsional)</label>
                          <input type="text" value={newItemData.foto || ''} placeholder="https://example.com/foto.jpg" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" onChange={(e) => handleInputChange('foto', e.target.value)} />
                      </div>
                  </>
              );
          case 'rooms':
              return (
                  <>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Ruangan</label>
                          <input required type="text" value={newItemData.name || ''} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" onChange={(e) => handleInputChange('name', e.target.value)} />
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Gedung</label>
                          <input required type="text" value={newItemData.building || ''} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" onChange={(e) => handleInputChange('building', e.target.value)} />
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Kapasitas</label>
                          <input required type="number" value={newItemData.capacity || ''} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))} />
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tipe</label>
                          <select className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" value={newItemData.type || ''} onChange={(e) => handleInputChange('type', e.target.value)}>
                              <option value="">Pilih Tipe</option>
                              <option value="Kelas Teori">Kelas Teori</option>
                              <option value="Laboratorium">Laboratorium</option>
                              <option value="Auditorium">Auditorium</option>
                          </select>
                      </div>
                  </>
              );
          case 'courses':
              return (
                  <>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Kode Mata Kuliah</label>
                          <input required type="text" value={newItemData.code || ''} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" onChange={(e) => handleInputChange('code', e.target.value)} />
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Mata Kuliah</label>
                          <input required type="text" value={newItemData.name || ''} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" onChange={(e) => handleInputChange('name', e.target.value)} />
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">SKS</label>
                          <input required type="number" value={newItemData.credits || ''} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" onChange={(e) => handleInputChange('credits', parseInt(e.target.value))} />
                      </div>
                  </>
              );
          case 'items':
              return (
                  <>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Barang</label>
                          <input required type="text" value={newItemData.nama_barang || ''} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" onChange={(e) => handleInputChange('nama_barang', e.target.value)} />
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Merek</label>
                          <input required type="text" value={newItemData.merek || ''} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" onChange={(e) => handleInputChange('merek', e.target.value)} />
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Kondisi</label>
                          <select className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" value={newItemData.kondisi || ''} onChange={(e) => handleInputChange('kondisi', e.target.value)}>
                              <option value="Baik">Baik</option>
                              <option value="Rusak Ringan">Rusak Ringan</option>
                              <option value="Rusak Berat">Rusak Berat</option>
                          </select>
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Lokasi Ruangan</label>
                          <input required type="text" value={newItemData.ruang || ''} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" onChange={(e) => handleInputChange('ruang', e.target.value)} />
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tahun Perolehan</label>
                          <input type="text" value={newItemData.tahun_perolehan || ''} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" onChange={(e) => handleInputChange('tahun_perolehan', e.target.value)} />
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">URL Foto Barang (Opsional)</label>
                          <input type="text" value={newItemData.foto || ''} placeholder="https://example.com/foto-barang.jpg" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" onChange={(e) => handleInputChange('foto', e.target.value)} />
                      </div>
                  </>
              );
          case 'schedules':
              return (
                  <>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mata Kuliah ID</label>
                          <select required className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" value={newItemData.courseId || ''} onChange={(e) => handleInputChange('courseId', e.target.value)}>
                              <option value="">Pilih Mata Kuliah</option>
                              {db.courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Dosen ID</label>
                          <select required className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" value={newItemData.lecturerId || ''} onChange={(e) => handleInputChange('lecturerId', e.target.value)}>
                               <option value="">Pilih Dosen</option>
                               {db.lecturers.map(l => <option key={l.id} value={l.id}>{l.nama}</option>)}
                          </select>
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ruangan ID</label>
                          <select required className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" value={newItemData.roomId || ''} onChange={(e) => handleInputChange('roomId', e.target.value)}>
                                <option value="">Pilih Ruangan</option>
                                {db.rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                          </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Jam Mulai</label>
                            <input required type="time" value={newItemData.startTime || ''} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" onChange={(e) => handleInputChange('startTime', e.target.value)} />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Jam Selesai</label>
                            <input required type="time" value={newItemData.endTime || ''} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" onChange={(e) => handleInputChange('endTime', e.target.value)} />
                          </div>
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Hari</label>
                          <select required className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" value={newItemData.day || ''} onChange={(e) => handleInputChange('day', e.target.value)}>
                              <option value="Senin">Senin</option>
                              <option value="Selasa">Selasa</option>
                              <option value="Rabu">Rabu</option>
                              <option value="Kamis">Kamis</option>
                              <option value="Jumat">Jumat</option>
                          </select>
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Kelas</label>
                          <input required type="text" value={newItemData.classGroup || ''} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" onChange={(e) => handleInputChange('classGroup', e.target.value)} placeholder="Contoh: AB-1A" />
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Program Studi</label>
                          <input required type="text" value={newItemData.studyProgram || ''} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" onChange={(e) => handleInputChange('studyProgram', e.target.value)} />
                      </div>
                  </>
              );
          default:
              return <p className="text-slate-400 italic">Formulir untuk tipe data ini belum tersedia atau dikelola otomatis.</p>;
      }
  };

  const TabButton = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
        activeTab === id 
          ? 'bg-[#008787] text-white shadow-lg scale-105' 
          : 'bg-white text-slate-400 hover:bg-slate-50 hover:text-[#008787]'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div className="space-y-8 animate-academic">
      {/* Header */}
       <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
             <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 tracking-tight leading-none mb-2">Control<br/>Panel</h1>
             <p className="font-serif italic text-slate-400 text-lg">manajemen data.</p>
          </div>
          
          <div className="w-full md:w-auto overflow-x-auto pb-2 -mx-6 md:mx-0 px-6 md:px-0">
             <div className="flex gap-3">
               <TabButton id="lecturers" icon={Briefcase} label="Dosen" />
               <TabButton id="courses" icon={BookOpen} label="Matkul" />
               <TabButton id="items" icon={Box} label="Inventaris" />
               <TabButton id="schedules" icon={CalendarDays} label="Jadwal" />
               <TabButton id="rooms" icon={DoorOpen} label="Ruangan" />
               <TabButton id="users" icon={Users} label="User" />
               <TabButton id="bookings" icon={ClipboardList} label="Booking" />
               <TabButton id="borrowings" icon={ArrowLeftRight} label="Peminjaman" />
             </div>
          </div>
       </div>

       <div className="bg-[#008787] h-2 rounded-full w-full opacity-10"></div>

       <div className="bg-white rounded-[3rem] p-8 md:p-12 luxury-shadow border border-slate-100 min-h-[500px]">
          
          {/* USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-8">
               <div className="mb-8 flex justify-between items-end">
                 <div>
                    <h2 className="text-3xl font-serif font-bold text-slate-800 mb-2">Manajemen User</h2>
                    <p className="text-slate-400">Kelola akses pengguna sistem.</p>
                 </div>
                 <button onClick={handleAddClick} className="flex items-center gap-2 px-5 py-2.5 bg-[#008787] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#006e6e] shadow-lg shadow-teal-500/20"><Plus size={16}/> Tambah User</button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {db.users.map(u => (
                    <div key={u.id} className="p-6 rounded-3xl border border-slate-100 hover:border-teal-200 hover:shadow-xl transition-all group bg-white flex flex-col justify-between">
                       <div className="flex items-start gap-4 mb-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg ${u.role === 'ADMIN' ? 'bg-rose-500' : 'bg-[#008787]'}`}>
                             {u.username[0].toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-slate-800 leading-tight mb-1">{u.fullName || u.username}</h3>
                            <div className="flex items-center gap-2">
                               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{u.role}</span>
                               {/* Role Switcher */}
                               <select 
                                 className="text-[10px] bg-slate-100 border-none rounded px-2 py-0.5 outline-none cursor-pointer hover:bg-slate-200"
                                 value={u.role}
                                 onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                               >
                                 <option value="ADMIN">ADMIN</option>
                                 <option value="USER">USER</option>
                               </select>
                            </div>
                          </div>
                       </div>
                       
                       <div className="flex gap-3 mt-auto">
                          <button 
                            onClick={() => handleResetPassword(u.id)}
                            className="flex-1 py-3 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-xs uppercase tracking-wide hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                          >
                            <KeyRound size={14} /> Reset Pass
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(u.id)}
                            className="flex-1 py-3 rounded-xl bg-rose-50 text-rose-500 font-bold text-xs uppercase tracking-wide hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
                          >
                            <Trash2 size={14} /> Hapus
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* BOOKING MANAGEMENT */}
          {activeTab === 'bookings' && (
             <div className="space-y-4">
               <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-2xl font-serif font-bold text-slate-800 capitalize">Manajemen Booking</h2>
                    <p className="text-slate-400 text-sm">Setujui atau tolak peminjaman ruangan.</p>
                 </div>
               </div>
               
               <div className="overflow-x-auto rounded-2xl border border-slate-100">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-widest">
                       <th className="p-4 font-bold">Peminjam</th>
                       <th className="p-4 font-bold">Ruangan & Waktu</th>
                       <th className="p-4 font-bold">Keperluan</th>
                       <th className="p-4 font-bold">Status</th>
                       <th className="p-4 font-bold text-right">Aksi</th>
                     </tr>
                   </thead>
                   <tbody>
                     {db.bookings.slice().reverse().map((booking) => {
                       const user = db.users.find(u => u.id === booking.userId);
                       const room = db.rooms.find(r => r.id === booking.roomId);
                       return (
                        <tr key={booking.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-700">
                          <td className="p-4">
                            <div className="font-bold">{user?.fullName || user?.username || 'Unknown User'}</div>
                            <div className="text-xs text-slate-400 font-normal">ID: {booking.userId}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-[#008787]">{room?.name || 'Unknown Room'}</div>
                            <div className="text-xs text-slate-400 font-normal">{booking.date} • {booking.startTime} - {booking.endTime}</div>
                          </td>
                          <td className="p-4 text-slate-600 max-w-xs truncate">
                            {booking.purpose}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                              booking.status === 'APPROVED' ? 'bg-teal-100 text-teal-700' :
                              booking.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                             <div className="flex justify-end gap-2">
                               {booking.status !== 'APPROVED' && (
                                   <button 
                                     onClick={() => handleBookingAction(booking.id, 'APPROVED')}
                                     className="p-2 bg-teal-50 text-teal-600 hover:bg-teal-500 hover:text-white rounded-lg transition-colors" title="Setujui"
                                   >
                                     <CheckCircle size={18}/>
                                   </button>
                               )}
                               {booking.status !== 'REJECTED' && (
                                   <button 
                                     onClick={() => handleBookingAction(booking.id, 'REJECTED')}
                                     className="p-2 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-colors" title="Tolak"
                                   >
                                     <XCircle size={18}/>
                                   </button>
                               )}
                               {booking.status !== 'PENDING' && (
                                   <button 
                                     onClick={() => handleBookingAction(booking.id, 'PENDING')}
                                     className="p-2 bg-amber-50 text-amber-500 hover:bg-amber-500 hover:text-white rounded-lg transition-colors" title="Kembalikan ke Pending"
                                   >
                                     <Clock size={18}/>
                                   </button>
                               )}
                             </div>
                          </td>
                        </tr>
                       );
                     })}
                     {db.bookings.length === 0 && (
                        <tr><td colSpan={5} className="p-8 text-center text-slate-400 italic">Belum ada data booking.</td></tr>
                     )}
                   </tbody>
                 </table>
               </div>
             </div>
          )}

           {/* BORROWING MANAGEMENT (NEW TAB) */}
           {activeTab === 'borrowings' && (
             <div className="space-y-4">
               <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-2xl font-serif font-bold text-slate-800 capitalize">Manajemen Peminjaman Barang</h2>
                    <p className="text-slate-400 text-sm">Validasi pengajuan dan pengembalian barang.</p>
                 </div>
               </div>
               
               <div className="overflow-x-auto rounded-2xl border border-slate-100">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-widest">
                       <th className="p-4 font-bold">Peminjam</th>
                       <th className="p-4 font-bold">Barang & Durasi</th>
                       <th className="p-4 font-bold">Keperluan</th>
                       <th className="p-4 font-bold">Status</th>
                       <th className="p-4 font-bold text-right">Aksi</th>
                     </tr>
                   </thead>
                   <tbody>
                     {db.itemBorrowings.slice().reverse().map((borrow) => {
                       const user = db.users.find(u => u.id === borrow.userId);
                       const item = db.items.find(i => i.id === borrow.itemId);
                       return (
                        <tr key={borrow.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-700">
                          <td className="p-4">
                            <div className="font-bold">{user?.fullName || user?.username || 'Unknown User'}</div>
                            <div className="text-xs text-slate-400 font-normal">ID: {borrow.userId}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-[#008787]">{item?.nama_barang || 'Unknown Item'}</div>
                            <div className="text-xs text-slate-400 font-normal flex items-center gap-1">
                                {borrow.borrowDate} <ArrowLeftRight size={10}/> {borrow.returnDate}
                            </div>
                          </td>
                          <td className="p-4 text-slate-600 max-w-xs truncate">
                            {borrow.purpose}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                              borrow.status === 'APPROVED' ? 'bg-teal-100 text-teal-700' :
                              borrow.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                              borrow.status === 'RETURNED' ? 'bg-slate-100 text-slate-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {borrow.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                             {borrow.status === 'PENDING' && (
                                <div className="flex justify-end gap-2">
                                   <button 
                                     onClick={() => handleBorrowAction(borrow.id, 'APPROVED')}
                                     className="p-2 bg-teal-50 text-teal-600 hover:bg-teal-500 hover:text-white rounded-lg transition-colors" title="Setujui"
                                   >
                                     <CheckCircle size={18}/>
                                   </button>
                                   <button 
                                     onClick={() => handleBorrowAction(borrow.id, 'REJECTED')}
                                     className="p-2 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-colors" title="Tolak"
                                   >
                                     <XCircle size={18}/>
                                   </button>
                                </div>
                             )}
                             {borrow.status === 'APPROVED' && (
                                <div className="flex justify-end gap-2">
                                    <button 
                                     onClick={() => handleBorrowAction(borrow.id, 'RETURNED')}
                                     className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-500 hover:text-white rounded-lg transition-colors text-xs font-bold"
                                   >
                                     Selesai (Kembali)
                                   </button>
                                </div>
                             )}
                          </td>
                        </tr>
                       );
                     })}
                     {db.itemBorrowings.length === 0 && (
                        <tr><td colSpan={5} className="p-8 text-center text-slate-400 italic">Belum ada data peminjaman.</td></tr>
                     )}
                   </tbody>
                 </table>
               </div>
             </div>
          )}

          {/* OTHER TABS (Simple Tables) */}
          {activeTab !== 'users' && activeTab !== 'bookings' && activeTab !== 'borrowings' && (
             <div className="space-y-4">
               <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-2xl font-serif font-bold text-slate-800 capitalize">{activeTab}</h2>
                    <p className="text-slate-400 text-sm">Overview data {activeTab}.</p>
                 </div>
                 <button onClick={handleAddClick} className="flex items-center gap-2 px-5 py-2.5 bg-[#008787] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#006e6e] shadow-lg shadow-teal-500/20"><Plus size={16}/> Tambah Data</button>
               </div>
               
               <div className="overflow-x-auto rounded-2xl border border-slate-100">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-widest">
                       <th className="p-4 font-bold">ID</th>
                       <th className="p-4 font-bold">Detail Utama</th>
                       <th className="p-4 font-bold text-right">Action</th>
                     </tr>
                   </thead>
                   <tbody>
                     {(db[activeTab as keyof Database] as any[]).map((item: any) => (
                       <tr key={item.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-700">
                         <td className="p-4 text-slate-400 font-mono text-xs">#{item.id}</td>
                         <td className="p-4">
                           <div className="flex items-center gap-4">
                             {/* Tampilkan Foto jika ada (Untuk Dosen dan Barang) */}
                             {(item.foto) && (
                                <img src={item.foto} alt="Thumbnail" className="w-12 h-12 rounded-xl object-cover bg-slate-200 border border-slate-100 shadow-sm" />
                             )}
                             <div>
                               <div className="font-bold text-lg">{item.name || item.nama || item.nama_barang || item.username || item.purpose || `Item #${item.id}`}</div>
                               <div className="text-xs text-slate-400 font-normal uppercase tracking-wide">{item.building || item.prodi || item.merek || item.role || item.day || item.date || item.code}</div>
                             </div>
                           </div>
                         </td>
                         <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                               <button onClick={() => handleEditClick(item)} className="p-2 hover:bg-teal-50 text-slate-300 hover:text-[#008787] rounded-lg transition-colors"><Edit size={16}/></button>
                               <button onClick={() => handleDeleteGeneral(item.id)} className="p-2 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-lg transition-colors"><Trash2 size={16}/></button>
                            </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
               {activeTab === 'schedules' && <p className="text-center text-xs text-slate-400 italic mt-4">Hanya menampilkan sebagian data untuk performa.</p>}
             </div>
          )}

       </div>

        {/* Add Data Modal */}
        {isAddModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
                <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative overflow-y-auto max-h-[90vh]">
                    <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
                        <X size={20} />
                    </button>
                    <h2 className="text-2xl font-serif font-bold text-slate-800 mb-6 capitalize">{editingId ? 'Edit' : 'Tambah'} {activeTab === 'users' ? 'User' : activeTab}</h2>
                    <form onSubmit={handleSaveNewItem}>
                        {renderAddFormInputs()}
                        <div className="mt-6 flex gap-3">
                            <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">Batal</button>
                            <button type="submit" className="flex-1 py-3 bg-[#008787] text-white rounded-xl font-bold hover:bg-[#006e6e] transition-colors shadow-lg shadow-teal-500/20">Simpan Data</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

function App() {
  const [db, setDb] = useState<Database | null>(null);
  
  // Persist User Session
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('eduschedule_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize DB
  useEffect(() => {
    const init = async () => {
      try {
        const data = await api.getDatabase();
        setDb(data);
      } catch (err) {
        console.error("Failed to load DB", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Update localStorage when user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('eduschedule_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('eduschedule_session');
    }
  }, [user]);

  // Function to refresh DB (triggered by children components after mutation)
  const refreshDb = async () => {
    const data = await api.getDatabase();
    setDb(data);
  };

  if (loading || !db) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafb]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#008787]" size={40} />
          <p className="font-serif italic text-slate-400">Memuat Sistem...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="flex h-screen bg-[#f8fafb] overflow-hidden">
        <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} user={user} onLogout={() => setUser(null)} />
        
        <main className="flex-1 overflow-auto w-full relative">
          <header className="sticky top-0 z-30 bg-[#f8fafb]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between lg:justify-end">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-200 rounded-xl">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-4">
                <span className="hidden md:block text-xs font-bold text-slate-400 uppercase tracking-widest">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </header>

          <div className="px-6 pb-20 max-w-[1920px] mx-auto">
            <Routes>
              <Route path="/" element={<ScheduleView db={db} />} />
              <Route path="/login" element={<LoginView setUser={setUser} />} />
              <Route path="/admin" element={user?.role === UserRole.ADMIN ? <AdminView db={db} onDataChange={refreshDb} /> : <Navigate to="/login" />} />
              <Route path="/inventory" element={<InventoryView db={db} user={user} onBorrowSuccess={refreshDb} />} />
              <Route path="/empty-rooms" element={<EmptyRoomsView db={db} user={user} onBookingSuccess={refreshDb} />} />
              <Route path="/my-requests" element={user ? <MyRequestsView db={db} user={user} /> : <Navigate to="/login" />} />
              <Route path="/settings" element={user ? <SettingsView user={user} setUser={setUser} /> : <Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
}

// --- Simple Login Component ---
const LoginView = ({ setUser }: { setUser: (u: User) => void }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await api.login(username, password);
        if (res.success && res.user) {
            setUser(res.user);
            navigate(res.user.role === UserRole.ADMIN ? '/admin' : '/');
        } else {
            setError(res.message || 'Login gagal');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="bg-white p-10 rounded-[2rem] shadow-2xl max-w-md w-full border border-slate-100">
                <h2 className="text-3xl font-serif font-bold text-[#008787] mb-6 text-center">Login Portal</h2>
                {error && <div className="bg-rose-50 text-rose-600 p-3 rounded-xl mb-4 text-sm font-bold text-center">{error}</div>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-500 mb-2">Username</label>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-4 rounded-xl bg-slate-50 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-teal-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-500 mb-2">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 rounded-xl bg-slate-50 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-teal-500" />
                    </div>
                    <button type="submit" className="w-full py-4 bg-[#008787] text-white rounded-xl font-bold mt-4 hover:bg-[#006e6e] transition-all shadow-lg shadow-teal-500/30">Masuk Sistem</button>
                </form>
                <div className="mt-8 text-center text-xs text-slate-400">
                    <p>Demo Accounts:</p>
                    <p>admin / admin</p>
                    <p>mahasiswa / mahasiswa</p>
                </div>
            </div>
        </div>
    );
};

export default App;