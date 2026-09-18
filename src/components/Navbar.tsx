import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Calendar, Phone, ShieldCheck, Menu, X } from 'lucide-react';
import { defaultClinicProfile } from '../services/clinicService';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const navLinks = [
    { name: 'Home & About', path: '/' },
    { name: 'Services & Pricing', path: '/services' },
    { name: 'Book Appointment', path: '/book' },
    { name: 'Contact & Location', path: '/contact' },
    { name: 'Admin Panel', path: '/admin', isGated: true },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'glass-panel shadow-soft border-b border-parchment-200 dark:border-pine-800/60' 
        : 'bg-parchment-50/70 dark:bg-darkpine-950/70 backdrop-blur-md border-b border-parchment-200/40 dark:border-pine-800/30'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <motion.button 
            onClick={() => handleLinkClick('/')}
            className="flex items-center gap-3 group text-left focus:outline-none"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-pine-700 via-pine-600 to-ochre-500 p-0.5 shadow-soft group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-parchment-50 dark:bg-darkpine-950 rounded-[10px] flex items-center justify-center">
                <Activity className="w-6 h-6 text-pine-700 dark:text-ochre-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-serif font-extrabold tracking-tight text-pine-950 dark:text-parchment-50 block">
                Apex Motion <span className="text-ochre-600 dark:text-ochre-400 font-serif italic">Physio</span>
              </span>
              <span className="text-xs text-pine-700 dark:text-parchment-300 font-medium tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pine-600 dark:bg-ochre-400 animate-pulse"></span>
                Dr. Marcus Vance, DPT
              </span>
            </div>
          </motion.button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-parchment-100/80 dark:bg-darkpine-900/90 p-1.5 rounded-full border border-parchment-200 dark:border-pine-800/50 relative">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 z-10 ${
                    isActive
                      ? 'text-white'
                      : 'text-pine-900 dark:text-parchment-200 hover:text-pine-950 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-pine-700 dark:bg-pine-800 rounded-full z-0 shadow-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {link.isGated && <ShieldCheck className="w-3.5 h-3.5 text-ochre-500 dark:text-ochre-400" />}
                    {link.name}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Direct CTA */}
          <div className="hidden lg:flex items-center gap-3">

            <a 
              href={`tel:${defaultClinicProfile.phone.replace(/\s+/g, '')}`} 
              className="text-xs text-pine-800 dark:text-parchment-200 hover:text-ochre-600 transition-colors flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-parchment-100/60 dark:bg-darkpine-900/60 border border-parchment-200 dark:border-pine-800/50"
            >
              <Phone className="w-3.5 h-3.5 text-ochre-600 dark:text-ochre-400" />
              <span>{defaultClinicProfile.phone}</span>
            </a>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLinkClick('/book')}
              className="bg-pine-700 hover:bg-pine-800 dark:bg-ochre-500 dark:hover:bg-ochre-600 text-white dark:text-darkpine-950 font-bold px-5 py-2.5 rounded-full shadow-soft hover:shadow-glow-pine dark:hover:shadow-glow-ochre transition-all text-sm flex items-center gap-2 group"
            >
              <Calendar className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Book Appointment</span>
            </motion.button>
          </div>

          {/* Mobile Navigation Trigger */}
          <div className="md:hidden flex items-center gap-2">

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLinkClick('/book')}
              className="bg-pine-700 dark:bg-ochre-500 text-white dark:text-darkpine-950 text-xs font-bold px-3.5 py-2 rounded-full"
            >
              Book
            </motion.button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-parchment-100 dark:bg-darkpine-900 text-pine-900 dark:text-parchment-100 border border-parchment-200 dark:border-pine-800"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Animated Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-parchment-50 dark:bg-darkpine-950 border-b border-parchment-200 dark:border-pine-800 px-4 pt-3 pb-8 space-y-3 shadow-2xl"
          >
            <div className="space-y-1 pt-2">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`w-full text-left px-4 py-3.5 rounded-2xl text-base font-medium flex items-center justify-between transition-colors ${
                    currentPath === link.path
                      ? 'bg-pine-700 text-white dark:bg-ochre-500 dark:text-darkpine-950 font-bold shadow-soft'
                      : 'text-pine-900 dark:text-parchment-200 hover:bg-parchment-100 dark:hover:bg-darkpine-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.isGated && <ShieldCheck className="w-4 h-4 text-ochre-500" />}
                    {link.name}
                  </span>
                  <span className="text-xs opacity-60">→</span>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-parchment-200 dark:border-pine-800 space-y-2">
              <a 
                href={`tel:${defaultClinicProfile.phone.replace(/\s+/g, '')}`} 
                className="w-full py-3 rounded-2xl bg-parchment-100 dark:bg-darkpine-900 text-pine-900 dark:text-parchment-100 text-xs font-semibold flex items-center justify-center gap-2 border border-parchment-200 dark:border-pine-800"
              >
                <Phone className="w-4 h-4 text-ochre-500" />
                <span>Call Clinic: {defaultClinicProfile.phone}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
