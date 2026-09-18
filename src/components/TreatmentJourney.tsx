import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, ClipboardCheck, Activity, LineChart, Award, HeartPulse } from 'lucide-react';

export const TreatmentJourney: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Assessment',
      desc: 'Biomechanical analysis, range of motion testing, diagnostic posture evaluation, and pain origin mapping.',
      icon: Stethoscope,
    },
    {
      num: '02',
      title: 'Diagnosis',
      desc: 'Clear identification of structural dysfunction, muscle imbalances, nerve compression, or joint restriction.',
      icon: ClipboardCheck,
    },
    {
      num: '03',
      title: 'Personalized Plan',
      desc: 'Tailored recovery roadmap incorporating targeted manual therapy, dry needling, and therapeutic exercise.',
      icon: Activity,
    },
    {
      num: '04',
      title: 'Treatment',
      desc: 'Hands-on 1-on-1 clinical sessions with joint mobilization, spinal decompression, and tissue release.',
      icon: HeartPulse,
    },
    {
      num: '05',
      title: 'Progress Tracking',
      desc: 'Continuous re-evaluation at every session with objective metric tracking and workload adjustments.',
      icon: LineChart,
    },
    {
      num: '06',
      title: 'Full Recovery',
      desc: 'Restored mobility, eliminated pain, long-term injury prevention strategies, and maintenance routine.',
      icon: Award,
    },
  ];

  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-parchment-100 dark:bg-darkpine-900 border border-parchment-200 dark:border-pine-800 text-pine-900 dark:text-ochre-300 text-xs font-semibold uppercase tracking-wider">
            Patient Rehabilitation Journey
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-pine-950 dark:text-parchment-50 tracking-tight">
            Your Path to Restored Mobility
          </h2>
          <p className="text-xs sm:text-sm text-pine-800 dark:text-parchment-200 leading-relaxed">
            Every step is structured around 1-on-1 evidence-based physiotherapy to ensure lasting pain relief and peak functional movement.
          </p>
        </div>

        {/* Desktop Horizontal Timeline / Mobile Vertical Timeline */}
        <div className="relative pt-4">
          
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-pine-200 via-ochre-500 to-pine-200 dark:from-pine-900 dark:via-ochre-500 dark:to-pine-900 -translate-y-1/2 z-0" />

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10">
            {steps.map((st, idx) => {
              const IconComp = st.icon;
              return (
                <motion.div
                  key={st.num}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="glass-card p-6 rounded-2xl border border-parchment-200 dark:border-pine-800/80 flex flex-col justify-between space-y-4 relative group"
                >
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-ochre-600 dark:text-ochre-400 bg-ochre-500/10 px-2.5 py-1 rounded-md border border-ochre-500/20">
                        {st.num}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-pine-100 dark:bg-pine-900/60 border border-pine-200 dark:border-pine-800 flex items-center justify-center text-pine-800 dark:text-ochre-400 group-hover:scale-110 transition-transform">
                        <IconComp className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="text-base font-serif font-bold text-pine-950 dark:text-parchment-50">
                      {st.title}
                    </h3>

                    <p className="text-xs text-pine-800 dark:text-parchment-300 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-parchment-200/60 dark:border-pine-800/40 text-[10px] text-pine-500 dark:text-parchment-500 font-semibold uppercase tracking-wider">
                    Step {st.num} of 06
                  </div>

                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
