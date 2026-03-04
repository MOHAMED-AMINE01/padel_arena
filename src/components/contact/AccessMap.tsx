import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Car, Bus, Accessibility, Navigation, ArrowUpRight, Globe } from 'lucide-react';
import { cn } from '../../lib/utils';

const transportInfo = [
  { icon: <Car size={20} />, title: "STATIONNEMENT", desc: "Parking privé sécurisé 50 places réservé aux membres.", label: "FREE PARKING" },
  { icon: <Bus size={20} />, title: "RÉSEAU URBAIN", desc: "Ligne A - Arrêt 'Arena Sport' à 200m du complexe.", label: "PUBLIC TRANSPORT" },
  { icon: <Accessibility size={20} />, title: "ACCESSIBILITÉ", desc: "Infrastructures totalement adaptées aux PMR.", label: "FULL ACCESS" },
];

export const AccessMap = () => {
  return (
    <section id="acces" className="relative py-24 md:py-48 px-6 bg-[#050505] overflow-hidden border-t border-white/[0.03]">
      {/* Structural Decor */}
      <div className="absolute top-0 right-[15%] w-[1px] h-full bg-white opacity-[0.02] z-0" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">

          <div className="lg:col-span-12 xl:col-span-5 order-2 xl:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-4 mb-8">
                <span className="text-[10px] font-black tracking-[0.4em] text-padel-yellow uppercase">ACCÈS & LOCALISATION</span>
              </div>

              <h3 className="text-4xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase mb-10">
                REJOIGNEZ <br />
                <span className="text-padel-blue italic">L'ARENA</span>
              </h3>

              <p className="text-sm md:text-lg text-white/30 font-medium max-w-lg mb-12 leading-relaxed">
                Situé dans le pôle d'excellence sportive de Vendôme, notre complexe est stratégiquement positionné pour faciliter votre venue.
              </p>

              <div className="grid sm:grid-cols-1 gap-6 mb-16">
                {transportInfo.map((info, i) => (
                  <div key={i} className="group glass p-8 rounded-[2.5rem] border-white/5 hover:border-padel-blue/20 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-padel-yellow group-hover:bg-padel-yellow group-hover:text-white transition-all">
                        {info.icon}
                      </div>
                      <span className="text-[8px] font-black text-white/20 tracking-[0.3em] uppercase italic">{info.label}</span>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white mb-2">{info.title}</h4>
                      <p className="text-sm text-white/30 font-medium leading-relaxed">{info.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto group relative px-10 py-6 bg-padel-blue text-white rounded-full font-black text-[10px] uppercase tracking-[0.4em] overflow-hidden shadow-2xl transition-all"
              >
                <span className="relative z-10 flex items-center justify-center gap-4 group-hover:text-padel-blue transition-colors">
                  ITINÉRAIRE GOOGLE MAPS
                  <Navigation size={16} />
                </span>
                <div className="absolute inset-0 bg-padel-yellow translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </motion.button>
            </motion.div>
          </div>

          <div className="lg:col-span-12 xl:col-span-7 order-1 xl:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-video lg:aspect-square xl:aspect-[4/5] rounded-[4rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] group"
            >
              {/* Cinematic Map Visual */}
              <div className="absolute inset-0 bg-[#111]">
                <img
                  src="/IMAGES/ACTIVITIES - COACHING/pexels-atbo-245208.jpg"
                  alt="Vendôme City View"
                  className="w-full h-full object-cover opacity-20 grayscale brightness-50 group-hover:scale-110 transition-transform duration-[2s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />

                {/* Overlay Elements */}
                <div className="absolute top-10 left-10 glass px-6 py-4 rounded-2xl border-white/10 backdrop-blur-3xl z-20">
                  <div className="flex items-center gap-4 text-white">
                    <Globe size={18} className="text-padel-blue" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-padel-blue leading-none mb-1">CITY COORDINATES</p>
                      <p className="text-xs font-bold leading-none">47.7928° N, 1.0660° E</p>
                    </div>
                  </div>
                </div>

                {/* Marker System */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                  <div className="relative">
                    <div className="absolute -top-24 left-1/2 -translate-x-1/2 glass px-6 py-4 rounded-2xl border-padel-blue/30 backdrop-blur-3xl shadow-[0_30px_60px_rgba(19,73,211,0.3)] whitespace-nowrap">
                      <p className="text-[9px] font-black text-white/30 tracking-[0.3em] uppercase mb-2">DESTINATION</p>
                      <p className="text-xl font-display font-black text-white uppercase tracking-tighter">PADEL ARENA <span className="text-padel-blue">VENDÔME</span></p>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-padel-blue/20 rotate-45 border-r border-b border-padel-blue/30" />
                    </div>

                    {/* Pulsing rings */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-padel-blue/20 rounded-full animate-ping opacity-20" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-padel-blue/30 rounded-full animate-pulse opacity-40" />

                    <div className="relative w-12 h-12 bg-padel-blue rounded-full flex items-center justify-center text-white shadow-[0_0_40px_rgba(19,73,211,0.6)] rotate-12">
                      <MapPin size={24} />
                    </div>
                  </div>
                </div>

                {/* Grid Overlay for Map Feel */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              </div>

              {/* Action Overlay */}
              <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic">VENDÔME ELITE SPORTS HUB</div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full glass border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-white hover:text-black transition-all">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
