import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Instagram, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const team = [
  {
    name: "Thomas Rivière",
    role: "Directeur du Club",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&h=800&auto=format&fit=crop",
    bio: "Visionnaire du padel moderne, Thomas assure que chaque membre vive l'expérience Arena au plus haut niveau."
  },
  {
    name: "Lucas Martin",
    role: "Head Coach",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&h=800&auto=format&fit=crop",
    bio: "Ex-joueur du circuit, Lucas transforme votre technique avec une approche analytique et passionnée."
  },
  {
    name: "Sophie Bernard",
    role: "Resp. Événements",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&h=800&auto=format&fit=crop",
    bio: "Architecte de vos tournois, elle fait de chaque rencontre un événement mémorable et parfaitement orchestré."
  },
  {
    name: "Marc Lefebvre",
    role: "Relations Club",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&h=800&auto=format&fit=crop",
    bio: "Le gardien de l'ambiance Arena. Marc tisse les liens qui font de notre club une véritable communauté."
  }
];

export const ClubTeam = () => {
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
    <section id="equipe" className="relative py-24 md:py-48 px-6 bg-[#050505] overflow-hidden">
      {/* Structural Lines */}
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-white opacity-[0.02] -z-10" />
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-white opacity-[0.02] -z-10" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 mb-16 md:mb-24 text-center lg:text-left">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-4 mb-8">
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">NOTRE EXPERTISE</span>
            </div>
            <h3 className="text-4xl sm:text-5xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase">
              DES PASSIONNÉS <br />
              <span className="text-white italic">À VOTRE SERVICE</span>
            </h3>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex lg:grid lg:grid-cols-4 gap-6 lg:gap-8 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory no-scrollbar pb-10 lg:pb-0"
          >
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="min-w-[80vw] sm:min-w-[340px] lg:min-w-0 snap-center group relative"
              >
                <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-8 border border-white/5">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent group-hover:opacity-0 transition-opacity duration-700" />

                  {/* Hover Reveal Socials */}
                  <div className="absolute inset-0 bg-[#050505]/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-6">
                    <div className="flex gap-4">
                      <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-padel-blue hover:border-padel-blue transition-all">
                        <Instagram size={20} />
                      </button>
                      <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-padel-blue hover:border-padel-blue transition-all">
                        <Linkedin size={20} />
                      </button>
                    </div>
                    <button className="px-6 py-2.5 bg-white text-black rounded-full font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-padel-blue hover:text-white transition-all">
                      CONTACTER <ArrowUpRight size={12} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl md:text-2xl font-display font-black text-white group-hover:text-padel-blue transition-colors">{member.name}</h4>
                    <div className="w-6 h-[1px] bg-white/10 group-hover:w-10 group-hover:bg-padel-blue transition-all" />
                  </div>
                  <p className="text-padel-blue font-display font-black text-[10px] uppercase tracking-[0.3em]">{member.role}</p>
                  <p className="text-xs md:text-sm text-white/30 font-medium leading-[1.6] group-hover:text-white/50 transition-colors">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination Indicators */}
          <div className="flex lg:hidden justify-center items-center gap-3 mt-4">
            {team.map((_, i) => (
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

      {/* Decorative Badge Background */}
      <div className="absolute top-20 right-0 text-[20rem] font-display font-black text-white/[0.01] select-none pointer-events-none -z-10 leading-none">
        TEAM
      </div>
    </section>
  );
};
