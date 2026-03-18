import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Search,
    Filter,
    Plus,
    MoreVertical,
    CheckCircle2,
    Clock,
    XCircle,
    User,
    Mail,
    MapPin,
    Calendar,
    CreditCard,
    X,
    Sparkles,
    Trash2,
    Package,
    Star,
    MessageSquare,
    ExternalLink,
    ArrowRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';
import { PremiumSelect } from '../../components/admin/PremiumSelect';
import { PremiumDatePicker } from '../../components/admin/PremiumDatePicker';
import { PremiumTimePicker } from '../../components/admin/PremiumTimePicker';

// --- Styles & CSS ---
const customStyles = `
  /* Hide default browser icons for date/time */
  input::-webkit-calendar-picker-indicator {
    background: transparent;
    bottom: 0;
    color: transparent;
    cursor: pointer;
    height: auto;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: auto;
    z-index: 10;
  }
  
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

// --- Types ---
type ViewMode = 'Jour' | 'Semaine' | 'Mois';
interface Booking {
    _id: string;
    court: { _id: string; name: string };
    user: { _id: string; name: string; email: string };
    startTime: string;
    endTime: string;
    totalPrice: number;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    paymentStatus?: 'UNPAID' | 'PAID' | 'REFUNDED';
    paymentMethod?: 'CASH' | 'CARD' | 'STRIPE' | 'TRANSFER';
    createdAt: string;
    bookingType?: 'COURT' | 'PACK' | 'SUBSCRIPTION';
    packName?: string;
    guestName?: string;
    guestEmail?: string;
    guestPhone?: string;
}

// --- Subcomponents ---

const Loader2 = ({ size, className }: { size: number; className?: string }) => (
    <Clock size={size} className={cn("animate-spin", className)} />
);

const BookingDetailModal = ({ booking, onClose, onDelete, onChangeStatus }: {
    booking: Booking;
    onClose: () => void;
    onDelete: () => void;
    onChangeStatus: (status: string) => void;
}) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/85 backdrop-blur-2xl"
            />
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 40 }}
                className="relative w-full max-w-[320px] sm:max-w-sm bg-[#121215] border border-white/10 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] max-h-[95vh] overflow-y-auto custom-scrollbar"
            >
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-padel-blue via-padel-yellow to-green-500" />

                <div className="p-8 space-y-8">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <div className="flex flex-wrap gap-2 mb-2">
                                <div className={cn(
                                    "inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border shadow-sm",
                                    booking.status === 'CONFIRMED' ? "bg-green-500/10 border-green-500/20 text-green-500" :
                                        booking.status === 'PENDING' ? "bg-padel-blue/10 border-padel-blue/20 text-padel-blue" :
                                            booking.status === 'CANCELLED' ? "bg-red-500/10 border-red-500/20 text-red-500" :
                                                "bg-white/5 border-white/10 text-white/40"
                                )}>
                                    {booking.status === 'CANCELLED' ? <XCircle size={8} /> : <CheckCircle2 size={8} />}
                                    {booking.status}
                                </div>
                                {booking.bookingType && booking.bookingType !== 'COURT' && (
                                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border shadow-sm bg-padel-yellow/10 border-padel-yellow/20 text-padel-yellow">
                                        <Package size={8} />
                                        {booking.bookingType} : {booking.packName}
                                    </div>
                                )}
                            </div>
                            <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter leading-none">Détails de la<br />Séance</h2>
                        </div>
                        <button onClick={onClose} className="p-2.5 rounded-xl bg-white/5 text-white/20 hover:text-white hover:bg-white/10 transition-all">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 group hover:bg-white/[0.04] transition-all">
                            <div className="flex items-center gap-2 text-white/20 group-hover:text-padel-blue transition-colors">
                                <User size={12} />
                                <span className="text-[8px] font-black uppercase tracking-widest">Client</span>
                            </div>
                            <p className="text-sm font-bold text-white tracking-tight">{booking.user?.name || booking.guestName || 'Inconnu'}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 group hover:bg-white/[0.04] transition-all">
                            <div className="flex items-center gap-2 text-white/20 group-hover:text-padel-blue transition-colors">
                                <Mail size={12} />
                                <span className="text-[8px] font-black uppercase tracking-widest">Email</span>
                            </div>
                            <p className="text-sm font-bold text-white tracking-tight break-all">{booking.user?.email || booking.guestEmail || 'Aucun email'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 group hover:bg-white/[0.04] transition-all">
                                <div className="flex items-center gap-2 text-white/20 group-hover:text-padel-yellow transition-colors">
                                    <MapPin size={12} />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Espace</span>
                                </div>
                                <p className="text-sm font-bold text-white tracking-tight">{booking.court?.name}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-white/20">
                                        <Calendar size={12} />
                                        <span className="text-[8px] font-black uppercase tracking-widest">Planifié</span>
                                    </div>
                                    <p className="text-[10px] font-black text-white uppercase tracking-tighter">
                                        {new Date(booking.startTime).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-padel-yellow leading-none">
                                        {new Date(booking.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex-1 p-5 rounded-2xl bg-padel-blue/5 border border-padel-blue/10 flex flex-col items-center">
                            <span className="text-[7px] font-black text-padel-blue uppercase tracking-widest mb-1 opacity-50">Total</span>
                            <p className="text-2xl font-black text-white leading-none">{booking.totalPrice}€</p>
                        </div>
                        <div className="flex-1 p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center">
                            <span className="text-[7px] font-black text-white/20 uppercase tracking-widest mb-1">Réf</span>
                            <p className="text-[9px] font-black text-white/40 tracking-[0.2em]">#{booking._id.slice(-6).toUpperCase()}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                        {booking.status === 'PENDING' && (
                            <button
                                onClick={() => onChangeStatus('CONFIRMED')}
                                className="w-full py-5 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-green-500/20 hover:scale-[1.02] transition-all"
                            >
                                Valider la séance
                            </button>
                        )}
                        {booking.status === 'CONFIRMED' && (
                            <button
                                onClick={() => onChangeStatus('COMPLETED')}
                                className="w-full py-5 bg-padel-blue text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-padel-blue/20 hover:scale-[1.02] transition-all"
                            >
                                Clôturer la séance
                            </button>
                        )}
                        {booking.status !== 'CANCELLED' && (
                            <button
                                onClick={() => onChangeStatus('CANCELLED')}
                                className="w-full py-4 bg-transparent border border-white/10 text-white/20 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all"
                            >
                                Annuler la réservation
                            </button>
                        )}
                        <button
                            onClick={onDelete}
                            className="w-full py-3 text-[8px] font-black text-white/5 hover:text-red-500 uppercase tracking-[0.3em] transition-all"
                        >
                            Supprimer définitivement
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const CreateBookingModal = ({ users, courts, onClose, onFinish }: {
    users: any[];
    courts: any[];
    onClose: () => void;
    onFinish: (data: any) => void;
}) => {
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedCourt, setSelectedCourt] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState('09:00');
    const [duration, setDuration] = useState(1.5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!selectedUser || !selectedCourt || !selectedDate || !startTime) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        setLoading(true);
        try {
            const startStr = `${selectedDate}T${startTime}:00`;
            const startDate = new Date(startStr);
            const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);

            await onFinish({
                userId: selectedUser,
                courtId: selectedCourt,
                startTime: startDate,
                endTime: endDate
            });
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de la création');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                className="relative w-full max-w-xl bg-[#121215] border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8 md:mb-12">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-padel-blue/10 border border-padel-blue/20 text-padel-blue text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em]">
                            <Sparkles size={10} />
                            Action Admin
                        </div>
                        <h2 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tighter leading-none">Créer une<br />Réservation</h2>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">Estimatif Prix</div>
                        <div className="text-2xl font-black text-padel-yellow">
                            {(() => {
                                const court = courts.find(c => c._id === selectedCourt);
                                if (court && court.pricePerHour) {
                                    return Math.round(court.pricePerHour * duration);
                                }
                                return '0';
                            })()}€
                        </div>
                    </div>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 md:mb-8 p-4 md:p-5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl md:rounded-[2rem] text-[9px] md:text-[10px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-2 md:gap-3"
                    >
                        <XCircle size={14} className="md:w-4 md:h-4" />
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Joueur */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-2 block">Joueur Client</label>
                            <PremiumSelect
                                value={selectedUser}
                                onChange={setSelectedUser}
                                options={users.map(u => ({ value: u._id, label: u.name }))}
                                placeholder="Sélectionner un joueur"
                                icon={User}
                            />
                        </div>

                        {/* Terrain */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-2 block">Terrain / Court</label>
                            <PremiumSelect
                                value={selectedCourt}
                                onChange={setSelectedCourt}
                                options={courts.map(c => ({ value: c._id, label: c.name }))}
                                placeholder="Choisir un terrain"
                                icon={MapPin}
                            />
                        </div>

                        {/* Date */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-2 block">Date</label>
                            <PremiumDatePicker
                                value={selectedDate}
                                onChange={setSelectedDate}
                                icon={Calendar}
                            />
                        </div>

                        {/* Heure */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-2 block">Horaire Début</label>
                            <PremiumTimePicker
                                value={startTime}
                                onChange={setStartTime}
                                icon={Clock}
                            />
                        </div>

                        {/* Durée */}
                        <div className="space-y-3 md:col-span-2">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-2 block">Durée de la Session</label>
                            <div className="grid grid-cols-3 gap-3 p-2 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                                {[1, 1.5, 2].map(d => (
                                    <button
                                        type="button"
                                        key={d}
                                        onClick={() => setDuration(d)}
                                        className={cn(
                                            "py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all relative overflow-hidden group",
                                            duration === d
                                                ? "bg-padel-blue text-white shadow-[0_10px_20px_rgba(59,130,246,0.3)] scale-[1.02]"
                                                : "text-white/20 hover:text-white/40 hover:bg-white/5"
                                        )}
                                    >
                                        <span className="relative z-10">{d === 1.5 ? '1h30' : `${d}h00`}</span>
                                        {duration === d && (
                                            <motion.div
                                                layoutId="activeDuration"
                                                className="absolute inset-0 bg-gradient-to-r from-padel-blue to-blue-600"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 md:pt-8">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full group relative py-5 md:py-6 bg-padel-yellow text-padel-blue rounded-xl md:rounded-[2rem] text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-padel-yellow/20"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {loading ? <Loader2 size={18} className="animate-spin" /> : (
                                    <>
                                        Confirmer la Réservation
                                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-3 md:py-4 mt-2 md:mt-4 text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-colors"
                        >
                            Annuler et fermer
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};


const DeleteConfirmModal = ({ booking, onClose, onConfirm, loading }: { booking: Booking; onClose: () => void; onConfirm: () => void; loading: boolean }) => (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#1a1a1e] border border-white/10 rounded-[3rem] p-12 max-w-md w-full text-center shadow-3xl">
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20 shadow-2xl shadow-red-500/10">
                <Trash2 size={40} />
            </div>
            <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter mb-4">Supprimer la réservation ?</h2>
            <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.2em] mb-10 leading-relaxed">Cette action est irréversible. La réservation sera définitivement supprimée de la base de données.</p>
            <div className="flex gap-4">
                <button onClick={onClose} className="flex-1 py-5 rounded-2xl bg-white/5 text-white/60 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Garder</button>
                <button onClick={onConfirm} disabled={loading} className="flex-1 py-5 rounded-2xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 flex items-center justify-center">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : "Confirmer la Suppression"}
                </button>
            </div>
        </motion.div>
    </div>
);

export function AdminReservations() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [courts, setCourts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<ViewMode>('Semaine');
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [courtFilter, setCourtFilter] = useState('');
    const [showCancelled, setShowCancelled] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Generate visible days based on view mode
    const getVisibleDays = (date: Date, mode: ViewMode): Date[] => {
        if (mode === 'Jour') {
            return [new Date(date)];
        }
        if (mode === 'Mois') {
            const year = date.getFullYear();
            const month = date.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
        }
        // Semaine
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        start.setDate(diff);
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            return d;
        });
    };

    const visibleDays = getVisibleDays(currentDate, viewMode);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [bRes, uRes, cRes] = await Promise.all([
                api.get('/bookings'),
                api.get('/admin/users'),
                api.get('/courts?all=true')
            ]);
            setBookings(bRes.data.data);
            setUsers(uRes.data.data);
            setCourts(cRes.data.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Status change logic
    const handleChangeStatus = async (booking: Booking, newStatus: string) => {
        try {
            const updateData: any = { status: newStatus };
            if (newStatus === 'CONFIRMED' || newStatus === 'COMPLETED') {
                updateData.paymentStatus = 'PAID';
                updateData.paymentMethod = 'CASH'; // Default for admin-confirmed on-site
            }
            await api.put(`/bookings/${booking._id}`, updateData);
            setBookings(bookings.map(b => b._id === booking._id ? { ...b, status: newStatus as any, paymentStatus: updateData.paymentStatus || b.paymentStatus } : b));
            if (selectedBooking?._id === booking._id) {
                setSelectedBooking({ ...booking, status: newStatus as any, paymentStatus: updateData.paymentStatus || (booking as any).paymentStatus });
            }
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const handleDeleteBooking = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await api.delete(`/bookings/${deleteTarget._id}`);
            setBookings(bookings.filter(b => b._id !== deleteTarget._id));
            setDeleteTarget(null);
            setSelectedBooking(null);
        } catch (err) {
            console.error('Error deleting booking:', err);
        } finally {
            setDeleting(false);
        }
    };

    const handleCreateBooking = async (data: any) => {
        const res = await api.post('/bookings', data);
        setBookings([res.data.data, ...bookings]);
    };

    const navigate = (direction: 1 | -1) => {
        const nextDate = new Date(currentDate);
        if (viewMode === 'Jour') nextDate.setDate(currentDate.getDate() + direction);
        else if (viewMode === 'Semaine') nextDate.setDate(currentDate.getDate() + (direction * 7));
        else nextDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(nextDate);
    };

    const getBookingsForDay = (day: Date) => {
        return filteredBookings.filter(b => {
            const d = new Date(b.startTime);
            return d.getDate() === day.getDate() && d.getMonth() === day.getMonth() && d.getFullYear() === day.getFullYear();
        });
    };

    const hours = Array.from({ length: 15 }, (_, i) => i + 8); // 8h to 22h

    // KPIs
    const kpis = useMemo(() => {
        const today = new Date().toDateString();
        const todaysBookings = bookings.filter(b => new Date(b.startTime).toDateString() === today && b.status !== 'CANCELLED');
        const totalRevenue = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED').reduce((acc, b) => acc + b.totalPrice, 0);

        return {
            todayCount: todaysBookings.length,
            totalRevenue: totalRevenue.toLocaleString(),
            pending: bookings.filter(b => b.status === 'PENDING').length,
            totalAll: bookings.length
        };
    }, [bookings]);

    // Derived: Filtered bookings
    const filteredBookings = useMemo(() => {
        let result = bookings;
        if (!showCancelled) {
            result = result.filter(b => b.status !== 'CANCELLED');
        }
        if (courtFilter) {
            result = result.filter(b => b.court?._id === courtFilter);
        }
        if (!searchTerm) return result;
        const lowSearch = searchTerm.toLowerCase();
        return result.filter(b =>
            b.user?.name?.toLowerCase().includes(lowSearch) ||
            b.court?.name?.toLowerCase().includes(lowSearch) ||
            b._id.toLowerCase().includes(lowSearch)
        );
    }, [bookings, searchTerm, showCancelled, courtFilter]);

    return (
        <>
            <style>{customStyles}</style>

            {/* Global Background Ambiance */}
            <div className="fixed inset-0 pointer-events-none -z-10 bg-[#0a0a0c]" />
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-padel-blue/10 blur-[120px] rounded-full animate-pulse transition-all duration-1000" />
                <div className="absolute bottom-[-5%] right-[-2%] w-[30%] h-[30%] bg-padel-yellow/5 blur-[100px] rounded-full" />
                <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-white/5 blur-[80px] rounded-full" />
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 pb-32">
                {/* Hub Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between px-2 gap-6 pt-6 md:pt-0">
                    <div className="space-y-2">

                        <h1 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tighter leading-none">
                            Planning<br /><span className="text-padel-blue">Arena</span>
                        </h1>
                    </div>
                    <div className="hidden lg:flex items-center gap-8 mb-2">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Status Base</p>
                            <p className="text-sm font-black text-white uppercase tracking-tighter">Opérationnel</p>
                        </div>
                        <div className="h-8 w-[1px] bg-white/5" />
                        <div className="text-right">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Version Panel</p>
                            <p className="text-sm font-black text-white uppercase tracking-tighter text-padel-yellow">PRO 2.4</p>
                        </div>
                    </div>
                </div>

                {/* View Controls - Now a Floating Cockpit */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-4 md:p-5 bg-black/40 backdrop-blur-3xl rounded-2xl md:rounded-[2rem] border border-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
                    <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
                        <div className="flex bg-black/20 p-1 rounded-xl md:p-1.5 md:rounded-2xl border border-white/5 w-full sm:w-auto overflow-x-auto sm:overflow-visible custom-scrollbar">
                            {(['Jour', 'Semaine', 'Mois'] as ViewMode[]).map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={cn(
                                        "flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-lg md:rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap",
                                        viewMode === mode ? "bg-padel-blue text-white shadow-lg shadow-padel-blue/20" : "text-white/40 hover:text-white"
                                    )}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                        <div className="hidden sm:block h-8 w-[1px] bg-white/5" />
                        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"><ChevronLeft size={18} /></button>
                            <div className="text-center min-w-[140px] md:min-w-[200px]">
                                <p className="text-[8px] md:text-[10px] font-black text-padel-blue uppercase tracking-[0.2em] md:tracking-[0.3em] mb-1">
                                    {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                                </p>
                                <h2 className="text-xs md:text-base font-black text-white uppercase tracking-tighter line-clamp-1">
                                    {viewMode === 'Jour' ? currentDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) :
                                        viewMode === 'Mois' ? `Mois de ${currentDate.toLocaleDateString('fr-FR', { month: 'long' })}` :
                                            `Semaine du ${visibleDays[0].getDate()}`}
                                </h2>
                                <button
                                    onClick={() => setCurrentDate(new Date())}
                                    className="text-[7px] md:text-[8px] font-black text-white/20 uppercase tracking-widest hover:text-padel-yellow transition-colors mt-0.5"
                                >
                                    AUJOURD'HUI
                                </button>
                            </div>
                            <button onClick={() => navigate(1)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"><ChevronRight size={18} /></button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 w-full lg:w-auto">
                        <div className="relative group/search w-full sm:w-auto">
                            <div className="absolute inset-0 bg-padel-blue/5 rounded-2xl blur-xl opacity-0 group-focus-within/search:opacity-100 transition-opacity" />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/search:text-padel-blue transition-colors z-10" size={16} />
                            <input
                                type="text"
                                placeholder="RECHERCHER..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="relative z-10 bg-white/[0.03] border border-white/5 rounded-xl md:rounded-2xl py-2.5 md:py-3 pl-10 md:pl-12 pr-4 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-white placeholder:text-white/10 focus:outline-none focus:border-padel-blue/50 transition-all w-full sm:w-[150px] md:w-[240px]"
                            />
                        </div>
                        <PremiumSelect
                            value={courtFilter}
                            onChange={setCourtFilter}
                            options={[
                                { value: '', label: 'TOUS TERRAINS' },
                                ...courts.map(c => ({ value: c._id, label: c.name }))
                            ]}
                            icon={MapPin}
                            className="w-full sm:w-[150px] md:w-[240px]"
                        />
                        <button
                            onClick={() => setShowCancelled(!showCancelled)}
                            className={cn(
                                "w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 md:py-3 rounded-xl transition-all border font-black text-[8px] md:text-[9px] uppercase tracking-[0.2em] relative overflow-hidden group shrink-0",
                                showCancelled
                                    ? "bg-red-500/10 border-red-500/50 text-red-500"
                                    : "bg-white/[0.03] border-white/5 text-white/20"
                            )}
                        >
                            <Filter size={12} className={cn("transition-transform duration-500 md:w-3.5 md:h-3.5", showCancelled && "rotate-180")} />
                            <span className="relative z-10 leading-none">{showCancelled ? "Annulées" : "Masquées"}</span>
                        </button>
                    </div>
                </div>

                {/* KPI Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 px-1">
                    <div className="bg-white/5 border border-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-padel-yellow text-padel-blue flex items-center justify-center font-black text-base md:text-lg shadow-lg shadow-padel-yellow/10">B</div>
                        <div className="min-w-0">
                            <p className="text-[7px] md:text-[9px] font-black text-white/20 uppercase tracking-widest leading-none mb-1 md:mb-1.5">Aujourd'hui</p>
                            <p className="text-sm md:text-xl font-black text-white tracking-tighter leading-none truncate">{kpis.todayCount} RÉSERV.</p>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-padel-blue text-white flex items-center justify-center shadow-lg shadow-padel-blue/10"><CreditCard size={16} className="md:w-5 md:h-5" /></div>
                        <div className="min-w-0">
                            <p className="text-[7px] md:text-[9px] font-black text-white/20 uppercase tracking-widest leading-none mb-1 md:mb-1.5">Revenue</p>
                            <p className="text-sm md:text-xl font-black text-white tracking-tighter leading-none truncate">{kpis.totalRevenue} €</p>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 text-padel-blue flex items-center justify-center shadow-lg shadow-white/5"><Clock size={16} className="text-white/40 md:w-5 md:h-5" /></div>
                        <div className="min-w-0">
                            <p className="text-[7px] md:text-[9px] font-black text-white/20 uppercase tracking-widest leading-none mb-1 md:mb-1.5">Attente</p>
                            <p className="text-sm md:text-xl font-black text-white tracking-tighter">{kpis.pending}</p>
                        </div>
                    </div>
                    <div
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex-1 bg-padel-blue p-0.5 md:p-1 rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer shadow-xl shadow-padel-blue/20"
                    >
                        <div className="h-full bg-padel-blue flex items-center justify-center gap-2 text-white py-2">
                            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500 md:w-5 md:h-5" />
                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Nouveau</span>
                        </div>
                    </div>
                </div>

                {/* Status Legend */}
                <div className="flex flex-wrap items-center gap-3 md:gap-6 px-2 py-1">
                    <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white/[0.02] border border-white/5 rounded-lg md:rounded-xl">
                        <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                        <span className="text-[7px] md:text-[8px] font-black text-white/40 uppercase tracking-widest">Confirmé</span>
                    </div>
                    <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white/[0.02] border border-white/5 rounded-lg md:rounded-xl">
                        <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-padel-blue shadow-[0_0_8px_rgba(19,73,211,0.4)]" />
                        <span className="text-[7px] md:text-[8px] font-black text-white/40 uppercase tracking-widest">Attente</span>
                    </div>
                    <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white/[0.02] border border-white/5 rounded-lg md:rounded-xl">
                        <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-red-500/60 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                        <span className="text-[7px] md:text-[8px] font-black text-white/40 uppercase tracking-widest">Annulé</span>
                    </div>
                </div>

                {/* Planning Skeleton */}
                <div className="bg-[#121215] border border-white/10 rounded-[2rem] shadow-3xl overflow-hidden min-h-[500px] flex flex-col">
                    <div className="flex flex-col-reverse md:flex-row">
                        <div className="flex-1 overflow-x-auto custom-scrollbar">
                            {/* Header: Hours */}
                            <div className="flex border-b border-white/5 min-w-[1200px]">
                                <div className="w-[60px] md:w-[80px] shrink-0 p-3 flex items-center justify-center border-r border-white/5 sticky left-0 bg-[#121215] z-30">
                                    <Clock size={16} className="text-white/20" />
                                </div>
                                {hours.map(hour => (
                                    <div key={hour} className="flex-1 py-3 px-1 text-center border-r border-white/5 group/hour hover:bg-white/[0.02] transition-colors relative">
                                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-padel-blue/0 group-hover/hour:bg-padel-blue/20 transition-all" />
                                        <p className="text-[8px] md:text-[9px] font-black text-white/10 uppercase tracking-widest group-hover/hour:text-white/30 transition-colors">{hour}h</p>
                                    </div>
                                ))}
                            </div>

                            {/* Rows: days */}
                            <div className={cn("relative", viewMode === 'Mois' && "max-h-[500px] overflow-y-auto custom-scrollbar")}>
                                {visibleDays.map(day => {
                                    const isToday = day.toDateString() === new Date().toDateString();
                                    const dayBookings = getBookingsForDay(day);
                                    const activeCount = dayBookings.filter(b => b.status !== 'CANCELLED').length;

                                    // --- Court-Based Smart Stacking Algorithm ---
                                    const processedLanes = courts.map(court => {
                                        const courtBookings = dayBookings.filter(b => b.court?._id === court._id);
                                        const subLanes: Booking[][] = [];

                                        // Sort by start time to process chronologically
                                        const sorted = [...courtBookings].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

                                        sorted.forEach(booking => {
                                            let added = false;
                                            for (let i = 0; i < subLanes.length; i++) {
                                                const hasOverlap = subLanes[i].some(b => {
                                                    const s1 = new Date(b.startTime).getTime();
                                                    const e1 = new Date(b.endTime).getTime();
                                                    const s2 = new Date(booking.startTime).getTime();
                                                    const e2 = new Date(booking.endTime).getTime();
                                                    return (s2 < e1 && e2 > s1);
                                                });
                                                if (!hasOverlap) {
                                                    subLanes[i].push(booking);
                                                    added = true;
                                                    break;
                                                }
                                            }
                                            if (!added) subLanes.push([booking]);
                                        });

                                        return {
                                            court,
                                            subLanes,
                                            height: Math.max(1, subLanes.length) * 56 // Minimum 1 sublane height if court exists
                                        };
                                    });

                                    // Filter out courts with no bookings only if we have many courts
                                    const visibleLanes = courts.length > 2
                                        ? processedLanes.filter(l => l.subLanes.flat().length > 0)
                                        : processedLanes;

                                    const rowHeight = Math.max(80, visibleLanes.reduce((acc, l) => acc + l.height, 0) + 20);

                                    // Pre-calculate cumulative offsets
                                    let currentTop = 10;
                                    const laneOffsets = visibleLanes.map(lane => {
                                        const offset = currentTop;
                                        currentTop += lane.height;
                                        return offset;
                                    });

                                    return (
                                        <div key={day.toISOString()}
                                            className={cn("border-b border-white/5 group hover:bg-white/[0.01] transition-all flex relative min-w-[1200px]", isToday && "bg-padel-blue/[0.02]")}
                                            style={{ minHeight: `${rowHeight}px` }}>

                                            <div className={cn("w-[60px] md:w-[80px] shrink-0 p-2 md:p-3 flex flex-col justify-center border-r border-white/5 sticky left-0 bg-[#121215]/90 z-20 backdrop-blur-md", isToday && "bg-padel-blue/5")}>
                                                {isToday && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-[2px] md:w-[3px] bg-padel-blue shadow-[3px_0_10px_rgba(59,130,246,0.3)] rounded-r-full" />
                                                )}
                                                <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-2 group-hover:translate-x-1 transition-transform">
                                                    <p className={cn("text-xl md:text-2xl font-black leading-none tracking-tighter", isToday ? "text-padel-blue" : "text-white/60")}>{day.getDate()}</p>
                                                    <p className="text-[7px] md:text-[8px] font-black text-white/20 uppercase tracking-wider">{day.toLocaleDateString('fr-FR', { weekday: 'short' })}</p>
                                                </div>
                                                {activeCount > 0 && <p className="text-[6px] md:text-[7px] font-black text-padel-yellow uppercase tracking-[0.1em] md:tracking-[0.2em] mt-1 line-clamp-1">{activeCount} R.</p>}
                                            </div>

                                            <div className="flex-1 relative">
                                                <div className="absolute inset-0 grid pointer-events-none" style={{ gridTemplateColumns: `repeat(${hours.length}, 1fr)` }}>
                                                    {hours.map((_, i) => <div key={i} className="border-r border-white/5 h-full" />)}
                                                </div>

                                                {visibleLanes.map((lane, laneIdx) => (
                                                    <React.Fragment key={laneIdx}>
                                                        {/* Court Label */}
                                                        {courts.length > 1 && (
                                                            <div className="absolute left-1 z-10 pointer-events-none" style={{ top: `${laneOffsets[laneIdx]}px` }}>
                                                                <p className="text-[6px] font-black text-white/5 uppercase tracking-[0.2em] -rotate-90 origin-left mt-6">
                                                                    {lane.court.name}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {lane.subLanes.map((subLane, subIdx) => (
                                                            subLane.map(booking => {
                                                                const bStart = new Date(booking.startTime);
                                                                const bEnd = new Date(booking.endTime);
                                                                const startHour = bStart.getHours() + bStart.getMinutes() / 60;
                                                                const durationH = (bEnd.getTime() - bStart.getTime()) / 3600000;
                                                                const leftPct = ((startHour - hours[0]) / hours.length) * 100;
                                                                const widthPct = (durationH / hours.length) * 100;

                                                                return (
                                                                    <motion.div
                                                                        key={booking._id}
                                                                        initial={{ opacity: 0, x: -10 }}
                                                                        animate={{ opacity: booking.status === 'CANCELLED' ? 0.4 : 1, x: 0 }}
                                                                        whileHover={{ scale: 1.01, zIndex: 50, opacity: 1 }}
                                                                        onClick={() => setSelectedBooking(booking)}
                                                                        className={cn(
                                                                            "absolute p-2.5 backdrop-blur-md border-l-[3px] rounded-xl z-30 cursor-pointer shadow-xl flex flex-col justify-between transition-all group/card overflow-hidden",
                                                                            booking.status === 'CONFIRMED' && "bg-green-500/5 border-green-500 shadow-green-500/5 hover:bg-green-500/10",
                                                                            booking.status === 'PENDING' && "bg-padel-blue/5 border-padel-blue shadow-padel-blue/5 hover:bg-padel-blue/10",
                                                                            booking.status === 'CANCELLED' && "bg-red-500/5 border-red-500/40 shadow-red-500/5 hover:bg-red-500/10",
                                                                            booking.status === 'COMPLETED' && "bg-white/5 border-white/30"
                                                                        )}
                                                                        style={{
                                                                            left: `${leftPct}%`,
                                                                            width: `${widthPct}%`,
                                                                            top: `${laneOffsets[laneIdx] + (subIdx * 56)}px`,
                                                                            height: '48px',
                                                                            padding: '0 4px'
                                                                        }}
                                                                    >
                                                                        <div className="h-full flex flex-col justify-between py-2">
                                                                            {/* Card Background Glow */}
                                                                            <div className={cn(
                                                                                "absolute top-0 right-0 w-24 h-24 blur-3xl opacity-20 -mr-12 -mt-12 transition-opacity group-hover/card:opacity-40",
                                                                                booking.status === 'CONFIRMED' && "bg-green-500",
                                                                                booking.status === 'PENDING' && "bg-padel-blue",
                                                                                booking.status === 'CANCELLED' && "bg-red-500"
                                                                            )} />

                                                                            <div className="flex justify-between items-start relative z-10">
                                                                                <div className="flex items-center gap-1 min-w-0">
                                                                                    <p className={cn("text-[8px] font-black uppercase tracking-tighter truncate",
                                                                                        booking.status === 'CANCELLED' ? "text-red-400/40 line-through" : "text-white")}>
                                                                                        {booking.user?.name || booking.guestName || 'Inconnu'}
                                                                                    </p>
                                                                                    {booking.bookingType === 'PACK' && (
                                                                                        <span className="text-[6px] font-black bg-padel-yellow text-padel-blue px-1 rounded-sm leading-none py-0.5 flex items-center">PACK</span>
                                                                                    )}
                                                                                    {booking.status === 'CONFIRMED' && <div className="w-1 h-1 rounded-full bg-green-400" />}
                                                                                </div>
                                                                                <span className={cn("text-[6px] font-black uppercase shrink-0 px-1 py-0.5 rounded-md",
                                                                                    booking.status === 'CONFIRMED' && "bg-green-500/20 text-green-400",
                                                                                    booking.status === 'PENDING' && "bg-padel-blue/20 text-padel-blue",
                                                                                    booking.status === 'CANCELLED' && "bg-red-500/20 text-red-400")}>
                                                                                    {durationH}h
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex items-center justify-between mt-0.5 relative z-10">
                                                                                <div className="flex items-center gap-1 min-w-0">
                                                                                    <p className={cn("text-[7px] font-black uppercase tracking-wider truncate",
                                                                                        booking.status === 'CANCELLED' ? "text-red-400/30" : "text-white/30")}>
                                                                                        {booking.court?.name}
                                                                                    </p>
                                                                                </div>
                                                                                <p className="text-[7px] text-white/10 font-bold">
                                                                                    {bStart.getHours()}h{bStart.getMinutes() || '00'}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                );
                                                            })
                                                        ))}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Gestion des Demandes Spéciales (Packs & Abonnements) */}
                <div className="space-y-8 px-2 mt-16 pb-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-padel-yellow/10 flex items-center justify-center text-padel-yellow border border-padel-yellow/20">
                                    <Star size={20} />
                                </div>
                                <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter">Demandes Spéciales</h3>
                            </div>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Gestion des Packs & Abonnements en attente de validation</p>
                        </div>
                    </div>

                    <div className="bg-[#121215]/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                        {/* Decorative background for the section */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-padel-yellow/5 blur-[100px] rounded-full pointer-events-none" />

                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="px-8 py-6 text-left text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Client / Contact</th>
                                        <th className="px-8 py-6 text-left text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Offre / Pack</th>
                                        <th className="px-8 py-6 text-left text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Slot Souhaité</th>
                                        <th className="px-8 py-6 text-left text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Statut</th>
                                        <th className="px-8 py-6 text-right text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.03]">
                                    {bookings.filter(b => b.bookingType === 'PACK' || b.bookingType === 'SUBSCRIPTION').length > 0 ? (
                                        bookings.filter(b => b.bookingType === 'PACK' || b.bookingType === 'SUBSCRIPTION').map((request) => (
                                            <tr key={request._id} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 font-black text-lg group-hover:scale-110 transition-transform duration-500">
                                                            {(request.user?.name || request.guestName || '?')[0].toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-white uppercase tracking-tighter group-hover:text-padel-yellow transition-colors">
                                                                {request.user?.name || request.guestName || 'Client Inconnu'}
                                                            </p>
                                                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                                                                <MessageSquare size={10} className="text-padel-blue" />
                                                                {request.user?.email || request.guestEmail || 'Aucun contact'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-8 h-8 rounded-lg flex items-center justify-center",
                                                            request.bookingType === 'PACK' ? "bg-padel-yellow/10 text-padel-yellow" : "bg-padel-blue/10 text-padel-blue"
                                                        )}>
                                                            {request.bookingType === 'PACK' ? <Package size={14} /> : <Star size={14} />}
                                                        </div>
                                                        <div>
                                                            <p className="text-[11px] font-black text-white uppercase tracking-widest">{request.packName || 'Offre Spéciale'}</p>
                                                            <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">{request.bookingType}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-center bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                                                            <p className="text-[7px] font-black text-white/30 uppercase leading-none mb-1">Mois</p>
                                                            <p className="text-xs font-black text-white leading-none">
                                                                {new Date(request.startTime).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                                                            </p>
                                                        </div>
                                                        <div className="h-4 w-[1px] bg-white/10" />
                                                        <div className="text-padel-yellow">
                                                            <p className="text-[7px] font-black uppercase opacity-30 leading-none mb-1 text-center">Début</p>
                                                            <p className="text-xs font-black leading-none">
                                                                {new Date(request.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className={cn(
                                                        "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
                                                        request.status === 'CONFIRMED' ? "bg-green-500/10 border-green-500/20 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]" :
                                                            request.status === 'PENDING' ? "bg-padel-blue/10 border-padel-blue/20 text-padel-blue" :
                                                                "bg-white/5 border-white/10 text-white/20"
                                                    )}>
                                                        <div className={cn("w-1.5 h-1.5 rounded-full",
                                                            request.status === 'CONFIRMED' ? "bg-green-500 animate-pulse" :
                                                                request.status === 'PENDING' ? "bg-padel-blue" : "bg-white/20"
                                                        )} />
                                                        {request.status}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <button
                                                            onClick={() => setSelectedBooking(request)}
                                                            className="p-3 rounded-xl bg-white/5 text-white/30 hover:bg-white/10 hover:text-white transition-all shadow-sm border border-white/10"
                                                            title="Voir Détails"
                                                        >
                                                            <ExternalLink size={14} />
                                                        </button>

                                                        {request.status === 'PENDING' && (
                                                            <button
                                                                onClick={() => handleChangeStatus(request, 'CONFIRMED')}
                                                                className="px-6 py-3 rounded-xl bg-green-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg shadow-green-500/10 flex items-center gap-2"
                                                            >
                                                                Valider <ArrowRight size={14} />
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={() => setDeleteTarget(request)}
                                                            className="p-3 rounded-xl bg-red-500/5 text-red-500/30 hover:bg-red-500/10 hover:text-red-500 transition-all border border-red-500/10"
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center gap-4 opacity-10">
                                                    <Package size={64} />
                                                    <p className="text-[14px] font-black uppercase tracking-[0.4em]">Aucune demande spéciale en cours</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="flex flex-col sm:flex-row items-center justify-between px-4 gap-4">
                    <p className="text-[8px] md:text-[10px] font-black text-white/10 uppercase tracking-[0.3em] text-center sm:text-left">
                        {kpis.totalAll} réservations totales • {bookings.filter(b => b.status === 'CANCELLED').length} annulées
                    </p>
                    <p className="text-[8px] md:text-[10px] font-black text-white/10 uppercase tracking-[0.3em] text-center sm:text-right">
                        Sync: {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </motion.div>

            {/* Create Booking Overlay */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <CreateBookingModal
                        users={users}
                        courts={courts}
                        onClose={() => setIsCreateModalOpen(false)}
                        onFinish={handleCreateBooking}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedBooking && !deleteTarget && (
                    <BookingDetailModal
                        booking={selectedBooking}
                        onClose={() => setSelectedBooking(null)}
                        onDelete={() => setDeleteTarget(selectedBooking)}
                        onChangeStatus={(status) => handleChangeStatus(selectedBooking, status)}
                    />
                )}
                {deleteTarget && (
                    <DeleteConfirmModal
                        booking={deleteTarget}
                        onClose={() => setDeleteTarget(null)}
                        onConfirm={handleDeleteBooking}
                        loading={deleting}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
