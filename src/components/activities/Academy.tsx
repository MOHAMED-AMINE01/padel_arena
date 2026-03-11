import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Timer, TrendingUp, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

const sections = [
  {
    title: "ACADÉMIE JUNIOR",
    subtitle: "LES CHAMPIONS DE DEMAIN",
    desc: "Un programme pédagogique complet pour les 6-18 ans, axé sur la discipline, le fair-play et l'excellence technique.",
    items: ["Enfants 6-12 ans", "Adolescents 13-18 ans", "Coaching tactique", "Esprit Arena"],
    image: "/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-33226056.jpg",
    icon: <GraduationCap size={24} className="text-padel-blue" />
  },
  {
    title: "STAGES INTENSIFS",
    subtitle: "FORGEZ VOTRE NIVEAU",
    desc: "Des sessions condensées durant les vacances pour transformer votre jeu sous l'œil de nos experts.",
    items: ["Vacances scolaires", "Préparation tournois", "Sessions Elites", "Analyse vidéo"],
    image: "/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-33226057.jpg",
    icon: <TrendingUp size={24} className="text-padel-blue" />
  }
];

export const Academy = () => {
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
    <section id="academy" className="relative py-24 md:py-48 px-6 bg-[#050505] overflow-hidden border-t border-white/[0.03]">
      {/* Editorial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[25%]" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white mr-[25%]" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-24">
          <div className="max-w-3xl text-center md:text-left">
            <div className="inline-flex items-center gap-4 mb-8">
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">FORMATION D'ÉLITE</span>
            </div>
            <h3 className="text-4xl sm:text-5xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase">
              L'ACADÉMIE <br />
              <span className="text-white italic">DES CHAMPIONS</span>
            </h3>
          </div>
        </div>

        {/* Academy Sections (Staggered or Carousel) */}
        <div className="relative mb-32">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex lg:grid lg:grid-cols-2 gap-8 lg:gap-16 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory no-scrollbar pb-10 lg:pb-0"
          >
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className="min-w-[90vw] sm:min-w-[500px] lg:min-w-0 snap-center group relative lg:even:translate-y-24"
              >
                <div className="relative aspect-[16/10] rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl mb-10">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 grayscale-[40%] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                  <div className="absolute top-10 left-10 w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-3xl flex items-center justify-center border border-white/10 group-hover:bg-padel-blue group-hover:border-padel-blue transition-all duration-500">
                    {section.icon}
                  </div>

                  <div className="absolute bottom-10 left-10">
                    <p className="text-[10px] font-black text-padel-yellow uppercase tracking-[0.4em] mb-2">{section.subtitle}</p>
                    <h4 className="text-3xl md:text-4xl font-display font-black text-white uppercase leading-none">{section.title}</h4>
                  </div>
                </div>

                <div className="px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-12">
                  <div className="space-y-6">
                    {section.items.map((item, j) => (
                      <div key={j} className="flex items-center gap-4 group/item">
                        <div className="w-1.5 h-1.5 rounded-full bg-padel-blue group-hover/item:scale-150 transition-transform" />
                        <span className="text-sm md:text-base font-medium text-white/40 group-hover/item:text-white/70 transition-colors uppercase tracking-tight">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-end">
                    <Link to="/contact" className="w-full">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-4 hover:bg-padel-blue hover:border-padel-blue group/btn"
                      >
                        S'INSCRIRE
                        <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination for Mobile */}
          <div className="flex lg:hidden justify-center items-center gap-3 mt-4">
            {sections.map((_, i) => (
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

        {/* Technical Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {[
            { title: "PLANNING DYNAMIQUE", icon: <Timer size={24} />, desc: "Consultez et réservez vos créneaux en temps réel sur l'app." },
            { title: "ACCOMPAGNEMENT PRO", icon: <GraduationCap size={24} />, desc: "Un suivi pédagogique sur-mesure pour chaque élève." },
            { title: "PROGRESS TRACKING", icon: <TrendingUp size={24} />, desc: "Visualisez votre évolution via des rapports analytiques." }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="group p-10 glass rounded-[2.5rem] border-white/5 hover:border-padel-blue/20 transition-all text-center lg:text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-padel-blue group-hover:bg-padel-blue group-hover:text-white transition-all mx-auto lg:mx-0 mb-8">
                {item.icon}
              </div>
              <h4 className="text-[11px] font-black text-white tracking-[0.2em] uppercase mb-4">{item.title}</h4>
              <p className="text-sm text-white/20 font-medium leading-relaxed group-hover:text-white/40 transition-colors">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background Decor Text */}
      <div className="absolute top-1/2 -right-40 text-[12rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-10 -rotate-90 leading-none">
        ACADEMY
      </div>
    </section>
  );
};
