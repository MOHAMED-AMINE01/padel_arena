import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { NewsHero } from '../components/news/NewsHero';
import { NewsGrid } from '../components/news/NewsGrid';

export const NewsPage = () => {
    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const element = document.getElementById(hash.replace('#', ''));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [hash]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="overflow-x-hidden"
        >
            <NewsHero />
            <NewsGrid />

            {/* Newsletter Section */}
            <section className="py-24 md:py-24 px-6 bg-[#0a0a0a] border-t border-white/[0.03] overflow-hidden relative">
                <div className="max-w-[1400px] mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-4 mb-8">
                        <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">KEEP IN TOUCH</span>
                    </div>
                    <h2 className="text-4xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase mb-12">
                        NE MANQUEZ <br />
                        <span className="text-white italic">AUCUNE BALLE</span>
                    </h2>
                    <p className="text-base md:text-xl text-white/30 font-medium max-w-xl mx-auto mb-16 leading-relaxed">
                        Inscrivez-vous à notre newsletter pour recevoir en avant-première nos annonces de tournois et offres exclusives.
                    </p>

                    <form
                        className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            alert('Merci pour votre inscription !');
                        }}
                    >
                        <input
                            type="email"
                            placeholder="VOTRE EMAIL"
                            required
                            className="flex-1 bg-white/5 border border-white/10 rounded-full px-8 py-5 text-[11px] font-black text-white tracking-[0.2em] focus:outline-none focus:border-padel-blue transition-colors placeholder:text-white/20 uppercase"
                        />
                        <button
                            type="submit"
                            className="px-12 py-5 bg-padel-blue text-white rounded-full font-black text-[11px] uppercase tracking-[0.3em] shadow-xl hover:bg-padel-yellow hover:text-padel-blue transition-all duration-500"
                        >
                            S'ABONNER
                        </button>
                    </form>
                </div>

                {/* Decor text */}
                <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-0 rotate-90 leading-none">
                    JOIN US
                </div>
            </section>
        </motion.div>
    );
};
