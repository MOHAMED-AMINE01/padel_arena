import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    BadgePercent,
    Plus,
    TrendingUp,
    Users,
    Zap,
    MoreHorizontal,
    Edit3,
    Trash2,
    CheckCircle2,
    X,
    Loader2,
    Save,
    Copy,
    Calendar,
    Tag,
    Percent,
    DollarSign,
    Clock,
    ToggleLeft,
    ToggleRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';
import { PremiumSelect } from '../../components/admin/PremiumSelect';
import { PremiumDatePicker } from '../../components/admin/PremiumDatePicker';

interface PromoCode {
    _id: string;
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minPurchaseAmount?: number;
    maxUsageCount?: number;
    currentUsageCount: number;
    validFrom: string;
    validUntil: string;
    isActive: boolean;
    applicableTo: 'all' | 'booking' | 'subscription' | 'course' | 'tournament';
}

interface Stats {
    totalCodes: number;
    activeCodes: number;
    expiredCodes: number;
    totalUsage: number;
    mostUsedCode: { code: string; usageCount: number } | null;
}

export function AdminPromoCodes() {
    const [promoCodes, setPromoCodes] = React.useState<PromoCode[]>([]);
    const [stats, setStats] = React.useState<Stats | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [showModal, setShowModal] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [editingCode, setEditingCode] = React.useState<PromoCode | null>(null);
    const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
    const [deleteModal, setDeleteModal] = React.useState<{ isOpen: boolean; id: string }>({
        isOpen: false,
        id: ''
    });

    const [formData, setFormData] = React.useState({
        code: '',
        description: '',
        discountType: 'percentage' as 'percentage' | 'fixed',
        discountValue: '',
        minPurchaseAmount: '',
        maxUsageCount: '',
        validFrom: '',
        validUntil: '',
        isActive: true,
        applicableTo: 'all' as 'all' | 'booking' | 'subscription' | 'course' | 'tournament'
    });

    const fetchData = async () => {
        try {
            const [codesRes, statsRes] = await Promise.all([
                api.get('/promo-codes'),
                api.get('/promo-codes/stats')
            ]);
            setPromoCodes(codesRes.data.data);
            setStats(statsRes.data.data);
        } catch (err) {
            console.error('Error fetching promo codes:', err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = {
                ...formData,
                discountValue: parseFloat(formData.discountValue),
                minPurchaseAmount: formData.minPurchaseAmount ? parseFloat(formData.minPurchaseAmount) : undefined,
                maxUsageCount: formData.maxUsageCount ? parseInt(formData.maxUsageCount) : undefined
            };

            if (editingCode) {
                await api.put(`/promo-codes/${editingCode._id}`, data);
            } else {
                await api.post('/promo-codes', data);
            }
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (err) {
            console.error('Error saving promo code:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            code: '',
            description: '',
            discountType: 'percentage',
            discountValue: '',
            minPurchaseAmount: '',
            maxUsageCount: '',
            validFrom: '',
            validUntil: '',
            isActive: true,
            applicableTo: 'all'
        });
        setEditingCode(null);
    };

    const handleEdit = (code: PromoCode) => {
        setEditingCode(code);
        setFormData({
            code: code.code,
            description: code.description,
            discountType: code.discountType,
            discountValue: code.discountValue.toString(),
            minPurchaseAmount: code.minPurchaseAmount?.toString() || '',
            maxUsageCount: code.maxUsageCount?.toString() || '',
            validFrom: code.validFrom.split('T')[0],
            validUntil: code.validUntil.split('T')[0],
            isActive: code.isActive,
            applicableTo: code.applicableTo
        });
        setShowModal(true);
    };

    const confirmDelete = async () => {
        setIsSubmitting(true);
        try {
            await api.delete(`/promo-codes/${deleteModal.id}`);
            setDeleteModal({ isOpen: false, id: '' });
            fetchData();
        } catch (err) {
            console.error('Error deleting promo code:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggle = async (id: string) => {
        try {
            await api.patch(`/promo-codes/${id}/toggle`);
            fetchData();
        } catch (err) {
            console.error('Error toggling promo code:', err);
        }
    };

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const getStatusInfo = (code: PromoCode) => {
        const now = new Date();
        const validFrom = new Date(code.validFrom);
        const validUntil = new Date(code.validUntil);

        if (!code.isActive) return { label: 'INACTIF', color: 'red' };
        if (now < validFrom) return { label: 'À VENIR', color: 'yellow' };
        if (now > validUntil) return { label: 'EXPIRÉ', color: 'red' };
        if (code.maxUsageCount && code.currentUsageCount >= code.maxUsageCount) return { label: 'ÉPUISÉ', color: 'orange' };
        return { label: 'ACTIF', color: 'green' };
    };

    const applicableLabels: Record<string, string> = {
        all: 'Tout',
        booking: 'Réservations',
        subscription: 'Abonnements',
        course: 'Cours',
        tournament: 'Tournois'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-10"
        >
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8 border-b border-white/5 pb-8 md:pb-10 pt-6 md:pt-0">
                <div className="space-y-3 md:space-y-4">

                    <div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white uppercase tracking-tighter leading-[0.9] md:leading-[0.85]">
                            Codes  <span className="text-padel-blue drop-shadow-[0_0_30px_rgba(19,73,211,0.3)]">Promo</span>
                        </h1>
                        <p className="text-[10px] md:text-xs font-bold text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em] mt-3 md:mt-4">Gestion des promotions • Fidélisation</p>
                    </div>
                </div>

                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="flex items-center justify-center gap-3 px-6 md:px-10 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] bg-padel-blue text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-padel-yellow hover:text-padel-blue transition-all duration-500"
                >
                    <Plus size={18} className="md:w-5 md:h-5" /> Créer un Code
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {[
                    { label: 'Total Codes', val: stats?.totalCodes?.toString() || '0', icon: Tag, color: 'blue' },
                    { label: 'Codes Actifs', val: stats?.activeCodes?.toString() || '0', icon: CheckCircle2, color: 'green' },
                    { label: 'Utilisations', val: stats?.totalUsage?.toString() || '0', icon: Users, color: 'yellow' },
                    { label: 'Code Populaire', val: stats?.mostUsedCode?.code || '-', icon: TrendingUp, color: 'blue' }
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
                                kpi.color === 'blue' ? "bg-padel-blue/10 border-padel-blue/20 text-padel-blue group-hover:bg-padel-blue group-hover:text-white" :
                                    kpi.color === 'green' ? "bg-green-500/10 border-green-500/20 text-green-500 group-hover:bg-green-500 group-hover:text-white" :
                                        "bg-padel-yellow/10 border-padel-yellow/20 text-padel-yellow group-hover:bg-padel-yellow group-hover:text-padel-blue"
                            )}>
                                <kpi.icon size={18} className="md:w-6 md:h-6" />
                            </div>
                        </div>
                        <p className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.2em] md:tracking-[0.3em] mb-1.5 md:mb-2">{kpi.label}</p>
                        <p className="text-2xl md:text-4xl font-black text-white tracking-tighter group-hover:text-padel-blue transition-colors duration-500 truncate">{kpi.val}</p>
                    </motion.div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-[#151518]/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-3xl">
                <div className="p-6 md:p-10 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/[0.01]">
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] md:tracking-[0.4em] flex items-center gap-3 md:gap-4">
                        <BadgePercent size={16} className="text-padel-yellow md:w-5 md:h-5" /> Codes Promotionnels
                    </h3>
                    <div className="px-3 md:px-4 py-1.5 md:py-2 rounded-xl bg-white/5 border border-white/10 text-[8px] md:text-[10px] font-black text-white/40 uppercase tracking-widest">
                        {promoCodes.length} Code{promoCodes.length > 1 ? 's' : ''}
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full">
                        <thead>
                            <tr className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.2em] md:tracking-[0.3em] text-left border-b border-white/5 whitespace-nowrap">
                                <th className="px-6 md:px-10 py-6 md:py-8">Code</th>
                                <th className="px-4 md:px-8 py-6 md:py-8">Réduction</th>
                                <th className="px-4 md:px-8 py-6 md:py-8 hidden md:table-cell">Applicable</th>
                                <th className="px-4 md:px-8 py-6 md:py-8">Utilisations</th>
                                <th className="px-4 md:px-8 py-6 md:py-8 hidden lg:table-cell">Validité</th>
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
                            ) : promoCodes.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-20 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">Aucun code promo configuré</td>
                                </tr>
                            ) : (
                                promoCodes.map((code, idx) => {
                                    const status = getStatusInfo(code);
                                    return (
                                        <motion.tr
                                            key={code._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.05 * idx }}
                                            className="hover:bg-white/[0.03] transition-all group"
                                        >
                                            <td className="px-6 md:px-10 py-6 md:py-8">
                                                <div className="flex items-center gap-3 md:gap-4">
                                                    <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-lg md:rounded-xl bg-padel-blue/10 flex items-center justify-center border border-padel-blue/20 text-padel-blue">
                                                        <BadgePercent size={18} className="md:w-5 md:h-5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm md:text-lg font-black uppercase tracking-tighter text-white">{code.code}</p>
                                                            <button
                                                                onClick={() => copyToClipboard(code.code)}
                                                                className="text-white/20 hover:text-padel-blue transition-colors"
                                                            >
                                                                {copiedCode === code.code ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                                                            </button>
                                                        </div>
                                                        <p className="text-[8px] md:text-[10px] text-white/20 font-medium truncate max-w-[150px]">{code.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-8 py-6 md:py-8">
                                                <p className="text-sm md:text-xl font-black text-padel-yellow tracking-tighter">
                                                    {code.discountType === 'percentage' ? `${code.discountValue}%` : `${code.discountValue}€`}
                                                </p>
                                            </td>
                                            <td className="px-4 md:px-8 py-6 md:py-8 hidden md:table-cell">
                                                <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[8px] font-black text-white/40 uppercase tracking-widest">
                                                    {applicableLabels[code.applicableTo]}
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-8 py-6 md:py-8">
                                                <div className="flex items-center gap-2 md:gap-3">
                                                    <Users size={14} className="text-white/20 md:w-4 md:h-4" />
                                                    <p className="text-sm md:text-lg font-black text-white tracking-tighter">
                                                        {code.currentUsageCount}{code.maxUsageCount ? `/${code.maxUsageCount}` : ''}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-8 py-6 md:py-8 hidden lg:table-cell">
                                                <div className="text-[10px] text-white/30 font-medium">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        {new Date(code.validFrom).toLocaleDateString('fr-FR')}
                                                    </div>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <Clock size={12} />
                                                        {new Date(code.validUntil).toLocaleDateString('fr-FR')}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-8 py-6 md:py-8 hidden sm:table-cell">
                                                <div className={cn(
                                                    "inline-flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full border text-[7px] md:text-[8px] font-black uppercase tracking-widest",
                                                    status.color === 'green' && "bg-green-500/10 border-green-500/20 text-green-500",
                                                    status.color === 'red' && "bg-red-500/10 border-red-500/20 text-red-500",
                                                    status.color === 'yellow' && "bg-yellow-500/10 border-yellow-500/20 text-yellow-500",
                                                    status.color === 'orange' && "bg-orange-500/10 border-orange-500/20 text-orange-500"
                                                )}>
                                                    <div className={cn(
                                                        "w-1 md:w-1.5 h-1 md:h-1.5 rounded-full",
                                                        status.color === 'green' && "bg-green-500",
                                                        status.color === 'red' && "bg-red-500",
                                                        status.color === 'yellow' && "bg-yellow-500",
                                                        status.color === 'orange' && "bg-orange-500"
                                                    )} />
                                                    {status.label}
                                                </div>
                                            </td>
                                            <td className="px-6 md:px-10 py-6 md:py-8 text-right">
                                                <div className="flex items-center justify-end gap-2 md:gap-3">
                                                    <button
                                                        onClick={() => handleToggle(code._id)}
                                                        className={cn(
                                                            "w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 border border-white/10 transition-all flex items-center justify-center",
                                                            code.isActive ? "text-green-500 hover:border-green-500" : "text-white/40 hover:border-padel-blue"
                                                        )}
                                                    >
                                                        {code.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                                                    </button>
                                                    <button onClick={() => handleEdit(code)} className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-padel-blue hover:border-padel-blue transition-all flex items-center justify-center">
                                                        <Edit3 size={14} className="md:w-[18px] md:h-[18px]" />
                                                    </button>
                                                    <button onClick={() => setDeleteModal({ isOpen: true, id: code._id })} className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-red-500 hover:border-red-500 transition-all flex items-center justify-center">
                                                        <Trash2 size={14} className="md:w-[18px] md:h-[18px]" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-2xl bg-[#151518] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                                        {editingCode ? 'Modifier le Code' : 'Nouveau Code Promo'}
                                    </h2>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Configuration de la promotion</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white flex items-center justify-center">
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Code *</label>
                                        <input
                                            type="text"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                            placeholder="EX: SUMMER25"
                                            className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-padel-blue outline-none text-sm font-bold uppercase tracking-wider"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Applicable à</label>
                                        <PremiumSelect
                                            value={formData.applicableTo}
                                            onChange={(value) => setFormData({ ...formData, applicableTo: value as any })}
                                            options={[
                                                { value: 'all', label: 'Tout' },
                                                { value: 'booking', label: 'Réservations' },
                                                { value: 'subscription', label: 'Abonnements' },
                                                { value: 'course', label: 'Cours' },
                                                { value: 'tournament', label: 'Tournois' }
                                            ]}
                                            icon={Tag}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Description *</label>
                                    <input
                                        type="text"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Description de la promotion..."
                                        className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-padel-blue outline-none text-sm"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Type de réduction</label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, discountType: 'percentage' })}
                                                className={cn(
                                                    "flex-1 px-4 py-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all",
                                                    formData.discountType === 'percentage'
                                                        ? "bg-padel-blue border-padel-blue text-white"
                                                        : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                                                )}
                                            >
                                                <Percent size={16} /> %
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, discountType: 'fixed' })}
                                                className={cn(
                                                    "flex-1 px-4 py-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all",
                                                    formData.discountType === 'fixed'
                                                        ? "bg-padel-blue border-padel-blue text-white"
                                                        : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                                                )}
                                            >
                                                <DollarSign size={16} /> €
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">
                                            Valeur {formData.discountType === 'percentage' ? '(%)' : '(€)'} *
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.discountValue}
                                            onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                            placeholder={formData.discountType === 'percentage' ? '25' : '10'}
                                            min="0"
                                            max={formData.discountType === 'percentage' ? '100' : undefined}
                                            className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-padel-blue outline-none text-sm font-bold"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Montant minimum (€)</label>
                                        <input
                                            type="number"
                                            value={formData.minPurchaseAmount}
                                            onChange={(e) => setFormData({ ...formData, minPurchaseAmount: e.target.value })}
                                            placeholder="0"
                                            min="0"
                                            className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-padel-blue outline-none text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Utilisations max</label>
                                        <input
                                            type="number"
                                            value={formData.maxUsageCount}
                                            onChange={(e) => setFormData({ ...formData, maxUsageCount: e.target.value })}
                                            placeholder="Illimité"
                                            min="1"
                                            className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-padel-blue outline-none text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Valide à partir du *</label>
                                        <PremiumDatePicker
                                            value={formData.validFrom}
                                            onChange={(value) => setFormData({ ...formData, validFrom: value })}
                                            placeholder="Définir date de début"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Valide jusqu'au *</label>
                                        <PremiumDatePicker
                                            value={formData.validUntil}
                                            onChange={(value) => setFormData({ ...formData, validUntil: value })}
                                            placeholder="Définir date de fin"
                                            align="right"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                        className={cn(
                                            "w-12 h-7 rounded-full transition-all relative",
                                            formData.isActive ? "bg-green-500" : "bg-white/10"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute top-1 w-5 h-5 rounded-full bg-white transition-all",
                                            formData.isActive ? "left-6" : "left-1"
                                        )} />
                                    </button>
                                    <span className="text-sm font-bold text-white/60">
                                        {formData.isActive ? 'Code actif' : 'Code inactif'}
                                    </span>
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white/60 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-6 py-4 rounded-xl bg-padel-blue text-white font-black text-[10px] uppercase tracking-widest hover:bg-padel-yellow hover:text-padel-blue transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                        {editingCode ? 'Mettre à jour' : 'Créer le code'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Modal */}
            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: '' })}
                onConfirm={confirmDelete}
                title="Supprimer ce code promo ?"
                message="Cette action est irréversible. Le code ne pourra plus être utilisé."
                isLoading={isSubmitting}
            />
        </motion.div>
    );
}
