import React from 'react';
import { motion } from 'motion/react';
import { Coffee, Music, Wifi, Wind } from 'lucide-react';

export const Lounge = () => {
  const amenities = [
    { icon: <Coffee size={20} />, label: "Bar & Restauration" },
    { icon: <Music size={20} />, label: "Ambiance Musicale" },
    { icon: <Wifi size={20} />, label: "Wi-Fi Haut Débit" },
    { icon: <Wind size={20} />, label: "Climatisation" },
  ];

  return (
    <section className="py-32 px-6 bg-dark-bg relative overflow-hidden">
      {/* Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-display font-black text-white/[0.02] whitespace-nowrap pointer-events-none select-none">
        LOUNGE AREA
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="aspect-[3/4] rounded-[2rem] overflow-hidden"
              >
                <img src="/pexels-criticalimagery-34285600.jpg" alt="Lounge 1" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="aspect-[3/4] rounded-[2rem] overflow-hidden mt-12"
              >
                <img src="/pexels-ollivves-1103829.jpg" alt="Lounge 2" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
              </motion.div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-sm font-display font-bold text-padel-blue tracking-[0.4em] uppercase mb-6">L'Après-Match</h2>
            <h3 className="text-5xl md:text-7xl font-display font-black mb-8 leading-tight">
              DÉTENDEZ-VOUS <br />
              <span className="text-padel-yellow italic">AU LOUNGE</span>
            </h3>
            <p className="text-xl text-white/60 mb-12 font-light leading-relaxed">
              Parce que le padel est aussi un sport social, notre espace lounge a été conçu 
              comme un véritable cocon urbain. Profitez de notre bar, de notre sélection 
              de snacks healthy et de notre terrasse panoramique.
            </p>

            <div className="grid grid-cols-2 gap-8 mb-12">
              {amenities.map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-padel-yellow group-hover:bg-padel-yellow group-hover:text-black transition-all">
                    {item.icon}
                  </div>
                  <span className="text-sm font-display font-bold text-white/60 group-hover:text-white transition-colors">{item.label}</span>
                </div>
              ))}
            </div>

            <button className="group flex items-center gap-4 px-8 py-4 glass rounded-full font-display font-bold hover:bg-white hover:text-black transition-all">
              DÉCOUVRIR LA CARTE
              <div className="w-8 h-8 rounded-full bg-padel-yellow flex items-center justify-center text-black -rotate-45 group-hover:rotate-0 transition-transform">
                <Wind size={16} />
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
