import React from 'react';
import { motion } from 'motion/react';
import { Coffee, Music, Wifi, Wind } from 'lucide-react';

export const ClubHouse = () => {
  const amenities = [
    { icon: <Coffee size={20} />, label: "Bar & Restauration" },
    { icon: <Music size={20} />, label: "Ambiance Musicale" },
    { icon: <Wifi size={20} />, label: "Wi-Fi Haut Débit" },
    { icon: <Wind size={20} />, label: "Climatisation" },
  ];

  return (
    <section id="clubhouse" className="py-24 px-6 bg-dark-bg relative overflow-hidden">
      {/* Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-display font-black text-white/[0.02] whitespace-nowrap pointer-events-none select-none">
        CLUB HOUSE
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl"
              >
                <img src="/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-34285600.jpg" alt="Club House View" loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="aspect-[3/4] rounded-[2rem] overflow-hidden mt-12 shadow-2xl"
              >
                <img src="/IMAGES/IMAGES CARROUSEL/pexels-ollivves-1103829.jpg" alt="Bar Concept" loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-sm font-display font-bold text-padel-blue tracking-[0.4em] uppercase mb-6">L'Expérience Sociale</h2>
            <h3 className="text-5xl md:text-7xl font-display font-black mb-8 leading-tight uppercase">
              LE CLUB <br />
              <span className="text-padel-yellow italic">HOUSE</span>
            </h3>
            <p className="text-xl text-white/60 mb-12 font-medium leading-relaxed">
              Plus qu'un simple vestiaire, notre Club House est le cœur battant de Padel Arena.
              Un espace premium conçu pour le partage, où l'on refait le match autour
              d'une sélection healthy ou d'un café d'expert.
            </p>

            <div className="grid grid-cols-2 gap-8">
              {amenities.map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-padel-yellow group-hover:bg-padel-yellow group-hover:text-black transition-all duration-500">
                    {item.icon}
                  </div>
                  <span className="text-sm font-display font-bold text-white/40 group-hover:text-white transition-colors uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
