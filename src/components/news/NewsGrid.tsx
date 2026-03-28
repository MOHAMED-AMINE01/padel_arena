import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ArrowUpRight, Share2, Loader2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import api from '../../lib/api';

interface INews {
    _id: string;
    title: string;
    category: string;
    date: string;
    image: string;
    description: string;
    featured: boolean;
    link: string;
    content?: string;
}

export const NewsGrid = () => {
    const [news, setNews] = useState<INews[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('TOUT');
    const [selectedNews, setSelectedNews] = useState<INews | null>(null);
    const [modalImageReady, setModalImageReady] = useState(false);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await api.get('/news');
                if (res.data.success) setNews(res.data.data);
            } catch (err) {
                console.error('Failed to fetch news', err);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    const filteredNews = filter === 'TOUT'
        ? news
        : news.filter(item => item.category.toUpperCase().includes(filter) || filter.includes(item.category.toUpperCase()));

    if (loading) {
        return (
            <section className="py-24 flex justify-center bg-[#050505]">
                <Loader2 className="w-8 h-8 animate-spin text-padel-blue" />
            </section>
        );
    }

    if (news.length === 0) return null;

    const categories = ['TOUT', ...new Set(news.map(item => item.category.toUpperCase()))];

    return (
        <section id="news" className="py-24 md:py-24 px-6 bg-[#050505] relative overflow-hidden">
            {/* Structural Lines */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-white opacity-[0.02] z-0" />

            <div className="max-w-[1400px] mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 md:mb-32">
                    <div className="max-w-2xl text-center md:text-left">
                        <div className="inline-flex items-center gap-4 mb-8">
                            <span className="text-[10px] font-black tracking-[0.4em] text-padel-yellow uppercase">DERNIÈRES ACTUALITÉS</span>
                        </div>
                        <h2 className="text-4xl md:text-7xl font-display font-black tracking-tighter leading-[0.9] uppercase">
                            TOUTE LA VIE <br />
                            <span className="text-white italic">DU CLUB</span>
                        </h2>
                    </div>

                    <div className="flex gap-4 justify-center md:justify-end flex-wrap">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={cn(
                                    "px-6 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all",
                                    filter === cat ? "bg-padel-blue border-padel-blue text-white" : "border-white/10 hover:border-padel-blue hover:text-padel-blue"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
                    {filteredNews.map((item, i) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            className={item.featured
                                ? "lg:col-span-12 xl:col-span-8 group cursor-pointer"
                                : "lg:col-span-6 xl:col-span-4 group cursor-pointer"}
                            onClick={() => setSelectedNews(item)}
                        >
                            <div className="block">
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
                                    </div>
                                    <h3 className={item.featured
                                        ? "text-3xl md:text-5xl font-display font-black tracking-tight leading-none mb-6 group-hover:text-padel-blue transition-colors uppercase"
                                        : "text-2xl md:text-3xl font-display font-black tracking-tight leading-none mb-6 group-hover:text-padel-blue transition-colors uppercase"
                                    }>
                                        {item.title}
                                    </h3>
                                    <p className="text-sm md:text-base text-white/35 font-medium leading-relaxed max-w-2xl line-clamp-2">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* News Detail Modal */}
            <AnimatePresence>
                {selectedNews && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedNews(null)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-5xl max-h-[90vh] bg-[#0c0c0e] border border-white/10 rounded-[3rem] overflow-hidden flex flex-col shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
                        >
                            <button 
                                onClick={() => setSelectedNews(null)}
                                className="absolute top-8 right-8 z-20 w-12 h-12 bg-white/5 hover:bg-white/10 hover:text-padel-blue rounded-full border border-white/10 flex items-center justify-center text-white transition-all backdrop-blur-xl"
                            >
                                <X size={20} />
                            </button>

                            <div className="overflow-y-auto custom-scrollbar flex-1">
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={selectedNews.image}
                                        alt={selectedNews.title}
                                        onLoad={() => setModalImageReady(true)}
                                        className={cn(
                                            "w-full h-full object-cover transition-all duration-1000",
                                            modalImageReady ? "scale-100 opacity-100" : "scale-110 opacity-0"
                                        )}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent" />

                                    <div className="absolute bottom-10 left-10 md:left-16 flex items-center gap-6">
                                        <div className="px-6 py-2 bg-padel-blue/20 backdrop-blur-3xl border border-padel-blue/30 rounded-full">
                                            <span className="text-[10px] font-black text-padel-blue uppercase tracking-widest">{selectedNews.category}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest">
                                            <Calendar size={12} className="text-padel-blue" />
                                            {selectedNews.date}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-10 md:p-16 pt-10">
                                    <h2 className="text-3xl md:text-6xl font-display font-black tracking-tighter leading-[0.9] uppercase mb-10">
                                        {selectedNews.title}
                                    </h2>

                                    <div className="prose prose-invert max-w-none">
                                        <div className="space-y-10">
                                            {/* Short Description (Teaser) */}
                                            <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-bold italic border-l-4 border-padel-blue pl-6 py-2">
                                                {selectedNews.description}
                                            </p>

                                            {/* Detailed Content */}
                                            {selectedNews.content && (
                                                <div className="space-y-6 pt-6 border-t border-white/5">
                                                    {selectedNews.content.split('\n').map((paragraph, idx) => (
                                                        paragraph.trim() ? (
                                                            <p key={idx} className="text-lg text-white/40 leading-relaxed font-medium whitespace-pre-wrap">
                                                                {paragraph}
                                                            </p>
                                                        ) : <div key={idx} className="h-4" />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};
