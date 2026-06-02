import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { IntroExperience } from './components/IntroExperience';
import { HomePage } from './pages/HomePage';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import { BookingPopup } from './components/BookingPopup';
import { PublicLayout } from './components/PublicLayout';

import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { ProtectedRoute, PublicRoute } from './components/AuthRoutes';

// Helper: lazy-load d'un export nommé (code-splitting par route)
const named = <T extends Record<string, any>>(factory: () => Promise<T>, name: keyof T) =>
  lazy(() => factory().then((m) => ({ default: m[name] })));

// PAGES PUBLIQUES SECONDAIRES (chargées à la demande)
const ClubPage = named(() => import('./pages/ClubPage'), 'ClubPage');
const ActivitiesPage = named(() => import('./pages/ActivitiesPage'), 'ActivitiesPage');
const BookingPage = named(() => import('./pages/BookingPage'), 'BookingPage');
const PricingPage = named(() => import('./pages/PricingPage'), 'PricingPage');
const ContactPage = named(() => import('./pages/ContactPage'), 'ContactPage');
const MentionsLegalesPage = named(() => import('./pages/MentionsLegalesPage'), 'MentionsLegalesPage');
const PolitiqueConfidentialitePage = named(() => import('./pages/PolitiqueConfidentialitePage'), 'PolitiqueConfidentialitePage');
const CookiesPage = named(() => import('./pages/CookiesPage'), 'CookiesPage');
const NewsPage = named(() => import('./pages/NewsPage'), 'NewsPage');
const BookingSuccess = named(() => import('./pages/BookingSuccess'), 'BookingSuccess');
const BookingError = named(() => import('./pages/BookingError'), 'BookingError');
const AuthPage = named(() => import('./pages/AuthPage'), 'AuthPage');
const ForgotPasswordPage = named(() => import('./pages/ForgotPasswordPage'), 'ForgotPasswordPage');
const ResetPasswordPage = named(() => import('./pages/ResetPasswordPage'), 'ResetPasswordPage');

// BACKOFFICE ADMIN (chargé à la demande)
const AdminLayout = named(() => import('./components/admin/AdminLayout'), 'AdminLayout');
const AdminDashboard = named(() => import('./pages/admin/Dashboard'), 'AdminDashboard');
const AdminUsers = named(() => import('./pages/admin/Users'), 'AdminUsers');
const AdminReservations = named(() => import('./pages/admin/Reservations'), 'AdminReservations');
const AdminPayments = named(() => import('./pages/admin/Payments'), 'AdminPayments');
const AdminPromoCodes = named(() => import('./pages/admin/PromoCodes'), 'AdminPromoCodes');
const Facturation = lazy(() => import('./pages/admin/Facturation'));
const AdminSettings = named(() => import('./pages/admin/Settings'), 'AdminSettings');
const AdminMailbox = named(() => import('./pages/admin/Mailbox'), 'AdminMailbox');
const AdminNewsletter = named(() => import('./pages/admin/Newsletter'), 'AdminNewsletter');
const AdminCourts = named(() => import('./pages/admin/Courts'), 'AdminCourts');
const AdminEvents = named(() => import('./pages/admin/Events'), 'AdminEvents');
const AdminNews = named(() => import('./pages/admin/News'), 'AdminNews');
const AdminPlans = named(() => import('./pages/admin/Plans'), 'AdminPlans');
const AdminWalletPacks = named(() => import('./pages/admin/WalletPacks'), 'AdminWalletPacks');
const AdminTestimonials = named(() => import('./pages/admin/Testimonials'), 'AdminTestimonials');
const AdminTeam = named(() => import('./pages/admin/Team'), 'AdminTeam');

// BACKOFFICE JOUEUR (chargé à la demande)
const PlayerLayout = named(() => import('./components/player/PlayerLayout'), 'PlayerLayout');
const PlayerDashboard = named(() => import('./pages/player/Dashboard'), 'PlayerDashboard');
const PlayerBook = named(() => import('./pages/player/BookCourt'), 'PlayerBook');
const PlayerReservations = named(() => import('./pages/player/MyReservations'), 'PlayerReservations');
const PlayerEvents = named(() => import('./pages/player/Events'), 'PlayerEvents');
const PlayerSubscription = named(() => import('./pages/player/Subscription'), 'PlayerSubscription');
const PlayerPayments = named(() => import('./pages/player/Payments'), 'PlayerPayments');
const PlayerProfile = named(() => import('./pages/player/Profile'), 'PlayerProfile');
const PlayerSettings = named(() => import('./pages/player/Settings'), 'PlayerSettings');
const PlayerMessages = named(() => import('./pages/player/Messages'), 'PlayerMessages');

// Fallback discret pendant le chargement d'un chunk de route
const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-dark-bg">
    <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-padel-blue animate-spin" />
  </div>
);

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    return sessionStorage.getItem('intro_seen') !== 'true';
  });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Préchargement des seuls assets critiques de la landing (LCP).
  useEffect(() => {
    const assets = [
      '/IMAGES/home.jpeg',
      '/IMAGES/newLogo.png',
    ];
    assets.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <GoogleOAuthProvider clientId={(import.meta as any).env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <AuthProvider>
          <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#0D0D10', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
          <ScrollToTop />
          <BookingPopup />
          <AnimatePresence>
            {showIntro ? (
              <motion.div
                key="intro"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
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
                <Suspense fallback={<RouteFallback />}>
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
                    <Route path="/booking-success" element={<BookingSuccess />} />
                    <Route path="/succes" element={<BookingSuccess />} />
                    <Route path="/echec" element={<BookingError />} />
                    <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
                    <Route path="/politique-confidentialite" element={<PolitiqueConfidentialitePage />} />
                    <Route path="/cookies" element={<CookiesPage />} />
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
                      <Route path="promo-codes" element={<AdminPromoCodes />} />
                      <Route path="settings" element={<AdminSettings />} />
                      <Route path="billing" element={<Facturation />} />
                      <Route path="mailbox" element={<AdminMailbox />} />
                      <Route path="newsletter" element={<AdminNewsletter />} />
                      <Route path="news" element={<AdminNews />} />
                      <Route path="plans" element={<AdminPlans />} />
                      <Route path="wallet-packs" element={<AdminWalletPacks />} />
                      <Route path="testimonials" element={<AdminTestimonials />} />
                      <Route path="team" element={<AdminTeam />} />
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
                      <Route path="/wallet" element={<Navigate to="/dashboard" replace />} />

                      <Route path="/messages" element={<PlayerMessages />} />
                    </Route>
                  </Route>
                </Routes>
                </Suspense>


              </motion.div>
            )}
          </AnimatePresence>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}
