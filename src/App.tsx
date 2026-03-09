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
import { AuthPage } from './pages/AuthPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import { PublicLayout } from './components/PublicLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminUsers } from './pages/admin/Users';
import { AdminReservations } from './pages/admin/Reservations';
import { AdminPayments } from './pages/admin/Payments';
import { AdminSubscriptions } from './pages/admin/Subscriptions';
import { AdminPromoCodes } from './pages/admin/PromoCodes';
import Facturation from './pages/admin/Facturation';

import { AdminSettings } from './pages/admin/Settings';
import { AdminMailbox } from './pages/admin/Mailbox';
import { AdminNewsletter } from './pages/admin/Newsletter';
import { AdminCourts } from './pages/admin/Courts';
import { AdminEvents } from './pages/admin/Events';

// PLAYER PAGES
import { PlayerLayout } from './components/player/PlayerLayout';
import { PlayerDashboard } from './pages/player/Dashboard';
import { PlayerBook } from './pages/player/BookCourt';
import { PlayerReservations } from './pages/player/MyReservations';
import { PlayerEvents } from './pages/player/Events';
import { PlayerSubscription } from './pages/player/Subscription';
import { PlayerPayments } from './pages/player/Payments';
import { PlayerProfile } from './pages/player/Profile';
import { PlayerSettings } from './pages/player/Settings';
import { PlayerRanking } from './pages/player/Ranking';
import { PlayerMessages } from './pages/player/Messages';

import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { ProtectedRoute, PublicRoute } from './components/AuthRoutes';

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    return sessionStorage.getItem('intro_seen') !== 'true';
  });
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
    <GoogleOAuthProvider clientId={(import.meta as any).env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <AuthProvider>
          <ScrollToTop />
          <AnimatePresence mode="wait">
            {showIntro ? (
              <motion.div
                key="intro"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <IntroExperience onEnter={() => {
                  sessionStorage.setItem('intro_seen', 'true');
                  setShowIntro(false);
                }} />
              </motion.div>
            ) : (
              <motion.div
                key="main"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative min-h-screen bg-dark-bg selection:bg-padel-blue selection:text-white overflow-x-hidden"
              >
                <Routes>
                  {/* PUBLIC SITE */}
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/le-club" element={<ClubPage />} />
                    <Route path="/activites" element={<ActivitiesPage />} />
                    <Route path="/reservation" element={<BookingPage />} />
                    <Route path="/tarifs" element={<PricingPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/actualites" element={<NewsPage />} />
                  </Route>

                  {/* AUTH PAGE (Redirects if already logged in) */}
                  <Route element={<PublicRoute />}>
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                  </Route>

                  {/* BACKOFFICE MANAGER (Unified Admin) - Guarded by ProtectedRoute & ADMIN role */}
                  <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                    <Route path="/admin" element={<AdminLayout role="SUPER_ADMIN" />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="reservations" element={<AdminReservations />} />
                      <Route path="courts" element={<AdminCourts />} />
                      <Route path="tournaments" element={<AdminEvents />} />
                      <Route path="courses" element={<AdminEvents defaultTab="COURS" />} />
                      <Route path="payments" element={<AdminPayments />} />
                      <Route path="subscriptions" element={<AdminSubscriptions />} />
                      <Route path="promo-codes" element={<AdminPromoCodes />} />
                      <Route path="settings" element={<AdminSettings />} />
                      <Route path="billing" element={<Facturation />} />
                      <Route path="mailbox" element={<AdminMailbox />} />
                      <Route path="newsletter" element={<AdminNewsletter />} />
                    </Route>
                  </Route>

                  {/* BACKOFFICE PLAYER - Guarded by ProtectedRoute */}
                  <Route element={<ProtectedRoute allowedRoles={['PLAYER']} />}>
                    <Route element={<PlayerLayout />}>
                      <Route path="/dashboard" element={<PlayerDashboard />} />
                      <Route path="/book" element={<PlayerBook />} />
                      <Route path="/my-reservations" element={<PlayerReservations />} />
                      <Route path="/events" element={<PlayerEvents />} />
                      <Route path="/subscription" element={<PlayerSubscription />} />
                      <Route path="/payments" element={<PlayerPayments />} />
                      <Route path="/profile" element={<PlayerProfile />} />
                      <Route path="/settings" element={<PlayerSettings />} />
                      <Route path="/ranking" element={<PlayerRanking />} />
                      <Route path="/messages" element={<PlayerMessages />} />
                    </Route>
                  </Route>
                </Routes>

                {/* Global UI Elements */}
                {/* Sound Button */}
                <div className="fixed bottom-8 right-6 md:right-8 z-[100]">
                  <audio
                    id="bg-music"
                    loop
                    autoPlay
                    muted={isMuted}
                    src="/AUDIO/background-music.mp3"
                  />

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 5, boxShadow: "0 0 30px rgba(19,73,211,0.4)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMuted(!isMuted)}
                    className="w-10 h-10 md:w-12 md:h-12 glass text-white rounded-full flex items-center justify-center shadow-2xl"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}
