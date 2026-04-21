import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Plus, Edit2, Trash2, X, CheckCircle2, AlertCircle,
    Star, MoveUp, MoveDown, Wallet, Zap, Trophy, 
    Target, Coins, Palette, Search, Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';

interface IPricing {
    _id: string;
    title: string;
    type: string;
    description?: string;
    price?: string;
    creditAmount?: number;
    bonusAmount?: number;
    features?: string[];
    featured: boolean;
    color?: string;
    accent?: string;
    icon?: string;
    isActive: boolean;
    order: number;
}

const ICON_OPTIONS = [
    { label: 'Portefeuille', value: 'Wallet', icon: Wallet },
    { label: 'Éclair', value: 'Zap', icon: Zap },
    { label: 'Étoile', value: 'Star', icon: Star },
    { label: 'Trophée', value: 'Trophy', icon: Trophy },
    { label: 'Cible', value: 'Target', icon: Target },
];

export function AdminWalletPacks() {
    const [items, setItems] = useState<IPricing[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<IPricing | null>(null);
    const [editingItem, setEditingItem] = useState<IPricing | null>(null);
    const [formData, setFormData] = useState({
        title: '', description: '', price: '', creditAmount: 0, bonusAmount: 0, features: '', featured: false, icon: 'Wallet', isActive: true, order: 0
    });
    const [alert, setAlert] = useState<{ show: boolean; title: string; message: string; type: 'success' | 'error' }>({ show: false, title: '', message: '', type: 'success' });
    const [searchTerm, setSearchTerm] = useState('');

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await api.get('/pricing/all?type=wallet_pack');
            setItems(res.data.data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => { fetchItems(); }, []);

    const handleOpenModal = (item?: IPricing) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title,
                description: item.description || '',
                price: item.price || '',
                creditAmount: item.creditAmount || 0,
                bonusAmount: item.bonusAmount || 0,
                features: item.features?.join(', ') || '',
                featured: item.featured,
                icon: item.icon || 'Wallet',
                isActive: item.isActive,
                order: item.order
            });
        } else {
            setEditingItem(null);
            setFormData({
                title: '',
                description: '',
                price: '',
                creditAmount: 50,
                bonusAmount: 0,
                features: '',
                featured: false,
                icon: 'Wallet',
                isActive: true,
                order: items.length > 0 ? Math.max(...items.map(i => i.order)) + 1 : 100
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                type: 'wallet_pack',
                features: formData.features.split(',').map(f => f.trim()).filter(f => f !== '')
            };

            if (editingItem) {
                await api.put(`/pricing/${editingItem._id}`, data);
                setAlert({ show: true, title: 'SUCCÈS', message: 'Pack mis à jour', type: 'success' });
            } else {
                await api.post('/pricing', data);
                setAlert({ show: true, title: 'SUCCÈS', message: 'Pack créé', type: 'success' });
            }
            setIsModalOpen(false); fetchItems();
        } catch (err) {
            setAlert({ show: true, title: 'ERREUR', message: 'Échec de l\'opération', type: 'error' });
        }
    };

    const handleDelete = (item: IPricing) => setItemToDelete(item);

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await api.delete(`/pricing/${itemToDelete._id}`);
            setItems(prev => prev.filter(i => i._id !== itemToDelete._id));
            setAlert({ show: true, title: 'SUPPRIMÉ', message: 'Pack supprimé', type: 'success' });
        } catch (err) {
            setAlert({ show: true, title: 'ERREUR', message: 'Échec de la suppression', type: 'error' });
        } finally { setItemToDelete(null); }
    };

    const updateOrder = async (id: string, newOrder: number) => {
        try { await api.put(`/pricing/${id}`, { order: newOrder }); fetchItems(); } catch (err) { console.error(err); }
    };

    return (
        <div className="space-y-12 pb-20 text-white">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-7xl font-display font-black uppercase tracking-tighter leading-[0.85]">
                        Cartes <br />
                        <span className="text-padel-blue">D'ACHAT</span>
                    </h1>
                    <p className="text-[10px] md:text-xs font-bold text-white/30 uppercase tracking-[0.3em] mt-4">Gestion des crédits • Fidélisation • Packs</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative group w-full sm:w-64">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-padel-blue transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="RECHERCHER UN PACK..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black uppercase tracking-widest text-white focus:border-padel-blue outline-none transition-all"
                        />
                    </div>
                    <button onClick={() => handleOpenModal()} className="relative overflow-hidden group flex flex-1 sm:flex-none items-center justify-center gap-3 px-10 py-5 bg-padel-blue text-white rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-widest shadow-2xl hover:bg-padel-yellow hover:text-padel-blue transition-all active:scale-95">
                        <Plus size={18} className="relative z-10 group-hover:rotate-90 transition-transform duration-500" />
                        <span className="relative z-10">NOUVELLE CARTE</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="aspect-[4/5] bg-white/[0.02] border border-white/5 animate-pulse rounded-[2.5rem]" />
                    ))
                ) : items.length === 0 ? (
                    <div className="col-span-full text-center py-32 bg-white/[0.01] border border-dashed border-white/5 rounded-[3rem]">
                        <Wallet size={48} className="mx-auto text-white/5 mb-6" />
                        <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">Aucune carte d'achat configurée</p>
                    </div>
                ) : (
                    items
                        .filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase()))
                        .sort((a, b) => a.order - b.order)
                        .map((item, index) => {
                            const Icon = ICON_OPTIONS.find(o => o.value === item.icon)?.icon || Wallet;
                            return (
                                <motion.div
                                    key={item._id}
                                    layout
                                    className="relative group bg-[#151518]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-6 flex flex-col hover:border-padel-blue/20 transition-all duration-500 overflow-hidden shadow-2xl"
                                >
                                    <div className="absolute top-4 right-4 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleOpenModal(item)} className="p-2 bg-padel-blue text-white rounded-lg hover:bg-padel-yellow hover:text-padel-blue transition-all active:scale-90 shadow-xl">
                                            <Edit2 size={12} />
                                        </button>
                                        <button onClick={() => handleDelete(item)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all active:scale-90">
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
    
                                    <div className="absolute top-4 left-4 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button disabled={index === 0} onClick={() => updateOrder(item._id, item.order - 1.5)} className="p-2 bg-white/5 text-white/20 hover:text-padel-blue transition-colors outline-none disabled:opacity-0"><MoveUp size={10} /></button>
                                        <button disabled={index === items.length - 1} onClick={() => updateOrder(item._id, item.order + 1.5)} className="p-2 bg-white/5 text-white/20 hover:text-padel-blue transition-colors outline-none disabled:opacity-0"><MoveDown size={10} /></button>
                                    </div>
    
                                    <div className="aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-white/[0.03] mb-6 relative border border-white/5 flex items-center justify-center group-hover:bg-padel-blue/5 transition-colors duration-700">
                                        <div className="absolute inset-0 bg-gradient-to-br from-padel-blue/5 to-transparent group-hover:from-padel-blue/10 transition-colors" />
                                        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-[#0c0c0e] border border-white/5 flex items-center justify-center text-padel-blue group-hover:scale-110 group-hover:border-padel-blue/20 transition-all duration-700 shadow-2xl shadow-black">
                                            <Icon size={32} className="md:w-10 md:h-10" />
                                        </div>
                                    </div>
    
                                    <div className="flex-1 space-y-4">
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2.5 py-1 rounded-full text-[8px] font-black tracking-widest uppercase border bg-padel-blue/10 border-padel-blue/20 text-padel-blue">
                                                +{item.bonusAmount}€ GRATUITS
                                            </span>
                                            {item.featured && <Star size={14} className="text-padel-yellow fill-padel-yellow shadow-inner" />}
                                            {!item.isActive && <span className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full text-[8px] font-black uppercase tracking-widest">MASQUÉ</span>}
                                        </div>
    
                                        <div>
                                            <h3 className="text-sm md:text-base font-display font-black uppercase tracking-tighter leading-tight group-hover:text-padel-blue transition-colors duration-500">
                                                {item.title}
                                            </h3>
                                            <div className="mt-2 text-xl md:text-3xl font-display font-black text-white italic">
                                                {(item.creditAmount || 0) + (item.bonusAmount || 0)}€
                                                <span className="text-[10px] not-italic font-black text-white/20 uppercase tracking-widest ml-2">CRÉDITS</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center py-3 border-y border-white/5">
                                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest font-mono">PRIX D'ACHAT</span>
                                            <span className="text-xl font-black text-padel-blue italic">{item.price}€</span>
                                        </div>
                                        <p className="text-[10px] text-white/40 line-clamp-2 leading-relaxed min-h-[3em]">{item.description}</p>
                                    </div>
                                </motion.div>
                            );
                        })
                )}
            </div>

            {/* Modal de création / édition */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[160] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            className="relative w-full max-w-2xl bg-[#0c0c0e] border border-white/10 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <div>
                                    <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter">{editingItem ? 'MODIFIER LA CARTE' : 'NOUVELLE CARTE D\'ACHAT'}</h2>
                                    <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mt-2 italic">Configuration des valeurs et bonus</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-4 bg-white/5 rounded-2xl text-white/20 hover:text-white transition-colors border border-white/10"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar pb-24">
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">Nom de la carte</label>
                                    <input
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:border-padel-blue outline-none transition-all uppercase"
                                        placeholder="EX: PACK PASSION..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6 p-8 bg-padel-blue/5 border border-padel-blue/10 rounded-[2rem]">
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">Prix Payé (Prix TTC)</label>
                                        <div className="relative">
                                            <input
                                                required
                                                type="text"
                                                value={formData.price}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    const numVal = parseFloat(val) || 0;
                                                    setFormData({ 
                                                        ...formData, 
                                                        price: val,
                                                        // Auto-fill credit value to match price if it was 0 or matching before
                                                        creditAmount: (formData.creditAmount === 0 || formData.creditAmount === parseFloat(formData.price)) ? numVal : formData.creditAmount
                                                    });
                                                }}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-xl font-black text-white focus:border-padel-blue outline-none transition-all"
                                                placeholder="100"
                                            />
                                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 font-black">€</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">Valeur de base (Crédits)</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={formData.creditAmount}
                                                onChange={(e) => setFormData({ ...formData, creditAmount: +e.target.value })}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-xl font-black text-white focus:border-padel-blue outline-none transition-all"
                                            />
                                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 font-black">€</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center ml-1">
                                            <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] flex items-center gap-2"><Sparkles size={10} className="text-padel-yellow" /> Bonus Offert</label>
                                            {(formData.creditAmount > (parseFloat(formData.price) || 0)) && (
                                                <span className="text-[8px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">+{(formData.creditAmount - (parseFloat(formData.price) || 0))}€ AUTO</span>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={formData.bonusAmount}
                                                onChange={(e) => setFormData({ ...formData, bonusAmount: +e.target.value })}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-xl font-black text-padel-yellow focus:border-padel-blue outline-none transition-all"
                                            />
                                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-padel-yellow/40 font-black">+€</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">Icône</label>
                                        <div className="grid grid-cols-5 gap-2">
                                            {ICON_OPTIONS.map(opt => (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, icon: opt.value })}
                                                    className={cn(
                                                        "aspect-square rounded-xl border flex items-center justify-center transition-all",
                                                        formData.icon === opt.value ? "bg-padel-blue border-padel-blue text-white shadow-lg" : "bg-white/[0.03] border-white/10 text-white/20 hover:text-white"
                                                    )}
                                                >
                                                    <opt.icon size={16} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] py-4 px-6 text-sm text-white focus:border-padel-blue outline-none transition-all resize-none"
                                        rows={2}
                                        placeholder="Petit texte marketing..."
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">Avantages (virgules)</label>
                                    <input
                                        value={formData.features}
                                        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm text-white/70 focus:border-padel-blue outline-none transition-all"
                                        placeholder="Bonus offert, Priorité, etc..."
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-6">
                                    <div className="flex gap-8">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="hidden" />
                                            <div className={cn("w-10 h-6 rounded-full p-1 transition-colors", formData.featured ? "bg-padel-yellow" : "bg-white/10")}>
                                                <div className={cn("w-4 h-4 bg-white rounded-full transition-transform", formData.featured ? "translate-x-4" : "translate-x-0")} />
                                            </div>
                                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Recommandé</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="hidden" />
                                            <div className={cn("w-10 h-6 rounded-full p-1 transition-colors", formData.isActive ? "bg-emerald-500" : "bg-white/10")}>
                                                <div className={cn("w-4 h-4 bg-white rounded-full transition-transform", formData.isActive ? "translate-x-4" : "translate-x-0")} />
                                            </div>
                                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Actif</span>
                                        </label>
                                    </div>
                                    <div className="flex gap-3">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 bg-white/5 text-white/50 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-white/10 transition-all">ANNULER</button>
                                        <button type="submit" className="px-10 py-3 bg-padel-blue text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl hover:bg-padel-yellow hover:text-padel-blue transition-all">ENREGISTRER</button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal suppression */}
            <AnimatePresence>
                {itemToDelete && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setItemToDelete(null)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
                        <motion.div className="relative w-full max-w-sm bg-[#0C0C0E] border border-white/10 rounded-[2.5rem] p-10 text-center">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trash2 size={24} className="text-red-500" />
                            </div>
                            <h3 className="text-xl font-display font-black text-white uppercase mb-2 italic">Supprimer cette carte ?</h3>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-8">Cette action est irréversible.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setItemToDelete(null)} className="flex-1 py-3 bg-white/5 text-white/50 rounded-xl font-black text-[9px] uppercase tracking-widest">NON</button>
                                <button onClick={confirmDelete} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl">OUI, SUPPRIMER</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Alertes */}
            <AnimatePresence>
                {alert.show && (
                    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="fixed bottom-10 right-10 z-[200] bg-[#0C0C0E]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex items-center gap-4">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", alert.type === 'success' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
                            {alert.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">{alert.title}</p>
                            <p className="text-[9px] text-white/40 uppercase font-bold mt-1">{alert.message}</p>
                        </div>
                        <button onClick={() => setAlert({...alert, show: false})} className="p-2 text-white/10 hover:text-white transition-colors"><X size={14} /></button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
