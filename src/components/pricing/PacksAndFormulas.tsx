import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Target, Trophy, Users, Heart, Building2, ArrowUpRight, Plus, Sparkles, Loader2, X, CheckCircle2, Phone, Mail, User, CreditCard, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

interface IPack {
  _id: string;
  title: string;
  price: string;
  description: string;
  icon?: string;
  color?: string;
  bg?: string;
}

const IconMap: Record<string, React.ReactNode> = {
  Target: <Target size={24} />,
  Trophy: <Trophy size={24} />,
  Heart: <Heart size={24} />,
  Users: <Users size={24} />,
  Building2: <Building2 size={24} />
};

const ColorMap: Record<string, string> = {
  Target: "text-emerald-500",
  Trophy: "text-padel-blue",
  Heart: "text-pink-500",
  Users: "text-orange-500",
  Building2: "text-purple-500"
};

const BgMap: Record<string, string> = {
  Target: "bg-emerald-500/5",
  Trophy: "bg-padel-blue/5",
  Heart: "bg-pink-500/5",
  Users: "bg-orange-500/5",
  Building2: "bg-purple-500/5"
};

export const PacksAndFormulas = () => {
  const navigate = useNavigate();
  const [packs, setPacks] = useState<IPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [selectedPack, setSelectedPack] = useState<IPack | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'STRIPE' | 'WALLET'>('STRIPE');
  const { user, refreshUser } = useAuth();

  // Derived price for the currently selected pack (used in JSX for wallet button check)
  const priceValue = parseFloat(selectedPack?.price || '0') || 0;

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const res = await api.get('/pricing?type=pack');
        if (res.data.success) setPacks(res.data.data);
      } catch (err) {
        console.error('Failed to fetch packs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPacks();
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, offsetWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / offsetWidth);
      setActiveIndex(index);
    }
  };

  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * scrollRef.current.offsetWidth,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  const handleOpenModal = (pack: IPack) => {
    setSelectedPack(pack);
    setIsModalOpen(true);
    setBookingStatus('idle');
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || ''
    });
    setPaymentMethod('STRIPE');
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus('submitting');

    try {
      const priceValue = parseFloat(selectedPack?.price || '0');
      const now = new Date();
      
      // Generate local format strings to avoid timezone shifts
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');

      const res = await api.post('/bookings', {
        guestName: formData.name,
        guestPhone: formData.phone,
        guestEmail: formData.email,
        startTime: now.toISOString(),
        endTime: now.toISOString(),
        timeStr: `${hours}:${minutes}`,
        dateStr: `${day}/${month}/${year}`,
        bookingType: 'PACK',
        packName: selectedPack?.title,
        players: 4,
        totalPrice: isNaN(priceValue) ? 0 : priceValue
      });

      const booking = res.data.data;

      // 2. PAYMENT HANDLING
      if (!isNaN(priceValue) && priceValue > 0) {
        if (paymentMethod === 'WALLET') {
          // Pay with Wallet
          const walletRes = await api.post('/payments/pay-with-wallet', {
            bookingId: booking._id
          });
          if (walletRes.data.success) {
            await refreshUser();
            setBookingStatus('success');
            return;
          }
        } else {
          // Pay with Stripe
          const stripeRes = await api.post('/payments/create-checkout-session', {
            bookingId: booking._id,
            courtName: `PACK : ${selectedPack?.title}`,
            amount: priceValue,
            customerEmail: formData.email,
            successUrl: `${window.location.origin}/booking-success?session_id={CHECKOUT_SESSION_ID}` 
          });

          if (stripeRes.data.url) {
            window.location.href = stripeRes.data.url;
            return;
          }
        }
      }

      // 3. Fallback for manual or DEVIS
      await api.post('/messages', {
        senderName: formData.name,
        senderEmail: formData.email,
        subject: `DEMANDE DE PACK : ${selectedPack?.title}`,
        content: `Nouvelle demande de pack .\n\nClient: ${formData.name}\nTéléphone: ${formData.phone}\nEmail: ${formData.email}\nPack Sélectionné: ${selectedPack?.title}\nPrix: ${selectedPack?.price}€\nDate souhaitée: ${formData.date}\nHeure souhaitée: ${formData.time}`
      });

      setBookingStatus('success');
    } catch (err) {
      console.error('Failed to send pack request', err);
      setBookingStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center bg-[#050505]">
        <Loader2 className="w-8 h-8 animate-spin text-padel-blue" />
      </div>
    );
  }

  if (packs.length === 0) return null;

  return (
    <section id="packs" className="relative py-24 md:py-24 px-6 bg-[#050505] overflow-hidden border-t border-white/[0.03]">
      {/* Decorative text background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] md:text-[25rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-0 leading-none uppercase">
        SPECIALS
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-12 mb-20 md:mb-32 text-center md:text-left">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-4 mb-8">
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">PACKS & FORMULES</span>
            </div>
            <h3 className="text-4xl sm:text-5xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase">
              VIVEZ L'EXPÉRIENCE <br />
              <span className="text-white italic">SUR MESURE</span>
            </h3>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 rounded-full border border-padel-blue/20 flex items-center justify-center text-padel-blue animate-spin-slow">
              <Sparkles size={32} />
            </div>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-10 lg:pb-12 items-stretch"
          >
            {packs.map((pack, i) => {
              const iconKey = pack.icon || 'Target';
              const colorClass = ColorMap[iconKey] || "text-padel-blue";
              const bgClass = BgMap[iconKey] || "bg-padel-blue/5";

              return (
                <motion.div
                  key={pack._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="min-w-[85vw] sm:min-w-[350px] md:min-w-[450px] snap-center group relative glass p-10 md:p-14 rounded-[4rem] border-white/5 hover:border-padel-blue/20 transition-all duration-700 flex flex-col h-full overflow-hidden"
                >
                  <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000", bgClass)} />

                  <div className="flex justify-between items-start mb-14 h-14 shrink-0">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500", bgClass, colorClass)}>
                      {IconMap[iconKey] || <Target size={24} />}
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">PRIX PACK</p>
                      <div className="text-3xl md:text-5xl font-display font-black text-white group-hover:text-padel-blue transition-colors leading-none">
                        {pack.price}<span className="text-sm italic ml-1 font-light opacity-50">{!pack.price.includes('€') && pack.price !== 'DEVIS' && '€'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center flex-grow">
                    <div className="min-h-[80px] flex items-center justify-center w-full mb-6">
                      <h4 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tight group-hover:text-padel-blue transition-colors leading-[1.1]">
                        {pack.title}
                      </h4>
                    </div>

                    <div className="min-h-[100px] flex items-start justify-center w-full mb-10 text-center">
                      <p className="text-sm md:text-base text-white/30 font-medium leading-relaxed max-w-[320px]">
                        {pack.description}
                      </p>
                    </div>

                    <div className="min-h-[120px] w-full flex flex-col items-center justify-center mb-10">
                      <ul className="space-y-4 text-left">
                        {["Avantage immédiat", "Session incluse", "Accès prioritaire"].map((inc, j) => (
                          <li key={j} className="flex items-center gap-3">
                            <Plus size={12} className="text-padel-blue" />
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest leading-none whitespace-nowrap">{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenModal(pack)}
                    className="mt-auto w-full py-5 bg-white/[0.03] border border-white/10 text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-padel-blue hover:text-white hover:border-padel-blue transition-all flex items-center justify-center gap-4 group/btn shadow-xl shrink-0"
                  >
                    DÉCOUVRIR LE PACK
                    <ArrowUpRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-3 mt-8">
            {packs.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={cn(
                  "h-1.5 transition-all duration-500 rounded-full",
                  activeIndex === i ? "w-8 bg-padel-blue" : "w-1.5 bg-white/10"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Reservation Modal for Packs */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-xl bg-[#0A0A0A] border border-white/10 rounded-[3.5rem] overflow-hidden"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 p-3 bg-white/5 rounded-2xl text-white/20 hover:text-white transition-all border border-white/10 z-50"
              >
                <X size={20} />
              </button>

              <div className="p-10 md:p-14 space-y-10 relative z-10">
                <div className="text-center space-y-4">
                  <div className="inline-flex py-1 px-4 bg-padel-blue/10 border border-padel-blue/20 rounded-full">
                    <span className="text-[9px] font-black text-padel-blue tracking-[0.3em] uppercase">RÉSERVATION PACK</span>
                  </div>
                  <h3 className="text-4xl font-display font-black text-white uppercase italic tracking-tighter leading-[0.9]">
                    Optez pour le  <br /> <span className="text-padel-blue">{selectedPack?.title}</span>
                  </h3>
                  <p className="text-xs text-white/30 font-medium uppercase tracking-[0.2em] max-w-sm mx-auto">
                    {selectedPack?.price === 'DEVIS' 
                      ? "Demandez votre devis sur mesure." 
                      : "Accédez instantanément à vos avantages après paiement."}
                  </p>
                </div>

                {bookingStatus === 'idle' && (
                  <form onSubmit={handleBookingSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="relative group">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-padel-blue transition-colors" size={18} />
                        <input
                          required
                          type="text"
                          placeholder="NOM & PRÉNOM"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-xs font-black text-white focus:border-padel-blue outline-none transition-all uppercase tracking-widest placeholder:text-white/10"
                        />
                      </div>
                      <div className="relative group">
                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-padel-blue transition-colors" size={18} />
                        <input
                          required
                          type="tel"
                          placeholder="NUMÉRO DE TÉLÉPHONE"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-xs font-black text-white focus:border-padel-blue outline-none transition-all uppercase tracking-widest placeholder:text-white/10"
                        />
                      </div>
                      <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-padel-blue transition-colors" size={18} />
                        <input
                          required
                          type="email"
                          placeholder="ADRESSE EMAIL"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-xs font-black text-white focus:border-padel-blue outline-none transition-all uppercase tracking-widest placeholder:text-white/10"
                        />
                      </div>


                    </div>

                    {selectedPack?.price !== 'DEVIS' && (
                       <div className="space-y-4 mb-6">
                         <div className="text-[9px] font-black text-white/20 uppercase tracking-widest text-left">Mode de paiement</div>
                         <div className="grid grid-cols-2 gap-3">
                           <button 
                             type="button"
                             onClick={() => setPaymentMethod('STRIPE')}
                             className={cn(
                               "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all",
                               paymentMethod === 'STRIPE' ? "bg-padel-blue border-padel-blue text-white shadow-lg" : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                             )}
                           >
                             <CreditCard size={18} />
                             <span className="text-[8px] font-black uppercase">CARTE</span>
                           </button>
                           
                           <button 
                             type="button"
                             disabled={!user || (user.balance || 0) < priceValue}
                             onClick={() => setPaymentMethod('WALLET')}
                             className={cn(
                               "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all relative overflow-hidden",
                               paymentMethod === 'WALLET' ? "bg-padel-blue border-padel-blue text-white shadow-lg" : "bg-white/5 border-white/10 text-white/40 hover:border-white/20",
                               (!user || (user.balance || 0) < priceValue) && "opacity-40 cursor-not-allowed grayscale"
                             )}
                           >
                             <Zap size={18} />
                             <span className="text-[8px] font-black uppercase">SOLDE</span>
                             <span className="text-[7px] font-black opacity-60">{user?.balance || 0}€</span>
                           </button>
                         </div>

                         {paymentMethod === 'STRIPE' ? (
                           <div className="flex flex-col items-center gap-4 px-6 py-6 bg-white/[0.02] border border-white/5 rounded-[2rem] relative overflow-hidden group">
                                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12 transition-transform group-hover:rotate-0">
                                    <CreditCard size={40} />
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-padel-blue flex items-center justify-center text-white shadow-lg shadow-padel-blue/20">
                                      <CreditCard size={14} />
                                    </div>
                                    <div className="text-left">
                                      <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">Stripe Connect</p>
                                      <p className="text-[8px] font-black text-padel-blue uppercase tracking-[0.2em] leading-none">100% SÉCURISÉ</p>
                                    </div>
                                  </div>
                                  <p className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-widest leading-relaxed text-center">
                                    VOUS ALLEZ ÊTRE REDIRIGÉ VERS <span className="text-white/40">STRIPE</span>.
                                  </p>
                           </div>
                         ) : (
                           <div className="flex flex-col items-center gap-4 px-6 py-6 bg-padel-blue/10 border border-padel-blue/20 rounded-[2rem] relative overflow-hidden group">
                               <div className="absolute top-0 right-0 p-4 opacity-[0.05] rotate-12">
                                 <Zap size={40} className="text-padel-blue" />
                               </div>
                               <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-padel-blue flex items-center justify-center text-white shadow-lg">
                                   <Zap size={14} />
                                 </div>
                                 <div className="text-left">
                                   <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">Arena Balance</p>
                                   <p className="text-[8px] font-black text-padel-blue uppercase tracking-[0.2em] leading-none">PAIEMENT IMMÉDIAT</p>
                                 </div>
                               </div>
                               <p className="text-[8px] md:text-[9px] font-black text-white/60 uppercase tracking-widest leading-relaxed text-center">
                                 LE MONTANT SERA DÉDUIT DE VOTRE PORTEFEUILLE.
                               </p>
                           </div>
                         )}
                       </div>
                    )}
                    <button
                      type="submit"
                      disabled={bookingStatus === 'submitting'}
                      className="w-full py-6 bg-padel-blue text-white rounded-full font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-padel-blue/30 hover:bg-padel-yellow hover:text-padel-blue transition-all"
                    >
                      {bookingStatus === 'submitting' ? <Loader2 className="animate-spin mx-auto" size={16} /> : (selectedPack?.price === 'DEVIS' ? 'ENVOYER MA DEMANDE' : (paymentMethod === 'WALLET' ? 'VALIDER AVEC MON SOLDE' : 'PAYER VIA STRIPE'))}
                    </button>
                  </form>
                )}

                {bookingStatus === 'submitting' && (
                  <div className="py-20 flex flex-col items-center gap-6">
                    <Loader2 className="w-12 h-12 animate-spin text-padel-blue" />
                    <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Transmission en cours...</p>
                  </div>
                )}

                {bookingStatus === 'success' && (
                  <div className="py-10 text-center space-y-8">
                    <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-500 border border-emerald-500/20">
                      <CheckCircle2 size={40} />
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-2xl font-display font-black text-white uppercase">Demande Reçue !</h4>
                      <p className="text-xs text-white/30 font-medium uppercase tracking-widest leading-relaxed">
                        Un conseiller Arena reviendra vers vous sous 24h pour activer votre pack.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="w-full py-6 bg-white/5 border border-white/10 text-white rounded-full font-black text-[11px] uppercase tracking-[0.4em] hover:bg-white/10 transition-all"
                    >
                      FERMER
                    </button>
                  </div>
                )}
              </div>

              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-padel-blue/5 blur-[120px] -z-10" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
