import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, CircleDot, ShowerHead, DoorOpen } from 'lucide-react';
import { cn } from '../../lib/utils';

const services = [
  { title: "LOCATION RAQUETTES", icon: <CircleDot size={24} />, desc: "Testez les derniers modèles de nos marques partenaires d'élite." },
  { title: "Vente de balles", icon: <ShoppingBag size={24} />, desc: "Balles neuves disponibles à l'accueil pour une partie parfaite." },
  { title: "BOUTIQUE PRO-SHOP", icon: <ShoppingBag size={24} />, desc: "Équipez-vous avec le meilleur du matériel et textile technique." },
  { title: "VESTIAIRES PREMIUM", icon: <ShowerHead size={24} />, desc: "Service de serviettes propres et douches haut de gamme." },
  { title: "CASIERS CONNECTÉS", icon: <DoorOpen size={24} />, desc: "Sécurité totale pour vos effets personnels avec accès digital." },
];

export const Services = () => {
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
    <section id="services" className="relative py-24 md:py-24 px-6 bg-[#050505] overflow-hidden border-t border-white/[0.03]">
      {/* Structural Lines */}
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-white opacity-[0.02] z-0" />
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-white opacity-[0.02] z-0" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 mb-24 text-center lg:text-left">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-4 mb-8">
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-yellow uppercase">SERVICES & CONFORTS</span>
            </div>
            <h3 className="text-4xl sm:text-5xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase">
              TOUT POUR VOTRE <br />
              <span className="text-padel-blue italic">SÉRÉNITÉ</span>
            </h3>
          </div>
        </div>

        {/* Services Grid with Mobile Scroll */}
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory no-scrollbar pb-10 lg:pb-0"
          >
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="min-w-[85vw] sm:min-w-[400px] lg:min-w-0 snap-center group relative glass p-10 md:p-12 rounded-[2.5rem] border-white/5 hover:border-padel-blue/30 transition-all duration-700 flex flex-col items-center lg:items-start text-center lg:text-left"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-padel-blue/5 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-padel-blue mb-10 group-hover:bg-padel-blue group-hover:text-white transition-all duration-500">
                  {service.icon}
                </div>
                <h4 className="text-xl md:text-2xl font-display font-black mb-6 group-hover:text-padel-blue transition-colors uppercase leading-none">{service.title}</h4>
                <p className="text-sm md:text-base text-white/30 font-medium leading-relaxed group-hover:text-white/50 transition-colors">{service.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Pagination Indicators */}
          <div className="flex lg:hidden justify-center items-center gap-3 mt-4">
            {services.map((_, i) => (
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
      <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 text-[15rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-10 rotate-90 leading-none">
        COMFORT
      </div>
    </section>
  );
};
