import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PromoCodeInput } from '../../components/player/PromoCodeInput';
import {
    Ticket,
    CheckCircle2,
    Star,
    Zap,
    ChevronRight,
    CreditCard,
    Clock,
    Sparkles,
    ShieldCheck,
    RefreshCcw,
    Trophy,
    Check,
    X,
    Loader2,
    Crown
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

interface SubscriptionPlan {
    _id: string;
    name: string;
    price: number;
    durationInMonths: number;
    features: string[];
    isActive: boolean;
}

interface UserStats {
    hoursPlayed: number;
    guestInvitations: { used: number; total: number };
    savings: number;
}

export function PlayerSubscription() {
    const { user } = useAuth();
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [currentSubscription, setCurrentSubscription] = useState<SubscriptionPlan | null>(null);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState<string | null>(null);
    const [promoDiscount, setPromoDiscount] = useState<number>(0);
    const [promoCode, setPromoCode] = useState<string>('');
    const [promoPlanId, setPromoPlanId] = useState<string | null>(null);
    const [promoAvailable, setPromoAvailable] = useState<string | null>(null);
    const [canceling, setCanceling] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [plansRes, mySubRes] = await Promise.all([
                api.get('/subscriptions/plans'),
                api.get('/subscriptions/my-subscription')
            ]);
            setPlans(plansRes.data.data);
            setCurrentSubscription(mySubRes.data.data.subscription);
            setStats(mySubRes.data.data.stats);
        } catch (error) {
            console.error('Error fetching subscription data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubscribe = async (planId: string) => {
        try {
            setSubscribing(planId);
            await api.post(`/subscriptions/subscribe/${planId}`, promoCode ? { promoCode } : {});
            await fetchData();
        } catch (error) {
            console.error('Error subscribing:', error);
        } finally {
            setSubscribing(null);
        }
    };

    const handleCancel = async () => {
        try {
            setCanceling(true);
            await api.post('/subscriptions/cancel');
            await fetchData();
        } catch (error) {
            console.error('Error canceling subscription:', error);
        } finally {
            setCanceling(false);
        }
    };

    const getNextBillingDate = () => {
        if (!currentSubscription) return '';
        const date = new Date();
        date.setMonth(date.getMonth() + currentSubscription.durationInMonths);
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-padel-blue animate-spin" />
                    <p className="text-sm text-white/50 uppercase tracking-widest">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 md:space-y-12 pb-10"
        >
            {/* Elite Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 border-b border-white/5 pb-8 md:pb-10">
                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-padel-blue/10 border border-padel-blue/20 text-padel-blue text-[10px] font-black uppercase tracking-[0.3em]"
                    >
                        <Sparkles size={12} /> Membership Privilège
                    </motion.div>
                    <div>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-white italic uppercase tracking-tighter leading-[0.85]">
                            Mon <br /> <span className="text-padel-yellow drop-shadow-[0_0_30px_rgba(255,210,31,0.3)]">Abonnement</span>
                        </h1>
                        <p className="text-[10px] sm:text-xs font-bold text-white/30 uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-4 italic">Élite • Performance • Liberté</p>
                    </div>
                </div>

                {currentSubscription && (
                    <div className="px-4 sm:px-6 py-3 sm:py-4 glass-pill flex items-center gap-3 sm:gap-4 self-start md:self-auto">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-widest">Statut : {currentSubscription.name}</span>
                    </div>
                )}
            </div>

            {currentSubscription ? (
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 md:gap-8 lg:gap-10">
                    {/* Active Premium Card */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="lg:col-span-7 group"
                    >
                        <div className="relative bg-[#151518]/60 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-[2.5rem] lg:rounded-[3.5rem] p-6 sm:p-10 md:p-12 lg:p-16 xl:p-20 overflow-hidden shadow-3xl">
                            {/* Animated mesh backgrounds */}
                            <div className="absolute top-0 right-0 w-[300px] sm:w-[400px] lg:w-[600px] h-[300px] sm:h-[400px] lg:h-[600px] bg-padel-blue/20 rounded-full blur-[80px] lg:blur-[120px] -mr-24 lg:-mr-48 -mt-24 lg:-mt-48 group-hover:bg-padel-blue/30 transition-all duration-1000" />
                            <div className="absolute bottom-0 left-0 w-[200px] sm:w-[300px] lg:w-[400px] h-[200px] sm:h-[300px] lg:h-[400px] bg-padel-yellow/5 rounded-full blur-[60px] lg:blur-[100px] -ml-16 lg:-ml-32 -mb-16 lg:-mb-32 pointer-events-none" />

                            <div className="relative z-10 flex flex-col gap-8 items-start">
                                <div className="space-y-6 sm:space-y-8 lg:space-y-10 w-full">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-12 h-12 sm:w-14 md:w-16 sm:h-14 md:h-16 bg-padel-blue/20 rounded-2xl sm:rounded-3xl flex items-center justify-center text-padel-blue border border-padel-blue/30 shadow-inner group-hover:scale-110 transition-transform duration-700">
                                            <Trophy size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] sm:text-[10px] font-black text-padel-blue uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-1">Plan Actuel</p>
                                            <p className="text-[10px] sm:text-xs font-bold text-white/40 uppercase tracking-widest italic">Abonnement Exclusif</p>
                                        </div>
                                    </div>

                                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-black text-white italic uppercase tracking-tighter leading-none mb-4 sm:mb-6 lg:mb-8">
                                        {currentSubscription.name.split(' ').map((word, i) => (
                                            <span key={i} className={i === 1 ? 'text-padel-yellow' : ''}>{word} </span>
                                        ))}
                                    </h2>

                                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 md:gap-6">
                                        <div className="glass-card px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl lg:rounded-3xl">
                                            <p className="text-[8px] sm:text-[9px] font-black text-white/30 uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-1 sm:mb-2">Prochaine Échéance</p>
                                            <p className="text-base sm:text-lg lg:text-xl font-black text-white italic uppercase tracking-tighter">{getNextBillingDate()}</p>
                                        </div>
                                        <div className="glass-card px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl lg:rounded-3xl border-padel-yellow/20">
                                            <p className="text-[8px] sm:text-[9px] font-black text-padel-yellow/50 uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-1 sm:mb-2">Prix</p>
                                            <p className="text-base sm:text-lg lg:text-xl font-black text-white italic uppercase tracking-tighter">{currentSubscription.price - (promoDiscount > 0 ? promoDiscount : 0)}€ <span className="text-padel-blue">/ {currentSubscription.durationInMonths} mois</span></p>
                                            {promoDiscount > 0 && (
                                                <div className="mt-2 text-green-400 text-xs font-bold flex items-center gap-2">
                                                    <CheckCircle2 size={16} />
                                                    Code promo appliqué : <span className="font-mono bg-green-500/10 px-2 py-1 rounded">{promoCode}</span> (-{promoDiscount}€)
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCancel}
                                    disabled={canceling}
                                    className="self-end px-6 sm:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-xl sm:rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-red-500/30 transition-all duration-300 backdrop-blur-md disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {canceling ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <X size={16} />
                                            Annuler l'abonnement
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Membership perks grid */}
                    <div className="lg:col-span-7">
                        <div className="bg-[#151518]/40 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] p-6 sm:p-8 md:p-10 lg:p-14 relative overflow-hidden h-full">
                            <div className="flex items-center gap-3 mb-8 sm:mb-10 lg:mb-12">
                                <div className="w-1 sm:w-1.5 h-5 sm:h-6 bg-padel-blue rounded-full" />
                                <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-[0.3em] sm:tracking-[0.4em]">Privilèges Inclus</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
                                {currentSubscription.features.length > 0 ? (
                                    currentSubscription.features.map((feature, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * i }}
                                            className="flex gap-4 items-center bg-white/5 rounded-xl p-4 shadow-inner hover:bg-padel-blue/10 transition-all duration-300"
                                        >
                                            <CheckCircle2 size={24} className="text-padel-blue flex-shrink-0" />
                                            <span className="text-base font-bold text-white uppercase tracking-wide">{feature}</span>
                                        </motion.div>
                                    ))
                                ) : (
                                    <span className="text-white/40 italic">Aucun privilège inclus</span>
                                )}
                            </div>
                        </div>
                    </div>


                </div>
            ) : (
                /* No subscription - Show available plans */
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white italic uppercase tracking-tighter">
                            Choisissez votre <span className="text-padel-blue">Formule</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-white/40 uppercase tracking-widest">Débloquez l'accès illimité aux terrains</p>
                    </div>

                    {plans.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-white/40 uppercase tracking-widest text-sm">Aucun abonnement disponible pour le moment</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                            {plans.map((plan, index) => {
                                const isPopular = index === Math.floor(plans.length / 2);
                                // Simule la disponibilité du code promo selon le plan (exemple: pas pour les plans "Basic")
                                const promoEnabled = !plan.name.toLowerCase().includes('basic');
                                return (
                                    <motion.div
                                        key={plan._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        className={cn(
                                            "relative bg-[#151518]/60 backdrop-blur-xl border rounded-2xl sm:rounded-3xl p-6 sm:p-8 overflow-hidden group",
                                            isPopular ? "border-padel-blue/50 shadow-[0_0_60px_rgba(19,73,211,0.15)]" : "border-white/10"
                                        )}
                                    >
                                        {/* Background glow for popular */}
                                        {isPopular && (
                                            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-padel-blue/20 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
                                        )}

                                        {/* Popular badge */}
                                        {isPopular && (
                                            <div className="absolute top-4 right-4 px-3 py-1 bg-padel-blue rounded-full">
                                                <span className="text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-1">
                                                    <Crown size={10} /> Populaire
                                                </span>
                                            </div>
                                        )}

                                        <div className="relative z-10 space-y-6">
                                            {/* Plan name */}
                                            <div>
                                                <h3 className="text-xl sm:text-2xl font-display font-black text-white italic uppercase tracking-tight">
                                                    {plan.name}
                                                </h3>
                                                <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">
                                                    {plan.durationInMonths} mois
                                                </p>
                                            </div>

                                            {/* Price */}
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl sm:text-5xl font-black text-white italic tracking-tighter">
                                                    {(plan.price - (promoPlanId === plan._id ? promoDiscount : 0)).toFixed(2)}
                                                </span>
                                                <span className="text-lg sm:text-xl font-black text-padel-blue">€</span>
                                                <span className="text-xs text-white/30 ml-2">/ {plan.durationInMonths > 1 ? `${plan.durationInMonths} mois` : 'mois'}</span>
                                            </div>

                                            {/* Promo Code Input */}
                                            {promoEnabled ? (
                                                <div className="mb-2">
                                                    <PromoCodeInput
                                                        applicationType="subscription"
                                                        purchaseAmount={plan.price}
                                                        onApply={(discount, code) => {
                                                            setPromoDiscount(discount);
                                                            setPromoCode(code);
                                                            setPromoPlanId(plan._id);
                                                        }}
                                                    />
                                                    {promoPlanId === plan._id && promoDiscount > 0 && (
                                                        <>
                                                            <div className="mt-2 text-green-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                                <CheckCircle2 size={14} /> Code {promoCode} appliqué (-{promoDiscount}€)
                                                            </div>
                                                            <div className="mt-2 text-white text-xs font-bold uppercase tracking-wider">
                                                                Total : <span className="text-padel-yellow font-mono bg-padel-blue/10 px-2 py-1 rounded">{(plan.price - promoDiscount).toFixed(2)}€</span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="mb-2 text-xs text-white/30 italic">Code promo non disponible pour ce plan</div>
                                            )}

                                            {/* Features */}
                                            <div className="space-y-3 pt-4 border-t border-white/5">
                                                {plan.features.length > 0 ? (
                                                    plan.features.slice(0, 4).map((feature, i) => (
                                                        <div key={i} className="flex items-center gap-3">
                                                            <CheckCircle2 size={14} className="text-padel-blue flex-shrink-0" />
                                                            <span className="text-[11px] sm:text-xs text-white/60 uppercase tracking-wide">{feature}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <>
                                                        <div className="flex items-center gap-3">
                                                            <CheckCircle2 size={14} className="text-padel-blue" />
                                                            <span className="text-[11px] sm:text-xs text-white/60 uppercase tracking-wide">Accès illimité terrains</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <CheckCircle2 size={14} className="text-padel-blue" />
                                                            <span className="text-[11px] sm:text-xs text-white/60 uppercase tracking-wide">Réservation prioritaire</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {/* Subscribe button */}
                                            <button
                                                onClick={() => handleSubscribe(plan._id)}
                                                disabled={subscribing === plan._id}
                                                className={cn(
                                                    "w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2",
                                                    isPopular
                                                        ? "bg-padel-blue text-white hover:bg-padel-blue/80 shadow-lg hover:shadow-padel-blue/30"
                                                        : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                                                )}
                                            >
                                                {subscribing === plan._id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Zap size={14} />
                                                        S'abonner
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}
