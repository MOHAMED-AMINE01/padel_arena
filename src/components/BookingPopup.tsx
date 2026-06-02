import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarClock, X, Sparkles, ArrowRight } from 'lucide-react';

// Date d'ouverture des réservations
const OPENING_DATE = new Date('2026-06-15T00:00:00');

// Toute URL pointant vers la plateforme de réservation déclenche la popup
const BOOKING_HOSTS = ['villagepadel.fr'];

const isBookingLink = (href: string | null) => {
  if (!href) return false;
  return BOOKING_HOSTS.some((host) => href.includes(host));
};

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

const getTimeLeft = (): TimeLeft => {
  const diff = OPENING_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="w-full min-w-[3.75rem] sm:min-w-[4.5rem] aspect-square flex items-center justify-center rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
      <span className="text-2xl sm:text-4xl font-display font-black text-white tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
    </div>
    <span className="mt-2 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.25em] text-white/40">
      {label}
    </span>
  </div>
);

export const BookingPopup = () => {
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft);

  // Intercepte tous les clics vers la plateforme de réservation, partout sur le site
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (anchor && isBookingLink(anchor.getAttribute('href'))) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(true);
      }
    };
    // Phase de capture : on bloque avant que les handlers natifs ne s'exécutent
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  // Tic du compte à rebours uniquement quand la popup est ouverte
  useEffect(() => {
    if (!open) return;
    setTimeLeft(getTimeLeft());
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, [open]);

  // Fermeture via la touche Échap + blocage du scroll de fond
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="booking-popup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={close}
          className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] backdrop-blur-2xl shadow-[0_50px_120px_rgba(0,0,0,0.6)] p-8 sm:p-12 text-center"
          >
            {/* Lueurs décoratives */}
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-padel-blue/20 blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-padel-yellow/10 blur-[100px] pointer-events-none" />

            {/* Icône décorative de fond */}
            <CalendarClock
              size={260}
              className="absolute -bottom-16 -right-16 text-white/[0.02] -rotate-12 pointer-events-none"
            />

            {/* Bouton fermeture */}
            <button
              onClick={close}
              aria-label="Fermer"
              className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={18} />
            </button>

            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 py-1.5 px-4 rounded-full bg-padel-yellow/10 border border-padel-yellow/20 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-padel-yellow animate-pulse" />
                <span className="text-[9px] font-black tracking-[0.35em] text-padel-yellow uppercase">
                  Bientôt disponible
                </span>
              </div>

              {/* Icône principale */}
              <div className="flex justify-center mb-7">
                <div className="w-20 h-20 rounded-3xl bg-padel-blue/10 border border-padel-blue/20 flex items-center justify-center text-padel-blue shadow-[0_0_60px_rgba(19,73,211,0.25)]">
                  <CalendarClock size={38} />
                </div>
              </div>

              {/* Titre */}
              <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tighter italic leading-[0.9] mb-5">
                Réservations <br />
                <span className="text-padel-blue">à partir du 15 juin</span>
              </h2>

              {/* Texte */}
              <p className="text-white/50 text-sm sm:text-base font-medium leading-relaxed max-w-sm mx-auto mb-8">
                Notre plateforme de réservation en ligne ouvre le{' '}
                <span className="text-white font-bold">15 juin 2026</span>. Encore un peu
                de patience avant d'entrer dans l'arène !
              </p>

              {/* Compte à rebours */}
              <div className="grid grid-cols-4 gap-2.5 sm:gap-3 max-w-sm mx-auto mb-10">
                <CountdownUnit value={timeLeft.days} label="Jours" />
                <CountdownUnit value={timeLeft.hours} label="Heures" />
                <CountdownUnit value={timeLeft.minutes} label="Min" />
                <CountdownUnit value={timeLeft.seconds} label="Sec" />
              </div>

              {/* Action */}
              <button
                onClick={close}
                className="group inline-flex items-center gap-3 px-10 py-4 bg-padel-blue text-white rounded-full font-black text-[11px] uppercase tracking-[0.25em] shadow-[0_20px_40px_rgba(19,73,211,0.3)] hover:bg-padel-yellow hover:text-black transition-all duration-500"
              >
                <Sparkles size={15} className="animate-pulse" />
                J'ai hâte !
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
