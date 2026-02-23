import React from 'react';
import { motion } from 'motion/react';
import { Target, Zap, Shield } from 'lucide-react';

export const ClubConcept = () => {
  return (
    <section className="relative py-24 md:py-48 px-6 overflow-hidden bg-[#050505]">
      {/* Editorial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[25%]" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white mr-[25%]" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">

          {/* Visual Side (5 cols) */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
              className="relative aspect-[4/5] rounded-[3rem] overflow-hidden group shadow-2xl"
            >
              <img
                src="/IMAGES/IMG_4503.JPG"
                alt="Club Concept"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-10 left-10 right-10 p-8 glass rounded-2xl border-white/5 backdrop-blur-xl">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-padel-yellow animate-pulse" />
                  <span className="text-[9px] font-black tracking-[0.3em] text-white uppercase">INNOVATION</span>
                </div>
                <p className="text-sm font-medium text-white/70 leading-relaxed italic">
                  "Nous avons conçu cet espace comme un sanctuaire de performance et de style."
                </p>
              </div>
            </motion.div>
          </div>

          {/* Text Side (7 cols) */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-4 mb-8">
                <div className="w-12 h-[1px] bg-padel-blue" />
                <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">NOTRE ADN</span>
              </div>

              <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase mb-10">
                PENSÉ POUR <br />
                <span className="text-white italic">L'EXCELLENCE</span>
              </h2>

              <div className="space-y-8 mb-12">
                <p className="text-base md:text-lg text-white/40 font-medium leading-relaxed max-w-2xl">
                  Padel Arena Vendôme n'est pas un simple club. C'est une vision du padel moderne où chaque courbe, chaque lumière et chaque terrain a été optimisé pour le plaisir du jeu.
                </p>

                <div className="grid sm:grid-cols-2 gap-8">
                  {[
                    { icon: <Target className="text-padel-blue" size={24} />, title: "PRÉCISION", desc: "Éclairage LED sans zone d'ombre pour un suivi de balle parfait." },
                    { icon: <Zap className="text-padel-yellow" size={24} />, title: "ÉNERGIE", desc: "Une atmosphère électrique portée par une communauté passionnée." },
                    { icon: <Shield className="text-padel-blue" size={24} />, title: "CONFORT", desc: "Climatisation active et vestiaires haut de gamme." },
                  ].map((item, i) => (
                    <div key={i} className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                        {item.icon}
                      </div>
                      <h4 className="text-[11px] font-black text-white tracking-[0.2em] uppercase">{item.title}</h4>
                      <p className="text-xs text-white/30 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button className="group flex items-center gap-6 py-4 px-10 rounded-full border border-white/10 hover:border-padel-blue transition-all duration-500 overflow-hidden relative">
                <span className="relative z-10 text-[10px] font-black tracking-[0.2em] text-white uppercase group-hover:text-padel-blue transition-colors">Explorer nos valeurs</span>
                <div className="absolute inset-0 bg-padel-blue/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Background Decor Text */}
      <div className="absolute top-20 -right-40 text-[15rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-10 leading-none">
        CONCEPT
      </div>
    </section>
  );
};
