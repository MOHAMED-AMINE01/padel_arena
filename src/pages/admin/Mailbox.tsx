import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Mail,
    Search,
    Inbox,
    Send,
    Trash2,
    Archive,
    Reply,
    MoreVertical,
    Star,
    Clock,
    User,
    ChevronRight,
    Loader2,
    RefreshCw,
    X,
    Filter,
    CheckCircle2,
    AlertCircle,
    Paperclip,
    Maximize2,
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

export function AdminMailbox() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [history, setHistory] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'REPLIED'>('ALL');
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchMessages = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await api.get('/messages');
            setMessages(res.data.data);
            setUnreadCount(res.data.unreadCount);
        } catch (err) {
            console.error('Error fetching messages:', err);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const fetchMessageHistory = async (id: string, silent = false) => {
        if (!silent) setHistoryLoading(true);
        try {
            const res = await api.get(`/messages/${id}`);
            setHistory(res.data.data);

            // If the message was unread, update local count
            if (selectedMessage?.status === 'UNREAD') {
                setUnreadCount(prev => Math.max(0, prev - 1));
                setMessages(prev => prev.map(m => m._id === id ? { ...m, status: 'READ' } : m));
            }
        } catch (err) {
            console.error('Error fetching history:', err);
        } finally {
            if (!silent) setHistoryLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();

        const interval = setInterval(() => {
            fetchMessages(true);
            if (selectedMessage) {
                fetchMessageHistory(selectedMessage._id, true);
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [selectedMessage]);

    const handleSelectMessage = (message: Message) => {
        setSelectedMessage(message);
        setReplyContent('');
        fetchMessageHistory(message._id);
    };

    const handleReply = async () => {
        if (!replyContent.trim() || !selectedMessage) return;
        setIsSubmitting(true);
        try {
            await api.post(`/messages/${selectedMessage._id}/reply`, {
                content: replyContent,
                subject: `Re: ${selectedMessage.subject}`
            });
            setReplyContent('');
            fetchMessageHistory(selectedMessage._id);
            // Update main list status to REPLIED
            setMessages(prev => prev.map(m => m._id === selectedMessage._id ? { ...m, status: 'REPLIED' } : m));
        } catch (err) {
            console.error('Error replying:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Supprimer définitivement cette conversation ?')) return;
        try {
            await api.delete(`/messages/${id}`);
            setMessages(prev => prev.filter(m => m._id !== id));
            if (selectedMessage?._id === id) {
                setSelectedMessage(null);
                setHistory([]);
            }
        } catch (err) {
            console.error('Error deleting:', err);
        }
    };

    const filteredMessages = messages.filter(m => {
        const matchesSearch =
            m.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.senderEmail.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filter === 'ALL' || m.status === filter;

        return matchesSearch && matchesFilter;
    });

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col h-[600px] md:h-[calc(100vh-140px)] bg-[#0C0C0E] border border-white/5 rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-3xl"
        >
            {/* Top Tactical Bar */}
            <div className="flex items-center justify-between px-6 md:px-10 py-5 md:py-8 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-4 md:gap-6">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-padel-blue/10 border border-padel-blue/20 flex items-center justify-center">
                        <Inbox className="text-padel-blue" size={20} />
                    </div>
                    <div className="overflow-hidden">
                        <h1 className="text-lg md:text-2xl font-black text-white uppercase tracking-tighter truncate">Centre <span className="text-padel-blue">Comms</span></h1>
                        <p className="text-[8px] md:text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] md:tracking-[0.3em] mt-1 italic truncate">Audit Mail • Temps Réel</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                    <div className="hidden sm:flex items-center gap-2 bg-[#151518] px-4 py-2 rounded-xl border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">Connecté</span>
                    </div>
                    <button
                        onClick={fetchMessages}
                        className="p-3 md:p-4 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-padel-blue transition-all"
                    >
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Message List */}
                <div className={cn(
                    "w-full lg:w-[400px] border-r border-white/5 flex flex-col bg-[#0E0E11]/50",
                    selectedMessage && "hidden lg:flex"
                )}>
                    <div className="p-4 md:p-6 space-y-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-padel-blue transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Rechercher un contact..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-white focus:outline-none focus:border-padel-blue/40 transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {(['ALL', 'UNREAD', 'REPLIED'] as const).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all whitespace-nowrap",
                                        filter === f ? "bg-padel-blue border-padel-blue text-white" : "bg-white/5 border-white/10 text-white/30 hover:bg-white/10"
                                    )}
                                >
                                    {f === 'ALL' ? 'Tous' : f === 'UNREAD' ? 'Non lus' : 'Répondus'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-2 pb-10">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="animate-spin text-padel-blue" size={32} />
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Synchronisation...</p>
                            </div>
                        ) : filteredMessages.length === 0 ? (
                            <div className="text-center py-20 text-white/10 text-[10px] font-black uppercase tracking-widest">Aucun message</div>
                        ) : (
                            filteredMessages.map((msg) => (
                                <motion.div
                                    key={msg._id}
                                    onClick={() => handleSelectMessage(msg)}
                                    whileHover={{ x: 4 }}
                                    className={cn(
                                        "p-5 rounded-[1.5rem] cursor-pointer border transition-all relative group",
                                        selectedMessage?._id === msg._id
                                            ? "bg-padel-blue/10 border-padel-blue/30"
                                            : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10",
                                        msg.status === 'UNREAD' && "border-l-4 border-l-padel-blue"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 border border-white/10 group-hover:border-padel-blue/40">
                                                <User size={16} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className={cn("text-sm font-black tracking-tighter truncate uppercase", msg.status === 'UNREAD' ? "text-white" : "text-white/60")}>
                                                    {msg.senderName}
                                                </p>
                                                <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest truncate">{msg.senderEmail}</p>
                                            </div>
                                        </div>
                                        <span className="text-[8px] font-black text-white/20">{new Date(msg.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</span>
                                    </div>
                                    <p className={cn("text-[11px] font-bold mb-1 truncate", msg.status === 'UNREAD' ? "text-padel-blue" : "text-white/40")}>
                                        {msg.subject}
                                    </p>
                                    <p className="text-[10px] text-white/20 line-clamp-2 leading-relaxed italic">
                                        {msg.content}
                                    </p>

                                    {msg.status === 'REPLIED' && (
                                        <div className="absolute top-4 right-4 text-green-500">
                                            <CheckCircle2 size={12} />
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Content - Message View */}
                <div className={cn(
                    "flex-1 flex flex-col bg-[#08080A]",
                    !selectedMessage && "hidden lg:flex"
                )}>
                    {selectedMessage ? (
                        <div className="flex flex-col h-full">
                            {/* Message Header */}
                            <div className="p-4 md:p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                                <div className="flex items-center gap-4 md:gap-6">
                                    <button onClick={() => setSelectedMessage(null)} className="lg:hidden p-2 rounded-lg bg-white/5 text-white/40">
                                        <ArrowLeft size={16} />
                                    </button>
                                    <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-[1.5rem] bg-gradient-to-br from-padel-blue to-blue-700 flex items-center justify-center text-white font-black text-sm md:text-lg shadow-xl shrink-0">
                                        {selectedMessage.senderName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h2 className="text-sm md:text-xl font-black text-white uppercase tracking-tighter truncate mb-0.5">{selectedMessage.subject}</h2>
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <span className="text-[8px] md:text-[10px] font-black text-padel-blue uppercase tracking-widest truncate">{selectedMessage.senderName}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 md:gap-3">
                                    <button
                                        onClick={() => handleDelete(selectedMessage._id)}
                                        className="p-2.5 md:p-3.5 rounded-lg md:rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Conversation Stream */}
                            <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 md:space-y-10 custom-scrollbar">
                                {historyLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                                        <Loader2 className="animate-spin text-padel-blue" size={40} />
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Chargement de l'historique...</p>
                                    </div>
                                ) : (
                                    history.map((msg, idx) => (
                                        <motion.div
                                            key={msg._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className={cn(
                                                "max-w-3xl",
                                                msg.type === 'OUTBOUND' ? "ml-auto" : ""
                                            )}
                                        >
                                            <div className={cn(
                                                "flex items-center gap-3 mb-4",
                                                msg.type === 'OUTBOUND' ? "justify-end" : ""
                                            )}>
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    msg.type === 'OUTBOUND' ? "bg-padel-blue" : "bg-padel-yellow"
                                                )} />
                                                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">
                                                    {msg.type === 'OUTBOUND' ? 'Sortant (Admin)' : 'Entrant (Client)'}
                                                </span>
                                                <span className="text-[9px] font-bold text-white/10">•</span>
                                                <span className="text-[9px] font-bold text-white/20">
                                                    {new Date(msg.createdAt).toLocaleString('fr-FR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>

                                            <div className={cn(
                                                "p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] border leading-relaxed",
                                                msg.type === 'OUTBOUND'
                                                    ? "bg-padel-blue/5 border-padel-blue/20 text-white/90"
                                                    : "bg-[#151518] border-white/5 text-white/70"
                                            )}>
                                                {msg.content.split('\n').map((line, i) => (
                                                    <p key={i} className="mb-2 last:mb-0 text-xs md:text-sm italic">{line}</p>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="p-4 md:p-8 border-t border-white/5 bg-white/[0.01]">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleReply();
                                    }}
                                    className="max-w-4xl mx-auto flex gap-3 md:gap-4"
                                >
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            placeholder="Répondre au client..."
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
                                        {isSubmitting ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <>
                                                <span className="hidden md:block text-[9px] font-black uppercase tracking-widest">Envoyer</span>
                                                <Send size={16} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-20 opacity-20">
                            <div className="w-32 h-32 rounded-full border-2 border-dashed border-white/40 flex items-center justify-center mb-10">
                                <Mail size={48} className="text-white" />
                            </div>
                            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Select <br /> a Conversation</h2>
                            <p className="max-w-xs text-[10px] font-bold text-white uppercase tracking-[0.3em] leading-loose">
                                Choisissez un message dans la liste pour consulter l'historique et répondre au client.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
