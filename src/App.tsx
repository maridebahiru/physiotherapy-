import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { Contact } from './pages/Contact';
import { BookingFlow } from './pages/BookingFlow';
import { Admin } from './pages/Admin';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | undefined>(undefined);

  // Sync state with URL pathname / hash
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash.replace('#', '');
      const path = hash || window.location.pathname || '/';
      
      const [cleanPath, queryString] = path.split('?');
      if (queryString) {
        const params = new URLSearchParams(queryString);
        const servId = params.get('serviceId');
        if (servId) setPreselectedServiceId(servId);
      }
      
      setCurrentPath(cleanPath || '/');
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (path: string, serviceId?: string) => {
    if (serviceId) {
      setPreselectedServiceId(serviceId);
      window.location.hash = `${path}?serviceId=${serviceId}`;
    } else {
      setPreselectedServiceId(undefined);
      window.location.hash = path;
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (currentPath) {
      case '/services':
        return <Services onNavigate={navigateTo} />;
      case '/book':
        return <BookingFlow preselectedServiceId={preselectedServiceId} onNavigate={navigateTo} />;
      case '/contact':
        return <Contact onNavigate={navigateTo} />;
      case '/admin':
        return <Admin onNavigate={navigateTo} />;
      case '/':
      default:
        return <Home onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-parchment-50 dark:bg-darkpine-950 text-pine-950 dark:text-parchment-100 font-sans selection:bg-ochre-500 selection:text-white transition-colors duration-200 overflow-x-hidden">
      <Navbar currentPath={currentPath} onNavigate={navigateTo} />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  );
};

export default App;
