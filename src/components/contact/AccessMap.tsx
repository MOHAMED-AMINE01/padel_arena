import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Car, Bus, Accessibility, Navigation, ArrowUpRight, Globe } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSiteSettings } from '../../hooks/useSiteSettings';

const transportInfo = [
  { icon: <Car size={20} />, title: "STATIONNEMENT", desc: "Parking privé sécurisé réservé aux membres.", label: "FREE PARKING" },
  { icon: <Bus size={20} />, title: "RÉSEAU URBAIN", desc: "Arrêt de bus proximité.", label: "PUBLIC TRANSPORT" },
  { icon: <Accessibility size={20} />, title: "ACCESSIBILITÉ", desc: "Infrastructures totalement adaptées aux PMR.", label: "FULL ACCESS" },
];

export const AccessMap = () => {
  const { settings } = useSiteSettings();

  return (
    <section id="acces" className="relative py-24 md:py-24 px-6 bg-[#050505] overflow-hidden border-t border-white/[0.03]">
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

              <a href={settings.googleMapsUrl} target="_blank" rel="noopener noreferrer">
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
              </a>
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
              {/* Minimalist Map Visual */}
              <div className="absolute inset-0 bg-[#0c0c0e]">
                {/* Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                {/* Subtle corner glows */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-padel-blue/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-padel-blue/10 rounded-full blur-[100px] pointer-events-none" />

                {/* Top Left Coordinates */}
                <div className="absolute top-12 left-12 z-20 flex items-start gap-4 text-white">
                  <Globe size={22} className="text-padel-blue shrink-0" strokeWidth={1.5} />
                  <div className="pt-0.5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-padel-blue leading-tight mb-1">CITY COORDINATES</p>
                    <p className="text-sm font-bold leading-none tracking-widest">47.7928° N, 1.0660° E</p>
                  </div>
                </div>

                {/* Marker System */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center">
                  <div className="relative">
                    {/* Glow behind the box */}
                    <div className="absolute inset-0 bg-padel-blue/20 blur-[50px] rounded-[2rem]" />

                    {/* Destination Box */}
                    <div className="relative bg-[#121212] px-8 py-5 rounded-3xl shadow-2xl border border-white/[0.03] whitespace-nowrap mb-6 z-10">
                      <p className="text-[9px] font-black text-white/40 tracking-[0.3em] uppercase mb-1">DESTINATION</p>
                      <p className="text-xl font-display font-black text-white uppercase tracking-tighter">PADEL ARENA <span className="text-padel-blue">VENDÔME</span></p>

                      {/* Diamond connecting to pin */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#121212] border-b border-r border-white/[0.03] rotate-45" />
                    </div>
                  </div>

                  {/* Pulsing Pin */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-padel-blue rounded-full animate-ping opacity-20" />
                    <div className="relative w-14 h-14 bg-padel-blue/20 rounded-full flex items-center justify-center p-2 shadow-[0_0_40px_rgba(19,73,211,0.5)]">
                      <div className="w-full h-full bg-padel-blue rounded-full flex items-center justify-center text-white">
                        <MapPin size={22} strokeWidth={2} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Overlay */}
              <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic">VENDÔME ELITE SPORTS HUB</div>
                <div className="flex gap-4">
                  <a href={settings.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-white hover:text-black transition-all">
                    <ArrowUpRight size={18} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
