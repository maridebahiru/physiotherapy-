import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Clock, DollarSign, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Activity } from 'lucide-react';
import { clinicService } from '../services/clinicService';

interface ServicesProps {
  onNavigate: (path: string, serviceId?: string) => void;
}

const serviceImages: Record<string, string> = {
  'serv-1': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
  'serv-2': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
  'serv-3': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
  'serv-4': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
  'serv-5': 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=800',
};

export const Services: React.FC<ServicesProps> = ({ onNavigate }) => {
  const services = clinicService.getActiveServices();

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-20">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-4 max-w-3xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-parchment-100 dark:bg-darkpine-900 border border-parchment-200 dark:border-pine-800 text-pine-900 dark:text-ochre-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-ochre-500" />
          Transparent Treatment Options & Rates
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-pine-950 dark:text-parchment-50 tracking-tight">
          Clinical Treatments & Services
        </h1>
        <p className="text-pine-800 dark:text-parchment-200 text-sm sm:text-base leading-relaxed">
          Every session is dedicated 1-on-1 directly with Dr. Marcus Vance. Upfront pricing with no surprise desk add-ons or hidden facility fees. Payment is settled at the clinic after your treatment.
        </p>
      </motion.div>

      {/* Services Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {services.map((serv) => {
          const serviceImg = serviceImages[serv.id] || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800';

          return (
            <motion.div 
              key={serv.id}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.01 }}
              className="glass-card p-6 sm:p-8 rounded-3xl border border-parchment-200 dark:border-pine-800/60 flex flex-col justify-between glass-card-hover relative group shadow-soft"
            >
              
              <div className="space-y-5">
                
                {/* Service Category Photo */}
                <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-parchment-200 dark:border-pine-800">
                  <img 
                    src={serviceImg} 
                    alt={serv.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pine-950/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-darkpine-950/80 backdrop-blur-md text-[11px] font-semibold text-ochre-300 border border-pine-800 flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-ochre-400" />
                    {serv.category || 'Treatment'}
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="flex items-center gap-1 text-xs font-medium text-pine-800 dark:text-parchment-200 bg-parchment-100/60 dark:bg-darkpine-950 px-3 py-1 rounded-lg border border-parchment-200 dark:border-pine-800/50">
                    <Clock className="w-3.5 h-3.5 text-ochre-500" />
                    {serv.durationMin} mins
                  </span>
                  
                  <span className="text-2xl font-serif font-bold text-pine-950 dark:text-parchment-50 flex items-center">
                    <DollarSign className="w-5 h-5 text-ochre-500 -mr-1" />
                    {serv.price}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif font-bold text-pine-950 dark:text-parchment-50 group-hover:text-pine-700 dark:group-hover:text-ochre-400 transition-colors">
                    {serv.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-pine-800 dark:text-parchment-200 leading-relaxed">
                    {serv.description}
                  </p>
                </div>

                {/* Recommended For List */}
                {serv.recommendedFor && serv.recommendedFor.length > 0 && (
                  <div className="pt-3 space-y-2 border-t border-parchment-200 dark:border-pine-800/60">
                    <div className="text-[11px] font-semibold text-pine-700 dark:text-parchment-400 uppercase tracking-wider">Ideal Clinical Indications:</div>
                    <div className="flex flex-wrap gap-2">
                      {serv.recommendedFor.map((rec, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-xs text-pine-900 dark:text-parchment-200 bg-parchment-100 dark:bg-darkpine-950 px-2.5 py-1 rounded-md border border-parchment-200/80 dark:border-pine-800/50">
                          <CheckCircle2 className="w-3 h-3 text-pine-600 dark:text-ochre-400" />
                          {rec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom Booking Button */}
              <div className="pt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('/book', serv.id)}
                  className="w-full bg-pine-700 hover:bg-pine-800 dark:bg-ochre-500 dark:hover:bg-ochre-600 text-white dark:text-darkpine-950 font-bold py-3.5 px-6 rounded-full shadow-soft transition-all text-sm flex items-center justify-center gap-2 group-hover:shadow-glow-pine dark:group-hover:shadow-glow-ochre"
                >
                  <span>Book This Treatment (${serv.price})</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>

            </motion.div>
          );
        })}
      </motion.div>

      {/* Info Callout */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-panel p-6 rounded-3xl border border-parchment-200 dark:border-pine-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-pine-800 dark:text-parchment-300"
      >
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-ochre-500 shrink-0" />
          <span>
            <strong className="text-pine-950 dark:text-parchment-50">Itemized Receipts:</strong> Official medical invoice provided after every treatment for standard health insurance claim reimbursement.
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onNavigate('/contact')}
          className="whitespace-nowrap px-5 py-2.5 rounded-full bg-parchment-100 hover:bg-parchment-200 dark:bg-darkpine-900 dark:hover:bg-pine-900 text-pine-900 dark:text-parchment-100 border border-parchment-200 dark:border-pine-800 font-semibold"
        >
          Have Questions? Contact Us →
        </motion.button>
      </motion.div>

    </div>
  );
};
