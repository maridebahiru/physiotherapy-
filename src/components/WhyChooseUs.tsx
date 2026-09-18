import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Clock, ShieldCheck, UserCheck, CreditCard, Sparkles } from 'lucide-react';
import { defaultClinicProfile } from '../services/clinicService';

export const WhyChooseUs: React.FC = () => {
  const profile = defaultClinicProfile;

  const features = [
    {
      icon: Award,
      title: "12+ Years Clinical Experience",
      desc: "Lead physical therapist Dr. Marcus Vance brings over 12 years of specialized orthopedic and sports rehabilitation expertise.",
    },
    {
      icon: UserCheck,
      title: "1-on-1 Dedicated Care",
      desc: "Every session is private 1-on-1 care. No juggling multiple patients simultaneously — full clinician focus throughout your treatment.",
    },
    {
      icon: Star,
      title: "4.9 / 5.0 Patient Rating",
      desc: "Consistently top-rated by active individuals, athletes, post-surgical patients, and office workers seeking lasting pain recovery.",
    },
    {
      icon: CreditCard,
      title: "Pay Directly at Desk",
      desc: "Transparent pricing with zero online payment required. Pay conveniently at the clinic following your treatment session.",
    },
  ];

  return (
    <section className="py-16 relative bg-parchment-100/30 dark:bg-darkpine-900/30 border-y border-parchment-200 dark:border-pine-800/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pine-100 dark:bg-pine-900/60 border border-pine-200 dark:border-pine-800 text-pine-900 dark:text-ochre-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-ochre-500" />
            Clinical Standards
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-pine-950 dark:text-parchment-50 tracking-tight">
            Why Choose Apex Motion Physiotherapy
          </h2>
          <p className="text-xs sm:text-sm text-pine-800 dark:text-parchment-200 leading-relaxed">
            Founded on direct patient-centered care, evidence-based manual therapy, and transparent clinical excellence.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const IconComponent = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="glass-card p-6 rounded-2xl border border-parchment-200 dark:border-pine-800/60 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-pine-100 dark:bg-pine-900/80 border border-pine-200 dark:border-pine-800 flex items-center justify-center text-pine-800 dark:text-ochre-400">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-serif font-bold text-pine-950 dark:text-parchment-50">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-pine-800 dark:text-parchment-300 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-parchment-200/60 dark:border-pine-800/40 flex items-center gap-1.5 text-[11px] font-semibold text-pine-700 dark:text-ochre-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-ochre-500" />
                  Verified Clinic Feature
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
