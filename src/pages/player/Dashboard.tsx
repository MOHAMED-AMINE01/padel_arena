import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Calendar,
    Trophy,
    TrendingUp,
    Gamepad2,
    MapPin,
    Clock,
    ChevronRight,
    ArrowUpRight,
    Sparkles,
    Zap,
    Users,
    Activity,
    Loader2,
    AlertCircle,
    CheckCircle2,
    CreditCard,
    Timer,
    Star,
    Target,
    Flame
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

// ─── Types ──────────────────────────────────────────────────────────────────
interface Booking {
    _id: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED';
    court: {
        _id: string;
        name: string;
        type: string;
        sport?: string;
    } | null;
    bookingType?: 'COURT' | 'PACK' | 'SUBSCRIPTION';
    packName?: string;
    timeStr: string;
    dateStr: string;
}

interface Tournament {
    _id: string;
    name: string;
    sport: string;
    startDate: string;
    endDate: string;
    status: string;
    maxParticipants: number;
    participants: any[];
    pricePerTeam: number;
}

interface DashboardStats {
    upcoming: number;
    totalPlayed: number;
    totalSpent: number;
    cancelled: number;
}

interface UserSubscription {
    _id: string;
    name: string;
    price: number;
    durationInMonths: number;
    features: string[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function formatRelativeDate(iso: string) {
    const date = new Date(iso);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Aujourd'hui";
    if (date.toDateString() === tomorrow.toDateString()) return 'Demain';

    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
}

function getDuration(start: string, end: string) {
    const min = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h}h${m > 0 ? m : ''}` : `${m}min`;
}

function getSportColor(sport?: string) {
    switch (sport) {
        case 'Pickleball': return '#FFD21F';
        case 'Badminton': return '#ffffff';
        default: return '#1349D3';
    }
}

function getSportIcon(sport?: string) {
    switch (sport) {
        case 'Pickleball': return <Zap size={28} />;
        case 'Badminton': return <Trophy size={28} />;
        default: return <Gamepad2 size={28} />;
    }
}

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Salut';
    return 'Bonsoir';
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
    return (
        <div className={cn('bg-white/5 rounded-2xl animate-pulse', className)} />
    );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function PlayerDashboard() {
    const { user } = useAuth();

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [subscription, setSubscription] = useState<UserSubscription | null>(null);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [loadingTournaments, setLoadingTournaments] = useState(true);
    const [loadingSubscription, setLoadingSubscription] = useState(true);
    const [hasError, setHasError] = useState(false);

    // ── Fetch data
    const fetchAll = useCallback(async () => {
        setLoadingBookings(true);
        setLoadingTournaments(true);
        setLoadingSubscription(true);
        setHasError(false);
        try {
            const [bookRes, tourRes, subRes] = await Promise.all([
                api.get('/bookings/me'),
                api.get('/tournaments'),
                api.get('/subscriptions/my-subscription')
            ]);
            setBookings(bookRes.data.data || []);
            setTournaments(tourRes.data.data || []);
            setSubscription(subRes.data.data?.subscription || null);
        } catch {
            setHasError(true);
        } finally {
            setLoadingBookings(false);
            setLoadingTournaments(false);
            setLoadingSubscription(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // ── Derived data
    const now = new Date();

    // Only show real court bookings in the player dashboard (exclude PACK/SUBSCRIPTION requests)
    const courtBookings = bookings.filter(b => !b.bookingType || b.bookingType === 'COURT');

    const upcomingBookings = courtBookings
        .filter(b => new Date(b.startTime) > now && b.status !== 'CANCELLED')
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    const nextMatch = upcomingBookings[0] || null;

    // Detect sub requests
    const pendingSubRequest = bookings.find(b => b.bookingType === 'SUBSCRIPTION' && b.status === 'PENDING');
    const confirmedSubRequest = bookings.find(b => b.bookingType === 'SUBSCRIPTION' && b.status === 'CONFIRMED');

    const stats: DashboardStats = {
        upcoming: courtBookings.filter(b => new Date(b.startTime) > now && b.status !== 'CANCELLED').length,
        totalPlayed: courtBookings.filter(b => new Date(b.startTime) <= now && b.status !== 'CANCELLED').length,
        totalSpent: courtBookings.filter(b => b.paymentStatus === 'PAID').reduce((s, b) => s + b.totalPrice, 0),
        cancelled: courtBookings.filter(b => b.status === 'CANCELLED').length,
    };

    const openTournaments = tournaments.filter(t =>
        t.status === 'OPEN' || t.status === 'UPCOMING' || t.status === 'REGISTRATION_OPEN'
    ).slice(0, 2);

    const STATS_CARDS = [
        { label: 'Matchs à venir', value: loadingBookings ? '–' : stats.upcoming, icon: <Calendar size={20} />, color: '#1349D3' },
        { label: 'Matchs joués', value: loadingBookings ? '–' : stats.totalPlayed, icon: <Target size={20} />, color: '#22c55e' },
        { label: 'Total dépensé', value: loadingBookings ? '–' : `${stats.totalSpent.toFixed(0)}€`, icon: <CreditCard size={20} />, color: '#FFD21F' },
        { label: 'Mon Solde', value: loadingBookings ? '–' : `${user?.balance || 0}€`, icon: <Zap size={20} />, color: '#0066FF' },
    ];

    const sportColor = nextMatch ? getSportColor(nextMatch.court?.sport) : '#1349D3';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 md:space-y-12 pb-20"
        >
            {/* ── Header ── */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8">
                <div className="space-y-3 sm:space-y-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                        className="flex items-center gap-2 sm:gap-3"
                    >
                        <div className="px-2 sm:px-3 py-1 rounded-full bg-padel-blue/10 border border-padel-blue/20 text-padel-blue text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] flex items-center gap-1.5 sm:gap-2">
                            <Sparkles size={10} className="sm:w-3 sm:h-3" /> Statut Joueur Élite
                        </div>
                        <div className="h-px w-8 sm:w-12 bg-white/10" />
                    </motion.div>

                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-black text-white italic uppercase tracking-tighter leading-[0.85]">
                        {getGreeting()}, <br />
                        <span className="text-padel-blue drop-shadow-[0_0_30px_rgba(19,73,211,0.3)]">
                            {user?.name?.split(' ')[0]?.toUpperCase() || 'JOUEUR'}
                        </span>
                    </h1>
                </div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 bg-white/[0.03] backdrop-blur-xl border border-white/8 p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] shadow-2xl"
                >
                    <div className="px-3 sm:px-4 py-2">
                        <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/20 mb-1 leading-none italic">Email</p>
                        <p className="text-xs sm:text-sm font-black text-white italic truncate max-w-[180px] sm:max-w-[200px]">{user?.email || '–'}</p>
                    </div>
                    <div className="hidden sm:block w-px h-10 sm:h-12 bg-white/10 mx-1 sm:mx-2" />
                    <Link
                        to="/book"
                        className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl lg:rounded-[2rem] bg-padel-blue text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-padel-blue/40 hover:bg-padel-blue/80 hover:scale-[1.02] transition-all duration-500 group"
                    >
                        <Zap size={14} className="sm:w-[18px] sm:h-[18px] text-padel-yellow group-hover:animate-bounce" />
                        NOUVEAU MATCH
                        <ChevronRight size={12} className="sm:w-4 sm:h-4 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </motion.div>
            </div>

            {/* ── Stats Row ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {STATS_CARDS.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.07 }}
                        className="bg-[#151518]/50 border border-white/5 rounded-xl sm:rounded-2xl lg:rounded-[2rem] p-4 sm:p-6 md:p-8 relative overflow-hidden group hover:border-white/10 transition-all"
                    >
                        <div
                            className="absolute top-0 right-0 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 rounded-full blur-[40px] sm:blur-[50px] lg:blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
                            style={{ backgroundColor: stat.color }}
                        />
                        <div className="mb-2 sm:mb-3 md:mb-4 relative z-10" style={{ color: `${stat.color}80` }}>{stat.icon}</div>
                        <p className="text-2xl sm:text-3xl md:text-4xl font-display font-black italic text-white tracking-tighter leading-none relative z-10">
                            {stat.value}
                        </p>
                        <p className="text-[7px] sm:text-[8px] font-black text-white/20 uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-1 sm:mt-2 relative z-10">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* ── Main Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

                {/* ── Left Column ── */}
                <div className="lg:col-span-8 space-y-6 md:space-y-8">

                    {/* ── Next Match Card ── */}
                    <motion.div
                        whileHover={{ y: -4 }}
                        className="bg-[#151518]/80 backdrop-blur-2xl border border-white/8 rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] p-5 sm:p-8 md:p-10 lg:p-12 relative overflow-hidden group shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 w-3/4 h-full bg-gradient-to-l from-padel-blue/5 to-transparent pointer-events-none" />
                        <div
                            className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-30"
                            style={{ backgroundColor: sportColor + '30' }}
                        />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10">
                                {loadingBookings ? (
                                    <Skeleton className="w-24 sm:w-32 h-5 sm:h-6" />
                                ) : nextMatch ? (
                                    <>
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-padel-yellow/10 border border-padel-yellow/20 text-padel-yellow text-[9px] font-black uppercase tracking-[0.2em] animate-pulse italic">
                                            <Activity size={10} /> Prochain match
                                        </div>
                                        <div className="h-[1px] flex-1 bg-white/5" />
                                        <Link
                                            to="/my-reservations"
                                            className="text-[9px] font-black text-white/20 uppercase tracking-widest hover:text-padel-blue transition-all"
                                        >
                                            Gérer →
                                        </Link>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-white/30 text-[9px] font-black uppercase tracking-[0.2em] italic">
                                        <Calendar size={10} /> Aucun match programmé
                                    </div>
                                )}
                            </div>

                            {loadingBookings ? (
                                <div className="space-y-4">
                                    <Skeleton className="w-64 h-12" />
                                    <Skeleton className="w-48 h-6" />
                                </div>
                            ) : nextMatch ? (
                                <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-10 lg:items-center justify-between">
                                    <div className="flex items-center gap-4 sm:gap-6 lg:gap-10">
                                        <motion.div
                                            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl sm:rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl group-hover:rotate-6 transition-transform duration-700 relative overflow-hidden shrink-0"
                                            style={{
                                                backgroundColor: sportColor + '18',
                                                color: sportColor
                                            }}
                                        >
                                            {getSportIcon(nextMatch.court?.sport)}
                                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </motion.div>
                                        <div className="min-w-0">
                                            <h4 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-black text-white italic uppercase tracking-tighter mb-2 sm:mb-3 lg:mb-4 leading-none truncate">
                                                {nextMatch.court?.name || 'TERRAIN'} <span style={{ color: sportColor }}>⚡</span>
                                            </h4>
                                            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                                                <span className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/5 text-[8px] sm:text-[9px] font-black text-white/60 uppercase tracking-widest italic">
                                                    <MapPin size={10} className="sm:w-3 sm:h-3" style={{ color: sportColor }} />
                                                    {nextMatch.court?.sport || 'Padel'}
                                                </span>
                                                <span className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/5 text-[8px] sm:text-[9px] font-black text-padel-yellow uppercase tracking-widest italic">
                                                    <Clock size={10} className="sm:w-3 sm:h-3" />
                                                    {nextMatch.dateStr} • {nextMatch.timeStr.replace(':', 'h')}
                                                </span>
                                                <span className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/5 text-[8px] sm:text-[9px] font-black text-white/30 uppercase tracking-widest italic">
                                                    <Timer size={10} className="sm:w-3 sm:h-3" />
                                                    {getDuration(nextMatch.startTime, nextMatch.endTime)}
                                                </span>
                                            </div>
                                            {/* Status chip */}
                                            <div className={cn(
                                                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border',
                                                nextMatch.status === 'CONFIRMED'
                                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                    : 'bg-padel-yellow/10 text-padel-yellow border-padel-yellow/20'
                                            )}>
                                                <div className={cn(
                                                    'w-1.5 h-1.5 rounded-full',
                                                    nextMatch.status === 'CONFIRMED' ? 'bg-green-500' : 'bg-padel-yellow animate-pulse'
                                                )} />
                                                {nextMatch.status === 'CONFIRMED' ? 'Confirmé' : 'En attente de confirmation'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-3 shrink-0 mt-2 lg:mt-0">
                                        <div className="text-left lg:text-right">
                                            <p className="text-2xl sm:text-3xl lg:text-4xl font-display font-black italic text-white tracking-tighter leading-none">
                                                {nextMatch.totalPrice.toFixed(0)}€
                                            </p>
                                            <p className="text-[7px] sm:text-[8px] font-black text-white/20 uppercase tracking-widest mt-1">Total TTC</p>
                                        </div>
                                        <Link
                                            to="/my-reservations"
                                            className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center gap-2 sm:gap-3 group/manage"
                                        >
                                            GÉRER <ArrowUpRight size={12} className="sm:w-3.5 sm:h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                /* No upcoming match */
                                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-10 sm:items-center justify-between">
                                    <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl sm:rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/10 shrink-0">
                                            <Calendar size={28} className="sm:w-9 sm:h-9 lg:w-10 lg:h-10" />
                                        </div>
                                        <div>
                                            <h4 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white/30 italic uppercase tracking-tighter mb-2 sm:mb-3 leading-none">
                                                L'ARÈNE T'ATTEND
                                            </h4>
                                            <p className="text-[9px] sm:text-[10px] font-black text-white/20 uppercase tracking-widest italic">
                                                Réserve ton prochain terrain dès maintenant
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        to="/book"
                                        className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 lg:gap-4 px-6 sm:px-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl bg-padel-blue text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-padel-blue/40 hover:scale-105 transition-all shrink-0"
                                    >
                                        RÉSERVER <ChevronRight size={14} className="sm:w-4 sm:h-4" />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* ── Upcoming Matches Mini List ── */}
                    {!loadingBookings && upcomingBookings.length > 1 && (
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/[0.02] border border-white/5 rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] p-5 sm:p-6 lg:p-8 space-y-4 sm:space-y-5"
                        >
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-padel-blue animate-pulse" />
                                    <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/40 italic">Prochains matchs</h3>
                                </div>
                                <Link to="/my-reservations" className="text-[8px] sm:text-[9px] font-black text-padel-blue uppercase tracking-widest hover:underline">
                                    Voir tout
                                </Link>
                            </div>
                            <div className="space-y-3 sm:space-y-4">
                                {upcomingBookings.slice(1, 4).map((b, i) => {
                                    const sc = getSportColor(b.court?.sport);
                                    return (
                                        <motion.div
                                            key={b._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + i * 0.06 }}
                                            whileHover={{ x: 6 }}
                                            className="flex items-center justify-between group cursor-pointer border-l-2 border-white/5 pl-4 sm:pl-6 hover:border-padel-blue transition-all"
                                        >
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                <div style={{ color: sc, opacity: 0.7 }} className="[&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-7 sm:[&>svg]:h-7">
                                                    {getSportIcon(b.court?.sport)}
                                                </div>
                                                <div>
                                                    <p className="text-xs sm:text-sm font-black text-white italic uppercase leading-none group-hover:text-padel-blue transition-colors">
                                                        {b.court?.name || 'Terrain'}
                                                    </p>
                                                    <p className="text-[8px] sm:text-[9px] font-black text-white/25 uppercase tracking-widest mt-1">
                                                        {b.dateStr} • {b.timeStr.replace(':', 'h')}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-base sm:text-lg font-display font-black italic text-white">{b.totalPrice.toFixed(0)}€</p>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* ── Tournaments ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                        {/* Open Tournaments */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white/[0.03] backdrop-blur-xl border border-white/8 rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] p-6 sm:p-8 lg:p-10 relative overflow-hidden group shadow-xl"
                        >
                            <div className="absolute -top-10 -right-10 opacity-[0.04] group-hover:opacity-[0.08] transition-all duration-1000 rotate-12">
                                <Trophy size={120} className="sm:w-40 sm:h-40" />
                            </div>

                            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-padel-yellow/10 flex items-center justify-center text-padel-yellow mb-5 sm:mb-6 lg:mb-8 border border-padel-yellow/10 group-hover:scale-110 transition-transform">
                                <Trophy size={20} className="sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                            </div>
                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/20 mb-2 leading-none italic">Compétitions</p>

                            {loadingTournaments ? (
                                <div className="space-y-3">
                                    <Skeleton className="w-full h-6 sm:h-8" />
                                    <Skeleton className="w-3/4 h-4" />
                                </div>
                            ) : openTournaments.length > 0 ? (
                                <>
                                    <h4 className="text-xl sm:text-2xl lg:text-3xl font-display font-black text-white italic uppercase mb-1 tracking-tighter leading-none">
                                        {openTournaments[0].name}
                                    </h4>
                                    <p className="text-[8px] sm:text-[9px] font-black text-padel-blue uppercase tracking-widest mb-4 sm:mb-6 border-l-2 border-padel-blue pl-2 sm:pl-3">
                                        {openTournaments[0].sport} • {openTournaments[0].participants?.length || 0}/{openTournaments[0].maxParticipants} participants
                                    </p>
                                    <div className="text-lg sm:text-xl lg:text-2xl font-display font-black italic text-padel-yellow mb-5 sm:mb-6 lg:mb-8">
                                        {openTournaments[0].pricePerTeam}€ <span className="text-xs sm:text-sm font-bold text-white/30">/ équipe</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h4 className="text-xl sm:text-2xl lg:text-3xl font-display font-black text-white/30 italic uppercase mb-2 tracking-tighter">PAS DE TOURNOI</h4>
                                    <p className="text-[8px] sm:text-[9px] font-black text-white/20 uppercase tracking-widest mb-5 sm:mb-6 lg:mb-8 italic">Aucun tournoi ouvert pour le moment.</p>
                                </>
                            )}

                            <Link
                                to="/events"
                                className="w-full block py-3 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-padel-blue hover:border-padel-blue transition-all duration-500 text-center"
                            >
                                Voir les tournois
                            </Link>
                        </motion.div>

                        {/* Performance Chart */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white/[0.03] backdrop-blur-xl border border-white/8 rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] p-6 sm:p-8 lg:p-10 relative overflow-hidden group shadow-xl"
                        >
                            <div className="flex items-center justify-between mb-5 sm:mb-6 lg:mb-8">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-padel-blue/10 flex items-center justify-center text-padel-blue border border-padel-blue/10">
                                    <TrendingUp size={20} className="sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                                </div>
                                {!loadingBookings && stats.totalPlayed > 0 && (
                                    <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-green-500/10 text-green-500 text-[8px] sm:text-[10px] font-black uppercase tracking-widest flex items-center gap-1 sm:gap-2 border border-green-500/10">
                                        {stats.totalPlayed} joué{stats.totalPlayed > 1 ? 's' : ''} <ArrowUpRight size={10} className="sm:w-3 sm:h-3" />
                                    </div>
                                )}
                            </div>

                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/20 mb-2 leading-none italic">Activité</p>
                            <h4 className="text-xl sm:text-2xl lg:text-3xl font-display font-black text-white italic uppercase mb-1 tracking-tighter leading-none">GLOBAL SCORE</h4>
                            <p className="text-[8px] sm:text-[9px] font-black text-white/30 uppercase tracking-widest mb-6 sm:mb-8 lg:mb-10 italic">
                                {loadingBookings ? '...' : `${stats.totalPlayed} séance${stats.totalPlayed !== 1 ? 's' : ''} disputée${stats.totalPlayed !== 1 ? 's' : ''}`}
                            </p>

                            {/* Mini bar chart — last 8 bookings activity */}
                            {loadingBookings ? (
                                <div className="flex gap-1.5 sm:gap-2 h-10 sm:h-12 items-end">
                                    {[...Array(8)].map((_, i) => <div key={i} className="flex-1 h-full"><Skeleton className="w-full h-full rounded-t-lg" /></div>)}
                                </div>
                            ) : (
                                <div className="flex gap-1.5 sm:gap-2 lg:gap-2.5 h-10 sm:h-12 items-end">
                                    {(bookings.length > 0
                                        ? bookings.filter(b => b.status !== 'CANCELLED').slice(0, 8).map(b => b.totalPrice)
                                        : [30, 60, 45, 90, 65, 85, 55, 75]
                                    ).map((v, i, arr) => {
                                        const max = Math.max(...arr, 1);
                                        return (
                                            <motion.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${(v / max) * 100}%` }}
                                                transition={{ delay: 0.1 * i, duration: 0.8, ease: 'easeOut' }}
                                                className="flex-1 bg-padel-blue/30 rounded-t-lg group-hover:bg-padel-blue/70 transition-all duration-500"
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* ── Right Sidebar ── */}
                <div className="lg:col-span-4 space-y-6 md:space-y-8">
                    {/* Membership Card */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className={cn(
                            "border rounded-2xl sm:rounded-[2.5rem] lg:rounded-[3.5rem] p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden group shadow-2xl flex flex-col justify-between min-h-[320px] sm:min-h-[380px] lg:min-h-[440px]",
                            subscription ? "bg-padel-blue shadow-padel-blue/40 border-white/20" : "bg-[#151518]/80 border-white/10"
                        )}
                    >
                        <div className="absolute top-0 right-0 w-40 sm:w-60 lg:w-80 h-40 sm:h-60 lg:h-80 bg-white/10 rounded-full blur-[60px] sm:blur-[80px] lg:blur-[100px] -mr-20 sm:-mr-30 lg:-mr-40 -mt-20 sm:-mt-30 lg:-mt-40 group-hover:bg-padel-yellow/20 transition-all duration-1000 pointer-events-none" />
                        <div className="absolute bottom-10 left-10 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 bg-padel-yellow/20 rounded-full blur-2xl lg:blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6 sm:mb-8 lg:mb-12">
                                <div className="px-2 sm:px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[8px] sm:text-[9px] font-black uppercase tracking-widest italic">
                                    {loadingSubscription ? '...' : (subscription || confirmedSubRequest) ? 'PREMIUM' : 'NON ABONNÉ'}
                                </div>
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl">
                                    <Star size={20} className="sm:w-6 sm:h-6 text-padel-yellow" />
                                </div>
                            </div>
                            {loadingSubscription ? (
                                <div className="space-y-3">
                                    <Skeleton className="w-40 h-10 bg-white/10" />
                                    <Skeleton className="w-32 h-6 bg-white/10" />
                                </div>
                            ) : subscription ? (
                                <>
                                    <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-4xl font-display font-black italic uppercase leading-[0.75] mb-4 sm:mb-6 tracking-tighter">
                                        {subscription.name.split(' ').map((word, i) => (
                                            <span key={i}>{i === 0 ? word : <><br /><span className="text-padel-yellow">{word}</span></>}</span>
                                        ))}
                                    </h2>
                                    <p className="text-[9px] sm:text-[10px] font-bold text-white/50 uppercase tracking-[0.15em] sm:tracking-[0.2em] leading-relaxed italic">
                                        {subscription.features.length > 0
                                            ? subscription.features.slice(0, 2).join(' • ')
                                            : 'Avantages exclusifs activés'}
                                    </p>
                                </>
                            ) : confirmedSubRequest ? (
                                <>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 text-[9px] font-black uppercase tracking-widest mb-4">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Abonnement Actif
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-4xl font-display font-black italic uppercase leading-[0.75] mb-4 sm:mb-6 tracking-tighter text-emerald-500">
                                        {confirmedSubRequest.packName || 'ABONNEMENT'}
                                    </h2>
                                    <p className="text-[9px] sm:text-[10px] font-bold text-white/40 uppercase tracking-[0.15em] sm:tracking-[0.2em] leading-relaxed italic">
                                        Votre abonnement a été validé par nos équipes.
                                    </p>
                                </>
                            ) : pendingSubRequest ? (
                                <>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-padel-yellow/20 border border-padel-yellow/30 text-padel-yellow text-[9px] font-black uppercase tracking-widest mb-4 animate-pulse">
                                        <span className="w-1.5 h-1.5 rounded-full bg-padel-yellow" /> En attente de validation
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-4xl font-display font-black italic uppercase leading-[0.75] mb-4 sm:mb-6 tracking-tighter text-padel-yellow">
                                        {pendingSubRequest.packName || 'ABONNEMENT'}
                                    </h2>
                                    <p className="text-[9px] sm:text-[10px] font-bold text-white/40 uppercase tracking-[0.15em] sm:tracking-[0.2em] leading-relaxed italic">
                                        Votre demande est en cours de traitement par nos équipes.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-3xl sm:text-4xl lg:text-4xl font-display font-black italic uppercase leading-[0.75] mb-4 sm:mb-6 tracking-tighter text-white/50">
                                        PAS <br /><span className="text-white/30">D'ABONNEMENT</span>
                                    </h2>
                                    <p className="text-[9px] sm:text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] sm:tracking-[0.2em] leading-relaxed italic">
                                        Souscris pour des avantages exclusifs
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="relative z-10 space-y-3 sm:space-y-4 mt-6 sm:mt-8 lg:mt-10">
                            {/* Quick stats */}
                            <div className="grid grid-cols-2 gap-2 mb-2">
                                {[
                                    { label: 'À venir', value: stats.upcoming },
                                    { label: 'Total joués', value: stats.totalPlayed },
                                ].map((s, i) => (
                                    <div key={i} className="bg-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
                                        <p className="text-lg sm:text-xl lg:text-2xl font-display font-black italic text-white">
                                            {loadingBookings ? '–' : s.value}
                                        </p>
                                        <p className="text-[6px] sm:text-[7px] font-black text-white/50 uppercase tracking-widest mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="h-px bg-white/10" />
                            <Link to="/my-reservations" className="flex items-center justify-between group/link bg-white/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] italic">
                                    Mes réservations
                                </span>
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-padel-yellow text-padel-blue flex items-center justify-center group-hover/link:scale-110 transition-all shadow-lg shadow-black/20">
                                    <ChevronRight size={14} className="sm:w-[18px] sm:h-[18px]" />
                                </div>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-[#151518]/60 backdrop-blur-2xl border border-white/8 rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] p-5 sm:p-6 lg:p-8 shadow-2xl"
                    >
                        <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6 lg:mb-8">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-padel-yellow" />
                            <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/40 italic">Actions rapides</h3>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                            {[
                                { label: 'Réserver un terrain', sub: 'Padel · Pickleball · Badminton', icon: <Zap size={16} className="sm:w-[18px] sm:h-[18px]" />, to: '/book', color: '#1349D3' },
                                { label: 'Mon Portefeuille', sub: 'Gérer mes crédits', icon: <CreditCard size={16} className="sm:w-[18px] sm:h-[18px]" />, to: '/wallet', color: '#0066FF' },
                                { label: 'Voir mes réservations', sub: 'Gérer & annuler', icon: <Calendar size={16} className="sm:w-[18px] sm:h-[18px]" />, to: '/my-reservations', color: '#22c55e' },
                                { label: 'Tournois ouverts', sub: `${openTournaments.length} tournoi${openTournaments.length !== 1 ? 's' : ''} disponible`, icon: <Trophy size={16} className="sm:w-[18px] sm:h-[18px]" />, to: '/events', color: '#FFD21F' },
                            ].map((action, i) => (
                                <Link
                                    key={i}
                                    to={action.to}
                                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all group"
                                >
                                    <div
                                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                                        style={{ backgroundColor: action.color + '18', color: action.color }}
                                    >
                                        {action.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] sm:text-[11px] font-black text-white uppercase tracking-widest leading-none truncate">{action.label}</p>
                                        <p className="text-[7px] sm:text-[8px] font-black text-white/20 uppercase tracking-widest mt-1">{action.sub}</p>
                                    </div>
                                    <ChevronRight size={12} className="sm:w-3.5 sm:h-3.5 text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
