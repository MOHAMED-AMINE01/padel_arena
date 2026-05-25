import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Check, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: "STARTER",
    price: "29",
    features: ["2 réservations / mois", "Heures creuses uniquement", "Accès vestiaires standard", "Invitation 1 ami / mois"],
    accent: "text-white"
  },
  {
    name: "PRO PERFORMANCE",
    price: "59",
    featured: true,
    features: ["8 réservations / mois", "Accès toutes heures", "Priorité réservation J-7", "Accès Lounge VIP", "Remise 10% boutique Pro-Shop"],
    accent: "text-padel-blue"
  },
  {
    name: "ELITE ARENA",
    price: "99",
    features: ["Réservations illimitées", "Accès toutes heures", "Priorité réservation J-14", "Coaching 1h / mois offert", "Service serviettes & SPA inclus"],
    accent: "text-padel-yellow"
  }
];

export const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
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
    <section id="abonnements" className="relative py-24 md:py-48 px-6 bg-[#050505] overflow-hidden border-t border-white/[0.03]">
      {/* Editorial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[25%]" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white mr-[25%]" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 mb-20 md:mb-32 text-center lg:text-left">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-4 mb-8">
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">FORMULES SUR MESURE</span>
            </div>
            <h3 className="text-4xl sm:text-5xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase">
              REJOIGNEZ <br />
              <span className="text-white italic">LA LÉGENDE</span>
            </h3>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-6">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">CHOISISSEZ VOTRE RYTHME</p>
            <div className="flex items-center gap-6 p-2 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10">
              <button
                onClick={() => setIsAnnual(false)}
                className={cn(
                  "px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                  !isAnnual ? "bg-padel-blue text-white shadow-xl" : "text-white/30 hover:text-white"
                )}
              >
                Mensuel
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={cn(
                  "px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all relative group",
                  isAnnual ? "bg-padel-blue text-white shadow-xl" : "text-white/30 hover:text-white"
                )}
              >
                Annuel
                {!isAnnual && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-padel-yellow opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-padel-yellow"></span></span>}
              </button>
            </div>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex lg:grid lg:grid-cols-3 gap-6 lg:gap-8 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory no-scrollbar pb-10 lg:pb-0"
          >
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className={cn(
                  "min-w-[85vw] sm:min-w-[400px] lg:min-w-0 snap-center group relative p-12 md:p-16 rounded-[4rem] border transition-all duration-700 flex flex-col h-full",
                  plan.featured
                    ? "bg-[#0A0A0A] border-padel-blue/40 shadow-[0_50px_100px_rgba(19,73,211,0.1)] lg:-translate-y-8 z-20"
                    : "glass border-white/5 hover:border-white/20"
                )}
              >
                {plan.featured && (
                  <div className="absolute top-8 right-8">
                    <div className="px-4 py-1.5 bg-padel-blue text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-full">
                      recommandé
                    </div>
                  </div>
                )}

                <div className="mb-12">
                  <h4 className={cn("text-lg font-display font-black uppercase tracking-tighter mb-4", plan.accent)}>
                    {plan.name}
                  </h4>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl md:text-8xl font-display font-black tracking-tighter text-white">
                      {isAnnual ? Math.round(parseInt(plan.price) * 0.8) : plan.price}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-2xl font-display font-black text-white italic">€</span>
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none">/ MOIS</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 mb-16 flex-grow">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-5 group/item">
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors",
                        plan.featured ? "bg-padel-blue" : "bg-white/5 group-hover/item:bg-padel-blue"
                      )}>
                        <Check size={10} className="text-white" />
                      </div>
                      <span className="text-sm md:text-base text-white/40 font-medium group-hover/item:text-white/70 transition-colors">{feature}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="https://padelarenavendome.villagepadel.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <button className={cn(
                    "w-full py-6 rounded-full font-black text-[10px] tracking-[0.4em] uppercase transition-all duration-500 flex items-center justify-center gap-4 overflow-hidden relative group/btn shadow-xl",
                    plan.featured ? "bg-padel-blue text-white" : "bg-white/5 text-white border border-white/10 hover:border-padel-blue hover:text-padel-blue"
                  )}>
                    <span className="relative z-10 flex items-center gap-3">
                      S'ABONNER <ArrowUpRight size={16} />
                    </span>
                    {plan.featured && <div className="absolute inset-0 bg-padel-yellow translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />}
                  </button>
                </a>
              </motion.div>
            ))}
          </div>

          <div className="flex lg:hidden justify-center items-center gap-3 mt-4">
            {plans.map((_, i) => (
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

      <div className="absolute bottom-40 -right-20 text-[15rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-10 -rotate-90 leading-none">
        MEMBERSHIP
      </div>
    </section>
  );
};
