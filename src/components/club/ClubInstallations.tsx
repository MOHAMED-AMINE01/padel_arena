import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Target, Waves, Wind, Box } from 'lucide-react';
import { cn } from '../../lib/utils';

const installations = [
  {
    title: "ARENA PANORAMIQUE",
    subtitle: "PERFORMANCE & VISION",
    items: [
      "Gazon WPT certified (bleu monofilament)",
      "Éclairage LED 400 lux anti-éblouissement",
      "Parois vitrées anti-reflet 12mm",
      "Sortie hors-court autorisée (normes FIP)"
    ],
    image: "/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-33226056.jpg",
    icon: <Target className="text-padel-blue" size={24} />
  },
  {
    title: "ESPACES ATHLÈTES",
    subtitle: "RÉCUPÉRATION & CONFORT",
    items: [
      "Vestiaires individuels haut standing",
      "Espace lounge & coffee bar premium",
      "Casiers connectés sécurisés",
      "Zone d'échauffement dynamique"
    ],
    image: "/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-33226057.jpg",
    icon: <Waves className="text-padel-yellow" size={24} />
  }
];

export const ClubInstallations = () => {
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
    <section id="installations" className="relative py-24 md:py-48 px-6 bg-[#050505] overflow-hidden">
      {/* Editorial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[25%]" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white mr-[25%]" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 mb-16 md:mb-24 text-center md:text-left">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-padel-blue" />
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">INFRASTRUCTURES 5 ÉTOILES</span>
            </div>
            <h3 className="text-4xl sm:text-5xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase">
              LE MEILLEUR POUR <br />
              <span className="text-white italic">VOTRE JEU</span>
            </h3>
          </div>
          <div className="hidden lg:block text-right">
            <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">CAPACITÉ D'ACCUEIL</div>
            <p className="text-4xl font-display font-black text-white uppercase">TOP TIER</p>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex lg:grid lg:grid-cols-2 gap-8 lg:gap-16 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory no-scrollbar pb-10 lg:pb-0"
          >
            {installations.map((group, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className="min-w-[90vw] sm:min-w-[500px] lg:min-w-0 snap-center relative group lg:even:translate-y-24"
              >
                <div className="relative aspect-[16/10] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl mb-8 md:mb-10">
                  <img
                    src={group.image}
                    alt={group.title}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <div className="absolute top-6 md:top-10 left-6 md:left-10 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/10 group-hover:bg-padel-blue group-hover:border-padel-blue transition-all duration-500">
                    {group.icon}
                  </div>

                  <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10">
                    <p className="text-[8px] md:text-[10px] font-black text-padel-yellow uppercase tracking-[0.4em] mb-2">{group.subtitle}</p>
                    <h4 className="text-2xl md:text-4xl font-display font-black text-white uppercase">{group.title}</h4>
                  </div>
                </div>

                <div className="px-4 md:px-12 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                  {group.items.map((item, j) => (
                    <div key={j} className="flex items-start gap-4 group/item">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-padel-blue/40 group-hover/item:bg-padel-blue transition-colors" />
                      <span className="text-sm md:text-base font-medium text-white/40 group-hover/item:text-white/70 transition-colors leading-snug tracking-tight">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination Indicators */}
          <div className="flex lg:hidden justify-center items-center gap-3 mt-4">
            {installations.map((_, i) => (
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

      {/* Background Decor Text */}
      <div className="absolute bottom-40 -left-20 text-[10rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-10 leading-none -rotate-90">
        FACILITIES
      </div>
    </section>
  );
};
