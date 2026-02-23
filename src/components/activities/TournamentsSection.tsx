import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Trophy, Users, ArrowRight, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const tournamentTypes = [
  { title: "TOURNOIS HEBDOMADAIRES", desc: "Chaque weekend, des tournois loisirs pour tous les niveaux.", icon: <Calendar size={24} /> },
  { title: "COMPÉTITIONS MENSUELLES", desc: "Des tournois homologués FFT pour grimper au classement national.", icon: <Trophy size={24} /> },
  { title: "OPENS RÉGIONAUX", desc: "Les grands rendez-vous de la saison avec les meilleurs joueurs.", icon: <Users size={24} /> },
  { title: "TOURNOIS CORPORATE", desc: "Défiez vos collègues et partenaires dans une ambiance pro.", icon: <Trophy size={24} /> },
];

const features = [
  "Inscription & Paiement 100% digital",
  "Génération automatique des tableaux",
  "Notifications de matchs push & SMS",
  "Publication des résultats en temps réel",
  "Tableaux dynamiques via l'application"
];

export const TournamentsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  return (
    <section id="tournois" className="relative py-24 md:py-48 px-6 bg-[#050505] overflow-hidden border-t border-white/[0.03]">
      {/* Editorial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[25%]" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white mr-[25%]" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
          <div className="max-w-3xl text-center lg:text-left">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-padel-yellow" />
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-yellow uppercase">COMPÉTITION</span>
            </div>
            <h3 className="text-4xl sm:text-5xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase">
              L'ESPRIT DE <br />
              <span className="text-padel-blue italic">LA VICTOIRE</span>
            </h3>
          </div>
        </div>

        {/* Tournament Grid with Mobile Scroll */}
        <div className="relative mb-32">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex lg:grid lg:grid-cols-4 gap-6 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory no-scrollbar pb-10 lg:pb-0"
          >
            {tournamentTypes.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="min-w-[85vw] sm:min-w-[320px] lg:min-w-0 snap-center group relative glass p-10 rounded-[2.5rem] border-white/5 hover:border-padel-blue/30 transition-all duration-700"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-padel-blue mb-10 group-hover:bg-padel-blue group-hover:text-white transition-all duration-500">
                  {t.icon}
                </div>
                <h4 className="text-xl font-display font-black mb-4 group-hover:text-padel-blue transition-colors uppercase leading-tight">{t.title}</h4>
                <p className="text-xs md:text-sm text-white/30 font-medium leading-relaxed group-hover:text-white/50 transition-colors">{t.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Pagination Indicators */}
          <div className="flex lg:hidden justify-center items-center gap-3 mt-4">
            {tournamentTypes.map((_, i) => (
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

        {/* Live Score & Management */}
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-12 xl:col-span-7 relative aspect-video rounded-[3rem] md:rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl group"
          >
            <img
              src="/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-33226057.jpg"
              alt="Tournament Live"
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 grayscale-[40%] group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

            <div className="absolute bottom-10 left-10 right-10 p-8 md:p-10 glass rounded-[2rem] border-white/10 backdrop-blur-3xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">LIVE MATCH SCORE</span>
                  </div>
                  <h4 className="text-2xl md:text-3xl font-display font-black text-white uppercase leading-none mb-3">VENDÔME OPEN • FINALE</h4>
                  <p className="text-xl font-display font-black text-padel-blue">6-4 / 5-7 / 2-1</p>
                </div>
                <div className="h-12 w-[1px] bg-white/10 hidden md:block" />
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(p => <div key={p} className="w-12 h-12 rounded-full border-2 border-black bg-white/10 backdrop-blur-md overflow-hidden"><img src={`https://picsum.photos/seed/${p + 20}/100/100`} alt="player" className="w-full h-full object-cover" /></div>)}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-12 xl:col-span-5"
          >
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-padel-yellow" />
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-yellow uppercase">GESTION DIGITALE</span>
            </div>
            <h4 className="text-3xl md:text-5xl font-display font-black text-white uppercase leading-[0.9] mb-10">
              EXPÉRIENCE <br />
              <span className="text-white italic">FULL CONNECTÉE</span>
            </h4>

            <div className="space-y-6 mb-12">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-5 group">
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-padel-blue transition-all duration-500">
                    <CheckCircle2 className="text-padel-blue group-hover:text-white" size={14} />
                  </div>
                  <span className="text-base md:text-lg text-white/40 font-medium group-hover:text-white/70 transition-colors">{f}</span>
                </div>
              ))}
            </div>

            <button className="flex items-center gap-6 py-5 px-10 bg-padel-blue text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] overflow-hidden relative group">
              <span className="relative z-10">DÉCOUVRIR LE CALENDRIER</span>
              <ArrowUpRight size={16} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <div className="absolute inset-0 bg-padel-yellow translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
