import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, LifeBuoy, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const supportChannels = [
  {
    title: "LIVE CONCIERGERIE",
    icon: <MessageSquare size={24} />,
    desc: "Échangez en temps réel avec nos conseillers pour une assistance immédiate sur vos réservations.",
    status: "DISPONIBLE",
    time: "DÉLAI < 2 MIN",
    color: "text-emerald-500",
    bg: "bg-emerald-500/5"
  },
  {
    title: "TICKET STRATÉGIQUE",
    icon: <LifeBuoy size={24} />,
    desc: "Pour les requêtes complexes, coordinations d'événements ou partenariats corporate.",
    status: "ACTIF",
    time: "RÉPONSE < 4H",
    color: "text-padel-blue",
    bg: "bg-padel-blue/5"
  },
  {
    title: "ARENA KNOWLEDGE",
    icon: <ShieldCheck size={24} />,
    desc: "Accédez à notre base de connaissances exhaustive : guides, règles et tutoriels techniques.",
    status: "OPEN 24/7",
    time: "ACCÈS LIBRE",
    color: "text-padel-yellow",
    bg: "bg-padel-yellow/5"
  },
];

export const SupportSection = () => {
  return (
    <section id="support" className="relative py-24 md:py-48 px-6 bg-[#050505] overflow-hidden border-t border-white/[0.03]">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.02] pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-white rounded-full" />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-12 mb-20 md:mb-32 text-center md:text-left">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-padel-blue" />
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">SUPPORT & ASSISTANCE</span>
            </div>
            <h3 className="text-4xl sm:text-5xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase">
              SERVICE <br />
              <span className="text-white italic">PREMIUM 24/7</span>
            </h3>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 rounded-full border border-white/5 flex flex-col items-center justify-center p-6 text-center">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-2 leading-tight">SERVICE RELIABILITY</span>
              <span className="text-2xl font-display font-black text-padel-blue">99.9%</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-32">
          {supportChannels.map((channel, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="group relative glass p-10 md:p-14 rounded-[4rem] border-white/5 hover:border-padel-blue/20 transition-all duration-700 flex flex-col h-full overflow-hidden"
            >
              <div className="flex justify-between items-start mb-12">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110", channel.bg, channel.color)}>
                  {channel.icon}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={cn("text-[9px] font-black tracking-widest uppercase", channel.color)}>{channel.status}</span>
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-tighter">{channel.time}</span>
                </div>
              </div>

              <h4 className="text-2xl font-display font-black mb-6 uppercase tracking-tight group-hover:text-padel-blue transition-colors leading-tight">
                {channel.title}
              </h4>

              <p className="text-sm md:text-base text-white/30 font-medium leading-[1.7] mb-12 flex-grow uppercase tracking-tighter">
                {channel.desc}
              </p>

              <button className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-padel-blue transition-colors group/btn">
                ACTIVER LE SERVICE <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </button>

              {/* Background gradient hover effect */}
              <div className={cn("absolute bottom-0 right-0 w-32 h-32 blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity duration-1000", channel.bg)} />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Block */}
        <div className="relative glass p-12 md:p-20 rounded-[4rem] border-white/10 overflow-hidden group">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 blur-3xl -z-0 bg-padel-blue/20 translate-x-1/2 group-hover:translate-x-0 transition-transform duration-[2s]" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
              <div className="w-24 h-24 rounded-full bg-padel-blue/10 border border-padel-blue/20 flex items-center justify-center text-padel-blue">
                <Zap size={48} className="animate-pulse" />
              </div>
              <div>
                <h4 className="text-2xl md:text-5xl font-display font-black uppercase tracking-tighter mb-4">ASSISTANCE TECHNIQUE <span className="text-padel-blue italic">PRO</span></h4>
                <p className="text-white/30 text-sm md:text-lg font-medium max-w-xl leading-relaxed uppercase tracking-tighter">
                  Un dysfonctionnement sur la plateforme ou votre espace membre ? Nos ingénieurs interviennent en priorité absolue pour rétablir votre accès.
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full lg:w-auto px-12 py-7 bg-padel-blue text-white rounded-full font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl relative overflow-hidden group/btn"
            >
              <span className="relative z-10">OUVRIR UN TICKET URGENCE</span>
              <div className="absolute inset-0 bg-padel-yellow translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};
