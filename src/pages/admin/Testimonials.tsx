import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    MessageSquare,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit2,
    Trash2,
    Star,
    User,
    Save,
    X,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Upload,
    Image as ImageIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';

interface Testimonial {
    _id: string;
    name: string;
    role: string;
    content: string;
    rating: number;
    avatar?: string;
    active: boolean;
}

export function AdminTestimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Partial<Testimonial> | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const [hoverRating, setHoverRating] = useState(0);

    const fetchTestimonials = async () => {
        try {
            const res = await api.get('/content/admin/testimonials');
            setTestimonials(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
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
                setEditingItem(prev => ({ ...prev, avatar: res.data.url }));
                setMessage({ type: 'success', text: 'Photo mise à jour' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Échec de l\'upload' });
        } finally {
            setUploading(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingItem?._id) {
                await api.put(`/content/testimonials/${editingItem._id}`, editingItem);
                setMessage({ type: 'success', text: 'Témoignage mis à jour' });
            } else {
                await api.post('/content/testimonials', editingItem);
                setMessage({ type: 'success', text: 'Témoignage créé' });
            }
            setIsModalOpen(false);
            fetchTestimonials();
        } catch (err) {
            setMessage({ type: 'error', text: 'Une erreur est survenue' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await api.delete(`/content/testimonials/${deleteId}`);
            fetchTestimonials();
            setMessage({ type: 'success', text: 'Témoignage supprimé' });
            setDeleteId(null);
        } catch (err) {
            setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
        } finally {
            setTimeout(() => setMessage(null), 3000);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white uppercase tracking-tighter leading-[0.85]">
                        Témoignages
                    </h1>
                    <p className="text-xs font-bold text-white/30 uppercase tracking-[0.3em]">Mettez en avant les retours de vos clients</p>
                </div>

                <button
                    onClick={() => { setEditingItem({ rating: 5, active: true }); setIsModalOpen(true); }}
                    className="group relative px-8 py-4 bg-padel-blue rounded-2xl overflow-hidden active:scale-95 transition-all shadow-2xl shadow-padel-blue/20"
                >
                    <div className="absolute inset-0 bg-padel-yellow translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white group-hover:text-padel-blue transition-colors">
                        <Plus size={16} /> Ajouter un avis
                    </span>
                </button>
            </div>

            {/* Notification */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={cn(
                            "fixed top-32 right-10 z-50 px-6 py-4 rounded-2xl border flex items-center gap-4 backdrop-blur-xl shadow-2xl",
                            message.type === 'success' ? "bg-green-500/10 border-green-500/50 text-green-500" : "bg-red-500/10 border-red-500/50 text-red-500"
                        )}
                    >
                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <span className="text-[10px] font-black uppercase tracking-widest">{message.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-6">
                    <Loader2 className="animate-spin text-padel-yellow" size={40} />
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Chargement des avis...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t) => (
                        <motion.div
                            key={t._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={cn(
                                "group bg-[#151518]/60 backdrop-blur-xl border rounded-[2rem] p-8 space-y-6 hover:border-padel-blue/50 transition-all shadow-2xl relative overflow-hidden",
                                !t.active && "opacity-50 grayscale"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className={i < t.rating ? "text-padel-yellow fill-padel-yellow" : "text-white/10"} />
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setEditingItem(t); setIsModalOpen(true); }}
                                        className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-padel-blue hover:bg-padel-blue/10 transition-colors"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(t._id)}
                                        className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <p className="text-sm md:text-base text-white/70 font-medium italic leading-relaxed break-words max-w-full">"{t.content}"</p>

                            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-padel-blue to-padel-yellow p-[1px]">
                                    <div className="w-full h-full rounded-[15px] bg-[#1a1a1e] flex items-center justify-center overflow-hidden">
                                        {t.avatar ? (
                                            <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="text-white/20" size={20} />
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-tighter">{t.name}</h4>
                                    <p className="text-[10px] font-bold text-padel-blue uppercase tracking-widest">{t.role}</p>
                                </div>
                            </div>

                            {!t.active && (
                                <div className="absolute top-4 right-4 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                                    <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Inactif</span>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-dark-bg/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-[#1a1a1e] border border-white/10 rounded-[3rem] shadow-3xl overflow-hidden"
                        >
                            <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">
                                        {editingItem?._id ? 'Modifier l\'avis' : 'Nouvel Avis'}
                                    </h2>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="p-3 text-white/20 hover:text-white transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Nom du client</label>
                                        <input
                                            required
                                            value={editingItem?.name || ''}
                                            onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-padel-blue/40 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Rôle / Position</label>
                                        <input
                                            required
                                            value={editingItem?.role || ''}
                                            onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-padel-blue/40 transition-all"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-3 px-2">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Témoignage</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={editingItem?.content || ''}
                                            onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-3xl px-6 py-5 text-white font-bold focus:outline-none focus:border-padel-blue/40 transition-all resize-none"
                                        />
                                    </div>

                                    <div className="md:col-span-1 space-y-3">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Avatar / Photo client</label>
                                        <div 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="aspect-square w-32 rounded-3xl border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center cursor-pointer hover:border-padel-blue transition-all overflow-hidden relative group mx-2"
                                        >
                                            {editingItem?.avatar ? (
                                                <img src={editingItem.avatar} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            ) : (
                                                <div className="text-center space-y-2">
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto text-white/20 group-hover:text-padel-blue transition-colors">
                                                        {uploading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                                                    </div>
                                                </div>
                                            )}
                                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Note ({editingItem?.rating}/5)</label>
                                        <div className="flex gap-2 p-4 bg-white/[0.03] border border-white/10 rounded-2xl w-fit">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => setEditingItem({ ...editingItem, rating: star })}
                                                    className="transition-transform active:scale-95 px-1"
                                                >
                                                    <Star 
                                                        size={28} 
                                                        className={cn(
                                                            "transition-all duration-300",
                                                            (hoverRating || editingItem?.rating || 0) >= star 
                                                                ? "text-padel-yellow fill-padel-yellow drop-shadow-[0_0_10px_rgba(255,210,31,0.3)]" 
                                                                : "text-white/10"
                                                        )}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Afficher en ligne</label>
                                        <button
                                            type="button"
                                            onClick={() => setEditingItem({ ...editingItem, active: !editingItem?.active })}
                                            className={cn(
                                                "w-14 h-8 rounded-full relative transition-colors duration-300",
                                                editingItem?.active ? "bg-padel-blue" : "bg-white/10"
                                            )}
                                        >
                                            <div className={cn(
                                                "absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-300",
                                                editingItem?.active ? "right-1" : "left-1"
                                            )} />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-6 bg-padel-blue text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-padel-yellow hover:text-padel-blue transition-all disabled:opacity-50"
                                >
                                    {submitting ? 'Traitement...' : 'Sauvegarder le témoignage'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteId && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDeleteId(null)}
                            className="absolute inset-0 bg-dark-bg/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-[#1a1a1e] border border-white/10 rounded-[2.5rem] p-10 shadow-3xl text-center"
                        >
                            <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center mx-auto mb-6 text-red-500">
                                <Trash2 size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Confirmation</h3>
                            <p className="text-sm text-white/40 font-medium leading-relaxed mb-10">
                                Êtes-vous sûr de vouloir supprimer ce témoignage ? <br />
                                <span className="text-red-500/50 text-[10px] font-bold uppercase tracking-widest mt-2 block">Cette action est irréversible</span>
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setDeleteId(null)}
                                    className="py-4 bg-white/5 text-white/40 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-red-500/20 hover:bg-red-600 transition-all"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
