import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Calendar as CalendarIcon, Clock, LayoutGrid, Users, CreditCard, CheckCircle2, ChevronRight, ChevronLeft, Info, ArrowUpRight, ShieldCheck, Zap, Target, Gauge, MousePointer2, Timer, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';

// Interface pour les terrains de l'API
interface Court {
  _id: string;
  name: string;
  type: string;
  sport: 'Padel' | 'Pickleball' | 'Badminton';
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
  { id: 'date', title: 'CHRONOS', icon: <CalendarIcon size={16} />, desc: "CALIBRAGE TEMPOREL" },
  { id: 'time', title: 'CRÉNEAU', icon: <Clock size={16} />, desc: "SYNCHRONISATION SLOT" },
  { id: 'duration', title: 'DURÉE', icon: <Timer size={16} />, desc: "TEMPS DE JEU" },
  { id: 'court', title: 'ARENA', icon: <LayoutGrid size={16} />, desc: "ZONE D'OPÉRATION" },
  { id: 'players', title: 'SQUAD', icon: <Users size={16} />, desc: "UNITÉ DE COMBAT" },
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
  const [currentStep, setCurrentStep] = useState(0);
  const [courts, setCourts] = useState<Court[]>([]);
  const [existingBookings, setExistingBookings] = useState<ExistingBooking[]>([]);
  const [loadingCourts, setLoadingCourts] = useState(true);
  const [bookingData, setBookingData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '',
    duration: 0, // en minutes
    courtId: null as string | null,
    players: 4,
    options: [] as string[],
  });

  // Charger les terrains et réservations depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courtsRes, bookingsRes] = await Promise.all([
          api.get('/courts'),
          api.get('/bookings')
        ]);
        
        // Filtrer seulement les terrains actifs
        const activeCourts = (courtsRes.data.data || []).filter((c: Court) => c.isActive);
        setCourts(activeCourts);
        
        // Récupérer les réservations
        const allBookings = bookingsRes.data.data || [];
        setExistingBookings(allBookings);
      } catch (err) {
        console.error('Erreur chargement données:', err);
      } finally {
        setLoadingCourts(false);
      }
    };
    fetchData();
  }, []);

  // Calcule l'heure de fin en fonction du créneau et de la durée
  const getEndTime = (startTime: string, durationMinutes: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  // Vérifie si un créneau est dans le passé (pour aujourd'hui uniquement)
  const isSlotInPast = (time: string, date: string): boolean => {
    const today = new Date().toISOString().split('T')[0];
    if (date !== today) return false;
    
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const slotTime = new Date();
    slotTime.setHours(hours, minutes, 0, 0);
    
    // Ajouter 30 min de marge pour permettre aux utilisateurs de réserver
    return slotTime.getTime() <= now.getTime() + 30 * 60 * 1000;
  };

  // Filtre les créneaux disponibles selon la date et l'heure actuelle
  const availableTimeSlots = useMemo(() => {
    return allTimeSlots.filter(slot => !isSlotInPast(slot, bookingData.date));
  }, [bookingData.date]);

  // Vérifie si une durée est disponible pour le créneau sélectionné
  const isDurationAvailable = (durationMinutes: number): { available: boolean; reason?: string } => {
    if (!bookingData.time) return { available: false, reason: 'Sélectionnez un créneau' };

    const endTime = getEndTime(bookingData.time, durationMinutes);
    
    // Vérifier si la durée dépasse l'heure de fermeture
    if (endTime > CLOSING_TIME) {
      return { available: false, reason: `Dépasse l'heure de fermeture (${CLOSING_TIME})` };
    }

    // Vérifier les conflits avec les réservations existantes
    const hasConflict = existingBookings.some(booking => {
      const bookingDateStr = new Date(booking.date).toISOString().split('T')[0];
      if (bookingDateStr !== bookingData.date) return false;
      
      const bookingStart = booking.startTime;
      const bookingEnd = booking.endTime;
      const selectedStart = bookingData.time;
      const selectedEnd = endTime;

      // Vérifie le chevauchement
      return (selectedStart < bookingEnd && selectedEnd > bookingStart);
    });

    if (hasConflict) {
      return { available: false, reason: 'Conflit avec une réservation existante' };
    }

    return { available: true };
  };

  // Durées filtrées (seulement celles disponibles)
  const availableDurations = useMemo(() => {
    return durations.map(d => ({
      ...d,
      ...isDurationAvailable(d.value)
    }));
  }, [bookingData.time, bookingData.date]);

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const isStepComplete = (stepIdx: number) => {
    if (stepIdx === 0) return !!bookingData.date;
    if (stepIdx === 1) return !!bookingData.time;
    if (stepIdx === 2) return bookingData.duration > 0;
    if (stepIdx === 3) return !!bookingData.courtId;
    if (stepIdx === 4) return true;
    return false;
  };

  const calculateTotal = () => {
    const court = courts.find(c => c._id === bookingData.courtId);
    if (!court || !bookingData.duration) return '0.00';
    
    const hourlyRate = court.pricePerHour;
    const durationHours = bookingData.duration / 60;
    const basePrice = hourlyRate * durationHours;
    const optionsPrice = bookingData.options.length * 5;
    
    return (basePrice + optionsPrice).toFixed(2);
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
              <div className="w-8 h-[1px] bg-padel-blue" />
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">RÉSERVATION VENDÔME</span>
              <div className="w-8 h-[1px] bg-padel-blue" />
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
                      <h2 className="text-2xl md:text-4xl font-display font-black uppercase tracking-tight mb-2">SÉLECTION <span className="text-padel-blue italic">TEMPORELLE</span></h2>
                      <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.3em] mb-8">CHOISISSEZ UNE DATE DANS LE CYCLE DE 14 JOURS.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                      {[...Array(14)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const dStr = d.toISOString().split('T')[0];
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

                {currentStep === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-10">
                    <div>
                      <h2 className="text-2xl md:text-4xl font-display font-black uppercase tracking-tight mb-2">CRÉNEAU <span className="text-padel-blue italic">DÉTAILLÉ</span></h2>
                      <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.3em]">SÉLECTIONNEZ VOTRE HEURE DE DÉBUT</p>
                    </div>
                    {availableTimeSlots.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Clock size={48} className="text-white/10 mb-4" />
                        <p className="text-white/30 text-sm font-bold uppercase tracking-widest">Aucun créneau disponible pour cette date</p>
                        <p className="text-white/15 text-xs mt-2">Veuillez sélectionner une autre date</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {availableTimeSlots.map(t => (
                          <button 
                            key={t} 
                            onClick={() => setBookingData({ ...bookingData, time: t, duration: 0 })} 
                            className={cn(
                              "p-5 md:p-6 rounded-2xl border transition-all text-center group relative overflow-hidden", 
                              bookingData.time === t 
                                ? "bg-padel-blue border-padel-blue text-white shadow-xl" 
                                : "bg-white/[0.02] border-white/5 text-white/40 hover:border-white/15 hover:bg-white/[0.04]"
                            )}
                          >
                            <span className="text-lg md:text-xl font-display font-black">{t}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-6 p-6 glass rounded-3xl border-padel-blue/20 bg-padel-blue/5">
                      <Zap size={22} className="text-padel-blue animate-pulse" />
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">OFFRE HEURES CREUSES ACTIVE : -20% AVANT 17:00.</p>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-10">
                    <div>
                      <h2 className="text-2xl md:text-4xl font-display font-black uppercase tracking-tight mb-2">DURÉE <span className="text-padel-blue italic">DE JEU</span></h2>
                      <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.3em]">
                        CRÉNEAU SÉLECTIONNÉ : <span className="text-padel-blue">{bookingData.time}</span> 
                        {bookingData.duration > 0 && <span className="text-emerald-500"> → {getEndTime(bookingData.time, bookingData.duration)}</span>}
                      </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                      {availableDurations.map(d => (
                        <button
                          key={d.value}
                          onClick={() => d.available && setBookingData({ ...bookingData, duration: d.value })}
                          disabled={!d.available}
                          className={cn(
                            "relative p-8 md:p-10 rounded-[2rem] border transition-all text-center group overflow-hidden",
                            !d.available && "opacity-30 cursor-not-allowed grayscale",
                            bookingData.duration === d.value
                              ? "bg-padel-blue border-padel-blue text-white shadow-xl shadow-padel-blue/20"
                              : d.available 
                                ? "bg-white/[0.02] border-white/5 text-white/40 hover:border-white/15 hover:bg-white/[0.04]"
                                : "bg-white/[0.01] border-white/5 text-white/20"
                          )}
                        >
                          <span className="text-4xl md:text-5xl font-display font-black block mb-2">{d.label}</span>
                          <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-50">{d.desc}</span>
                          {!d.available && d.reason && (
                            <div className="absolute inset-x-0 bottom-4 text-[7px] font-bold text-red-400 uppercase tracking-widest px-4">
                              {d.reason}
                            </div>
                          )}
                          {bookingData.duration === d.value && (
                            <div className="absolute top-4 right-4">
                              <CheckCircle2 size={20} className="text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    {bookingData.duration > 0 && (
                      <div className="flex items-center gap-6 p-6 glass rounded-3xl border-emerald-500/20 bg-emerald-500/5">
                        <CheckCircle2 size={22} className="text-emerald-500" />
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">
                          SESSION DE {bookingData.time} À {getEndTime(bookingData.time, bookingData.duration)} • DURÉE {bookingData.duration} MIN
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
                    <h2 className="text-2xl md:text-4xl font-display font-black uppercase tracking-tight">VOTRE <span className="text-padel-blue italic">ARENA</span></h2>
                    {loadingCourts ? (
                      <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-padel-blue" />
                      </div>
                    ) : courts.length === 0 ? (
                      <div className="text-center py-20 text-white/40">Aucun terrain disponible</div>
                    ) : (
                      <div className="grid md:grid-cols-3 gap-6">
                        {courts.map(c => (
                          <PerspectiveCard key={c._id} onClick={() => setBookingData({ ...bookingData, courtId: c._id })}>
                            <div className={cn("rounded-[2.5rem] overflow-hidden border transition-all duration-700 bg-[#0F0F0F] relative", bookingData.courtId === c._id ? "border-padel-blue ring-4 ring-padel-blue/10" : "border-white/5")}>
                              <div className="aspect-[4/5] relative">
                                <img src={c.image || '/IMAGES/INFRASTRUCTURES/pexels-atbo-245208.jpg'} alt={c.name} className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                <div className="absolute top-4 right-4">
                                  <span className="text-[8px] font-black uppercase tracking-wider bg-padel-blue/80 text-white px-3 py-1 rounded-full">{c.sport}</span>
                                </div>
                                <div className="absolute bottom-6 left-6">
                                  <h4 className="text-xl font-display font-black text-white">{c.name}</h4>
                                  <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mt-1">{c.type} // {c.pricePerHour}€/h</p>
                                </div>
                              </div>
                            </div>
                          </PerspectiveCard>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                    <h2 className="text-2xl md:text-4xl font-display font-black uppercase tracking-tight">FORMATION <span className="text-padel-blue italic">SQUAD</span></h2>
                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">UNITÉS DE COMBAT</span>
                        <div className="flex gap-4">
                          {[2, 4].map(n => (
                            <button key={n} onClick={() => setBookingData({ ...bookingData, players: n })} className={cn("w-20 h-20 rounded-3xl border transition-all flex flex-col items-center justify-center gap-1", bookingData.players === n ? "bg-padel-blue border-padel-blue text-white shadow-xl" : "bg-white/5 border-white/5 text-white/30")}>
                              <span className="text-4xl font-display font-black">{n}</span>
                              <span className="text-[7px] font-black uppercase">PERS.</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">LOGISTIQUE ELITE</span>
                        <div className="space-y-3">
                          {['LOCATION RAQUETTE (+6€)', 'BALLES VENDÔME (+12€)'].map(o => (
                            <button key={o} className="w-full text-left p-4 glass rounded-2xl border border-white/5 text-[8px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">{o}</button>
                          ))}
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
                          <span className="text-white">{courts.find(c => c._id === bookingData.courtId)?.name}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-black text-white/30 uppercase tracking-widest pt-3 border-t border-white/5">
                          <span>TOTAL</span>
                          <span className="text-padel-blue text-lg">{calculateTotal()}€</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest leading-none">AES-256 SECURED</span>
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
              <div className="mt-12 flex justify-between items-center pt-8 border-t border-white/5 relative z-10">
                <button onClick={prevStep} disabled={currentStep === 0} className={cn("flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all", currentStep === 0 ? "opacity-0" : "text-white/20 hover:text-white")}>
                  <div className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center group-hover:bg-white/5"><ChevronLeft size={18} /></div>
                  RETOUR
                </button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={nextStep} disabled={!isStepComplete(currentStep)} className={cn("px-14 py-5 rounded-full font-black text-[10px] tracking-[0.3em] uppercase transition-all duration-500 relative overflow-hidden group/btn", isStepComplete(currentStep) ? "bg-padel-blue text-white shadow-2xl shadow-padel-blue/20" : "bg-white/5 text-white/10 cursor-not-allowed border border-white/5")}>
                  <span className="relative z-10 flex items-center gap-4 group-hover/btn:text-padel-blue transition-colors">
                    {currentStep === 5 ? "VALIDER ORDRE" : "SUIVANT"}
                    <ArrowUpRight size={18} />
                  </span>
                  {isStepComplete(currentStep) && <div className="absolute inset-0 bg-padel-yellow translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />}
                </motion.button>
              </div>
            )}

            {/* PROGRESS BAR BOTTOM */}
            {currentStep < 6 && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/[0.03]">
                <motion.div className="h-full bg-padel-blue shadow-[0_0_15px_rgba(19,73,211,1)]" initial={{ width: 0 }} animate={{ width: `${(currentStep / 5) * 100}%` }} transition={{ duration: 1 }} />
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
