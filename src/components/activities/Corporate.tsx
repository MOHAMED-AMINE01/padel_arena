import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Building2, Users, Briefcase, Coffee, ArrowRight, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const offers = [
  { title: "TEAM BUILDING", icon: <Users size={24} />, desc: "Renforcez la cohésion de vos équipes à travers des tournois ludiques et conviviaux." },
  { title: "INTER-ENTREPRISES", icon: <Building2 size={24} />, desc: "Défiez d'autres entreprises locales et développez votre réseau sur le terrain." },
  { title: "SÉMINAIRES", icon: <Briefcase size={24} />, desc: "Alliez travail et sport avec nos salles de réunion équipées et accès aux courts." },
  { title: "AFTERWORK PADEL", icon: <Coffee size={24} />, desc: "Détendez-vous entre collègues avec nos formules sport & apéro haut de gamme." },
];

export const Corporate = () => {
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
    <section id="entreprises" className="relative py-24 md:py-48 px-6 bg-[#050505] overflow-hidden border-t border-white/[0.03]">
      {/* Editorial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[25%]" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white mr-[25%]" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-24 items-center mb-24 md:mb-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-12 xl:col-span-6 text-center xl:text-left"
          >
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-padel-blue" />
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">B2B SOLUTIONS</span>
            </div>
            <h3 className="text-4xl md:text-7xl font-display font-black tracking-tighter leading-[0.9] uppercase mb-10">
              LE PADEL AU SERVICE <br />
              <span className="text-white italic">DE VOTRE PERFORMANCE</span>
            </h3>
            <p className="text-base md:text-lg text-white/30 font-medium leading-relaxed mb-12 max-w-2xl mx-auto xl:mx-0">
              Offrez à vos collaborateurs une expérience unique alliant sport, bien-être et networking. Nos solutions sur mesure redéfinissent vos moments d'entreprise.
            </p>

            <button className="flex items-center gap-6 py-5 px-10 bg-padel-blue text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] overflow-hidden relative group mx-auto xl:mx-0">
              <span className="relative z-10">TÉLÉCHARGER LA BROCHURE</span>
              <ArrowUpRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-padel-yellow translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </motion.div>

          <div className="lg:col-span-12 xl:col-span-6 relative">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex xl:grid xl:grid-cols-2 gap-6 overflow-x-auto xl:overflow-x-visible snap-x snap-mandatory no-scrollbar pb-16 xl:pb-0"
            >
              {offers.map((offer, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="min-w-[85vw] sm:min-w-[300px] xl:min-w-0 snap-center group relative glass p-10 md:p-12 rounded-[3.5rem] border-white/5 hover:border-padel-blue/30 transition-all duration-700 flex flex-col h-full"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-padel-blue mb-10 group-hover:bg-padel-blue group-hover:text-white transition-all duration-500">
                    {offer.icon}
                  </div>
                  <h4 className="text-xl font-display font-black mb-6 uppercase leading-tight group-hover:text-padel-blue transition-colors">{offer.title}</h4>
                  <p className="text-xs md:text-sm text-white/30 font-medium leading-relaxed group-hover:text-white/50 transition-colors">{offer.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Pagination for Mobile */}
            <div className="flex xl:hidden justify-center items-center gap-3 mt-4">
              {offers.map((_, i) => (
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

        {/* Corporate Spaces Feature */}
        <section className="relative rounded-[4rem] overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 z-0">
            <img
              src="/IMAGES/IMG_4503.JPG"
              alt="Corporate Event"
              className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent opacity-90" />
          </div>

          <div className="relative z-10 py-24 md:py-48 flex flex-col justify-center px-10 md:px-24 xl:max-w-4xl">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-padel-yellow" />
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-yellow uppercase leading-none">PRIVATISATION</span>
            </div>
            <h4 className="text-4xl md:text-6xl font-display font-black mb-8 uppercase tracking-tighter leading-none">ESPACES <span className="text-padel-blue italic">PRIVATISABLES</span></h4>
            <p className="text-sm md:text-lg text-white/40 font-medium leading-relaxed mb-12 max-w-2xl">
              Profitez de notre club house premium et de nos salles de réunion pour vos événements exclusifs. Restauration et service traiteur disponibles sur demande.
            </p>
            <div className="flex flex-wrap gap-12 md:gap-20">
              <div className="text-left group/stat">
                <div className="text-4xl md:text-6xl font-display font-black text-padel-blue group-hover:text-white transition-colors">50+</div>
                <div className="text-[10px] md:text-[12px] font-black text-white/20 uppercase tracking-[0.3em] mt-2 group-hover:text-padel-yellow transition-all">Capacité Lounge</div>
              </div>
              <div className="text-left group/stat">
                <div className="text-4xl md:text-6xl font-display font-black text-padel-blue group-hover:text-white transition-colors">100%</div>
                <div className="text-[10px] md:text-[12px] font-black text-white/20 uppercase tracking-[0.3em] mt-2 group-hover:text-padel-yellow transition-all">Équipé Tech</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Background Decor Text */}
      <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 text-[15rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-10 rotate-90 leading-none">
        BUSINESS
      </div>
    </section>
  );
};
