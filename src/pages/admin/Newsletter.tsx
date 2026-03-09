import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Users,
    Send,
    Eye,
    Trash2,
    Loader2,
    Mail,
    CheckCircle2,
    X,
    AlertCircle,
    ChevronRight,
    RefreshCw,
    Search,
    Clock,
    UserMinus,
    UserPlus
} from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';

interface Subscriber {
    _id: string;
    email: string;
    isActive: boolean;
    subscribedAt: string;
}

export function AdminNewsletter() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showList, setShowList] = useState(true); // Mobile view toggle

    // Elite Modal State
    const [modal, setModal] = useState<{
        show: boolean;
        title: string;
        message: string;
        type: 'success' | 'error' | 'confirm';
        onConfirm?: () => void;
    }>({
        show: false,
        title: '',
        message: '',
        type: 'success'
    });

    const [newsletter, setNewsletter] = useState({
        subject: '',
        title: 'ELITE UPDATE',
        content: ''
    });

    const fetchSubscribers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/newsletter/subscribers');
            setSubscribers(res.data.data);
        } catch (err) {
            console.error('Error fetching subscribers:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const handleToggleStatus = async (id: string) => {
        try {
            await api.patch(`/newsletter/subscribers/${id}`);
            setSubscribers(prev => prev.map(s => s._id === id ? { ...s, isActive: !s.isActive } : s));
        } catch (err) {
            console.error('Error toggling status:', err);
        }
    };

    const handleDelete = async (id: string) => {
        setModal({
            show: true,
            title: 'SUPPRESSION ABONNÉ',
            message: 'Voulez-vous vraiment supprimer définitivement cet abonné ?',
            type: 'confirm',
            onConfirm: async () => {
                try {
                    await api.delete(`/newsletter/subscribers/${id}`);
                    setSubscribers(prev => prev.filter(s => s._id !== id));
                    setModal({
                        show: true,
                        title: 'ABONNÉ SUPPRIMÉ',
                        message: 'L\'email a été retiré de la base de données.',
                        type: 'success'
                    });
                } catch (err) {
                    setModal({ show: true, title: 'ERREUR', message: 'Échec de la suppression', type: 'error' });
                }
            }
        });
    };

    const handleSend = async () => {
        if (!newsletter.subject || !newsletter.content) {
            setModal({ show: true, title: 'CHAMPS REQUIS', message: 'Le sujet et le contenu ne peuvent pas être vides.', type: 'error' });
            return;
        }

        setModal({
            show: true,
            title: 'CONFIRMATION D\'ENVOI',
            message: `Vous allez envoyer cette newsletter à ${activeSubscribers.length} abonnés. Continuer ?`,
            type: 'confirm',
            onConfirm: async () => {
                setSending(true);
                setModal({ show: false, title: '', message: '', type: 'success' }); // Close confirm modal
                try {
                    await api.post('/newsletter/send', {
                        subject: newsletter.subject,
                        content: newsletter.content,
                        htmlContent: previewHtml
                    });
                    setModal({
                        show: true,
                        title: 'DIFFUSION RÉUSSIE',
                        message: `La newsletter a été envoyée avec succès à ${activeSubscribers.length} abonnés.`,
                        type: 'success'
                    });
                    setNewsletter({ subject: '', title: 'ELITE UPDATE', content: '' });
                } catch (err) {
                    setModal({ show: true, title: 'ERREUR D\'ENVOI', message: 'Une erreur est survenue lors de la diffusion.', type: 'error' });
                } finally {
                    setSending(false);
                }
            }
        });
    };

    const activeSubscribers = subscribers.filter(s => s.isActive);
    const filteredSubscribers = subscribers.filter(s =>
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Live Preview Logic
    const previewHtml = useMemo(() => {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
                body { background-color: #050505; margin: 0; padding: 0; font-family: 'Inter', sans-serif;}
                .container { max-width: 600px; margin: 20px auto; background: #0C0C0E; border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; overflow: hidden;}
                .header { background: #151518; padding: 30px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05);}
                .content { padding: 40px; color: rgba(255,255,255,0.8); line-height: 1.6; font-size: 14px;}
                .title { color: #ffffff; font-weight: 900; font-size: 20px; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 20px; text-align: center;}
                .footer { padding: 20px; text-align: center; background: #08080A; border-top: 1px solid rgba(255,255,255,0.05);}
                .footer-text { color: rgba(255,255,255,0.2); font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin:0; color:#fff; font-size: 24px; font-weight:900; letter-spacing:-1.5px; text-transform:uppercase;">
                        PADEL<span style="color:#0066FF;">ARENA</span>
                    </h1>
                </div>
                <div class="content">
                    <div class="title">${newsletter.title || 'ELITE UPDATE'}</div>
                    ${newsletter.content.split('\n').map(p => `<p>${p || '&nbsp;'}</p>`).join('')}
                </div>
                <div class="footer">
                    <div class="footer-text">© 2026 Padel Arena Vendôme • Elite Sync Enabled</div>
                </div>
            </div>
        </body>
        </html>
        `;
    }, [newsletter]);

    return (
        <div className="flex flex-col h-full lg:h-[calc(100vh-140px)] bg-[#0C0C0E] border border-white/5 rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-3xl">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 md:px-10 py-5 md:py-8 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-4 md:gap-6">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-padel-blue/10 border border-padel-blue/20 flex items-center justify-center">
                        <Users className="text-padel-blue" size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg md:text-2xl font-black text-white uppercase tracking-tighter">Gestion <span className="text-padel-blue">Newsletter</span></h1>
                        <p className="text-[8px] md:text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mt-1 italic">Diffusion • Elite Audience</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{activeSubscribers.length} Actifs</span>
                        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Sur {subscribers.length} inscrits</span>
                    </div>
                    {/* Mobile toggle button */}
                    <button
                        onClick={() => setShowList(!showList)}
                        className="lg:hidden p-3 rounded-xl bg-padel-blue/10 border border-padel-blue/20 text-padel-blue"
                    >
                        {showList ? <Send size={16} /> : <Users size={16} />}
                    </button>
                    <button onClick={fetchSubscribers} className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-padel-blue transition-all">
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Left side: Subscribers List */}
                <div className={cn(
                    "absolute inset-0 lg:relative lg:inset-auto z-20 w-full lg:w-[400px] border-r border-white/5 flex flex-col bg-[#0E0E11] lg:bg-[#0E0E11]/50 transition-transform duration-500",
                    showList ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}>
                    <div className="p-6 space-y-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                            <input
                                type="text"
                                placeholder="Rechercher un abonné..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-white focus:outline-none focus:border-padel-blue/40 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar px-6 space-y-3 pb-10">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                                <Loader2 className="animate-spin text-padel-blue" size={32} />
                                <p className="text-[10px] font-black text-white uppercase tracking-widest">Chargement...</p>
                            </div>
                        ) : filteredSubscribers.length === 0 ? (
                            <div className="text-center py-20 text-white/10 text-[10px] font-black uppercase tracking-widest">Aucun abonné trouvé</div>
                        ) : (
                            filteredSubscribers.map((sub) => (
                                <div key={sub._id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            sub.isActive ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" : "bg-white/10"
                                        )} />
                                        <div className="overflow-hidden">
                                            <p className="text-xs font-black text-white truncate uppercase tracking-tight">{sub.email}</p>
                                            <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Depuis {new Date(sub.subscribedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleToggleStatus(sub._id)}
                                            className={cn(
                                                "p-2 rounded-lg transition-all",
                                                sub.isActive ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 cursor-pointer hover:text-white" : "bg-green-500/10 text-green-500 hover:bg-green-500 cursor-pointer hover:text-white"
                                            )}
                                        >
                                            {sub.isActive ? <UserMinus size={14} /> : <UserPlus size={14} />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(sub._id)}
                                            className="p-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right side: Composer & Preview */}
                <div className={cn(
                    "flex-1 overflow-y-auto bg-[#08080A] custom-scrollbar transition-transform duration-500",
                    !showList ? "translate-x-0" : "translate-x-full lg:translate-x-0"
                )}>
                    <div className="p-4 md:p-8 lg:p-12 max-w-5xl mx-auto space-y-8 md:space-y-12">
                        {/* Composer */}
                        <section className="space-y-8">
                            <h3 className="text-[10px] font-black text-padel-blue uppercase tracking-[0.4em]">Composition de la Newsletter</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest">Sujet de l'Email</label>
                                    <input
                                        type="text"
                                        value={newsletter.subject}
                                        onChange={(e) => setNewsletter(prev => ({ ...prev, subject: e.target.value }))}
                                        placeholder="Ex: Nouveaux Tournois Padel Arena..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-padel-blue/40 transition-all"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest">Titre dans le corps</label>
                                    <input
                                        type="text"
                                        value={newsletter.title}
                                        onChange={(e) => setNewsletter(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="ELITE UPDATE"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-padel-blue/40 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-widest">Contenu du message</label>
                                <textarea
                                    rows={6}
                                    value={newsletter.content}
                                    onChange={(e) => setNewsletter(prev => ({ ...prev, content: e.target.value }))}
                                    placeholder="Rédigez ici le contenu de votre newsletter..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 text-sm font-medium text-white/80 focus:outline-none focus:border-padel-blue/40 transition-all resize-none leading-relaxed"
                                />
                            </div>

                            <button
                                onClick={handleSend}
                                disabled={sending || !newsletter.subject || !newsletter.content || activeSubscribers.length === 0}
                                className="w-full py-4 md:py-5 rounded-2xl bg-padel-blue text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 md:gap-4 hover:bg-padel-yellow hover:text-padel-blue transition-all active:scale-[0.98] shadow-2xl shadow-padel-blue/20 disabled:opacity-50"
                            >
                                {sending ? (
                                    <>
                                        <Loader2 className="animate-spin" size={14} /> <span className="hidden xs:inline">ENVOI EN COURS À {activeSubscribers.length} ABONNÉS...</span><span className="xs:hidden">ENVOI...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={14} /> DIFFUSER LA NEWSLETTER
                                    </>
                                )}
                            </button>
                        </section>

                        {/* Preview Box */}
                        <section className="space-y-6 md:space-y-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <h3 className="text-[10px] font-black text-padel-yellow uppercase tracking-[0.4em]">Aperçu du Rendu Final</h3>
                                <div className="flex self-start items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                                    <Eye size={12} className="text-padel-yellow" />
                                    <span className="text-[8px] font-black text-white/40 uppercase tracking-widest italic">Live Rendering View</span>
                                </div>
                            </div>

                            <div className="bg-[#121215] border border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-3 md:p-10 shadow-inner overflow-hidden">
                                <div
                                    className="max-w-full overflow-x-auto scale-[0.85] origin-top md:scale-100"
                                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                                />
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* Elite Modal */}
            <AnimatePresence>
                {modal.show && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setModal({ ...modal, show: false })}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-sm bg-[#0E0E11] border border-white/10 rounded-3xl p-8 text-center shadow-3xl overflow-hidden"
                        >
                            <div className={cn(
                                "absolute top-0 left-0 w-full h-1",
                                modal.type === 'confirm' ? "bg-padel-yellow" :
                                    modal.type === 'success' ? "bg-padel-blue" : "bg-red-500"
                            )} />

                            <div className={cn(
                                "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6",
                                modal.type === 'confirm' ? "bg-padel-yellow/10 text-padel-yellow" :
                                    modal.type === 'success' ? "bg-padel-blue/10 text-padel-blue" : "bg-red-500/10 text-red-500"
                            )}>
                                {modal.type === 'confirm' ? <AlertCircle size={32} /> :
                                    modal.type === 'success' ? <CheckCircle2 size={32} /> : <X size={32} />}
                            </div>

                            <h3 className="text-[12px] font-black text-white uppercase tracking-[0.4em] mb-4">
                                {modal.title}
                            </h3>
                            <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest leading-relaxed mb-8 italic px-4">
                                {modal.message}
                            </p>

                            <div className="flex gap-3">
                                {modal.type === 'confirm' ? (
                                    <>
                                        <button
                                            onClick={() => setModal({ ...modal, show: false })}
                                            className="flex-1 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-[9px] font-black text-white/40 uppercase tracking-[0.2em] transition-all"
                                        >
                                            ANNULER
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (modal.onConfirm) modal.onConfirm();
                                            }}
                                            className="flex-1 py-4 bg-padel-blue text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-padel-blue/20"
                                        >
                                            CONFIRMER
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setModal({ ...modal, show: false })}
                                        className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-[9px] font-black text-white uppercase tracking-[0.2em] transition-all"
                                    >
                                        DIMISSION
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
