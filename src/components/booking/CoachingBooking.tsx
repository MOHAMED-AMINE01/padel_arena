import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Calendar as CalendarIcon, Clock, ArrowRight, CheckCircle2, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const coaches = [
  { id: 1, name: "LUCAS MARTIN", role: "HEAD COACH", level: "EXPERT", rating: 4.9, image: "/IMAGES/ACTIVITIES - COACHING/pexels-atbo-245208.jpg", specialties: ["TECHNIQUE", "TACTIQUE"], exp: "12 ANS" },
  { id: 2, name: "SOPHIE BERNARD", role: "COACH SENIOR", level: "PRO", rating: 4.8, image: "/IMAGES/ACTIVITIES - COACHING/pexels-atbo-245208.jpg", specialties: ["INITIATION", "KIDS"], exp: "8 ANS" },
  { id: 3, name: "MARC LEFEBVRE", role: "COACH COMPETITION", level: "EXPERT", rating: 5.0, image: "/IMAGES/ACTIVITIES - COACHING/pexels-atbo-245208.jpg", specialties: ["PERFORM", "PHYSICAL"], exp: "15 ANS" },
];

export const CoachingBooking = () => {
  const [selectedCoach, setSelectedCoach] = useState<number | null>(null);

  return (
    <section id="coaching" className="relative py-24 md:py-48 px-6 bg-[#050505] overflow-hidden border-t border-white/[0.03]">
      {/* Editorial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[25%]" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white mr-[25%]" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-12 mb-20 md:mb-32">
          <div className="max-w-3xl text-center md:text-left">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-padel-blue" />
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">ACADEMY & COACHING</span>
            </div>
            <h3 className="text-4xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase">
              L'EXCELLENCE <br />
              <span className="text-white italic">SUR MESURE</span>
            </h3>
          </div>
          <div className="p-8 glass rounded-[2.5rem] border-white/5 bg-white/[0.01] flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-padel-blue/10 flex items-center justify-center text-padel-blue">
              <ShieldCheck size={28} />
            </div>
            <div>
              <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">COACHS CERTIFIÉS</p>
              <p className="text-lg font-display font-black text-white uppercase tracking-tight">LABEL ARENA PRO</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-24">
          {coaches.map((coach) => (
            <motion.div
              key={coach.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => setSelectedCoach(coach.id)}
              className={cn(
                "group relative glass rounded-[4rem] overflow-hidden border transition-all duration-700 cursor-pointer flex flex-col h-full bg-[#0F0F0F]",
                selectedCoach === coach.id ? "border-padel-blue ring-4 ring-padel-blue/10 scale-[1.02] shadow-3xl" : "border-white/5 hover:border-white/20"
              )}
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                <img src={coach.image} alt={coach.name} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent opacity-80" />

                <div className="absolute top-8 right-8 glass px-4 py-2 rounded-2xl flex items-center gap-3 border-white/10 z-20">
                  <Star size={14} className="text-padel-yellow fill-padel-yellow" />
                  <span className="text-xs font-black text-white">{coach.rating}</span>
                </div>

                <div className="absolute bottom-10 left-10 right-10 z-20">
                  <p className="text-[10px] font-black text-padel-blue uppercase tracking-[0.4em] mb-3 leading-none italic">{coach.role}</p>
                  <h4 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tighter leading-none mb-1 group-hover:text-padel-blue transition-colors">
                    {coach.name}
                  </h4>
                </div>
              </div>

              <div className="p-10 border-t border-white/5 flex flex-col flex-grow bg-white/[0.01]">
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/[0.03]">
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">XP ARENA</p>
                    <p className="text-sm font-black text-white">{coach.exp}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/[0.03]">
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">NIVEAU</p>
                    <p className="text-sm font-black text-padel-yellow">{coach.level}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-10">
                  {coach.specialties.map(s => (
                    <span key={s} className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-[9px] font-black text-white/40 uppercase tracking-widest">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  <button className={cn(
                    "w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-4 group/btn",
                    selectedCoach === coach.id ? "bg-padel-blue text-white shadow-xl" : "bg-white/5 text-white/40 group-hover:bg-white/10"
                  )}>
                    {selectedCoach === coach.id ? "COACH SÉLECTIONNÉ" : "SELECT COACHING"}
                    {selectedCoach === coach.id ? <CheckCircle2 size={18} /> : <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />}
                  </button>
                </div>
              </div>

              {/* Background decor */}
              <div className="absolute top-0 left-0 p-12 opacity-[0.02] text-[10rem] font-display font-black pointer-events-none -translate-x-12 -translate-y-12">
                {coach.name[0]}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Selected Coach Step (Booking) */}
        <AnimatePresence>
          {selectedCoach && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.98 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="relative glass p-12 md:p-20 rounded-[4rem] border-white/10 shadow-3xl bg-gradient-to-br from-padel-blue/20 to-transparent overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-20 opacity-[0.03] text-white rotate-12 z-0">
                <Clock size={300} />
              </div>

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
                <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-padel-blue text-white flex items-center justify-center shadow-3xl">
                    <Zap size={48} className="animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tighter mb-4">PERSONNALISEZ <br /><span className="text-padel-blue italic">VOTRE SESSION</span></h4>
                    <p className="text-sm md:text-lg text-white/40 font-medium max-w-xl leading-relaxed uppercase tracking-tighter">
                      CONFIGUREZ VOTRE PROGRAMME TECHNIQUE, LES MODALITÉS DE COACHING ET LES CRÉNEAUX DISPONIBLES.
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-14 py-8 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-[0.5em] shadow-3xl overflow-hidden transition-all"
                >
                  <span className="relative z-10 flex items-center gap-6 group-hover:text-white transition-colors">
                    ACTIVER LE PLANNING
                    <CalendarIcon size={20} />
                  </span>
                  <div className="absolute inset-0 bg-padel-blue translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-10 right-10 text-[15rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-0 leading-none uppercase">
        COACHING
      </div>
    </section>
  );
};
