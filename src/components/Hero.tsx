import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Mail, Phone, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { useSiteSettings } from '../hooks/useSiteSettings';

export const Hero = () => {
  const { settings } = useSiteSettings();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#050505] pt-12 md:pt-20">
      {/* Background Image with Parallax & Pro Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
        <motion.img
          style={{ y, scale: 1.05 }}
          src="/IMAGES/home.jpeg"
          alt="Padel Arena"
          className="w-full h-full object-cover grayscale-[20%]"
        />
      </div>

      {/* Grid Lines - Subtle structure */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03]">
        <div className="max-w-[1600px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[20%]" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white mr-[20%]" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-20 h-full max-w-[1500px] mx-auto px-8 md:px-12 flex flex-col justify-center">
        <motion.div
          style={{ opacity }}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="max-w-5xl"
        >
          {/* Headline - Compact & Powerful */}
          <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] xl:text-[7rem] font-display font-black leading-[0.95] tracking-tighter text-white mb-8">
            VIVEZ <br />
            <span className="text-padel-blue italic">L'EXPÉRIENCE</span> <br />
            <span className="notranslate" translate="no">PADEL ARENA</span>
          </h1>

          {/* Subtext */}
          <p className="text-sm md:text-base text-white/70 font-medium max-w-lg mb-12 md:mb-16 leading-relaxed">
            Entrez dans l'arène. Un lieu de vie hybride entre technicité et convivialité. 1600 m² de sport  à Vendôme. Padel, Golf Indoor et Pickleball : repoussez vos limites dans un complexe conçu pour l'impact.
          </p>

          {/* Utility Contact Grid */}
          <div className="flex flex-wrap gap-10 md:gap-16">
            <div className="group">
              <p className="text-padel-yellow text-[9px] font-black uppercase tracking-[0.3em] mb-4">écrivez-nous</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-padel-blue/20 group-hover:border-padel-blue transition-colors">
                  <Mail size={16} className="text-white/40 group-hover:text-white" />
                </div>
                <a href={`mailto:${settings.email}`} className="text-sm md:text-base font-bold text-white transition-colors hover:text-padel-blue">
                  {settings.email}
                </a>
              </div>
            </div>

            <div className="group">
              <p className="text-padel-yellow text-[9px] font-black uppercase tracking-[0.3em] mb-4">Contactez-nous</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-padel-blue/20 group-hover:border-padel-blue transition-colors">
                  <Phone size={16} className="text-white/40 group-hover:text-white" />
                </div>
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="text-sm md:text-base font-bold text-white transition-colors hover:text-padel-blue">
                  {settings.phone}
                </a>
              </div>
            </div>
          </div>
        </motion.div>



      </div>
    </section>
  );
};
