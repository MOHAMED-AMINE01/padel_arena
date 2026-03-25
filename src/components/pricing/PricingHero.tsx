import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BadgeEuro, Ticket, Wallet } from 'lucide-react';

export const PricingHero = () => {
    return (
        <section id="hero" className="relative h-auto min-h-[75vh] md:h-[100vh] w-full overflow-hidden flex items-center justify-center bg-[#050505] pt-12 md:pt-14">
            {/* Editorial Grid Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-10">
                <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
                    <div className="w-[1px] h-full bg-white ml-[25%]" />
                    <div className="w-[1px] h-full bg-white" />
                    <div className="w-[1px] h-full bg-white mr-[25%]" />
                </div>
            </div>

            {/* Cinematic Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-105"
                >
                    <source src="/VIDEOS/Vidéo-non-prioritaire.MOV" type="video/quicktime" />
                    {/* Fallback for different browsers if needed, though most modern browsers support .MOV */}
                    <source src="/VIDEOS/Vidéo-non-prioritaire.MOV" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/60" />
                <div className="absolute inset-0 bg-[#050505]/40 backdrop-blur-[0px]" />
            </div>

            <div className="max-w-[1400px] mx-auto w-full relative z-20">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-8 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-3 mb-8">
                                <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase leading-none">OFFRES & TARIFS</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-7xl xl:text-9xl font-display font-black tracking-tighter leading-[0.85] uppercase mb-10">
                                VOTRE ACCÈS <br />
                                <span className="text-padel-blue italic">AU CLUB</span>
                            </h1>

                            <p className="text-base md:text-lg text-white/40 font-medium max-w-lg mb-12 leading-relaxed mx-auto md:mx-0">
                                Des formules simples pour chaque usage. De la session libre aux forfaits réguliers, choisissez le format qui convient à votre rythme de jeu.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center md:items-start gap-8 justify-center md:justify-start">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        const el = document.getElementById('terrains');
                                        if (el) {
                                            el.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                    className="w-full sm:w-auto group relative px-10 py-5 bg-padel-blue text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] overflow-hidden shadow-2xl transition-all cursor-pointer"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        voir nos tarifs
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-padel-yellow translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                </motion.button>

                                {/* Optional: You can put something else here or leave it empty so only the button remains */}
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>

            <div className="absolute bottom-10 left-10 text-[12rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-10 leading-none">
                TARIFS
            </div>
        </section>
    );
};
