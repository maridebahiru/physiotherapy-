import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface Article {
  id: string;
  category: string;
  title: string;
  snippet: string;
  content: string;
  readTime: string;
  author: string;
  date: string;
}

export const HealthBlogSection: React.FC = () => {
  const articles: Article[] = [
    {
      id: 'art-1',
      category: 'Spinal Health',
      title: 'Managing Sciatica & Lumbar Disk Tension: 5 Daily Movement Rules',
      snippet: 'Key biomechanical adjustments and decompression stretches to reduce nerve pinching during desk work and heavy lifting.',
      content: 'Sciatic nerve compression often stems from prolonged lumbar flexion and tight hip flexors. Incorporating gentle McKenzie extension protocols, micro-breaks every 45 minutes, and avoiding deep passive hip flexion can dramatically reduce radicular leg symptoms. Always consult with a licensed physical therapist before initiating heavy spinal extension exercises.',
      readTime: '4 min read',
      author: 'Dr. Marcus Vance, DPT',
      date: 'September 2026'
    },
    {
      id: 'art-2',
      category: 'Sports Rehabilitation',
      title: 'ACL Post-Surgical Milestones: From Swelling Control to Quad Activation',
      snippet: 'Understanding phase 1 and phase 2 orthopedic recovery after anterior cruciate ligament reconstruction surgery.',
      content: 'Early ACL rehabilitation prioritizes full passive knee extension, patellar mobility, and early quadriceps isometric contraction. Preventing knee flexion contractures in the first two weeks post-op is critical for achieving a normal gait pattern later in rehabilitation.',
      readTime: '6 min read',
      author: 'Dr. Marcus Vance, DPT',
      date: 'August 2026'
    },
    {
      id: 'art-3',
      category: 'Dry Needling & Myofascial',
      title: 'How Dry Needling Releases Trigger Points in Chronic Shoulder Pain',
      snippet: 'Demystifying intramuscular stimulation and how local twitch responses restore shoulder blade mobility.',
      content: 'Dry needling involves inserting micro-thin solid filiform needles into hyperirritable muscle trigger points (knots). This triggers a brief local twitch response (LTR) that resets neuromuscular spindle tension and increases localized blood circulation to chronic micro-tear zones.',
      readTime: '5 min read',
      author: 'Dr. Marcus Vance, DPT',
      date: 'July 2026'
    }
  ];

  const [activeModalArticle, setActiveModalArticle] = useState<Article | null>(null);

  return (
    <section className="py-16 relative bg-parchment-100/40 dark:bg-darkpine-900/40 border-t border-parchment-200 dark:border-pine-800/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pine-100 dark:bg-pine-900/60 border border-pine-200 dark:border-pine-800 text-pine-900 dark:text-ochre-300 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-ochre-500" />
            Health Education & Rehabilitation Insights
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-pine-950 dark:text-parchment-50 tracking-tight">
            Patient Health Guides
          </h2>
          <p className="text-xs sm:text-sm text-pine-800 dark:text-parchment-200 leading-relaxed">
            Evidence-based advice on injury prevention, ergonomic posture, and post-treatment movement care.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((art, idx) => (
            <motion.div
              key={art.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="glass-card p-6 rounded-3xl border border-parchment-200 dark:border-pine-800/60 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-parchment-100 dark:bg-darkpine-950 border border-parchment-200 dark:border-pine-800 text-[11px] font-semibold text-pine-900 dark:text-ochre-300">
                    {art.category}
                  </span>
                  <span className="text-[11px] text-pine-600 dark:text-parchment-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-ochre-500" />
                    {art.readTime}
                  </span>
                </div>

                <h3 className="text-base font-serif font-bold text-pine-950 dark:text-parchment-50 leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-pine-800 dark:text-parchment-200 line-clamp-3 leading-relaxed">
                  {art.snippet}
                </p>
              </div>

              <div className="pt-4 border-t border-parchment-200 dark:border-pine-800/60 flex items-center justify-between text-xs">
                <span className="text-pine-600 dark:text-parchment-400 font-medium">{art.author}</span>
                <button
                  onClick={() => setActiveModalArticle(art)}
                  className="font-bold text-pine-800 dark:text-ochre-400 hover:underline flex items-center gap-1"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </motion.div>
          ))}
        </div>

      </div>

      {/* Article Detail Modal */}
      <AnimatePresence>
        {activeModalArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-pine-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 16 }}
              className="glass-card max-w-xl w-full p-8 rounded-3xl border border-parchment-200 dark:border-pine-800 space-y-6 relative max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              
              <div className="flex items-center justify-between border-b border-parchment-200 dark:border-pine-800 pb-3">
                <span className="px-3 py-1 rounded-full bg-pine-100 dark:bg-pine-900/60 text-xs font-bold text-pine-900 dark:text-ochre-300">
                  {activeModalArticle.category}
                </span>
                <button
                  onClick={() => setActiveModalArticle(null)}
                  className="p-1 rounded-lg text-pine-600 dark:text-parchment-400 hover:text-pine-950 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-pine-950 dark:text-parchment-50">
                  {activeModalArticle.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-pine-600 dark:text-parchment-400">
                  <span>By {activeModalArticle.author}</span>
                  <span>•</span>
                  <span>{activeModalArticle.date}</span>
                  <span>•</span>
                  <span>{activeModalArticle.readTime}</span>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-pine-900 dark:text-parchment-200 leading-relaxed space-y-3 border-t border-parchment-200 dark:border-pine-800/60 pt-4">
                <p>{activeModalArticle.content}</p>
                <p className="text-xs italic text-pine-600 dark:text-parchment-400 bg-parchment-100/60 dark:bg-darkpine-950 p-3 rounded-xl border border-parchment-200 dark:border-pine-800/40">
                  Note: Educational content is provided for informational purposes and does not replace individualized clinical examination.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveModalArticle(null)}
                  className="w-full py-3 rounded-full bg-pine-700 dark:bg-ochre-500 text-white dark:text-darkpine-950 font-bold text-xs"
                >
                  Close Article
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
