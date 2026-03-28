import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Plus, Edit2, Trash2, X, CheckCircle2, AlertCircle,
    Image as ImageIcon, Star, MoveUp, MoveDown, Search,
    Loader2, Upload, ExternalLink, Calendar, Type,
    Newspaper, Layout, ClipboardList, Zap, Settings
} from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';
import { CustomSelect } from '../../components/admin/CustomSelect';

interface INews {
    _id: string;
    title: string;
    category: string;
    date: string;
    image: string;
    description: string;
    featured: boolean;
    link: string;
    isActive: boolean;
    order: number;
    content: string;
}

const SECTIONS = [
    { label: 'Réservations', value: '/reservations' },
    { label: 'Tournois & Événements', value: '/tournois' },
    { label: 'Tarifs & Abonnements', value: '/pricing' },
    { label: 'Activités & Services', value: '/activities' },
    { label: 'Actualités', value: '/news' },
    { label: 'Contact', value: '/contact' },
    { label: 'Academy', value: '/academy' },
];

const CATEGORIES = ['ACTUS', 'TOURNOIS', 'BLOG', 'ÉVÉNEMENT', 'PROMO', 'OFFICIEL'];
const CATEGORY_OPTIONS = CATEGORIES.map(cat => ({ label: cat, value: cat }));
const SECTION_OPTIONS = SECTIONS.map(s => ({ label: s.label, value: s.value }));

export function AdminNews() {
    const [news, setNews] = useState<INews[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<INews | null>(null);
    const [editingItem, setEditingItem] = useState<INews | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [uploading, setUploading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const updateLimit = () => {
            if (window.innerWidth >= 1024) setItemsPerPage(8); // lg: 4x2
            else if (window.innerWidth >= 768) setItemsPerPage(6); // md: 3x2
            else setItemsPerPage(8); // mobile: 2x4
        };
        updateLimit();
        window.addEventListener('resize', updateLimit);
        return () => window.removeEventListener('resize', updateLimit);
    }, []);

    const [formData, setFormData] = useState({
        title: '',
        category: 'ACTUS',
        date: '',
        image: '',
        description: '',
        featured: false,
        link: '/news',
        isActive: true,
        order: 0,
        content: ''
    });

    const [alert, setAlert] = useState<{ show: boolean; title: string; message: string; type: 'success' | 'error' }>({
        show: false, title: '', message: '', type: 'success'
    });

    const fetchNews = async () => {
        setLoading(true);
        try {
            const res = await api.get('/news/all');
            setNews(res.data.data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => { fetchNews(); }, []);

    const handleOpenModal = (item?: INews) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title,
                category: item.category,
                date: item.date,
                image: item.image,
                description: item.description,
                featured: item.featured,
                link: item.link,
                isActive: item.isActive,
                order: item.order,
                content: item.content || ''
            });
        } else {
            setEditingItem(null);
            setFormData({
                title: '',
                category: 'ACTUS',
                date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
                image: '',
                description: '',
                featured: false,
                link: '/news',
                isActive: true,
                order: news.length,
                content: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            const res = await api.post('/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                setFormData(prev => ({ ...prev, image: res.data.url }));
                setAlert({ show: true, title: 'UPLOAD', message: 'Image téléchargée avec succès', type: 'success' });
            }
        } catch (err) {
            setAlert({ show: true, title: 'ERREUR', message: 'Échec de l\'upload', type: 'error' });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await api.put(`/news/${editingItem._id}`, formData);
                setAlert({ show: true, title: 'SUCCÈS', message: 'Actualité mise à jour', type: 'success' });
            } else {
                await api.post('/news', formData);
                setAlert({ show: true, title: 'SUCCÈS', message: 'Actualité créée', type: 'success' });
            }
            setIsModalOpen(false);
            fetchNews();
        } catch (err) {
            setAlert({ show: true, title: 'ERREUR', message: 'Échec de l\'opération', type: 'error' });
        }
    };

    const handleDelete = (item: INews) => {
        setItemToDelete(item);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await api.delete(`/news/${itemToDelete._id}`);
            setNews(prev => prev.filter(n => n._id !== itemToDelete._id));
            setAlert({ show: true, title: 'SUPPRIMÉ', message: 'Actualité supprimée', type: 'success' });
        } catch (err) {
            setAlert({ show: true, title: 'ERREUR', message: 'Échec de la suppression', type: 'error' });
        } finally {
            setItemToDelete(null);
        }
    };

    const updateOrder = async (id: string, newOrder: number) => {
        try { await api.put(`/news/${id}`, { order: newOrder }); fetchNews(); } catch (err) { console.error(err); }
    };

    const filteredNews = news.filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-12 pb-20 text-white">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-7xl font-display font-black uppercase tracking-tighter leading-[0.85]">
                        Actualités
                    </h1>
                    <p className="text-[10px] md:text-xs font-bold text-white/30 uppercase tracking-[0.3em] mt-4">Programmation éditoriale • Stratégie de contenu</p>
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
                    <button onClick={() => handleOpenModal()} className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-padel-blue text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-padel-yellow hover:text-padel-blue transition-all active:scale-95">
                        <Plus size={18} /> NOUVEUR ARTICLE
                    </button>
                </div>
            </div>

            <div className="space-y-12">
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: itemsPerPage }).map((_, i) => (
                            <div key={i} className="aspect-[4/5] bg-white/[0.02] border border-white/5 animate-pulse rounded-[2.5rem]" />
                        ))}
                    </div>
                ) : filteredNews.length === 0 ? (
                    <div className="text-center py-32 bg-white/[0.01] border border-dashed border-white/5 rounded-[3rem]">
                        <ImageIcon size={48} className="mx-auto text-white/5 mb-6" />
                        <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">Aucun article correspondant à votre recherche</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredNews.sort((a, b) => a.order - b.order)
                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                            .map((item, index) => (
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

                                {/* Order Controls (Desktop only for precision) */}
                                <div className="absolute top-4 left-4 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button disabled={index === 0} onClick={() => updateOrder(item._id, item.order - 1.5)} className="p-2 bg-white/5 text-white/20 hover:text-padel-blue transition-colors outline-none"><MoveUp size={10} /></button>
                                    <button disabled={index === news.length - 1} onClick={() => updateOrder(item._id, item.order + 1.5)} className="p-2 bg-white/5 text-white/20 hover:text-padel-blue transition-colors outline-none"><MoveDown size={10} /></button>
                                </div>

                                <div className="aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-white/5 mb-6 relative group/img shrink-0">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-1000" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/5"><ImageIcon size={40} /></div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2.5 py-1 bg-padel-blue/10 border border-padel-blue/20 text-padel-blue rounded-full text-[8px] font-black tracking-widest uppercase">{item.category}</span>
                                        {item.featured && <Star size={14} className="text-padel-yellow fill-padel-yellow" />}
                                    </div>

                                    <div>
                                        <h3 className="text-sm md:text-base font-display font-black uppercase tracking-tighter leading-tight line-clamp-2 group-hover:text-padel-blue transition-colors duration-500">{item.title}</h3>
                                        <p className="flex items-center gap-1.5 text-[8px] text-white/20 font-black uppercase tracking-widest mt-2"><Calendar size={10} /> {item.date}</p>
                                    </div>
                                    <p className="text-[10px] text-white/40 line-clamp-2 leading-relaxed">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Pagination Bar */}
                {filteredNews.length > itemsPerPage && !loading && (
                    <div className="flex items-center justify-center gap-4">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="p-4 bg-white/5 rounded-2xl text-white/20 hover:text-padel-blue hover:bg-white/10 disabled:opacity-30 transition-all active:scale-95"
                        >
                            <MoveUp size={20} className="-rotate-90" />
                        </button>
                        
                        <div className="flex gap-2">
                            {[...Array(Math.ceil(filteredNews.length / itemsPerPage))].map((_, i) => (
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
                            disabled={currentPage === Math.ceil(filteredNews.length / itemsPerPage)}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="p-4 bg-white/5 rounded-2xl text-white/20 hover:text-padel-blue hover:bg-white/10 disabled:opacity-30 transition-all active:scale-95"
                        >
                            <MoveDown size={20} className="-rotate-90" />
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
                                    <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter">{editingItem ? 'MISE À JOUR' : 'PUBLICATION'}</h2>
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-2">Détails de l'article • Presse & News</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-4 bg-white/5 rounded-2xl text-white/20 hover:text-white transition-colors border border-white/10"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-12 pb-32 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    {/* Left Column */}
                                    <div className="space-y-10">
                                        <div className="space-y-4">
                                            <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1 flex items-center gap-2"><Type size={10} className="text-padel-blue" /> Titre de l'article</label>
                                            <input
                                                required
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 text-sm font-bold text-white focus:border-padel-blue focus:ring-1 focus:ring-padel-blue/50 outline-none transition-all uppercase placeholder:opacity-10"
                                                placeholder="LE TITRE QUI IMPACTE..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-8">
                                            <CustomSelect
                                                label="Catégorie"
                                                options={CATEGORY_OPTIONS}
                                                value={formData.category}
                                                onChange={(val) => setFormData({ ...formData, category: val })}
                                            />
                                            <div className="space-y-4">
                                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1 flex items-center gap-2"><Calendar size={10} className="text-padel-blue" /> Date</label>
                                                <input
                                                    required
                                                    value={formData.date}
                                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 text-sm font-bold text-white focus:border-padel-blue focus:ring-1 focus:ring-padel-blue/50 outline-none transition-all uppercase placeholder:opacity-10"
                                                    placeholder="23 FÉB 2026"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Image Upload */}
                                    <div className="space-y-10">
                                        <div className="space-y-4">
                                            <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1 flex items-center gap-2"><ImageIcon size={10} className="text-padel-blue" /> Image de couverture</label>
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="aspect-square rounded-[2.5rem] border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-padel-blue/50 hover:bg-padel-blue/5 transition-all group overflow-hidden relative shadow-2xl"
                                            >
                                                {formData.image ? (
                                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                                ) : (
                                                    <>
                                                        <div className="w-20 h-20 rounded-[2rem] bg-white/[0.05] flex items-center justify-center text-white/20 group-hover:bg-padel-blue group-hover:text-white transition-all shadow-xl">
                                                            {uploading ? <Loader2 size={32} className="animate-spin" /> : <Upload size={32} />}
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-[10px] font-black text-white uppercase tracking-widest group-hover:text-padel-blue transition-colors">
                                                                {uploading ? 'Téléchargement...' : 'Cliquez pour uploader'}
                                                            </p>
                                                            <p className="text-[8px] font-bold text-white/10 uppercase tracking-[0.2em] mt-2">PNG, JPG jusqu'à 10MB</p>
                                                        </div>
                                                    </>
                                                )}
                                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1 flex items-center gap-2"><ExternalLink size={10} className="text-padel-blue" /> Ou URL directe</label>
                                            <input
                                                value={formData.image}
                                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 text-[10px] font-medium text-white/40 focus:border-padel-blue outline-none transition-all placeholder:opacity-10"
                                                placeholder="https://images.cloudinary.com/..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1 flex items-center gap-2"><ClipboardList size={10} className="text-padel-blue" /> Résumé court (Pour la liste)</label>
                                    <textarea
                                        required
                                        rows={2}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 text-sm font-medium text-white/70 focus:border-padel-blue focus:ring-1 focus:ring-padel-blue/50 outline-none transition-all resize-none leading-relaxed custom-scrollbar"
                                        placeholder="L'essentiel en une phrase..."
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1 flex items-center gap-2"><Layout size={10} className="text-padel-blue" /> Contenu détaillé (Pour le Modal)</label>
                                    <textarea
                                        required
                                        rows={8}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] py-6 px-8 text-sm font-medium text-white/70 focus:border-padel-blue focus:ring-1 focus:ring-padel-blue/50 outline-none transition-all resize-none leading-relaxed custom-scrollbar"
                                        placeholder="Décrivez l'actualité en détails ici..."
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
                                                <span className="block text-[11px] font-black text-white uppercase tracking-widest">À la une</span>
                                                <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none">Visibilité prioritaire</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}>
                                            <div className={cn("w-16 h-9 rounded-full transition-all relative p-1.5", formData.isActive ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "bg-white/10")}>
                                                <div className={cn("w-6 h-6 rounded-full bg-white shadow-xl transition-all", formData.isActive ? "translate-x-7" : "translate-x-0")} />
                                            </div>
                                            <div>
                                                <span className="block text-[11px] font-black text-white uppercase tracking-widest">Statut actif</span>
                                                <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none">Visible sur le site</span>
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
