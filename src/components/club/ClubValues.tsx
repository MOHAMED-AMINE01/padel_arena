import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Shield, Trophy, Users, Globe } from 'lucide-react';
import { cn } from '../../lib/utils';

const values = [
  { title: "CONVIVIALITÉ", desc: "Le club est avant tout un lieu de vie et d'échanges.", icon: <Users size={20} /> },
  { title: "EXCELLENCE", desc: "Nous visons l'exceptionnel dans chaque détail de nos services.", icon: <Trophy size={20} /> },
  { title: "RESPECT", desc: "Fair-play et respect mutuel sont les piliers de notre arène.", icon: <Shield size={20} /> },
  { title: "PASSION", desc: "Le moteur de tout ce que nous entreprenons chaque jour.", icon: <Heart size={20} /> },
  { title: "OUVERTURE", desc: "Un club accessible à tous, sans distinction de niveau.", icon: <Globe size={20} /> },
];

export const ClubValues = () => {
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
    <section id="valeurs" className="relative py-24 md:py-48 px-6 bg-[#050505] overflow-hidden border-t border-white/[0.03]">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-12 md:gap-16 mb-20 md:mb-32 text-center lg:text-left">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-4 mb-8">
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-yellow uppercase">L'ESPRIT ARENA</span>
            </div>
            <h3 className="text-4xl sm:text-5xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase">
              L'ADN DE <br />
              <span className="text-padel-blue italic">NOTRE COMMUNAUTÉ</span>
            </h3>
          </div>
          <div className="lg:w-1/3">
            <p className="text-base md:text-lg text-white/30 font-medium leading-relaxed italic">
              "Nous ne construisons pas seulement des terrains, nous créons un standard d'excellence sportive et humaine."
            </p>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex lg:grid lg:grid-cols-5 gap-8 lg:gap-8 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory no-scrollbar pb-10 lg:pb-0"
          >
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="min-w-[70vw] sm:min-w-[300px] lg:min-w-0 snap-center relative group text-center lg:text-left"
              >
                <div className="mb-8 md:mb-10 relative inline-block lg:block">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20 group-hover:bg-padel-blue group-hover:text-white group-hover:border-padel-blue transition-all duration-700">
                    {value.icon}
                  </div>
                  <div className="absolute -bottom-2 -right-2 text-[10px] font-black text-white/5 uppercase tracking-widest group-hover:text-padel-blue/20 transition-colors">
                    0{i + 1}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg md:text-xl font-display font-black text-white group-hover:text-padel-yellow transition-colors duration-500">
                    {value.title}
                  </h4>
                  <div className="w-10 h-[1px] bg-white/10 group-hover:w-20 group-hover:bg-padel-blue transition-all duration-700 mx-auto lg:mx-0" />
                  <p className="text-xs md:text-sm text-white/30 font-medium leading-relaxed group-hover:text-white/50 transition-colors duration-500 max-w-[200px] mx-auto lg:mx-0">
                    {value.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination Indicators */}
          <div className="flex lg:hidden justify-center items-center gap-3 mt-4">
            {values.map((_, i) => (
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
