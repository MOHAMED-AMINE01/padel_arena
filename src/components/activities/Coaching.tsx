import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

const coachingTypes = [
  {
    title: "PADEL",
    desc: "Le cœur de l'Arena avec 3 terrains panoramiques haut de gamme pour une expérience de jeu exceptionnelle.",
    icon: "01",
    image: "/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-33226056.jpg",
    link: "/?sport=Padel#club"
  },
  {
    title: "PICKLEBALL",
    desc: "Découvrez le sport qui monte sur notre terrain polyvalent, idéal pour s'amuser entre amis ou en famille.",
    icon: "02",
    image: "/IMAGES/IMG_4503.JPG",
    link: "/?sport=Pickleball#club"
  },
  {
    title: "BADMINTON",
    desc: "Un terrain de qualité pour vos sessions de badminton, accessible à tous les niveaux de pratique.",
    icon: "03",
    image: "/IMAGES/Badminton.jpg",
    link: "/?sport=Badminton#club"
  },
  {
    title: "GOLF INDOOR",
    desc: "Pratiquez votre swing toute l'année sur les plus beaux parcours mondiaux grâce à notre simulateur 4K.",
    icon: "04",
    image: "/IMAGES/Simulateur golf.jpg",
    link: "/?sport=Golf#club"
  }
];

export const Coaching = () => {
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
    <section id="coaching" className="relative py-24 md:py-24 px-6 bg-[#050505] overflow-hidden">
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
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">NOS ACTIVITÉS</span>
            </div>
            <h3 className="text-4xl sm:text-5xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase">
              1600M² <br />
              <span className="text-white italic">D'ACTIVITÉS</span>
            </h3>
          </div>
        </div>

        {/* Coaching Cards with Mobile Scroll */}
        <div className="relative ">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex lg:grid lg:grid-cols-4 gap-6 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory no-scrollbar pb-10 lg:pb-0"
          >
            {coachingTypes.map((type, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="min-w-[85vw] sm:min-w-[380px] lg:min-w-0 snap-center group relative glass rounded-[2.5rem] overflow-hidden border-white/5 hover:border-padel-blue/20 transition-all duration-700"
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img
                    src={type.image}
                    alt={type.title}
                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
                  <div className="absolute top-6 left-6 text-4xl font-display font-black text-white/10 group-hover:text-padel-blue transition-colors">
                    {type.icon}
                  </div>
                </div>
                <div className="p-8 md:p-10 flex flex-col h-full">
                  <h4 className="text-xl font-display font-black mb-4 group-hover:text-padel-blue transition-colors uppercase leading-tight">
                    {type.title}
                  </h4>
                  <p
                    className="text-xs md:text-sm text-white/30 font-medium leading-relaxed group-hover:text-white/50 transition-colors mb-8"
                    dangerouslySetInnerHTML={{ __html: type.desc }}
                  />

                  <div className="mt-auto">
                    <Link to={type.link}>
                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: '#1349d3', color: '#ffffff' }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-4 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 group/btn"
                      >
                        RÉSERVER
                        <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination Indicators */}
          <div className="flex lg:hidden justify-center items-center gap-3 mt-4">
            {coachingTypes.map((_, i) => (
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
