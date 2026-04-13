import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
    Trophy,
    Calendar,
    Zap,
    ShieldCheck,
    CheckCircle2,
    X,
    Loader2,
    ArrowRight,
    Sparkles,
    Trash2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export const UserSubscriptionStatus = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [canceling, setCanceling] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    const fetchData = async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const res = await api.get('/subscriptions/my-subscription');
            setData(res.data.data);
        } catch (error) {
            console.error('Error fetching subscription:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        const handleUpdate = () => fetchData();
        window.addEventListener('subscription-updated', handleUpdate);
        return () => window.removeEventListener('subscription-updated', handleUpdate);
    }, [user]);

    const handleCancel = async () => {
        try {
            setCanceling(true);
            await api.post('/subscriptions/cancel');
            await fetchData();
            setIsCancelModalOpen(false);
        } catch (error) {
            console.error('Error canceling subscription:', error);
        } finally {
            setCanceling(false);
        }
    };

    if (!user || (!loading && !data?.subscription)) return null;

    if (loading) {
        return (
            <div className="py-12 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-padel-blue" />
            </div>
        );
    }

    const { subscription, stats } = data;

    return (
        <section className="relative py-12 px-6">
            <div className="max-w-[1400px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative group bg-gradient-to-br from-[#151518]/80 to-[#0A0A0A]/80 backdrop-blur-3xl border border-padel-blue/20 rounded-[3rem] p-8 md:p-12 lg:p-16 overflow-hidden shadow-3xl"
                >
                    {/* Background Elements */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-padel-blue/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none group-hover:bg-padel-blue/20 transition-all duration-1000" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-padel-yellow/5 rounded-full blur-[80px] -ml-24 -mb-24 pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        {/* Elite Status Visual */}
                        <div className="shrink-0 flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
                            <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-padel-blue to-blue-700 p-[1px] shadow-2xl group-hover:scale-105 transition-transform duration-700">
                                <div className="w-full h-full rounded-[2.5rem] bg-[#0E0E11]/80 backdrop-blur-xl flex items-center justify-center text-padel-blue">
                                    <Trophy size={48} className="drop-shadow-[0_0_15px_rgba(19,73,211,0.5)]" />
                                </div>
                            </div>
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-padel-blue/10 border border-padel-blue/20 text-padel-blue text-[9px] font-black uppercase tracking-[0.3em] mb-3">
                                    <Sparkles size={10} /> Membre Privilège
                                </div>
                                <h3 className="text-4xl md:text-5xl font-display font-black text-white italic uppercase tracking-tighter leading-none mb-2">
                                    {subscription.name}
                                </h3>
                                <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em]">PROPRÉTÉ ACTIVE</p>
                            </div>
                        </div>

                        {/* Interactive Stats Grid */}
                        <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {[
                                { label: 'Prochaine Échéance', value: new Date(new Date().setMonth(new Date().getMonth() + subscription.durationInMonths)).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }), sub: 'Prélèvement Auto', icon: Calendar },
                                { label: 'Heures Jouées', value: stats?.hoursPlayed || 0, sub: 'Ce mois-ci', icon: Zap },
                                { label: 'Économies Réalisées', value: `${stats?.savings || 0}€`, sub: 'Cumul annuel', icon: ShieldCheck },
                                { label: 'Invitations Guest', value: `${stats?.guestInvitations?.used || 0}/${stats?.guestInvitations?.total || 0}`, sub: 'Restantes', icon: CheckCircle2 },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    className="p-5 md:p-6 bg-white/[0.03] border border-white/5 rounded-3xl group/stat hover:border-padel-blue/30 transition-all hover:bg-white/[0.05]"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20 mb-4 group-hover/stat:text-padel-blue transition-colors">
                                        <stat.icon size={18} />
                                    </div>
                                    <p className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-widest mb-1.5">{stat.label}</p>
                                    <p className="text-lg md:text-xl font-black text-white uppercase tracking-tighter">{stat.value}</p>
                                    <p className="text-[8px] font-bold text-white/10 uppercase tracking-widest mt-1.5">{stat.sub}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Actions Matrix */}
                        <div className="shrink-0 flex flex-col gap-4">
                            <button
                                onClick={() => navigate('/settings?tab=billing')}
                                className="flex items-center gap-4 px-8 py-5 rounded-2xl bg-padel-blue text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-padel-blue/30 hover:bg-white hover:text-padel-blue transition-all group/btn"
                            >
                                Gérer Paiements <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => setIsCancelModalOpen(true)}
                                className="flex items-center gap-4 px-8 py-5 rounded-2xl bg-white/5 border border-white/10 text-red-500/50 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                            >
                                Résilier Offre
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {isCancelModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCancelModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-[#0c0c0e] border border-red-500/20 rounded-[2.5rem] shadow-[0_30px_60px_rgba(239,68,68,0.2)] overflow-hidden flex flex-col items-center text-center p-10"
                        >
                            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                                <Trash2 size={32} className="text-red-500" />
                            </div>
                            <h2 className="text-2xl font-display font-black text-white uppercase mb-2 leading-none">RÉSILIATION <br /> <span className="text-red-500">DÉFINITIVE</span></h2>
                            <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-8 leading-relaxed italic">
                                En résiliant votre abonnement {subscription.name}, vous perdrez vos avantages prioritaires dès la fin de la période en cours.
                            </p>

                            <div className="flex gap-4 w-full">
                                <button onClick={() => setIsCancelModalOpen(false)} className="flex-1 px-6 py-4 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all">
                                    ANNULER
                                </button>
                                <button
                                    onClick={handleCancel}
                                    disabled={canceling}
                                    className="flex-1 px-6 py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-red-600 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                                >
                                    {canceling ? <Loader2 size={16} className="animate-spin" /> : <>CONFIRMER <Trash2 size={12} /></>}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};
