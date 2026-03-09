import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Send,
    User,
    Loader2,
    MessageSquare,
    Search,
    RefreshCw,
    X,
    CheckCircle2,
    Calendar,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';

interface Message {
    _id: string;
    senderName: string;
    senderEmail: string;
    subject: string;
    content: string;
    status: 'READ' | 'UNREAD' | 'REPLIED';
    type: 'INBOUND' | 'OUTBOUND';
    createdAt: string;
}

export function PlayerMessages() {
    const [conversations, setConversations] = useState<Message[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [history, setHistory] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchConversations = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await api.get('/messages/me');
            setConversations(res.data.data);
        } catch (err) {
            console.error('Error fetching conversations:', err);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const fetchHistory = async (id: string, silent = false) => {
        if (!silent) setHistoryLoading(true);
        try {
            const res = await api.get(`/messages/me/${id}`);
            setHistory(res.data.data);
        } catch (err) {
            console.error('Error fetching history:', err);
        } finally {
            if (!silent) setHistoryLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchConversations();
    }, []);

    // Polling for "instant" feel (every 10 seconds)
    useEffect(() => {
        const interval = setInterval(() => {
            fetchConversations(true);
            if (selectedId) {
                fetchHistory(selectedId, true);
            }
        }, 10000);
        return () => clearInterval(interval);
    }, [selectedId]);

    // Scroll to bottom when history changes
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const handleSelect = (id: string) => {
        setSelectedId(id);
        fetchHistory(id);
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim() || !selectedId || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await api.post(`/messages/me/${selectedId}/reply`, {
                content: replyContent
            });
            setReplyContent('');
            fetchHistory(selectedId, true);
        } catch (err) {
            console.error('Error sending reply:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedConv = conversations.find(c => c._id === selectedId);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col h-[600px] md:h-[calc(100vh-250px)] bg-[#0C0C0E]/50 border border-white/5 rounded-2xl md:rounded-[2.5rem] overflow-hidden"
        >
            <div className="flex h-full">
                {/* Sidebar - Discussions */}
                <div className={cn(
                    "w-full lg:w-[380px] border-r border-white/5 flex flex-col bg-white/[0.01]",
                    selectedId && "hidden lg:flex"
                )}>
                    <div className="p-4 md:p-8 border-b border-white/5 flex items-center justify-between">
                        <div className="overflow-hidden">
                            <h1 className="text-lg md:text-2xl font-black text-white uppercase tracking-tighter truncate">Support</h1>
                            <p className="text-[8px] md:text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] md:tracking-[0.3em] mt-1 truncate">Chat avec l'équipe</p>
                        </div>
                        <button onClick={() => fetchConversations()} className="p-2 md:p-3 rounded-lg md:rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-padel-blue transition-all">
                            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-20">
                                <Loader2 className="animate-spin" size={32} />
                                <span className="text-[9px] font-black uppercase tracking-widest">Initialisation...</span>
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="text-center py-20 opacity-20 space-y-4">
                                <MessageSquare size={48} className="mx-auto" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Aucune discussion en cours</p>
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <button
                                    key={conv._id}
                                    onClick={() => handleSelect(conv._id)}
                                    className={cn(
                                        "w-full text-left p-4 md:p-6 rounded-xl md:rounded-[2rem] border transition-all relative group",
                                        selectedId === conv._id
                                            ? "bg-padel-blue border-padel-blue shadow-lg shadow-padel-blue/20"
                                            : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center border",
                                                selectedId === conv._id ? "bg-white/20 border-white/20" : "bg-white/5 border-white/10"
                                            )}>
                                                <User size={16} className={selectedId === conv._id ? "text-white" : "text-white/40"} />
                                            </div>
                                            <span className={cn("text-[10px] font-black uppercase tracking-widest", selectedId === conv._id ? "text-white" : "text-white/60")}>
                                                Equipe Padel Arena
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className={cn("text-sm font-black tracking-tighter uppercase mb-2 line-clamp-1", selectedId === conv._id ? "text-white" : "text-white")}>
                                        {conv.subject}
                                    </h3>
                                    <p className={cn("text-[11px] font-medium italic line-clamp-1", selectedId === conv._id ? "text-white/60" : "text-white/20")}>
                                        {conv.content}
                                    </p>

                                    {conv.status === 'REPLIED' && selectedId !== conv._id && (
                                        <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-padel-yellow animate-pulse" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className={cn(
                    "flex-1 flex flex-col bg-[#08080A]/80",
                    !selectedId && "hidden lg:flex"
                )}>
                    {selectedId ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 md:p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                                <div className="flex items-center gap-4 md:gap-6">
                                    <button onClick={() => setSelectedId(null)} className="lg:hidden p-2 rounded-lg bg-white/5 text-white/40">
                                        <ArrowLeft size={16} />
                                    </button>
                                    <div className="overflow-hidden">
                                        <h2 className="text-sm md:text-xl font-black text-white uppercase tracking-tighter truncate">{selectedConv?.subject}</h2>
                                        <div className="flex items-center gap-2 md:gap-3 mt-1">
                                            <span className="text-[8px] md:text-[10px] font-black text-padel-blue uppercase tracking-widest truncate">Live Support</span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Container */}
                            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-10 space-y-4 md:space-y-6 custom-scrollbar scroll-smooth">
                                {historyLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20 opacity-20 gap-4">
                                        <Loader2 className="animate-spin" size={40} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Séquençage de la discussion...</span>
                                    </div>
                                ) : (
                                    history.map((msg, idx) => (
                                        <motion.div
                                            key={msg._id}
                                            initial={{ opacity: 0, x: msg.type === 'INBOUND' ? 20 : -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className={cn(
                                                "flex flex-col max-w-[85%] md:max-w-[70%]",
                                                msg.type === 'INBOUND' ? "ml-auto items-end" : "items-start"
                                            )}
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">
                                                    {msg.type === 'INBOUND' ? 'Vous' : 'Padel Arena'}
                                                </span>
                                                <span className="text-[9px] font-bold text-white/10">•</span>
                                                <span className="text-[9px] font-bold text-white/20">
                                                    {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className={cn(
                                                "p-4 md:p-5 rounded-2xl md:rounded-[2rem] border text-xs md:text-sm italic leading-relaxed",
                                                msg.type === 'INBOUND'
                                                    ? "bg-white/[0.04] border-white/10 text-white rounded-tr-none"
                                                    : "bg-padel-blue border-padel-blue text-white rounded-tl-none shadow-xl shadow-padel-blue/10"
                                            )}>
                                                {msg.content}
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="p-4 md:p-8 border-t border-white/5 bg-white/[0.01]">
                                <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3 md:gap-4">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            placeholder="Répondre..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-5 px-5 md:px-8 text-xs md:text-sm italic text-white placeholder:text-white/10 focus:outline-none focus:border-padel-blue/40 transition-all font-medium"
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/10 hidden lg:block">
                                            <p className="text-[8px] font-black uppercase tracking-widest italic flex items-center gap-2">
                                                Elite Sync <CheckCircle2 size={10} className="text-padel-blue" />
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!replyContent.trim() || isSubmitting}
                                        className="w-12 h-12 md:w-auto md:px-8 flex items-center justify-center gap-3 bg-padel-blue text-white rounded-xl md:rounded-2xl shadow-xl shadow-padel-blue/20 hover:bg-padel-yellow hover:text-padel-blue transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <><span className="hidden md:block text-[9px] font-black uppercase tracking-widest">Envoyer</span> <Send size={16} /></>}
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-20 opacity-20">
                            <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/40 flex items-center justify-center mb-8">
                                <MessageSquare size={32} className="text-white" />
                            </div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Transmission <br /> Sécurisée</h2>
                            <p className="max-w-xs text-[10px] font-bold text-white uppercase tracking-[0.3em] leading-loose">
                                Sélectionnez une discussion pour échanger avec notre équipe technique et coachs.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
