import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Clock, ShoppingBag, HeartHandshake, Info, ArrowRight } from 'lucide-react';

const rules = [
  {
    icon: <Clock size={24} />,
    title: "Flexibilité",
    desc: "Annulation gratuite jusqu'à 24h avant le début du créneau réservé."
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "Équipement",
    desc: "Tenue de sport et chaussures de padel propres obligatoires sur les courts."
  },
  {
    icon: <ShoppingBag size={24} />,
    title: "Pro-Shop",
    desc: "Location de raquettes haut de gamme et vente de balles disponible sur place."
  },
  {
    icon: <HeartHandshake size={24} />,
    title: "Fair-Play",
    desc: "Respect strict de l'étiquette du club et courtoisie envers les autres membres."
  }
];

export const Conditions = () => {
  return (
    <section id="conditions" className="py-40 px-6 bg-white/[0.02] relative overflow-hidden">
      {/* Decorative background text */}
      <div className="absolute -bottom-20 -left-20 text-[30vw] font-display font-black text-white/[0.01] select-none pointer-events-none">
        RULES
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-32 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-padel-blue" />
              <h2 className="text-sm font-display font-bold text-padel-blue tracking-[0.5em] uppercase">Règlement</h2>
            </div>
            
            <h3 className="text-6xl md:text-8xl font-display font-black mb-12 tracking-tighter leading-[0.9]">
              L'ÉTIQUETTE DE <br />
              <span className="text-padel-yellow italic">L'ARÈNE</span>
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-8">
              {rules.map((rule, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass p-8 rounded-[2rem] hover:bg-white/10 transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-padel-blue/10 flex items-center justify-center text-padel-blue mb-6 group-hover:bg-padel-blue group-hover:text-white transition-all">
                    {rule.icon}
                  </div>
                  <h4 className="text-xl font-display font-bold mb-3 tracking-tight">{rule.title}</h4>
                  <p className="text-sm text-white/40 leading-relaxed font-light">{rule.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <img 
                src="/pexels-criticalimagery-33226057.jpg" 
                alt="Rules context" 
                className="w-full h-full object-cover grayscale opacity-40" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/40 to-transparent" />
              
              <div className="absolute bottom-12 left-12 right-12 glass p-10 rounded-[2.5rem] border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-padel-yellow flex items-center justify-center text-black">
                    <Info size={20} />
                  </div>
                  <h4 className="text-2xl font-display font-black">ASSISTANCE</h4>
                </div>
                <p className="text-white/60 text-base leading-relaxed mb-8 font-light">
                  Notre équipe est à votre disposition 7j/7 pour toute question sur le règlement 
                  ou pour organiser vos événements de groupe.
                </p>
                <button className="flex items-center gap-3 text-padel-yellow font-display font-bold text-xs tracking-widest group">
                  CONTACTER LE CLUB
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 border border-white/5 rounded-full -z-10" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 border border-white/5 rounded-full -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};
