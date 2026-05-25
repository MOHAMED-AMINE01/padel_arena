import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Calendar, MapPin, Clock, Home, ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../lib/api';

export const BookingSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [loading, setLoading] = useState(!!sessionId);
    const [bookingDetails, setBookingDetails] = useState<any>(null);

    useEffect(() => {
        if (sessionId) {
            // Optional: fetch booking status from backend once to show details
            const fetchConfirm = async () => {
                try {
                    // This is just to show UI if we want to confirm, 
                    // the webhook handles the real logic.
                    // But maybe we have an endpoint that looks up by session
                    // For now, let's just show a generic success
                    setLoading(false);
                } catch (e) {
                    setLoading(false);
                }
            };
            fetchConfirm();
        }
    }, [sessionId]);

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] bg-padel-blue/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-padel-yellow/5 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-lg bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] p-10 md:p-14 text-center relative z-10 shadow-2xl"
            >
                <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-lg shadow-green-500/10">
                    <CheckCircle2 size={48} className="text-green-500" />
                </div>

                <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-4 leading-none">
                    Réservation <br /> <span className="text-padel-blue">Confirmée !</span>
                </h1>
                
                <p className="text-white/40 font-bold text-sm uppercase tracking-widest mb-10">
                    Vérifiez votre boîte mail pour les détails.
                </p>

                <div className="space-y-4 mb-12">
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-4 text-left">
                        <div className="flex items-center gap-4 text-white/60">
                            <Calendar size={20} className="text-padel-blue" />
                            <span className="text-xs font-black uppercase tracking-widest">Date confirmée</span>
                        </div>
                        <div className="flex items-center gap-4 text-white/60">
                            <Clock size={20} className="text-padel-blue" />
                            <span className="text-xs font-black uppercase tracking-widest">Session validée</span>
                        </div>
                        <div className="flex items-center gap-4 text-white/60">
                            <CheckCircle2 size={20} className="text-green-500" />
                            <span className="text-xs font-black uppercase tracking-widest text-green-500">Paiement reçu</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/" className="flex-1 px-8 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-3 group">
                        <Home size={16} />
                        Retour Accueil
                    </Link>
                    <a 
                        href="https://padelarenavendome.villagepadel.fr" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-8 py-5 rounded-2xl bg-padel-blue text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-padel-blue/20 hover:bg-padel-yellow hover:text-padel-blue transition-all duration-500 flex items-center justify-center gap-3 group"
                    >
                        Réserver à nouveau
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </motion.div>
        </div>
    );
};
