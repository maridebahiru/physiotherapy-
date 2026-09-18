import { Service, AvailabilityDay, TimeBlock, Booking, PatientRecord, ClinicProfile } from '../types';

// Default Clinic Profile Data
export const defaultClinicProfile: ClinicProfile = {
  name: "Apex Motion Physiotherapy",
  title: "Lead Physiotherapist & Sports Rehabilitation Specialist",
  bio: "Dr. Marcus Vance, DPT, OCS, CSCS has over 12 years of clinical experience restoring mobility, alleviating spinal and joint pain, and optimizing athletic movement. Former physical therapy consultant for Olympic sprinters and collegiate athletic teams.",
  phone: "+251 91 234 5678",
  email: "care@apexmotionphysio.com",
  address: "Kebele 01, Main Avenue, Near Health Center, Dire Dawa, Ethiopia",
  mapCoordinates: { lat: 9.5931, lng: 41.8661 },
  qualifications: [
    "Doctor of Physical Therapy (DPT) - Stanford Medicine",
    "Board Certified Orthopedic Clinical Specialist (OCS)",
    "Certified Strength & Conditioning Specialist (CSCS)",
    "Dry Needling & Myofascial Release Certified",
    "Spinal Manipulation & Manual Therapy Fellow"
  ],
  treatedConditions: [
    "Chronic Lower Back & Sciatica Pain",
    "Rotator Cuff & Shoulder Impingement",
    "Post-Surgical Knee & ACL Rehabilitation",
    "Neck Strain, Whiplash & Cervical Headaches",
    "Sports Tendinopathy & Muscle Tears",
    "Postural Dysfunction & Ergonomic Overuse"
  ],
  photoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800"
};

// Default Services
export const defaultServices: Service[] = [
  {
    id: "serv-1",
    name: "Initial Comprehensive Assessment & Treatment",
    durationMin: 60,
    price: 130,
    description: "In-depth biomechanical assessment, postural analysis, diagnostic physical testing, hands-on treatment, and a personalized recovery roadmap.",
    active: true,
    category: "Assessment",
    recommendedFor: ["First-time visitors", "Complex or acute injuries", "Post-op consultation"]
  },
  {
    id: "serv-2",
    name: "Sports Injury & Manual Therapy Session",
    durationMin: 45,
    price: 95,
    description: "Targeted joint mobilization, deep tissue myofascial release, dry needling, and corrective movement therapy for active individuals.",
    active: true,
    category: "Treatment",
    recommendedFor: ["Runners & athletes", "Overuse strains", "Joint stiffness"]
  },
  {
    id: "serv-3",
    name: "Spinal Rehabilitation & Spinal Decompression",
    durationMin: 45,
    price: 100,
    description: "Focused therapeutic protocol targeting herniated discs, chronic sciatica, lumbar instability, and neck tension.",
    active: true,
    category: "Spine & Neck",
    recommendedFor: ["Sciatica", "Herniated discs", "Neck stiffness"]
  },
  {
    id: "serv-4",
    name: "Post-Operative Orthopedic Rehabilitation",
    durationMin: 60,
    price: 120,
    description: "Evidence-based post-surgical protocol for ACL repairs, joint replacements, meniscus procedures, and rotator cuff repairs.",
    active: true,
    category: "Rehab",
    recommendedFor: ["Post-surgery recovery", "Joint replacements"]
  },
  {
    id: "serv-5",
    name: "Express Physical Maintenance & Dry Needling",
    durationMin: 30,
    price: 65,
    description: "Fast-track focused session for returning patients requiring dry needling, targeted manual release, or quick joint tune-up.",
    active: true,
    category: "Express Care",
    recommendedFor: ["Established patients", "Quick tune-ups", "Trigger point release"]
  }
];

// Default Weekly Standing Availability (0 = Sun, 1 = Mon, ..., 6 = Sat)
export const defaultAvailability: AvailabilityDay[] = [
  { weekday: 0, isOpen: false, openTime: "09:00", closeTime: "17:00" }, // Sun closed
  { weekday: 1, isOpen: true, openTime: "08:00", closeTime: "18:00" },  // Mon
  { weekday: 2, isOpen: true, openTime: "08:00", closeTime: "18:00" },  // Tue
  { weekday: 3, isOpen: true, openTime: "08:00", closeTime: "18:00" },  // Wed
  { weekday: 4, isOpen: true, openTime: "08:00", closeTime: "18:00" },  // Thu
  { weekday: 5, isOpen: true, openTime: "08:00", closeTime: "16:00" },  // Fri
  { weekday: 6, isOpen: true, openTime: "09:00", closeTime: "14:00" },  // Sat
];

// Default Time Blocks (blackout windows)
export const defaultTimeBlocks: TimeBlock[] = [
  {
    id: "block-1",
    date: getTodayOffsetDate(3),
    startTime: "12:00",
    endTime: "14:00",
    reason: "Clinical Staff Training & Seminar"
  }
];

// Helper to get formatted YYYY-MM-DD
function getTodayOffsetDate(offsetDays: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

// Default Sample Bookings
export const defaultBookings: Booking[] = [
  {
    id: "book-101",
    serviceId: "serv-1",
    serviceName: "Initial Comprehensive Assessment & Treatment",
    servicePrice: 130,
    serviceDurationMin: 60,
    patientName: "Sarah Jenkins",
    phone: "+1 (555) 234-5678",
    email: "sarah.j@example.com",
    date: getTodayOffsetDate(0),
    startTime: "09:00",
    endTime: "10:00",
    status: "confirmed",
    note: "Acute lower back stiffness after marathon training.",
    createdAt: new Date().toISOString()
  },
  {
    id: "book-102",
    serviceId: "serv-2",
    serviceName: "Sports Injury & Manual Therapy Session",
    servicePrice: 95,
    serviceDurationMin: 45,
    patientName: "David Miller",
    phone: "+1 (555) 876-5432",
    email: "david.m@example.com",
    date: getTodayOffsetDate(0),
    startTime: "11:00",
    endTime: "11:45",
    status: "pending",
    note: "Right shoulder pinch during bench press.",
    createdAt: new Date().toISOString()
  },
  {
    id: "book-103",
    serviceId: "serv-3",
    serviceName: "Spinal Rehabilitation & Decompression",
    servicePrice: 100,
    serviceDurationMin: 45,
    patientName: "Elena Rostova",
    phone: "+1 (555) 345-6789",
    email: "elena.r@example.com",
    date: getTodayOffsetDate(1),
    startTime: "14:00",
    endTime: "14:45",
    status: "confirmed",
    note: "L4-L5 sciatica radiating into left hamstring.",
    createdAt: new Date().toISOString()
  }
];

// Default Patient Records
export const defaultPatients: PatientRecord[] = [
  {
    id: "pat-1",
    phone: "+1 (555) 234-5678",
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    firstVisit: "2026-08-10",
    lastVisit: getTodayOffsetDate(0),
    totalVisits: 3,
    notes: [
      {
        id: "pn-1",
        date: "2026-08-10",
        author: "Dr. Marcus Vance",
        text: "Initial evaluation showed lumbar tightness & tight hip flexors. Administered soft tissue therapy."
      }
    ]
  },
  {
    id: "pat-2",
    phone: "+1 (555) 876-5432",
    name: "David Miller",
    email: "david.m@example.com",
    firstVisit: "2026-09-01",
    lastVisit: getTodayOffsetDate(0),
    totalVisits: 2,
    notes: [
      {
        id: "pn-2",
        date: "2026-09-01",
        author: "Dr. Marcus Vance",
        text: "Shoulder impingement protocol initiated. Dry needling applied to infraspinatus."
      }
    ]
  }
];

// LOCAL STORAGE PERSISTENCE KEYS
const STORAGE_KEYS = {
  SERVICES: 'physio_services_v1',
  AVAILABILITY: 'physio_availability_v1',
  TIME_BLOCKS: 'physio_time_blocks_v1',
  BOOKINGS: 'physio_bookings_v1',
  PATIENTS: 'physio_patients_v1',
  ADMIN_AUTH: 'physio_admin_auth_v1'
};

// HELPER: Convert "HH:mm" to minutes from midnight
export function timeStringToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// HELPER: Convert minutes from midnight to "HH:mm"
export function minutesToTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

// CLINIC SERVICE CLASS
class ClinicService {
  private getStorageItem<T>(key: string, defaultVal: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  private setStorageItem<T>(key: string, val: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error('Storage save error:', e);
    }
  }

  // --- SERVICES ---
  getServices(): Service[] {
    return this.getStorageItem<Service[]>(STORAGE_KEYS.SERVICES, defaultServices);
  }

  getActiveServices(): Service[] {
    return this.getServices().filter(s => s.active);
  }

  getServiceById(id: string): Service | undefined {
    return this.getServices().find(s => s.id === id);
  }

  saveService(service: Partial<Service> & { id?: string }): Service {
    const services = this.getServices();
    if (service.id) {
      const idx = services.findIndex(s => s.id === service.id);
      if (idx !== -1) {
        services[idx] = { ...services[idx], ...service } as Service;
      }
    } else {
      const newService: Service = {
        id: `serv-${Date.now()}`,
        name: service.name || "New Treatment",
        durationMin: service.durationMin || 45,
        price: service.price || 90,
        description: service.description || "",
        active: service.active !== undefined ? service.active : true,
        category: service.category || "Treatment"
      };
      services.push(newService);
      service = newService;
    }
    this.setStorageItem(STORAGE_KEYS.SERVICES, services);
    return service as Service;
  }

  toggleServiceActive(id: string): Service[] {
    const services = this.getServices();
    const updated = services.map(s => s.id === id ? { ...s, active: !s.active } : s);
    this.setStorageItem(STORAGE_KEYS.SERVICES, updated);
    return updated;
  }

  // --- AVAILABILITY & BLOCKS ---
  getAvailability(): AvailabilityDay[] {
    return this.getStorageItem<AvailabilityDay[]>(STORAGE_KEYS.AVAILABILITY, defaultAvailability);
  }

  saveAvailability(availability: AvailabilityDay[]): void {
    this.setStorageItem(STORAGE_KEYS.AVAILABILITY, availability);
  }

  getTimeBlocks(): TimeBlock[] {
    return this.getStorageItem<TimeBlock[]>(STORAGE_KEYS.TIME_BLOCKS, defaultTimeBlocks);
  }

  addTimeBlock(block: Omit<TimeBlock, 'id'>): TimeBlock {
    const blocks = this.getTimeBlocks();
    const newBlock: TimeBlock = {
      ...block,
      id: `block-${Date.now()}`
    };
    blocks.push(newBlock);
    this.setStorageItem(STORAGE_KEYS.TIME_BLOCKS, blocks);
    return newBlock;
  }

  deleteTimeBlock(id: string): void {
    const blocks = this.getTimeBlocks().filter(b => b.id !== id);
    this.setStorageItem(STORAGE_KEYS.TIME_BLOCKS, blocks);
  }

  // --- BOOKINGS ---
  getBookings(): Booking[] {
    return this.getStorageItem<Booking[]>(STORAGE_KEYS.BOOKINGS, defaultBookings);
  }

  getBookingById(id: string): Booking | undefined {
    return this.getBookings().find(b => b.id === id);
  }

  createBooking(bookingData: {
    serviceId: string;
    patientName: string;
    phone: string;
    email?: string;
    date: string;
    startTime: string;
    note?: string;
  }): Booking {
    const service = this.getServiceById(bookingData.serviceId);
    if (!service) throw new Error("Selected service not found.");

    const startMin = timeStringToMinutes(bookingData.startTime);
    const endMin = startMin + service.durationMin;
    const endTime = minutesToTimeString(endMin);

    const bookings = this.getBookings();

    // Verify slot is still available (double-booking protection)
    const availableSlots = this.getAvailableSlots(bookingData.date, service.durationMin);
    if (!availableSlots.includes(bookingData.startTime)) {
      throw new Error("This time slot is no longer available. Please select another slot.");
    }

    const newBooking: Booking = {
      id: `bk-${Math.floor(100000 + Math.random() * 900000)}`,
      serviceId: service.id,
      serviceName: service.name,
      servicePrice: service.price,
      serviceDurationMin: service.durationMin,
      patientName: bookingData.patientName,
      phone: bookingData.phone,
      email: bookingData.email,
      date: bookingData.date,
      startTime: bookingData.startTime,
      endTime,
      status: 'pending',
      note: bookingData.note,
      createdAt: new Date().toISOString()
    };

    bookings.unshift(newBooking);
    this.setStorageItem(STORAGE_KEYS.BOOKINGS, bookings);

    // Sync to patient record directory automatically
    this.updatePatientHistory(newBooking);

    return newBooking;
  }

  updateBookingStatus(id: string, status: Booking['status']): Booking[] {
    const bookings = this.getBookings();
    const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
    this.setStorageItem(STORAGE_KEYS.BOOKINGS, updated);
    return updated;
  }

  rescheduleBooking(id: string, date: string, startTime: string): Booking {
    const bookings = this.getBookings();
    const target = bookings.find(b => b.id === id);
    if (!target) throw new Error("Booking not found.");

    const duration = target.serviceDurationMin || 45;
    const startMin = timeStringToMinutes(startTime);
    const endMin = startMin + duration;
    const endTime = minutesToTimeString(endMin);

    const updatedBooking: Booking = {
      ...target,
      date,
      startTime,
      endTime,
      status: 'confirmed'
    };

    const updatedList = bookings.map(b => b.id === id ? updatedBooking : b);
    this.setStorageItem(STORAGE_KEYS.BOOKINGS, updatedList);
    return updatedBooking;
  }

  // --- PATIENTS ---
  getPatients(): PatientRecord[] {
    return this.getStorageItem<PatientRecord[]>(STORAGE_KEYS.PATIENTS, defaultPatients);
  }

  getPatientByPhone(phone: string): PatientRecord | undefined {
    const cleaned = phone.replace(/\D/g, '');
    return this.getPatients().find(p => p.phone.replace(/\D/g, '') === cleaned);
  }

  private updatePatientHistory(booking: Booking): void {
    const patients = this.getPatients();
    const cleanedPhone = booking.phone.replace(/\D/g, '');
    let patient = patients.find(p => p.phone.replace(/\D/g, '') === cleanedPhone);

    if (patient) {
      patient.lastVisit = booking.date;
      patient.totalVisits += 1;
      if (!patient.email && booking.email) patient.email = booking.email;
    } else {
      patient = {
        id: `pat-${Date.now()}`,
        phone: booking.phone,
        name: booking.patientName,
        email: booking.email,
        firstVisit: booking.date,
        lastVisit: booking.date,
        totalVisits: 1,
        notes: booking.note ? [
          {
            id: `pn-${Date.now()}`,
            date: booking.date,
            author: 'Patient Intake Note',
            text: booking.note
          }
        ] : []
      };
      patients.push(patient);
    }
    this.setStorageItem(STORAGE_KEYS.PATIENTS, patients);
  }

  addClinicalNoteToPatient(patientId: string, author: string, text: string): PatientRecord {
    const patients = this.getPatients();
    const p = patients.find(pat => pat.id === patientId);
    if (!p) throw new Error("Patient not found.");

    const newNote = {
      id: `pn-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      author,
      text
    };

    p.notes.unshift(newNote);
    this.setStorageItem(STORAGE_KEYS.PATIENTS, patients);
    return p;
  }

  // --- SLOT CALCULATION ENGINE ---
  getAvailableSlots(dateStr: string, serviceDurationMin: number): string[] {
    if (!dateStr) return [];

    const dateObj = new Date(dateStr + 'T00:00:00');
    const weekday = dateObj.getDay(); // 0-6

    // 1. Check standing hours for weekday
    const availability = this.getAvailability();
    const dayConfig = availability.find(a => a.weekday === weekday);

    if (!dayConfig || !dayConfig.isOpen) {
      return []; // Clinic closed on this weekday
    }

    const openMin = timeStringToMinutes(dayConfig.openTime);
    const closeMin = timeStringToMinutes(dayConfig.closeTime);

    // 2. Fetch active bookings for this date (excluding cancelled)
    const bookings = this.getBookings().filter(
      b => b.date === dateStr && b.status !== 'cancelled'
    );

    // 3. Fetch time blocks for this date
    const blocks = this.getTimeBlocks().filter(b => b.date === dateStr);

    // 4. Generate prospective slot candidates (every 30 mins)
    const availableSlots: string[] = [];
    const stepMin = 30; // 30 min intervals

    for (let current = openMin; current + serviceDurationMin <= closeMin; current += stepMin) {
      const slotStartMin = current;
      const slotEndMin = current + serviceDurationMin;

      // Check collision with existing bookings
      let hasBookingCollision = false;
      for (const bk of bookings) {
        const bkStart = timeStringToMinutes(bk.startTime);
        const bkEnd = timeStringToMinutes(bk.endTime);
        if (slotStartMin < bkEnd && slotEndMin > bkStart) {
          hasBookingCollision = true;
          break;
        }
      }

      if (hasBookingCollision) continue;

      // Check collision with blackout blocks
      let hasBlockCollision = false;
      for (const block of blocks) {
        const blockStart = timeStringToMinutes(block.startTime);
        const blockEnd = timeStringToMinutes(block.endTime);
        if (slotStartMin < blockEnd && slotEndMin > blockStart) {
          hasBlockCollision = true;
          break;
        }
      }

      if (hasBlockCollision) continue;

      // If slot is today, ensure slot isn't in the past
      const todayStr = new Date().toISOString().split('T')[0];
      if (dateStr === todayStr) {
        const now = new Date();
        const currentNowMin = now.getHours() * 60 + now.getMinutes();
        if (slotStartMin <= currentNowMin + 15) { // 15 min grace window
          continue;
        }
      }

      availableSlots.push(minutesToTimeString(slotStartMin));
    }

    return availableSlots;
  }
}

export const clinicService = new ClinicService();
