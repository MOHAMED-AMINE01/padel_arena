import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BadgeEuro, Ticket, Wallet } from 'lucide-react';

export const PricingHero = () => {
    return (
        <section id="hero" className="relative h-auto min-h-[75vh] md:h-[85vh] w-full overflow-hidden flex items-center justify-center bg-[#050505] pt-32 pb-20 md:pt-30 md:pb-0 px-6">
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
                                <div className="w-10 h-[1px] bg-padel-yellow" />
                                <span className="text-[10px] font-black tracking-[0.4em] text-padel-yellow uppercase leading-none">OFFRES & TARIFS</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-7xl xl:text-9xl font-display font-black tracking-tighter leading-[0.85] uppercase mb-10">
                                CHOISISSEZ <br />
                                <span className="text-padel-blue italic">VOTRE AVANTAGE</span>
                            </h1>

                            <p className="text-base md:text-lg text-white/40 font-medium max-w-lg mb-12 leading-relaxed mx-auto md:mx-0">
                                Des formules flexibles adaptées à tous les styles de jeu. De la réservation ponctuelle à l'abonnement élite, trouvez l'offre qui vous correspond.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center md:items-start gap-8 justify-center md:justify-start">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full sm:w-auto group relative px-10 py-5 bg-padel-blue text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] overflow-hidden shadow-2xl transition-all"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        VOIR LES TARIFS
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-padel-yellow translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                </motion.button>

                                <div className="flex gap-10">
                                    <div className="flex flex-col items-center md:items-start gap-2">
                                        <p className="text-2xl font-display font-black text-white">0€</p>
                                        <p className="text-[9px] font-black tracking-widest text-padel-blue uppercase">Frais d'adhésion</p>
                                    </div>
                                    <div className="flex flex-col items-center md:items-start gap-2">
                                        <p className="text-2xl font-display font-black text-white">-20%</p>
                                        <p className="text-[9px] font-black tracking-widest text-padel-blue uppercase">Heures creuses</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="hidden lg:flex lg:col-span-4 justify-end">
                        <motion.div
                            initial={{ opacity: 0, rotate: 15, scale: 0.8 }}
                            animate={{ opacity: 1, rotate: 0, scale: 1 }}
                            transition={{ delay: 0.4, duration: 1 }}
                            className="relative"
                        >
                            {/* Decorative floating badges */}
                            <div className="absolute -top-12 -left-12 w-24 h-24 rounded-3xl bg-padel-blue text-white flex items-center justify-center shadow-2xl rotate-12 animate-pulse">
                                <BadgeEuro size={32} />
                            </div>
                            <div className="absolute -bottom-10 -right-8 w-20 h-20 rounded-full bg-padel-yellow text-padel-blue flex items-center justify-center shadow-2xl -rotate-12">
                                <Ticket size={28} />
                            </div>

                            <div className="w-64 h-80 rounded-[4rem] border border-white/10 glass p-10 flex flex-col justify-between backdrop-blur-3xl shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                                <div className="space-y-4">
                                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Digital Wallet</p>
                                    <p className="text-2xl font-display font-black text-white leading-tight uppercase">SYSTÈME DE <br /> <span className="text-padel-yellow">CRÉDITS</span></p>
                                </div>
                                <div className="space-y-6">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                                        <Wallet size={24} className="text-padel-blue" />
                                    </div>
                                    <p className="text-xs text-white/30 font-medium leading-relaxed uppercase tracking-tighter">
                                        Rechargez votre compte et bénéficiez de bonus allant jusqu'à +25%.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-10 left-10 text-[12rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-10 leading-none">
                PRICING
            </div>
        </section>
    );
};
