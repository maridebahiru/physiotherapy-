import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Calendar, ShieldCheck, Award, MapPin, Clock, ArrowRight, CheckCircle2, Star, Sparkles, HeartPulse, Quote, UserCheck } from 'lucide-react';
import { defaultClinicProfile } from '../services/clinicService';
import { Hero3DCanvas } from '../components/Hero3DCanvas';
import { AnatomyInteractive3D } from '../components/AnatomyInteractive3D';
import { TreatmentJourney } from '../components/TreatmentJourney';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { TestimonialsCarousel } from '../components/TestimonialsCarousel';
import { HealthBlogSection } from '../components/HealthBlogSection';

interface HomeProps {
  onNavigate: (path: string, serviceId?: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const profile = defaultClinicProfile;

  const specialties = [
    "Sports Injury Rehabilitation",
    "Spinal Decompression & Sciatica",
    "Post-Operative Orthopedics",
    "Dry Needling & Myofascial Release",
    "Joint Mobilization & Manual Therapy",
    "Biomechanical & Postural Assessment"
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. CINEMATIC HERO SECTION WITH 3D CANVAS */}
      <section className="relative overflow-hidden pt-6 pb-14 lg:pt-12 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            
            {/* Left Content */}
            <motion.div className="lg:col-span-7 space-y-6" variants={itemVariants}>
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pine-100 dark:bg-pine-900/60 border border-pine-200 dark:border-pine-800 text-pine-900 dark:text-ochre-300 text-xs font-semibold tracking-wide">
                <Sparkles className="w-4 h-4 text-ochre-500 animate-spin" style={{ animationDuration: '8s' }} />
                <span>Private 1-on-1 Physiotherapy Care</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-pine-950 dark:text-parchment-50 leading-[1.12]">
                Targeted Recovery & <br />
                <span className="text-gradient-ochre font-serif italic">Restored Mobility</span>
              </h1>

              <p className="text-base sm:text-lg text-pine-800 dark:text-parchment-200 leading-relaxed max-w-2xl">
                Get direct, 1-on-1 care from <strong className="font-semibold text-pine-950 dark:text-parchment-50">{profile.name}</strong>. 
                Specialized in sports injuries, chronic spinal rehabilitation, and post-surgical recovery. No online payment required — pay directly at the desk.
              </p>

              {/* Specialties Tag List */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-pine-900 dark:text-parchment-400">Clinical Specialties:</span>
                <div className="flex flex-wrap gap-2">
                  {specialties.map((spec, i) => (
                    <motion.span 
                      key={i}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-parchment-200/80 dark:bg-darkpine-900 text-pine-900 dark:text-parchment-200 border border-parchment-300/60 dark:border-pine-800/60 shadow-sm cursor-default"
                    >
                      {spec}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onNavigate('/book')}
                  className="bg-pine-700 hover:bg-pine-800 dark:bg-ochre-500 dark:hover:bg-ochre-600 text-white dark:text-darkpine-950 font-bold text-base px-8 py-4 rounded-full shadow-glow-pine dark:shadow-glow-ochre transition-all flex items-center justify-center gap-3 group"
                >
                  <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>Book Appointment</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onNavigate('/services')}
                  className="px-6 py-4 rounded-full bg-parchment-100 hover:bg-parchment-200 dark:bg-darkpine-900 dark:hover:bg-pine-900/60 text-pine-900 dark:text-parchment-100 font-semibold text-base border border-parchment-200 dark:border-pine-800 transition-all flex items-center justify-center gap-2"
                >
                  <span>View Treatments & Rates</span>
                </motion.button>
              </div>

            </motion.div>

            {/* Right 3D Visual & Practitioner Card */}
            <motion.div className="lg:col-span-5 relative" variants={itemVariants}>
              <div className="relative mx-auto max-w-md lg:max-w-none space-y-4">
                
                {/* 3D Canvas Box */}
                <div className="rounded-3xl bg-gradient-to-b from-pine-600/20 to-ochre-500/20 p-2 shadow-soft border border-parchment-200 dark:border-pine-800/80">
                  <div className="relative rounded-[22px] overflow-hidden bg-darkpine-950 aspect-[4/3] lg:aspect-[4/5]">
                    <Hero3DCanvas />
                  </div>
                </div>

                {/* Operating Hours Box */}
                <div className="glass-card p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-parchment-200 dark:border-pine-800 pb-2">
                    <span className="font-serif font-bold text-sm text-pine-950 dark:text-parchment-50 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-ochre-500" />
                      Clinic Hours
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-pine-100 dark:bg-pine-900 text-pine-800 dark:text-ochre-300 font-semibold">
                      Open Today
                    </span>
                  </div>
                  <div className="grid grid-cols-2 text-xs gap-2 text-pine-800 dark:text-parchment-200">
                    <div>
                      <span className="block font-semibold">Monday – Saturday</span>
                      <span className="text-pine-600 dark:text-parchment-400">9:00 AM – 5:00 PM</span>
                    </div>
                    <div>
                      <span className="block font-semibold">Sunday</span>
                      <span className="text-ochre-600 dark:text-ochre-400 font-medium">Closed</span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* 2. 3D INTERACTIVE ANATOMY SECTION */}
      <AnatomyInteractive3D onNavigate={onNavigate} />

      {/* 3. PRACTITIONER BIO & CLINIC CREDENTIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-8 sm:p-12 rounded-3xl relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-2">
                <div className="text-ochre-600 dark:text-ochre-400 font-serif font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  About Your Practitioner
                </div>
                <h2 className="text-3xl font-serif font-bold text-pine-950 dark:text-parchment-50">
                  {profile.name}
                </h2>
                <p className="text-xs font-semibold text-ochre-600 dark:text-ochre-400">{profile.title}</p>
              </div>

              <p className="text-pine-800 dark:text-parchment-200 text-sm sm:text-base leading-relaxed">
                {profile.bio}
              </p>

              <div className="space-y-3">
                <h3 className="text-xs font-bold text-pine-900 dark:text-parchment-300 uppercase tracking-wider">Qualifications & Credentials</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {profile.qualifications.map((q, i) => (
                    <motion.li 
                      key={i} 
                      whileHover={{ x: 4 }}
                      className="flex items-start gap-2 text-pine-900 dark:text-parchment-200 bg-parchment-100/60 dark:bg-darkpine-950 p-2.5 rounded-xl border border-parchment-200/60 dark:border-pine-800/40"
                    >
                      <CheckCircle2 className="w-4 h-4 text-pine-600 dark:text-ochre-400 shrink-0 mt-0.5" />
                      <span>{q}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onNavigate('/book')}
                  className="bg-pine-700 hover:bg-pine-800 dark:bg-ochre-500 dark:hover:bg-ochre-600 text-white dark:text-darkpine-950 text-xs font-bold px-6 py-3 rounded-full transition-all shadow-md flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation With Dr. Vance</span>
                </motion.button>
              </div>

            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="glass-card p-6 rounded-2xl space-y-4">
                <h3 className="font-serif font-bold text-base text-pine-950 dark:text-parchment-50 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-ochre-500" />
                  Clinic Location & Facility
                </h3>
                <p className="text-xs text-pine-800 dark:text-parchment-300 leading-relaxed">
                  {profile.address}
                </p>
                <div className="pt-2 border-t border-parchment-200 dark:border-pine-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-pine-600 dark:text-parchment-400">Phone:</span>
                    <span className="font-semibold text-pine-900 dark:text-parchment-100">{profile.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-pine-600 dark:text-parchment-400">Email:</span>
                    <span className="font-semibold text-pine-900 dark:text-parchment-100">{profile.email}</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('/contact')}
                  className="w-full text-center py-2.5 rounded-xl bg-parchment-200/80 dark:bg-darkpine-950 text-pine-900 dark:text-parchment-100 text-xs font-semibold hover:bg-parchment-300 dark:hover:bg-pine-900 transition-colors"
                >
                  View Map & Directions →
                </motion.button>
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* 4. TREATMENT JOURNEY */}
      <TreatmentJourney />

      {/* 5. WHY CHOOSE US */}
      <WhyChooseUs />

      {/* 6. TESTIMONIALS CAROUSEL */}
      <TestimonialsCarousel />

      {/* 7. HEALTH EDUCATION ARTICLES */}
      <HealthBlogSection />

      {/* 8. BOTTOM FINAL CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-pine-900 text-parchment-50 p-8 sm:p-12 rounded-3xl text-center space-y-6 shadow-glow-pine relative overflow-hidden"
        >
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-parchment-50">
              Ready to Start Your Recovery?
            </h2>
            <p className="text-sm text-parchment-200">
              Select your service, choose a date, and reserve your dedicated 1-on-1 slot in under 60 seconds.
            </p>
            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('/book')}
                className="bg-ochre-500 hover:bg-ochre-600 text-darkpine-950 font-bold px-8 py-4 rounded-full text-base shadow-lg transition-all inline-flex items-center gap-2 group"
              >
                <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Book Your Visit Now</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
};
