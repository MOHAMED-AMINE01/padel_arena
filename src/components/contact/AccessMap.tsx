import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Car, Bus, Accessibility, Navigation, ArrowUpRight, Globe } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSiteSettings } from '../../hooks/useSiteSettings';

const transportInfo = [
  { icon: <Car size={20} />, title: "STATIONNEMENT", desc: "Parking privé sécurisé réservé aux membres." },
  { icon: <Bus size={20} />, title: "RÉSEAU URBAIN", desc: "Arrêt de bus proximité." },
  { icon: <Accessibility size={20} />, title: "ACCESSIBILITÉ", desc: "Infrastructures totalement adaptées aux PMR." },
];

export const AccessMap = () => {
  const { settings } = useSiteSettings();

  return (
    <section id="acces" className="relative py-12 md:py-16 px-6 bg-[#050505] overflow-hidden border-t border-white/[0.03]">
      {/* Structural Decor */}
      <div className="absolute top-0 right-[15%] w-[1px] h-full bg-white opacity-[0.02] z-0" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

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

              <h3 className="text-4xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase mb-6">
                REJOIGNEZ <br />
                <span className="text-padel-blue italic">L'ARENA</span>
              </h3>

              <p className="text-sm md:text-base text-white/30 font-medium max-w-lg mb-8 leading-relaxed">
                Situé dans le pôle d'excellence sportive de Vendôme, notre complexe est stratégiquement positionné pour faciliter votre venue.
              </p>

              <div className="grid sm:grid-cols-1 gap-4 mb-10">
                {transportInfo.map((info, i) => (
                  <div key={i} className="group glass p-5 rounded-3xl border-white/5 hover:border-padel-blue/20 transition-all flex items-center gap-6">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-padel-yellow group-hover:bg-padel-yellow group-hover:text-white transition-all shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-0.5">{info.title}</h4>
                      <p className="text-xs text-white/30 font-medium leading-tight">{info.desc}</p>
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
              className="relative aspect-[4/4] lg:aspect-[16/10] xl:aspect-[3/2] rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] group"
            >
              {/* Real Interactive Map */}
              <div className="absolute inset-0 bg-[#0c0c0e]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2668.647610012345!2d1.0643!3d47.7841!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e35b7e00000000%3A0x0!2zNDfCsDQ3JzAzLjAiTiAxwrAwMydNTEUuMCJF!5e0!3m2!1sfr!2sfr!4v1712588000000!5m2!1sfr!2sfr"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2)' }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="opacity-80 hover:opacity-100 transition-opacity duration-700"
                />



                {/* Aesthetic HUD brackets */}
                <div className="absolute top-12 right-12 w-6 h-6 border-t-2 border-r-2 border-padel-blue/30 rounded-tr-xl pointer-events-none" />
                <div className="absolute bottom-12 left-12 w-6 h-6 border-b-2 border-l-2 border-padel-blue/30 rounded-bl-xl pointer-events-none" />
              </div>

              {/* Action Overlay */}
              <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between z-30 pointer-events-none">
                <div className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic opacity-50">CLIQUEZ POUR NAVIGUER</div>
                <div className="flex gap-4 pointer-events-auto">
                  <a href={settings.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full glass border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-padel-blue hover:border-padel-blue transition-all shadow-2xl">
                    <ArrowUpRight size={22} />
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
