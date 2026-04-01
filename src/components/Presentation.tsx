import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Heart, Shield, Lightbulb, Coffee, Award, ArrowRight, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export const Presentation = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]);

  const values = [
    {
      icon: <Target className="text-white" size={24} />,
      title: "1600 m² d'espace multisport",
      desc: "Un lieu de vie dédié à l'activité et à la détente."
    },
    {
      icon: <Heart className="text-white" size={24} />,
      title: "3 terrains de Padel & Golf Indoor",
      desc: "Des équipements premium accessibles à tous."
    },
    {
      icon: <Users className="text-white" size={24} />,
      title: "1 Club-house 100% convivial",
      desc: "Un bar central pensé pour prolonger l'instant et refaire le match."
    },
    {
      icon: <Shield className="text-white" size={24} />,
      title: "7/7 Jours de sport et de détente",
      desc: "Un lieu de vie hybride où l'on vient pour le jeu et où l'on reste pour l'ambiance."
    }
  ];

  return (
    <section className="relative py-24 md:py-24 px-6 overflow-hidden bg-dark-bg">
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
        <div className="grid lg:grid-cols-14 gap-16 lg:gap-24 items-center">

          {/* Text Content - Left Side (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-7 order-2 lg:order-1"
          >
            <div className="inline-flex items-center gap-4 mb-10 group">
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">
                BIENVENUE CHEZ VOUS
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl xl:text-7xl font-display font-black mb-10 leading-[0.95] tracking-tighter uppercase">
              LE SPORT, <br />
              <span className="text-padel-blue italic">LE PARTAGE,</span> <br />
              L'ARENA.
            </h2>

            <p className="text-base md:text-lg text-white/50 mb-16 font-medium leading-relaxed max-w-2xl">
              Trois terrains de Padel, un espace multisport et un bar convivial à Saint-Ouen. On vient pour le match, on reste pour l'ambiance. Le complexe idéal pour déconnecter et profiter entre amis.
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
              <Link
                to="/le-club"
                className="group relative inline-flex items-center gap-4 px-8 py-4 bg-transparent border border-white/10 rounded-full overflow-hidden transition-all duration-500 hover:border-padel-blue/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-padel-blue to-padel-blue/80 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                <span className="relative z-10 text-white font-black text-xs uppercase tracking-[0.2em] transition-colors duration-300">
                  Découvrir notre vision
                </span>
                <div className="relative z-10 w-8 h-8 rounded-full bg-padel-blue/20 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                  <ArrowRight size={14} className="text-padel-blue group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Visual Content - Right Side (5 cols) */}
          <div className="lg:col-span-7 relative order-1 lg:order-2">
            <motion.div
              style={{ y, rotate }}
              className="relative z-10"
            >
              <div className="relative aspect-[10/14] md:aspect-[7/4] overflow-hidden rounded-[2rem] md:rounded-[2rem] group">
                <div className="absolute inset-0 bg-padel-blue/20 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-1000 z-10" />
                <motion.img
                  initial={{ scale: 1 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  src="/IMAGES/presentation2.jpeg"
                  alt="Infrastructure Padel Arena"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />

                {/* Image Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                <div className="absolute inset-0 border-[1px] border-white/5 rounded-[2rem] md:rounded-[4rem] m-4 pointer-events-none" />
              </div>


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
