import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Plus, Edit2, Trash2, X, CheckCircle2, AlertCircle,
    Star, MoveUp, MoveDown, ListPlus, Minus, Target,
    Trophy, Heart, Users, Building2, Zap, Sparkles,
    Receipt, Wallet, Type, Palette, Coins, Info, TrendingUp, Search, Calendar, ImageIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';
import { CustomSelect } from '../../components/admin/CustomSelect';

interface IPricing {
    _id: string;
    title: string;
    type: string;
    description?: string;
    offPeak?: number;
    peak?: number;
    weekend?: number;
    price?: string;
    annualPrice?: string;
    durationInMonths?: number;
    features?: string[];
    featured: boolean;
    color?: string;
    accent?: string;
    icon?: string;
    isActive: boolean;
    order: number;
}

const TYPE_OPTIONS = [
    { label: 'Terrain (Prix Dynamique)', value: 'court' },
    { label: 'Abonnement Mensuel', value: 'subscription' },
    { label: 'Pack / Formule', value: 'pack' },
];

const ICON_OPTIONS = [
    { label: 'Cible', value: 'Target', icon: Target },
    { label: 'Trophée', value: 'Trophy', icon: Trophy },
    { label: 'Coeur', value: 'Heart', icon: Heart },
    { label: 'Utilisateurs', value: 'Users', icon: Users },
    { label: 'Business', value: 'Building2', icon: Building2 },
    { label: 'Éclair', value: 'Zap', icon: Zap },
    { label: 'Étoile', value: 'Star', icon: Star },
];

export function AdminPlans() {
    const [items, setItems] = useState<IPricing[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<IPricing | null>(null);
    const [editingItem, setEditingItem] = useState<IPricing | null>(null);
    const [formData, setFormData] = useState({
        title: '', type: 'court', description: '', offPeak: 0, peak: 0, weekend: 0, price: '', annualPrice: '', durationInMonths: 1, features: '', featured: false, color: '', accent: '', icon: 'Target', isActive: true, order: 0
    });
    const [alert, setAlert] = useState<{ show: boolean; title: string; message: string; type: 'success' | 'error' }>({ show: false, title: '', message: '', type: 'success' });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setItemsPerPage(8); // lg: 4 cols * 2 rows
            else if (window.innerWidth >= 768) setItemsPerPage(6); // md: 3 cols * 2 rows
            else setItemsPerPage(8); // mobile: 2 cols * 4 rows
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const [pricingRes, statsRes] = await Promise.all([
                api.get('/pricing/all'),
                api.get('/admin/subscriptions/stats')
            ]);
            setItems(pricingRes.data.data);
            setStats(statsRes.data.data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => { fetchItems(); }, []);

    const handleOpenModal = (item?: IPricing) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title,
                type: item.type,
                description: item.description || '',
                offPeak: item.offPeak || 0,
                peak: item.peak || 0,
                weekend: item.weekend || 0,
                price: item.price || '',
                annualPrice: item.annualPrice || '',
                durationInMonths: item.durationInMonths || 1,
                features: item.features?.join(', ') || '',
                featured: item.featured,
                color: item.color || '',
                accent: item.accent || '',
                icon: item.icon || 'Target',
                isActive: item.isActive,
                order: item.order
            });
        } else {
            setEditingItem(null);
            setFormData({
                title: '',
                type: 'court',
                description: '',
                offPeak: 0,
                peak: 0,
                weekend: 0,
                price: '',
                annualPrice: '',
                durationInMonths: 1,
                features: '',
                featured: false,
                color: '',
                accent: '',
                icon: 'Target',
                isActive: true,
                order: items.length > 0 ? Math.max(...items.map(i => i.order)) + 1 : 0
            });
        }
        setIsModalOpen(true);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                features: formData.features.split(',').map(f => f.trim()).filter(f => f !== '')
            };

            if (editingItem) {
                await api.put(`/pricing/${editingItem._id}`, data);
                setAlert({ show: true, title: 'SUCCÈS', message: 'Tarif mis à jour', type: 'success' });
            } else {
                await api.post('/pricing', data);
                setAlert({ show: true, title: 'SUCCÈS', message: 'Tarif créé', type: 'success' });
            }
            setIsModalOpen(false); fetchItems();
        } catch (err) {
            setAlert({ show: true, title: 'ERREUR', message: 'Échec de l\'opération', type: 'error' });
        }
    };

    const handleDelete = (item: IPricing) => {
        setItemToDelete(item);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await api.delete(`/pricing/${itemToDelete._id}`);
            setItems(prev => prev.filter(i => i._id !== itemToDelete._id));
            setAlert({ show: true, title: 'SUPPRIMÉ', message: 'Tarif supprimé', type: 'success' });
        } catch (err) {
            setAlert({ show: true, title: 'ERREUR', message: 'Échec de la suppression', type: 'error' });
        } finally {
            setItemToDelete(null);
        }
    };

    const updateOrder = async (id: string, newOrder: number) => {
        try { await api.put(`/pricing/${id}`, { order: newOrder }); fetchItems(); } catch (err) { console.error(err); }
    };

    return (
        <div className="space-y-12 pb-20 text-white">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-7xl font-display font-black uppercase tracking-tighter leading-[0.85]">
                        Tarifs
                    </h1>
                    <p className="text-[10px] md:text-xs font-bold text-white/30 uppercase tracking-[0.3em] mt-4">Optimisation Yield Management • Abonnements</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative group w-full sm:w-64">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-padel-blue transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="RECHERCHER..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black uppercase tracking-widest text-white focus:border-padel-blue outline-none transition-all"
                        />
                    </div>
                    <button onClick={() => handleOpenModal()} className="relative overflow-hidden group flex flex-1 sm:flex-none items-center justify-center gap-3 px-10 py-5 bg-padel-blue text-white rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-widest shadow-2xl hover:bg-padel-yellow hover:text-padel-blue transition-all active:scale-95">
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                        <Plus size={18} className="relative z-10 group-hover:rotate-90 transition-transform duration-500" />
                        <span className="relative z-10">NOUVELLE OFFRE</span>
                    </button>
                </div>
            </div>

            {/* Strategic KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 pb-10 border-b border-white/5 mt-8">
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

            <div className="space-y-12">
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: itemsPerPage }).map((_, i) => (
                            <div key={i} className="aspect-[4/5] bg-white/[0.02] border border-white/5 animate-pulse rounded-[2.5rem]" />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-32 bg-white/[0.01] border border-dashed border-white/5 rounded-[3rem]">
                        <Receipt size={48} className="mx-auto text-white/5 mb-6" />
                        <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">Aucun tarif configuré</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {items
                            .filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase()))
                            .sort((a, b) => a.order - b.order)
                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                            .map((item, index) => {
                                const Icon = ICON_OPTIONS.find(o => o.value === item.icon)?.icon || Target;
                                return (
                                    <motion.div
                                        key={item._id}
                                        layout
                                        className="relative group bg-[#151518]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-6 flex flex-col hover:border-padel-blue/20 transition-all duration-500 overflow-hidden"
                                    >
                                        {/* Actions Overlay */}
                                        <div className="absolute top-4 right-4 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleOpenModal(item)} className="p-2 bg-padel-blue text-white rounded-lg hover:bg-padel-yellow hover:text-padel-blue transition-all active:scale-90">
                                                <Edit2 size={12} />
                                            </button>
                                            <button onClick={() => handleDelete(item)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all active:scale-90">
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
        
                                        {/* Order Controls */}
                                        <div className="absolute top-4 left-4 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button disabled={index === 0} onClick={() => updateOrder(item._id, item.order - 1.5)} className="p-2 bg-white/5 text-white/20 hover:text-padel-blue transition-colors outline-none"><MoveUp size={10} /></button>
                                            <button disabled={index === items.length - 1} onClick={() => updateOrder(item._id, item.order + 1.5)} className="p-2 bg-white/5 text-white/20 hover:text-padel-blue transition-colors outline-none"><MoveDown size={10} /></button>
                                        </div>
        
                                        {/* Stylized Icon Header Instead of Image */}
                                        <div className="aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-white/[0.03] mb-6 relative group/img shrink-0 border border-white/5 flex items-center justify-center group-hover:bg-padel-blue/5 transition-colors duration-700">
                                            <div className="absolute inset-0 bg-gradient-to-br from-padel-blue/5 to-transparent group-hover:from-padel-blue/10 transition-colors" />
                                            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-[#0c0c0e] border border-white/5 flex items-center justify-center text-padel-blue group-hover:scale-110 group-hover:border-padel-blue/20 transition-all duration-700 shadow-2xl shadow-black">
                                                <Icon size={32} className="md:w-10 md:h-10" />
                                            </div>
                                        </div>
        
                                        <div className="flex-1 space-y-4">
                                            <div className="flex flex-wrap gap-2">
                                                <span className={cn(
                                                    "px-2.5 py-1 rounded-full text-[8px] font-black tracking-widest uppercase border",
                                                    item.type === 'court' ? "bg-padel-blue/10 border-padel-blue/20 text-padel-blue" :
                                                    item.type === 'subscription' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                                                    item.type === 'pack' ? "bg-purple-500/10 border-purple-500/20 text-purple-500" :
                                                    "bg-padel-yellow/10 border-padel-yellow/20 text-padel-yellow"
                                                )}>
                                                    {item.type}
                                                </span>
                                                {item.featured && <Star size={14} className="text-padel-yellow fill-padel-yellow" />}
                                                {!item.isActive && <span className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full text-[8px] font-black uppercase tracking-widest">MASQUÉ</span>}
                                            </div>
        
                                            <div>
                                                <h3 className="text-sm md:text-base font-display font-black uppercase tracking-tighter leading-tight group-hover:text-padel-blue transition-colors duration-500">
                                                    {item.title}
                                                </h3>
                                                <div className="mt-2 text-xl md:text-2xl font-display font-black text-white">
                                                    {item.type === 'court' ? (
                                                        <span className="flex items-center gap-2">
                                                            {item.offPeak}€ <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Creuse</span>
                                                            <span className="text-padel-blue">/</span>
                                                            <span className="text-padel-blue">{item.peak}€</span> <span className="text-[8px] font-black text-padel-blue/40 uppercase tracking-widest">Pleine</span>
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-end gap-1">
                                                            {item.price}€
                                                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest pb-1">
                                                                {item.type === 'subscription' ? '/ MOIS' : 'UNITAIRE'}
                                                            </span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-white/40 line-clamp-2 leading-relaxed">{item.description}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                    </div>
                )}

                {/* Pagination Bar */}
                {items.filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase())).length > itemsPerPage && !loading && (
                    <div className="flex items-center justify-center gap-4">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="p-4 bg-white/5 rounded-2xl text-white/20 hover:text-padel-blue hover:bg-white/10 disabled:opacity-30 transition-all active:scale-95"
                        >
                            <MoveUp size={20} className="-rotate-90" />
                        </button>
                        
                        <div className="flex gap-2">
                            {[...Array(Math.ceil(items.filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase())).length / itemsPerPage))].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={cn(
                                        "w-10 h-10 rounded-xl text-[10px] font-black transition-all",
                                        currentPage === i + 1 
                                            ? "bg-padel-blue text-white shadow-xl shadow-padel-blue/20 scale-110" 
                                            : "bg-white/5 text-white/20 hover:bg-white/10 hover:text-white"
                                    )}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={currentPage === Math.ceil(items.filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase())).length / itemsPerPage)}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="p-4 bg-white/5 rounded-2xl text-white/20 hover:text-padel-blue hover:bg-white/10 disabled:opacity-30 transition-all active:scale-95"
                        >
                            <MoveUp size={20} className="rotate-90" />
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[160] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            className="relative w-full max-w-4xl bg-[#0c0c0e] border border-white/10 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <div>
                                    <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter">{editingItem ? 'MISE À JOUR' : 'NOUVELLE OFFRE'}</h2>
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-2">Détails de l'offre commerciale • Yield</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-4 bg-white/5 rounded-2xl text-white/20 hover:text-white transition-colors border border-white/10"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-12 pb-32 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1 flex items-center gap-2"><Type size={10} className="text-padel-blue" /> Titre de l'offre</label>
                                        <input
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 text-sm font-bold text-white focus:border-padel-blue outline-none transition-all uppercase placeholder:opacity-10"
                                            placeholder="NOM DU TARIF..."
                                        />
                                    </div>
                                    <CustomSelect
                                        label="Type de l'offre"
                                        options={TYPE_OPTIONS}
                                        value={formData.type}
                                        onChange={(val) => setFormData({ ...formData, type: val })}
                                    />
                                </div>

                                {formData.type === 'court' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] shadow-2xl">
                                        <div className="space-y-4">
                                            <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1 flex items-center gap-2"><Sparkles size={10} className="text-white/20" /> Heure Creuse</label>
                                            <div className="relative">
                                                <input type="number" value={formData.offPeak} onChange={(e) => setFormData({ ...formData, offPeak: +e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 text-xl font-black text-white focus:border-padel-blue outline-none transition-all" />
                                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 font-black">€</span>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1 flex items-center gap-2"><Zap size={10} className="text-padel-blue" /> Heure Pleine</label>
                                            <div className="relative">
                                                <input type="number" value={formData.peak} onChange={(e) => setFormData({ ...formData, peak: +e.target.value, weekend: +e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 text-xl font-black text-padel-blue focus:border-padel-blue outline-none transition-all" />
                                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-padel-blue/40 font-black">€</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1 flex items-center gap-2"><Coins size={10} className="text-padel-blue" /> Valeur / Prix {formData.type === 'subscription' && '(Mensuel)'}</label>
                                                <div className="relative">
                                                    <input
                                                        value={formData.price}
                                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 text-sm font-bold text-white focus:border-padel-blue outline-none transition-all uppercase"
                                                        placeholder="59 OU À PARTIR DE..."
                                                    />
                                                </div>
                                            </div>
                                            {formData.type === 'subscription' && (
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1 flex items-center gap-2"><Coins size={10} className="text-padel-blue" /> Prix Annuel</label>
                                                        <div className="relative">
                                                            <input
                                                                value={formData.annualPrice}
                                                                onChange={(e) => setFormData({ ...formData, annualPrice: e.target.value })}
                                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 text-sm font-bold text-white focus:border-padel-blue outline-none transition-all uppercase"
                                                                placeholder="600..."
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1 flex items-center gap-2"><Calendar size={10} className="text-padel-yellow" /> Engagement (Mois)</label>
                                                        <div className="relative">
                                                            <input
                                                                type="number"
                                                                value={formData.durationInMonths}
                                                                onChange={(e) => setFormData({ ...formData, durationInMonths: parseInt(e.target.value) })}
                                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 text-sm font-bold text-white focus:border-padel-blue outline-none transition-all uppercase"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1 flex items-center gap-2"><Palette size={10} className="text-white/20" /> Icône de l'offre</label>
                                            <div className="grid grid-cols-7 gap-3">
                                                {ICON_OPTIONS.map(opt => (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, icon: opt.value })}
                                                        className={cn(
                                                            "aspect-square rounded-xl border flex items-center justify-center transition-all shadow-lg",
                                                            formData.icon === opt.value ? "bg-padel-blue border-padel-blue text-white scale-110 shadow-padel-blue/20" : "bg-white/[0.03] border-white/10 text-white/20 hover:text-white hover:border-white/30"
                                                        )}
                                                    >
                                                        <opt.icon size={16} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1 flex items-center gap-2"><ListPlus size={10} className="text-emerald-500" /> Avantages (séparés par une virgule)</label>
                                    <textarea
                                        value={formData.features}
                                        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] py-6 px-8 text-sm font-medium text-white/70 focus:border-padel-blue outline-none transition-all resize-none leading-relaxed custom-scrollbar"
                                        rows={2}
                                        placeholder="Accès illimité, Réservation prioritaire, etc..."
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1 flex items-center gap-2"><Info size={10} className="text-padel-blue" /> Description Stratégique</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] py-6 px-8 text-sm font-medium text-white/70 focus:border-padel-blue outline-none transition-all resize-none leading-relaxed custom-scrollbar"
                                        rows={2}
                                        placeholder="Présentation synthétique de l'offre..."
                                    />
                                </div>


                                <div className="flex flex-col sm:flex-row items-center justify-between gap-10 pt-10 border-t border-white/5">
                                    <div className="flex items-center gap-12">
                                        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setFormData({ ...formData, featured: !formData.featured })}>
                                            <div className={cn("w-16 h-9 rounded-full transition-all relative p-1.5", formData.featured ? "bg-padel-yellow shadow-[0_0_20px_rgba(255,193,7,0.3)]" : "bg-white/10")}>
                                                <div className={cn("w-6 h-6 rounded-full bg-white shadow-xl transition-all flex items-center justify-center", formData.featured ? "translate-x-7" : "translate-x-0")}>
                                                    {formData.featured && <Star size={12} className="text-padel-yellow fill-padel-yellow" />}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="block text-[11px] font-black text-white uppercase tracking-widest">Offre populaire</span>
                                                <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none">Mise en avant</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}>
                                            <div className={cn("w-16 h-9 rounded-full transition-all relative p-1.5", formData.isActive ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "bg-white/10")}>
                                                <div className={cn("w-6 h-6 rounded-full bg-white shadow-xl transition-all", formData.isActive ? "translate-x-7" : "translate-x-0")} />
                                            </div>
                                            <div>
                                                <span className="block text-[11px] font-black text-white uppercase tracking-widest">Activer l'offre</span>
                                                <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none">Visibilité sur le site</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 w-full sm:w-auto">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 sm:flex-none px-12 py-5 bg-white/[0.03] text-white/40 rounded-full font-black text-[11px] uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all border border-white/10"
                                        >
                                            ANNULER
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 sm:flex-none px-16 py-5 bg-padel-blue text-white rounded-full font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-padel-blue/30 hover:bg-padel-yellow hover:text-padel-blue transition-all active:scale-95 group relative overflow-hidden"
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-3">
                                                CONFIRMER <CheckCircle2 size={16} />
                                            </span>
                                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {itemToDelete && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setItemToDelete(null)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-[#0c0c0e] border border-red-500/20 rounded-[2.5rem] shadow-[0_30px_60px_rgba(239,68,68,0.2)] overflow-hidden flex flex-col items-center text-center p-10"
                        >
                            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                                <Trash2 size={32} className="text-red-500" />
                            </div>
                            <h2 className="text-2xl font-display font-black text-white uppercase mb-2">Suppression définitive</h2>
                            <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-8 leading-relaxed max-w-[90%]">Êtes-vous sûr de vouloir supprimer <span className="text-white border-b border-white/30">"{itemToDelete.title}"</span> ? Cette action est irréversible.</p>

                            <div className="flex gap-4 w-full">
                                <button onClick={() => setItemToDelete(null)} className="flex-1 px-6 py-4 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all">
                                    ANNULER
                                </button>
                                <button onClick={confirmDelete} className="flex-1 px-6 py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-red-600 transition-all flex items-center justify-center gap-2 group">
                                    SUPPRIMER <Trash2 size={12} className="group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Alert */}
            <AnimatePresence>
                {alert.show && (
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-10 right-10 z-[200] max-w-sm bg-[#0C0C0E]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex items-center gap-5">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", alert.type === 'success' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
                            {alert.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{alert.title}</h4>
                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.1em] mt-1 pr-6">{alert.message}</p>
                        </div>
                        <button onClick={() => setAlert({ ...alert, show: false })} className="p-2 hover:bg-white/5 rounded-lg transition-colors"><X size={16} className="text-white/20" /></button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
