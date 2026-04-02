import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Calendar as CalendarIcon, Clock, ArrowRight, CheckCircle2, ShieldCheck, Zap, ArrowUpRight, Loader2, CreditCard, User, Phone, Mail, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { PromoCodeInput } from '../player/PromoCodeInput';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { useNavigate } from 'react-router-dom';

const coaches = [
  { id: 1, name: "LUCAS MARTIN", role: "HEAD COACH", level: "EXPERT", rating: 4.9, image: "/IMAGES/ACTIVITIES - COACHING/pexels-atbo-245208.jpg", specialties: ["TECHNIQUE", "TACTIQUE"], exp: "12 ANS" },
  { id: 2, name: "SOPHIE BERNARD", role: "COACH SENIOR", level: "PRO", rating: 4.8, image: "/IMAGES/ACTIVITIES - COACHING/pexels-atbo-245208.jpg", specialties: ["INITIATION", "KIDS"], exp: "8 ANS" },
  { id: 3, name: "MARC LEFEBVRE", role: "COACH COMPETITION", level: "EXPERT", rating: 5.0, image: "/IMAGES/ACTIVITIES - COACHING/pexels-atbo-245208.jpg", specialties: ["PERFORM", "PHYSICAL"], exp: "15 ANS" },
];

export const CoachingBooking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCoach, setSelectedCoach] = useState<number | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    email: user?.email || '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00'
  });
  
  // Base price for coaching
  const basePrice = 50;
  const finalPrice = Math.max(0, basePrice - promoDiscount);

  const handleOpenModal = () => {
    if (!selectedCoach) return;
    setIsModalOpen(true);
    setBookingStatus('idle');
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus('submitting');
    const coach = coaches.find(c => c.id === selectedCoach);

    try {
      // 1. Create booking in backend
      // Note: We need a dummy courtId or handle coaching without court in backend
      // But for now, let's try to pass 'COACHING' type
      // We might need a generic court ID for coaching
      const res = await api.post('/bookings', {
        guestName: formData.name,
        guestPhone: formData.phone,
        guestEmail: formData.email,
        startTime: `${formData.date}T${formData.time}:00`,
        endTime: `${formData.date}T${formData.time}:00`,
        bookingType: 'COACHING',
        packName: `COACHING : ${coach?.name}`,
        totalPrice: finalPrice,
        // For now, let's assume court is mandatory in the model (line 29 in Booking.ts)
        // I should probably make court optional later, but for now I'll use a fixed ID if exists
        // Or I'll fix the model if I can
        court: '000000000000000000000000' // Placeholder if not found
      });

      const booking = res.data.data;

      // 2. Stripe Checkout
      const stripeRes = await api.post('/payments/create-checkout-session', {
        bookingId: booking._id,
        courtName: `Coaching avec ${coach?.name}`,
        amount: finalPrice,
        customerEmail: formData.email,
        successUrl: `${window.location.origin}/booking-success?session_id={CHECKOUT_SESSION_ID}` 
      });

      if (stripeRes.data.url) {
        window.location.href = stripeRes.data.url;
      } else {
        setBookingStatus('success');
      }
    } catch (err) {
      console.error('Coaching booking failed', err);
      setBookingStatus('error');
    }
  };

  return (
    <section id="coaching" className="relative py-24 md:py-48 px-6 bg-[#050505] overflow-hidden border-t border-white/[0.03]">
      {/* Editorial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[25%]" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white mr-[25%]" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-12 mb-20 md:mb-32">
          <div className="max-w-3xl text-center md:text-left">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-padel-blue" />
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">ACADEMY & COACHING</span>
            </div>
            <h3 className="text-4xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase">
              L'EXCELLENCE <br />
              <span className="text-white italic">SUR MESURE</span>
            </h3>
          </div>
          <div className="p-8 glass rounded-[2.5rem] border-white/5 bg-white/[0.01] flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-padel-blue/10 flex items-center justify-center text-padel-blue">
              <ShieldCheck size={28} />
            </div>
            <div>
              <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">COACHS CERTIFIÉS</p>
              <p className="text-lg font-display font-black text-white uppercase tracking-tight">LABEL ARENA PRO</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-24">
          {coaches.map((coach) => (
            <motion.div
              key={coach.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => setSelectedCoach(coach.id)}
              className={cn(
                "group relative glass rounded-[4rem] overflow-hidden border transition-all duration-700 cursor-pointer flex flex-col h-full bg-[#0F0F0F]",
                selectedCoach === coach.id ? "border-padel-blue ring-4 ring-padel-blue/10 scale-[1.02] shadow-3xl" : "border-white/5 hover:border-white/20"
              )}
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                <img src={coach.image} alt={coach.name} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent opacity-80" />

                <div className="absolute top-8 right-8 glass px-4 py-2 rounded-2xl flex items-center gap-3 border-white/10 z-20">
                  <Star size={14} className="text-padel-yellow fill-padel-yellow" />
                  <span className="text-xs font-black text-white">{coach.rating}</span>
                </div>

                <div className="absolute bottom-10 left-10 right-10 z-20">
                  <p className="text-[10px] font-black text-padel-blue uppercase tracking-[0.4em] mb-3 leading-none italic">{coach.role}</p>
                  <h4 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tighter leading-none mb-1 group-hover:text-padel-blue transition-colors">
                    {coach.name}
                  </h4>
                </div>
              </div>

              <div className="p-10 border-t border-white/5 flex flex-col flex-grow bg-white/[0.01]">
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/[0.03]">
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">XP ARENA</p>
                    <p className="text-sm font-black text-white">{coach.exp}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/[0.03]">
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">NIVEAU</p>
                    <p className="text-sm font-black text-padel-yellow">{coach.level}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-10">
                  {coach.specialties.map(s => (
                    <span key={s} className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-[9px] font-black text-white/40 uppercase tracking-widest">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  <button className={cn(
                    "w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-4 group/btn",
                    selectedCoach === coach.id ? "bg-padel-blue text-white shadow-xl" : "bg-white/5 text-white/40 group-hover:bg-white/10"
                  )}>
                    {selectedCoach === coach.id ? "COACH SÉLECTIONNÉ" : "SELECT COACHING"}
                    {selectedCoach === coach.id ? <CheckCircle2 size={18} /> : <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />}
                  </button>
                </div>
              </div>

              {/* Background decor */}
              <div className="absolute top-0 left-0 p-12 opacity-[0.02] text-[10rem] font-display font-black pointer-events-none -translate-x-12 -translate-y-12">
                {coach.name[0]}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Selected Coach Step (Booking) */}
        <AnimatePresence>
          {selectedCoach && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.98 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="relative glass p-12 md:p-20 rounded-[4rem] border-white/10 shadow-3xl bg-gradient-to-br from-padel-blue/20 to-transparent overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-20 opacity-[0.03] text-white rotate-12 z-0">
                <Clock size={300} />
              </div>

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
                <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-padel-blue text-white flex items-center justify-center shadow-3xl">
                    <Zap size={48} className="animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tighter mb-4">PERSONNALISEZ <br /><span className="text-padel-blue italic">VOTRE SESSION</span></h4>
                    <p className="text-sm md:text-lg text-white/40 font-medium max-w-xl leading-relaxed uppercase tracking-tighter">
                      CONFIGUREZ VOTRE PROGRAMME TECHNIQUE, LES MODALITÉS DE COACHING ET LES CRÉNEAUX DISPONIBLES.
                    </p>
                  </div>
                </div>

                {/* Ajout du code promo pour les cours */}
                <div className="w-full max-w-xs mx-auto mb-8">
                  <PromoCodeInput
                    applicationType="course"
                    onApply={(discount, code) => {
                      setPromoDiscount(discount);
                      setPromoCode(code);
                    }}
                  />
                  {promoDiscount > 0 && (
                    <div className="mt-2 text-green-400 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      Code appliqué : <span className="font-mono bg-green-500/10 px-2 py-1 rounded">{promoCode}</span> (-{promoDiscount}€)
                    </div>
                  )}
                  <div className="mt-2 text-white text-xs font-bold">
                    Prix final : <span className="font-mono bg-padel-blue/10 px-2 py-1 rounded">{finalPrice}€</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpenModal}
                  className="group relative px-14 py-8 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-[0.5em] shadow-3xl overflow-hidden transition-all"
                >
                  <span className="relative z-10 flex items-center gap-6 group-hover:text-white transition-colors">
                    RÉSERVER MA SESSION
                    <CalendarIcon size={20} />
                  </span>
                  <div className="absolute inset-0 bg-padel-blue translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Confirmation Coaching */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />
              <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="relative w-full max-w-xl bg-[#0A0A0A] border border-white/10 rounded-[3.5rem] overflow-hidden p-10 md:p-14">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-3 bg-white/5 rounded-2xl text-white/20 hover:text-white transition-all border border-white/10 z-50">
                  <X size={20} />
                </button>

                <div className="text-center space-y-4 mb-10">
                  <div className="inline-flex py-1 px-4 bg-padel-blue/10 border border-padel-blue/20 rounded-full">
                    <span className="text-[9px] font-black text-padel-blue tracking-[0.3em] uppercase">RÉSERVATION COACHING</span>
                  </div>
                  <h3 className="text-3xl font-display font-black text-white uppercase italic tracking-tighter leading-[0.9]">
                    SESSION AVEC <br /> <span className="text-padel-blue">{coaches.find(c => c.id === selectedCoach)?.name}</span>
                  </h3>
                </div>

                {bookingStatus === 'idle' && (
                  <form onSubmit={handleBookingSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="relative group">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-padel-blue transition-colors" size={18} />
                        <input required type="text" placeholder="NOM & PRÉNOM" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-xs font-black text-white focus:border-padel-blue outline-none transition-all uppercase tracking-widest" />
                      </div>
                      <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-padel-blue transition-colors" size={18} />
                        <input required type="email" placeholder="EMAIL" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-xs font-black text-white focus:border-padel-blue outline-none transition-all uppercase tracking-widest" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input required type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 text-[10px] font-black text-white focus:border-padel-blue [color-scheme:dark]" />
                        <input required type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 text-[10px] font-black text-white focus:border-padel-blue [color-scheme:dark]" />
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-4 px-6 py-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] relative overflow-hidden group mb-6">
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
                       <p className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-widest leading-relaxed text-center">
                         COÛT DE LA SESSION : <span className="text-white">{finalPrice}€</span>. REDIRECTION VERS <span className="text-white/40 font-bold italic">STRIPE</span>.
                       </p>
                    </div>

                    <button type="submit" className="w-full py-6 bg-padel-blue text-white rounded-full font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-padel-blue/30 hover:bg-padel-yellow hover:text-padel-blue transition-all">
                      PAYER VIA STRIPE
                    </button>
                  </form>
                )}

                {bookingStatus === 'submitting' && (
                  <div className="py-20 flex flex-col items-center gap-6">
                    <Loader2 className="w-12 h-12 animate-spin text-padel-blue" />
                    <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Synchronisation...</p>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-10 right-10 text-[15rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-0 leading-none uppercase">
        COACHING
      </div>
    </section>
  );
};
