import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    BarChart3,
    PieChart,
    TrendingUp,
    TrendingDown,
    Users,
    Calendar,
    Target,
    Zap,
    ArrowUpRight,
    Search,
    Filter,
    Loader2,
    RefreshCw,
    Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';

interface StatsData {
    totalRevenue: number;
    userCount: number;
    courtCount: number;
    bookingCount: number;
    recentBookings: any[];
    hourlyStats: number[];
    activityStats: { label: string, val: number }[];
    peakHours: string;
    changes: {
        revenue: string;
        users: string;
        bookings: string;
        courts: string;
    };
}

export function AdminStats() {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching stats:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading && !stats) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-padel-blue" size={48} />
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Chargement Data Engine...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-12 pb-10"
        >
            {/* Intel Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-8 md:pb-12 pt-6 md:pt-0">
                <div className="space-y-3 md:space-y-4 text-center sm:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-padel-blue/10 border border-padel-blue/20 text-padel-blue text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] shadow-[0_0_20px_rgba(0,149,255,0.1)]"
                    >
                        <Zap size={10} className="animate-pulse md:w-3 md:h-3" /> Intelligence Center
                    </motion.div>
                    <div>
                        <h2 className="text-4xl sm:text-6xl md:text-8xl font-display font-black text-white italic uppercase tracking-tighter leading-[0.9] md:leading-[0.8] drop-shadow-2xl">
                            Command <br /> <span className="text-padel-yellow drop-shadow-[0_0_40px_rgba(255,210,31,0.2)]">& Performance</span>
                        </h2>
                        <p className="text-[10px] md:text-xs font-black text-white/30 uppercase tracking-[0.2em] md:tracking-[0.4em] mt-4 md:mt-6 italic flex items-center justify-center sm:justify-start gap-2 md:gap-3">
                            <span className="hidden sm:block w-8 h-[1px] bg-white/10" /> Système d'Analyse Stratégique v2.0
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-full sm:w-auto px-6 py-4 bg-white/[0.03] border border-white/10 rounded-xl md:rounded-[1.5rem] flex flex-col items-center sm:items-end">
                        <span className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-widest italic">Status Système</span>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                            <span className="text-[10px] md:text-[11px] font-black text-white italic tracking-tighter">SYNCHRONISÉ</span>
                        </div>
                    </div>
                    <button
                        onClick={fetchStats}
                        className="w-full sm:w-auto h-[60px] md:h-[68px] px-8 rounded-xl md:rounded-[1.5rem] bg-padel-blue text-white shadow-2xl flex items-center justify-center gap-3 group hover:bg-padel-yellow hover:text-padel-blue transition-all duration-500"
                    >
                        <RefreshCw size={18} className={cn("transition-transform duration-700 md:w-5 md:h-5", loading && "animate-spin")} />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Update Live</span>
                    </button>
                </div>
            </div>

            {/* Matrix Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                    { label: 'Flux Revenu Global', val: `${stats?.totalRevenue?.toLocaleString() || 0}€`, change: stats?.changes?.revenue || '0%', icon: Target, color: 'blue' },
                    { label: 'Réseau Athlètes', val: stats?.userCount?.toLocaleString() || '0', change: stats?.changes?.users || '0', icon: Users, color: 'yellow' },
                    { label: 'Déploiements Rés.', val: stats?.bookingCount?.toLocaleString() || '0', change: stats?.changes?.bookings || '+0', icon: ArrowUpRight, color: 'blue' },
                    { label: 'Infrastructure', val: stats?.courtCount?.toLocaleString() || '0', change: stats?.changes?.courts || '0% UP', icon: TrendingUp, color: 'yellow' }
                ].map((metric, i) => (
                    <motion.div
                        key={metric.label}
                        whileHover={{ y: -8, scale: 1.02 }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-6 md:p-8 rounded-2xl md:rounded-[3rem] relative overflow-hidden group hover:border-white/20 transition-all duration-500 shadow-3xl flex flex-col justify-between"
                    >
                        <div className="flex items-center justify-between mb-8 md:mb-10">
                            <div className={cn(
                                "w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[1.5rem] flex items-center justify-center border transition-all duration-700 relative",
                                metric.color === 'blue' ? "bg-padel-blue/10 border-padel-blue/20 text-padel-blue group-hover:bg-padel-blue group-hover:text-white" : "bg-padel-yellow/10 border-padel-yellow/20 text-padel-yellow group-hover:bg-padel-yellow group-hover:text-padel-blue"
                            )}>
                                <metric.icon size={22} className="md:w-[28px] md:h-[28px]" />
                                <div className="absolute inset-0 rounded-xl md:rounded-[1.5rem] bg-current opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700" />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[8px] md:text-[10px] font-black text-green-500 uppercase tracking-widest italic">{metric.change}</span>
                                <div className="w-10 md:w-12 h-0.5 md:h-1 bg-green-500/20 rounded-full mt-1 overflow-hidden">
                                    <motion.div initial={{ x: '-100%' }} animate={{ x: '0' }} transition={{ delay: 1, duration: 1 }} className="h-full w-full bg-green-500" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.2em] md:tracking-[0.35em] mb-1.5 md:mb-2 italic">{metric.label}</p>
                            <p className="text-3xl md:text-5xl font-black text-white italic tracking-tighter leading-none">{metric.val}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Central Analysis Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visual Data Block */}
                <div className="lg:col-span-8 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-12 relative overflow-hidden lg:h-[540px] flex flex-col group shadow-3xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,149,255,0.05)_0%,transparent_70%)]" />

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 sm:mb-16 relative z-10">
                        <div className="space-y-1">
                            <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3 md:gap-4">
                                <BarChart3 className="text-padel-blue md:w-[28px] md:h-[28px]" size={22} /> Infrastructure
                            </h3>
                            <p className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.3em] md:tracking-[0.4em] ml-9 md:ml-11 italic">Analyse des flux horaires</p>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            {['24H', '7D', '30D'].map(t => (
                                <button key={t} className={cn("flex-1 sm:flex-none px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all", t === '24H' ? "bg-padel-blue text-white" : "text-white/20 hover:text-white hover:bg-white/5 border border-white/5")}>{t}</button>
                            ))}
                        </div>
                    </div>

                    {/* Enhanced Graph */}
                    <div className="flex-1 flex items-end gap-2 sm:gap-4 md:gap-5 pb-4 relative z-10 border-b border-white/5 h-[300px] lg:h-auto overflow-x-auto sm:overflow-visible custom-scrollbar scroll-smooth px-2">
                        <div className="absolute inset-0 flex flex-col justify-between py-4 opacity-5 pointer-events-none">
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full h-px bg-white" />)}
                        </div>
                        {(stats?.hourlyStats || [40, 65, 45, 90, 100, 75, 60, 85, 95, 70, 55, 80]).map((h, i) => (
                            <div key={i} className="flex-1 min-w-[25px] sm:min-w-0 flex flex-col items-center gap-4 md:gap-6 group/bar relative">
                                <div className="absolute -top-10 opacity-0 group-hover/bar:opacity-100 transition-all duration-300 pointer-events-none z-20">
                                    <div className="bg-white px-2 py-1 rounded text-padel-blue text-[8px] font-black italic shadow-2xl whitespace-nowrap">{h}%</div>
                                </div>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(h / 110) * 100}%` }}
                                    transition={{ delay: 0.1 * i, duration: 2, ease: "circOut" }}
                                    className={cn(
                                        "w-full rounded-lg md:rounded-2xl relative overflow-hidden transition-all duration-700",
                                        h > 90 ? "bg-padel-blue shadow-[0_0_40px_rgba(0,149,255,0.4)]" : "bg-white/10 group-hover/bar:bg-white/20"
                                    )}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10" />
                                </motion.div>
                                <span className="text-[7px] md:text-[9px] font-black text-white/20 uppercase tracking-widest italic group-hover/bar:text-white transition-colors">{10 + i}h</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 lg:absolute lg:bottom-12 lg:right-12 p-6 md:p-8 bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-[2.5rem] backdrop-blur-3xl transform lg:group-hover:-translate-y-2 transition-all duration-700 shadow-2xl">
                        <div className="flex items-center gap-4 mb-3 md:mb-4">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-padel-yellow/20 flex items-center justify-center text-padel-yellow">
                                <Zap size={16} className="animate-pulse md:w-5 md:h-5" />
                            </div>
                            <div>
                                <p className="text-[8px] md:text-[9px] font-black text-padel-yellow uppercase tracking-widest italic">Peak</p>
                                <p className="text-xl md:text-3xl font-black text-white italic tracking-tighter">{stats?.peakHours || 'Analysis'}</p>
                            </div>
                        </div>
                        <p className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em] leading-relaxed italic">Occupation critique détectée • <br />Optimisation recommandée</p>
                    </div>
                </div>

                {/* Lateral Distribution Block */}
                <div className="lg:col-span-4 h-full">
                    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 relative overflow-hidden h-full shadow-3xl group">
                        <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter mb-10 md:mb-14 flex items-center gap-3 md:gap-4 relative z-10">
                            <PieChart className="text-padel-yellow md:w-[28px] md:h-[28px]" size={22} /> Flux
                        </h3>

                        <div className="space-y-8 md:space-y-10 flex-1 relative z-10">
                            {(stats?.activityStats || [
                                { label: 'Tournois', val: 55 },
                                { label: 'Libre', val: 35 },
                                { label: 'Pro', val: 10 }
                            ]).map((item: any, i: number) => (
                                <div key={item.label} className="space-y-3 md:space-y-4 group/item">
                                    <div className="flex justify-between items-end px-1">
                                        <div className="space-y-1">
                                            <span className="text-[9px] md:text-[11px] font-black text-white/40 uppercase tracking-widest group-hover/item:text-padel-blue transition-colors italic">{item.label}</span>
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "w-1.5 h-1.5 md:w-2 md:h-2 rounded-full",
                                                    i === 0 ? "bg-padel-blue shadow-[0_0_8px_rgba(0,149,255,0.4)]" : i === 1 ? "bg-padel-yellow shadow-[0_0_8px_rgba(255,210,31,0.4)]" : "bg-white/20"
                                                )} />
                                                <span className="text-[10px] sm:text-xs font-black text-white/10 uppercase tracking-[0.1em] md:tracking-[0.2em]">Secteur</span>
                                            </div>
                                        </div>
                                        <span className="text-2xl md:text-3xl font-black text-white italic tracking-tighter group-hover/item:scale-110 transition-transform duration-500">{item.val}%</span>
                                    </div>
                                    <div className="h-4 bg-white/[0.03] rounded-full p-1 border border-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.val}%` }}
                                            transition={{ delay: 1 + (i * 0.2), duration: 2, ease: "circOut" }}
                                            className={cn(
                                                "h-full rounded-full transition-all duration-700",
                                                i === 0 ? "bg-padel-blue shadow-[0_0_20px_rgba(0,149,255,0.3)]" : i === 1 ? "bg-padel-yellow shadow-[0_0_20px_rgba(255,210,31,0.2)]" : "bg-white/20"
                                            )}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
