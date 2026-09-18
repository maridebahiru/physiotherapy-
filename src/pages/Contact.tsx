import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2, Navigation } from 'lucide-react';
import { defaultClinicProfile } from '../services/clinicService';

interface ContactProps {
  onNavigate: (path: string) => void;
}

export const Contact: React.FC<ContactProps> = ({ onNavigate }) => {
  const profile = defaultClinicProfile;
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setFormSent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-20">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-3 max-w-2xl mx-auto"
      >
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-pine-950 dark:text-parchment-50 tracking-tight">
          Clinic Location & Contact
        </h1>
        <p className="text-pine-800 dark:text-parchment-200 text-sm leading-relaxed">
          Have questions before booking? Reach out directly via WhatsApp, phone call, or drop by our central clinic location.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Direct Contacts & Hours */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-5 space-y-6"
        >
          
          {/* Quick Contact Card */}
          <div className="glass-card p-6 rounded-3xl border border-parchment-200 dark:border-pine-800/60 space-y-6">
            <h2 className="text-lg font-serif font-bold text-pine-950 dark:text-parchment-50">Direct Communications</h2>
            
            <div className="space-y-4 text-xs">
              
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-parchment-100 dark:bg-pine-900 border border-parchment-200 dark:border-pine-800 text-pine-800 dark:text-ochre-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-pine-700 dark:text-parchment-400 font-medium">Clinic Telephone</div>
                  <a href={`tel:${profile.phone}`} className="text-sm font-bold text-pine-950 dark:text-parchment-50 hover:text-ochre-600 transition-colors">
                    {profile.phone}
                  </a>
                  <div className="text-[11px] text-pine-600 dark:text-parchment-400">Mon–Sat 9:00 AM – 5:00 PM</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-pine-100 dark:bg-pine-900 border border-pine-200 dark:border-pine-800 text-pine-800 dark:text-ochre-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-pine-700 dark:text-parchment-400 font-medium">Instant Messaging</div>
                  <div className="flex flex-wrap gap-2 pt-1.5">
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="https://wa.me/251912345678"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 rounded-full bg-pine-700 hover:bg-pine-800 dark:bg-ochre-500 dark:hover:bg-ochre-600 text-white dark:text-darkpine-950 font-bold text-xs transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>WhatsApp</span>
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="https://t.me/apexmotionphysio"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 rounded-full bg-parchment-200 hover:bg-parchment-300 dark:bg-darkpine-950 text-pine-900 dark:text-parchment-200 font-bold text-xs border border-parchment-300 dark:border-pine-800 transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>Telegram</span>
                    </motion.a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-parchment-100 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 text-pine-800 dark:text-parchment-300">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-pine-700 dark:text-parchment-400 font-medium">Email Enquiries</div>
                  <a href={`mailto:${profile.email}`} className="text-xs font-semibold text-pine-950 dark:text-parchment-100 hover:text-ochre-600">
                    {profile.email}
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Working Hours Box */}
          <div className="glass-panel p-6 rounded-3xl border border-parchment-200 dark:border-pine-800/60 space-y-4">
            <h2 className="text-sm font-serif font-bold text-pine-950 dark:text-parchment-50 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-ochre-500" />
              Clinic Working Hours
            </h2>
            <div className="space-y-2 text-xs text-pine-800 dark:text-parchment-200">
              <div className="flex justify-between py-1.5 border-b border-parchment-200 dark:border-pine-800">
                <span>Monday – Saturday</span>
                <span className="font-bold text-pine-950 dark:text-parchment-50">9:00 AM – 5:00 PM</span>
              </div>
              <div className="flex justify-between py-1.5 text-ochre-600 dark:text-ochre-400 font-medium">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
            </div>
          </div>

        </motion.div>

        {/* Right Column: Map Embed & Inquiry Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-7 space-y-6"
        >
          
          {/* Map Preview Card */}
          <div className="glass-card p-6 rounded-3xl border border-parchment-200 dark:border-pine-800/60 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-ochre-500" />
                <h2 className="text-base font-serif font-bold text-pine-950 dark:text-parchment-50">Clinic Address & Parking</h2>
              </div>
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(profile.address)}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-ochre-600 dark:text-ochre-400 hover:underline flex items-center gap-1"
              >
                <Navigation className="w-3.5 h-3.5" />
                Open Directions
              </a>
            </div>

            <p className="text-xs text-pine-800 dark:text-parchment-300">
              {profile.address} (Ground floor access, free dedicated patient parking behind clinic).
            </p>

            {/* Interactive Map Visual */}
            <div className="relative rounded-2xl overflow-hidden h-56 bg-pine-900 border border-parchment-200 dark:border-pine-800 flex items-center justify-center group">
              <img 
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1000" 
                alt="Map location preview"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pine-950 via-transparent to-transparent"></div>
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="p-3 rounded-full bg-ochre-500 text-darkpine-950 shadow-glow-ochre"
                >
                  <MapPin className="w-6 h-6 fill-darkpine-950" />
                </motion.div>
              </div>

              <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-darkpine-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-200 dark:border-pine-800 text-[11px] text-pine-900 dark:text-parchment-200">
                📍 Dire Dawa • Health Center
              </div>
            </div>

          </div>

          {/* Inquiry Form */}
          <div className="glass-card p-6 rounded-3xl border border-parchment-200 dark:border-pine-800/60 space-y-4">
            <h2 className="text-base font-serif font-bold text-pine-950 dark:text-parchment-50">Send a Quick Message</h2>
            
            <AnimatePresence mode="wait">
              {formSent ? (
                <motion.div 
                  key="sent"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-2xl bg-pine-100 dark:bg-pine-900/60 border border-pine-300 dark:border-pine-700 text-center space-y-2"
                >
                  <CheckCircle2 className="w-10 h-10 text-pine-700 dark:text-ochre-400 mx-auto" />
                  <h3 className="text-base font-bold text-pine-950 dark:text-parchment-50">Message Sent!</h3>
                  <p className="text-xs text-pine-800 dark:text-parchment-200">
                    Thank you {formData.name}. Dr. Vance or clinic staff will respond to {formData.phone} shortly.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onNavigate('/book')}
                    className="mt-3 inline-block px-5 py-2 rounded-full bg-pine-700 dark:bg-ochre-500 text-white dark:text-darkpine-950 font-bold text-xs"
                  >
                    Proceed to Calendar Booking
                  </motion.button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-pine-900 dark:text-parchment-300 mb-1">Your Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 rounded-xl px-3.5 py-2.5 text-xs text-pine-950 dark:text-parchment-50 focus:outline-none focus:border-pine-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-pine-900 dark:text-parchment-300 mb-1">Phone Number (Required)</label>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. (555) 234-5678"
                        className="w-full bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 rounded-xl px-3.5 py-2.5 text-xs text-pine-950 dark:text-parchment-50 focus:outline-none focus:border-pine-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-pine-900 dark:text-parchment-300 mb-1">How can we help?</label>
                    <textarea 
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Briefly describe your complaint or question..."
                      className="w-full bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 rounded-xl px-3.5 py-2.5 text-xs text-pine-950 dark:text-parchment-50 focus:outline-none focus:border-pine-600"
                    ></textarea>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-pine-700 hover:bg-pine-800 dark:bg-ochre-500 dark:hover:bg-ochre-600 text-white dark:text-darkpine-950 font-bold py-3 rounded-full transition-colors text-xs flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to Clinic</span>
                  </motion.button>
                </form>
              )}
            </AnimatePresence>

          </div>

        </motion.div>

      </div>

    </div>
  );
};
