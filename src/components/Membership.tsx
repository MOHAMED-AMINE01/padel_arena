import React from 'react';
import { motion } from 'motion/react';
import { Crown, Zap, Shield, Star, Check } from 'lucide-react';

const tiers = [
  {
    name: "PASS ARENA",
    price: "40€",
    period: "/mois",
    icon: <Shield className="text-padel-blue" />,
    features: [
      "Réservation H24 via application",
      "Accès 7j/7 aux courts",
      "Priorité de réservation J-7",
      "Accès Club House & Lounge",
      "Système de crédits intégré"
    ],
    color: "border-white/10"
  },
  {
    name: "Heures Creuses",
    price: "50€",
    period: "/mois",
    icon: <Zap className="text-padel-blue" />,
    features: [
      "Accès illimité en heures creuses",
      "Inclus Padel, Badminton, Pickleball & Golf",
      "Réservation 7 jours à l'avance",
      "Priorité sur les événements club"
    ],
    color: "border-white/10"
  }
];

export const Membership = () => {
  return (
    <section id="membership" className="py-24 md:py-40 px-6 relative overflow-hidden bg-dark-bg">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-padel-blue/[0.03] mask-radial pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-display font-bold text-padel-blue tracking-[0.5em] uppercase mb-6">Adhésion</h2>
            <h3 className="text-4xl md:text-9xl font-display font-black tracking-tighter leading-none mb-8">
              REJOIGNEZ <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/30 italic">LE CERCLE</span>
            </h3>
            <p className="text-base md:text-xl text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
              Plus qu'un club, une communauté d'élite. Choisissez le niveau d'excellence 
              qui correspond à vos ambitions.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] glass border ${tier.color} transition-all duration-500 hover:scale-[1.02] group`}
            >
              {tier.featured && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-padel-yellow text-black px-6 py-2 rounded-full text-[10px] font-display font-black tracking-widest shadow-[0_0_30px_rgba(255,210,31,0.5)]">
                  PLUS POPULAIRE
                </div>
              )}

              <div className="mb-8 md:mb-10 flex justify-between items-start">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/5 flex items-center justify-center text-2xl md:text-3xl">
                  {tier.icon}
                </div>
                <div className="text-right">
                  <div className="text-3xl md:text-4xl font-display font-black">{tier.price}</div>
                  <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{tier.period}</div>
                </div>
              </div>

              <h4 className="text-2xl md:text-3xl font-display font-black mb-6 md:mb-8 tracking-tight">{tier.name}</h4>

              <div className="space-y-4 md:space-y-6 flex-1 mb-8 md:mb-12">
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-4 text-white/60 group-hover:text-white transition-colors">
                    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <Check size={10} className={tier.featured ? "text-padel-yellow" : "text-padel-blue"} />
                    </div>
                    <span className="text-xs md:text-sm font-light">{feature}</span>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-4 md:py-5 rounded-xl md:rounded-2xl font-display font-bold text-base md:text-lg transition-all ${
                  tier.featured 
                    ? "bg-padel-yellow text-black glow-yellow" 
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                S'ABONNER
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
