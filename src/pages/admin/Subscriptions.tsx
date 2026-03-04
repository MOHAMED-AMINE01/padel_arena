import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Ticket,
    Plus,
    TrendingUp,
    Users,
    Crown,
    Zap,
    ShieldCheck,
    MoreHorizontal,
    Edit3,
    Trash2,
    CheckCircle2,
    X,
    Loader2,
    Save,
    Calculator,
    ShieldAlert
} from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';

export function AdminSubscriptions() {
    const [plans, setPlans] = React.useState<any[]>([]);
    const [stats, setStats] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [showModal, setShowModal] = React.useState(false);
    const [isDurationOpen, setIsDurationOpen] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [editingPlan, setEditingPlan] = React.useState<any>(null);
    const [deleteModal, setDeleteModal] = React.useState<{ isOpen: boolean, id: string }>({
        isOpen: false,
        id: ''
    });

    const [formData, setFormData] = React.useState({
        name: '',
        price: '',
        durationInMonths: '1',
        features: '',
        isActive: true
    });

    const fetchPlans = async () => {
        try {
            const [plansRes, statsRes] = await Promise.all([
                api.get('/admin/subscriptions'),
                api.get('/admin/subscriptions/stats')
            ]);
            setPlans(plansRes.data.data);
            setStats(statsRes.data.data);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchPlans();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = {
                ...formData,
                price: parseFloat(formData.price),
                durationInMonths: parseInt(formData.durationInMonths),
                features: formData.features.split(',').map(f => f.trim()).filter(f => f !== '')
            };

            if (editingPlan) {
                await api.put(`/admin/subscriptions/${editingPlan._id}`, data);
            } else {
                await api.post('/admin/subscriptions', data);
            }
            setShowModal(false);
            resetForm();
            fetchPlans();
        } catch (err) {
            console.error('Error saving plan:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            durationInMonths: '1',
            features: '',
            isActive: true
        });
        setEditingPlan(null);
    };

    const handleEdit = (plan: any) => {
        setEditingPlan(plan);
        setFormData({
            name: plan.name,
            price: plan.price.toString(),
            durationInMonths: plan.durationInMonths.toString(),
            features: plan.features.join(', '),
            isActive: plan.isActive
        });
        setShowModal(true);
    };

    const confirmDelete = async () => {
        setIsSubmitting(true);
        try {
            await api.delete(`/admin/subscriptions/${deleteModal.id}`);
            setDeleteModal({ isOpen: false, id: '' });
            fetchPlans();
        } catch (err) {
            console.error('Error deleting plan:', err);
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleExport = async () => {
        try {
            const response = await api.get('/admin/subscriptions/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'audit_abonnements.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Error exporting audit:', err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-10"
        >
            {/* Elite Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8 border-b border-white/5 pb-8 md:pb-10 pt-6 md:pt-0">
                <div className="space-y-3 md:space-y-4">

                    <div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white uppercase tracking-tighter leading-[0.9] md:leading-[0.85]">
                            Gestion <br /> <span className="text-padel-blue drop-shadow-[0_0_30px_rgba(19,73,211,0.3)]">Abonnements</span>
                        </h1>
                        <p className="text-[10px] md:text-xs font-bold text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em] mt-3 md:mt-4">Stratégie Offres • Rétention Athlètes</p>
                    </div>
                </div>

                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="flex items-center justify-center gap-3 px-6 md:px-10 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] bg-padel-blue text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-padel-yellow hover:text-padel-blue transition-all duration-500"
                >
                    <Plus size={18} className="md:w-5 md:h-5" /> Créer un Plan
                </button>
            </div>

            {/* Strategic KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {[
                    { label: 'Abonnés Totaux', val: stats?.totalSubscribers?.toLocaleString() || '0', change: `+${stats?.newSubscribersThisMonth || 0}`, icon: Users, color: 'blue' },
                    { label: 'MRR Global', val: `${stats?.mrr?.toLocaleString() || '0'} €`, change: `+${stats?.mrrGrowth || 0}%`, icon: TrendingUp, color: 'yellow' },
                    { label: 'Taux Churn', val: `${stats?.churnRate || '0'}%`, change: `-${stats?.churnRate || 0}%`, icon: Zap, color: 'blue' }
                ].map((kpi, i) => (
                    <motion.div
                        key={kpi.label}
                        whileHover={{ y: -5 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="bg-[#151518]/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] relative overflow-hidden group shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-padel-blue/10 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center justify-between mb-6 md:mb-8">
                            <div className={cn(
                                "w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center border transition-all duration-500",
                                kpi.color === 'blue' ? "bg-padel-blue/10 border-padel-blue/20 text-padel-blue group-hover:bg-padel-blue group-hover:text-white" : "bg-padel-yellow/10 border-padel-yellow/20 text-padel-yellow group-hover:bg-padel-yellow group-hover:text-padel-blue"
                            )}>
                                <kpi.icon size={18} className="md:w-6 md:h-6" />
                            </div>
                            <span className="text-[8px] md:text-[10px] font-black text-green-500 bg-green-500/10 px-2 md:px-3 py-1 rounded-full border border-green-500/10 truncate max-w-[100px]">{kpi.change}</span>
                        </div>
                        <p className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.2em] md:tracking-[0.3em] mb-1.5 md:mb-2">{kpi.label}</p>
                        <p className="text-2xl md:text-4xl font-black text-white tracking-tighter group-hover:text-padel-blue transition-colors duration-500">{kpi.val}</p>
                    </motion.div>
                ))}
            </div>

            {/* Offers Matrix */}
            <div className="bg-[#151518]/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-3xl">
                <div className="p-6 md:p-10 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/[0.01]">
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] md:tracking-[0.4em] flex items-center gap-3 md:gap-4">
                        <Crown size={16} className="text-padel-yellow md:w-5 md:h-5" /> Formules
                    </h3>
                    <div className="px-3 md:px-4 py-1.5 md:py-2 rounded-xl bg-white/5 border border-white/10 text-[8px] md:text-[10px] font-black text-white/40 uppercase tracking-widest">
                        {plans.length} {plans.length > 1 ? 'Actifs' : 'Actif'}
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full">
                        <thead>
                            <tr className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.2em] md:tracking-[0.3em] text-left border-b border-white/5 whitespace-nowrap">
                                <th className="px-6 md:px-10 py-6 md:py-8">Formule</th>
                                <th className="px-4 md:px-8 py-6 md:py-8">Tarif</th>
                                <th className="px-4 md:px-8 py-6 md:py-8 hidden md:table-cell">Engagement</th>
                                <th className="px-4 md:px-8 py-6 md:py-8">Athlètes</th>
                                <th className="px-4 md:px-8 py-6 md:py-8 hidden lg:table-cell">Revenu</th>
                                <th className="px-4 md:px-8 py-6 md:py-8 hidden sm:table-cell">Statut</th>
                                <th className="px-6 md:px-10 py-6 md:py-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="py-16 md:py-20 text-center">
                                        <Loader2 className="animate-spin text-padel-blue mx-auto mb-4" size={32} />
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Chargement...</p>
                                    </td>
                                </tr>
                            ) : plans.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-20 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">Aucun plan configuré</td>
                                </tr>
                            ) : (
                                plans.map((plan, idx) => (
                                    <motion.tr
                                        key={plan._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * idx }}
                                        className="hover:bg-white/[0.03] transition-all group"
                                    >
                                        <td className="px-6 md:px-10 py-6 md:py-8">
                                            <div className="flex items-center gap-3 md:gap-6">
                                                <div className={cn(
                                                    "w-8 h-8 md:w-12 md:h-12 shrink-0 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center border border-white/10",
                                                    plan.price >= 80 ? "text-padel-yellow" : plan.price >= 50 ? "text-padel-blue" : "text-white/40"
                                                )}>
                                                    <Crown size={14} className="md:w-5 md:h-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm md:text-lg font-black uppercase tracking-tighter text-white truncate">{plan.name}</p>
                                                    <p className="text-[8px] md:text-[10px] text-white/20 font-black uppercase tracking-[0.1em] md:tracking-[0.2em] truncate max-w-[150px]">{plan.features.join(' • ') || 'Standard'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-8 py-6 md:py-8">
                                            <p className="text-sm md:text-xl font-black text-white tracking-tighter">{plan.price}€</p>
                                        </td>
                                        <td className="px-4 md:px-8 py-6 md:py-8 hidden md:table-cell">
                                            <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[8px] font-black text-white/40 uppercase tracking-widest">
                                                {plan.durationInMonths} Mois
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-8 py-6 md:py-8">
                                            <div className="flex items-center gap-2 md:gap-3">
                                                <Users size={14} className="text-white/20 md:w-4 md:h-4" />
                                                <p className="text-sm md:text-lg font-black text-white tracking-tighter">{plan.subscriberCount || 0}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-8 py-6 md:py-8 hidden lg:table-cell">
                                            <p className="text-sm md:text-base font-black text-green-500">
                                                {(plan.revenue || 0).toLocaleString()} €
                                            </p>
                                        </td>
                                        <td className="px-4 md:px-8 py-6 md:py-8 hidden sm:table-cell">
                                            <div className={cn(
                                                "inline-flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full border text-[7px] md:text-[8px] font-black uppercase tracking-widest",
                                                plan.isActive ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-red-500/10 border-red-500/20 text-red-500"
                                            )}>
                                                <div className={cn("w-1 md:w-1.5 h-1 md:h-1.5 rounded-full", plan.isActive ? "bg-green-500" : "bg-red-500")} />
                                                {plan.isActive ? 'ACTIF' : 'OFF'}
                                            </div>
                                        </td>
                                        <td className="px-6 md:px-10 py-6 md:py-8 text-right">
                                            <div className="flex items-center justify-end gap-2 md:gap-3">
                                                <button onClick={() => handleEdit(plan)} className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-padel-blue hover:border-padel-blue transition-all flex items-center justify-center"><Edit3 size={14} className="md:w-[18px] md:h-[18px]" /></button>
                                                <button onClick={() => setDeleteModal({ isOpen: true, id: plan._id })} className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-red-500 hover:border-red-500 transition-all flex items-center justify-center"><Trash2 size={14} className="md:w-[18px] md:h-[18px]" /></button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Strategic Box */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-[#151518]/40 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-2xl md:rounded-[3rem] relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter mb-4 md:mb-6 flex items-center gap-3 md:gap-4">
                            <ShieldCheck className="text-padel-blue md:w-6 md:h-6" size={20} /> Audit
                        </h3>
                        <p className="text-xs md:text-sm text-white/40 font-medium leading-relaxed mb-6 md:mb-8">
                            Contrats synchronisés Stripe. Renouvellements automatiques actifs.
                        </p>
                        <button
                            onClick={handleExport}
                            className="text-[9px] md:text-[10px] font-black text-padel-blue uppercase tracking-[0.2em] md:tracking-[0.3em] hover:text-white transition-colors flex items-center gap-2 group/btn"
                        >
                            Audit complet <TrendingUp size={12} className="group-hover:translate-x-1 transition-transform md:w-[14px] md:h-[14px]" />
                        </button>
                    </div>
                </div>

                <div className="bg-padel-blue p-8 md:p-10 rounded-2xl md:rounded-[3rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                    <div className="relative z-10">
                        <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter mb-4">Objectif MRR</h3>
                        <p className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-6 md:mb-8">
                            {stats?.mrr > 0 ? `+${Math.round((stats.mrr / 75000) * 100)}%` : '0%'}
                        </p>
                        <div className="flex gap-4">
                            <div className="h-1 bg-white/20 flex-1 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (stats?.mrr || 0) / 75000 * 100)}%` }}
                                    transition={{ duration: 2 }}
                                    className="h-full bg-padel-yellow"
                                />
                            </div>
                        </div>
                        <p className="text-[8px] md:text-[10px] font-black text-white/60 uppercase tracking-[0.2em] md:tracking-[0.3em] mt-3 md:mt-4">
                            Q1 : 75k€ • Actuel : {stats?.mrr?.toLocaleString() || 0}€
                        </p>
                    </div>
                </div>
            </div>
            {/* Modal de Configuration Plan */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-dark-bg/90 backdrop-blur-2xl" />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-[#1a1a1e] border border-white/10 w-full max-w-lg rounded-2xl md:rounded-[3rem] p-6 md:p-8 relative z-10 shadow-3xl">
                            <button onClick={() => setShowModal(false)} className="absolute top-4 md:top-8 right-4 md:right-8 text-white/20 hover:text-white transition-colors"><X size={20} className="md:w-6 md:h-6" /></button>
                            <h2 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-tighter mb-6 md:mb-8">{editingPlan ? 'Modifier' : 'Nouveau'} <span className="text-padel-yellow">Plan</span></h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Nom du Tier</label>
                                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="ex: VIP GOLD" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white text-sm font-bold focus:outline-none focus:border-padel-blue transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <Calculator size={12} className="text-padel-blue" /> Prix du Plan (€)
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="number"
                                                required
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                placeholder="0.00"
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white text-sm font-bold focus:outline-none focus:border-padel-blue focus:bg-white/[0.05] transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/20 group-focus-within:text-padel-blue transition-colors">EUR</div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <Plus size={12} className="text-padel-yellow" /> Engagement
                                        </label>
                                        <div className="relative group">
                                            <button
                                                type="button"
                                                onClick={() => setIsDurationOpen(!isDurationOpen)}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white text-xs font-bold focus:outline-none focus:border-padel-yellow focus:bg-white/[0.05] transition-all flex items-center justify-between"
                                            >
                                                {formData.durationInMonths} Mois
                                                <MoreHorizontal size={14} className={cn("transition-transform duration-500", isDurationOpen ? "rotate-90 text-padel-yellow" : "text-white/20")} />
                                            </button>

                                            <AnimatePresence>
                                                {isDurationOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        className="absolute top-full left-0 w-full mt-2 bg-[#1a1a1e] border border-white/10 rounded-2xl overflow-hidden z-[110] shadow-3xl backdrop-blur-3xl"
                                                    >
                                                        {[1, 3, 6, 12].map(m => (
                                                            <button
                                                                key={m}
                                                                type="button"
                                                                onClick={() => {
                                                                    setFormData({ ...formData, durationInMonths: m.toString() });
                                                                    setIsDurationOpen(false);
                                                                }}
                                                                className={cn(
                                                                    "w-full px-6 py-4 text-left text-xs font-bold transition-all hover:bg-white/[0.05] flex items-center justify-between group/opt",
                                                                    formData.durationInMonths === m.toString() ? "text-padel-yellow bg-padel-yellow/5" : "text-white/40"
                                                                )}
                                                            >
                                                                {m} Mois
                                                                {formData.durationInMonths === m.toString() && <CheckCircle2 size={14} className="text-padel-yellow" />}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Avantages (séparés par une virgule)</label>
                                    <textarea rows={3} value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} placeholder="ex: Accès 24/7, -10% shop, Invitations VIP..." className="w-full bg-white/[0.03] border border-white/10 rounded-3xl px-6 py-4 text-white text-xs font-bold focus:outline-none focus:border-padel-blue transition-all resize-none" />
                                </div>
                                <button disabled={isSubmitting} className="w-full py-5 bg-padel-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-padel-blue/20 hover:bg-padel-yellow hover:text-padel-blue transition-all duration-700 flex items-center justify-center gap-3">
                                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                                    {editingPlan ? 'Mettre à jour Titan' : 'Initialiser l\'Offre'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: '' })}
                onConfirm={confirmDelete}
                title="Supprimer le Plan"
                message="Attention : cette action est critique. Le plan d'abonnement ne sera plus disponible pour les nouveaux athlètes."
                isLoading={isSubmitting}
            />
        </motion.div>
    );
}
