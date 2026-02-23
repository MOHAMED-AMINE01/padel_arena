import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ClubHero = () => {
  return (
    <section id="presentation" className="relative h-auto min-h-[75vh] md:h-[75vh] w-full overflow-hidden flex items-center justify-center bg-[#050505] pt-32 pb-20 md:pt-0 md:pb-0 px-6">
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
                <div className="w-10 h-[1px] bg-padel-blue" />
                <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase leading-none">RÉSIDENCE SPORTIVE</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-7xl xl:text-8xl font-display font-black tracking-tighter leading-[0.85] uppercase mb-8">
                L'ARÈNE <br />
                <span className="text-padel-blue italic">VENDÔME</span>
              </h1>

              <p className="text-base md:text-lg text-white/40 font-medium max-w-lg mb-12 sm:mb-10 leading-relaxed mx-auto md:mx-0">
                Le temple du padel moderne. Performance, technologie et convivialité au cœur d'un écosystème unique.
              </p>

              <div className="flex flex-col sm:flex-row items-center md:items-start gap-8 justify-center md:justify-start">
                <Link to="/reservation" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full group relative px-8 py-4 bg-padel-blue text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] overflow-hidden shadow-xl transition-all"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      RÉSERVER
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </motion.button>
                </Link>

                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-padel-yellow bg-white/5 backdrop-blur-md">
                    <Trophy size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-black text-white uppercase tracking-widest leading-none mb-1">PRO LEVEL</p>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none">7 COURTS</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Small Decorative Badge (4 columns) */}
          <div className="hidden lg:flex lg:col-span-4 justify-end">
            <motion.div
              className="relative w-48 h-48 border border-white/5 rounded-full flex items-center justify-center backdrop-blur-[1px]"
            >
              <div className="absolute inset-3 border border-padel-blue/10 rounded-full animate-pulse-slow" />
              <div className="text-center">
                <p className="text-[8px] font-black text-padel-yellow uppercase tracking-[0.3em] mb-1">EST. 2024</p>
                <p className="text-2xl font-display font-black text-white uppercase leading-none">ELITE</p>
                <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] mt-1">ARENA</p>
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
