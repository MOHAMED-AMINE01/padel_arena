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
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState<string | null>(null);
    const [promoDiscount, setPromoDiscount] = useState<number>(0);
    const [expiresAt, setExpiresAt] = useState<string | null>(null);
    const [history, setHistory] = useState<any[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchData = async () => {
        try {
            setLoading(true);
            const [plansRes, mySubRes, historyRes] = await Promise.all([
                api.get('/subscriptions/plans'),
                api.get('/subscriptions/my-subscription'),
                api.get('/bookings/me?bookingType=SUBSCRIPTION')
            ]);

            setPlans(plansRes.data.data || []);
            setCurrentSubscription(mySubRes.data.data?.subscription || null);
            setExpiresAt(mySubRes.data.data?.expiresAt || null);

            const rawHistory = historyRes.data.data || [];
            setHistory(rawHistory.filter((b: any) => b.paymentStatus === 'PAID'));
        } catch (error) {
            console.error('Error fetching subscription data:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(history.length / itemsPerPage);
    const paginatedHistory = history.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubscribe = async (planId: string) => {
        try {
            setSubscribing(planId);
            const plan = plans.find(p => p._id === planId);
            if (!plan) return;

            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');

            const res = await api.post('/bookings', {
                guestName: user?.name,
                guestEmail: user?.email,
                guestPhone: user?.phone || '00000000',
                startTime: now.toISOString(),
                endTime: now.toISOString(),
                timeStr: `${hours}:${minutes}`,
                dateStr: `${day}/${month}/${year}`,
                bookingType: 'SUBSCRIPTION',
                packName: plan.name,
                subscription: plan._id,
                totalPrice: plan.price - promoDiscount
            });

            const booking = res.data.data;

            const stripeRes = await api.post('/payments/create-checkout-session', {
                bookingId: booking._id,
                courtName: `Abonnement : ${plan.name}`,
                amount: plan.price - promoDiscount,
                customerEmail: user?.email,
                successUrl: `${window.location.origin}/subscription?status=success`
            });

            if (stripeRes.data.url) {
                window.location.href = stripeRes.data.url;
            }
        } catch (error) {
            console.error('Error subscribing:', error);
        } finally {
            setSubscribing(null);
        }
    };

    const isExpiringSoon = () => {
        if (!expiresAt) return false;
        const expiryDate = new Date(expiresAt);
        const now = new Date();
        const diffDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    };

    const getFormattedExpiryDate = () => {
        if (!expiresAt) return 'Non défini';
        return new Date(expiresAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0A0A0B]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-padel-blue animate-spin" />
                    <p className="text-xs text-white/30 uppercase tracking-[0.3em] font-black italic">Synchronisation Arena...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen  p-6 lg:p-12 space-y-12"
        >
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-12 border-b border-white/5">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-padel-blue/10 border border-padel-blue/20 text-padel-blue text-[10px] font-black uppercase tracking-[0.3em]">
                        <Sparkles size={12} /> Membership Privilège
                    </div>
                    <div>
                        <h1 className="text-5xl md:text-8xl font-display font-black text-white italic uppercase tracking-tighter leading-[0.8]">
                            Mon <br /><span className="text-padel-yellow drop-shadow-[0_0_30px_rgba(255,210,31,0.2)]">Abonnement</span>
                        </h1>
                    </div>
                </div>

                {currentSubscription && (
                    <div className="px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-black text-white uppercase tracking-widest">{currentSubscription.name} Actif</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Active Plan Content */}
                {currentSubscription && (
                    <div className="lg:col-span-12 space-y-12">
                        {/* Main Card */}
                        <div className="relative bg-[#151518] rounded-[3rem] p-8 md:p-16 border border-white/5 overflow-hidden group">
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-padel-blue/10 rounded-full blur-[120px] -mr-48 -mt-48 transition-all duration-1000 group-hover:bg-padel-blue/20" />

                            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 bg-padel-blue/20 rounded-3xl flex items-center justify-center text-padel-blue border border-padel-blue/30 shadow-2xl">
                                            <Trophy size={40} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-padel-blue uppercase tracking-[0.5em] mb-2">Statut Membre</p>
                                            <h2 className="text-6xl font-display font-black text-white italic uppercase tracking-tighter">{currentSubscription.name}</h2>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-6">
                                        <div className="bg-white/5 border border-white/5 px-8 py-5 rounded-[2rem]">
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Date d'expiration</p>
                                            <p className="text-2xl font-black text-white italic uppercase">{getFormattedExpiryDate()}</p>
                                        </div>
                                        <div className="bg-white/5 border border-white/5 px-8 py-5 rounded-[2rem]">
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Tarif préférentiel</p>
                                            <p className="text-2xl font-black text-padel-yellow italic uppercase">{currentSubscription.price}€ <span className="text-sm opacity-30 text-white">/ {currentSubscription.durationInMonths} mois</span></p>
                                        </div>
                                    </div>
                                </div>

                                {isExpiringSoon() && (
                                    <button
                                        onClick={() => handleSubscribe(currentSubscription._id)}
                                        disabled={subscribing !== null}
                                        className="w-full lg:w-auto px-12 py-7 bg-padel-yellow text-black font-display font-black text-xs uppercase tracking-[0.3em] rounded-[2rem] hover:scale-105 transition-all shadow-[0_20px_40px_rgba(255,210,31,0.2)] flex items-center justify-center gap-4"
                                    >
                                        {subscribing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCcw size={20} />}
                                        Renouveler Maintenant
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Perks Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentSubscription.features.map((f, i) => (
                                <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center gap-5 hover:bg-white/[0.04] transition-all">
                                    <div className="w-10 h-10 rounded-2xl bg-padel-blue/10 flex items-center justify-center text-padel-blue">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <span className="text-sm font-bold text-white uppercase tracking-wide">{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Purchase Plans (If no sub) */}
                {!currentSubscription && (
                    <div className="lg:col-span-12 space-y-12">
                        <div className="text-center">
                            <h2 className="text-5xl font-display font-black text-white italic uppercase tracking-tighter">Choisir une <span className="text-padel-blue">Formule</span></h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {plans.map((p) => (
                                <div key={p._id} className="bg-[#151518] rounded-[3rem] p-10 space-y-8 border border-white/5 hover:border-padel-blue/30 transition-all">
                                    <div>
                                        <h3 className="text-2xl font-display font-black text-white italic uppercase">{p.name}</h3>
                                        <div className="flex items-baseline gap-2 mt-4">
                                            <span className="text-5xl font-black text-white italic">{p.price}€</span>
                                            <span className="text-xs text-white/30 uppercase font-black">/ {p.durationInMonths} mois</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4 pt-8 border-t border-white/5">
                                        {p.features.slice(0, 4).map((f, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <Check size={14} className="text-padel-blue" />
                                                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => handleSubscribe(p._id)}
                                        disabled={subscribing === p._id}
                                        className="w-full py-5 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-padel-blue transition-all"
                                    >
                                        S'abonner
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Payment History (Always show) */}
                <div className="lg:col-span-12 mt-12">
                    <div className="bg-[#151518]/40 rounded-[3rem] p-10 border border-white/5 overflow-hidden relative">
                        <div className="flex items-center justify-between mb-12">
                            <h3 className="text-sm font-black text-white uppercase tracking-[0.5em] flex items-center gap-4">
                                <div className="w-1.5 h-6 bg-padel-yellow rounded-full" />
                                Historique Financier
                            </h3>
                            <div className="px-4 py-2 bg-white/5 rounded-full text-[10px] font-black text-white/30 uppercase tracking-widest border border-white/5">
                                {history.length} Opération(s)
                            </div>
                        </div>

                        <div className="space-y-4">
                            {paginatedHistory.length > 0 ? (
                                <>
                                    {paginatedHistory.map((item) => (
                                        <div key={item._id} className="flex items-center justify-between p-6 bg-white/[0.01] border border-white/5 rounded-[2rem] hover:bg-white/[0.03] transition-all group">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-padel-blue/10 rounded-2xl flex items-center justify-center text-padel-blue group-hover:scale-110 transition-transform">
                                                    <CreditCard size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-white uppercase tracking-[0.2em] mb-1">{item.packName || 'Abonnement Arena'}</p>
                                                    <p className="text-[10px] text-white/20 font-bold uppercase">{new Date(item.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-black text-padel-yellow italic -tracking-tighter">-{item.totalPrice}€</p>
                                                <p className="text-[8px] font-black text-green-500 uppercase tracking-[0.4em] mt-1">Transactions Vérifiée</p>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Pagination Controls */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-center gap-4 pt-8">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                disabled={currentPage === 1}
                                                className={cn(
                                                    "px-6 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                                                    currentPage === 1 ? "bg-white/[0.02] border-white/5 text-white/10 cursor-not-allowed" : "bg-white/5 border-white/10 text-white hover:bg-padel-blue hover:border-padel-blue"
                                                )}
                                            >
                                                Précédent
                                            </button>
                                            <div className="px-6 py-3 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black text-padel-blue uppercase tracking-[0.3em]">
                                                Page {currentPage} / {totalPages}
                                            </div>
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                disabled={currentPage === totalPages}
                                                className={cn(
                                                    "px-6 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                                                    currentPage === totalPages ? "bg-white/[0.02] border-white/5 text-white/10 cursor-not-allowed" : "bg-white/5 border-white/10 text-white hover:bg-padel-blue hover:border-padel-blue"
                                                )}
                                            >
                                                Suivant
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-20 opacity-10">
                                    <Clock size={60} className="mx-auto mb-6" />
                                    <p className="text-xs font-black uppercase tracking-[0.5em]">Aucun mouvement enregistré</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
