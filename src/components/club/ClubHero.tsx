import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ClubHero = () => {
  return (
    <section id="presentation" className="relative h-auto min-h-[75vh] md:h-[75vh] w-full overflow-hidden flex items-center justify-center bg-[#050505] pt-12 md:pt-40">
      {/* Editorial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-10">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[25%]" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white mr-[25%]" />
        </div>
      </div>

      {/* Background Section with Cinematic Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover grayscale-[30%]"
        >
          <source src="/VIDEOS/Vidéo-1.mp4" type="video/mp4" />
        </video>
        {/* Animated Scanline Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none z-10 opacity-20" />
      </div>

      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-8 items-center">

          {/* Left Side: Editorial Content (8 columns) */}
          <div className="lg:col-span-8 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="inline-flex items-center gap-4 mb-6">
                <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase leading-none">RÉSIDENCE SPORTIVE</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-7xl xl:text-8xl font-display font-black tracking-tighter leading-[0.85] uppercase mb-8">
                L'ARÈNA <br />
                <span className="text-padel-blue italic">VENDÔMOIS</span>
              </h1>

              <p className="text-base md:text-lg text-white/40 font-medium max-w-lg mb-12 sm:mb-10 leading-relaxed mx-auto md:mx-0">
                1600 m² d'immersion à Saint-Ouen. Entre terrains premium et bar central, le complexe réunit sport de raquette et vie de club dans un espace moderne ouvert à tous.
              </p>

              <div className="flex flex-col sm:flex-row items-center md:items-start gap-8 justify-center md:justify-start">
                <Link to="/reservation" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full group relative px-8 py-4 bg-padel-blue text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] overflow-hidden shadow-xl transition-all"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3 notranslate" translate="no">
                      RÉSERVER
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </motion.button>
                </Link>

                
              </div>
            </motion.div>
          </div>

          
        </div>
      </div>

      {/* Background Large Decor Text */}
      <div className="absolute bottom-0 right-0 text-[12rem] md:text-[18rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-10 leading-none">
        CLUB
      </div>
    </section>
  );
};
