import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Users, Instagram, Facebook } from 'lucide-react';
import { cn } from '../lib/utils';

export const FinalCTA = () => {
  return (
    <section className="relative py-24 md:py-24 px-6 overflow-hidden bg-[#050505]">
      {/* Editorial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[25%]" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white mr-[25%]" />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          className="relative group h-[700px] md:h-[600px] rounded-[3rem] md:rounded-[5rem] overflow-hidden flex flex-col items-center justify-center text-center px-8 md:px-12"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/IMAGES/Image de présentation.png"
              alt="Padel Arena"
              className="w-full h-full object-cover grayscale-[30%] opacity-40 group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
            <div className="absolute inset-0 bg-padel-blue/10 mix-blend-overlay" />
          </div>

          <div className="relative z-10 max-w-4xl">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 py-1.5 px-4 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-padel-yellow animate-pulse" />
              <span className="text-[9px] font-black tracking-[0.4em] text-white uppercase">VOTRE AVENTURE COMMENCE ICI</span>
            </motion.div>

            <h2 className="text-5xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] text-white uppercase mb-10">
              PRÊT À ENTRER <br />
              <span className="text-padel-blue italic">DANS L'ARÈNE ?</span>
            </h2>

            <p className="text-base md:text-lg text-white/50 mb-14 font-medium leading-relaxed max-w-xl mx-auto">
              Réservez votre terrain en 30 secondes ou rejoignez notre communauté pour profiter d'avantages exclusifs et progresser avec les meilleurs.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/#club">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-12 py-5 bg-padel-yellow text-padel-blue rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(255,210,31,0.2)] hover:bg-white transition-all flex items-center justify-center gap-3"
                >
                  RÉSERVER MAINTENANT
                  <ArrowRight size={16} />
                </motion.button>
              </Link>

              <Link to="/auth">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-12 py-5 bg-white/5 border border-white/10 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] backdrop-blur-md hover:bg-white hover:text-black transition-all"
                >
                  DEVENIR MEMBRE
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Social Links Sub-footer within CTA */}
          {/* <div className="absolute bottom-12 flex gap-8">
            <a href="#" className="text-white/20 hover:text-padel-blue transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-white/20 hover:text-padel-blue transition-colors">
              <Facebook size={20} />
            </a>
          </div> */}
        </motion.div>

        {/* Decorative elements outside the main box */}
        <div className="absolute -top-10 -left-10 w-40 h-40 border border-padel-blue/10 rounded-full animate-pulse-slow -z-10" />
        <div className="absolute -bottom-20 -right-20 text-[10rem] md:text-[15rem] font-display font-black text-white/[0.01] select-none pointer-events-none -z-10 leading-none">
          ELITE
        </div>
      </div>
    </section>
  );
};
