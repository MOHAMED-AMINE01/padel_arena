import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { IntroExperience } from './components/IntroExperience';
import { HomePage } from './pages/HomePage';
import { ClubPage } from './pages/ClubPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { BookingPage } from './pages/BookingPage';
import { PricingPage } from './pages/PricingPage';
import { ContactPage } from './pages/ContactPage';
import { Volume2, VolumeX } from 'lucide-react';
import { NewsPage } from './pages/NewsPage';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Preload assets
  useEffect(() => {
    const assets = [
      '/IMAGES/Logo Padel Arena Vendôme.png',
      '/pexels-criticalimagery-33226057.jpg',
      '/pexels-criticalimagery-33226056.jpg',
      '/pexels-criticalimagery-32897038.jpg',
      '/pexels-criticalimagery-34285600.jpg',
      '/pexels-anhelina-vasylyk-734724285-35248239.jpg',
      '/pexels-anhelina-vasylyk-734724285-35248310.jpg',
      '/input_file_0.mp4',
    ];
    assets.forEach(src => {
      if (src.endsWith('.mp4')) {
        const video = document.createElement('video');
        video.src = src;
        video.preload = 'auto';
      } else {
        const img = new Image();
        img.src = src;
      }
    });
  }, []);

  return (
    <Router>
      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <IntroExperience onEnter={() => setShowIntro(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative min-h-screen bg-dark-bg selection:bg-padel-blue selection:text-white overflow-x-hidden"
          >
            {/* Custom Cursor */}
            {/* <motion.div
              className="fixed top-0 left-0 w-8 h-8 border border-padel-blue rounded-full pointer-events-none z-[9999] hidden lg:block"
              animate={{ x: mousePos.x - 16, y: mousePos.y - 16 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 0.5 }}
            /> */}
            {/* <motion.div
              className="fixed top-0 left-0 w-1.5 h-1.5 bg-padel-blue rounded-full pointer-events-none z-[9999] hidden lg:block"
              animate={{ x: mousePos.x - 3, y: mousePos.y - 3 }}
              transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.2 }}
            /> */}

            <Navbar />

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/le-club" element={<ClubPage />} />
              <Route path="/activites" element={<ActivitiesPage />} />
              <Route path="/reservation" element={<BookingPage />} />
              <Route path="/tarifs" element={<PricingPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/actualites" element={<NewsPage />} />
            </Routes>

            <Footer />

            {/* Global UI Elements */}
            <div className="fixed bottom-24 md:bottom-8 right-6 md:right-8 z-[100] flex flex-col gap-4 items-end">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5, boxShadow: "0 0 30px rgba(19,73,211,0.4)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMuted(!isMuted)}
                className="w-12 h-12 glass text-white rounded-full flex items-center justify-center shadow-2xl"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Router>
  );
}
