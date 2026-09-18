import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export const TestimonialsCarousel: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Marathon Runner",
      quote: "Dr. Vance got me back running pain-free after months of lower back stiffness. The dry needling and targeted manual therapy made an immediate difference.",
      rating: 5,
      date: "August 2026"
    },
    {
      name: "David Miller",
      role: "CrossFit Athlete",
      quote: "The 1:1 attention is unmatched. No multi-patient juggling — just solid, evidence-based joint mobilization and clear movement homework.",
      rating: 5,
      date: "September 2026"
    },
    {
      name: "Elena Rostova",
      role: "Software Architect",
      quote: "Suffered from severe neck tension and sciatica. After 3 sessions of spinal rehabilitation, I am completely pain-free while working.",
      rating: 5,
      date: "September 2026"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-16 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-parchment-100 dark:bg-darkpine-900 border border-parchment-200 dark:border-pine-800 text-pine-900 dark:text-ochre-300 text-xs font-semibold uppercase tracking-wider">
            <Quote className="w-3.5 h-3.5 text-ochre-500" />
            Patient Recovery Experiences
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-pine-950 dark:text-parchment-50">
            Real Recovery Stories
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative glass-card p-8 sm:p-12 rounded-3xl border border-parchment-200 dark:border-pine-800/80 shadow-soft overflow-hidden">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 text-center"
            >
              <div className="flex items-center justify-center gap-1 text-ochre-500">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-ochre-500" />
                ))}
              </div>

              <blockquote className="text-base sm:text-xl font-serif text-pine-950 dark:text-parchment-100 italic leading-relaxed max-w-2xl mx-auto">
                "{current.quote}"
              </blockquote>

              <div className="space-y-1 pt-2">
                <div className="font-bold text-sm text-pine-950 dark:text-parchment-50">{current.name}</div>
                <div className="text-xs text-ochre-600 dark:text-ochre-400 font-medium">{current.role} • {current.date}</div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-parchment-200 dark:border-pine-800/60 mt-6">
            <button
              onClick={handlePrev}
              aria-label="Previous Testimonial"
              className="p-2.5 rounded-full bg-parchment-100 hover:bg-parchment-200 dark:bg-darkpine-900 text-pine-900 dark:text-parchment-100 border border-parchment-200 dark:border-pine-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all ${
                    idx === currentIndex 
                      ? 'w-8 bg-pine-700 dark:bg-ochre-500' 
                      : 'w-2.5 bg-parchment-300 dark:bg-pine-800'
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              aria-label="Next Testimonial"
              className="p-2.5 rounded-full bg-parchment-100 hover:bg-parchment-200 dark:bg-darkpine-900 text-pine-900 dark:text-parchment-100 border border-parchment-200 dark:border-pine-800 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
