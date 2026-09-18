import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Calendar, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { clinicService } from '../services/clinicService';

interface AnatomyInteractive3DProps {
  onNavigate: (path: string, serviceId?: string) => void;
}

interface AnatomyZone {
  id: string;
  name: string;
  serviceId: string;
  category: string;
  description: string;
  imageUrl: string;
  symptoms: string[];
  xPercent: number;
  yPercent: number;
}

export const AnatomyInteractive3D: React.FC<AnatomyInteractive3DProps> = ({ onNavigate }) => {
  const activeServices = clinicService.getActiveServices();

  const zones: AnatomyZone[] = [
    {
      id: 'spine',
      name: 'Spine & Lumbar Sciatica',
      serviceId: 'serv-3',
      category: 'Spine & Sciatica',
      description: 'Focused therapeutic decompression targeting herniated discs, chronic sciatica, lumbar instability, and postural strain.',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
      symptoms: ['Radiating leg pain', 'L4-L5 stiffness', 'Lower back tightness', 'Herniated disc discomfort'],
      xPercent: 50,
      yPercent: 48,
    },
    {
      id: 'shoulder',
      name: 'Shoulder & Rotator Cuff',
      serviceId: 'serv-2',
      category: 'Shoulder Therapy',
      description: 'Joint mobilization, dry needling, and targeted rotator cuff stabilization for impingement and overhead pain.',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
      symptoms: ['Impingement during lift', 'Rotator cuff strain', 'Frozen shoulder stiffness', 'Clavicle tension'],
      xPercent: 34,
      yPercent: 28,
    },
    {
      id: 'knee',
      name: 'Knee & ACL Rehabilitation',
      serviceId: 'serv-4',
      category: 'Knee & Joint Rehab',
      description: 'Evidence-based protocol for post-op ACL repairs, meniscus procedures, patellar tracking, and knee joint swelling.',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
      symptoms: ['Post-ACL surgical recovery', 'Meniscus tear strain', 'Patellar tendonitis', 'Joint pop & instability'],
      xPercent: 44,
      yPercent: 72,
    },
    {
      id: 'cervical',
      name: 'Neck & Cervical Spine',
      serviceId: 'serv-3',
      category: 'Neck & Cervical',
      description: 'Manual cervical traction, myofascial release, and upper back posture restoration for neck tension and whiplash.',
      imageUrl: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=800',
      symptoms: ['Cervical stiffness', 'Frequent tension headaches', 'Trapezius knots', 'Desk posture strain'],
      xPercent: 50,
      yPercent: 20,
    },
    {
      id: 'hip',
      name: 'Hip & Pelvic Alignment',
      serviceId: 'serv-1',
      category: 'Hip Biomechanics',
      description: 'Comprehensive pelvic tilt analysis, hip joint mobilization, and deep glute/piriformis dry needling.',
      imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
      symptoms: ['Piriformis tightness', 'Hip flexor strain', 'Pelvic rotation imbalance', 'Groin discomfort'],
      xPercent: 56,
      yPercent: 54,
    },
    {
      id: 'ankle',
      name: 'Ankle & Sports Tendonitis',
      serviceId: 'serv-2',
      category: 'Sports Injury',
      description: 'Rapid recovery therapy for Achilles tendonitis, recurring ankle sprains, plantar fasciitis, and shin splints.',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
      symptoms: ['Achilles pain', 'Plantar fasciitis heel pain', 'Lateral ankle sprain', 'Shin splints'],
      xPercent: 58,
      yPercent: 88,
    }
  ];

  const [selectedZone, setSelectedZone] = useState<AnatomyZone>(zones[0]);

  const currentService = activeServices.find(s => s.id === selectedZone.serviceId) || activeServices[0];

  return (
    <section className="py-16 relative overflow-hidden bg-parchment-100/40 dark:bg-darkpine-900/40 border-y border-parchment-200 dark:border-pine-800/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pine-100 dark:bg-pine-900/70 border border-pine-200 dark:border-pine-800 text-pine-900 dark:text-ochre-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-ochre-500" />
            Interactive Musculoskeletal Explorer
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-pine-950 dark:text-parchment-50 tracking-tight">
            Select Your Pain or Injury Region
          </h2>
          <p className="text-xs sm:text-sm text-pine-800 dark:text-parchment-200 leading-relaxed">
            Click on any anatomical zone to inspect dedicated treatment protocols, diagnostic approach, and directly reserve your 1-on-1 session with Dr. Marcus Vance.
          </p>
        </div>

        {/* Interactive Zone Buttons Strip (Touch-friendly for mobile) */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          {zones.map((zone) => {
            const isSelected = selectedZone.id === zone.id;
            return (
              <motion.button
                key={zone.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedZone(zone)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold border transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-pine-700 dark:bg-ochre-500 text-white dark:text-darkpine-950 border-pine-800 dark:border-ochre-400 shadow-soft'
                    : 'bg-white dark:bg-darkpine-900 text-pine-900 dark:text-parchment-200 border-parchment-200 dark:border-pine-800 hover:border-pine-400 dark:hover:border-pine-600'
                }`}
              >
                <Activity className={`w-3.5 h-3.5 ${isSelected ? 'text-white dark:text-darkpine-950' : 'text-ochre-500'}`} />
                <span>{zone.name}</span>
              </motion.button>
            );
          })}
        </div>

        {/* 3D Visual & Info Card 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          
          {/* Interactive Human Body Graphic with Hotspots */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl bg-gradient-to-b from-pine-900/10 via-parchment-100 dark:from-pine-950 dark:via-darkpine-950/80 to-transparent border border-parchment-200 dark:border-pine-800/80 p-6 shadow-soft overflow-hidden flex items-center justify-center">
              
              {/* Silhouette Visual */}
              <div className="relative w-full h-full flex items-center justify-center">
                <svg viewBox="0 0 200 400" className="h-full w-auto opacity-30 dark:opacity-40 stroke-pine-700 dark:stroke-ochre-400 fill-none stroke-[1.5]">
                  <circle cx="100" cy="40" r="20" />
                  <path d="M92,60 L108,60 L108,75 L92,75 Z" />
                  <path d="M50,85 C70,75 130,75 150,85 L140,190 L60,190 Z" />
                  <path d="M100,75 L100,190 L100,220" className="stroke-ochre-500 stroke-[2] stroke-dasharray-[4,4]" />
                  <path d="M50,85 L35,160 L30,220" />
                  <path d="M150,85 L165,160 L170,220" />
                  <path d="M60,190 L75,220 L72,310 L70,380" />
                  <path d="M140,190 L125,220 L128,310 L130,380" />
                </svg>

                {/* Hotspot Markers */}
                {zones.map((zone) => {
                  const isSelected = selectedZone.id === zone.id;
                  return (
                    <button
                      key={zone.id}
                      onClick={() => setSelectedZone(zone)}
                      style={{ top: `${zone.yPercent}%`, left: `${zone.xPercent}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-20"
                      title={zone.name}
                    >
                      <span className={`relative flex h-7 w-7 items-center justify-center`}>
                        {isSelected && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ochre-400 opacity-75"></span>
                        )}
                        <span className={`relative inline-flex rounded-full h-5 w-5 items-center justify-center border transition-all ${
                          isSelected 
                            ? 'bg-ochre-500 border-white text-darkpine-950 scale-125 shadow-glow-ochre' 
                            : 'bg-pine-800 border-pine-600 text-parchment-100 hover:scale-110'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Status Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-darkpine-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-200 dark:border-pine-800 text-[11px] text-center font-medium text-pine-900 dark:text-parchment-200">
                Selected: <strong className="text-ochre-600 dark:text-ochre-400">{selectedZone.name}</strong>
              </div>

            </div>
          </div>

          {/* Active Zone Detail Card & High-Res Treatment Photo */}
          <div className="lg:col-span-6 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedZone.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="glass-card p-8 rounded-3xl border border-parchment-200 dark:border-pine-800/80 space-y-6 shadow-soft"
              >
                
                {/* Treatment Image Banner */}
                <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-parchment-200 dark:border-pine-800">
                  <img 
                    src={selectedZone.imageUrl} 
                    alt={selectedZone.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-darkpine-950 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-darkpine-950/80 backdrop-blur-md text-[11px] font-bold text-ochre-400 border border-pine-800">
                    📍 Clinical Treatment Focus
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full bg-pine-100 dark:bg-pine-900/60 border border-pine-200 dark:border-pine-800 text-xs font-semibold text-pine-900 dark:text-ochre-300">
                    {selectedZone.category}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-pine-950 dark:text-parchment-50">
                    {selectedZone.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-pine-800 dark:text-parchment-200 leading-relaxed">
                    {selectedZone.description}
                  </p>
                </div>

                {/* Common Symptoms List */}
                <div className="space-y-2.5 pt-2 border-t border-parchment-200 dark:border-pine-800/60">
                  <div className="text-xs font-bold text-pine-900 dark:text-parchment-300 uppercase tracking-wider">
                    Commonly Treated Symptoms & Conditions:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedZone.symptoms.map((sym, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-parchment-100/60 dark:bg-darkpine-950 text-pine-900 dark:text-parchment-200 border border-parchment-200/60 dark:border-pine-800/40">
                        <CheckCircle2 className="w-3.5 h-3.5 text-ochre-500 shrink-0" />
                        <span>{sym}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Service Banner */}
                {currentService && (
                  <div className="p-4 rounded-2xl bg-parchment-50 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <span className="text-[11px] text-pine-600 dark:text-parchment-400 block">Recommended Clinical Service:</span>
                      <span className="text-sm font-serif font-bold text-pine-950 dark:text-parchment-50">{currentService.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-pine-600 dark:text-parchment-400 block">{currentService.durationMin} mins</span>
                      <span className="text-sm font-serif font-bold text-ochre-600 dark:text-ochre-400">${currentService.price}</span>
                    </div>
                  </div>
                )}

                {/* Action CTA */}
                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onNavigate('/book', selectedZone.serviceId)}
                    className="w-full bg-pine-700 hover:bg-pine-800 dark:bg-ochre-500 dark:hover:bg-ochre-600 text-white dark:text-darkpine-950 font-bold py-4 px-6 rounded-full shadow-soft transition-all text-sm flex items-center justify-center gap-2 group"
                  >
                    <Calendar className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    <span>Book Appointment for {selectedZone.name}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
};
