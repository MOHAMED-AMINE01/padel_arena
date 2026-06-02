import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Briefcase, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const activities = [
  {
    title: "ENTRAÎNEMENT",
    subtitle: "AVEC PROFS PRIVÉS",
    icon: <Target size={24} />,
    image: "/IMAGES/IMG_4503.JPG",
    desc: "Progressez à votre rythme avec des sessions d'entraînement encadrées par des professeurs privés expérimentés, sur demande.",
    tag: "PROGRESSION",
    link: "/contact",
    cta: "NOUS CONTACTER"
  },
  {
    title: "ÉVÉNEMENTS",
    subtitle: "SUR MESURE",
    icon: <Briefcase size={24} />,
    image: "/IMAGES/todd-trapani-sI-p_NLBNr0-unsplash.jpg",
    desc: "Séminaires, Team Building, EVG/EVJF ou anniversaires : nous organisons vos événements sportifs et festifs de A à Z.",
    tag: "PRESTIGE",
    link: "/contact",
    cta: "DEMANDER UN DEVIS"
  }
];

export const Activities = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % activities.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + activities.length) % activities.length);
  };

  return (
    <section id="activites" className="py-24 md:py-32 px-6 relative overflow-hidden bg-[#050505]">
      {/* Background Spotlight - Fills the emptiness */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-padel-blue/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Structural Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[33%]" />
          <div className="w-[1px] h-full bg-white mr-[33%]" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-start justify-between mb-32 gap-16 lg:gap-24">
          <div className="text-left flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-4 mb-8"
            >
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">LIFESTYLE & TRAINING</span>
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl lg:text-[8rem] font-display font-black tracking-tighter leading-[0.85] uppercase"
            >
              VIVEZ LE <br />
              <span className="text-padel-blue italic">MOUVEMENT</span>
            </motion.h3>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="lg:pt-32 flex-1 max-w-md ml-auto"
          >
            <p className="text-xl md:text-2xl text-white/30 font-medium leading-relaxed italic mb-8">
              "Plus qu'un club, une destination où chaque session devient un événement."
            </p>
            <div className="h-[1px] w-24 bg-white/10" />
          </motion.div>
        </div>

        {/* Duo Cinematic Layout */}
        <div className="hidden sm:grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          {activities.map((activity, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 1 }}
              className="relative group h-[600px] lg:h-[650px] rounded-[4rem] overflow-hidden cursor-pointer shadow-2xl"
            >
              {/* Image & Overlays */}
              <div className="absolute inset-0 z-0">
                <img
                  src={activity.image}
                  alt={activity.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-40" />
                <div className={cn(
                  "absolute inset-0 opacity-10 transition-opacity group-hover:opacity-30",
                  i === 0 ? "bg-padel-blue" : "bg-padel-yellow"
                )} />
              </div>

              {/* Content Overlay */}
              <div className="relative z-10 h-full p-12 lg:p-20 flex flex-col justify-end items-start">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="mb-auto"
                >
                  <div className="inline-flex items-center gap-4 py-3 px-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full mb-8">
                    <div className="text-white transform group-hover:rotate-12 transition-transform">{activity.icon}</div>
                    <span className="text-[10px] font-black tracking-[0.4em] text-white uppercase">{activity.tag}</span>
                  </div>
                </motion.div>

                <div className="max-w-2xl translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                  <span className="text-[12px] font-black text-white/40 uppercase tracking-[0.5em] mb-4 block">
                    {activity.subtitle}
                  </span>
                  <h4 className="text-5xl md:text-7xl lg:text-[3.5rem] font-display font-black text-white uppercase leading-[0.8] mb-10 tracking-tighter">
                    {activity.title}
                  </h4>
                  <p className="text-base md:text-xl text-white/40 font-medium leading-relaxed mb-12 max-w-md group-hover:text-white/80 transition-colors min-h-[5rem] md:min-h-[6rem] lg:min-h-[7rem] line-clamp-4">
                    {activity.desc}
                  </p>

                  <Link to={activity.link}>
                    <button className="flex items-center gap-6 py-5 px-12 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-[0.3em] transition-all hover:bg-padel-blue hover:text-white hover:scale-105 active:scale-95 shadow-xl">
                      {activity.cta}
                      <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Decorative Corner Spotlight */}
              <div className={cn(
                "absolute -top-20 -right-20 w-60 h-60 blur-3xl rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-1000",
                i === 0 ? "bg-padel-blue" : "bg-padel-yellow"
              )} />
            </motion.div>
          ))}
        </div>

        {/* Mobile Carousel - kept for consistency on small screens */}
        <div className="sm:hidden">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="relative h-[550px] rounded-[3rem] overflow-hidden">
                  <img
                    src={activities[currentIndex].image}
                    alt={activities[currentIndex].title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <h4 className="text-4xl font-display font-black text-white uppercase mb-4 leading-none">
                      {activities[currentIndex].title}
                    </h4>
                    <p className="text-sm text-white/60 mb-8 line-clamp-3">
                      {activities[currentIndex].desc}
                    </p>
                    <Link to={activities[currentIndex].link}>
                      <button className="w-full py-4 bg-padel-blue text-white rounded-full font-black text-[10px] uppercase tracking-widest">
                        {activities[currentIndex].cta}
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              {activities.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    currentIndex === i ? "w-6 bg-padel-blue" : "bg-white/20"
                  )}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

      </div>

      {/* Background Large Decor Text */}
      <div className="absolute -bottom-20 -left-20 text-[15rem] md:text-[25rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-10 leading-none">
        SERVICES
      </div>
    </section>
  );
};
