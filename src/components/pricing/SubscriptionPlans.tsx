import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Check, ArrowUpRight, Star, Zap, Trophy, Loader2, Target, Heart, Users, Building2, X, ShieldCheck, Sparkles, Phone, Mail, User, CalendarDays, Clock, CreditCard } from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';

interface IPlan {
  _id: string;
  title: string;
  price: string;
  annualPrice?: string;
  icon?: string;
  color?: string;
  accent?: string;
  featured: boolean;
  features: string[];
}

const IconMap: Record<string, React.ReactNode> = {
  Zap: <Zap size={24} />,
  Star: <Star size={24} />,
  Trophy: <Trophy size={24} />,
  Target: <Target size={24} />,
  Heart: <Heart size={24} />,
  Users: <Users size={24} />,
  Building2: <Building2 size={24} />
};

export const SubscriptionPlans = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [dbPlans, setDbPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAnnual, setIsAnnual] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [currentUserSub, setCurrentUserSub] = useState<any>(null);
  const [modal, setModal] = useState<{ 
    isOpen: boolean, 
    type: 'success' | 'confirm' | 'error', 
    plan?: any, 
    message?: string,
    needsSwitchConfirmation?: boolean, // Special flag for the switch alert
    existingPlanName?: string
  }>({
    isOpen: false,
    type: 'confirm'
  });
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pricingRes, dbSubsRes, userSubRes] = await Promise.all([
          api.get('/pricing?type=subscription'),
          api.get('/subscriptions/plans'),
          isAuthenticated ? api.get('/subscriptions/my-subscription') : Promise.resolve({ data: { data: null } })
        ]);
        if (pricingRes.data.success) setPlans(pricingRes.data.data);
        if (dbSubsRes.data.success) setDbPlans(dbSubsRes.data.data);
        if (isAuthenticated && userSubRes.data.success) {
          setCurrentUserSub(userSubRes.data.data.subscription);
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const handleUpdate = () => fetchData();
    window.addEventListener('subscription-updated', handleUpdate);
    return () => window.removeEventListener('subscription-updated', handleUpdate);
  }, [isAuthenticated]);

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

  const findDbPlan = (pricingName: string, annual: boolean) => {
    const duration = annual ? 12 : 1;
    return dbPlans.find(p => p.name.toUpperCase() === pricingName.toUpperCase() && p.durationInMonths === duration);
  };

  const handleSubscribeClick = (plan: IPlan) => {
    const dbPlan = findDbPlan(plan.title, isAnnual);
    if (!dbPlan) {
      setModal({ isOpen: true, type: 'error', message: "Ce plan n'est pas disponible pour le moment." });
      return;
    }
    setFormData({
      name: user?.name || '',
      phone: '',
      email: user?.email || ''
    });
    setModal({ isOpen: true, type: 'confirm', plan: dbPlan, needsSwitchConfirmation: false });
  };

  const confirmSubscription = async (forceSwitch = false) => {
    if (!modal.plan) return;
    setSubmitting(modal.plan._id);
    try {
      // Security Check: If not forced yet, check if email has a subscription
      if (!forceSwitch) {
        const checkRes = await api.post('/subscriptions/check-email', { email: formData.email });
        if (checkRes.data.hasSubscription) {
          setModal({ 
            ...modal, 
            isOpen: true, 
            needsSwitchConfirmation: true, 
            existingPlanName: checkRes.data.planName 
          });
          setSubmitting(null);
          return; // Stop here to show the warning
        }
      }

      const amount = isAnnual ? (modal.plan.price * 12 * 0.8) : modal.plan.price;
      const isQuote = isNaN(parseFloat(amount.toString())) || parseFloat(amount.toString()) === 0;

      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');

      // 1. Create a Booking Request
      const res = await api.post('/bookings', {
        guestName: formData.name,
        guestEmail: formData.email,
        guestPhone: formData.phone,
        startTime: now.toISOString(),
        endTime: now.toISOString(),
        timeStr: `${hours}:${minutes}`,
        dateStr: `${day}/${month}/${year}`,
        bookingType: 'SUBSCRIPTION',
        packName: modal.plan.name,
        subscription: modal.plan._id,
        totalPrice: isQuote ? 0 : parseFloat(amount.toString())
      });

      const booking = res.data.data;

      if (isQuote) {
        setModal({ isOpen: true, type: 'success', message: 'Votre demande de devis a été envoyée avec succès. Notre équipe vous contactera rapidement.' });
        return;
      }

      // 2. Create Stripe Checkout Session
      const stripeRes = await api.post('/payments/create-checkout-session', {
        bookingId: booking._id,
        courtName: `Abonnement : ${modal.plan.name}`,
        amount: parseFloat(amount.toString()),
        customerEmail: formData.email,
        successUrl: `${window.location.origin}/booking-success?session_id={CHECKOUT_SESSION_ID}` 
      });

      if (stripeRes.data.url) {
        window.location.href = stripeRes.data.url;
      } else {
        setModal({ isOpen: true, type: 'success', message: 'Votre demande a été envoyée avec succès.' });
      }
    } catch (err: any) {
      setModal({ isOpen: true, type: 'error', message: err.response?.data?.message || "Erreur lors de l'envoi de la demande." });
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-padel-blue" />
      </div>
    );
  }

  if (plans.length === 0) return null;

  return (
    <section id="abonnements" className="relative py-24 md:py-24 px-6 bg-[#050505] overflow-hidden border-t border-white/[0.03]">
      {/* Structural Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-white opacity-[0.02] z-0" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 mb-20 md:mb-32">
          <div className="max-w-3xl text-center lg:text-left">
            <div className="inline-flex items-center gap-4 mb-8">
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-yellow uppercase">ABONNEMENTS EXCLUSIFS</span>
            </div>
            <h3 className="text-4xl sm:text-5xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase">
              REJOIGNEZ <br />
              <span className="text-padel-blue italic">LA COMMUNAUTÉ</span>
            </h3>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-6">
            <div className="flex items-center gap-6 p-2 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10">
              <button
                onClick={() => setIsAnnual(false)}
                className={cn(
                  "px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                  !isAnnual ? "bg-padel-blue text-white shadow-xl" : "text-white/30 hover:text-white"
                )}
              >
                Mensuel
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={cn(
                  "px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all relative",
                  isAnnual ? "bg-padel-blue text-white shadow-xl" : "text-white/30 hover:text-white"
                )}
              >
                Annuel
                {!isAnnual && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-padel-yellow opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-padel-yellow"></span></span>}
              </button>
            </div>
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">ÉCONOMISEZ 20% SUR LE PLAN ANNUEL</p>
          </div>
        </div>

        {/* Pricing Cards Carousel/Grid */}
        <div className="relative mb-32">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex lg:grid lg:grid-cols-3 gap-6 lg:gap-8 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory no-scrollbar pb-10 lg:pb-0"
          >
            {plans.map((plan, i) => (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className={cn(
                  "min-w-[85vw] sm:min-w-[400px] lg:min-w-0 snap-center group relative p-12 md:p-16 rounded-[4rem] border transition-all duration-700 flex flex-col h-full overflow-hidden",
                  plan.featured
                    ? "bg-[#0A0A0A] border-padel-blue/40 shadow-[0_50px_100px_rgba(19,73,211,0.1)] lg:-translate-y-8 z-20"
                    : "glass border-white/5 hover:border-white/20"
                )}
              >
                {/* Decorative background glow */}
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-700", plan.color || "from-white/5 to-white/0")} />

                {plan.featured && (
                  <div className="absolute top-8 right-8 z-20">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="px-5 py-2 bg-gradient-to-r from-padel-blue to-blue-600 text-white text-[8px] font-black uppercase tracking-[0.4em] rounded-full shadow-[0_0_20px_rgba(19,73,211,0.5)] border border-white/20"
                    >
                      recommandé
                    </motion.div>
                  </div>
                )}

                <div className="relative z-10 mb-16">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-10 transition-all duration-500 group-hover:bg-padel-blue group-hover:text-white group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[0_0_30px_rgba(19,73,211,0.4)]",
                    plan.accent || "text-padel-blue"
                  )}>
                    {IconMap[plan.icon || ''] || <Zap size={24} />}
                  </div>
                  <h4 className="text-xl md:text-2xl font-display font-black uppercase tracking-tight mb-4 group-hover:text-padel-blue transition-colors">
                    {plan.title}
                  </h4>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl md:text-8xl font-display font-black tracking-tighter text-white group-hover:scale-[1.02] transition-transform duration-500 inline-block">
                      {isAnnual ? (plan.annualPrice || Math.round(parseInt(plan.price) * 12 * 0.8)) : plan.price}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-2xl font-display font-black text-white italic">€</span>
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none">{isAnnual ? '/ AN' : '/ MOIS'}</span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 space-y-6 mb-16 flex-grow">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-5 group/item">
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors",
                        plan.featured ? "bg-padel-blue" : "bg-white/5 group-hover/item:bg-padel-blue"
                      )}>
                        <Check size={10} className="text-white" />
                      </div>
                      <span className="text-sm md:text-base text-white/40 font-medium group-hover/item:text-white/70 transition-colors leading-tight">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSubscribeClick(plan)}
                  disabled={submitting !== null || currentUserSub?._id === findDbPlan(plan.title, isAnnual)?._id}
                  className={cn(
                    "relative z-10 w-full py-6 rounded-full font-black text-[10px] tracking-[0.4em] uppercase transition-all duration-500 flex items-center justify-center gap-4 overflow-hidden group/btn shadow-xl",
                    currentUserSub?._id === findDbPlan(plan.title, isAnnual)?._id
                      ? "bg-emerald-500 text-white cursor-default"
                      : plan.featured ? "bg-padel-blue text-white" : "bg-white/5 text-white border border-white/10 hover:border-padel-blue hover:text-padel-blue"
                  )}>
                  <span className="relative z-10 flex items-center gap-3">
                    {submitting === findDbPlan(plan.title, isAnnual)?._id ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : currentUserSub?._id === findDbPlan(plan.title, isAnnual)?._id ? (
                      <>PROGRAMME ACTIF <ShieldCheck size={16} /></>
                    ) : (
                      <>S'ABONNER <ArrowUpRight size={16} /></>
                    )}
                  </span>
                  {plan.featured && <div className="absolute inset-0 bg-padel-yellow translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Pagination Indicators */}
          <div className="flex lg:hidden justify-center items-center gap-3 mt-4">
            {plans.map((_, i) => (
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

      {/* Subscription Modal Contextuel */}
      <AnimatePresence>
        {modal.isOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModal({ ...modal, isOpen: false })}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-[3.5rem] p-10 md:p-14 overflow-hidden group"
            >
              {/* Accents decoratifs */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-padel-blue/20 blur-[100px] -mr-24 -mt-24 group-hover:bg-padel-blue/40 transition-all duration-1000" />

              <div className="relative z-10 text-center space-y-8">
                {modal.type === 'confirm' && (
                  <>
                      <div className="text-center space-y-4">
                      <div className="inline-flex py-1 px-4 bg-padel-blue/10 border border-padel-blue/20 rounded-full">
                        <span className="text-[9px] font-black text-padel-blue tracking-[0.3em] uppercase">ABONNEMENT ARENA</span>
                      </div>
                      <h3 className="text-3xl font-display font-black text-white italic uppercase tracking-tighter leading-[0.9]">
                        Rejoignez le <br /> <span className="text-padel-blue">{modal.plan?.name}</span>
                      </h3>
                      <p className="text-xs text-white/30 font-medium uppercase tracking-[0.2em]">
                        Nos équipes vous contacteront pour finaliser votre adhésion.
                      </p>

                      {/* Switching Warning */}
                      {modal.needsSwitchConfirmation && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className="mt-4 p-6 bg-padel-blue/10 border border-padel-blue/30 rounded-[2rem] text-left relative overflow-hidden group"
                        >
                          <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Zap size={60} />
                          </div>
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-padel-blue/20 flex items-center justify-center shrink-0">
                              <Zap size={24} className="text-padel-blue" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">Abonnement déjà actif</p>
                              <p className="text-[8px] font-black text-padel-blue uppercase tracking-widest leading-loose">
                                VOUS AVEZ DÉJÀ UN PLAN ACTIF : **{modal.existingPlanName?.toUpperCase()}**.
                              </p>
                            </div>
                          </div>
                          <p className="text-[9px] font-medium text-white/40 uppercase tracking-widest leading-relaxed mb-6">
                            L'ACTIVATION DU PLAN **{modal.plan?.name.toUpperCase()}** RÉSILIERA IMMÉDIATEMENT VOTRE PLAN ACTUEL POUR LE REMPLACER PAR CELUI-CI.
                          </p>
                          <button
                            onClick={() => confirmSubscription(true)}
                            className="w-full py-4 bg-padel-blue rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-white hover:scale-[1.02] transition-all shadow-lg shadow-padel-blue/20"
                          >
                            OUI, JE CONFIRME LE RÉ-ABONNEMENT
                          </button>
                        </motion.div>
                      )}
                    </div>

                    {!modal.needsSwitchConfirmation && (
                      <form onSubmit={(e) => { e.preventDefault(); confirmSubscription(); }} className="space-y-5 text-left">
                      <div className="space-y-4">
                        <div className="relative group">
                          <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-padel-blue transition-colors" size={16} />
                          <input
                            required
                            type="text"
                            placeholder="NOM & PRÉNOM"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-xs font-black text-white focus:border-padel-blue outline-none transition-all uppercase tracking-widest placeholder:text-white/10"
                          />
                        </div>
                        <div className="relative group">
                          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-padel-blue transition-colors" size={16} />
                          <input
                            required
                            type="tel"
                            placeholder="NUMÉRO DE TÉLÉPHONE"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-xs font-black text-white focus:border-padel-blue outline-none transition-all uppercase tracking-widest placeholder:text-white/10"
                          />
                        </div>
                        <div className="relative group">
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-padel-blue transition-colors" size={16} />
                          <input
                            required
                            type="email"
                            placeholder="ADRESSE EMAIL"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-xs font-black text-white focus:border-padel-blue outline-none transition-all uppercase tracking-widest placeholder:text-white/10"
                          />
                        </div>
                      </div>

                      {(() => {
                        const amount = isAnnual ? (modal.plan.price * 12 * 0.8) : modal.plan.price;
                        const isQuote = isNaN(parseFloat(amount.toString())) || parseFloat(amount.toString()) === 0;

                        if (isQuote) return null;

                        return (
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
                               VOUS ALLEZ ÊTRE REDIRIGÉ VERS LA PLATEFORME SÉCURISÉE <span className="text-white/40 font-bold tracking-normal italic">STRIPE</span> POUR FINALISER VOTRE RÉGLEMENT.
                            </p>
                          </div>
                        );
                      })()}

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setModal({ ...modal, isOpen: false })}
                          className="py-4 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          disabled={submitting !== null}
                          className="py-4 bg-padel-blue rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:scale-105 transition-all shadow-xl shadow-padel-blue/40 flex items-center justify-center gap-2"
                        >
                          {submitting ? <Loader2 className="animate-spin" size={14} /> : (() => {
                            const amount = isAnnual ? (modal.plan.price * 12 * 0.8) : modal.plan.price;
                            const isQuote = isNaN(parseFloat(amount.toString())) || parseFloat(amount.toString()) === 0;
                            return isQuote ? 'DEMANDER UN DEVIS' : 'PAYER VIA STRIPE';
                          })()}
                        </button>
                      </div>
                    </form>
                    )}
                  </>
                )}

                {modal.type === 'success' && (
                  <>
                    <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-500 border border-emerald-500/20">
                      <Sparkles size={40} />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-display font-black text-white italic uppercase tracking-tighter">
                        BIENVENUE <br /> <span className="text-emerald-500">DANS L'ÉLITE</span>
                      </h3>
                      <p className="text-xs text-white/40 font-medium uppercase tracking-widest leading-relaxed">
                        Votre abonnement a été activé avec succès. Profitez dès maintenant de tous vos avantages Arena.
                      </p>
                    </div>
                    <button
                      onClick={() => { setModal({ ...modal, isOpen: false }); navigate('/dashboard'); }}
                      className="w-full py-5 bg-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:scale-105 transition-all shadow-xl shadow-emerald-500/40"
                    >
                      DÉCOUVRIR MON ESPACE
                    </button>
                  </>
                )}

                {modal.type === 'error' && (
                  <>
                    <div className="w-20 h-20 rounded-[2rem] bg-red-500/10 flex items-center justify-center mx-auto text-red-500 border border-red-500/20">
                      <X size={40} />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-display font-black text-white italic uppercase tracking-tighter">
                        ÉCHEC DE <br /> <span className="text-red-500">L'OPÉRATION</span>
                      </h3>
                      <p className="text-xs text-white/40 font-medium uppercase tracking-widest leading-relaxed">
                        {modal.message || "Une erreur inattendue est survenue lors de l'activation de votre abonnement."}
                      </p>
                    </div>
                    <button
                      onClick={() => setModal({ ...modal, isOpen: false })}
                      className="w-full py-5 bg-red-500 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:scale-105 transition-all shadow-xl shadow-red-500/40"
                    >
                      RÉESSAYER
                    </button>
                  </>
                )}
              </div>

              {/* Close Button UI */}
              <button
                onClick={() => setModal({ ...modal, isOpen: false })}
                className="absolute top-8 right-8 p-3 bg-white/5 rounded-2xl text-white/20 hover:text-white transition-all border border-white/10"
              >
                <X size={20} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
