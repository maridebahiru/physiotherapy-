import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, DollarSign, CheckCircle2, User, Phone, Mail, 
  FileText, ArrowRight, ArrowLeft, AlertCircle, Sparkles, Download, MessageSquare, Search, ShieldCheck, MapPin, Award
} from 'lucide-react';
import { clinicService, defaultClinicProfile } from '../services/clinicService';
import { Service, Booking } from '../types';

interface BookingFlowProps {
  preselectedServiceId?: string;
  onNavigate: (path: string) => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({ preselectedServiceId, onNavigate }) => {
  const profile = defaultClinicProfile;

  // Step State (1-5)
  const [step, setStep] = useState<number>(1);

  // Active Services list
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Selected Date & Time
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  // Patient Info
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [symptomTags, setSymptomTags] = useState<string[]>([]);

  // Created Booking Result
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Phone Lookup State
  const [showLookupModal, setShowLookupModal] = useState(false);
  const [lookupPhone, setLookupPhone] = useState('');
  const [foundBookings, setFoundBookings] = useState<Booking[]>([]);
  const [lookupSearched, setLookupSearched] = useState(false);

  // Load Services on mount
  useEffect(() => {
    const active = clinicService.getActiveServices();
    setServices(active);

    if (preselectedServiceId) {
      const match = active.find(s => s.id === preselectedServiceId);
      if (match) {
        setSelectedService(match);
        setStep(2); // Jump straight to Date selection
      } else if (active.length > 0) {
        setSelectedService(active[0]);
      }
    } else if (active.length > 0) {
      setSelectedService(active[0]);
    }

    // Default selected date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    setSelectedDate(dateStr);
  }, [preselectedServiceId]);

  // Recalculate available slots whenever date or service changes
  useEffect(() => {
    if (selectedDate && selectedService) {
      const slots = clinicService.getAvailableSlots(selectedDate, selectedService.durationMin);
      setAvailableSlots(slots);
      if (selectedSlot && !slots.includes(selectedSlot)) {
        setSelectedSlot('');
      }
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate, selectedService]);

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    setErrorMsg('');
    setStep(2);
  };

  const handleSelectDate = (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedSlot('');
    setErrorMsg('');
  };

  const handleSelectSlot = (slotStr: string) => {
    setSelectedSlot(slotStr);
    setErrorMsg('');
  };

  const handleGoToDetails = () => {
    if (!selectedDate) {
      setErrorMsg('Please select a date.');
      return;
    }
    if (!selectedSlot) {
      setErrorMsg('Please select an available time slot.');
      return;
    }
    setErrorMsg('');
    setStep(4);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedSlot) return;
    if (!patientName.trim() || !phone.trim()) {
      setErrorMsg('Please enter your name and phone number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const fullNote = [
        symptomTags.length > 0 ? `Symptoms: [${symptomTags.join(', ')}]` : '',
        note.trim()
      ].filter(Boolean).join(' | ');

      const booking = clinicService.createBooking({
        serviceId: selectedService.id,
        patientName,
        phone,
        email: email || undefined,
        date: selectedDate,
        startTime: selectedSlot,
        note: fullNote || undefined
      });

      setConfirmedBooking(booking);
      setStep(5);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete booking. Please try another slot.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate .ics Calendar File Download
  const downloadCalendarFile = (booking: Booking) => {
    const startTimeStr = `${booking.date.replace(/-/g, '')}T${booking.startTime.replace(':', '')}00`;
    const endTimeStr = `${booking.date.replace(/-/g, '')}T${booking.endTime.replace(':', '')}00`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Apex Motion Physio//Booking//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${booking.serviceName || 'Physiotherapy Appointment'} - Dr. Marcus Vance`,
      `DESCRIPTION:Physiotherapy session with Dr. Marcus Vance. Address: ${profile.address}.`,
      `LOCATION:Apex Motion Physiotherapy, ${profile.address}`,
      `DTSTART:${startTimeStr}`,
      `DTEND:${endTimeStr}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `physio_appointment_${booking.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePhoneLookup = () => {
    if (!lookupPhone.trim()) return;
    const all = clinicService.getBookings();
    const cleanedSearch = lookupPhone.replace(/\D/g, '');
    const matches = all.filter(b => b.phone.replace(/\D/g, '').includes(cleanedSearch));
    setFoundBookings(matches);
    setLookupSearched(true);
  };

  const quickSymptoms = [
    "Lower Back Stiffness", "Sciatica Pain", "Shoulder Impingement", 
    "Knee Instability", "Neck Strain", "Post-op Rehab", "Sports Injury"
  ];

  const toggleSymptomTag = (tag: string) => {
    if (symptomTags.includes(tag)) {
      setSymptomTags(symptomTags.filter(t => t !== tag));
    } else {
      setSymptomTags([...symptomTags, tag]);
    }
  };

  const getNextDays = (count = 14) => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < count; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isoStr = d.toISOString().split('T')[0];
      const weekdayNum = d.getDay(); // 0-6
      
      const avail = clinicService.getAvailability().find(a => a.weekday === weekdayNum);
      const isClosed = !avail || !avail.isOpen;
      
      days.push({
        dateStr: isoStr,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        monthName: d.toLocaleDateString('en-US', { month: 'short' }),
        isClosed
      });
    }
    return days;
  };

  const next14Days = getNextDays();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-20">
      
      {/* Header & Step Progress */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-pine-950 dark:text-parchment-50 tracking-tight">
            Book Appointment
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLookupModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-parchment-100 dark:bg-darkpine-900 border border-parchment-200 dark:border-pine-800 text-xs text-ochre-600 dark:text-ochre-400 font-semibold"
          >
            <Search className="w-3.5 h-3.5" />
            Lookup Existing Booking
          </motion.button>
        </div>
        <p className="text-xs sm:text-sm text-pine-800 dark:text-parchment-200">
          Select your service, choose a date & time, and reserve your 1-on-1 consultation directly. Pay at desk after treatment.
        </p>

        {/* Step Progress Indicator */}
        <div className="flex items-center justify-between max-w-xl mx-auto pt-3">
          {[
            { num: 1, label: "Service" },
            { num: 2, label: "Date" },
            { num: 3, label: "Slot" },
            { num: 4, label: "Details" },
            { num: 5, label: "Confirm" }
          ].map((st) => {
            const isCompleted = step > st.num;
            const isCurrent = step === st.num;
            return (
              <div key={st.num} className="flex flex-col items-center gap-1 flex-1 relative">
                <motion.div 
                  animate={{ scale: isCurrent ? 1.15 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors z-10 ${
                    isCompleted 
                      ? 'bg-pine-700 dark:bg-pine-600 text-white'
                      : isCurrent 
                      ? 'bg-ochre-500 text-darkpine-950 shadow-glow-ochre font-bold' 
                      : 'bg-parchment-100 dark:bg-darkpine-900 text-pine-600 dark:text-parchment-400 border border-parchment-200 dark:border-pine-800'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5 stroke-[2.5]" /> : st.num}
                </motion.div>
                <span className={`text-[11px] font-medium ${isCurrent ? 'text-ochre-600 dark:text-ochre-400 font-bold' : isCompleted ? 'text-pine-700 dark:text-pine-400' : 'text-pine-600 dark:text-parchment-400'}`}>
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Alert Box */}
      {errorMsg && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto p-4 rounded-2xl bg-rose-900/10 border border-rose-500/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      {/* TWO-COLUMN LAYOUT FOR DESKTOP (LEFT: CLINIC INFO/BENEFITS | RIGHT: BOOKING WIZARD) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: CLINIC INFO & BOOKING GUARANTEES */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-parchment-200 dark:border-pine-800/80 space-y-6 shadow-soft">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ochre-600 dark:text-ochre-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Direct Care Guarantee
              </span>
              <h3 className="text-xl font-serif font-bold text-pine-950 dark:text-parchment-50">
                1-on-1 Physiotherapy
              </h3>
              <p className="text-xs text-pine-800 dark:text-parchment-300 leading-relaxed">
                Your appointment is reserved exclusively for you with <strong className="text-pine-950 dark:text-parchment-50">{profile.name}</strong>.
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-parchment-200 dark:border-pine-800/60 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-ochre-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-pine-950 dark:text-parchment-100 block">Zero Online Payment</strong>
                  <span className="text-pine-700 dark:text-parchment-400">Pay conveniently at clinic desk after treatment.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-ochre-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-pine-950 dark:text-parchment-100 block">Instant Real-time Slot Lock</strong>
                  <span className="text-pine-700 dark:text-parchment-400">Automated double-booking collision protection.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-ochre-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-pine-950 dark:text-parchment-100 block">Insurance Claim Invoices</strong>
                  <span className="text-pine-700 dark:text-parchment-400">Itemized medical receipt provided for health coverage.</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-parchment-100/60 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-pine-950 dark:text-parchment-50">
                <MapPin className="w-4 h-4 text-ochre-500" />
                Clinic Address:
              </div>
              <p className="text-pine-800 dark:text-parchment-300 leading-snug">
                {profile.address}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BOOKING WIZARD STEPS */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: CHOOSE SERVICE */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-serif font-bold text-pine-950 dark:text-parchment-50">Step 1: Select Treatment Service</h2>
                  <span className="text-xs text-pine-700 dark:text-parchment-300">Upfront pricing • Pay at desk</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((s) => {
                    const isSelected = selectedService?.id === s.id;
                    return (
                      <motion.div
                        key={s.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectService(s)}
                        className={`p-6 rounded-2xl border cursor-pointer transition-colors space-y-3 relative ${
                          isSelected 
                            ? 'bg-parchment-100 dark:bg-pine-900/40 border-pine-600 dark:border-ochre-400 shadow-soft' 
                            : 'bg-white dark:bg-darkpine-900 border-parchment-200/80 dark:border-pine-800/50 hover:border-pine-400 dark:hover:border-pine-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-parchment-200 dark:bg-darkpine-950 text-pine-900 dark:text-ochre-300 border border-parchment-300 dark:border-pine-800">
                            {s.category || 'Treatment'}
                          </span>
                          <div className="text-lg font-serif font-bold text-pine-950 dark:text-parchment-50 flex items-center">
                            <DollarSign className="w-4 h-4 text-ochre-500 -mr-0.5" />
                            {s.price}
                          </div>
                        </div>

                        <h3 className="text-base font-serif font-bold text-pine-950 dark:text-parchment-50">{s.name}</h3>
                        <p className="text-xs text-pine-800 dark:text-parchment-200 line-clamp-2">{s.description}</p>

                        <div className="flex items-center justify-between pt-2 border-t border-parchment-200 dark:border-pine-800/60 text-xs">
                          <span className="flex items-center gap-1 text-pine-700 dark:text-parchment-300">
                            <Clock className="w-3.5 h-3.5 text-ochre-500" />
                            {s.durationMin} minutes
                          </span>
                          <span className="text-pine-700 dark:text-ochre-400 font-bold flex items-center gap-1">
                            Select Service <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2 & STEP 3: PICK DATE & PICK SLOT */}
            {(step === 2 || step === 3) && selectedService && (
              <motion.div 
                key="step2and3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                
                {/* Selected Service Summary Bar */}
                <div className="glass-panel p-4 rounded-2xl border border-parchment-200 dark:border-pine-800 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-parchment-100 dark:bg-pine-900 text-ochre-600 dark:text-ochre-400 border border-parchment-200 dark:border-pine-800">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-pine-700 dark:text-parchment-300">Selected Treatment:</span>
                      <div className="text-sm font-serif font-bold text-pine-950 dark:text-parchment-50">{selectedService.name}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-pine-800 dark:text-parchment-200 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-ochre-500" />
                      {selectedService.durationMin} mins
                    </span>
                    <span className="text-sm font-serif font-bold text-ochre-600 dark:text-ochre-400">
                      ${selectedService.price}
                    </span>
                    <button 
                      onClick={() => setStep(1)} 
                      className="text-xs text-pine-700 dark:text-ochre-400 hover:underline font-semibold"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Date Picker Grid */}
                <div className="space-y-4">
                  <h2 className="text-lg font-serif font-bold text-pine-950 dark:text-parchment-50 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-ochre-500" />
                    Step 2: Choose Appointment Date
                  </h2>

                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {next14Days.map((d) => {
                      const isSelected = selectedDate === d.dateStr;
                      return (
                        <motion.button
                          key={d.dateStr}
                          disabled={d.isClosed}
                          whileHover={!d.isClosed ? { scale: 1.05 } : {}}
                          whileTap={!d.isClosed ? { scale: 0.95 } : {}}
                          onClick={() => handleSelectDate(d.dateStr)}
                          className={`p-3 rounded-2xl border text-center transition-colors flex flex-col items-center justify-center gap-0.5 ${
                            d.isClosed
                              ? 'opacity-30 bg-parchment-100 dark:bg-darkpine-950 border-parchment-200 dark:border-pine-900 cursor-not-allowed text-pine-400 dark:text-parchment-600'
                              : isSelected
                              ? 'bg-pine-700 dark:bg-ochre-500 text-white dark:text-darkpine-950 border-pine-800 dark:border-ochre-400 shadow-soft font-bold'
                              : 'bg-white dark:bg-darkpine-900 text-pine-900 dark:text-parchment-100 border-parchment-200 dark:border-pine-800 hover:border-pine-400 dark:hover:border-pine-600'
                          }`}
                        >
                          <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">{d.dayName}</span>
                          <span className="text-lg font-bold">{d.dayNum}</span>
                          <span className="text-[10px] opacity-70">{d.isClosed ? 'Closed' : d.monthName}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slot Picker Grid */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-serif font-bold text-pine-950 dark:text-parchment-50 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-ochre-500" />
                      Step 3: Pick Available Time Slot
                    </h2>
                    <span className="text-xs text-pine-700 dark:text-parchment-300">
                      {selectedDate ? `Slots for ${selectedDate}` : 'Select a date above'}
                    </span>
                  </div>

                  {availableSlots.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-parchment-100 dark:bg-darkpine-900/60 border border-parchment-200 dark:border-pine-800 text-center space-y-2">
                      <p className="text-sm text-pine-900 dark:text-parchment-200">
                        No open slots available on this date for a {selectedService.durationMin}-minute treatment.
                      </p>
                      <p className="text-xs text-pine-600 dark:text-parchment-400">
                        Please pick another date above or select a shorter service duration.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {availableSlots.map((slot) => {
                        const isSelected = selectedSlot === slot;
                        return (
                          <motion.button
                            key={slot}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.94 }}
                            onClick={() => handleSelectSlot(slot)}
                            className={`py-3 px-2 rounded-xl text-xs font-bold border transition-colors ${
                              isSelected
                                ? 'bg-pine-700 dark:bg-ochre-500 text-white dark:text-darkpine-950 border-pine-800 dark:border-ochre-400 shadow-soft'
                                : 'bg-white dark:bg-darkpine-900 text-pine-900 dark:text-parchment-100 border-parchment-200 dark:border-pine-800 hover:border-pine-400 dark:hover:border-pine-600'
                            }`}
                          >
                            {slot}
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Bottom Action */}
                <div className="flex items-center justify-between pt-6 border-t border-parchment-200 dark:border-pine-800">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 rounded-full bg-parchment-100 hover:bg-parchment-200 dark:bg-darkpine-900 text-pine-900 dark:text-parchment-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </motion.button>

                  <motion.button
                    disabled={!selectedDate || !selectedSlot}
                    whileHover={selectedDate && selectedSlot ? { scale: 1.05 } : {}}
                    whileTap={selectedDate && selectedSlot ? { scale: 0.95 } : {}}
                    onClick={handleGoToDetails}
                    className={`px-8 py-3 rounded-full font-bold text-xs transition-all flex items-center gap-2 ${
                      selectedDate && selectedSlot
                        ? 'bg-pine-700 hover:bg-pine-800 dark:bg-ochre-500 dark:hover:bg-ochre-600 text-white dark:text-darkpine-950 shadow-soft'
                        : 'bg-parchment-200 dark:bg-darkpine-900 text-pine-400 dark:text-parchment-600 cursor-not-allowed'
                    }`}
                  >
                    <span>Continue to Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>

              </motion.div>
            )}

            {/* STEP 4: ENTER DETAILS */}
            {step === 4 && selectedService && (
              <motion.form 
                key="step4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleConfirmBooking} 
                className="space-y-6"
              >
                
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-serif font-bold text-pine-950 dark:text-parchment-50">Step 4: Enter Patient Details</h2>
                  <span className="text-xs text-pine-700 dark:text-parchment-300">Guest booking • No login needed</span>
                </div>

                {/* Booking Summary Box */}
                <div className="p-4 rounded-2xl bg-parchment-100 dark:bg-darkpine-900 border border-parchment-200 dark:border-pine-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-pine-600 dark:text-parchment-400 block">Service</span>
                    <span className="font-bold text-pine-950 dark:text-parchment-50 truncate block">{selectedService.name}</span>
                  </div>
                  <div>
                    <span className="text-pine-600 dark:text-parchment-400 block">Date</span>
                    <span className="font-bold text-pine-800 dark:text-ochre-400 block">{selectedDate}</span>
                  </div>
                  <div>
                    <span className="text-pine-600 dark:text-parchment-400 block">Time Slot</span>
                    <span className="font-bold text-pine-800 dark:text-ochre-400 block">{selectedSlot}</span>
                  </div>
                  <div>
                    <span className="text-pine-600 dark:text-parchment-400 block">Total Due at Desk</span>
                    <span className="font-serif font-bold text-pine-950 dark:text-parchment-50 block">${selectedService.price}</span>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-3xl border border-parchment-200 dark:border-pine-800/60 space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-pine-900 dark:text-parchment-300 mb-1.5 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-ochre-500" />
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 rounded-xl px-4 py-3 text-xs text-pine-950 dark:text-parchment-50 focus:outline-none focus:border-pine-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-pine-900 dark:text-parchment-300 mb-1.5 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-ochre-500" />
                        Mobile Phone <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. (555) 234-5678"
                        className="w-full bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 rounded-xl px-4 py-3 text-xs text-pine-950 dark:text-parchment-50 focus:outline-none focus:border-pine-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-pine-900 dark:text-parchment-300 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-pine-600 dark:text-parchment-400" />
                      Email Address <span className="text-pine-600 dark:text-parchment-400">(Optional - for calendar invitation)</span>
                    </label>
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. sarah.j@example.com"
                      className="w-full bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 rounded-xl px-4 py-3 text-xs text-pine-950 dark:text-parchment-50 focus:outline-none focus:border-pine-600"
                    />
                  </div>

                  {/* Quick Symptom Chips */}
                  <div className="space-y-2 pt-2 border-t border-parchment-200 dark:border-pine-800">
                    <label className="block text-xs font-semibold text-pine-900 dark:text-parchment-300">
                      Primary Symptoms / Complaint Tags:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {quickSymptoms.map((sym) => {
                        const isSelected = symptomTags.includes(sym);
                        return (
                          <motion.button
                            type="button"
                            key={sym}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleSymptomTag(sym)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                              isSelected
                                ? 'bg-pine-700 dark:bg-ochre-500 text-white dark:text-darkpine-950 border-pine-800 dark:border-ochre-400'
                                : 'bg-parchment-100 dark:bg-darkpine-950 text-pine-800 dark:text-parchment-300 border-parchment-200 dark:border-pine-800 hover:border-pine-400'
                            }`}
                          >
                            {sym}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-pine-900 dark:text-parchment-300 mb-1.5 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-pine-600 dark:text-parchment-400" />
                      Short Clinical Note / Complaint
                    </label>
                    <textarea 
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Describe how long you've had pain, specific aggravating movements, or previous treatments..."
                      className="w-full bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 rounded-xl px-4 py-3 text-xs text-pine-950 dark:text-parchment-50 focus:outline-none focus:border-pine-600"
                    ></textarea>
                  </div>

                </div>

                <div className="flex items-center justify-between pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setStep(3)}
                    className="px-4 py-2.5 rounded-full bg-parchment-100 hover:bg-parchment-200 dark:bg-darkpine-900 text-pine-900 dark:text-parchment-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </motion.button>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-pine-700 hover:bg-pine-800 dark:bg-ochre-500 dark:hover:bg-ochre-600 text-white dark:text-darkpine-950 font-bold text-sm px-8 py-3.5 rounded-full shadow-soft transition-all flex items-center gap-2"
                  >
                    {isSubmitting ? 'Confirming...' : 'Confirm Appointment Booking'}
                    <CheckCircle2 className="w-5 h-5 text-white dark:text-darkpine-950" />
                  </motion.button>
                </div>

              </motion.form>
            )}

            {/* STEP 5: CONFIRMATION SCREEN */}
            {step === 5 && confirmedBooking && (
              <motion.div 
                key="step5"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="space-y-6"
              >
                
                <div className="glass-card p-8 rounded-3xl border border-pine-500/40 text-center space-y-6 relative overflow-hidden">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
                    className="w-16 h-16 rounded-full bg-pine-100 dark:bg-pine-900/60 border border-pine-300 dark:border-pine-700 flex items-center justify-center mx-auto"
                  >
                    <CheckCircle2 className="w-10 h-10 text-pine-700 dark:text-ochre-400" />
                  </motion.div>

                  <div className="space-y-2">
                    <span className="px-3 py-1 rounded-full bg-parchment-100 dark:bg-pine-950 text-pine-900 dark:text-ochre-300 text-xs font-bold border border-parchment-300 dark:border-pine-800 uppercase tracking-widest">
                      Booking Confirmed
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-pine-950 dark:text-parchment-50">
                      You're All Set, {confirmedBooking.patientName}!
                    </h2>
                    <p className="text-xs text-pine-800 dark:text-parchment-200 max-w-md mx-auto">
                      Your appointment with <strong className="text-pine-950 dark:text-parchment-50">Dr. Marcus Vance</strong> is reserved. Payment of <strong className="text-ochre-600 dark:text-ochre-400">${confirmedBooking.servicePrice}</strong> will be collected at the desk following your treatment.
                    </p>
                  </div>

                  {/* Receipt Summary Details */}
                  <div className="max-w-md mx-auto p-4 rounded-2xl bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 text-left space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-parchment-200 dark:border-pine-900">
                      <span className="text-pine-600 dark:text-parchment-400">Booking Reference</span>
                      <span className="font-mono font-bold text-pine-900 dark:text-ochre-400">{confirmedBooking.id}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-parchment-200 dark:border-pine-900">
                      <span className="text-pine-600 dark:text-parchment-400">Treatment</span>
                      <span className="font-bold text-pine-950 dark:text-parchment-50">{confirmedBooking.serviceName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-parchment-200 dark:border-pine-900">
                      <span className="text-pine-600 dark:text-parchment-400">Date & Time</span>
                      <span className="font-bold text-pine-800 dark:text-ochre-400">{confirmedBooking.date} @ {confirmedBooking.startTime} - {confirmedBooking.endTime}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-parchment-200 dark:border-pine-900">
                      <span className="text-pine-600 dark:text-parchment-400">Location</span>
                      <span className="font-semibold text-pine-900 dark:text-parchment-200">{profile.address}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-pine-600 dark:text-parchment-400">Patient Phone</span>
                      <span className="font-semibold text-pine-900 dark:text-parchment-200">{confirmedBooking.phone}</span>
                    </div>
                  </div>

                  {/* Actions: Calendar Export & WhatsApp Share */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => downloadCalendarFile(confirmedBooking)}
                      className="w-full sm:w-auto px-6 py-3 rounded-full bg-parchment-100 hover:bg-parchment-200 dark:bg-darkpine-900 text-pine-900 dark:text-parchment-100 font-bold text-xs border border-parchment-200 dark:border-pine-800 flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4 text-ochre-500" />
                      <span>Add to Calendar (.ics)</span>
                    </motion.button>

                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={`https://wa.me/251912345678?text=${encodeURIComponent(`Hi Dr. Vance, I just booked appointment ${confirmedBooking.id} for ${confirmedBooking.date} at ${confirmedBooking.startTime}.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto px-6 py-3 rounded-full bg-pine-700 hover:bg-pine-800 dark:bg-ochre-500 dark:hover:bg-ochre-600 text-white dark:text-darkpine-950 font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Confirm on WhatsApp</span>
                    </motion.a>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => onNavigate('/')}
                      className="text-xs text-pine-700 dark:text-parchment-300 hover:underline"
                    >
                      Return to Clinic Homepage
                    </button>
                  </div>

                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* MODAL: LOOKUP EXISTING BOOKING BY PHONE */}
      <AnimatePresence>
        {showLookupModal && (
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
              
              <div className="flex items-center justify-between">
                <h3 className="text-base font-serif font-bold text-pine-950 dark:text-parchment-50 flex items-center gap-2">
                  <Search className="w-4 h-4 text-ochre-500" />
                  Lookup My Appointments
                </h3>
                <button 
                  onClick={() => { setShowLookupModal(false); setLookupSearched(false); }}
                  className="text-pine-600 dark:text-parchment-400 hover:text-pine-950 dark:hover:text-white text-xs font-bold"
                >
                  ✕ Close
                </button>
              </div>

              <p className="text-xs text-pine-800 dark:text-parchment-300">
                Enter your mobile phone number to retrieve past and upcoming booking records.
              </p>

              <div className="flex gap-2">
                <input 
                  type="tel"
                  value={lookupPhone}
                  onChange={(e) => setLookupPhone(e.target.value)}
                  placeholder="e.g. 555-234-5678"
                  className="flex-1 bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 rounded-xl px-3.5 py-2 text-xs text-pine-950 dark:text-parchment-50 focus:outline-none"
                />
                <button
                  onClick={handlePhoneLookup}
                  className="bg-pine-700 dark:bg-ochre-500 text-white dark:text-darkpine-950 font-bold text-xs px-4 py-2 rounded-xl"
                >
                  Search
                </button>
              </div>

              {lookupSearched && (
                <div className="space-y-3 pt-2 max-h-60 overflow-y-auto">
                  {foundBookings.length === 0 ? (
                    <p className="text-xs text-pine-600 dark:text-parchment-400 text-center py-4">No appointments found matching that phone number.</p>
                  ) : (
                    foundBookings.map((b) => (
                      <div key={b.id} className="p-3 rounded-xl bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 text-xs space-y-1">
                        <div className="flex justify-between font-semibold">
                          <span className="text-pine-950 dark:text-parchment-50">{b.serviceName}</span>
                          <span className={`capitalize ${b.status === 'confirmed' ? 'text-pine-700 dark:text-ochre-400' : 'text-ochre-600'}`}>{b.status}</span>
                        </div>
                        <div className="text-pine-700 dark:text-parchment-300">{b.date} @ {b.startTime} - {b.endTime}</div>
                      </div>
                    ))
                  )}
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
