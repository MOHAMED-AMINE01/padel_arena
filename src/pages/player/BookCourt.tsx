import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PromoCodeInput } from '../../components/player/PromoCodeInput';
import {
    Calendar,
    MapPin,
    Clock,
    ChevronRight,
    ArrowRight,
    CheckCircle2,
    Sparkles,
    Zap,
    CreditCard,
    Building2,
    X,
    ChevronLeft,
    Gamepad2,
    Users,
    Flame,
    Loader2,
    AlertCircle,
    ShieldCheck,
    History,
    Star,
    Wifi,
    Trophy,
    Timer,
    Target,
    Layout,
    Ticket
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Court {
    _id: string;
    name: string;
    type: string;
    sport: string;
    surface: string;
    pricePerHour: number;
    description: string;
}

interface Slot {
    time: string;
    available: boolean;
    price: number;
}

interface CourtSlots {
    courtId: string;
    courtName: string;
    type: string;
    slots: Slot[];
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SPORTS_META: Record<string, {
    color: string;
    gradient: string;
    tags: string[];
    longDesc: string;
    icon: React.ReactNode;
    players: string;
    features: string[];
}> = {
    Padel: {
        color: '#1349D3',
        gradient: 'from-blue-600/20 to-blue-900/5',
        tags: ['Populaire', 'Tactique'],
        longDesc: 'Découvrez le sport qui passionne le monde entier. Tactique et accessible.',
        icon: <Gamepad2 size={32} />,
        players: '4 joueurs',
        features: ['Filets inclus', 'Murs vitrés', 'Éclairage LED'],
    },
    Pickleball: {
        color: '#FFD21F',
        gradient: 'from-yellow-500/20 to-yellow-900/5',
        tags: ['Tendance', 'Fun'],
        longDesc: 'Un mélange de tennis et de ping-pong, parfait pour tous les âges.',
        icon: <Zap size={32} />,
        players: '2–4 joueurs',
        features: ['Raquettes incluses', 'Balles fournies', 'Court panoramique'],
    },
    Badminton: {
        color: '#ffffff',
        gradient: 'from-white/10 to-white/0',
        tags: ['Réflexes', 'Cardio'],
        longDesc: 'Le sport de raquette le plus rapide au monde. Défoulez-vous.',
        icon: <Trophy size={32} />,
        players: '2–4 joueurs',
        features: ['Volants fournis', 'Salle climatisée', 'Parquet pro'],
    },
    Golf: {
        color: '#2ECC71',
        gradient: 'from-green-500/20 to-green-900/5',
        tags: ['Premium', 'Simulateur'],
        longDesc: 'Les plus beaux parcours du monde en simulateur haute définition.',
        icon: <Star size={32} />,
        players: '1–4 joueurs',
        features: ['Simulateur HD', 'Clubs fournis', 'Parcours mondiaux'],
    },
};

// Fallback sports if no courts exist yet in DB
const FALLBACK_SPORTS = ['Padel', 'Pickleball', 'Badminton', 'Golf'];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function generateDateRange(count = 21) {
    const days: Date[] = [];
    const today = new Date();
    for (let i = 0; i < count; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        days.push(d);
    }
    return days;
}

function formatDateLabel(date: Date) {
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
}

function formatDateAPI(date: Date) {
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0')
    ].join('-');
}

function isPeakHour(time: string, date: Date) {
    const [h] = time.split(':').map(Number);
    return (h >= 12 && h < 14) || (h >= 17 && h < 22);
}

// ─── Step Labels ─────────────────────────────────────────────────────────────
const STEPS = [
    { label: 'Sport', sub: 'Choisissez votre discipline' },
    { label: 'Créneau', sub: 'Date & heure disponibles' },
    { label: 'Durée', sub: 'Temps de jeu souhaité' },
    { label: 'Terrain', sub: 'Sélectionnez le court' },
    { label: 'Validation', sub: 'Confirmez & payez' },
];

// Constants
const CLOSING_TIME = '22:00';
const DURATION_OPTIONS = [
    { value: 60, label: '1h', desc: 'Match rapide' },
    { value: 90, label: '1h30', desc: 'Standard' },
    { value: 120, label: '2h', desc: 'Session longue' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function PlayerBook() {
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();

    // ── Stepper
    const [step, setStep] = useState(1);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [bookingRef, setBookingRef] = useState<string | null>(null);

    // ── Selections
    const [selectedSport, setSelectedSport] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedDuration, setSelectedDuration] = useState<number>(60); // minutes
    const [selectedCourt, setSelectedCourt] = useState<CourtSlots | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'STRIPE' | 'WALLET'>('STRIPE');

    // ── Data — Sports are always fixed for this venue: 5 disciplines
    const [dates] = useState<Date[]>(generateDateRange(21));
    const [courtSlots, setCourtSlots] = useState<CourtSlots[]>([]);

    // ── Loading / Errors
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [loadingBook, setLoadingBook] = useState(false);
    const [slotsError, setSlotsError] = useState<string | null>(null);
    const [bookError, setBookError] = useState<string | null>(null);


    // ── Fetch slots when sport or date changes (step 2)
    const fetchSlots = useCallback(async () => {
        if (!selectedSport) return;
        setLoadingSlots(true);
        setSlotsError(null);
        try {
            const dateStr = formatDateAPI(selectedDate);
            const res = await api.get(`/bookings/available-slots?sport=${selectedSport}&date=${dateStr}`);
            setCourtSlots(res.data.data || []);
        } catch {
            setSlotsError('Impossible de charger les créneaux. Réessayez.');
            setCourtSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    }, [selectedSport, selectedDate]);

    useEffect(() => {
        if (step === 2) fetchSlots();
    }, [step, fetchSlots]);

    // Handle auto-duration adjustment for closing time
    useEffect(() => {
        if (selectedTime) {
            const [h, m] = selectedTime.split(':').map(Number);
            const totalStartMins = h * 60 + m;
            if (totalStartMins + selectedDuration > (22 * 60)) {
                if (totalStartMins === 1260) { // 21:00
                    setSelectedDuration(60);
                } else if (totalStartMins === 1230) { // 20:30
                    setSelectedDuration(90);
                } else {
                    setSelectedDuration(60);
                }
            }
        }
    }, [selectedTime]);

    // ── Flat all slots across all courts for step 2 display
    // We show merged slot availability: a slot is available if at least one court has it free
    const mergedSlots = React.useMemo(() => {
        if (courtSlots.length === 0) return [];
        const timeMap: Record<string, { available: boolean; price: number }> = {};
        const now = new Date();
        
        // Format today as YYYY-MM-DD in local time
        const todayStr = [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, '0'),
            String(now.getDate()).padStart(2, '0')
        ].join('-');
        
        const isToday = formatDateAPI(selectedDate) === todayStr;

        courtSlots.forEach(c => {
            c.slots.forEach(s => {
                let isAvailable = s.available;

                // Check if slot is in the past for today
                if (isToday && isAvailable) {
                    const [hours, minutes] = s.time.split(':').map(Number);
                    const slotTime = new Date();
                    slotTime.setHours(hours, minutes, 0, 0);
                    if (slotTime < now) {
                        isAvailable = false;
                    }
                }

                if (!timeMap[s.time]) {
                    timeMap[s.time] = { available: isAvailable, price: s.price };
                } else {
                    // If any court has it available, mark it available
                    if (isAvailable) timeMap[s.time].available = true;
                    // Use min price
                    if (s.price < timeMap[s.time].price) timeMap[s.time].price = s.price;
                }
            });
        });
        return Object.entries(timeMap)
            .map(([time, v]) => ({ time, ...v }))
            .sort((a, b) => a.time.localeCompare(b.time))
            .filter(slot => {
                const [h, m] = slot.time.split(':').map(Number);
                return h < 21 || (h === 21 && m === 0);
            });
    }, [courtSlots, selectedDate]);

    // Slots for selected court in step 3
    const selectedCourtSlots = React.useMemo(() => {
        if (!selectedCourt) return [];
        return selectedCourt.slots.filter(s => s.time === selectedTime);
    }, [selectedCourt, selectedTime]);

    // Courts that have the selected time available
    const availableCourts = React.useMemo(() => {
        if (!selectedTime) return [];
        return courtSlots.filter(c => c.slots.some(s => s.time === selectedTime && s.available));
    }, [courtSlots, selectedTime]);

    // Helper to calculate end time
    const getEndTime = useCallback((startTime: string, durationMinutes: number): string => {
        const [h, m] = startTime.split(':').map(Number);
        const totalMinutes = h * 60 + m + durationMinutes;
        const endH = Math.floor(totalMinutes / 60);
        const endM = totalMinutes % 60;
        return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
    }, []);

    // Check if a duration is available for the selected time
    const isDurationAvailable = useCallback((durationMinutes: number): { available: boolean; reason?: string } => {
        if (!selectedTime) return { available: false, reason: 'Sélectionnez un créneau' };

        const endTime = getEndTime(selectedTime, durationMinutes);

        // Check if duration exceeds closing time
        if (endTime > CLOSING_TIME) {
            return { available: false, reason: `Dépasse l'heure de fermeture (${CLOSING_TIME})` };
        }

        // Check conflicts with existing bookings for available courts
        // A duration is available if at least one court has the full slot free
        const hasAvailableCourt = courtSlots.some(court => {
            // Check all slots that would be occupied by this duration
            const startMinutes = parseInt(selectedTime.split(':')[0]) * 60 + parseInt(selectedTime.split(':')[1]);
            const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);

            // Check each 30-min interval within the duration
            for (let t = startMinutes; t < endMinutes; t += 30) {
                const timeStr = `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
                const slot = court.slots.find(s => s.time === timeStr);
                if (!slot || !slot.available) return false;
            }
            return true;
        });

        if (!hasAvailableCourt) {
            return { available: false, reason: 'Conflit avec une réservation existante' };
        }

        return { available: true };
    }, [selectedTime, courtSlots, getEndTime]);

    // Ajout état pour code promo et réduction
    const [promoDiscount, setPromoDiscount] = useState<number>(0);
    const [promoCode, setPromoCode] = useState<string>('');
    const handleBook = async () => {
        if (!selectedCourt || !selectedTime || !selectedDate) return;
        setLoadingBook(true);
        setBookError(null);

        try {
            // Force UTC: selected time stored as-is in UTC to avoid offset issues
            const _dd = [selectedDate.getFullYear(), String(selectedDate.getMonth() + 1).padStart(2, '0'), String(selectedDate.getDate()).padStart(2, '0')].join('-');
            const startTimeStr = `${_dd}T${selectedTime}:00.000Z`;
            const _startMs = new Date(startTimeStr).getTime();
            const endTimeStr = new Date(_startMs + selectedDuration * 60000).toISOString();

            // Explicit strings for email and display
            const formattedDate = [
                String(selectedDate.getDate()).padStart(2, '0'),
                String(selectedDate.getMonth() + 1).padStart(2, '0'),
                selectedDate.getFullYear()
            ].join('/');

            const res = await api.post('/bookings', {
                courtId: selectedCourt.courtId,
                startTime: startTimeStr,
                endTime: endTimeStr,
                timeStr: selectedTime,
                dateStr: formattedDate,
                promoCode: promoCode || undefined
            });

            const booking = res.data.data;

            if (paymentMethod === 'WALLET') {
                // Pay with Wallet
                const walletRes = await api.post('/payments/pay-with-wallet', {
                    bookingId: booking._id
                });
                if (walletRes.data.success) {
                    await refreshUser();
                    navigate(`/booking-success?booking_id=${booking._id}&method=wallet`);
                    return;
                }
            } else {
                // Stripe Checkout
                const stripeRes = await api.post('/payments/create-checkout-session', {
                    bookingId: booking._id,
                    courtName: selectedCourt.courtName,
                    amount: parseFloat(totalPrice),
                    customerEmail: user?.email,
                    successUrl: `${window.location.origin}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
                    cancelUrl: window.location.href
                });

                if (stripeRes.data.url) {
                    window.location.href = stripeRes.data.url;
                    return; 
                }
            }

            setBookingRef(booking._id?.toString().slice(-6).toUpperCase() || 'OK');
            setIsConfirmed(true);
        } catch (err: any) {
            setBookError(err?.response?.data?.message || 'Erreur lors de la réservation. Réessayez.');
        } finally {
            setLoadingBook(false);
        }
    };

    // Calculate total price based on duration segments
    const calculateBookingPrice = useCallback((court: CourtSlots | null, startTime: string | null, duration: number) => {
        if (!court || !startTime) return 0;
        const startH = parseInt(startTime.split(':')[0]);
        const startM = parseInt(startTime.split(':')[1]);
        const startTotalMins = startH * 60 + startM;
        const segments = duration / 30;
        let total = 0;
        for (let i = 0; i < segments; i++) {
            const currentMins = startTotalMins + (i * 30);
            const timeStr = `${String(Math.floor(currentMins / 60)).padStart(2, '0')}:${String(currentMins % 60).padStart(2, '0')}`;
            const slot = court.slots.find(s => s.time === timeStr);
            if (slot) {
                // Backend slot price is now price per hour, so 30 mins segment is price / 2
                total += slot.price / 2;
            }
        }
        return total;
    }, []);

    const basePrice = useMemo(() => {
        return calculateBookingPrice(selectedCourt, selectedTime, selectedDuration);
    }, [selectedCourt, selectedTime, selectedDuration, calculateBookingPrice]);

    const totalPrice = useMemo(() => {
        return Math.max(0, basePrice - promoDiscount).toFixed(2);
    }, [basePrice, promoDiscount]);

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pb-24 md:pb-32 pt-4 md:pt-8">

            {/* ── Header ── */}
            {!isConfirmed && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-14"
                >
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 lg:gap-8">
                        {/* Title */}
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                <div className="px-2.5 sm:px-3 py-1 rounded-full bg-padel-blue/10 border border-padel-blue/20 text-padel-blue text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] flex items-center gap-1.5 sm:gap-2">
                                    <Sparkles size={10} className="sm:w-3 sm:h-3" /> Arène
                                </div>
                                {selectedSport && (
                                    <div
                                        className="px-2.5 sm:px-3 py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest border"
                                        style={{
                                            backgroundColor: `${SPORTS_META[selectedSport]?.color || '#fff'}15`,
                                            borderColor: `${SPORTS_META[selectedSport]?.color || '#fff'}30`,
                                            color: SPORTS_META[selectedSport]?.color || '#fff',
                                        }}
                                    >
                                        {selectedSport}
                                    </div>
                                )}
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-black text-white italic uppercase tracking-tighter leading-none">
                                RÉSERVER<br />
                                <span className="text-padel-blue drop-shadow-[0_0_30px_rgba(19,73,211,0.3)]">UN MATCH</span>
                            </h1>
                        </div>

                        {/* Stepper */}
                        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 bg-white/[0.03] border border-white/8 p-2 sm:p-3 md:p-4 rounded-2xl md:rounded-[2rem] backdrop-blur-xl self-start lg:self-auto shrink-0 overflow-x-auto">
                            {STEPS.map((s, idx) => {
                                const i = idx + 1;
                                const done = step > i;
                                const active = step === i;
                                return (
                                    <div key={i} className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                                        <div className="flex flex-col items-center gap-1">
                                            <motion.div
                                                animate={active ? { scale: [1, 1.1, 1] } : {}}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                                className={cn(
                                                    'w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center text-[10px] sm:text-[11px] font-black transition-all duration-500 relative overflow-hidden',
                                                    done ? 'bg-green-500/20 text-green-400 border border-green-500/20'
                                                        : active ? 'bg-padel-blue text-white shadow-[0_0_24px_rgba(19,73,211,0.5)]'
                                                            : 'bg-white/5 text-white/20 border border-white/5'
                                                )}
                                            >
                                                {done ? <CheckCircle2 size={16} className="sm:w-[18px] sm:h-[18px]" /> : i}
                                                {active && (
                                                    <div className="absolute inset-0 bg-white/10 animate-ping rounded-lg md:rounded-xl opacity-30" />
                                                )}
                                            </motion.div>
                                            <p className={cn(
                                                'hidden md:block text-[7px] md:text-[8px] font-black uppercase tracking-widest leading-none',
                                                active ? 'text-white' : done ? 'text-green-500/60' : 'text-white/20'
                                            )}>{s.label}</p>
                                        </div>
                                        {i < STEPS.length && (
                                            <div className={cn(
                                                'w-3 sm:w-4 md:w-6 h-[2px] rounded-full transition-all duration-700',
                                                done ? 'bg-green-500/50' : step > i ? 'bg-padel-blue' : 'bg-white/8'
                                            )} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step sub-label */}
                    <div className="mt-6 flex items-center gap-4">
                        <div className="w-8 h-[2px] bg-padel-blue rounded-full" />
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 italic">
                            Étape {step} — {STEPS[step - 1]?.sub}
                        </p>
                    </div>
                </motion.div>
            )}

            {/* ── Content ── */}
            <AnimatePresence mode="wait">

                {/* ─── CONFIRMED ─── */}
                {isConfirmed && (
                    <motion.div
                        key="confirmed"
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: 'spring', damping: 18, stiffness: 120 }}
                        className="max-w-2xl mx-auto px-2 sm:px-0"
                    >
                        <div className="bg-[#151518]/80 backdrop-blur-2xl border border-white/10 rounded-3xl sm:rounded-[3.5rem] p-6 sm:p-10 md:p-12 text-center relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03]"><Trophy size={200} /></div>

                            <motion.div
                                initial={{ scale: 0, rotate: -30 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
                                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-green-500/15 text-green-400 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 sm:mb-8 md:mb-10 border border-green-500/20 shadow-[0_0_60px_rgba(34,197,94,0.2)]"
                            >
                                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-green-500/60 mb-3 italic">
                                    Réservation validée
                                </p>
                                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black text-white italic uppercase tracking-tighter mb-2 leading-none">
                                    MATCH CONFIRMÉ !
                                </h2>
                                {bookingRef && (
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-padel-blue mt-2">
                                        Réf. #{bookingRef}
                                    </p>
                                )}
                                <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.25em] mt-4 mb-12 italic">
                                    Prépare ton sac, l'arène t'attend. 🎉
                                </p>

                                {/* Booking Summary */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10 text-left">
                                    {[
                                        { icon: <Zap size={18} />, label: 'Sport', value: selectedSport || '–' },
                                        { icon: <MapPin size={18} />, label: 'Terrain', value: selectedCourt?.courtName || '–' },
                                        { icon: <Calendar size={18} />, label: 'Date', value: selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) },
                                        { icon: <Clock size={18} />, label: 'Heure', value: `${selectedTime} — ${selectedDuration >= 60 ? Math.floor(selectedDuration / 60) + 'h' : ''}${selectedDuration % 60 > 0 ? (selectedDuration % 60) : ''}` },
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 + i * 0.1 }}
                                            className="p-5 rounded-2xl bg-white/[0.03] border border-white/5"
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="text-padel-blue">{item.icon}</div>
                                                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">{item.label}</p>
                                            </div>
                                            <p className="text-sm font-black text-white italic uppercase tracking-tight leading-tight">{item.value}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link
                                        to="/dashboard"
                                        className="flex-1 px-8 py-5 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                    >
                                        Tableau de bord
                                    </Link>
                                    <Link
                                        to="/my-reservations"
                                        className="flex-1 px-8 py-5 rounded-2xl bg-padel-blue text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-padel-blue/30 hover:scale-105 transition-all flex items-center justify-center gap-3"
                                    >
                                        <History size={16} /> Mes réservations
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* ─── STEP 1 : Sport ─── */}
                {!isConfirmed && step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ type: 'spring', damping: 20 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
                    >
                        {FALLBACK_SPORTS.map((sport, idx) => {
                            const meta = SPORTS_META[sport] || { color: '#1349D3', gradient: 'from-blue-600/20 to-transparent', tags: [], longDesc: '', icon: <Zap size={32} />, players: '4 joueurs', features: [] };
                            return (
                                <motion.div
                                    key={sport}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.12 }}
                                    whileHover={{ y: -12, scale: 1.01 }}
                                    className="group relative cursor-pointer"
                                    onClick={() => { setSelectedSport(sport); setStep(2); }}
                                >
                                    <div className={cn(
                                        "bg-[#151518]/70 backdrop-blur-xl border border-white/8 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] md:rounded-[3rem] relative overflow-hidden transition-all duration-700 h-full",
                                        "hover:border-[2px] group-hover:shadow-2xl"
                                    )}
                                        style={{ '--tw-shadow-color': `${meta.color}40` } as any}
                                    >
                                        {/* BG Glow */}
                                        <div
                                            className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] -mr-24 -mt-24 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                                            style={{ backgroundColor: `${meta.color}20` }}
                                        />
                                        {/* Large bg icon */}
                                        <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 rotate-12">
                                            <div style={{ color: meta.color }}>
                                                {sport === 'Padel' ? <Gamepad2 size={160} /> : sport === 'Pickleball' ? <Zap size={160} /> : <Trophy size={160} />}
                                            </div>
                                        </div>

                                        <div className="relative z-10 h-full flex flex-col">
                                            {/* Icon */}
                                            <div
                                                className="w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] rounded-xl sm:rounded-2xl md:rounded-[1.5rem] flex items-center justify-center mb-4 sm:mb-6 md:mb-8 border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-2xl"
                                                style={{ backgroundColor: `${meta.color}18`, color: meta.color }}
                                            >
                                                <div className="scale-75 sm:scale-90 md:scale-100">{meta.icon}</div>
                                            </div>

                                            {/* Tags */}
                                            <div className="flex gap-2 flex-wrap mb-4">
                                                {meta.tags.map(tag => (
                                                    <span key={tag} className="text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/40">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Name & Desc */}
                                            <h3
                                                className="text-2xl sm:text-3xl md:text-4xl font-display font-black italic uppercase tracking-tighter mb-2 sm:mb-3 leading-none group-hover:drop-shadow-[0_0_20px_currentColor] transition-all"
                                                style={{ color: idx === 0 ? meta.color : 'white' }}
                                            >
                                                {sport}
                                            </h3>
                                            <p className="text-white/40 text-[11px] sm:text-xs leading-relaxed mb-4 sm:mb-6 flex-1">{meta.longDesc}</p>

                                            {/* Features */}
                                            <div className="space-y-1.5 sm:space-y-2 mb-6 sm:mb-8 hidden sm:block">
                                                {meta.features.map(f => (
                                                    <div key={f} className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-widest">
                                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
                                                        {f}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex -space-x-1.5">
                                                        {[1, 2, 3].map(i => (
                                                            <div key={i} className="w-6 h-6 rounded-full border-2 border-[#151518] bg-white/10" />
                                                        ))}
                                                    </div>
                                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest italic">{meta.players}</span>
                                                </div>
                                                <motion.div
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                                                    style={{ backgroundColor: meta.color }}
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    whileHover={{ rotate: 15 }}
                                                >
                                                    <ArrowRight size={18} />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}

                {/* ─── STEP 2 : Date & Créneau ─── */}
                {!isConfirmed && step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ type: 'spring', damping: 20 }}
                        className="space-y-10"
                    >
                        {/* Back */}
                        <button
                            onClick={() => setStep(1)}
                            className="group flex items-center gap-3 text-[10px] font-black text-white/30 hover:text-white uppercase tracking-widest transition-all"
                        >
                            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all border border-white/5">
                                <ChevronLeft size={16} />
                            </div>
                            Changer de sport
                        </button>

                        {/* Section title */}
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-padel-blue animate-pulse" />
                            <h3 className="text-sm font-display font-black text-white italic uppercase tracking-widest">
                                Planning <span className="text-padel-blue">{selectedSport}</span>
                            </h3>
                        </div>

                        {/* Date Picker */}
                        <div className="space-y-3 sm:space-y-4">
                            <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.4em] text-white/20 italic pl-1">Sélectionnez une date</p>
                            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-4 snap-x scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                                {dates.map((date, i) => {
                                    const label = formatDateLabel(date);
                                    const [weekday, dayNum] = label.split(' ');
                                    const isToday = i === 0;
                                    const selected = formatDateAPI(date) === formatDateAPI(selectedDate);
                                    return (
                                        <motion.button
                                            key={i}
                                            whileHover={{ y: -4 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedDate(date)}
                                            className={cn(
                                                'flex-shrink-0 w-[70px] sm:w-[85px] md:w-[100px] px-2 sm:px-3 md:px-4 py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl md:rounded-[2rem] border transition-all duration-500 snap-center flex flex-col items-center gap-1.5 sm:gap-2',
                                                selected
                                                    ? 'bg-padel-blue border-padel-blue shadow-[0_15px_40px_rgba(19,73,211,0.4)]'
                                                    : 'bg-[#151518]/60 border-white/8 hover:bg-white/5 hover:border-white/20'
                                            )}
                                        >
                                            <p className={cn('text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em]', selected ? 'text-white/70' : 'text-white/25')}>
                                                {isToday ? "Auj." : weekday}
                                            </p>
                                            <p className={cn('text-lg sm:text-xl md:text-2xl font-display font-black italic leading-none', selected ? 'text-white' : 'text-white/60')}>
                                                {dayNum}
                                            </p>
                                            <div className={cn(
                                                'w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-all',
                                                selected ? 'bg-white scale-150 shadow-[0_0_8px_white]' : 'bg-white/10'
                                            )} />
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Slot Grid */}
                        <div className="space-y-4 sm:space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                                <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/20 italic">
                                    <Clock size={12} className="inline mr-2 text-padel-blue" />
                                    Créneaux disponibles
                                </p>
                                <div className="flex items-center gap-2 sm:gap-4 text-[7px] sm:text-[8px] font-black uppercase tracking-widest">
                                    <span className="flex items-center gap-1 sm:gap-1.5 text-green-500/60"><div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500/50" />Libre</span>
                                    <span className="flex items-center gap-1 sm:gap-1.5 text-padel-yellow/60"><Flame size={10} />Pointe</span>
                                    <span className="flex items-center gap-1 sm:gap-1.5 text-white/20"><X size={10} />Indispo</span>
                                </div>
                            </div>

                            {loadingSlots ? (
                                <div className="flex flex-col items-center justify-center py-24 gap-5">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                    >
                                        <Loader2 size={40} className="text-padel-blue" />
                                    </motion.div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic animate-pulse">Chargement des créneaux...</p>
                                </div>
                            ) : slotsError ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-5 bg-red-500/5 border border-red-500/10 rounded-[2.5rem]">
                                    <AlertCircle size={40} className="text-red-500/50" />
                                    <p className="text-[11px] font-black uppercase tracking-widest text-red-500/50">{slotsError}</p>
                                    <button onClick={fetchSlots} className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all">
                                        Réessayer
                                    </button>
                                </div>
                            ) : mergedSlots.length === 0 ? (
                                <div className="flex flex-col items-center gap-5 py-20 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                                    <Calendar size={40} className="text-white/10" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">Aucun terrain disponible pour ce sport ce jour-là.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3">
                                    {mergedSlots.map((slot, i) => {
                                        const peak = isPeakHour(slot.time, selectedDate);
                                        return (
                                            <motion.button
                                                key={slot.time}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.025 }}
                                                whileHover={slot.available ? { y: -6, scale: 1.05 } : {}}
                                                whileTap={slot.available ? { scale: 0.95 } : {}}
                                                disabled={!slot.available}
                                                onClick={() => {
                                                    if (!slot.available) return;
                                                    setSelectedTime(slot.time);
                                                    setStep(3); // Go to duration step
                                                }}
                                                className={cn(
                                                    'relative p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl md:rounded-[1.75rem] border flex flex-col items-center gap-1.5 sm:gap-2 md:gap-2.5 transition-all duration-500 group overflow-hidden',
                                                    !slot.available
                                                        ? 'bg-white/[0.01] border-white/5 opacity-40 cursor-not-allowed border-dashed'
                                                        : peak
                                                            ? 'bg-[#151518]/60 border-white/8 hover:bg-padel-yellow/10 hover:border-padel-yellow/40 shadow-lg cursor-pointer'
                                                            : 'bg-[#151518]/60 border-white/8 hover:bg-padel-blue/10 hover:border-padel-blue/40 shadow-lg cursor-pointer'
                                                )}
                                            >
                                                {slot.available && peak && (
                                                    <div className="absolute top-1.5 right-1.5">
                                                        <Flame size={10} className="text-padel-yellow animate-pulse" />
                                                    </div>
                                                )}
                                                {slot.available && !peak && (
                                                    <div className="absolute top-1.5 right-1.5">
                                                        <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                    </div>
                                                )}
                                                <span className="text-base sm:text-lg md:text-xl font-display font-black text-white italic tracking-tighter leading-none group-hover:scale-110 transition-transform">
                                                    {slot.time}
                                                </span>
                                                {!slot.available && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                                        <X size={18} className="text-white/10" />
                                                    </div>
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* ─── STEP 3 : Duration Selection ─── */}
                {!isConfirmed && step === 3 && (
                    <motion.div
                        key="step3-duration"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ type: 'spring', damping: 20 }}
                        className="space-y-10"
                    >
                        <button
                            onClick={() => { setStep(2); setSelectedTime(null); }}
                            className="group flex items-center gap-3 text-[10px] font-black text-white/30 hover:text-white uppercase tracking-widest transition-all"
                        >
                            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all border border-white/5">
                                <ChevronLeft size={16} />
                            </div>
                            Modifier le créneau
                        </button>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <div className="w-2 h-2 rounded-full bg-padel-blue animate-pulse" />
                            <h3 className="text-xs sm:text-sm font-display font-black text-white italic uppercase tracking-wider sm:tracking-widest">
                                Créneau <span className="text-padel-blue">{selectedTime}</span> — Choisissez votre durée
                            </h3>
                        </div>

                        {/* Duration Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                            {DURATION_OPTIONS.map((option, idx) => {
                                const availability = isDurationAvailable(option.value);
                                const isSelected = selectedDuration === option.value;
                                return (
                                    <motion.button
                                        key={option.value}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        whileHover={availability.available ? { y: -6, scale: 1.02 } : {}}
                                        whileTap={availability.available ? { scale: 0.98 } : {}}
                                        disabled={!availability.available}
                                        onClick={() => availability.available && setSelectedDuration(option.value)}
                                        className={cn(
                                            'relative text-center p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border transition-all duration-500 overflow-hidden group',
                                            !availability.available
                                                ? 'bg-white/[0.01] border-white/5 opacity-30 cursor-not-allowed'
                                                : isSelected
                                                    ? 'border-padel-blue bg-padel-blue/10 shadow-[0_0_40px_rgba(19,73,211,0.3)]'
                                                    : 'bg-[#151518]/60 border-white/8 hover:border-padel-blue/40 hover:bg-padel-blue/5'
                                        )}
                                    >
                                        {isSelected && (
                                            <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-padel-blue flex items-center justify-center">
                                                    <CheckCircle2 size={12} className="sm:w-[14px] sm:h-[14px] text-white" />
                                                </div>
                                            </div>
                                        )}

                                        <Timer className="w-6 h-6 sm:w-8 sm:h-8 md:w-8 md:h-8 mx-auto mb-2 sm:mb-4 transition-colors" style={{ color: isSelected ? '#1349D3' : 'rgba(255,255,255,0.2)' }} />

                                        <span className={cn(
                                            'text-3xl sm:text-4xl md:text-5xl font-display font-black italic tracking-tighter block mb-1 sm:mb-2',
                                            isSelected ? 'text-white' : 'text-white/60'
                                        )}>
                                            {option.label}
                                        </span>

                                        <span className={cn(
                                            'text-[10px] font-black uppercase tracking-widest block mb-4',
                                            isSelected ? 'text-padel-blue' : 'text-white/30'
                                        )}>
                                            {option.desc}
                                        </span>

                                        {/* End time preview */}
                                        <div className={cn(
                                            'text-[9px] font-black uppercase tracking-widest',
                                            isSelected ? 'text-white/50' : 'text-white/20'
                                        )}>
                                            {selectedTime} → {getEndTime(selectedTime || '08:00', option.value)}
                                        </div>

                                        {!availability.available && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <div className="text-center px-4">
                                                    <X size={24} className="text-white/30 mx-auto mb-2" />
                                                    <span className="text-[9px] font-black uppercase tracking-wide text-white/40 block">
                                                        {availability.reason}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* CTA Next Step */}
                        {selectedDuration && isDurationAvailable(selectedDuration).available && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-center sm:justify-end"
                            >
                                <button
                                    onClick={() => {
                                        // If only one court available, pre-select it
                                        if (availableCourts.length === 1) setSelectedCourt(availableCourts[0]);
                                        setStep(4);
                                    }}
                                    className="w-full sm:w-auto flex items-center justify-center gap-3 sm:gap-4 px-8 sm:px-12 py-4 sm:py-5 rounded-xl sm:rounded-2xl bg-padel-blue text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-padel-blue/40 hover:scale-105 transition-all"
                                >
                                    Choisir le terrain <ChevronRight size={18} />
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* STEP 4 : Court Selection */}
                {!isConfirmed && step === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ type: 'spring', damping: 20 }}
                        className="space-y-6 sm:space-y-8 md:space-y-10"
                    >
                        <button
                            onClick={() => { setStep(3); setSelectedCourt(null); }}
                            className="group flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] font-black text-white/30 hover:text-white uppercase tracking-widest transition-all"
                        >
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all border border-white/5">
                                <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
                            </div>
                            Modifier la durée
                        </button>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <div className="w-2 h-2 rounded-full bg-padel-blue animate-pulse" />
                            <h3 className="text-xs sm:text-sm font-display font-black text-white italic uppercase tracking-wider sm:tracking-widest">
                                <span className="text-padel-blue">{selectedTime}</span> • {selectedDuration >= 60 ? Math.floor(selectedDuration / 60) + 'h' : ''}{selectedDuration % 60 > 0 ? (selectedDuration % 60) : ''} — Choisissez votre terrain
                            </h3>
                        </div>

                        {/* Courts */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                            {availableCourts.length === 0 ? (
                                <div className="col-span-full flex flex-col items-center py-20 gap-5 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                                    <AlertCircle size={40} className="text-white/10" />
                                    <p className="text-[11px] font-black uppercase tracking-widest text-white/20">Aucun terrain libre à cette heure.</p>
                                    <button onClick={() => setStep(3)} className="px-6 py-3 rounded-xl bg-padel-blue text-white text-[10px] font-black uppercase tracking-widest">
                                        Modifier la durée
                                    </button>
                                </div>
                            ) : (
                                availableCourts.map((court, idx) => {
                                    const isSelected = selectedCourt?.courtId === court.courtId;
                                    const peak = isPeakHour(selectedTime || '', selectedDate);
                                    return (
                                        <motion.button
                                            key={court.courtId}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            whileHover={{ y: -6 }}
                                            onClick={() => setSelectedCourt(court)}
                                            className={cn(
                                                'relative text-left p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border transition-all duration-500 overflow-hidden group',
                                                isSelected
                                                    ? 'border-padel-blue bg-padel-blue/10 shadow-[0_0_40px_rgba(19,73,211,0.3)]'
                                                    : 'border-white/8 bg-[#151518]/60 hover:border-padel-blue/40 hover:bg-padel-blue/5'
                                            )}
                                        >
                                            {/* Glow */}
                                            <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-padel-blue/5 rounded-full blur-[60px] -mr-16 sm:-mr-20 -mt-16 sm:-mt-20 pointer-events-none group-hover:bg-padel-blue/15 transition-all" />

                                            {isSelected && (
                                                <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-padel-blue flex items-center justify-center">
                                                        <CheckCircle2 size={14} className="sm:w-4 sm:h-4 text-white" />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-padel-blue/10 flex items-center justify-center text-padel-blue mb-4 sm:mb-5 md:mb-6 border border-padel-blue/10 group-hover:scale-110 transition-transform">
                                                <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                                            </div>

                                            <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] text-padel-blue/60 mb-1 sm:mb-2 italic">Terrain</p>
                                            <h4 className="text-xl sm:text-2xl font-display font-black text-white italic uppercase tracking-tighter mb-1 leading-none">{court.courtName}</h4>
                                            <p className="text-[9px] sm:text-[10px] text-white/30 font-black uppercase tracking-widest mb-4 sm:mb-6">{court.type}</p>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className={cn('text-xl sm:text-2xl font-display font-black italic leading-none', peak ? 'text-padel-yellow' : 'text-white')}>
                                                        {calculateBookingPrice(court, selectedTime, selectedDuration).toFixed(0)}€
                                                    </p>
                                                    <p className="text-[7px] sm:text-[8px] font-black text-white/20 uppercase tracking-widest mt-1">{selectedDuration >= 60 ? Math.floor(selectedDuration / 60) + 'h' : ''}{selectedDuration % 60 > 0 ? (selectedDuration % 60) : ''} de jeu</p>
                                                </div>
                                                {peak && <Flame size={16} className="sm:w-[18px] sm:h-[18px] text-padel-yellow animate-pulse" />}
                                            </div>

                                            {/* Select CTA */}
                                            {!isSelected && (
                                                <div className="mt-4 sm:mt-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white/5 border border-white/5 text-center">
                                                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/30">Sélectionner</span>
                                                </div>
                                            )}
                                            {isSelected && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="mt-4 sm:mt-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-padel-blue text-center"
                                                >
                                                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white">Court choisi ✓</span>
                                                </motion.div>
                                            )}
                                        </motion.button>
                                    );
                                })
                            )}
                        </div>

                        {/* CTA Next Step */}
                        {selectedCourt && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-center sm:justify-end"
                            >
                                <button
                                    onClick={() => setStep(5)}
                                    className="w-full sm:w-auto flex items-center justify-center gap-3 sm:gap-4 px-8 sm:px-12 py-4 sm:py-5 rounded-xl sm:rounded-2xl bg-padel-blue text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-padel-blue/40 hover:scale-105 transition-all"
                                >
                                    Continuer <ChevronRight size={18} />
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* STEP 5 : Validation */}
                {!isConfirmed && step === 5 && (
                    <motion.div
                        key="step5"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ type: 'spring', damping: 20 }}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
                            {/* Left: Recap */}
                            <div className="lg:col-span-3 bg-[#151518]/60 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-[2.5rem] lg:rounded-[3rem] p-6 sm:p-8 md:p-10 lg:p-14 relative overflow-hidden flex flex-col justify-between">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-padel-blue/5 rounded-full blur-[100px] pointer-events-none" />
                                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-padel-yellow/5 rounded-full blur-[120px] pointer-events-none" />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-8 sm:mb-12">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-padel-blue shadow-inner">
                                            <Target size={24} className="sm:w-8 sm:h-8" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] sm:text-[11px] font-black text-white/30 uppercase tracking-[0.3em] italic mb-1">Sport sélectionné</p>
                                            <h3 className="text-xl sm:text-2xl font-black text-white italic uppercase tracking-tighter">{selectedSport}</h3>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
                                        <div className="space-y-6">
                                            <div className="flex gap-4 sm:gap-5">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-padel-blue/10 border border-padel-blue/20 rounded-lg sm:rounded-xl flex items-center justify-center text-padel-blue shrink-0">
                                                    <Calendar size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Date du match</p>
                                                    <p className="text-sm sm:text-lg font-black text-white italic uppercase tracking-tight">
                                                        {selectedDate?.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 sm:gap-5">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-padel-yellow/10 border border-padel-yellow/20 rounded-lg sm:rounded-xl flex items-center justify-center text-padel-yellow shrink-0">
                                                    <Clock size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Créneau & Durée</p>
                                                    <p className="text-sm sm:text-lg font-black text-white italic uppercase tracking-tight">
                                                        {selectedTime} <span className="text-white/30 mx-2">—</span> {selectedDuration} min
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex gap-4 sm:gap-5">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl flex items-center justify-center text-white/40 shrink-0">
                                                    <Layout size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Terrain</p>
                                                    <p className="text-sm sm:text-lg font-black text-white italic uppercase tracking-tight">
                                                        {selectedCourt?.courtName}
                                                        <span className="block text-[10px] text-white/30 lowercase italic tracking-normal mt-0.5">Automatiquement attribué</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 sm:gap-5">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl flex items-center justify-center text-white/40 shrink-0">
                                                    <Sparkles size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Inclus</p>
                                                    <p className="text-xs sm:text-sm font-black text-white/60 italic uppercase tracking-tight">
                                                        Vestiaires, Douches & Parking
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 sm:mt-16 pt-8 border-t border-white/5 flex flex-wrap gap-4 sm:gap-8 relative z-10">
                                    <div className="flex items-center gap-2 text-[8px] sm:text-[9px] font-black text-green-500 uppercase tracking-widest">
                                        <ShieldCheck size={14} className="sm:w-4 sm:h-4" /> Réservation 100% sécurisée
                                    </div>
                                    <div className="flex items-center gap-2 text-[8px] sm:text-[9px] font-black text-white/30 uppercase tracking-widest">
                                        <Zap size={14} className="sm:w-4 sm:h-4 text-padel-yellow" /> Confirmation instantanée
                                    </div>
                                </div>
                            </div>

                            {/* Right: Payment */}
                            <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-6 h-full">
                                {/* Price Card */}
                                <div className="bg-padel-blue rounded-2xl sm:rounded-[2.5rem] lg:rounded-[3rem] p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden shadow-2xl shadow-padel-blue/50 flex flex-col justify-between h-full group flex-1">
                                    <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-[60px] pointer-events-none transition-transform group-hover:scale-110 duration-700" />
                                    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-padel-yellow/20 rounded-full blur-3xl pointer-events-none" />

                                    <div>
                                        <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] mb-4 sm:mb-6 opacity-60 italic relative z-10 border-l-2 border-white/20 pl-3">Récapitulatif Financier</p>
                                        <div className="flex flex-col gap-1 mb-8 relative z-10">
                                            <div className="flex items-baseline gap-1.5 sm:gap-2">
                                                <span className="text-5xl sm:text-6xl lg:text-7xl font-display font-black italic tracking-tighter leading-none">
                                                    {totalPrice}
                                                </span>
                                                <span className="text-lg sm:text-xl font-black">€</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest opacity-40">
                                                <span className="w-1 h-1 rounded-full bg-white" />
                                                Total TTC à régler
                                            </div>
                                        </div>

                                        {/* Promo Code Input */}
                                        <div className="mb-8 relative z-10">
                                            <PromoCodeInput
                                                applicationType="booking"
                                                purchaseAmount={basePrice}
                                                onApply={(discount, code) => {
                                                    setPromoDiscount(discount);
                                                    setPromoCode(code);
                                                }}
                                            />
                                            <AnimatePresence>
                                                {promoDiscount > 0 && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="mt-3 flex flex-col gap-1.5 p-3 rounded-xl bg-green-500/10 border border-green-500/20"
                                                    >
                                                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-green-400">
                                                            <span className="flex items-center gap-2"><CheckCircle2 size={12} /> Réduction appliquée</span>
                                                            <span>-{promoDiscount.toFixed(2)}€</span>
                                                        </div>
                                                        <p className="text-[9px] text-green-400/60 font-mono italic">{promoCode}</p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    <div className="relative z-10 space-y-4">
                                        <div className="text-[9px] font-black text-white/40 uppercase tracking-widest pl-1">Choisir le mode de paiement</div>
                                        <div className="grid grid-cols-2 gap-3 mb-2">
                                            <button
                                                type="button"
                                                onClick={() => setPaymentMethod('STRIPE')}
                                                className={cn(
                                                    "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all",
                                                    paymentMethod === 'STRIPE' ? "bg-white text-padel-blue border-white shadow-lg" : "bg-white/10 border-white/5 text-white/40 hover:border-white/20"
                                                )}
                                            >
                                                <CreditCard size={20} />
                                                <span className="text-[8px] font-black uppercase tracking-widest">CARTE</span>
                                            </button>
                                            <button
                                                type="button"
                                                disabled={!user || (user.balance || 0) < parseFloat(totalPrice)}
                                                onClick={() => setPaymentMethod('WALLET')}
                                                className={cn(
                                                    "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all relative overflow-hidden",
                                                    paymentMethod === 'WALLET' ? "bg-white text-padel-blue border-white shadow-lg" : "bg-white/10 border-white/5 text-white/40 hover:border-white/20",
                                                    (!user || (user.balance || 0) < parseFloat(totalPrice)) && "opacity-40 cursor-not-allowed grayscale"
                                                )}
                                            >
                                                <Zap size={20} />
                                                <span className="text-[8px] font-black uppercase tracking-widest">SOLDE</span>
                                                <span className="text-[7px] font-black opacity-60">SOLDE: {user?.balance || 0}€</span>
                                            </button>
                                        </div>

                                        {paymentMethod === 'STRIPE' ? (
                                            <div className="flex flex-col items-center gap-3 p-5 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 p-3 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform">
                                                    <CreditCard size={32} />
                                                </div>
                                                <div className="flex items-center gap-4 w-full">
                                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-padel-blue shadow-lg shrink-0">
                                                        <CreditCard size={18} />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1.5 italic">Paiement Sécurisé</p>
                                                        <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] leading-none italic">VIA STRIPE CONNECT</p>
                                                    </div>
                                                </div>
                                                <div className="h-px w-full bg-white/5 my-1" />
                                                <div className="text-left w-full text-center">
                                                    <p className="text-[8px] sm:text-[9px] font-black text-white/20 uppercase tracking-widest leading-relaxed italic px-2">
                                                        REDIRIGÉ VERS <span className="text-white/40">STRIPE</span>.
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3 p-5 bg-white/10 border border-white/20 rounded-2xl relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 p-3 opacity-[0.05] rotate-12">
                                                    <Zap size={32} className="text-white" />
                                                </div>
                                                <div className="flex items-center gap-4 w-full">
                                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-padel-blue shadow-lg shrink-0">
                                                        <Zap size={18} />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1.5 italic">Débit Immédiat</p>
                                                        <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] leading-none italic">ARENA BALANCE</p>
                                                    </div>
                                                </div>
                                                <div className="h-px w-full bg-white/10 my-1" />
                                                <div className="text-left w-full text-center">
                                                    <p className="text-[8px] sm:text-[9px] font-black text-white/60 uppercase tracking-widest leading-relaxed italic px-2">
                                                        EXTRAIT DE VOTRE SOLDE.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {bookError && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
                                            >
                                                <AlertCircle size={14} className="text-red-400 shrink-0" />
                                                <p className="text-[9px] font-black text-red-400 uppercase tracking-wider">{bookError}</p>
                                            </motion.div>
                                        )}

                                        <motion.button
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleBook}
                                            disabled={loadingBook}
                                            className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-white text-padel-blue text-[10px] font-black uppercase tracking-widest shadow-xl shadow-padel-blue/20 hover:shadow-2xl transition-all disabled:opacity-60 disabled:cursor-not-allowed group active:bg-blue-50"
                                        >
                                            {loadingBook ? (
                                                <>
                                                    <div className="animate-spin">
                                                        <Loader2 size={18} />
                                                    </div>
                                                    <span>Traitement...</span>
                                                </>
                                            ) : (
                                                <>
                                                    {paymentMethod === 'WALLET' ? <Zap size={18} className="group-hover:rotate-12 transition-transform" /> : <CreditCard size={18} className="group-hover:rotate-12 transition-transform" />}
                                                    <span>{paymentMethod === 'WALLET' ? 'Valider avec mon solde' : 'Payer via Stripe'}</span>
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                </div>
                                <div className="bg-white/[0.03] border border-white/5 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 space-y-3 sm:space-y-4">
                                    {[
                                        { icon: <ShieldCheck size={14} className="text-green-500" />, text: 'Réservation 100% sécurisée' },
                                        { icon: <Star size={14} className="text-padel-yellow" />, text: 'Satisfaction garantie' },
                                        { icon: <Wifi size={14} className="text-padel-blue" />, text: 'Confirmation par email' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            {item.icon}
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest italic">{item.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

    );
}
