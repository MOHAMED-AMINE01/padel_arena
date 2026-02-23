import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Tag, ArrowUpRight, Share2 } from 'lucide-react';

const news = [
    {
        id: 1,
        title: "VENDÔME OPEN 2026 : LES INSCRIPTIONS SONT OUVERTES",
        category: "COMPÉTITION",
        date: "23 FÉB 2026",
        image: "/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-33226057.jpg",
        desc: "Le tournoi le plus prestigieux de la région revient en Mars. Préparez-vous à affronter l'élite.",
        featured: true
    },
    {
        id: 2,
        title: "SOIRÉE DJ & TAPAS : CE VENDREDI AU CLUB HOUSE",
        category: "ÉVÉNEMENT",
        date: "21 FÉB 2026",
        image: "/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-34285600.jpg",
        desc: "Venez fêter la fin de semaine avec nos DJ sets et une sélection de tapas artisanales.",
        featured: false
    },
    {
        id: 3,
        title: "3 CONSEILS POUR AMÉLIORER VOTRE BANDEJA",
        category: "BLOG TECHNIQUE",
        date: "19 FÉB 2026",
        image: "/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-33226056.jpg",
        desc: "Nos experts partagent les secrets d'un coup de defense devenu une arme d'attaque redoutable.",
        featured: false
    },
    {
        id: 4,
        title: "NOUVELLES RAQUETTES BULLPADEL EN TEST",
        category: "ÉQUIPEMENT",
        date: "15 FÉB 2026",
        image: "/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-32897038.jpg",
        desc: "Venez tester gratuitement la nouvelle gamme Vertex et Hack dans notre Pro-Shop.",
        featured: false
    }
];

export const NewsGrid = () => {
    return (
        <section id="news" className="py-24 md:py-48 px-6 bg-[#050505] relative overflow-hidden">
            {/* Structural Lines */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-white opacity-[0.02] z-0" />

            <div className="max-w-[1400px] mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 md:mb-32">
                    <div className="max-w-2xl text-center md:text-left">
                        <div className="inline-flex items-center gap-4 mb-8">
                            <div className="w-12 h-[1px] bg-padel-yellow" />
                            <span className="text-[10px] font-black tracking-[0.4em] text-padel-yellow uppercase">LATEST STORIES</span>
                        </div>
                        <h2 className="text-4xl md:text-7xl font-display font-black tracking-tighter leading-[0.9] uppercase">
                            TOUTE LA VIE <br />
                            <span className="text-white italic">DU CLUB LIVE</span>
                        </h2>
                    </div>

                    <div className="flex gap-4 justify-center md:justify-end">
                        {["TOUT", "ACTUS", "TOURNOIS", "BLOG"].map((cat) => (
                            <button
                                key={cat}
                                className="px-6 py-2 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest hover:border-padel-blue hover:text-padel-blue transition-all"
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
                    {news.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            className={item.featured
                                ? "lg:col-span-12 xl:col-span-8 group cursor-pointer"
                                : "lg:col-span-6 xl:col-span-4 group cursor-pointer"}
                        >
                            <div className="relative aspect-video xl:aspect-auto xl:h-[500px] overflow-hidden rounded-[3rem] mb-10 shadow-2xl">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                                <div className="absolute top-10 left-10 flex gap-4">
                                    <div className="px-6 py-2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full">
                                        <span className="text-[9px] font-black text-white uppercase tracking-widest">{item.category}</span>
                                    </div>
                                </div>

                                <div className="absolute bottom-10 right-10">
                                    <div className="w-16 h-16 rounded-full bg-padel-blue flex items-center justify-center text-white scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-2xl">
                                        <ArrowUpRight size={24} />
                                    </div>
                                </div>
                            </div>

                            <div className="px-6">
                                <div className="flex items-center gap-6 mb-4 text-[10px] font-black text-white/20 uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={12} className="text-padel-blue" />
                                        {item.date}
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-white/10" />
                                    <div className="flex items-center gap-2 group/share">
                                        <Share2 size={12} className="group-hover/share:text-white transition-colors" />
                                        PARTAGER
                                    </div>
                                </div>
                                <h3 className={item.featured
                                    ? "text-3xl md:text-5xl font-display font-black tracking-tight leading-none mb-6 group-hover:text-padel-blue transition-colors uppercase"
                                    : "text-2xl md:text-3xl font-display font-black tracking-tight leading-none mb-6 group-hover:text-padel-blue transition-colors uppercase"
                                }>
                                    {item.title}
                                </h3>
                                <p className="text-sm md:text-base text-white/35 font-medium leading-relaxed max-w-2xl line-clamp-2">
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 md:mt-32 text-center">
                    <button className="px-12 py-6 border border-white/10 rounded-full group hover:border-padel-blue transition-all duration-500 relative overflow-hidden">
                        <span className="relative z-10 text-[11px] font-black text-white uppercase tracking-[0.4em]">Charger plus d'actus</span>
                        <div className="absolute inset-0 bg-padel-blue translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </button>
                </div>
            </div>
        </section>
    );
};
