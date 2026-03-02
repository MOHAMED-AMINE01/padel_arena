import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    isLoading?: boolean;
}

export function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    isLoading = false
}: DeleteConfirmModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-dark-bg/90 backdrop-blur-2xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className="bg-[#1a1a1e] border border-red-500/20 w-full max-w-md rounded-[3rem] p-10 relative z-10 shadow-4xl overflow-hidden group"
                    >
                        {/* Decorative Red Glow */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 blur-[100px] rounded-full group-hover:bg-red-500/20 transition-all duration-700" />

                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-[2rem] bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-8 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                                <AlertTriangle size={32} />
                            </div>

                            <h3 className="text-2xl font-display font-black text-white italic uppercase tracking-tighter mb-4">
                                Confirmation <span className="text-red-500 italic">Critique</span>
                            </h3>

                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-4">Protocol de Suppression</p>

                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 border-dashed mb-10 w-full">
                                <p className="text-xs font-bold text-white/60 leading-relaxed uppercase tracking-widest">{message}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full">
                                <button
                                    onClick={onClose}
                                    className="py-5 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className="py-5 rounded-2xl bg-red-500 text-white shadow-2xl shadow-red-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
