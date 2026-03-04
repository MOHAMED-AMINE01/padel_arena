import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
    TrendingUp,
    Users,
    Target,
    CreditCard,
    Ticket,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    Building2,
    CheckCircle2,
    Clock,
    XCircle,
    Zap,
    BarChart3,
    Calendar,
    ArrowRight,
    X,
    Filter,
    Search
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';
import { PremiumDatePicker } from '../../components/admin/PremiumDatePicker';

// --- Subcomponents ---

const Loader2 = ({ size, className }: { size?: number; className?: string }) => (
    <Clock size={size || 24} className={cn("animate-spin", className)} />
);

const KPICard = ({ title, value, change, icon: Icon, isPositive, color = 'blue', loading }: {
    title: string;
    value: string | number;
    change?: string;
    icon: any;
    isPositive?: boolean;
    color?: 'blue' | 'yellow' | 'green';
    loading?: boolean;
}) => (
    <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        className="bg-[#151518]/60 backdrop-blur-xl border border-white/10 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] relative overflow-hidden group shadow-2xl h-full"
    >
        <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-white/5 rounded-full blur-2xl md:blur-3xl -mr-12 -mt-12 md:-mr-16 md:-mt-16 group-hover:bg-white/10 transition-all duration-1000" />
        <div className="flex items-center justify-between mb-6 md:mb-8 relative z-10">
            <div className={cn(
                "w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-[1.25rem] flex items-center justify-center transition-all duration-500 shadow-xl border border-white/10",
                color === 'blue' ? "bg-padel-blue text-white shadow-padel-blue/20" :
                    color === 'yellow' ? "bg-padel-yellow text-padel-blue shadow-padel-yellow/20" :
                        "bg-green-500 text-white shadow-green-500/20"
            )}>
                <Icon size={isPositive ? 18 : 22} className="md:w-6 md:h-6" />
            </div>
            {change && (
                <div className={cn(
                    "flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-wider shadow-inner",
                    isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                )}>
                    {isPositive ? <ArrowUpRight size={10} className="md:w-3.5 md:h-3.5" /> : <ArrowDownRight size={10} className="md:w-3.5 md:h-3.5" />}
                    {change}
                </div>
            )}
        </div>
        <div className="relative z-10">
            <h3 className="text-[8px] md:text-[11px] font-black text-white/30 uppercase tracking-[0.2em] md:tracking-[0.4em] mb-2 md:mb-3 leading-none truncate">{title}</h3>
            {loading ? (
                <div className="h-8 md:h-10 w-16 md:w-24 bg-white/5 animate-pulse rounded-lg" />
            ) : (
                <p className="text-xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none">{value}</p>
            )}
        </div>
    </motion.div>
);

const HourlyChart = ({ data, loading }: { data: number[]; loading: boolean }) => {
    const maxVal = Math.max(...data, 1);
    const hourlyLabels = ["8h", "10h", "12h", "14h", "16h", "18h", "20h", "22h"];

    return (
        <div className="bg-[#151518]/60 backdrop-blur-3xl border border-white/10 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] h-full shadow-3xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-padel-blue/5 via-transparent to-padel-yellow/5" />

            <div className="flex items-center justify-between mb-12 relative z-10">
                <div className="space-y-1">
                    <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-tighter leading-none">Occupation Aujourd'hui</h3>
                    <p className="text-[9px] md:text-[11px] font-bold text-white/20 uppercase tracking-[0.2em]">Distribution horaire en temps réel (8h - 22h)</p>
                </div>
            </div>

            <div className="h-72 flex items-end gap-2 md:gap-4 px-2 relative z-10">
                {/* Horizontal Grid Lines */}
                <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between opacity-20 pointer-events-none">
                    {[0, 1, 2, 3].map(i => <div key={i} className="border-t border-white/10 w-full" />)}
                </div>

                {loading ? (
                    Array.from({ length: 15 }).map((_, i) => (
                        <div key={i} className="flex-1 h-20 bg-white/5 animate-pulse rounded-2xl" />
                    ))
                ) : data.length > 0 ? data.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar relative h-full justify-end">
                        {val > 0 && (
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-padel-blue text-[9px] font-black px-3 py-1.5 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all scale-75 group-hover/bar:scale-100 whitespace-nowrap z-20 shadow-xl">
                                {val} rés.
                            </div>
                        )}

                        {/* The Bar */}
                        <motion.div
                            initial={{ height: 4 }} // Start with a small visible base
                            animate={{ height: `${Math.max((val / maxVal) * 100, 4)}%` }}
                            transition={{ delay: i * 0.04, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className={cn(
                                "w-full rounded-t-2xl transition-all duration-500 relative overflow-hidden min-h-[4px]",
                                val === maxVal && val > 0 ? "bg-gradient-to-t from-padel-yellow to-padel-yellow/80 shadow-[0_0_40px_rgba(255,210,31,0.2)]" :
                                    val > 0 ? "bg-gradient-to-t from-padel-blue to-padel-blue/60 shadow-[0_0_30px_rgba(19,73,211,0.1)]" :
                                        "bg-white/5" // Faint base for 0 data
                            )}
                        >
                            {val > 0 && <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-50" />}
                        </motion.div>

                        {/* Hour marker hidden but useful for alignment */}
                        <span className="hidden leading-none text-[8px] font-black text-white/10 lg:block opacity-0 group-hover/bar:opacity-100 transition-opacity">
                            {8 + i}h
                        </span>
                    </div>
                )) : Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="flex-1 h-[4px] bg-white/5 rounded-full" />
                ))}
            </div>

            <div className="flex justify-between mt-10 px-0 md:px-2 text-[8px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.2em] md:tracking-[0.4em] relative z-10 border-t border-white/5 pt-6">
                {hourlyLabels.map(h => <span key={h}>{h}</span>)}
            </div>
        </div>
    );
};

const ActivityItem = ({ title, time, court, status }: any) => (
    <div className="flex gap-4 group cursor-pointer p-3 rounded-[1.5rem] hover:bg-white/[0.04] border border-transparent hover:border-white/5 transition-all relative overflow-hidden mb-1">
        {/* Glow Background on Hover */}
        <div className={cn(
            "absolute -right-4 -top-4 w-16 h-16 blur-[40px] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none rounded-full",
            status === 'CONFIRMED' ? "bg-green-500" :
                status === 'CANCELLED' ? "bg-red-500" :
                    status === 'PENDING' ? "bg-padel-blue" :
                        "bg-white"
        )} />

        <div className="flex flex-col items-center shrink-0">
            <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center relative z-10 transition-all group-hover:scale-105 shadow-2xl border bg-gradient-to-br",
                status === 'CONFIRMED' || status === 'COMPLETED' ? "from-green-500/20 to-green-500/40 border-green-500/40 text-green-400" :
                    status === 'CANCELLED' ? "from-red-500/20 to-red-500/40 border-red-500/40 text-red-400" :
                        status === 'PENDING' ? "from-padel-blue/20 to-padel-blue/40 border-padel-blue/40 text-padel-blue" :
                            "from-white/10 to-white/20 border-white/20 text-white/60"
            )}>
                <Activity size={18} className={cn(status === 'PENDING' && "animate-pulse")} />
            </div>
            <div className="w-[1px] flex-1 bg-gradient-to-b from-white/10 to-transparent group-last:hidden mt-3" />
        </div>

        <div className="flex-1 pb-4 relative z-10">
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <p className="text-[7px] font-black text-white/20 uppercase tracking-[0.3em]">Réservation</p>
                </div>
                <span className="text-[8px] text-white/20 font-black tracking-tighter bg-white/5 px-1.5 py-0.5 rounded-md border border-white/5">{time}</span>
            </div>

            <div className="space-y-0.5">
                <p className="text-[12px] font-black text-white uppercase tracking-tighter leading-none group-hover:text-padel-yellow transition-colors">
                    {title}
                </p>
                {court && (
                    <div className="flex items-center gap-1 opacity-30 group-hover:opacity-80 transition-opacity">
                        <Building2 size={8} className="text-padel-blue" />
                        <p className="text-[8px] font-bold text-white uppercase tracking-widest">{court}</p>
                    </div>
                )}
            </div>

            {status && (
                <div className={cn(
                    "mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-[0.2em]",
                    status === 'CONFIRMED' || status === 'COMPLETED' ? "bg-green-500/10 text-green-500 border border-green-500/30 shadow-green-500/5" :
                        status === 'CANCELLED' ? "bg-red-500/10 text-red-500 border border-red-500/30 shadow-red-500/5" :
                            status === 'PENDING' ? "bg-padel-blue/10 text-padel-blue border border-padel-blue/30 shadow-padel-blue/5" :
                                "bg-white/5 text-white/40 border border-white/10"
                )}>
                    {status === 'CONFIRMED' || status === 'COMPLETED' ? <CheckCircle2 size={8} /> : status === 'CANCELLED' ? <XCircle size={8} /> : <Clock size={8} />}
                    {status === 'COMPLETED' ? 'PAYÉ' : status}
                </div>
            )}
        </div>
    </div>
);

const StatusChip = ({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon: any }) => (
    <div className="flex items-center justify-between p-4 md:p-6 bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl group hover:border-white/20 transition-all">
        <div className="flex items-center gap-4">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-lg", color)}>
                <Icon size={18} />
            </div>
            <span className="text-[11px] font-black text-white/30 uppercase tracking-widest">{label}</span>
        </div>
        <span className="text-2xl font-black text-white tracking-tighter">{value}</span>
    </div>
);

const LogsModal = ({ isOpen, onClose, bookings }: { isOpen: boolean; onClose: () => void; bookings: any[] }) => {
    const [selectedDate, setSelectedDate] = useState<string>('');

    const filteredBookings = useMemo(() => {
        if (!selectedDate) return bookings;
        return bookings.filter(b => {
            const date = new Date(b.createdAt).toISOString().split('T')[0];
            return date === selectedDate;
        });
    }, [bookings, selectedDate]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-dark-bg/80 backdrop-blur-2xl"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 30 }}
                        className="relative w-full max-w-2xl bg-[#151518] border border-white/10 rounded-[2rem] md:rounded-[3rem] shadow-3xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh]"
                    >
                        <div className="flex flex-col p-6 md:p-8 border-b border-white/5 bg-white/[0.01] gap-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-padel-blue/10 flex items-center justify-center text-padel-blue border border-padel-blue/20">
                                        <Activity size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-tighter">Flux Réseau Complet</h3>
                                        <p className="text-[8px] md:text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Historique des transactions & événements</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-white/5 text-white/20 hover:text-white hover:bg-white/10 transition-all">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <PremiumDatePicker
                                        value={selectedDate || new Date().toISOString().split('T')[0]}
                                        onChange={setSelectedDate}
                                    />
                                </div>
                                {selectedDate && (
                                    <button
                                        onClick={() => setSelectedDate('')}
                                        className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[9px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
                                    >
                                        Réinitialiser
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            <div className="space-y-1">
                                {filteredBookings?.length > 0 ? (
                                    filteredBookings.map((booking: any) => (
                                        <ActivityItem
                                            key={booking._id}
                                            title={booking.user?.name}
                                            court={booking.court?.name}
                                            time={new Date(booking.createdAt).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            status={booking.status}
                                        />
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-20">
                                        <Search size={64} className="mb-4" />
                                        <p className="text-[12px] font-black uppercase tracking-widest">
                                            {selectedDate ? "Aucun log pour cette date" : "Aucun log disponible"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-8 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/20">
                            <span>{filteredBookings?.length || 0} Entrées détectées</span>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Synchronisation Live
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLogsOpen, setIsLogsOpen] = useState(false);

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/stats');
            setStats(response.data.data);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching admin stats:', err);
            setError('Impossible de récupérer les datas du cockpit.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-8 bg-[#151518] rounded-[2.5rem] md:rounded-[4rem] border border-red-500/20 p-10 md:p-20 text-center shadow-3xl">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shadow-2xl shadow-red-500/20">
                    <XCircle size={40} md:size={48} />
                </div>
                <div className="space-y-3">
                    <h2 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tighter">Cockpit Hors-Ligne</h2>
                    <p className="text-white/40 text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] max-w-sm mx-auto">{error}</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="group relative px-12 py-5 bg-padel-blue text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest overflow-hidden transition-all hover:scale-105"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative z-10 flex items-center gap-2">RE-SYNCHRONISER <Zap size={16} /></span>
                </button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16 pb-10"
        >
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-white/5 pb-10 md:pb-16 pt-10 md:pt-0">
                <div className="space-y-6">

                    <div>
                        <h1 className="text-5xl sm:text-6xl md:text-8xl font-display font-black text-white uppercase tracking-tighter leading-[0.85] md:leading-[0.8]">
                            Dashboard
                        </h1>

                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                <KPICard title="Revenue Global" value={`${stats?.totalRevenue?.toLocaleString('fr-FR') || 0} €`} change={stats?.changes?.revenue} icon={CreditCard} isPositive={true} loading={loading} />
                <KPICard title="Réservations Totales" value={stats?.bookingCount || 0} change={stats?.changes?.bookings} icon={Target} isPositive={true} color="yellow" loading={loading} />
                <KPICard title="Occupation Jour" value={`${stats?.occupancyToday || 0}%`} icon={BarChart3} isPositive={true} color="blue" loading={loading} />
                <KPICard title="Athlètes Inscrits" value={stats?.userCount || 0} change={stats?.changes?.users} icon={Users} isPositive={true} loading={loading} />
                <KPICard title="Terrains Actifs" value={`${stats?.activeCourts || 0} / ${stats?.courtCount || 0}`} change={stats?.changes?.courts} icon={Building2} isPositive={true} color="green" loading={loading} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-8">
                    <HourlyChart data={stats?.hourlyStats || []} loading={loading} />
                </div>
                <div className="xl:col-span-4 bg-[#151518]/60 backdrop-blur-3xl border border-white/10 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-3xl relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform"><Activity size={200} /></div>
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <h3 className="text-lg md:text-xl font-display font-black text-white uppercase tracking-tighter">Activité Live</h3>
                        <div className="flex items-center gap-2">
                            {loading && <Loader2 className="animate-spin text-padel-yellow" size={14} />}
                            <div className="px-2.5 py-1 bg-padel-blue text-white text-[8px] font-black uppercase rounded-lg">SYNC OK</div>
                        </div>
                    </div>
                    <div className="flex-1 space-y-1 max-h-[460px] overflow-y-auto custom-scrollbar pr-2 relative z-10">
                        {loading ? (Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-24 bg-white/5 animate-pulse rounded-[2rem] mb-4" />)) :
                            stats?.recentBookings?.length > 0 ? (
                                stats.recentBookings.map((booking: any) => (
                                    <ActivityItem
                                        key={booking._id}
                                        title={booking.user?.name}
                                        court={booking.court?.name}
                                        time={new Date(booking.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                        status={booking.status}
                                    />
                                ))
                            ) : (<div className="flex flex-col items-center justify-center py-20 text-center space-y-4"><Activity className="text-white/5" size={64} /><p className="text-white/20 text-[11px] font-black uppercase tracking-[0.3em]">Aucune transaction récente détectée</p></div>)}
                    </div>
                    <button
                        onClick={() => setIsLogsOpen(true)}
                        className="w-full mt-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                    >
                        Voir les logs réseau <ArrowRight size={14} />
                    </button>
                </div>
            </div>

            <LogsModal
                isOpen={isLogsOpen}
                onClose={() => setIsLogsOpen(false)}
                bookings={stats?.recentBookings || []}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                <div className="bg-[#151518]/60 backdrop-blur-xl border border-white/10 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl lg:col-span-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                        <h3 className="text-[10px] md:text-[12px] font-black text-white/30 uppercase tracking-[0.4em]">Segmentation Réservations</h3>
                        <span className="text-[9px] md:text-[10px] font-black text-padel-yellow uppercase tracking-widest bg-padel-yellow/10 px-3 py-1 rounded-full">Total Global</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <StatusChip label="Confirmées" value={stats?.confirmedCount || 0} color="bg-green-500 text-white" icon={CheckCircle2} />
                        <StatusChip label="En Attente" value={stats?.pendingCount || 0} color="bg-padel-blue text-white" icon={Clock} />
                        <StatusChip label="Terminées" value={stats?.completedCount || 0} color="bg-white text-padel-blue" icon={Target} />
                        <StatusChip label="Annulées" value={stats?.cancelledCount || 0} color="bg-red-500 text-white" icon={XCircle} />
                    </div>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} className="bg-padel-blue p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] relative overflow-hidden flex flex-col justify-between shadow-3xl shadow-padel-blue/40">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 via-transparent to-black/20 pointer-events-none" />
                    <div className="relative z-10">
                        <Zap size={32} md:size={48} className="text-padel-yellow mb-6 md:mb-10" />
                        <h2 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tighter leading-[0.9]">Peak <br /> Performance</h2>
                        <div className="mt-6 md:mt-8 space-y-2">
                            <p className="text-[10px] md:text-xs font-black text-white/60 uppercase tracking-widest">Heure de Pointe Aujourd'hui</p>
                            <p className="text-xl md:text-3xl font-black text-padel-yellow uppercase tracking-tighter">{stats?.peakHours || '—'}</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
