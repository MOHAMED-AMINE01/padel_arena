import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { cn } from '../lib/utils';

const testimonials = [
  {
    name: "Marc D.",
    role: "Joueur Passionné",
    content: "Le meilleur club de la région. Les terrains panoramiques sont incroyables et l'ambiance au club house est toujours au top après les matchs.",
    rating: 5,
    avatar: "https://picsum.photos/seed/marc/100/100"
  },
  {
    name: "Julie L.",
    role: "Membre Académie",
    content: "J'ai énormément progressé grâce aux coachs. Les infrastructures sont modernes et très bien entretenues. Je recommande vivement !",
    rating: 5,
    avatar: "https://picsum.photos/seed/julie/100/100"
  },
  {
    name: "Antoine P.",
    role: "Compétiteur P250",
    content: "L'organisation des tournois est exemplaire. On sent que le club est géré par des passionnés qui connaissent les besoins des joueurs.",
    rating: 5,
    avatar: "https://picsum.photos/seed/antoine/100/100"
  }
];

export const Testimonials = () => {
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
    <section id="avis" className="py-24 md:py-40 px-6 relative overflow-hidden bg-dark-bg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-display font-bold text-padel-blue tracking-[0.5em] uppercase mb-6">Témoignages</h2>
            <h3 className="text-4xl md:text-8xl font-display font-black tracking-tighter leading-none">
              ILS FONT VIBRER <br />
              <span className="text-padel-blue italic">NOTRE ARÈNE</span>
            </h3>
          </motion.div>
        </div>

        <div className="relative">
          {/* Horizontal Scroll Container for Mobile/Tablet, Grid for Desktop */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex lg:grid lg:grid-cols-3 gap-6 md:gap-8 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory no-scrollbar pb-8 lg:pb-0"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="min-w-[85vw] sm:min-w-[400px] lg:min-w-0 snap-center glass p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border-white/5 relative group hover:border-padel-blue/30 transition-all flex flex-col"
              >
                <Quote className="absolute top-8 right-8 text-padel-blue/10 group-hover:text-padel-blue/20 transition-colors" size={50} />

                <div className="flex gap-1 mb-6 md:mb-8">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-padel-blue text-padel-blue" />
                  ))}
                </div>

                <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed mb-8 md:mb-10 italic flex-grow">
                  "{t.content}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-padel-blue/20">
                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base md:text-lg">{t.name}</h4>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination dots - visible on LG/MD (optional) but specifically requested for mobile and tablet */}
          <div className="flex lg:hidden justify-center items-center gap-3 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={cn(
                  "h-1.5 transition-all duration-500 rounded-full",
                  activeIndex === i
                    ? "w-8 bg-padel-blue"
                    : "w-1.5 bg-white/10 hover:bg-white/30"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
