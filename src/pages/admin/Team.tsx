import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
    Plus, Edit2, Trash2, X, CheckCircle2, AlertCircle,
    Image as ImageIcon, Loader2, Upload, Linkedin, Instagram, Mail,
    Users, Save, Search, MoveUp, MoveDown, Globe
} from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';

interface TeamMember {
    _id: string;
    name: string;
    role: string;
    bio: string;
    image: string;
    socialLinks: {
        linkedin: string;
        instagram: string;
        email: string;
    };
    order: number;
    active: boolean;
}

export function AdminTeam() {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Partial<TeamMember> | null>(null);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
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

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            const res = await api.get('/content/admin/team');
            setTeam(res.data.data);
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
                setEditingItem(prev => ({ ...prev, image: res.data.url }));
                setMessage({ type: 'success', text: 'Photo téléchargée' });
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
                await api.put(`/content/team/${editingItem._id}`, editingItem);
                setMessage({ type: 'success', text: 'Membre mis à jour' });
            } else {
                await api.post('/content/team', editingItem);
                setMessage({ type: 'success', text: 'Membre ajouté' });
            }
            setIsModalOpen(false);
            fetchTeam();
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
            await api.delete(`/content/team/${deleteId}`);
            fetchTeam();
            setMessage({ type: 'success', text: 'Membre supprimé' });
            setDeleteId(null);
        } catch (err) {
            setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
        } finally {
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const updateOrder = async (id: string, newOrder: number) => {
        try {
            await api.put(`/content/team/${id}`, { order: newOrder });
            fetchTeam();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white uppercase tracking-tighter leading-[0.85]">
                        Notre <br /> <span className="text-padel-yellow drop-shadow-[0_0_30px_rgba(255,210,31,0.2)]">Expertise</span>
                    </h1>
                    <p className="text-xs font-bold text-white/30 uppercase tracking-[0.3em]">Gérez les membres de l'équipe Arena</p>
                </div>

                <button 
                    onClick={() => { 
                        setEditingItem({ 
                            order: team.length, 
                            active: true,
                            socialLinks: { linkedin: '', instagram: '', email: '' }
                        }); 
                        setIsModalOpen(true); 
                    }}
                    className="group relative px-8 py-4 bg-padel-blue rounded-2xl overflow-hidden active:scale-95 transition-all shadow-2xl shadow-padel-blue/20"
                >
                    <div className="absolute inset-0 bg-padel-yellow translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white group-hover:text-padel-blue transition-colors">
                        <Plus size={16} /> Ajouter un expert
                    </span>
                </button>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-6">
                    <Loader2 className="animate-spin text-padel-yellow" size={40} />
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Chargement des membres...</p>
                </div>
            ) : (
                <div className="space-y-12">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {team.sort((a,b) => a.order - b.order)
                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                            .map((member, index) => (
                            <motion.div
                                key={member._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "group bg-[#151518]/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 flex flex-col items-center text-center hover:border-padel-blue/30 transition-all shadow-2xl relative",
                                    !member.active && "opacity-50 grayscale"
                                )}
                            >
                                {/* Order Controls (Absolute) */}
                                <div className="absolute top-4 left-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => updateOrder(member._id, member.order - 1.5)} 
                                        className="p-2 bg-white/5 rounded-lg text-white/20 hover:text-padel-blue transition-colors"
                                    >
                                        <MoveUp size={12} />
                                    </button>
                                    <button 
                                        onClick={() => updateOrder(member._id, member.order + 1.5)} 
                                        className="p-2 bg-white/5 rounded-lg text-white/20 hover:text-padel-blue transition-colors"
                                    >
                                        <MoveDown size={12} />
                                    </button>
                                </div>

                                {/* Actions (Absolute) */}
                                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => { setEditingItem(member); setIsModalOpen(true); }} 
                                        className="p-2 bg-padel-blue/10 rounded-lg text-padel-blue hover:bg-padel-blue hover:text-white transition-all"
                                    >
                                        <Edit2 size={12} />
                                    </button>
                                    <button 
                                        onClick={() => setDeleteId(member._id)} 
                                        className="p-2 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>

                                <div className="w-24 h-24 rounded-[2rem] overflow-hidden bg-white/5 mb-6 group-hover:scale-105 transition-transform duration-500 shadow-2xl border border-white/5">
                                    {member.image ? (
                                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/10"><Users size={32} /></div>
                                    )}
                                </div>

                                <div className="space-y-4 flex-1">
                                    <div>
                                        <h3 className="text-base font-black text-white uppercase tracking-tighter line-clamp-1">{member.name}</h3>
                                        <p className="text-[9px] font-bold text-padel-blue uppercase tracking-widest mt-1">{member.role}</p>
                                    </div>
                                    
                                    <p className="text-[10px] text-white/40 italic line-clamp-2 px-2">"{member.bio}"</p>
                                    
                                    <div className="flex justify-center gap-3 pt-4 border-t border-white/5">
                                        {member.socialLinks.linkedin && <Linkedin size={12} className="text-white/20 hover:text-padel-blue cursor-pointer transition-colors" />}
                                        {member.socialLinks.instagram && <Instagram size={12} className="text-white/20 hover:text-padel-blue cursor-pointer transition-colors" />}
                                        {member.socialLinks.email && <Mail size={12} className="text-white/20 hover:text-padel-blue cursor-pointer transition-colors" />}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Pagination Bar */}
                    {team.length > itemsPerPage && (
                        <div className="flex items-center justify-center gap-4">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                className="p-4 bg-white/5 rounded-2xl text-white/20 hover:text-padel-blue hover:bg-white/10 disabled:opacity-30 transition-all"
                            >
                                <MoveUp size={20} className="-rotate-90" />
                            </button>
                            
                            <div className="flex gap-2">
                                {[...Array(Math.ceil(team.length / itemsPerPage))].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={cn(
                                            "w-10 h-10 rounded-xl text-[10px] font-black transition-all",
                                            currentPage === i + 1 
                                                ? "bg-padel-blue text-white shadow-xl shadow-padel-blue/20" 
                                                : "bg-white/5 text-white/20 hover:bg-white/10 hover:text-white"
                                        )}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                disabled={currentPage === Math.ceil(team.length / itemsPerPage)}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                className="p-4 bg-white/5 rounded-2xl text-white/20 hover:text-padel-blue hover:bg-white/10 disabled:opacity-30 transition-all"
                            >
                                <MoveDown size={20} className="-rotate-90" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-dark-bg/90 backdrop-blur-xl" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-[#1a1a1e] border border-white/10 rounded-[3rem] shadow-3xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="p-8 md:p-10 border-b border-white/5 flex items-center justify-between">
                                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">
                                    {editingItem?._id ? 'Modifier l\'expert' : 'Nouvel Expert'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 text-white/20 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 md:p-10 overflow-y-auto space-y-10 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {/* Info Column */}
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Nom Complet</label>
                                            <input
                                                required
                                                value={editingItem?.name || ''}
                                                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-padel-blue transition-all"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Rôle / Spécialité</label>
                                            <input
                                                required
                                                value={editingItem?.role || ''}
                                                onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-padel-blue transition-all"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Mini Bio</label>
                                            <textarea
                                                required
                                                rows={4}
                                                value={editingItem?.bio || ''}
                                                onChange={(e) => setEditingItem({ ...editingItem, bio: e.target.value })}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-3xl px-6 py-5 text-white font-bold focus:outline-none focus:border-padel-blue transition-all resize-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Multimedia & Social Column */}
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Photo de profil</label>
                                            <div 
                                                onClick={() => fileInputRef.current?.click()}
                                                className="aspect-[4/3] rounded-[2rem] border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center cursor-pointer hover:border-padel-blue transition-all overflow-hidden relative group"
                                            >
                                                {editingItem?.image ? (
                                                    <img src={editingItem.image} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                ) : (
                                                    <div className="text-center space-y-4">
                                                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-white/20 group-hover:text-padel-blue transition-colors">
                                                            {uploading ? <Loader2 size={32} className="animate-spin" /> : <Upload size={32} />}
                                                        </div>
                                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Cliquez pour uploader</p>
                                                    </div>
                                                )}
                                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-white/5">
                                            <div className="relative">
                                                <Linkedin size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" />
                                                <input
                                                    placeholder="URL LINKEDIN"
                                                    value={editingItem?.socialLinks?.linkedin || ''}
                                                    onChange={(e) => setEditingItem({ ...editingItem, socialLinks: { ...editingItem.socialLinks!, linkedin: e.target.value } })}
                                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-[10px] font-black text-white focus:outline-none focus:border-padel-blue transition-all"
                                                />
                                            </div>
                                            <div className="relative">
                                                <Instagram size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" />
                                                <input
                                                    placeholder="URL INSTAGRAM"
                                                    value={editingItem?.socialLinks?.instagram || ''}
                                                    onChange={(e) => setEditingItem({ ...editingItem, socialLinks: { ...editingItem.socialLinks!, instagram: e.target.value } })}
                                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-[10px] font-black text-white focus:outline-none focus:border-padel-blue transition-all"
                                                />
                                            </div>
                                            <div className="relative">
                                                <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" />
                                                <input
                                                    placeholder="EMAIL PROFESSIONNEL"
                                                    value={editingItem?.socialLinks?.email || ''}
                                                    onChange={(e) => setEditingItem({ ...editingItem, socialLinks: { ...editingItem.socialLinks!, email: e.target.value } })}
                                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-[10px] font-black text-white focus:outline-none focus:border-padel-blue transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-10 border-t border-white/5">
                                    <div className="flex items-center gap-4">
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
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Actif sur le site</span>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-12 py-5 bg-padel-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-padel-yellow hover:text-padel-blue transition-all disabled:opacity-50"
                                    >
                                        {submitting ? 'Traitement...' : 'Enregistrer le membre'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Notification */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className={cn(
                            "fixed bottom-10 right-10 z-[200] px-6 py-4 rounded-[2rem] border flex items-center gap-4 backdrop-blur-3xl shadow-3xl",
                            message.type === 'success' ? "bg-green-500/10 border-green-500/50 text-green-500" : "bg-red-500/10 border-red-500/50 text-red-500"
                        )}
                    >
                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <span className="text-[10px] font-black uppercase tracking-widest">{message.text}</span>
                    </motion.div>
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
                                Êtes-vous sûr de vouloir supprimer ce collaborateur ? <br />
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
