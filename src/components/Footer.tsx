import React from 'react';
import { Activity, MapPin, Phone, Mail, Clock, MessageSquare, ShieldCheck } from 'lucide-react';
import { defaultClinicProfile } from '../services/clinicService';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-pine-950 text-parchment-200 border-t border-pine-900 text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pine-700 via-pine-600 to-ochre-500 p-0.5">
                <div className="w-full h-full bg-pine-950 rounded-[10px] flex items-center justify-center">
                  <Activity className="w-5 h-5 text-ochre-400" />
                </div>
              </div>
              <span className="text-lg font-serif font-bold text-parchment-50 tracking-tight">
                Apex Motion <span className="text-ochre-400 font-serif italic">Physio</span>
              </span>
            </div>
            <p className="text-parchment-300 text-xs leading-relaxed">
              Dedicated 1:1 evidence-based physiotherapy, sports rehabilitation, and manual spine therapy with Dr. Marcus Vance. No multi-patient juggling.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://wa.me/251912345678"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pine-900/80 border border-pine-700/60 text-ochre-300 text-xs font-medium hover:bg-pine-800 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-ochre-400" />
                <span>WhatsApp Clinic</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-parchment-100 font-serif font-semibold text-sm tracking-wider uppercase">Quick Links</h4>
            <ul className="space-y-2 text-xs text-parchment-300">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-ochre-400 transition-colors">
                  Therapist Bio & Profile
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/services')} className="hover:text-ochre-400 transition-colors">
                  Treatment Services & Fees
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/book')} className="hover:text-ochre-400 transition-colors">
                  Real-time Booking Calendar
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-ochre-400 transition-colors">
                  Clinic Location & Map
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/admin')} className="hover:text-ochre-400 transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-ochre-400" />
                  <span>Practitioner Admin Panel</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Clinic Hours */}
          <div className="space-y-3">
            <h4 className="text-parchment-100 font-serif font-semibold text-sm tracking-wider uppercase flex items-center gap-2">
              <Clock className="w-4 h-4 text-ochre-400" />
              Opening Hours
            </h4>
            <div className="space-y-1.5 text-xs text-parchment-200">
              <div className="flex justify-between py-1 border-b border-pine-900">
                <span className="text-parchment-400">Mon – Sat</span>
                <span className="font-semibold text-parchment-50">9:00 AM – 5:00 PM</span>
              </div>
              <div className="flex justify-between py-1 text-parchment-500">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-parchment-100 font-serif font-semibold text-sm tracking-wider uppercase">Contact Information</h4>
            <div className="space-y-2 text-xs text-parchment-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-ochre-400 shrink-0 mt-0.5" />
                <span>{defaultClinicProfile.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-ochre-400 shrink-0" />
                <a href={`tel:${defaultClinicProfile.phone.replace(/\s+/g, '')}`} className="hover:text-parchment-50 transition-colors">{defaultClinicProfile.phone}</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-ochre-400 shrink-0" />
                <a href="mailto:care@apexmotionphysio.com" className="hover:text-parchment-50 transition-colors">care@apexmotionphysio.com</a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-pine-900 flex flex-col sm:flex-row items-center justify-between text-xs text-parchment-400 gap-4">
          <p>© {new Date().getFullYear()} Apex Motion Physiotherapy. All rights reserved.</p>
          <p className="text-[11px] text-parchment-400">
            Payment handled directly at clinic • No online payment required
          </p>
        </div>
      </div>
    </footer>
  );
};
