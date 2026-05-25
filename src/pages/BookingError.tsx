import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, Home, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BookingError = () => {
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] bg-red-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-padel-blue/5 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-lg bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] p-10 md:p-14 text-center relative z-10 shadow-2xl"
            >
                <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-lg shadow-red-500/10">
                    <AlertCircle size={48} className="text-red-500" />
                </div>

                <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-4 leading-none">
                    Échec de <br /> <span className="text-red-500">Paiement</span>
                </h1>
                
                <p className="text-white/40 font-bold text-sm uppercase tracking-widest mb-10">
                    Votre transaction n'a pas pu être finalisée.
                </p>

                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-left mb-12">
                    <p className="text-white/60 text-xs font-medium leading-relaxed">
                        Le paiement a été annulé ou refusé par votre banque. Aucun montant n'a été débité de votre compte. 
                        Si le problème persiste, n'hésitez pas à nous contacter.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/" className="flex-1 px-8 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-3 group">
                        <Home size={16} />
                        Accueil
                    </Link>
                    <a 
                        href="https://padelarenavendome.villagepadel.fr" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-8 py-5 rounded-2xl bg-padel-blue text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-padel-blue/20 hover:bg-padel-yellow hover:text-padel-blue transition-all duration-500 flex items-center justify-center gap-3 group"
                    >
                        <RefreshCcw size={16} className="group-hover:rotate-180 transition-transform duration-700" />
                        Réessayer
                    </a>
                </div>
            </motion.div>
        </div>
    );
};