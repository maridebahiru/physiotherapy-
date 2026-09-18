export interface Service {
  id: string;
  name: string;
  durationMin: number;
  price: number;
  description: string;
  active: boolean;
  category?: string;
  recommendedFor?: string[];
}

export interface TimeBlock {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  reason: string;
}

export interface AvailabilityDay {
  weekday: number; // 0 (Sun) - 6 (Sat)
  isOpen: boolean;
  openTime: string; // HH:mm
  closeTime: string; // HH:mm
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'no-show' | 'cancelled';

export interface Booking {
  id: string;
  serviceId: string;
  serviceName?: string;
  servicePrice?: number;
  serviceDurationMin?: number;
  patientName: string;
  phone: string;
  email?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: BookingStatus;
  note?: string;
  createdAt: string;
}

export interface PatientRecord {
  id: string;
  phone: string;
  name: string;
  email?: string;
  firstVisit?: string;
  lastVisit?: string;
  totalVisits: number;
  notes: PatientNote[];
}

export interface PatientNote {
  id: string;
  date: string;
  author: string;
  text: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  name: string;
  role: 'owner' | 'staff';
}

export interface ClinicProfile {
  name: string;
  title: string;
  bio: string;
  phone: string;
  email: string;
  address: string;
  mapCoordinates: { lat: number; lng: number };
  qualifications: string[];
  treatedConditions: string[];
  photoUrl: string;
}
