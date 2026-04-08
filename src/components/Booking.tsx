import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Clock, Users, ChevronRight, CheckCircle2, MapPin, ArrowRight, Zap, AlertCircle, Loader2, User as UserIcon, Mail, Phone, Sparkles, Target, CreditCard } from 'lucide-react';
import { cn } from '../lib/utils';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

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

export const Booking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
  });
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);
  const [players, setPlayers] = useState(4);
  const [duration, setDuration] = useState(90); // minutes

  // Guest Info
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  const [selectedSport, setSelectedSport] = useState<'Padel' | 'Pickleball' | 'Badminton' | 'Basket' | 'Golf'>('Padel');

  // Handle sport from query param (works for both navigation and same-page hash links)
  useEffect(() => {
    // Try searchParams first, then fall back to raw window.location.search
    const raw = searchParams.get('sport') || new URLSearchParams(window.location.search).get('sport');
    if (raw) {
      // Capitalize first letter only (backend expects: Padel, Pickleball, Basket, Golf, Badminton)
      const formatted = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
      if (['Padel', 'Pickleball', 'Badminton', 'Basket', 'Golf'].includes(formatted)) {
        setSelectedSport(formatted as any);
      }
    }
    // Scroll to section only when hash is #club
    if (window.location.hash === '#club') {
      setTimeout(() => {
        const element = document.getElementById('club');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [searchParams]);

  const [availability, setAvailability] = useState<CourtAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fill if user is logged in
  useEffect(() => {
    if (user) {
      setGuestName(user.name);
      setGuestEmail(user.email);
    }
  }, [user]);

  // Fetch availability when date or sport changes
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await api.get('/bookings/available-slots', {
          params: {
            sport: selectedSport,
            date: selectedDate
          }
        });
        if (res.data.success) {
          setAvailability(res.data.data);
          setSelectedTime(null);
          setSelectedCourtId(null);
        }
      } catch (err: any) {
        console.error('Failed to fetch availability', err);
        setError('Impossible de charger les disponibilités.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, [selectedDate, selectedSport]);

  const timeSlots = useMemo(() => {
    const slotsMap = new Map<string, boolean>();
    const now = new Date();
    
    // Format today as YYYY-MM-DD in local time
    const todayStr = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0')
    ].join('-');
    
    const isToday = selectedDate === todayStr;

    availability.forEach(court => {
      court.slots.forEach(slot => {
        let isAvailable = slot.available;
        
        // If it's today, check if the slot is in the past
        if (isToday && isAvailable) {
          const [hours, minutes] = slot.time.split(':').map(Number);
          const slotTime = new Date();
          slotTime.setHours(hours, minutes, 0, 0);
          
          // Use a small buffer if needed, but here we strictly follow "past hours"
          // We compare the slot time with the current time
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
  }, [availability, selectedDate]);

  const availableCourts = useMemo(() => {
    if (!selectedTime) return [];
    return availability.filter(court =>
      court.slots.find(s => s.time === selectedTime && s.available)
    );
  }, [selectedTime, availability]);

  const calculateTotal = () => {
    if (!selectedCourtId || !selectedTime) return 0;
    const court = availability.find(c => c.courtId === selectedCourtId);
    if (!court) return 0;
    const slot = court.slots.find(s => s.time === selectedTime);
    const basePrice = slot ? slot.price : 0;
    return (basePrice * (duration / 90));
  };

  const handleNextStep = async () => {
    if (step === 1) {
      if (!selectedTime) {
        setError("Veuillez sélectionner un créneau");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedCourtId) {
        setError("Veuillez sélectionner un terrain");
        return;
      }

      // Check Guest Info
      if (!guestName || !guestEmail) {
        setError("Veuillez remplir vos informations de contact");
        return;
      }

      // Final step: Try to book
      try {
        setIsBooking(true);
        setError(null);

        const startTime = new Date(`${selectedDate}T${selectedTime}:00`);
        const endTime = new Date(startTime.getTime() + duration * 60000);

        const response = await api.post('/bookings', {
          courtId: selectedCourtId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          guestName,
          guestEmail,
          guestPhone,
          players,
          userId: user?._id
        });

        if (response.data.success) {
          const bookingId = response.data.data._id;
          
          // Create Stripe Checkout Session
          const totalAmount = calculateTotal();
          const court = availability.find(c => c.courtId === selectedCourtId);

          const stripeRes = await api.post('/payments/create-checkout-session', {
            bookingId: bookingId,
            courtName: court?.courtName || 'Terrain de Padel',
            amount: totalAmount,
            customerEmail: guestEmail,
            successUrl: `${window.location.origin}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: window.location.href
          });

          if (stripeRes.data.url) {
            // Redirect to Stripe
            window.location.href = stripeRes.data.url;
          } else {
            setStep(3);
          }
        }
      } catch (err: any) {
        console.error('Booking/Payment failed', err);
        setError(err.response?.data?.message || 'La réservation a échoué. Ce créneau est peut-être déjà pris.');
      } finally {
        setIsBooking(false);
      }
    }
  };

  const prevStep = () => {
    setError(null);
    setStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <section id="club" className="relative py-24 md:py-24 px-6 overflow-hidden bg-dark-bg">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[25%]" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white mr-[25%]" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 xl:gap-24 items-start">

          {/* Left Content */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="inline-flex items-center gap-4 mb-8">
                <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">RÉSERVATION LIVE</span>
              </div>

              <h2 className="text-5xl md:text-7xl xl:text-8xl font-display font-black mb-8 leading-[0.9] tracking-tighter uppercase">
                DOMINEZ <br />
                <span className="text-padel-blue italic">L'ARÈNE</span>
              </h2>

              <p className="text-base md:text-lg text-white/40 mb-12 font-medium leading-relaxed max-w-md">
                Accédez à nos terrains de classe mondiale. Notre système de réservation temps réel vous garantit une place au cœur de l'action.
              </p>

              <div className="hidden lg:block glass p-8 rounded-[2rem] border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-padel-blue/20 flex items-center justify-center text-padel-blue">
                    <Zap size={20} />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-widest">Disponibilité Immédiate</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black tracking-widest uppercase">
                    <span className="text-white/20">Aujourd'hui</span>
                    <span className="text-padel-yellow">{timeSlots.filter(s => s.available).length} Créneaux Libres</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-padel-blue transition-all duration-1000"
                      style={{ width: `${(timeSlots.filter(s => s.available).length / 20) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="glass rounded-[2.5rem] md:rounded-[4rem] border-white/10 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.4)]"
            >
              <div className="px-8 md:px-12 py-8 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
                <div className="flex gap-4">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={cn(
                        "h-1 rounded-full transition-all duration-700",
                        step === s ? "w-12 bg-padel-yellow" : "w-4 bg-white/10",
                        step > s && "bg-padel-blue"
                      )}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">ÉTAPE 0{step} / 03</span>
              </div>

              <div className="p-8 md:p-14 min-h-[500px] flex flex-col">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-12 flex-grow"
                    >
                      <section>
                        <h4 className="text-sm font-black tracking-[0.2em] uppercase text-white/20 mb-8 flex items-center gap-3">
                          <Target size={14} className="text-padel-blue" /> 01. SÉLECTION DU SPORT
                        </h4>
                        <div className="flex flex-wrap gap-4 mb-10">
                          {['Padel', 'Pickleball', 'Badminton', 'Basket', 'Golf'].map((sport) => (
                            <button
                              key={sport}
                              onClick={() => setSelectedSport(sport as any)}
                              className={cn(
                                "px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                                selectedSport === sport
                                  ? "bg-padel-blue text-white shadow-[0_0_20px_rgba(19,73,211,0.4)]"
                                  : "bg-white/5 text-white/40 border border-white/5 hover:bg-white/10"
                              )}
                            >
                              {sport}
                            </button>
                          ))}
                        </div>

                        <h4 className="text-sm font-black tracking-[0.2em] uppercase text-white/20 mb-8 flex items-center gap-3">
                          <CalendarIcon size={14} className="text-padel-blue" /> 02. SÉLECTION DE LA DATE
                        </h4>
                        <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                          {[...Array(7)].map((_, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() + i);
                            const dateStr = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
                            const isSelected = selectedDate === dateStr;
                            return (
                              <button
                                key={i}
                                onClick={() => setSelectedDate(dateStr)}
                                className={cn(
                                  "flex flex-col items-center py-5 rounded-2xl transition-all duration-500",
                                  isSelected ? "bg-padel-blue text-white shadow-xl" : "bg-white/5 hover:bg-white/10 text-white/40"
                                )}
                              >
                                <span className="text-[9px] uppercase font-black mb-1">{date.toLocaleDateString('fr-FR', { weekday: 'short' })}</span>
                                <span className="text-xl font-display font-black">{date.getDate()}</span>
                              </button>
                            );
                          })}
                        </div>
                      </section>

                      <section>
                        <h4 className="text-sm font-black tracking-[0.2em] uppercase text-white/20 mb-8 flex items-center gap-3">
                          <Clock size={14} className="text-padel-blue" /> 02. CHOIX DU CRÉNEAU
                        </h4>
                        {isLoading ? (
                          <div className="flex items-center justify-center h-24">
                            <Loader2 className="animate-spin text-padel-blue" />
                          </div>
                        ) : timeSlots.length > 0 ? (
                          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                            {timeSlots.map((slot) => (
                              <button
                                key={slot.time}
                                disabled={!slot.available}
                                onClick={() => {
                                  setSelectedTime(slot.time);
                                  setError(null);
                                }}
                                className={cn(
                                  "py-4 rounded-xl font-black text-xs transition-all duration-300",
                                  selectedTime === slot.time
                                    ? "bg-padel-yellow text-black scale-105"
                                    : slot.available 
                                      ? "bg-white/5 hover:bg-white/10 text-white/40"
                                      : "bg-white/[0.02] text-white/5 cursor-not-allowed border-dashed border border-white/5"
                                )}
                              >
                                {slot.time}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-10 text-white/20 text-xs font-black uppercase tracking-widest border border-white/5 rounded-2xl">
                            Aucun créneau disponible pour cette date
                          </div>
                        )}
                      </section>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-10 flex-grow"
                    >
                      {/* Guest Info Section */}
                      <section className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-padel-blue flex items-center gap-3">
                            <UserIcon size={14} /> Informations de contact
                          </h4>
                          {user && (
                            <span className="text-[8px] font-black uppercase bg-padel-blue/20 text-padel-blue px-2 py-1 rounded-full flex items-center gap-1">
                              <Sparkles size={8} /> Compte Connecté
                            </span>
                          )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[8px] font-black uppercase text-white/20 tracking-widest ml-1">Nom complet</label>
                            <div className="relative">
                              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                              <input
                                type="text"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                placeholder="JEAN DUPONT"
                                disabled={!!user}
                                className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs font-bold text-white uppercase placeholder:text-white/10 focus:outline-none focus:border-padel-blue/50 transition-all disabled:opacity-50"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[8px] font-black uppercase text-white/20 tracking-widest ml-1">Email</label>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                              <input
                                type="email"
                                value={guestEmail}
                                onChange={(e) => setGuestEmail(e.target.value)}
                                placeholder="JEAN@EXAMPLE.COM"
                                disabled={!!user}
                                className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs font-bold text-white uppercase placeholder:text-white/10 focus:outline-none focus:border-padel-blue/50 transition-all disabled:opacity-50"
                              />
                            </div>
                          </div>
                        </div>
                      </section>

                      <section>
                        <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-white/20 mb-6 flex items-center gap-3">
                          <MapPin size={14} className="text-padel-blue" /> 03. CHOIX DU TERRAIN
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {availableCourts.map((court) => (
                            <button
                              key={court.courtId}
                              onClick={() => {
                                setSelectedCourtId(court.courtId);
                                setError(null);
                              }}
                              className={cn(
                                "p-6 rounded-3xl border transition-all duration-500 text-left relative overflow-hidden group",
                                selectedCourtId === court.courtId
                                  ? "bg-padel-blue/10 border-padel-blue"
                                  : "bg-white/5 border-white/5 hover:border-white/20"
                              )}
                            >
                              <div className="flex justify-between items-start mb-4">
                                <span className="text-[9px] font-black text-padel-blue tracking-widest uppercase">{court.type}</span>
                                <span className="text-lg font-black text-white">
                                  {((court.slots.find(s => s.time === selectedTime)?.price || 0) * (duration / 90)).toFixed(2)}€
                                </span>
                              </div>
                              <h5 className="text-xl font-display font-black text-white mb-1 uppercase">{court.courtName}</h5>
                              <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Gazon WPT • LED Pro</p>

                              {selectedCourtId === court.courtId && (
                                <div className="absolute top-0 right-0 p-2">
                                  <div className="w-2 h-2 rounded-full bg-padel-blue" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </section>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="bg-white/5 p-6 rounded-3xl">
                          <h5 className="text-[10px] font-black tracking-widest text-white/30 mb-4 uppercase">Joueurs</h5>
                          <div className="flex gap-4">
                            {[2, 4].map(n => (
                              <button
                                key={n}
                                onClick={() => setPlayers(n)}
                                className={cn(
                                  "flex-1 py-3 rounded-xl font-black text-xs transition-all",
                                  players === n ? "bg-padel-blue text-white" : "bg-white/5 hover:bg-white/10"
                                )}
                              >
                                {n} PERS.
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white/5 p-6 rounded-3xl">
                          <h5 className="text-[10px] font-black tracking-widest text-white/30 mb-4 uppercase">Durée</h5>
                          <div className="flex gap-4">
                            {[60, 90].map(d => (
                              <button
                                key={d}
                                onClick={() => setDuration(d)}
                                className={cn(
                                  "flex-1 py-3 rounded-xl font-black text-xs transition-all",
                                  duration === d ? "bg-padel-blue text-white" : "bg-white/5 hover:bg-white/10"
                                )}
                              >
                                {d} MIN
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-10 flex-grow flex flex-col items-center justify-center"
                    >
                      <div className="w-24 h-24 bg-padel-yellow rounded-full flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(255,210,31,0.3)]">
                        <CheckCircle2 size={48} className="text-black" />
                      </div>
                      <h4 className="text-4xl md:text-5xl font-display font-black mb-4 tracking-tighter uppercase">RÈGLEMENT CONFIRMÉ</h4>
                      <p className="text-sm text-white/30 mb-12 max-w-xs mx-auto font-medium leading-relaxed">
                        Votre créneau est désormais réservé. Le code d'accès sera envoyé à l'adresse <strong>{guestEmail.toUpperCase()}</strong>.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {step === 2 && (
                  <div className="mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col items-center text-center gap-4 relative overflow-hidden group">
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
                     <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] leading-relaxed max-w-xs">
                       VOUS ALLEZ ÊTRE REDIRIGÉ VERS LA PLATEFORME SÉCURISÉE DE PAIEMENT <span className="text-white/40">STRIPE</span> POUR FINALISER VOTRE RÉSERVERATION.
                     </p>
                  </div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
                  >
                    <AlertCircle size={14} />
                    {error}
                  </motion.div>
                )}

                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                  {step < 3 ? (
                    <>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Total Estimé</span>
                        <div className="text-3xl font-display font-black text-white">{calculateTotal().toFixed(2)}€</div>
                      </div>
                      <div className="flex gap-4 w-full sm:w-auto">
                        {step > 1 && (
                          <button
                            onClick={prevStep}
                            className="flex-1 sm:flex-none px-8 py-4 rounded-2xl bg-white/5 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                          >
                            RETOUR
                          </button>
                        )}
                        <button
                          onClick={handleNextStep}
                          disabled={(step === 1 && !selectedTime) || isBooking}
                          className={cn(
                            "flex-1 sm:flex-none px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all",
                            (selectedTime || step > 1) && !isBooking ? "bg-padel-blue text-white hover:scale-105" : "bg-white/5 text-white/20 cursor-not-allowed"
                          )}
                        >
                          {isBooking ? (
                            <>TRAITEMENT... <Loader2 size={14} className="animate-spin" /></>
                          ) : (
                            <>{step === 2 ? 'CONFIRMER' : 'ÉTAPE SUIVANTE'} <ArrowRight size={14} /></>
                          )}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                      <button
                        onClick={() => setStep(1)}
                        className="flex-1 py-5 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-padel-yellow transition-all"
                      >
                        NOUVELLE RÉSERVATION
                      </button>
                      <button
                        onClick={() => navigate(user ? '/dashboard' : '/')}
                        className="flex-1 py-5 rounded-2xl bg-padel-blue text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all"
                      >
                        {user ? 'MON TABLEAU DE BORD' : 'RETOUR À L\'ACCUEIL'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute -top-20 -right-20 text-[15rem] font-display font-black text-white/[0.01] select-none pointer-events-none -z-10 uppercase">
        BOOKING
      </div>
    </section>
  );
};
