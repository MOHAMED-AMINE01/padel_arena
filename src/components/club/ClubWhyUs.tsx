import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Shield, Coffee, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const reasons = [
  {
    title: "1 600 M² DE COMPLEXE",
    desc: "Un espace indoor moderne dimensionné pour le confort et le partage.",
    icon: <LayoutGrid size={24} />,
    color: "group-hover:text-padel-blue"
  },
  {
    title: "3 TERRAINS DE PADEL",
    desc: "Des infrastructures de qualité accessibles à tous les niveaux de jeu.",
    icon: <Shield size={24} />,
    color: "group-hover:text-padel-yellow"
  },
  {
    title: "RÉSERVATION RAPIDE",
    desc: "Un système en ligne pour bloquer votre terrain en quelques secondes.",
    icon: <Zap size={24} />,
    color: "group-hover:text-padel-blue"
  },
  {
    title: "CLUB-HOUSE & BAR",
    desc: "Un espace central convivial conçu pour prolonger l'instant après le match.",
    icon: <Coffee size={24} />,
    color: "group-hover:text-padel-yellow"
  },
  {
    title: "SERVICES & PARKING",
    desc: "Stationnement privé sous vidéo-surveillance et prêt de matériel sur place.",
    icon: <CheckCircle2 size={24} />,
    color: "group-hover:text-padel-blue"
  }
];

export const ClubWhyUs = () => {
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
    <section id="why-us" className="relative py-24 md:py-48 px-6 bg-[#050505]">
      {/* Structural Lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-white opacity-[0.03] z-0" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
          <div className="max-w-3xl text-center lg:text-left">
            <div className="inline-flex items-center gap-4 mb-8">
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-yellow uppercase">POURQUOI NOUS CHOISIR ?</span>
            </div>
            <h3 className="text-4xl sm:text-5xl md:text-8xl font-display font-black tracking-tighter leading-[0.9]">
              L'expérience Padel
              <span className="text-padel-blue italic"> Arena</span>
            </h3>
          </div>

          
        </div>

        {/* Horizontal Scroll for Mobile/Tablet */}
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex lg:grid lg:grid-cols-5 gap-4 lg:gap-6 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory no-scrollbar pb-10 lg:pb-0"
          >
            {reasons.map((reason, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="min-w-[85vw] sm:min-w-[400px] lg:min-w-0 snap-center group relative h-[380px] md:h-[420px] glass p-8 md:p-10 rounded-[2.5rem] border-white/5 hover:border-white/20 transition-all duration-700 flex flex-col justify-between overflow-hidden"
              >
                {/* Card Background Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-padel-blue/5 blur-[60px] rounded-full group-hover:bg-padel-blue/20 transition-all duration-700" />

                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-10 transition-all duration-500 ${reason.color}`}>
                    {reason.icon}
                  </div>
                  <h4 className="text-xl font-display font-black leading-tight mb-4 group-hover:text-padel-blue transition-colors duration-500">
                    {reason.title}
                  </h4>
                  <p className="text-xs md:text-sm text-white/30 font-medium leading-relaxed group-hover:text-white/50 transition-colors duration-500">
                    {reason.desc}
                  </p>
                </div>

                <div className="relative z-10 flex items-center justify-between mt-auto">
                  <span className="text-[10px] font-black text-white/10 uppercase tracking-widest group-hover:text-padel-blue/40 transition-colors">
                    0{i + 1}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                    <CheckCircle2 size={14} className="text-padel-blue" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination Indicators */}
          <div className="flex lg:hidden justify-center items-center gap-3 mt-4">
            {reasons.map((_, i) => (
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
