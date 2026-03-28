import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Instagram, Linkedin, Mail, ArrowUpRight, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  socialLinks: {
    linkedin: string;
    instagram: string;
    email: string;
  };
}

export const ClubTeam = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.get('/content/team');
        setTeam(res.data.data);
      } catch (err) {
        console.error('Error fetching team:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, offsetWidth } = scrollRef.current;
      const cardWidth = window.innerWidth >= 1024 ? offsetWidth / 4 : offsetWidth;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(index);
    }
  };

  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      const { offsetWidth } = scrollRef.current;
      const cardWidth = window.innerWidth >= 1024 ? (offsetWidth + 32) / 4 : offsetWidth + 24; // Including gaps
      scrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  const next = () => {
    if (activeIndex < team.length - 1) scrollTo(activeIndex + 1);
  };

  const prev = () => {
    if (activeIndex > 0) scrollTo(activeIndex - 1);
  };

  if (loading) {
    return (
      <section id="equipe" className="py-24 md:py-48 px-6 bg-[#050505] flex flex-col items-center justify-center gap-6">
        <Loader2 className="animate-spin text-padel-blue" size={40} />
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Découverte de l'équipe...</p>
      </section>
    );
  }

  return (
    <section id="equipe" className="relative py-24 md:py-24 px-6 bg-[#050505] overflow-hidden">
      {/* Structural Lines */}
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-white opacity-[0.02] -z-10" />
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-white opacity-[0.02] -z-10" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 mb-16 md:mb-24 text-center lg:text-left">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-4 mb-8">
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">NOTRE EXPERTISE</span>
            </div>
            <h3 className="text-4xl sm:text-5xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase text-white">
              DES PASSIONNÉS <br />
              <span className="text-white italic">À VOTRE SERVICE</span>
            </h3>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-6 lg:gap-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-10"
          >
            {team.map((member, i) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="min-w-[85vw] md:min-w-[45vw] lg:min-w-[calc(25%-1.5rem)] snap-center group relative"
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
                      {member.socialLinks?.instagram && (
                        <a
                          href={member.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-padel-blue hover:border-padel-blue transition-all"
                        >
                          <Instagram size={20} />
                        </a>
                      )}
                      {member.socialLinks?.linkedin && (
                        <a
                          href={member.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-padel-blue hover:border-padel-blue transition-all"
                        >
                          <Linkedin size={20} />
                        </a>
                      )}
                    </div>
                    {member.socialLinks?.email && (
                      <a
                        href={`mailto:${member.socialLinks.email}`}
                        className="px-6 py-2.5 bg-white text-black rounded-full font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-padel-blue hover:text-white transition-all"
                      >
                        CONTACTER <ArrowUpRight size={12} />
                      </a>
                    )}
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

          {/* Pagination Indicators & Arrows */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mt-12 pt-12 border-t border-white/5">
            <div className="flex items-center gap-3">
              {team.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={cn(
                    "h-1.5 transition-all duration-500 rounded-full",
                    activeIndex === i ? "w-12 bg-padel-blue" : "w-1.5 bg-white/10 hover:bg-white/20"
                  )}
                />
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={prev}
                disabled={activeIndex === 0}
                className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-padel-blue hover:border-padel-blue hover:bg-padel-blue/5 transition-all disabled:opacity-20 disabled:cursor-not-allowed group/btn"
              >
                <ArrowUpRight size={24} className="-rotate-[135deg] group-hover/btn:scale-110 transition-transform" />
              </button>
              <button
                onClick={next}
                disabled={activeIndex >= team.length - (window.innerWidth >= 1024 ? 4 : 1)}
                className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-padel-blue hover:border-padel-blue hover:bg-padel-blue/5 transition-all disabled:opacity-20 disabled:cursor-not-allowed group/btn"
              >
                <ArrowUpRight size={24} className="rotate-45 group-hover/btn:scale-110 transition-transform" />
              </button>
            </div>
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
