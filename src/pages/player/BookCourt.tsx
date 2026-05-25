import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
    Sparkles,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function PlayerBook() {
    const [countdown, setCountdown] = useState(3);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    window.location.href = "https://padelarenavendome.villagepadel.fr";
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl bg-[#151518]/60 border border-white/5 p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] backdrop-blur-xl shadow-2xl relative overflow-hidden"
            >
                {/* Glow Effect */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-padel-blue/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-padel-blue/10 rounded-2xl sm:rounded-3xl flex items-center justify-center text-padel-blue mx-auto mb-6 sm:mb-8 border border-padel-blue/20">
                    <Sparkles size={32} className="animate-pulse sm:w-10 sm:h-10" />
                </div>

                <h1 className="text-2xl sm:text-4xl font-display font-black text-white italic uppercase tracking-tighter mb-4 leading-none text-center">
                    NOUVEAU PORTAIL DE RÉSERVATION
                </h1>
                
                <p className="text-sm sm:text-base text-white/60 font-black uppercase tracking-widest mb-6 sm:mb-8 leading-relaxed max-w-md mx-auto italic text-center">
                    Toutes nos activités <span className="text-padel-blue">Padel</span>, <span className="text-padel-blue">Badminton</span>, <span className="text-padel-blue">Pickleball</span> et <span className="text-padel-blue">Golf</span> sont maintenant centralisées sur notre nouvel espace.
                </p>

                <div className="space-y-6">
                    <a 
                        href="https://padelarenavendome.villagepadel.fr"
                        className="group relative inline-flex items-center gap-4 px-8 sm:px-10 py-4 sm:py-5 bg-white text-padel-blue rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-all hover:scale-105 shadow-xl shadow-padel-blue/20"
                    >
                        Accéder à l'espace de réservation
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>

                    <div className="flex items-center justify-center gap-3 text-white/20">
                        <Loader2 className="animate-spin" size={16} />
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]">
                            Redirection automatique dans <span className="text-white/60 font-display italic text-xs sm:text-sm">{countdown}s</span>
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Support Message */}
            <p className="mt-12 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">
                Besoin d'aide ? Contactez l'accueil du club
            </p>
        </div>
    );
}
