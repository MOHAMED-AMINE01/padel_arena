import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, Trophy, Users, Heart, Building2, ArrowUpRight, Plus, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';

interface IPack {
  _id: string;
  title: string;
  price: string;
  description: string;
  icon?: string;
  color?: string;
  bg?: string;
}

const IconMap: Record<string, React.ReactNode> = {
  Target: <Target size={24} />,
  Trophy: <Trophy size={24} />,
  Heart: <Heart size={24} />,
  Users: <Users size={24} />,
  Building2: <Building2 size={24} />
};

const ColorMap: Record<string, string> = {
  Target: "text-emerald-500",
  Trophy: "text-padel-blue",
  Heart: "text-pink-500",
  Users: "text-orange-500",
  Building2: "text-purple-500"
};

const BgMap: Record<string, string> = {
  Target: "bg-emerald-500/5",
  Trophy: "bg-padel-blue/5",
  Heart: "bg-pink-500/5",
  Users: "bg-orange-500/5",
  Building2: "bg-purple-500/5"
};

export const PacksAndFormulas = () => {
  const [packs, setPacks] = useState<IPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const res = await api.get('/pricing?type=pack');
        if (res.data.success) setPacks(res.data.data);
      } catch (err) {
        console.error('Failed to fetch packs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPacks();
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, offsetWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / offsetWidth);
      setActiveIndex(index);
    }
  };

  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * scrollRef.current.offsetWidth,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center bg-[#050505]">
        <Loader2 className="w-8 h-8 animate-spin text-padel-blue" />
      </div>
    );
  }

  if (packs.length === 0) return null;

  return (
    <section id="packs" className="relative py-24 md:py-48 px-6 bg-[#050505] overflow-hidden border-t border-white/[0.03]">
      {/* Decorative text background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] md:text-[25rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-0 leading-none uppercase">
        SPECIALS
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-12 mb-20 md:mb-32 text-center md:text-left">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-4 mb-8">
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">PACKS & FORMULES</span>
            </div>
            <h3 className="text-4xl sm:text-5xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase">
              VIVEZ L'EXPÉRIENCE <br />
              <span className="text-white italic">SUR MESURE</span>
            </h3>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 rounded-full border border-padel-blue/20 flex items-center justify-center text-padel-blue animate-spin-slow">
              <Sparkles size={32} />
            </div>
          </div>
        </div>

        {/* Horizontal Carousel for all screens with better grid on desktop */}
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-10 lg:pb-12"
          >
            {packs.map((pack, i) => {
              const iconKey = pack.icon || 'Target';
              const colorClass = ColorMap[iconKey] || "text-padel-blue";
              const bgClass = BgMap[iconKey] || "bg-padel-blue/5";

              return (
                <motion.div
                  key={pack._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="min-w-[85vw] sm:min-w-[350px] md:min-w-[450px] snap-center group relative glass p-10 md:p-14 rounded-[4rem] border-white/5 hover:border-padel-blue/20 transition-all duration-700 flex flex-col h-[600px] overflow-hidden"
                >
                  {/* Visual accent */}
                  <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000", bgClass)} />

                  <div className="flex justify-between items-start mb-14">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500", bgClass, colorClass)}>
                      {IconMap[iconKey] || <Target size={24} />}
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">PRIX PACK</p>
                      <div className="text-3xl md:text-5xl font-display font-black text-white group-hover:text-padel-blue transition-colors">
                        {pack.price}<span className="text-xs italic ml-1 font-light opacity-50">{!pack.price.includes('€') && pack.price !== 'DEVIS' && '€'}</span>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tight mb-8 group-hover:text-padel-blue transition-colors leading-tight">
                    {pack.title}
                  </h4>

                  <p className="text-sm md:text-base text-white/30 font-medium leading-relaxed mb-12 flex-grow">
                    {pack.description}
                  </p>

                  <ul className="space-y-4 mb-14">
                    {["Avantage immédiat", "Session incluse", "Accès prioritaire"].map((inc, j) => (
                      <li key={j} className="flex items-center gap-3">
                        <Plus size={12} className="text-padel-blue" />
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{inc}</span>
                      </li>
                    ))}
                  </ul>

                  <button className="w-full py-5 glass border border-white/10 text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-padel-blue hover:border-padel-blue transition-all flex items-center justify-center gap-4 group/btn">
                    DÉCOUVRIR L'OFFRE
                    <ArrowUpRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-3 mt-8">
            {packs.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={cn(
                  "h-1.5 transition-all duration-500 rounded-full",
                  activeIndex === i ? "w-8 bg-padel-blue" : "w-1.5 bg-white/10"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
