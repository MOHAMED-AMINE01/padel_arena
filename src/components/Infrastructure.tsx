import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Activity, Zap, Star, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const carouselImages = [
  {
    url: "/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-33226056.jpg",
    title: "LES ANIMATIONS LOISIRS",
    desc: "Animations ouvertes à toutes et tous, venez jouer en toute simplicité",
    tag: "CONVIVIALITÉ",
    icon: <Activity size={20} />
  },
  {
    url: "/IMAGES/IMAGES CARROUSEL/pexels-anhelina-vasylyk-734724285-35248239.jpg",
    title: "ACADÉMIE DE PADEL", // notranslate applied in JSX
    desc: "Progression assurée avec nos coachs certifiés et programmes sur mesure",
    tag: "EXCELLENCE",
    icon: <Zap size={20} />
  },
  {
    url: "/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-32897038.jpg",
    title: "TOURNOIS & COMPÉTITION",
    desc: "Rejoignez l'arène et affrontez les meilleurs joueurs de la région",
    tag: "INTENSITÉ",
    icon: <Star size={20} />
  },
  {
    url: "/IMAGES/IMAGES CARROUSEL/pexels-anhelina-vasylyk-734724285-35248310.jpg",
    title: "INFRASTRUCTURES PRO",
    desc: "7 terrains panoramiques dernière génération pour un jeu fluide",
    tag: "PREMIUM",
    icon: <ShieldCheck size={20} />
  },
  {
    url: "/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-34285600.jpg",
    title: "ÉVÉNEMENTS CORPORATE",
    desc: "Renforcez la cohésion de vos équipes dans un cadre sportif unique",
    tag: "ENTREPRISE",
    icon: <Activity size={20} />
  },
  {
    url: "/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-33226057.jpg",
    title: "CLUB HOUSE ARENA",
    desc: "Un espace détente pour débriefer vos matchs autour d'un verre",
    tag: "RELAXATION",
    icon: <Activity size={20} />
  },
  {
    url: "/IMAGES/IMAGES CARROUSEL/pexels-ollivves-1103829.jpg",
    title: "ÉCOLE DE PADEL JEUNES",
    desc: "Former les champions de demain dès le plus jeune âge",
    tag: "JEUNESSE",
    icon: <Star size={20} />
  }
];

export const Infrastructure = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slideToIndex = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const next = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <section className="py-16 md:py-24 bg-dark-bg relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-padel-blue/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-padel-yellow/20 to-transparent" />

      <div className="max-w-[1500px] mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-1 h-1 rounded-full bg-padel-blue animate-pulse" />
            <span className="text-[9px] font-black tracking-[0.4em] text-padel-blue uppercase">NOTRE ARENA</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-black tracking-tighter leading-[0.9] uppercase"
          >
            CHAQUE MATCH EST <br />
            <span className="text-padel-yellow italic">UNE HISTOIRE</span>
          </motion.h2>
        </div>

        {/* 3D Carousel Section */}
        <div className="relative h-[420px] md:h-[580px] flex items-center justify-center perspective-[2000px]">
          <div className="absolute inset-0 flex items-center justify-center">

            {/* Carousel Navigation Buttons */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-2 md:px-8 z-50 pointer-events-none">
              <button
                onClick={prev}
                className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/10 bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-padel-blue hover:border-padel-blue transition-all group pointer-events-auto"
              >
                <ChevronLeft size={24} className="text-white transform group-hover:-translate-x-1 transition-transform" />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/10 bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-padel-yellow hover:border-padel-yellow transition-all group pointer-events-auto"
              >
                <ChevronRight size={24} className="text-white transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Carousel Tracks */}
            <div className="relative w-full h-full flex items-center justify-center">
              {[...Array(3)].map((_, i) => {
                let index = 0;
                let position = i - 1; // -1 (prev), 0 (current), 1 (next)

                if (position === -1) index = (currentIndex - 1 + carouselImages.length) % carouselImages.length;
                else if (position === 0) index = currentIndex;
                else index = (currentIndex + 1) % carouselImages.length;

                const isActive = position === 0;

                return (
                  <motion.div
                    key={`${index}-${position}`}
                    initial={false}
                    animate={{
                      x: position * (typeof window !== 'undefined' && window.innerWidth < 768 ? 180 : 400),
                      scale: isActive ? 1 : 0.72,
                      z: isActive ? 0 : -250,
                      opacity: isActive ? 1 : 0.35,
                      rotateY: position * -25,
                      filter: isActive ? 'grayscale(0%)' : 'grayscale(40%)',
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 30
                    }}
                    className={cn(
                      "absolute w-[260px] sm:w-[350px] md:w-[450px] lg:w-[580px] aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-700",
                      isActive ? "z-40" : "z-20 cursor-pointer"
                    )}
                    onClick={() => !isActive && slideToIndex(index)}
                  >
                    <img
                      src={carouselImages[index].url}
                      alt={carouselImages[index].title}
                      className="w-full h-full object-cover"
                    />

                    {/* Active Slide Info Overlay */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.4 }}
                          className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 text-center z-10"
                        >
                          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent" />

                          <div className="relative z-20">
                            <motion.div
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-padel-blue/30 border border-padel-blue/50 backdrop-blur-md mb-4"
                            >
                              <span className="text-padel-blue">{carouselImages[index].icon}</span>
                              <span className="text-[9px] font-black tracking-widest text-white uppercase">{carouselImages[index].tag}</span>
                            </motion.div>

                            <h3 className="text-2xl md:text-4xl lg:text-5xl font-display font-black tracking-tighter text-white mb-4 uppercase leading-none">
                              {carouselImages[index].title}
                            </h3>

                            <p className="text-xs md:text-base text-white/70 max-w-md mx-auto leading-relaxed">
                              {carouselImages[index].desc}
                            </p>

                            {/* CTA inside active slide */}
                            <Link to='/reservation'>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="mt-8 px-6 py-2.5 bg-padel-yellow text-padel-blue rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl"
                              >
                                RÉSERVER MAINTENANT
                              </motion.button>
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Overlay for non-active slides */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-black/40 hover:bg-black/20 transition-colors" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="mt-12 md:mt-24 flex justify-center items-center gap-2.5">
          {carouselImages.map((_, i) => (
            <button
              key={i}
              onClick={() => slideToIndex(i)}
              className={cn(
                "h-1.5 transition-all duration-700 rounded-full",
                currentIndex === i
                  ? "w-8 md:w-12 bg-padel-blue"
                  : "w-1.5 md:w-2 bg-white/10 hover:bg-white/30"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
