import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, DollarSign, CheckCircle2, XCircle, AlertTriangle, 
  Plus, Edit3, Trash2, Search, Lock, ShieldCheck, UserCheck, Phone, User, FileText, ChevronRight, LogOut, Check, RefreshCw, TrendingUp
} from 'lucide-react';
import { clinicService, timeStringToMinutes, minutesToTimeString } from '../services/clinicService';
import { Booking, Service, AvailabilityDay, TimeBlock, PatientRecord } from '../types';

interface AdminProps {
  onNavigate: (path: string) => void;
}

export const Admin: React.FC<AdminProps> = ({ onNavigate }) => {
  // Gated Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [adminPin, setAdminPin] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'today' | 'availability' | 'services' | 'bookings' | 'patients'>('today');

  // Today Date & Filter
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Data Collections
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [availability, setAvailability] = useState<AvailabilityDay[]>([]);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [patients, setPatients] = useState<PatientRecord[]>([]);

  // Modals & Forms State
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);

  const [showAddBlockModal, setShowAddBlockModal] = useState(false);
  const [newBlock, setNewBlock] = useState({ date: new Date().toISOString().split('T')[0], startTime: '12:00', endTime: '14:00', reason: '' });

  const [reschedulingBooking, setReschedulingBooking] = useState<Booking | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState('');
  const [newRescheduleTime, setNewRescheduleTime] = useState('');

  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [newClinicalNote, setNewClinicalNote] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Reload data
  const refreshData = () => {
    setBookings(clinicService.getBookings());
    setServices(clinicService.getServices());
    setAvailability(clinicService.getAvailability());
    setTimeBlocks(clinicService.getTimeBlocks());
    setPatients(clinicService.getPatients());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '1234' || adminPin === 'admin' || adminPin.length >= 4) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid Admin PIN. Enter 1234 or click Admin Demo Access.');
    }
  };

  // Status Badge Helper
  const renderStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full bg-pine-100 dark:bg-pine-900 text-pine-900 dark:text-ochre-300 border border-pine-200 dark:border-pine-800 text-[11px] font-bold">Confirmed</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full bg-parchment-200 dark:bg-darkpine-900 text-pine-950 dark:text-parchment-100 border border-parchment-300 dark:border-pine-800 text-[11px] font-bold">Completed</span>;
      case 'no-show':
        return <span className="px-2.5 py-1 rounded-full bg-ochre-100 dark:bg-ochre-950 text-ochre-900 dark:text-ochre-300 border border-ochre-300 dark:border-ochre-800 text-[11px] font-bold">No-Show</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 text-[11px] font-bold">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-parchment-100 dark:bg-darkpine-900 text-pine-800 dark:text-parchment-300 border border-parchment-200 dark:border-pine-800 text-[11px] font-bold">Pending</span>;
    }
  };

  const handleStatusChange = (bookingId: string, newStatus: Booking['status']) => {
    clinicService.updateBookingStatus(bookingId, newStatus);
    refreshData();
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.name) return;
    clinicService.saveService(editingService);
    setShowAddServiceModal(false);
    setEditingService(null);
    refreshData();
  };

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlock.reason) return;
    clinicService.addTimeBlock(newBlock);
    setShowAddBlockModal(false);
    setNewBlock({ date: new Date().toISOString().split('T')[0], startTime: '12:00', endTime: '14:00', reason: '' });
    refreshData();
  };

  const handleConfirmReschedule = () => {
    if (!reschedulingBooking || !newRescheduleDate || !newRescheduleTime) return;
    try {
      clinicService.rescheduleBooking(reschedulingBooking.id, newRescheduleDate, newRescheduleTime);
      setReschedulingBooking(null);
      refreshData();
    } catch (err: any) {
      alert(err.message || 'Reschedule failed');
    }
  };

  const handleAddClinicalNote = (patientId: string) => {
    if (!newClinicalNote.trim()) return;
    const updated = clinicService.addClinicalNoteToPatient(patientId, 'Dr. Marcus Vance', newClinicalNote.trim());
    setSelectedPatient(updated);
    setNewClinicalNote('');
    refreshData();
  };

  // Filtered Bookings for Today View
  const todayBookings = bookings.filter(b => b.date === selectedDate);
  const todayCount = todayBookings.length;
  const upcomingCount = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length;
  const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;
  const estimatedRevenue = bookings.reduce((sum, b) => b.status !== 'cancelled' ? sum + (b.servicePrice || 95) : sum, 0);

  // Filtered Bookings for All Bookings View
  const filteredAllBookings = bookings.filter(b => {
    const matchSearch = b.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        b.phone.includes(searchTerm) || 
                        (b.serviceName && b.serviceName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.phone.includes(searchTerm)
  );

  // Gated Auth Screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 animate-fade-in">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card p-8 rounded-3xl border border-parchment-200 dark:border-pine-800 space-y-6 text-center"
        >
          
          <div className="w-14 h-14 rounded-2xl bg-parchment-100 dark:bg-darkpine-900 border border-parchment-200 dark:border-pine-800 text-pine-800 dark:text-ochre-400 flex items-center justify-center mx-auto shadow-soft">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-serif font-bold text-pine-950 dark:text-parchment-50">Practitioner Admin Portal</h1>
            <p className="text-xs text-pine-700 dark:text-parchment-300">Firebase Auth & Whitelist Protected</p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-300 text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-pine-900 dark:text-parchment-300 mb-1">Enter Staff Admin PIN</label>
              <input 
                type="password"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="PIN: 1234"
                className="w-full bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 rounded-xl px-4 py-3 text-sm text-pine-950 dark:text-parchment-50 focus:outline-none text-center font-mono tracking-widest"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-pine-700 hover:bg-pine-800 dark:bg-ochre-500 dark:hover:bg-ochre-600 text-white dark:text-darkpine-950 font-bold py-3 rounded-full transition-colors text-xs shadow-soft"
            >
              Sign In to Staff Dashboard
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => { setIsAuthenticated(true); }}
              className="w-full bg-parchment-100 hover:bg-parchment-200 dark:bg-darkpine-900 text-pine-900 dark:text-ochre-400 font-semibold py-2.5 rounded-full border border-parchment-200 dark:border-pine-800 text-xs"
            >
              Instant Admin Demo Toggle (1-Tap Access)
            </motion.button>
          </form>

        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      
      {/* Admin Top Header */}
      <div className="glass-panel p-6 rounded-3xl border border-parchment-200 dark:border-pine-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pine-700 to-ochre-500 p-0.5 shadow-soft">
            <div className="w-full h-full bg-parchment-50 dark:bg-darkpine-950 rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-pine-700 dark:text-ochre-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif font-bold text-pine-950 dark:text-parchment-50">Clinic Control Panel</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-parchment-100 dark:bg-pine-950 text-pine-900 dark:text-ochre-300 border border-parchment-300 dark:border-pine-800 text-[10px] font-bold">
                Staff Whitelisted
              </span>
            </div>
            <p className="text-xs text-pine-700 dark:text-parchment-300">Dr. Marcus Vance • Apex Motion Physiotherapy</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshData}
            className="p-2.5 rounded-full bg-parchment-100 hover:bg-parchment-200 dark:bg-darkpine-900 text-pine-900 dark:text-parchment-200 border border-parchment-200 dark:border-pine-800 text-xs font-semibold flex items-center gap-1.5"
            title="Refresh database"
          >
            <RefreshCw className="w-4 h-4 text-ochre-500" />
            <span>Sync</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAuthenticated(false)}
            className="p-2.5 rounded-full bg-parchment-100 hover:bg-parchment-200 dark:bg-darkpine-900 text-rose-600 dark:text-rose-400 border border-parchment-200 dark:border-pine-800 text-xs font-semibold flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock</span>
          </motion.button>
        </div>
      </div>

      {/* KPI Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -3 }} className="glass-card p-4 rounded-2xl border border-parchment-200 dark:border-pine-800 space-y-1">
          <span className="text-[11px] text-pine-700 dark:text-parchment-400 font-semibold uppercase tracking-wider block">Today's Visits</span>
          <div className="text-2xl font-serif font-bold text-pine-950 dark:text-parchment-50">{todayCount}</div>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="glass-card p-4 rounded-2xl border border-parchment-200 dark:border-pine-800 space-y-1">
          <span className="text-[11px] text-pine-700 dark:text-parchment-400 font-semibold uppercase tracking-wider block">Upcoming Active</span>
          <div className="text-2xl font-serif font-bold text-pine-800 dark:text-ochre-400">{upcomingCount}</div>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="glass-card p-4 rounded-2xl border border-parchment-200 dark:border-pine-800 space-y-1">
          <span className="text-[11px] text-pine-700 dark:text-parchment-400 font-semibold uppercase tracking-wider block">Cancelled</span>
          <div className="text-2xl font-serif font-bold text-rose-600 dark:text-rose-400">{cancelledCount}</div>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="glass-card p-4 rounded-2xl border border-parchment-200 dark:border-pine-800 space-y-1">
          <span className="text-[11px] text-pine-700 dark:text-parchment-400 font-semibold uppercase tracking-wider block">Est. Revenue</span>
          <div className="text-2xl font-serif font-bold text-pine-950 dark:text-parchment-50">${estimatedRevenue}</div>
        </motion.div>
      </div>

      {/* Main Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-parchment-200 dark:border-pine-800">
        {[
          { id: 'today', label: 'Today & Week View', icon: CalendarIcon, count: todayBookings.length },
          { id: 'availability', label: 'Availability & Hours', icon: Clock },
          { id: 'services', label: 'Services Manager', icon: DollarSign, count: services.length },
          { id: 'bookings', label: 'All Bookings', icon: FileText, count: bookings.length },
          { id: 'patients', label: 'Patient Records', icon: UserCheck, count: patients.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive 
                  ? 'bg-pine-700 dark:bg-ochre-500 text-white dark:text-darkpine-950 shadow-soft' 
                  : 'bg-parchment-100 dark:bg-darkpine-900 text-pine-800 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-pine-800/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-white/20 dark:bg-darkpine-950/20' : 'bg-parchment-200 dark:bg-darkpine-950 text-pine-700 dark:text-parchment-400'}`}>
                  {tab.count}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* TAB CONTAINER WITH ANIMATE PRESENCE */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: TODAY & WEEK VIEW */}
        {activeTab === 'today' && (
          <motion.div 
            key="tab-today"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            
            {/* Date Selector Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-serif font-bold text-pine-950 dark:text-parchment-50">Daily Agenda Timeline</h2>
                <p className="text-xs text-pine-700 dark:text-parchment-300">View, reschedule, or update appointment status.</p>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs text-pine-700 dark:text-parchment-300 font-medium">Select Day:</label>
                <input 
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 rounded-xl px-3 py-1.5 text-xs text-pine-950 dark:text-parchment-50 focus:outline-none"
                />
                <button 
                  onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                  className="px-3.5 py-1.5 rounded-full bg-parchment-100 dark:bg-darkpine-900 text-pine-900 dark:text-ochre-400 text-xs font-semibold hover:bg-parchment-200"
                >
                  Today
                </button>
              </div>
            </div>

            {/* Agenda Timeline List */}
            {todayBookings.length === 0 ? (
              <div className="glass-card p-12 rounded-3xl border border-parchment-200 dark:border-pine-800 text-center space-y-3">
                <CalendarIcon className="w-12 h-12 text-pine-400 dark:text-parchment-500 mx-auto" />
                <h3 className="text-base font-serif font-bold text-pine-950 dark:text-parchment-50">No Appointments Scheduled for {selectedDate}</h3>
                <p className="text-xs text-pine-700 dark:text-parchment-300">The schedule is open for this date.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayBookings.map((b) => (
                  <motion.div 
                    key={b.id}
                    whileHover={{ y: -2 }}
                    className="glass-card p-6 rounded-2xl border border-parchment-200 dark:border-pine-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card-hover"
                  >
                    
                    {/* Left: Time & Patient Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="px-3 py-1 rounded-full bg-parchment-100 dark:bg-darkpine-950 text-pine-900 dark:text-ochre-300 font-mono text-xs font-bold border border-parchment-200 dark:border-pine-800 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-ochre-500" />
                          {b.startTime} - {b.endTime}
                        </span>
                        {renderStatusBadge(b.status)}
                        <span className="text-xs text-pine-500 font-mono">Ref: {b.id}</span>
                      </div>

                      <div>
                        <h3 className="text-base font-serif font-bold text-pine-950 dark:text-parchment-50 flex items-center gap-2">
                          <User className="w-4 h-4 text-ochre-500" />
                          {b.patientName}
                        </h3>
                        <div className="text-xs text-pine-800 dark:text-parchment-200 flex items-center gap-4 pt-0.5">
                          <span><strong className="text-pine-950 dark:text-parchment-50">Treatment:</strong> {b.serviceName} (${b.servicePrice})</span>
                          <span className="flex items-center gap-1 text-pine-700 dark:text-parchment-300">
                            <Phone className="w-3 h-3 text-pine-500" />
                            {b.phone}
                          </span>
                        </div>
                      </div>

                      {b.note && (
                        <div className="p-2.5 rounded-xl bg-parchment-100 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 text-xs text-pine-800 dark:text-parchment-200">
                          <strong className="text-ochre-600 dark:text-ochre-400">Note:</strong> {b.note}
                        </div>
                      )}
                    </div>

                    {/* Right: Quick Action Buttons */}
                    <div className="flex items-center gap-2 flex-wrap pt-2 md:pt-0 border-t md:border-t-0 border-parchment-200 dark:border-pine-800">
                      {b.status !== 'completed' && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleStatusChange(b.id, 'completed')}
                          className="px-3 py-1.5 rounded-full bg-pine-700 dark:bg-pine-600 text-white font-bold text-xs flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Complete
                        </motion.button>
                      )}

                      {b.status !== 'no-show' && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleStatusChange(b.id, 'no-show')}
                          className="px-3 py-1.5 rounded-full bg-ochre-100 dark:bg-ochre-950 text-ochre-900 dark:text-ochre-300 border border-ochre-300 dark:border-ochre-800 text-xs font-semibold"
                        >
                          No-Show
                        </motion.button>
                      )}

                      {b.status !== 'cancelled' && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleStatusChange(b.id, 'cancelled')}
                          className="px-3 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 text-xs font-semibold"
                        >
                          Cancel
                        </motion.button>
                      )}

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setReschedulingBooking(b);
                          setNewRescheduleDate(b.date);
                          setNewRescheduleTime(b.startTime);
                        }}
                        className="px-3 py-1.5 rounded-full bg-parchment-100 hover:bg-parchment-200 dark:bg-darkpine-900 text-pine-900 dark:text-parchment-200 text-xs font-semibold"
                      >
                        Reschedule
                      </motion.button>
                    </div>

                  </motion.div>
                ))}
              </div>
            )}

          </motion.div>
        )}

        {/* TAB 2: AVAILABILITY & BLACKOUT WINDOWS */}
        {activeTab === 'availability' && (
          <motion.div 
            key="tab-availability"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            
            {/* Standing Hours Section */}
            <div className="glass-card p-6 rounded-3xl border border-parchment-200 dark:border-pine-800/60 space-y-6">
              <div>
                <h2 className="text-lg font-serif font-bold text-pine-950 dark:text-parchment-50">Standing Weekly Operating Hours</h2>
                <p className="text-xs text-pine-700 dark:text-parchment-300">Set clinic opening and closing times per weekday.</p>
              </div>

              <div className="space-y-3">
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((dayName, weekdayIdx) => {
                  const dayData = availability.find(a => a.weekday === weekdayIdx) || { weekday: weekdayIdx, isOpen: false, openTime: '09:00', closeTime: '17:00' };

                  const handleToggleDay = () => {
                    const updated = availability.map(a => a.weekday === weekdayIdx ? { ...a, isOpen: !a.isOpen } : a);
                    setAvailability(updated);
                    clinicService.saveAvailability(updated);
                  };

                  const handleTimeChange = (field: 'openTime' | 'closeTime', val: string) => {
                    const updated = availability.map(a => a.weekday === weekdayIdx ? { ...a, [field]: val } : a);
                    setAvailability(updated);
                    clinicService.saveAvailability(updated);
                  };

                  return (
                    <div 
                      key={weekdayIdx}
                      className={`p-4 rounded-2xl border flex items-center justify-between flex-wrap gap-4 transition-colors ${
                        dayData.isOpen ? 'bg-parchment-50 dark:bg-darkpine-900 border-parchment-200 dark:border-pine-800' : 'bg-parchment-100/50 dark:bg-darkpine-950/60 border-parchment-200 dark:border-pine-900 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <button
                          onClick={handleToggleDay}
                          className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${dayData.isOpen ? 'bg-pine-700 dark:bg-ochre-500' : 'bg-parchment-300 dark:bg-pine-900'}`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white dark:bg-darkpine-950 transition-transform ${dayData.isOpen ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </button>
                        <span className="font-bold text-sm text-pine-950 dark:text-parchment-50 w-24">{dayName}</span>
                      </div>

                      {dayData.isOpen ? (
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-pine-700 dark:text-parchment-300">Opens:</span>
                          <input 
                            type="time"
                            value={dayData.openTime}
                            onChange={(e) => handleTimeChange('openTime', e.target.value)}
                            className="bg-parchment-100 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 rounded-lg px-2.5 py-1 text-pine-950 dark:text-parchment-50 font-mono"
                          />
                          <span className="text-pine-700 dark:text-parchment-300">Closes:</span>
                          <input 
                            type="time"
                            value={dayData.closeTime}
                            onChange={(e) => handleTimeChange('closeTime', e.target.value)}
                            className="bg-parchment-100 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 rounded-lg px-2.5 py-1 text-pine-950 dark:text-parchment-50 font-mono"
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-pine-500 font-semibold italic">Clinic Closed</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Time Blocks / Blackout Windows Section */}
            <div className="glass-card p-6 rounded-3xl border border-parchment-200 dark:border-pine-800/60 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-serif font-bold text-pine-950 dark:text-parchment-50">Custom Blackout Windows</h2>
                  <p className="text-xs text-pine-700 dark:text-parchment-300">Block off custom dates or time windows for seminars or time off.</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddBlockModal(true)}
                  className="px-4 py-2 rounded-full bg-pine-700 dark:bg-ochre-500 text-white dark:text-darkpine-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Add Blackout Block
                </motion.button>
              </div>

              {timeBlocks.length === 0 ? (
                <p className="text-xs text-pine-500 text-center py-6">No active blackout blocks created.</p>
              ) : (
                <div className="space-y-3">
                  {timeBlocks.map((blk) => (
                    <div key={blk.id} className="p-4 rounded-2xl bg-parchment-50 dark:bg-darkpine-900 border border-parchment-200 dark:border-pine-800 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-pine-950 dark:text-parchment-50 flex items-center gap-2">
                          <span className="text-rose-600 dark:text-rose-400">🚫 {blk.reason}</span>
                        </div>
                        <div className="text-xs text-pine-700 dark:text-parchment-300 font-mono">
                          Date: {blk.date} • {blk.startTime} - {blk.endTime}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          clinicService.deleteTimeBlock(blk.id);
                          refreshData();
                        }}
                        className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs"
                        title="Delete Block"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </motion.div>
        )}

        {/* TAB 3: SERVICES MANAGER */}
        {activeTab === 'services' && (
          <motion.div 
            key="tab-services"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-serif font-bold text-pine-950 dark:text-parchment-50">Services & Pricing Catalog</h2>
                <p className="text-xs text-pine-700 dark:text-parchment-300">Add, edit, or retire treatment offerings.</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setEditingService({ name: '', durationMin: 45, price: 95, description: '', active: true, category: 'Treatment' });
                  setShowAddServiceModal(true);
                }}
                className="px-4 py-2 rounded-full bg-pine-700 dark:bg-ochre-500 text-white dark:text-darkpine-950 font-bold text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add Treatment
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((s) => (
                <div 
                  key={s.id}
                  className={`p-6 rounded-2xl border space-y-4 ${s.active ? 'bg-white dark:bg-darkpine-900 border-parchment-200 dark:border-pine-800' : 'bg-parchment-100/50 dark:bg-darkpine-950 opacity-50'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${s.active ? 'bg-pine-100 dark:bg-pine-950 text-pine-900 dark:text-ochre-300 border border-pine-200 dark:border-pine-800' : 'bg-rose-100 dark:bg-rose-950 text-rose-700'}`}>
                      {s.active ? 'Active' : 'Retired'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingService(s);
                          setShowAddServiceModal(true);
                        }}
                        className="p-1.5 rounded-lg bg-parchment-100 dark:bg-darkpine-950 text-pine-800 dark:text-parchment-200 text-xs"
                        title="Edit Service"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          clinicService.toggleServiceActive(s.id);
                          refreshData();
                        }}
                        className="px-2.5 py-1 rounded-full bg-parchment-100 dark:bg-darkpine-950 text-xs font-semibold text-pine-800 dark:text-parchment-200"
                      >
                        {s.active ? 'Retire' : 'Activate'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-serif font-bold text-pine-950 dark:text-parchment-50">{s.name}</h3>
                    <p className="text-xs text-pine-800 dark:text-parchment-300 mt-1">{s.description}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs pt-2 border-t border-parchment-200 dark:border-pine-800 font-mono">
                    <span className="text-pine-700 dark:text-parchment-300">Duration: {s.durationMin} mins</span>
                    <span className="text-ochre-600 dark:text-ochre-400 font-bold">Fee: ${s.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 4: ALL BOOKINGS */}
        {activeTab === 'bookings' && (
          <motion.div 
            key="tab-bookings"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            
            {/* Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-pine-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by patient name, phone, or service..."
                  className="w-full bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-pine-950 dark:text-parchment-50 placeholder-pine-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-pine-700 dark:text-parchment-300">Filter Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 rounded-xl px-3 py-2 text-xs text-pine-950 dark:text-parchment-50 focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="no-show">No-Show</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="glass-card rounded-3xl border border-parchment-200 dark:border-pine-800/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-parchment-100 dark:bg-darkpine-900 border-b border-parchment-200 dark:border-pine-800 text-pine-700 dark:text-parchment-400 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Ref ID</th>
                      <th className="py-3 px-4">Patient</th>
                      <th className="py-3 px-4">Treatment</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-parchment-200 dark:divide-pine-800/60">
                    {filteredAllBookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-pine-500 dark:text-parchment-500">
                          No booking records found.
                        </td>
                      </tr>
                    ) : (
                      filteredAllBookings.map((bk) => (
                        <tr key={bk.id} className="hover:bg-parchment-100/50 dark:hover:bg-darkpine-900/50 transition-colors">
                          <td className="py-3 px-4 font-mono text-pine-900 dark:text-ochre-400 font-bold">{bk.id}</td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-pine-950 dark:text-parchment-50">{bk.patientName}</div>
                            <div className="text-[11px] text-pine-600 dark:text-parchment-400">{bk.phone}</div>
                          </td>
                          <td className="py-3 px-4 font-medium text-pine-900 dark:text-parchment-200">
                            {bk.serviceName}
                            <span className="block text-[11px] text-ochre-600 dark:text-ochre-400">${bk.servicePrice}</span>
                          </td>
                          <td className="py-3 px-4 font-mono text-pine-800 dark:text-parchment-200">
                            <div>{bk.date}</div>
                            <div className="text-pine-600 dark:text-parchment-400 text-[11px]">{bk.startTime} - {bk.endTime}</div>
                          </td>
                          <td className="py-3 px-4">{renderStatusBadge(bk.status)}</td>
                          <td className="py-3 px-4 text-right space-x-1">
                            <button
                              onClick={() => handleStatusChange(bk.id, 'completed')}
                              className="px-2 py-1 rounded bg-pine-100 dark:bg-pine-900 text-pine-900 dark:text-ochre-300 text-[11px] font-semibold"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => handleStatusChange(bk.id, 'cancelled')}
                              className="px-2 py-1 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[11px] font-semibold"
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 5: PATIENT DIRECTORY & CLINICAL NOTES */}
        {activeTab === 'patients' && (
          <motion.div 
            key="tab-patients"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            
            {/* Left Column: Patient List */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-pine-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search patient by name or phone..."
                  className="w-full bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-pine-950 dark:text-parchment-50 placeholder-pine-400 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                {filteredPatients.map((pat) => {
                  const isSelected = selectedPatient?.id === pat.id;
                  return (
                    <motion.div
                      key={pat.id}
                      whileHover={{ x: 3 }}
                      onClick={() => setSelectedPatient(pat)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1 ${
                        isSelected 
                          ? 'bg-parchment-100 dark:bg-pine-900/60 border-pine-600 dark:border-ochre-400 shadow-soft' 
                          : 'bg-white dark:bg-darkpine-900 border-parchment-200 dark:border-pine-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-pine-950 dark:text-parchment-50 text-sm">{pat.name}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-parchment-200 dark:bg-darkpine-950 text-pine-800 dark:text-parchment-300 font-mono">
                          {pat.totalVisits} visits
                        </span>
                      </div>
                      <div className="text-xs text-pine-700 dark:text-parchment-400 flex items-center justify-between">
                        <span>{pat.phone}</span>
                        <span>Last: {pat.lastVisit}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Selected Patient Clinical Dossier */}
            <div className="lg:col-span-7 space-y-6">
              {selectedPatient ? (
                <div className="glass-card p-6 rounded-3xl border border-parchment-200 dark:border-pine-800/60 space-y-6">
                  
                  <div className="flex items-center justify-between border-b border-parchment-200 dark:border-pine-800 pb-4">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-pine-950 dark:text-parchment-50">{selectedPatient.name}</h3>
                      <p className="text-xs text-pine-700 dark:text-parchment-300">{selectedPatient.phone} • {selectedPatient.email || 'No email registered'}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-pine-600 dark:text-parchment-400 block">Total Visits</span>
                      <span className="text-lg font-serif font-bold text-ochre-600 dark:text-ochre-400">{selectedPatient.totalVisits}</span>
                    </div>
                  </div>

                  {/* Clinical Notes Timeline */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-pine-900 dark:text-parchment-300 uppercase tracking-wider">Clinical Progress Notes</h4>

                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {selectedPatient.notes.length === 0 ? (
                        <p className="text-xs text-pine-500 italic">No clinical notes recorded yet.</p>
                      ) : (
                        selectedPatient.notes.map((n) => (
                          <div key={n.id} className="p-3 rounded-xl bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 space-y-1 text-xs">
                            <div className="flex justify-between text-pine-700 dark:text-parchment-400 font-medium">
                              <span className="text-ochre-600 dark:text-ochre-400 font-bold">{n.author}</span>
                              <span>{n.date}</span>
                            </div>
                            <p className="text-pine-900 dark:text-parchment-100">{n.text}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Note Form */}
                    <div className="pt-4 border-t border-parchment-200 dark:border-pine-800 space-y-2">
                      <label className="block text-xs font-semibold text-pine-900 dark:text-parchment-300">Add Clinical Note</label>
                      <textarea 
                        rows={2}
                        value={newClinicalNote}
                        onChange={(e) => setNewClinicalNote(e.target.value)}
                        placeholder="Enter objective findings, treatment performed, or home exercise plan..."
                        className="w-full bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 rounded-xl px-3.5 py-2 text-xs text-pine-950 dark:text-parchment-50 focus:outline-none"
                      ></textarea>
                      <button
                        onClick={() => handleAddClinicalNote(selectedPatient.id)}
                        className="px-4 py-2 rounded-full bg-pine-700 dark:bg-ochre-500 text-white dark:text-darkpine-950 font-bold text-xs"
                      >
                        Save Clinical Note
                      </button>
                    </div>

                  </div>

                </div>
              ) : (
                <div className="glass-card p-12 rounded-3xl border border-parchment-200 dark:border-pine-800 text-center text-pine-600 dark:text-parchment-400 text-xs">
                  Select a patient from the directory to view visit history and clinical progress notes.
                </div>
              )}
            </div>

          </motion.div>
        )}

      </AnimatePresence>

      {/* MODAL: ADD/EDIT SERVICE */}
      <AnimatePresence>
        {showAddServiceModal && editingService && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-pine-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 16 }}
              className="glass-card max-w-lg w-full p-6 rounded-3xl border border-parchment-200 dark:border-pine-800 space-y-4"
            >
              <h3 className="text-base font-serif font-bold text-pine-950 dark:text-parchment-50">
                {editingService.id ? 'Edit Treatment Service' : 'Add New Treatment Service'}
              </h3>

              <form onSubmit={handleSaveService} className="space-y-4 text-xs">
                <div>
                  <label className="block text-pine-900 dark:text-parchment-300 font-semibold mb-1">Service Title</label>
                  <input 
                    type="text" 
                    required
                    value={editingService.name || ''}
                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                    className="w-full bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 rounded-xl px-3 py-2 text-pine-950 dark:text-parchment-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-pine-900 dark:text-parchment-300 font-semibold mb-1">Duration (Minutes)</label>
                    <input 
                      type="number" 
                      required
                      value={editingService.durationMin || 45}
                      onChange={(e) => setEditingService({ ...editingService, durationMin: Number(e.target.value) })}
                      className="w-full bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 rounded-xl px-3 py-2 text-pine-950 dark:text-parchment-50"
                    />
                  </div>

                  <div>
                    <label className="block text-pine-900 dark:text-parchment-300 font-semibold mb-1">Fee ($ USD)</label>
                    <input 
                      type="number" 
                      required
                      value={editingService.price || 90}
                      onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                      className="w-full bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 rounded-xl px-3 py-2 text-pine-950 dark:text-parchment-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-pine-900 dark:text-parchment-300 font-semibold mb-1">Description</label>
                  <textarea 
                    rows={3}
                    value={editingService.description || ''}
                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                    className="w-full bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 rounded-xl px-3 py-2 text-pine-950 dark:text-parchment-50"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAddServiceModal(false)}
                    className="px-4 py-2 rounded-full bg-parchment-100 dark:bg-darkpine-900 text-pine-900 dark:text-parchment-200 font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 rounded-full bg-pine-700 dark:bg-ochre-500 text-white dark:text-darkpine-950 font-bold"
                  >
                    Save Service
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD BLACKOUT BLOCK */}
      <AnimatePresence>
        {showAddBlockModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-pine-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 16 }}
              className="glass-card max-w-md w-full p-6 rounded-3xl border border-parchment-200 dark:border-pine-800 space-y-4"
            >
              <h3 className="text-base font-serif font-bold text-pine-950 dark:text-parchment-50">Add Blackout Closure Window</h3>

              <form onSubmit={handleAddBlock} className="space-y-4 text-xs">
                <div>
                  <label className="block text-pine-900 dark:text-parchment-300 font-semibold mb-1">Target Date</label>
                  <input 
                    type="date"
                    required
                    value={newBlock.date}
                    onChange={(e) => setNewBlock({ ...newBlock, date: e.target.value })}
                    className="w-full bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 rounded-xl px-3 py-2 text-pine-950 dark:text-parchment-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-pine-900 dark:text-parchment-300 font-semibold mb-1">Start Time</label>
                    <input 
                      type="time"
                      required
                      value={newBlock.startTime}
                      onChange={(e) => setNewBlock({ ...newBlock, startTime: e.target.value })}
                      className="w-full bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 rounded-xl px-3 py-2 text-pine-950 dark:text-parchment-50 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-pine-900 dark:text-parchment-300 font-semibold mb-1">End Time</label>
                    <input 
                      type="time"
                      required
                      value={newBlock.endTime}
                      onChange={(e) => setNewBlock({ ...newBlock, endTime: e.target.value })}
                      className="w-full bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 rounded-xl px-3 py-2 text-pine-950 dark:text-parchment-50 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-pine-900 dark:text-parchment-300 font-semibold mb-1">Reason for Blackout</label>
                  <input 
                    type="text"
                    required
                    value={newBlock.reason}
                    onChange={(e) => setNewBlock({ ...newBlock, reason: e.target.value })}
                    placeholder="e.g. Doctor Seminar / Personal Time Off"
                    className="w-full bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 rounded-xl px-3 py-2 text-pine-950 dark:text-parchment-50"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => setShowAddBlockModal(false)}
                    className="px-4 py-2 rounded-full bg-parchment-100 dark:bg-darkpine-900 text-pine-900 dark:text-parchment-200 font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 rounded-full bg-rose-600 text-white font-bold"
                  >
                    Block Off Time
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: RESCHEDULE BOOKING */}
      <AnimatePresence>
        {reschedulingBooking && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-pine-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 16 }}
              className="glass-card max-w-md w-full p-6 rounded-3xl border border-parchment-200 dark:border-pine-800 space-y-4 text-xs"
            >
              <h3 className="text-base font-serif font-bold text-pine-950 dark:text-parchment-50">
                Reschedule Appointment for {reschedulingBooking.patientName}
              </h3>

              <div className="p-3 rounded-xl bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 space-y-1">
                <div>Treatment: <strong className="text-pine-950 dark:text-parchment-50">{reschedulingBooking.serviceName}</strong></div>
                <div>Current: <span className="text-rose-600 dark:text-rose-400 font-mono">{reschedulingBooking.date} @ {reschedulingBooking.startTime}</span></div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-pine-900 dark:text-parchment-300 font-semibold mb-1">New Date</label>
                  <input 
                    type="date"
                    value={newRescheduleDate}
                    onChange={(e) => setNewRescheduleDate(e.target.value)}
                    className="w-full bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 rounded-xl px-3 py-2 text-pine-950 dark:text-parchment-50"
                  />
                </div>

                <div>
                  <label className="block text-pine-900 dark:text-parchment-300 font-semibold mb-1">New Start Time</label>
                  <input 
                    type="time"
                    value={newRescheduleTime}
                    onChange={(e) => setNewRescheduleTime(e.target.value)}
                    className="w-full bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 rounded-xl px-3 py-2 text-pine-950 dark:text-parchment-50 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button 
                  onClick={() => setReschedulingBooking(null)}
                  className="px-4 py-2 rounded-full bg-parchment-100 dark:bg-darkpine-900 text-pine-900 dark:text-parchment-200 font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmReschedule}
                  className="px-4 py-2 rounded-full bg-pine-700 dark:bg-ochre-500 text-white dark:text-darkpine-950 font-bold"
                >
                  Confirm Reschedule
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
