import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export const AtmosphereSection = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  return (
    <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden flex items-center justify-center bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <motion.video
          style={{ scale }}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40"
        >
          <source src="/input_file_2.mp4" type="video/mp4" />
        </motion.video>
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-transparent to-dark-bg z-10" />
      </div>

      {/* Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-20 text-center px-6"
      >
        <div className="flex items-center justify-center gap-3 mb-6 md:mb-8">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <h2 className="text-sm font-display font-bold text-padel-yellow tracking-[0.6em] uppercase">
            L'Instinct du Jeu
          </h2>
        </div>
        <h3 className="text-4xl md:text-8xl lg:text-[10rem] font-display font-black tracking-tighter leading-[0.85] uppercase">
          RESSENTEZ <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/50 to-white italic">
            CHAQUE FRAPPE
          </span>
        </h3>
        <p className="mt-8 md:mt-12 text-base md:text-2xl text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
          Le silence avant le service. Le son sec de la balle contre le carbone. 
          L'adrénaline pure d'un smash gagnant. Bienvenue dans l'arène.
        </p>
      </motion.div>

      {/* Decorative Lines */}
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-white/5" />
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-white/5" />
    </section>
  );
};
