import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import { Target, Trophy, GraduationCap, Briefcase, ArrowRight, UserCheck, ShoppingBag, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

const activities = [
  {
    title: "ACADÉMIE",
    subtitle: "KIDS & ADULTS",
    icon: <GraduationCap size={24} />,
    image: "/IMAGES/artur-kornakov-ArI-foyWnfA-unsplash.jpg",
    desc: "Des cours structurés pour enfants et adultes, encadrés par des coachs certifiés pour une progression fulgurante.",
    tag: "FORMATION"
  },
  {
    title: "COACHING",
    subtitle: "SUR MESURE",
    icon: <Target size={24} />,
    image: "/IMAGES/IMG_4503.JPG",
    desc: "Séances individuelles haute performance utilisant l'analyse vidéo pour corriger chaque mouvement.",
    tag: "ELITE"
  },
  {
    title: "STAGES",
    subtitle: "INTENSIF",
    icon: <Sparkles size={24} />,
    image: "/IMAGES/oskar-hagberg-uJlPtLTZT7c-unsplash.jpg",
    desc: "Vivez l'expérience d'un pro pendant un week-end avec nos stages thématiques en immersion totale.",
    tag: "IMMERSION"
  },
  {
    title: "EVENTS",
    subtitle: "CORPORATE",
    icon: <Briefcase size={24} />,
    image: "/IMAGES/todd-trapani-sI-p_NLBNr0-unsplash.jpg",
    desc: "Team building, séminaires et événements exclusifs pour souder vos équipes autour des valeurs du sport.",
    tag: "BUSINESS"
  }
];

interface Activity {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  image: string;
  desc: string;
  tag: string;
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
      className="relative aspect-[3/4] md:aspect-[4/6] xl:aspect-[3/4] w-full rounded-[2rem] md:rounded-[3rem] cursor-pointer group"
    >
      <div
        style={{ transform: "translateZ(30px)" }}
        className="absolute inset-0 rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-[#0a0a0a]"
      >
        <img
          src={activity.image}
          alt={activity.title}
          className="absolute inset-0 w-full h-full object-cover grayscale-[20%] blur-[2px] group-hover:grayscale-0 group-hover:blur-[0px] transition-all duration-1000 scale-105 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

        {/* Content Overlay */}
        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div
              style={{ transform: "translateZ(20px)" }}
              className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white group-hover:bg-padel-blue group-hover:border-padel-blue transition-all duration-500"
            >
              {activity.icon}
            </div>
            <span className="text-[9px] font-black tracking-[0.4em] text-padel-yellow uppercase">{activity.tag}</span>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-padel-yellow text-[10px] font-black tracking-[0.3em] uppercase mb-1">{activity.subtitle}</p>
              <h4
                style={{ transform: "translateZ(40px)" }}
                className="text-4xl md:text-5xl font-display font-black tracking-tighter text-white uppercase leading-none"
              >
                {activity.title}
              </h4>
            </div>

            <p
              style={{ transform: "translateZ(10px)" }}
              className="text-white/80 text-[16px] md:text-xs leading-relaxed font-medium max-w-[280px] group-hover:text-white/60 transition-colors h-24 line-clamp-4"
            >
              {activity.desc}
            </p>

            <div className="flex items-center gap-4 pt-4 group/btn">
              <div className="h-[1px] w-8 bg-white/20 group-hover:w-16 group-hover:bg-padel-blue transition-all duration-700" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">REJOINDRE</span>
              <ArrowRight size={14} className="text-padel-blue group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Outer Glow */}
      <div className="absolute -inset-2 bg-padel-blue/20 rounded-[3.2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
    </motion.div>
  );
};

export const Activities = () => {
  return (
    <section id="activites" className="py-24 md:py-48 px-6 relative overflow-hidden bg-[#050505]">
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
              <div className="w-12 h-[1px] bg-padel-blue" />
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">SERVICES EXCLUSIFS</span>
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase"
            >
              VIVEZ LE PADEL <br />
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

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {activities.map((activity, i) => (
            <ActivityCard key={i} activity={activity} index={i} />
          ))}
        </div>

      </div>

      {/* Background Large Decor Text */}
      <div className="absolute -bottom-20 -left-20 text-[15rem] md:text-[25rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-10 leading-none">
        SERVICES
      </div>
    </section>
  );
};
