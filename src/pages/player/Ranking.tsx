import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
    Trophy,
    TrendingUp,
    Target,
    Award,
    Flame,
    Calendar,
    Users,
    ChevronUp,
    ChevronDown,
    Minus,
    Star,
    Zap,
    Medal,
    Crown
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

interface Stats {
    points: number;
    rank: number;
    level: string;
    matchesPlayed: number;
    wins: number;
    losses: number;
    winRate: number;
    streak: number;
    bestRank: number;
    tournamentsPlayed: number;
    tournamentsWon: number;
}

interface RankingPlayer {
    rank: number;
    name: string;
    points: number;
    change: number;
    avatar: string;
}

interface MatchHistory {
    result: string;
    opponent: string;
    score: string;
    date: string;
}

const levelProgress = [
    { level: "DEBUTANT", minPoints: 0, maxPoints: 500, color: "from-gray-500 to-gray-400" },
    { level: "INTERMEDIAIRE", minPoints: 500, maxPoints: 1200, color: "from-green-500 to-emerald-400" },
    { level: "AVANCE", minPoints: 1200, maxPoints: 2000, color: "from-blue-500 to-cyan-400" },
    { level: "EXPERT", minPoints: 2000, maxPoints: 3000, color: "from-purple-500 to-violet-400" },
    { level: "ELITE", minPoints: 3000, maxPoints: 5000, color: "from-padel-yellow to-amber-400" },
];

export function PlayerRanking() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<Stats>({
        points: 0,
        rank: 999,
        level: "DEBUTANT",
        matchesPlayed: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        streak: 0,
        bestRank: 999,
        tournamentsPlayed: 0,
        tournamentsWon: 0
    });
    const [rankings, setRankings] = useState<RankingPlayer[]>([]);
    const [matchHistory, setMatchHistory] = useState<MatchHistory[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsRes, rankingsRes, historyRes] = await Promise.all([
                    api.get('/stats/me'),
                    api.get('/stats/rankings?limit=5'),
                    api.get('/stats/history?limit=5')
                ]);

                if (statsRes.data.success) {
                    setStats(statsRes.data.data);
                }
                if (rankingsRes.data.success) {
                    setRankings(rankingsRes.data.data);
                }
                if (historyRes.data.success) {
                    setMatchHistory(historyRes.data.data);
                }
            } catch (error) {
                console.error('Error fetching ranking data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getCurrentLevelInfo = () => {
        return levelProgress.find(l => stats.points >= l.minPoints && stats.points < l.maxPoints) || levelProgress[levelProgress.length - 1];
    };

    const currentLevel = getCurrentLevelInfo();
    const progressPercent = ((stats.points - currentLevel.minPoints) / (currentLevel.maxPoints - currentLevel.minPoints)) * 100;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-padel-blue/20 border-t-padel-blue rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 md:space-y-12 pb-10">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-display font-black text-white italic uppercase tracking-tighter leading-none mb-2 sm:mb-4">
                    Niveau & <span className="text-padel-yellow">Classement</span>
                </h1>
                <p className="text-white/40 text-[11px] sm:text-[13px] font-medium max-w-md uppercase tracking-widest">
                    Suivez votre progression et comparez vos performances.
                </p>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Level Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 bg-[#151518] border border-white/10 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-padel-yellow/10 to-transparent rounded-full blur-3xl" />
                    
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-padel-yellow/10 flex items-center justify-center">
                            <Crown size={20} className="text-padel-yellow" />
                        </div>
                        <h2 className="text-xs font-black text-white uppercase tracking-[0.3em]">Niveau Actuel</h2>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
                        <div>
                            <p className={cn(
                                "text-3xl sm:text-4xl md:text-5xl font-black italic uppercase tracking-tight bg-gradient-to-r bg-clip-text text-transparent",
                                currentLevel.color
                            )}>
                                {stats.level}
                            </p>
                            <p className="text-white/30 text-[10px] sm:text-xs font-bold mt-2 uppercase tracking-widest">
                                {stats.points} / {currentLevel.maxPoints} points
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <p className="text-2xl sm:text-3xl font-black text-white">{stats.points}</p>
                                <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Points</p>
                            </div>
                            <div className="w-px h-12 bg-white/10" />
                            <div className="text-center">
                                <p className="text-2xl sm:text-3xl font-black text-padel-blue">#{stats.rank}</p>
                                <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Rang</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-bold text-white/30 uppercase tracking-widest">
                            <span>{currentLevel.level}</span>
                            <span>{Math.round(progressPercent)}%</span>
                        </div>
                        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={cn("h-full rounded-full bg-gradient-to-r", currentLevel.color)}
                            />
                        </div>
                        <p className="text-[10px] text-white/20 font-bold">
                            Encore {currentLevel.maxPoints - stats.points} points pour le niveau suivant
                        </p>
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#151518] border border-white/10 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-padel-blue/10 flex items-center justify-center">
                            <TrendingUp size={20} className="text-padel-blue" />
                        </div>
                        <h2 className="text-xs font-black text-white uppercase tracking-[0.3em]">Statistiques</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Matchs", value: stats.matchesPlayed, icon: Target },
                            { label: "Victoires", value: stats.wins, icon: Trophy },
                            { label: "Win Rate", value: `${stats.winRate}%`, icon: Zap },
                            { label: "Série", value: `${stats.streak}W`, icon: Flame },
                        ].map((stat, i) => (
                            <div key={i} className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                                <stat.icon size={16} className="text-white/20 mb-2" />
                                <p className="text-lg sm:text-xl font-black text-white">{stat.value}</p>
                                <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Rankings & Achievements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Club Rankings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#151518] border border-white/10 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-padel-yellow/10 flex items-center justify-center">
                                <Medal size={20} className="text-padel-yellow" />
                            </div>
                            <h2 className="text-xs font-black text-white uppercase tracking-[0.3em]">Classement Club</h2>
                        </div>
                        <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Top 5</span>
                    </div>

                    <div className="space-y-3">
                        {rankings.length > 0 ? rankings.map((player, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "flex items-center gap-4 p-3 sm:p-4 rounded-xl transition-all",
                                    player.name === user?.name?.toUpperCase() 
                                        ? "bg-padel-blue/10 border border-padel-blue/20" 
                                        : "bg-white/[0.02] border border-white/5"
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm",
                                    i === 0 ? "bg-padel-yellow text-black" :
                                    i === 1 ? "bg-gray-400 text-black" :
                                    i === 2 ? "bg-amber-700 text-white" :
                                    "bg-white/5 text-white/50"
                                )}>
                                    {player.rank}
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-padel-blue/10 flex items-center justify-center text-sm font-black text-padel-blue">
                                    {player.avatar}
                                </div>
                                <div className="flex-1">
                                    <p className="text-[11px] font-black text-white uppercase tracking-wider">{player.name}</p>
                                    <p className="text-[9px] text-white/30 font-bold">{player.points} pts</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    {player.change > 0 ? (
                                        <ChevronUp size={14} className="text-green-500" />
                                    ) : player.change < 0 ? (
                                        <ChevronDown size={14} className="text-red-500" />
                                    ) : (
                                        <Minus size={14} className="text-white/30" />
                                    )}
                                    <span className={cn(
                                        "text-[10px] font-bold",
                                        player.change > 0 ? "text-green-500" :
                                        player.change < 0 ? "text-red-500" : "text-white/30"
                                    )}>
                                        {Math.abs(player.change) || "-"}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-white/30 text-sm py-8">Aucun classement disponible</p>
                        )}
                    </div>
                </motion.div>

                {/* Achievements */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-[#151518] border border-white/10 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                            <Award size={20} className="text-purple-500" />
                        </div>
                        <h2 className="text-xs font-black text-white uppercase tracking-[0.3em]">Succès</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { name: "Premier Match", desc: "Jouer un match", unlocked: true, icon: Target },
                            { name: "Triple Victoire", desc: "3 victoires consécutives", unlocked: true, icon: Flame },
                            { name: "Champion", desc: "Gagner un tournoi", unlocked: stats.tournamentsWon > 0, icon: Trophy },
                            { name: "Top 10", desc: "Atteindre le top 10", unlocked: stats.bestRank <= 10, icon: Star },
                            { name: "Vétéran", desc: "50 matchs joués", unlocked: stats.matchesPlayed >= 50, icon: Medal },
                            { name: "Elite", desc: "Niveau Elite", unlocked: stats.level === "ELITE", icon: Crown },
                        ].map((achievement, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "p-4 rounded-xl border transition-all",
                                    achievement.unlocked 
                                        ? "bg-white/[0.03] border-white/10" 
                                        : "bg-white/[0.01] border-white/5 opacity-40"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
                                    achievement.unlocked ? "bg-purple-500/10" : "bg-white/5"
                                )}>
                                    <achievement.icon size={18} className={achievement.unlocked ? "text-purple-500" : "text-white/20"} />
                                </div>
                                <p className="text-[10px] font-black text-white uppercase tracking-wider mb-1">{achievement.name}</p>
                                <p className="text-[9px] text-white/30 font-bold">{achievement.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Recent Performance - Only show if there's history */}
            {matchHistory.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-[#151518] border border-white/10 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                <Calendar size={20} className="text-green-500" />
                            </div>
                            <h2 className="text-xs font-black text-white uppercase tracking-[0.3em]">Historique Récent</h2>
                        </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {matchHistory.map((match, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "flex-shrink-0 p-4 rounded-xl border min-w-[140px]",
                                    match.result === "W" 
                                        ? "bg-green-500/5 border-green-500/20" 
                                        : "bg-red-500/5 border-red-500/20"
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm mb-3",
                                    match.result === "W" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                                )}>
                                    {match.result}
                                </div>
                                <p className="text-[10px] font-black text-white uppercase tracking-wider">{match.opponent}</p>
                                <p className="text-[9px] text-white/50 font-bold mt-1">{match.score}</p>
                                <p className="text-[8px] text-white/30 font-bold mt-2">{match.date}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
