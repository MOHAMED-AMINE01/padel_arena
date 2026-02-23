import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Heart, Shield, Lightbulb, Coffee, Award, ArrowRight, Target, Users } from 'lucide-react';
import { cn } from '../lib/utils';

export const Presentation = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]);

  const values = [
    {
      icon: <Heart className="text-white" size={24} />,
      title: "Passion du sport",
      desc: "L'amour du jeu est au cœur de tout ce que nous faisons au quotidien."
    },
    {
      icon: <Target className="text-white" size={24} />,
      title: "Excellence",
      desc: "Nous visons la perfection dans nos infrastructures et nos services."
    },
    {
      icon: <Users className="text-white" size={24} />,
      title: "Convivialité",
      desc: "Un véritable lieu de vie pour partager des moments après l'effort."
    },
    {
      icon: <Shield className="text-white" size={24} />,
      title: "Respect",
      desc: "Une ambiance saine où chaque joueur est respecté sur et hors du terrain."
    }
  ];

  return (
    <section className="relative py-24 md:py-48 px-6 overflow-hidden bg-dark-bg">
      {/* Editorial Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white/[0.03]">
          <div className="w-[1px] h-full bg-white/[0.03] ml-[25%]" />
          <div className="w-[1px] h-full bg-white/[0.03]" />
          <div className="w-[1px] h-full bg-white/[0.03] mr-[25%]" />
        </div>
      </div>

      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">

          {/* Text Content - Left Side (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-7 order-2 lg:order-1"
          >
            <div className="inline-flex items-center gap-4 mb-10 group">
              <div className="w-12 h-[1px] bg-padel-blue group-hover:w-20 transition-all duration-700" />
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">
                L'ESSENCE DU CLUB
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl xl:text-7xl font-display font-black mb-10 leading-[0.95] tracking-tighter uppercase">
              BIEN PLUS QU'UN CLUB, <br />
              <span className="text-padel-blue italic">UNE DESTINATION</span> <br />
              SPORTIVE COMPLÈTE
            </h2>

            <p className="text-base md:text-lg text-white/50 mb-16 font-medium leading-relaxed max-w-2xl">
              Notre centre de padel a été imaginé comme un véritable sanctuaire du sport, où la performance brute rencontre le raffinement. Chaque centimètre carré a été conçu pour stimuler vos sens et sublimer votre jeu.
            </p>

            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-12 mb-20">
              {values.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="relative pl-10 group"
                >
                  <div className="absolute left-0 top-1 text-padel-blue group-hover:scale-110 transition-transform duration-500">
                    {v.icon}
                  </div>
                  <h4 className="text-sm font-black mb-3 tracking-[0.1em] uppercase text-white group-hover:text-padel-blue transition-colors">
                    {v.title}
                  </h4>
                  <p className="text-xs text-white/30 leading-relaxed font-medium">
                    {v.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <button className="group relative pr-16 py-4 text-white font-black text-xs uppercase tracking-[0.3em] overflow-hidden">
                <span className="relative z-10 transition-colors group-hover:text-padel-yellow">Découvrir notre vision</span>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-padel-blue/10 border border-white/5 flex items-center justify-center group-hover:bg-padel-blue group-hover:w-full group-hover:rounded-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
                  <ArrowRight size={16} className="text-padel-blue group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            </motion.div>
          </motion.div>

          {/* Visual Content - Right Side (5 cols) */}
          <div className="lg:col-span-5 relative order-1 lg:order-2">
            <motion.div
              style={{ y, rotate }}
              className="relative z-10"
            >
              <div className="relative aspect-[10/14] md:aspect-[4/5] overflow-hidden rounded-[2rem] md:rounded-[4rem] group">
                <div className="absolute inset-0 bg-padel-blue/20 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-1000 z-10" />
                <motion.img
                  initial={{ scale: 1.2 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  src="/IMAGES/IMG_4501.JPG"
                  alt="Infrastructure Padel Arena"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />

                {/* Image Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                <div className="absolute inset-0 border-[1px] border-white/5 rounded-[2rem] md:rounded-[4rem] m-4 pointer-events-none" />
              </div>

              {/* Minimal Stat Badge */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute -bottom-12 -right-6 md:-right-12 bg-white p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center min-w-[160px] md:min-w-[220px]"
              >
                <div className="text-4xl md:text-6xl font-display font-black text-padel-blue mb-2">100%</div>
                <div className="text-[8px] md:text-[10px] font-black text-black/40 uppercase tracking-[0.4em] whitespace-nowrap">
                  Passion Partagée
                </div>
                {/* Floating decorative dot */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-padel-yellow rounded-full animate-pulse" />
              </motion.div>
            </motion.div>

            {/* Background Decorative Text (Large Stroke) */}
            <div className="absolute -top-20 -right-20 lg:-right-40 text-[10rem] md:text-[15rem] font-display font-black text-white/[0.02] tracking-tighter select-none pointer-events-none leading-none -z-10">
              ARENA
            </div>

            {/* Outline Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-white/[0.02] rounded-full pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};
