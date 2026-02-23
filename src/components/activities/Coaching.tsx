import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Video, Target, Zap, Users, User, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const coachingTypes = [
  {
    title: "INITIATION DÉBUTANTS",
    desc: "Apprenez les bases du padel : placement, prises de raquette et règles du jeu.",
    icon: "01",
    image: "/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-33226056.jpg"
  },
  {
    title: "PERFECTIONNEMENT",
    desc: "Affinez votre technique et votre sens tactique pour passer au niveau supérieur.",
    icon: "02",
    image: "/IMAGES/IMG_4503.JPG"
  },
  {
    title: "PRÉPARATION COMPÉTITON",
    desc: "Entraînement intensif axé sur la performance et la stratégie de match.",
    icon: "03",
    image: "/IMAGES/Image de présentation.png"
  },
  {
    title: "COACHING EN GROUPE",
    desc: "Progressez ensemble dans une ambiance dynamique et conviviale.",
    icon: "04",
    image: "/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-33226057.jpg"
  },
  {
    title: "COACHING INDIVIDUEL",
    desc: "Un programme 100% personnalisé pour une progression ultra-rapide.",
    icon: "05",
    image: "/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-32897038.jpg"
  }
];

const features = [
  { title: "Analyse Vidéo", icon: <Video size={20} /> },
  { title: "Correction Technique", icon: <Target size={20} /> },
  { title: "Stratégie de Jeu", icon: <Zap size={20} /> },
  { title: "Préparation Physique", icon: <Users size={20} /> },
  { title: "Mental Coaching", icon: <User size={20} /> },
];

export const Coaching = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, offsetWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / offsetWidth);
      setActiveIndex(index);
    }
  };

  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * scrollRef.current.offsetWidth,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  return (
    <section id="coaching" className="relative py-24 md:py-48 px-6 bg-[#050505] overflow-hidden">
      {/* Editorial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[25%]" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white mr-[25%]" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
          <div className="max-w-3xl text-center lg:text-left">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-padel-blue" />
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">FORMATION & COACHING</span>
            </div>
            <h3 className="text-4xl sm:text-5xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase">
              PROGRESSE. <br />
              <span className="text-white italic">DOMINE LE TERRAIN.</span>
            </h3>
          </div>
        </div>

        {/* Coaching Cards with Mobile Scroll */}
        <div className="relative mb-32">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex lg:grid lg:grid-cols-5 gap-6 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory no-scrollbar pb-10 lg:pb-0"
          >
            {coachingTypes.map((type, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="min-w-[85vw] sm:min-w-[380px] lg:min-w-0 snap-center group relative glass rounded-[2.5rem] overflow-hidden border-white/5 hover:border-padel-blue/20 transition-all duration-700"
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img
                    src={type.image}
                    alt={type.title}
                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
                  <div className="absolute top-6 left-6 text-4xl font-display font-black text-white/10 group-hover:text-padel-blue transition-colors">
                    {type.icon}
                  </div>
                </div>
                <div className="p-8 md:p-10">
                  <h4 className="text-xl font-display font-black mb-4 group-hover:text-padel-blue transition-colors uppercase leading-tight">
                    {type.title}
                  </h4>
                  <p className="text-xs md:text-sm text-white/30 font-medium leading-relaxed group-hover:text-white/50 transition-colors">
                    {type.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination Indicators */}
          <div className="flex lg:hidden justify-center items-center gap-3 mt-4">
            {coachingTypes.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={cn(
                  "h-1.5 transition-all duration-500 rounded-full",
                  activeIndex === i ? "w-8 bg-padel-blue" : "w-1.5 bg-white/10"
                )}
              />
            ))}
          </div>
        </div>

        {/* Method & Roadmap Section */}
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-12 xl:col-span-7"
          >
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-padel-yellow" />
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-yellow uppercase">NOTRE MÉTHODOLOGIE</span>
            </div>
            <h3 className="text-4xl md:text-6xl font-display font-black tracking-tighter mb-12 uppercase leading-[0.9]">
              UNE APPROCHE <br />
              <span className="text-white italic">SCIENTIFIQUE DU JEU</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f, i) => (
                <div key={i} className="group flex flex-col gap-6 p-10 glass rounded-[2.5rem] border-white/5 hover:border-padel-blue/20 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-padel-blue group-hover:bg-padel-blue group-hover:text-white transition-all">
                    {f.icon}
                  </div>
                  <div>
                    <h5 className="text-[11px] font-black text-white tracking-[0.2em] uppercase mb-2">{f.title}</h5>
                    <p className="text-xs text-white/20 font-medium leading-relaxed">Optimization & Data</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Roadmap Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-12 xl:col-span-5 bg-padel-blue p-12 md:p-16 rounded-[4rem] relative overflow-hidden"
          >
            <div className="relative z-10">
              <h4 className="text-3xl md:text-4xl font-display font-black mb-12 uppercase text-white tracking-tight leading-none">
                VOTRE PARCOURS <br />
                <span className="opacity-40">DE PROGRESSION</span>
              </h4>
              <div className="space-y-10">
                {[
                  "Évaluation de niveau initial",
                  "Choix du coach expert",
                  "Planification flexible",
                  "Suivi analytique post-séance",
                  "Validation des acquis"
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-8 group">
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center font-display font-black text-white shrink-0 group-hover:bg-white group-hover:text-padel-blue transition-all">
                      0{i + 1}
                    </div>
                    <span className="text-base md:text-lg text-white font-medium group-hover:translate-x-2 transition-transform">{step}</span>
                  </div>
                ))}
              </div>

              <button className="w-full mt-16 py-6 bg-white text-padel-blue rounded-full font-black text-[10px] tracking-[0.3em] uppercase hover:bg-padel-yellow hover:text-padel-blue transition-all flex items-center justify-center gap-4">
                COMMENCER MAINTENANT <ArrowUpRight size={16} />
              </button>
            </div>

            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
