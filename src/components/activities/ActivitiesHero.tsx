import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export const ActivitiesHero = () => {
    const scrollToActivities = () => {
        const element = document.getElementById('coaching');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="hero" className="relative h-auto min-h-[75vh] md:h-[75vh] w-full overflow-hidden flex items-center justify-center bg-[#050505] pt-12 md:pt-40">
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
                    <source src="/VIDEOS/Vidéo-2.mp4" type="video/mp4" />
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
                                <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase leading-none">VIVEZ UNE EXPÉRIENCE</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-7xl xl:text-8xl font-display font-black tracking-tighter leading-[0.85] uppercase mb-8">
                                NOS <br />
                                <span className="text-padel-blue italic">ACTIVITÉS</span>
                            </h1>

                            <p className="text-base md:text-lg text-white/40 font-medium max-w-lg mb-12 leading-relaxed mx-auto md:mx-0">
                                Un complexe multisport pensé pour le plaisir et la convivialité. Entrez dans l'arène Padel Arena.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center md:items-start gap-8 justify-center md:justify-start">
                                <motion.button
                                    onClick={scrollToActivities}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full sm:w-auto group relative px-8 py-4 bg-padel-blue text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] overflow-hidden shadow-xl transition-all"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3 notranslate" translate="no">
                                        EXPLORER
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Background Decor Text */}
            <div className="absolute bottom-10 right-10 text-[10rem] font-display font-black text-white/[0.02] tracking-tighter select-none pointer-events-none -z-10 leading-none">
                PLAY
            </div>
        </section>
    );
};
