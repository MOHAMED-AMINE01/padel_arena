import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { Target, Trophy, GraduationCap, Briefcase, ArrowRight, UserCheck, ShoppingBag, Sparkles, ChevronLeft, ChevronRight, Mail, Phone } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const activities = [
  {
    title: "ACADÉMIE",
    subtitle: "ENFANTS & ADULTES",
    icon: <GraduationCap size={24} />,
    image: "/IMAGES/artur-kornakov-ArI-foyWnfA-unsplash.jpg",
    desc: "Des cours structurés pour enfants et adultes, encadrés par des coachs certifiés pour une progression fulgurante.",
    tag: "FORMATION",
    link: "/contact",
    cta: "S'INSCRIRE"
  },
  {
    title: "ENTRAÎNEMENT",
    subtitle: "SUR MESURE",
    icon: <Target size={24} />,
    image: "/IMAGES/IMG_4503.JPG",
    desc: "Séances individuelles haute performance utilisant l'analyse vidéo pour corriger chaque mouvement.",
    tag: "ÉLITE",
    link: "/contact",
    cta: "PRENDRE RDV"
  },
  {
    title: "ÉVÉNEMENTS",
    subtitle: "ENTREPRISE",
    icon: <Briefcase size={24} />,
    image: "/IMAGES/todd-trapani-sI-p_NLBNr0-unsplash.jpg",
    desc: "Team building, séminaires et événements exclusifs pour souder vos équipes autour des valeurs du sport.",
    tag: "AFFAIRES",
    link: "/contact",
    cta: "NOUS CONTACTER"
  }
];

interface Activity {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  image: string;
  desc: string;
  tag: string;
  link: string;
  cta: string;
}

const ActivityCard: React.FC<{ activity: Activity, index: number }> = ({ activity, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  // Smooth tilt effect
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.23, 1, 0.32, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative aspect-[4/3] sm:aspect-[3/4] md:aspect-[4/6] xl:aspect-[3/4] w-full rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[3rem] cursor-pointer group"
    >
      <div
        style={{ transform: "translateZ(30px)" }}
        className="absolute inset-0 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-[#0a0a0a]"
      >
        <img
          src={activity.image}
          alt={activity.title}
          className="absolute inset-0 w-full h-full object-cover grayscale-[20%] blur-[2px] group-hover:grayscale-0 group-hover:blur-[0px] transition-all duration-1000 scale-105 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

        {/* Content Overlay */}
        <div className="absolute inset-0 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col">
          <div className="flex justify-between items-center mb-auto">
            <div
              style={{ transform: "translateZ(20px)" }}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white group-hover:bg-padel-blue group-hover:border-padel-blue transition-all duration-500"
            >
              {activity.icon}
            </div>
            <span className="text-[8px] sm:text-[9px] font-black tracking-[0.3em] sm:tracking-[0.4em] text-padel-yellow uppercase">{activity.subtitle}</span>
          </div>

          <div className="space-y-3 sm:space-y-4 text-center mt-auto mb-auto">
            <div>
              <h4
                style={{ transform: "translateZ(40px)" }}
                className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-display font-black tracking-tighter text-white uppercase leading-none"
              >
                {activity.title}
              </h4>
            </div>

            <p
              style={{ transform: "translateZ(10px)" }}
              className="text-white/80 text-xs sm:text-sm md:text-base leading-relaxed font-medium max-w-[280px] mx-auto group-hover:text-white/60 transition-colors line-clamp-3 sm:line-clamp-4"
            >
              {activity.desc}
            </p>
          </div>

          <Link
            to={activity.link}
            className="flex items-center justify-center gap-3 sm:gap-4 pt-4 mt-auto group/btn"
          >
            <div className="h-[1px] w-6 sm:w-8 bg-white/20 group-hover:w-12 sm:group-hover:w-16 group-hover:bg-padel-blue transition-all duration-700" />
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white group-hover:text-padel-yellow transition-colors duration-300">{activity.cta}</span>
            <ArrowRight size={14} className="text-padel-blue group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Outer Glow */}
      <div className="absolute -inset-2 bg-padel-blue/20 rounded-[3.2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
    </motion.div>
  );
};

export const Activities = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % activities.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + activities.length) % activities.length);
  };

  return (
    <section id="activites" className="py-16 sm:py-24 md:py-24 px-4 sm:px-6 relative overflow-hidden bg-[#050505]">
      {/* Editorial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[25%]" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white mr-[25%]" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-start justify-between mb-20 md:mb-32 gap-12">
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-4 mb-8"
            >
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">Nos services</span>
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase"
            >
              VIVEZ LE <span className="notranslate" translate="no">PADEL</span> <br />
              <span className="text-white italic">SOUS TOUTES SES</span> <br />
              <span className="text-padel-blue">COULEURS</span>
            </motion.h3>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:pt-20"
          >
            <p className="text-white/40 max-w-sm text-base font-medium leading-relaxed">
              Nous avons repensé l'offre de services pour qu'elle s'adapte à votre style de vie. Plus qu'une simple partie, c'est un écosystème complet dédié à votre passion.
            </p>
          </motion.div>
        </div>

        {/* Dynamic Grid Layout - Desktop */}
        <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-35">
          {activities.map((activity, i) => (
            <ActivityCard key={i} activity={activity} index={i}
            />
          ))}
        </div>

        {/* Mobile Carousel with Pagination */}
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
                <ActivityCard activity={activities[currentIndex]} index={0} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-padel-blue hover:border-padel-blue transition-all"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {activities.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    currentIndex === i
                      ? "w-6 bg-padel-blue"
                      : "bg-white/20 hover:bg-white/40"
                  )}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-padel-blue hover:border-padel-blue transition-all"
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
