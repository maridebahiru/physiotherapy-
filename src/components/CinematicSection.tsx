import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';

interface CinematicSectionProps {
  onNavigate: (path: string) => void;
}

export const CinematicSection: React.FC<CinematicSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative w-full h-[450px] sm:h-[550px] overflow-hidden my-16 flex items-center justify-center">
      {/* Background Image with Slow Parallax Motion */}
      <motion.div 
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1920" 
          alt="Modern physiotherapy center environment" 
          className="w-full h-full object-cover object-center transform scale-105"
        />
        {/* Subtle Dark Glass Overlay for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-pine-950/90 via-pine-950/75 to-darkpine-950/85"></div>
      </motion.div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 text-parchment-50">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ochre-500/20 border border-ochre-500/40 text-ochre-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-ochre-400" />
          <span>Movement is Part of Healing</span>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-tight"
        >
          Restoration Through Precision <br />
          <span className="text-ochre-400 italic">1-on-1 Manual Care</span>
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm sm:text-lg text-parchment-200 max-w-2xl mx-auto leading-relaxed"
        >
          Experience dedicated orthopedic & sports physiotherapy designed around your biomechanics. No multi-patient juggling — full individual clinician focus.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('/book')}
            className="bg-ochre-500 hover:bg-ochre-600 text-darkpine-950 font-bold px-8 py-4 rounded-full text-base shadow-glow-ochre transition-all inline-flex items-center gap-2 group"
          >
            <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Book Your Session Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
};
