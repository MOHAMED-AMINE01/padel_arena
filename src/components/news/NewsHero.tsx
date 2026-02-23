import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Newspaper, Bell, TrendingUp } from 'lucide-react';

export const NewsHero = () => {
    return (
        <section id="hero" className="relative h-auto min-h-[75vh] md:h-[75vh] w-full overflow-hidden flex items-center justify-center bg-[#050505] pt-32 pb-20 md:pt-0 md:pb-0 px-6">
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
                    className="w-full h-full object-cover opacity-60 scale-105"
                >
                    <source src="/VIDEOS/Vidéo-3.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/60" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] opacity-40" />
            </div>

            <div className="max-w-[1400px] mx-auto w-full relative z-20">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-8 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-3 mb-6">
                                <div className="w-10 h-[1px] bg-padel-blue" />
                                <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase leading-none">L'ACTUALITÉ DU CLUB</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-7xl xl:text-8xl font-display font-black tracking-tighter leading-[0.85] uppercase mb-8">
                                NEWS <br />
                                <span className="text-padel-yellow italic">& BLOG</span>
                            </h1>

                            <p className="text-base md:text-lg text-white/40 font-medium max-w-lg mb-12 leading-relaxed mx-auto md:mx-0">
                                Restez connecté à l'écosystème Padel Arena. Événements, résultats de tournois et conseils d'experts.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center md:items-start gap-8 justify-center md:justify-start">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full sm:w-auto group relative px-8 py-4 bg-padel-blue text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] overflow-hidden shadow-xl transition-all"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        DÉCOUVRIR
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </motion.button>

                                <div className="flex items-center gap-5">
                                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-padel-yellow bg-white/5 backdrop-blur-md">
                                        <Bell size={16} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[9px] font-black text-white uppercase tracking-widest leading-none mb-1">NOTIFICATIONS LIVE</p>
                                        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none">DIRECT SUR VOTRE APP</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="hidden lg:flex lg:col-span-4 justify-end">
                        <motion.div
                            initial={{ opacity: 0, rotate: 10, scale: 0.8 }}
                            animate={{ opacity: 1, rotate: -5, scale: 1 }}
                            transition={{ delay: 0.4, duration: 1 }}
                            className="w-48 h-48 rounded-full border border-white/10 flex flex-col items-center justify-center text-center p-8 backdrop-blur-xl bg-white/5 relative group cursor-default"
                        >
                            <TrendingUp size={32} className="text-padel-blue mb-4 transition-transform group-hover:scale-110" />
                            <p className="text-[9px] font-black tracking-[0.2em] uppercase text-white leading-tight">
                                TENDANCES <br /> PADEL 2026
                            </p>
                            <div className="absolute inset-0 border-2 border-dashed border-padel-blue/20 rounded-full animate-[spin_20s_linear_infinite]" />
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-10 right-10 text-[10rem] font-display font-black text-white/[0.02] tracking-tighter select-none pointer-events-none -z-10 leading-none">
                PRESS
            </div>
        </section>
    );
};
