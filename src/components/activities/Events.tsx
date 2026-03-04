import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Music, PartyPopper, Trophy, GlassWater, Cake, Users, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const eventTypes = [
  { title: "SOIRÉES PADEL", icon: <PartyPopper size={28} />, desc: "Des soirées thématiques pour mixer sport et plaisir." }, // notranslate applied in JSX
  { title: "EXHIBITION MATCHS", icon: <Trophy size={28} />, desc: "Admirez les meilleurs joueurs lors de matchs d'exception." },
  { title: "DJ NIGHTS", icon: <Music size={28} />, desc: "Vibrez avec nos DJ sets exclusifs au club house." },
  { title: "AFTER MATCH", icon: <GlassWater size={28} />, desc: "Détendez-vous avec nos offres bar & tapas artisanales." },
  { title: "ANNIVERSAIRES", icon: <Cake size={28} />, desc: "Fêtez votre anniversaire sur les terrains en mode VIP." },
  { title: "TEAM BUILDING", icon: <Users size={28} />, desc: "Renforcez la cohésion de vos équipes par le padel." }, // notranslate in JSX
];

export const Events = () => {
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
    <section id="evenements" className="relative py-24 md:py-16 px-6 bg-[#050505] overflow-hidden border-t border-white/[0.03]">
      {/* Structural Lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-white opacity-[0.02] z-0" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
          <div className="max-w-3xl text-center lg:text-left">
            <div className="inline-flex items-center gap-4 mb-8">
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-yellow uppercase">LIFESTYLE & EVENTS</span>
            </div>
            <h3 className="text-4xl sm:text-5xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase">
              BIEN PLUS QU'UN <br />
              <span className="text-padel-blue italic">CLUB DE SPORT</span>
            </h3>
          </div>
        </div>

        {/* Events Carousel for Mobile */}
        <div className="relative mb-32">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory no-scrollbar pb-10 lg:pb-0"
          >
            {eventTypes.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="min-w-[85vw] sm:min-w-[400px] lg:min-w-0 snap-center group relative glass p-10 md:p-12 rounded-[3rem] border-white/5 hover:border-padel-blue/30 transition-all duration-700"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-padel-blue mb-10 group-hover:bg-padel-blue group-hover:text-white transition-all duration-500">
                  {event.icon}
                </div>
                <h4 className="text-2xl font-display font-black mb-6 group-hover:text-padel-blue transition-colors uppercase leading-none">{event.title}</h4>
                <p className="text-sm md:text-base text-white/30 font-medium leading-relaxed group-hover:text-white/50 transition-colors">{event.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Pagination Indicators */}
          <div className="flex lg:hidden justify-center items-center gap-3 mt-4">
            {eventTypes.map((_, i) => (
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

        {/* Custom Event CTA */}
        <section className="relative rounded-[4rem] overflow-hidden group shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 z-0">
            <img
              src="/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-34285600.jpg"
              alt="Event Atmosphere"
              className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-[#050505]/60 group-hover:bg-[#050505]/40 transition-colors" />
          </div>

          <div className="relative z-10 py-24 md:py-48 flex flex-col items-center justify-center text-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-4xl"
            >
              <h4 className="text-4xl md:text-7xl font-display font-black mb-12 uppercase tracking-tighter leading-[0.9]">
                ORGANISEZ VOTRE ÉVÉNEMENT <br />
                <span className="text-padel-blue italic">SUR MESURE</span>
              </h4>
              <button className="group relative px-12 py-6 bg-padel-blue text-white rounded-full font-black text-[12px] tracking-[0.4em] uppercase overflow-hidden transition-all shadow-2xl">
                <span className="relative z-10 flex items-center justify-center gap-4">
                  EN SAVOIR PLUS <ArrowUpRight size={20} />
                </span>
                <div className="absolute inset-0 bg-padel-yellow translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Background Decor Text */}
      <div className="absolute bottom-20 -left-10 text-[10rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-10 -rotate-90">
        ATMOSPHERE
      </div>
    </section>
  );
};
