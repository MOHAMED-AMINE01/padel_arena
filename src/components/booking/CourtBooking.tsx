import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Calendar as CalendarIcon, Clock, LayoutGrid, Users, CreditCard, CheckCircle2, ChevronRight, ChevronLeft, Info, ArrowUpRight, ShieldCheck, Zap, Target, Gauge, MousePointer2, Timer, Loader2, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import api from '../../lib/api';

// Interface pour les créneaux de l'API
interface Slot {
  time: string;
  available: boolean;
  price: number;
}

interface CourtAvailability {
  courtId: string;
  courtName: string;
  type: string;
  slots: Slot[];
}

const getEndTime = (startTime: string, durationMinutes: number): string => {
  if (!startTime) return "";
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
};

// Interface pour les terrains de l'API
interface Court {
  _id: string;
  name: string;
  type: string;
  sport: 'Padel' | 'Pickleball' | 'Badminton' | 'Basket' | 'Golf';
  pricePerHour: number;
  description?: string;
  isActive: boolean;
  image?: string;
}

// Interface pour les réservations existantes
interface ExistingBooking {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  court: { _id: string } | string;
}

const steps = [
  { id: 'sport', title: 'DISCIPLINE', icon: <Target size={16} />, desc: "CHOIX DU SPORT" },
  { id: 'date', title: 'CHRONOS', icon: <CalendarIcon size={16} />, desc: "CALIBRAGE TEMPOREL" },
  { id: 'time', title: 'CRÉNEAU', icon: <Clock size={16} />, desc: "SYNCHRONISATION SLOT" },
  { id: 'court', title: 'ARENA', icon: <LayoutGrid size={16} />, desc: "ZONE D'OPÉRATION" },
  { id: 'contact', title: 'SQUAD', icon: <Users size={16} />, desc: "UNITÉ DE COMBAT" },
  { id: 'payment', title: 'FINANCE', icon: <CreditCard size={16} />, desc: "VALIDATION ORDRE" },
];

// Générer les créneaux toutes les 30 min de 08:00 à 22:00
const generateAllTimeSlots = () => {
  const slots: string[] = [];
  for (let h = 8; h <= 21; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`);
    if (h < 21) slots.push(`${h.toString().padStart(2, '0')}:30`);
  }
  return slots;
};

const allTimeSlots = generateAllTimeSlots();

// Durées disponibles en minutes
const durations = [
  { value: 60, label: '1H', desc: 'SESSION STANDARD' },
  { value: 90, label: '1H30', desc: 'SESSION CONFORT' },
  { value: 120, label: '2H', desc: 'SESSION INTENSE' },
];

// Heure de fermeture du club
const CLOSING_TIME = '22:00';

const NoiseOverlay = () => (
  <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
);

const PerspectiveCard = ({ children, onClick, selected }: any) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="relative cursor-pointer"
    >
      <div style={{ transform: "translateZ(30px)" }}>
        {children}
      </div>
    </motion.div>
  );
};

export const CourtBooking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [availability, setAvailability] = useState<CourtAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  const initDate = [today.getFullYear(), (today.getMonth()+1).toString().padStart(2, '0'), today.getDate().toString().padStart(2, '0')].join('-');

  const [bookingData, setBookingData] = useState({
    sport: 'Padel' as 'Padel' | 'Pickleball' | 'Badminton' | 'Basket' | 'Golf',
    date: initDate,
    time: null as string | null,
    duration: 90, // minutes
    courtId: null as string | null,
    players: 4,
    guestName: user?.name || '',
    guestEmail: user?.email || '',
    guestPhone: '',
    options: [] as string[],
  });

  // Handle sport from query param
  useEffect(() => {
    const raw = searchParams.get('sport') || new URLSearchParams(window.location.search).get('sport');
    if (raw) {
      const formatted = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
      if (['Padel', 'Pickleball', 'Badminton', 'Basket', 'Golf'].includes(formatted)) {
        setBookingData(prev => ({ ...prev, sport: formatted as any }));
        setCurrentStep(1); // Jump to date if sport is pre-selected
      }
    }
  }, [searchParams]);

  // Fetch availability when date or sport changes
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/bookings/available-slots', {
          params: {
            sport: bookingData.sport,
            date: bookingData.date
          }
        });
        if (res.data.success) {
          setAvailability(res.data.data);
          // If the selected time or court is no longer available, reset them
          setBookingData(prev => ({
            ...prev,
            time: null,
            courtId: null
          }));
        }
      } catch (err: any) {
        console.error('Failed to fetch availability', err);
        setError('Impossible de charger les disponibilités.');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [bookingData.date, bookingData.sport]);

  const timeSlots = useMemo(() => {
    const slotsMap = new Map<string, boolean>();
    const now = new Date();
    
    // Format today as YYYY-MM-DD in local time
    const todayStr = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0')
    ].join('-');
    
    const isToday = bookingData.date === todayStr;

    availability.forEach(court => {
      court.slots.forEach(slot => {
        let isAvailable = slot.available;
        
        // If it's today, check if the slot is in the past
        if (isToday && isAvailable) {
          const [hours, minutes] = slot.time.split(':').map(Number);
          const slotTime = new Date();
          slotTime.setHours(hours, minutes, 0, 0);
          if (slotTime < now) {
            isAvailable = false;
          }
        }

        const isCurrentAvailable = slotsMap.get(slot.time) || false;
        slotsMap.set(slot.time, isCurrentAvailable || isAvailable);
      });
    });
    return Array.from(slotsMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([time, available]) => ({ time, available }));
  }, [availability, bookingData.date]);

  const availableCourts = useMemo(() => {
    if (!bookingData.time) return [];
    return availability.filter(court =>
      court.slots.find(s => s.time === bookingData.time && s.available)
    ).map(court => ({
      _id: court.courtId,
      name: court.courtName,
      type: court.type,
      price: court.slots.find(s => s.time === bookingData.time)?.price || 0
    }));
  }, [bookingData.time, availability]);

  const calculateTotal = () => {
    const court = availableCourts.find(c => c._id === bookingData.courtId);
    if (!court || !bookingData.duration) return '0.00';

    const basePrice = court.price * (bookingData.duration / 60);
    const optionsPrice = bookingData.options.reduce((acc, opt) => {
      if (opt === 'RACKET') return acc + 6;
      if (opt === 'BALLS') return acc + 12;
      return acc;
    }, 0);

    return (basePrice + optionsPrice).toFixed(2);
  };

  const nextStep = async () => {
    if (currentStep === 5) {
      // Handle Final Booking Submission
      try {
        console.log('Initiating guest booking submission...');
        setIsBooking(true);
        setError(null);

        // Force UTC: append Z so "10:00" is stored as 10:00 UTC in MongoDB
        const startTimeStr = `${bookingData.date}T${bookingData.time}:00.000Z`;
        const startMs = new Date(startTimeStr).getTime();
        const endTimeStr = new Date(startMs + bookingData.duration * 60000).toISOString();

        const response = await api.post('/bookings', {
          courtId: bookingData.courtId,
          startTime: startTimeStr,
          endTime: endTimeStr,
          guestName: bookingData.guestName,
          guestEmail: bookingData.guestEmail,
          guestPhone: bookingData.guestPhone,
          players: bookingData.players,
          userId: user?._id
        });

        if (response.data.success) {
          console.log('Booking successful, creating Stripe session...', response.data.data._id);
          const booking = response.data.data;
          const totalAmount = calculateTotal();
          const court = availableCourts.find(c => c._id === bookingData.courtId);

          // Create Stripe Checkout Session
          const stripeRes = await api.post('/payments/create-checkout-session', {
            bookingId: booking._id,
            courtName: court?.name,
            amount: parseFloat(totalAmount),
            customerEmail: bookingData.guestEmail,
            successUrl: `${window.location.origin}/booking-success?session_id={CHECKOUT_SESSION_ID}` 
          });

          if (stripeRes.data.url) {
            window.location.href = stripeRes.data.url;
          } else {
            setCurrentStep(6); // Fallback
          }
        }
      } catch (err: any) {
        console.error('CRITICAL: Booking or Payment failed', err);
        const errorMsg = err.response?.data?.message || 'La réservation ou le paiement a échoué.';
        setError(errorMsg);
        
        // Log detailed error for debugging
        if (err.response) {
          console.error('Server responded with:', err.response.data);
        }
      } finally {
        setIsBooking(false);
      }
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    setError(null);
  };

  const isStepComplete = (stepIdx: number) => {
    if (stepIdx === 0) return !!bookingData.sport;
    if (stepIdx === 1) return !!bookingData.date;
    if (stepIdx === 2) return !!bookingData.time;
    if (stepIdx === 3) return !!bookingData.courtId;
    if (stepIdx === 4) return !!bookingData.guestName && !!bookingData.guestEmail;
    if (stepIdx === 5) return true;
    return false;
  };

  return (
    <section id="reserver" className="relative pt-48 pb-16 md:pb-24 px-6 bg-[#050505] overflow-hidden">
      <NoiseOverlay />

      {/* Subtle Grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[33%]" />
          <div className="w-[1px] h-full bg-white mr-[33%]" />
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto relative z-10">

        {/* HEADER SECTION (UP) */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase notranslate" translate="no">RÉSERVATION PADEL ARENA</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter uppercase mb-10 leading-none">
              RÉSERVER <span className="text-padel-blue italic">VOTRE SESSION</span>
            </h1>

            {/* Stepper Horizontal */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-10">
              {steps.map((step, i) => (
                <div key={step.id} className={cn("flex flex-col items-center gap-2 transition-all duration-300", currentStep === i ? "opacity-100 scale-110" : "opacity-25 scale-90")}>
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all border",
                    currentStep === i ? "bg-padel-blue border-padel-blue text-white shadow-lg" :
                      currentStep > i ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white/5 border-white/10 text-white/40"
                  )}>
                    {currentStep > i ? <CheckCircle2 size={16} /> : step.icon}
                  </div>
                  <span className="text-[8px] font-black tracking-widest uppercase text-white/60">{step.title}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* INTERFACE CARD (BELOW) */}
        <div className="w-full">
          <div className="glass p-8 md:p-12 rounded-[3.5rem] md:rounded-[4.5rem] border-white/5 relative min-h-[500px] flex flex-col shadow-3xl overflow-hidden group/card bg-black/40">

            {/* Visual HUD corner details */}
            <div className="absolute top-8 left-8 w-4 h-[1px] bg-white/20" />
            <div className="absolute top-8 left-8 w-[1px] h-4 bg-white/20" />
            <div className="absolute bottom-8 right-8 w-4 h-[1px] bg-white/20" />
            <div className="absolute bottom-8 right-8 w-[1px] h-4 bg-white/20" />

            <div className="relative z-10 flex-grow">
              <AnimatePresence mode="wait">
                {currentStep === 0 && (
                  <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                    <div>
                      <h2 className="text-2xl md:text-4xl font-display font-black uppercase tracking-tight mb-2">Choisissez votre <span className="text-padel-blue italic">sport</span></h2>
                      <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.3em] mb-8">SÉLECTIONNEZ LA DISCIPLINE POUR LAQUELLE VOUS SOUHAITEZ RÉSERVER.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {[
                        { id: 'Padel', label: 'PADEL', icon: '🎾', desc: '3 terrains panorama & classic' },
                        { id: 'Pickleball', label: 'PICKLEBALL', icon: '🏓', desc: 'Terrain hybride haute performance' },
                        { id: 'Badminton', label: 'BADMINTON', icon: '🏸', desc: 'Cours réguliers pour tous niveaux' },
                        { id: 'Basket', label: 'BASKET 3×3', icon: '🏀', desc: 'Court olympique JO Paris 2024' },
                        { id: 'Golf', label: 'SIMULATEUR GOLF', icon: '⛳', desc: 'Les plus beaux parcours du monde' },
                      ].map(sport => (
                        <button
                          key={sport.id}
                          onClick={() => setBookingData({ ...bookingData, sport: sport.id as any, courtId: null })}
                          className={cn(
                            "relative p-8 rounded-[2rem] border transition-all duration-500 text-left overflow-hidden group",
                            bookingData.sport === sport.id
                              ? "bg-padel-blue/10 border-padel-blue ring-2 ring-padel-blue/20"
                              : "bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]"
                          )}
                        >
                          <span className="text-4xl block mb-4">{sport.icon}</span>
                          <h3 className="text-lg font-display font-black text-white uppercase tracking-tight mb-1">{sport.label}</h3>
                          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{sport.desc}</p>
                          {bookingData.sport === sport.id && (
                            <div className="absolute top-4 right-4">
                              <CheckCircle2 size={18} className="text-padel-blue" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                    <div>
                      <h2 className="text-2xl md:text-4xl font-display font-black uppercase tracking-tight mb-2">Quand venez-vous <span className="text-padel-blue italic">jouer ?</span></h2>
                      <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.3em] mb-8">CHOISISSEZ UNE DATE DANS LE CYCLE DE 14 JOURS.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                      {[...Array(14)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const dStr = [d.getFullYear(), (d.getMonth()+1).toString().padStart(2, '0'), d.getDate().toString().padStart(2, '0')].join('-');
                        const isS = bookingData.date === dStr;
                        return (
                          <button key={i} onClick={() => setBookingData({ ...bookingData, date: dStr })} className={cn("p-6 rounded-[2rem] border transition-all flex flex-col items-center", isS ? "bg-padel-blue border-padel-blue text-white shadow-xl" : "bg-white/[0.02] border-white/5 text-white/40 hover:border-white/10")}>
                            <span className="text-[8px] uppercase font-black tracking-widest block mb-2 opacity-30">{d.toLocaleDateString('fr-FR', { weekday: 'short' })}</span>
                            <span className="text-3xl font-display font-black leading-none mb-1">{d.getDate()}</span>
                            <span className="text-[8px] font-black opacity-20 uppercase">{d.toLocaleDateString('fr-FR', { month: 'short' })}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-10">
                    <div>
                      <h2 className="text-2xl md:text-4xl font-display font-black uppercase tracking-tight mb-2">CRÉNEAU <span className="text-padel-blue italic">TEMPOREL</span></h2>
                      <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.3em]">SÉLECTIONNEZ VOTRE HEURE DE DÉBUT</p>
                    </div>
                    {loading ? (
                      <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-padel-blue" />
                      </div>
                    ) : timeSlots.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Clock size={48} className="text-white/10 mb-4" />
                        <p className="text-white/30 text-sm font-bold uppercase tracking-widest">Aucun créneau disponible</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {timeSlots.map(slot => (
                          <button
                            key={slot.time}
                            disabled={!slot.available}
                            onClick={() => setBookingData({ ...bookingData, time: slot.time })}
                            className={cn(
                              "p-5 md:p-6 rounded-2xl border transition-all text-center group relative overflow-hidden",
                              bookingData.time === slot.time
                                ? "bg-padel-blue border-padel-blue text-white shadow-xl"
                                : slot.available
                                  ? "bg-white/[0.03] border-white/10 text-white/60 hover:border-padel-blue/50 hover:bg-padel-blue/5 hover:text-white"
                                  : "bg-white/[0.01] border-white/5 text-white/10 cursor-not-allowed border-dashed opacity-40"
                            )}
                          >
                            <span className="text-lg md:text-xl font-display font-black transition-transform group-hover:scale-110">{slot.time}</span>
                            
                            {slot.available ? (
                              <div className="absolute top-2 right-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                              </div>
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <X size={20} className="text-white/10" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
                    <div>
                      <h2 className="text-2xl md:text-4xl font-display font-black uppercase tracking-tight mb-2">VOTRE <span className="text-padel-blue italic">ARENA</span></h2>
                      <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.3em]">CHOISISSEZ VOTRE TERRAIN PARMI LES DISPONIBILITÉS</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                      {availableCourts.map(c => (
                        <PerspectiveCard key={c._id} onClick={() => setBookingData({ ...bookingData, courtId: c._id })}>
                          <div className={cn(
                            "p-12 rounded-[3.5rem] border transition-all duration-700 bg-black/40 relative flex flex-col items-center justify-center gap-6 text-center group",
                            bookingData.courtId === c._id ? "border-padel-blue bg-padel-blue/10 ring-4 ring-padel-blue/10 shadow-2xl shadow-padel-blue/10" : "border-white/5 hover:border-white/20"
                          )}>
                            <div className={cn(
                              "w-20 h-20 rounded-[2rem] flex items-center justify-center border transition-all duration-500",
                              bookingData.courtId === c._id ? "bg-padel-blue text-white border-padel-blue scale-110" : "bg-white/[0.03] border-white/5 text-white/20"
                            )}>
                              <LayoutGrid size={32} />
                            </div>
                            <div>
                              <h4 className="text-2xl font-display font-black text-white uppercase tracking-tight mb-2">{c.name}</h4>
                              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] leading-none mb-6">{c.type}</p>
                              <div className={cn(
                                "inline-flex px-6 py-2 rounded-full border text-[10px] font-black transition-all duration-500",
                                bookingData.courtId === c._id ? "bg-padel-blue border-padel-blue text-white" : "bg-white/5 border-white/10 text-padel-blue"
                              )}>
                                {c.price.toFixed(2)}€ / HEURE
                              </div>
                            </div>
                            {bookingData.courtId === c._id && (
                              <div className="absolute top-6 right-6 text-padel-blue">
                                <CheckCircle2 size={24} />
                              </div>
                            )}
                          </div>
                        </PerspectiveCard>
                      ))}
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                    <h2 className="text-2xl md:text-4xl font-display font-black uppercase tracking-tight">FORMATION <span className="text-padel-blue italic">UNITÉ</span></h2>
                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-8">
                        <div>
                          <label className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-4 block">NOM COMPLET</label>
                          <input
                            type="text"
                            value={bookingData.guestName}
                            onChange={(e) => setBookingData({ ...bookingData, guestName: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-sm font-bold text-white focus:border-padel-yellow focus:outline-none transition-all uppercase"
                            placeholder="JEAN DUPONT"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-4 block">EMAIL</label>
                          <input
                            type="email"
                            value={bookingData.guestEmail}
                            onChange={(e) => setBookingData({ ...bookingData, guestEmail: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-sm font-bold text-white focus:border-padel-yellow focus:outline-none transition-all uppercase"
                            placeholder="JEAN@ARENA.FR"
                          />
                        </div>
                      </div>
                      <div className="space-y-8">
                        <div>
                          <label className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-4 block">NB. JOUEURS</label>
                          <div className="flex gap-4">
                            {[2, 4].map(n => (
                              <button key={n} onClick={() => setBookingData({ ...bookingData, players: n })} className={cn("w-20 h-20 rounded-3xl border transition-all flex flex-col items-center justify-center gap-1", bookingData.players === n ? "bg-padel-blue border-padel-blue text-white shadow-xl" : "bg-white/5 border-white/5 text-white/30")}>
                                <span className="text-4xl font-display font-black">{n}</span>
                                <span className="text-[7px] font-black uppercase">PERS.</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-4 block">DURÉE SESSION</label>
                          <div className="flex gap-4 mb-8">
                            {[60, 90, 120].map(d => (
                              <button key={d} onClick={() => setBookingData({ ...bookingData, duration: d })} className={cn("px-8 py-4 rounded-xl border transition-all text-xs font-black", bookingData.duration === d ? "bg-padel-blue border-padel-blue text-white shadow-xl" : "bg-white/5 border-white/5 text-white/30")}>
                                {d} MIN
                              </button>
                            ))}
                          </div>

                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 5 && (
                  <motion.div key="s5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-6">
                    <div className="glass p-10 rounded-[3rem] border-white/10 bg-gradient-to-br from-padel-blue/10 to-transparent w-full max-w-md text-center">
                      <CreditCard size={40} className="mx-auto text-padel-blue mb-6 opacity-40" />
                      <h3 className="text-lg font-display font-black uppercase tracking-widest mb-6">RÉCAPITULATIF</h3>
                      <div className="space-y-3 border-t border-white/5 pt-6 mb-8 text-left">
                        <div className="flex justify-between text-[10px] font-black text-white/30 uppercase tracking-widest">
                          <span>DATE</span>
                          <span className="text-white">{new Date(bookingData.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-black text-white/30 uppercase tracking-widest">
                          <span>HORAIRE</span>
                          <span className="text-white">{bookingData.time} - {getEndTime(bookingData.time, bookingData.duration)}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-black text-white/30 uppercase tracking-widest">
                          <span>DURÉE</span>
                          <span className="text-white">{bookingData.duration} min</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-black text-white/30 uppercase tracking-widest">
                          <span>TERRAIN</span>
                          <span className="text-white">{availableCourts.find(c => c._id === bookingData.courtId)?.name}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-black text-white/30 uppercase tracking-widest">
                          <span>SQUAD</span>
                          <span className="text-white">{bookingData.players} PERS.</span>
                        </div>
                        {bookingData.options.length > 0 && (
                          <div className="flex justify-between text-[10px] font-black text-white/30 uppercase tracking-widest">
                            <span>LOGISTIQUE</span>
                            <span className="text-white">{bookingData.options.length} OPTIONS</span>
                          </div>
                        )}
                        <div className="flex justify-between text-[10px] font-black text-white/30 uppercase tracking-widest pt-3 border-t border-white/5">
                          <span>TOTAL</span>
                          <span className="text-padel-blue text-lg">{calculateTotal()}€</span>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="flex items-center justify-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                          <ShieldCheck size={14} className="text-emerald-500" />
                          <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest leading-none">PROTECTION DES DONNÉES AES-256</span>
                        </div>

                        <div className="flex flex-col items-center gap-4 px-6 py-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12 transition-transform group-hover:rotate-0">
                             <CreditCard size={40} />
                           </div>
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-padel-blue flex items-center justify-center text-white shadow-lg shadow-padel-blue/20">
                               <CreditCard size={14} />
                             </div>
                             <div className="text-left">
                               <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">Paiement 100% Sécurisé</p>
                               <p className="text-[8px] font-black text-padel-blue uppercase tracking-[0.2em] leading-none">VIA STRIPE CONNECT</p>
                             </div>
                           </div>
                           <p className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-widest leading-relaxed">
                             VOUS ALLEZ ÊTRE REDIRIGÉ VERS LA PLATEFORME SÉCURISÉE DE PAIEMENT <span className="text-white/40">STRIPE</span> POUR FINALISER VOTRE RÉGLEMENT.
                           </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 6 && (
                  <motion.div key="s6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center py-10">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 border border-emerald-500/20 shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 size={36} className="animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-display font-black mb-2 uppercase tracking-tight">RÉSERVATION <span className="text-emerald-500 italic">ACTIVÉE</span></h2>
                    <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest mb-10 leading-relaxed">UN ACCÈS NUMÉRIQUE SERA ENVOYÉ SUR VOTRE TERMINAL.</p>
                    <button onClick={() => setCurrentStep(0)} className="px-10 py-4 bg-white text-black rounded-full font-black text-[9px] uppercase tracking-[0.3em] hover:bg-padel-blue hover:text-white transition-all shadow-xl">MES SESSIONS</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* NAVIGATION CONTROLS */}
            {currentStep < 6 && (
              <div className="mt-12 flex flex-col gap-6 pt-8 border-t border-white/5 relative z-10">
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-3">
                    <CheckCircle2 size={12} className="rotate-180" />
                    {error}
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <button onClick={prevStep} disabled={currentStep === 0} className={cn("flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all", currentStep === 0 ? "opacity-0" : "text-white/20 hover:text-white")}>
                    <div className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center"><ChevronLeft size={18} /></div>
                    RETOUR
                  </button>
                  <div className="flex items-center gap-8">
                    {currentStep >= 3 && (
                      <div className="hidden md:flex flex-col text-right">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">TOTAL</span>
                        <span className="text-xl font-display font-black text-padel-blue">{calculateTotal()}€</span>
                      </div>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextStep}
                      disabled={!isStepComplete(currentStep) || isBooking}
                      className={cn(
                        "px-14 py-5 rounded-full font-black text-[10px] tracking-[0.3em] uppercase transition-all duration-500 relative overflow-hidden group/btn",
                        isStepComplete(currentStep) && !isBooking ? "bg-padel-blue text-white shadow-2xl" : "bg-white/5 text-white/10 border border-white/5 cursor-not-allowed"
                      )}
                    >
                      <span className="relative z-10 flex items-center gap-4 group-hover/btn:text-padel-blue transition-colors">
                        {isBooking ? (
                          <><Loader2 className="animate-spin mr-2" size={14} /> TRAITEMENT...</>
                        ) : (
                          <>{currentStep === 5 ? 'PAYER VIA STRIPE' : 'ÉTAPE SUIVANTE'} <ArrowUpRight size={18} /></>
                        )}
                      </span>
                      {isStepComplete(currentStep) && !isBooking && <div className="absolute inset-0 bg-padel-yellow translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />}
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            {/* PROGRESS BAR BOTTOM */}
            {currentStep < 7 && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/[0.03]">
                <motion.div className="h-full bg-padel-blue shadow-[0_0_15px_rgba(19,73,211,1)]" initial={{ width: 0 }} animate={{ width: `${(currentStep / 6) * 100}%` }} transition={{ duration: 1 }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Background Decor Layer */}
      <div className="absolute -bottom-20 -right-10 text-[20rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none uppercase">{steps[currentStep]?.title || "ARENA"}</div>
    </section>
  );
};
