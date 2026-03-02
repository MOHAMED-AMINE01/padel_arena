import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Calendar,
    Clock,
    Download,
    History,
    XCircle,
    CheckCircle2,
    Trash2,
    Sparkles,
    CreditCard,
    ArrowUpRight,
    Search,
    Loader2,
    AlertCircle,
    MapPin,
    Zap,
    Trophy,
    Gamepad2,
    Eye,
    X,
    AlertTriangle,
    ChevronRight,
    ChevronLeft,
    RefreshCcw,
    ShieldCheck,
    Timer
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
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
        pricePerHour: number;
    } | null;
    createdAt: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
}

function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function getDurationMin(start: string, end: string) {
    return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
}

function formatDuration(min: number) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h}h${m > 0 ? m : ''}` : `${m}min`;
}

function isUpcoming(b: Booking) {
    return new Date(b.startTime) > new Date() && b.status !== 'CANCELLED';
}

function isPast(b: Booking) {
    return new Date(b.startTime) <= new Date() && b.status !== 'CANCELLED';
}

function isCancelled(b: Booking) {
    return b.status === 'CANCELLED';
}

function canCancel(b: Booking) {
    const now = new Date();
    const start = new Date(b.startTime);
    const diffH = (start.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffH > 24 && b.status !== 'CANCELLED';
}

function getSportMeta(sport?: string) {
    switch (sport) {
        case 'Pickleball': return { color: '#FFD21F', icon: <Zap size={20} /> };
        case 'Badminton': return { color: '#ffffff', icon: <Trophy size={20} /> };
        default: return { color: '#1349D3', icon: <Gamepad2 size={20} /> };
    }
}

function getStatusMeta(status: Booking['status']) {
    switch (status) {
        case 'CONFIRMED': return { label: 'Confirmé', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', dot: 'bg-green-500' };
        case 'PENDING': return { label: 'En attente', color: 'text-padel-yellow', bg: 'bg-padel-yellow/10', border: 'border-padel-yellow/20', dot: 'bg-padel-yellow animate-pulse' };
        case 'COMPLETED': return { label: 'Terminé', color: 'text-white/40', bg: 'bg-white/5', border: 'border-white/10', dot: 'bg-white/20' };
        case 'CANCELLED': return { label: 'Annulé', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-500' };
    }
}

function getPaymentMeta(status: Booking['paymentStatus']) {
    switch (status) {
        case 'PAID': return { label: 'Payé', color: 'text-green-400' };
        case 'REFUNDED': return { label: 'Remboursé', color: 'text-blue-400' };
        default: return { label: 'Non payé', color: 'text-padel-yellow' };
    }
}

// ─── Sub-Components ──────────────────────────────────────────────────────────
function BookingCard({
    booking,
    onCancel,
    cancelling
}: {
    booking: Booking;
    onCancel: (id: string) => void;
    cancelling: boolean;
}) {
    const status = getStatusMeta(booking.status);
    const payment = getPaymentMeta(booking.paymentStatus);
    const sport = getSportMeta(booking.court?.sport);
    const durationMin = getDurationMin(booking.startTime, booking.endTime);
    const upcoming = isUpcoming(booking);
    const cancelable = canCancel(booking);

    const refId = `#${booking._id.slice(-6).toUpperCase()}`;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            whileHover={{ scale: 1.004, y: -2 }}
            className="bg-[#151518]/60 backdrop-blur-2xl border border-white/8 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-7 md:p-10 group relative overflow-hidden shadow-xl hover:border-white/15 transition-all duration-500"
        >
            {/* Glow */}
            <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
                style={{ backgroundColor: `${sport.color}08` }}
            />

            <div className="flex flex-col xl:flex-row xl:items-center gap-4 sm:gap-8 relative z-10">
                {/* ── Left: Icon + Info ── */}
                <div className="flex items-start sm:items-center gap-4 sm:gap-7 flex-1">
                    {/* Sport icon */}
                    <div
                        className="shrink-0 w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-[1.75rem] flex items-center justify-center border shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-700"
                        style={{
                            backgroundColor: `${sport.color}15`,
                            color: sport.color,
                            borderColor: `${sport.color}25`
                        }}
                    >
                        {React.cloneElement(sport.icon as React.ReactElement, { size: 24, className: 'sm:w-8 sm:h-8' })}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                        {/* Court name + status */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <h3 className="text-lg sm:text-2xl md:text-3xl font-display font-black text-white italic uppercase tracking-tighter truncate">
                                {booking.court?.name || 'Terrain inconnu'}
                            </h3>
                            <div className={cn(
                                'flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[7px] sm:text-[8px] font-black uppercase tracking-wider sm:tracking-widest border backdrop-blur-sm flex-shrink-0',
                                status.color, status.bg, status.border
                            )}>
                                <div className={cn('w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full', status.dot)} />
                                {status.label}
                            </div>
                            <div className="hidden sm:flex px-3 py-1 rounded-full bg-white/5 border border-white/8 text-white/25 text-[8px] font-black uppercase tracking-widest flex-shrink-0">
                                {refId}
                            </div>
                        </div>

                        {/* Date, Time, Duration */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 md:gap-6">
                            <span className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-black text-white/40 uppercase tracking-wider sm:tracking-widest italic">
                                <Calendar size={11} className="text-padel-blue shrink-0 sm:w-[13px] sm:h-[13px]" />
                                {formatDate(booking.startTime)}
                            </span>
                            <span className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-black text-white/40 uppercase tracking-wider sm:tracking-widest italic">
                                <Clock size={11} className="text-padel-blue shrink-0 sm:w-[13px] sm:h-[13px]" />
                                {formatTime(booking.startTime)} → {formatTime(booking.endTime)}
                            </span>
                            <span className="hidden sm:flex items-center gap-2 text-[10px] font-black text-white/25 uppercase tracking-widest">
                                <Timer size={13} />
                                {formatDuration(durationMin)}
                            </span>
                        </div>

                        {/* Type + Payment - visible on sm+ */}
                        <div className="hidden sm:flex flex-wrap items-center gap-4 mt-3">
                            {booking.court?.type && (
                                <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded-lg">
                                    {booking.court.type}
                                </div>
                            )}
                            <div className={cn('text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5', payment.color)}>
                                <CreditCard size={11} /> {payment.label}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Right: Price + Actions ── */}
                <div className="flex flex-row xl:flex-col items-center xl:items-end justify-between sm:justify-start gap-3 sm:gap-5 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    {/* Price + mobile ref */}
                    <div className="flex items-center gap-3 sm:block text-left sm:text-right">
                        <p className="text-2xl sm:text-4xl font-display font-black italic text-white tracking-tighter leading-none">
                            {booking.totalPrice.toFixed(0)}€
                        </p>
                        <p className="text-[7px] sm:text-[8px] font-black text-white/20 uppercase tracking-widest mt-0 sm:mt-1">
                            <span className="sm:hidden">{refId} ·</span> Total TTC
                        </p>
                    </div>

                    {/* Action buttons */}
                    {upcoming && (
                        <div className="flex gap-2 sm:gap-3 flex-wrap xl:flex-nowrap">
                            {cancelable ? (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onCancel(booking._id)}
                                    disabled={cancelling}
                                    className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500/40 text-[8px] sm:text-[9px] font-black uppercase tracking-wider sm:tracking-widest hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {cancelling ? (
                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}>
                                            <Loader2 size={12} className="sm:w-[14px] sm:h-[14px]" />
                                        </motion.div>
                                    ) : (
                                        <><Trash2 size={12} className="sm:w-[14px] sm:h-[14px]" /> Annuler</>
                                    )}
                                </motion.button>
                            ) : (
                                <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-white/[0.02] border border-white/5 text-[7px] sm:text-[8px] font-black text-white/20 uppercase tracking-wider sm:tracking-widest italic">
                                    <ShieldCheck size={10} className="sm:w-[11px] sm:h-[11px]" /> Non annulable
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// ─── Empty State ─────────────────────────────────────────────────────────────
function EmptyState({ tab }: { tab: string }) {
    const messages: Record<string, { title: string; sub: string; cta: boolean }> = {
        A_VENIR: { title: 'Aucun match à venir', sub: "L'arène t'attend. Réserve ton premier terrain dès maintenant.", cta: true },
        PASSEES: { title: 'Aucun historique', sub: 'Tes futures victoires et moments de gloire s\'afficheront ici.', cta: false },
        ANNULEES: { title: 'Aucune annulation', sub: 'Bonne nouvelle — aucune réservation annulée.', cta: false },
    };
    const msg = messages[tab] || messages['A_VENIR'];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#151518]/40 border border-white/5 rounded-2xl sm:rounded-[3.5rem] p-8 sm:p-14 md:p-20 text-center relative overflow-hidden"
        >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 sm:w-80 h-60 sm:h-80 bg-padel-blue/5 rounded-full blur-[120px] pointer-events-none" />
            <motion.div
                animate={{ rotate: [0, 6, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="w-16 h-16 sm:w-24 sm:h-24 bg-white/[0.03] rounded-2xl sm:rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 sm:mb-10 border border-white/5"
            >
                <History size={28} className="text-white/10 sm:w-11 sm:h-11" />
            </motion.div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-white italic uppercase tracking-tighter mb-2 sm:mb-4">{msg.title}</h3>
            <p className="text-white/20 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] max-w-xs mx-auto mb-6 sm:mb-10 italic leading-relaxed">{msg.sub}</p>
            {msg.cta && (
                <Link
                    to="/book"
                    className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-5 rounded-xl sm:rounded-2xl bg-padel-blue shadow-2xl shadow-padel-blue/30 text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest text-white hover:scale-105 transition-all"
                >
                    Réserver un match <ArrowUpRight size={14} className="sm:w-4 sm:h-4" />
                </Link>
            )}
        </motion.div>
    );
}

// ─── Cancel Modal ─────────────────────────────────────────────────────────────
function CancelModal({
    onConfirm,
    onClose,
    loading
}: {
    onConfirm: () => void;
    onClose: () => void;
    loading: boolean;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" onClick={onClose} />
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative z-10 bg-[#1a1a1e] border border-white/10 rounded-2xl sm:rounded-[3rem] p-6 sm:p-10 max-w-md w-full shadow-2xl text-center mx-4"
            >
                <motion.div
                    animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-14 h-14 sm:w-20 sm:h-20 bg-red-500/10 rounded-xl sm:rounded-[2rem] flex items-center justify-center mx-auto mb-5 sm:mb-8 border border-red-500/20"
                >
                    <AlertTriangle size={28} className="text-red-500 sm:w-10 sm:h-10" />
                </motion.div>
                <h3 className="text-xl sm:text-3xl font-display font-black text-white italic uppercase tracking-tighter mb-2 sm:mb-3">Annuler ce match ?</h3>
                <p className="text-white/30 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] leading-relaxed mb-6 sm:mb-10 italic px-2">
                    Cette action est irréversible. La réservation sera annulée et tu ne pourras pas récupérer ce créneau.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 sm:py-5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-white/60 text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all"
                    >
                        Garder
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 py-3.5 sm:py-5 rounded-xl sm:rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 hover:text-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}>
                                <Loader2 size={14} className="sm:w-4 sm:h-4" />
                            </motion.div>
                        ) : (
                            <><Trash2 size={14} className="sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Confirmer l'annulation</span><span className="sm:hidden">Annuler</span></>
                        )}
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function PlayerReservations() {
    const [activeTab, setActiveTab] = useState<'A_VENIR' | 'PASSEES' | 'ANNULEES'>('A_VENIR');
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [cancelModal, setCancelModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
    const [cancelling, setCancelling] = useState(false);
    const [cancelSuccess, setCancelSuccess] = useState(false);
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 6;

    // Reset page when tab or search changes
    useEffect(() => { setPage(1); }, [activeTab, search]);

    // ── Fetch bookings
    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/bookings/me');
            setBookings(res.data.data || []);
        } catch {
            setError('Impossible de charger vos réservations.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchBookings(); }, [fetchBookings]);

    // ── Cancel booking
    const handleCancel = async () => {
        if (!cancelModal.id) return;
        setCancelling(true);
        try {
            await api.delete(`/bookings/${cancelModal.id}`);
            setBookings(prev => prev.map(b =>
                b._id === cancelModal.id ? { ...b, status: 'CANCELLED' as const } : b
            ));
            setCancelSuccess(true);
            setCancelModal({ open: false, id: null });
            setTimeout(() => setCancelSuccess(false), 3000);
        } catch {
            // error handled by modal
        } finally {
            setCancelling(false);
        }
    };

    // ── Filter by tab
    const filtered = bookings.filter(b => {
        const searchLower = search.toLowerCase();
        const matchesSearch = !search ||
            (b.court?.name?.toLowerCase().includes(searchLower)) ||
            b._id.toLowerCase().includes(searchLower) ||
            (b.court?.sport?.toLowerCase().includes(searchLower));

        switch (activeTab) {
            case 'A_VENIR': return isUpcoming(b) && matchesSearch;
            case 'PASSEES': return isPast(b) && matchesSearch;
            case 'ANNULEES': return isCancelled(b) && matchesSearch;
        }
    });

    // ── Pagination
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginatedBookings = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    // ── Stats
    const upcomingCount = bookings.filter(isUpcoming).length;
    const totalSpent = bookings
        .filter(b => b.status !== 'CANCELLED' && b.paymentStatus === 'PAID')
        .reduce((acc, b) => acc + b.totalPrice, 0);
    const cancelledCount = bookings.filter(isCancelled).length;

    const TABS = [
        { id: 'A_VENIR', label: 'À venir', count: bookings.filter(isUpcoming).length },
        { id: 'PASSEES', label: 'Passées', count: bookings.filter(isPast).length },
        { id: 'ANNULEES', label: 'Annulées', count: bookings.filter(isCancelled).length },
    ];

    return (
        <div className="space-y-10 pb-20">

            {/* ── Cancel Modal ── */}
            <AnimatePresence>
                {cancelModal.open && (
                    <CancelModal
                        onConfirm={handleCancel}
                        onClose={() => setCancelModal({ open: false, id: null })}
                        loading={cancelling}
                    />
                )}
            </AnimatePresence>

            {/* ── Success Toast ── */}
            <AnimatePresence>
                {cancelSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 40, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 40, x: '-50%' }}
                        className="fixed bottom-4 sm:bottom-8 left-1/2 z-[300] flex items-center gap-2 sm:gap-4 px-4 sm:px-8 py-3 sm:py-5 bg-green-500/15 border border-green-500/30 rounded-xl sm:rounded-2xl backdrop-blur-2xl shadow-2xl max-w-[90vw]"
                    >
                        <CheckCircle2 size={16} className="text-green-400 shrink-0 sm:w-5 sm:h-5" />
                        <p className="text-[9px] sm:text-[11px] font-black text-green-400 uppercase tracking-wider sm:tracking-widest italic">Réservation annulée avec succès.</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Header ── */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-8"
            >
                <div className="space-y-2 sm:space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="px-2 sm:px-3 py-1 rounded-full bg-padel-blue/10 border border-padel-blue/20 text-padel-blue text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] flex items-center gap-2">
                            <History size={12} /> <span className="hidden sm:inline">Historique des Matchs</span><span className="sm:hidden">Historique</span>
                        </div>
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black text-white italic uppercase tracking-tighter leading-none">
                        MES <br className="hidden md:block" />
                        <span className="text-padel-blue drop-shadow-[0_0_30px_rgba(19,73,211,0.2)]">RÉSERVATIONS</span>
                    </h1>
                </div>

                <div className="flex gap-3 sm:gap-4">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        onClick={fetchBookings}
                        className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/8 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <RefreshCcw size={14} className="text-padel-blue sm:w-4 sm:h-4" /> Actualiser
                    </motion.button>
                </div>
            </motion.div>

            {/* ── Stats Row ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
            >
                {[
                    { label: 'Matchs à venir', value: upcomingCount, color: '#1349D3', icon: <Calendar size={20} /> },
                    { label: 'Total dépensé', value: `${totalSpent.toFixed(0)}€`, color: '#FFD21F', icon: <CreditCard size={20} /> },
                    { label: 'Annulations', value: cancelledCount, color: '#ef4444', icon: <XCircle size={20} /> },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.07 }}
                        className="bg-[#151518]/50 border border-white/5 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 md:p-8 relative overflow-hidden group hover:border-white/10 transition-all"
                    >
                        <div
                            className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
                            style={{ backgroundColor: stat.color }}
                        />
                        <div className="flex items-center sm:items-start justify-between sm:mb-4 relative z-10">
                            <div className="flex items-center gap-3 sm:block">
                                <div style={{ color: `${stat.color}99` }}>{stat.icon}</div>
                                <p className="sm:hidden text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{stat.label}</p>
                            </div>
                            <p className="sm:hidden text-2xl font-display font-black italic text-white tracking-tighter leading-none">{stat.value}</p>
                        </div>
                        <p className="hidden sm:block text-3xl md:text-4xl font-display font-black italic text-white tracking-tighter leading-none relative z-10">{stat.value}</p>
                        <p className="hidden sm:block text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mt-2 relative z-10">{stat.label}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* ── Tabs + Search ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-3 sm:gap-4 p-2 sm:p-2 rounded-2xl sm:rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl"
            >
                {/* Tabs - scrollable on mobile */}
                <div className="flex overflow-x-auto p-1 scrollbar-hide -mx-1 px-1">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                'flex-shrink-0 flex items-center justify-center gap-1.5 sm:gap-2.5 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest transition-all duration-500 relative overflow-hidden whitespace-nowrap',
                                activeTab === tab.id
                                    ? 'bg-padel-blue text-white shadow-xl shadow-padel-blue/20'
                                    : 'text-white/30 hover:text-white hover:bg-white/5'
                            )}
                        >
                            <span>{tab.label}</span>
                            {tab.count > 0 && (
                                <span className={cn(
                                    'text-[8px] font-black px-1.5 py-0.5 rounded-full',
                                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-white/5 text-white/30'
                                )}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-3 mx-1 sm:mx-2 bg-white/[0.03] border border-white/8 rounded-xl sm:rounded-2xl group focus-within:border-padel-blue/40 transition-all">
                    <Search size={14} className="text-white/20 group-focus-within:text-padel-blue transition-colors shrink-0 sm:w-[15px] sm:h-[15px]" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Rechercher..."
                        className="bg-transparent text-[9px] sm:text-[10px] font-black text-white/60 uppercase tracking-widest placeholder:text-white/20 outline-none w-full sm:w-36 md:w-48"
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className="text-white/20 hover:text-white transition-colors">
                            <X size={14} />
                        </button>
                    )}
                </div>
            </motion.div>

            {/* ── Content ── */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-16 sm:py-32 gap-4 sm:gap-6"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        >
                            <Loader2 size={32} className="text-padel-blue sm:w-11 sm:h-11" />
                        </motion.div>
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/20 italic animate-pulse">
                            Chargement de vos matchs...
                        </p>
                    </motion.div>
                ) : error ? (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-12 sm:py-24 gap-4 sm:gap-6 bg-red-500/5 border border-red-500/10 rounded-2xl sm:rounded-[3rem] px-4"
                    >
                        <AlertCircle size={32} className="text-red-500/40 sm:w-11 sm:h-11" />
                        <p className="text-[9px] sm:text-[11px] font-black uppercase tracking-wider sm:tracking-widest text-red-500/50 text-center">{error}</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={fetchBookings}
                            className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-all"
                        >
                            Réessayer
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ type: 'spring', damping: 20 }}
                        className="space-y-5"
                    >
                        <AnimatePresence mode="popLayout">
                            {filtered.length === 0 ? (
                                <React.Fragment key="empty">
                                    <EmptyState tab={activeTab} />
                                </React.Fragment>
                            ) : (
                                paginatedBookings.map(booking => (
                                    <React.Fragment key={booking._id}>
                                        <BookingCard
                                            booking={booking}
                                            onCancel={(id) => setCancelModal({ open: true, id })}
                                            cancelling={cancelling && cancelModal.id === booking._id}
                                        />
                                    </React.Fragment>
                                ))
                            )}
                        </AnimatePresence>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center justify-center gap-2 sm:gap-3 pt-6"
                            >
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                <div className="flex items-center gap-1 sm:gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={cn(
                                                'w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all',
                                                page === p
                                                    ? 'bg-padel-blue text-white shadow-lg shadow-padel-blue/30'
                                                    : 'bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10'
                                            )}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Quick Book CTA ── */}
            {!loading && !error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center pt-4"
                >
                    <Link
                        to="/book"
                        className="flex items-center gap-3 sm:gap-4 px-5 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-padel-blue/30 transition-all group w-full sm:w-auto justify-center sm:justify-start"
                    >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-padel-blue/10 flex items-center justify-center text-padel-blue group-hover:bg-padel-blue group-hover:text-white transition-all shrink-0">
                            <ChevronRight size={18} className="sm:w-5 sm:h-5" />
                        </div>
                        <div className="text-left">
                            <p className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-wider sm:tracking-widest">Réserver un nouveau match</p>
                            <p className="text-[7px] sm:text-[8px] font-black text-white/20 uppercase tracking-wider sm:tracking-widest mt-0.5">Padel · Pickleball · Badminton</p>
                        </div>
                    </Link>
                </motion.div>
            )}
        </div>
    );
}
