import React from 'react';
import { motion } from 'motion/react';
import { Activity, Users, Zap, Trophy, Timer } from 'lucide-react';
import { cn } from '../lib/utils';

const stats = [
  { label: "COURTS OCCUPÉS", value: "08/10", icon: <Activity size={14} />, color: "text-padel-yellow" },
  { label: "JOUEURS ACTUELS", value: "32", icon: <Users size={14} />, color: "text-white" },
  { label: "INTENSITÉ CLUB", value: "94%", icon: <Zap size={14} />, color: "text-padel-blue" },
  { label: "VENDÔME OPEN", value: "J-05", icon: <Timer size={14} />, color: "text-padel-yellow" },
];

export const LiveStats = () => {
  return (
    <div className="relative py-8 md:py-10 border-y border-white/[0.03] bg-white/[0.01] backdrop-blur-sm overflow-hidden group">
      {/* Moving Background Accent */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-padel-blue to-transparent -translate-x-full animate-[shimmer_8s_infinite]" />
      </div>

      <div className="max-w-[1500px] mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

          {/* Live Indicator */}
          <div className="flex items-center gap-6 shrink-0">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-padel-blue shadow-[0_0_15px_rgba(19,73,211,0.5)]" />
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-padel-blue animate-ping opacity-50" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white/30 leading-none mb-1.5">
                STATUS EN DIRECT
              </span>
              <span className="text-xs font-display font-black text-white tracking-widest uppercase">
                ARENA VENDÔME
              </span>
            </div>
          </div>

          {/* Stats Divider (Desktop Only) */}
          <div className="hidden lg:block w-[1px] h-10 bg-white/5" />

          {/* Stats Grid */}
          <div className="flex flex-wrap justify-center lg:justify-between items-center gap-8 md:gap-16 xl:gap-24 flex-grow px-0 lg:px-12">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="flex flex-col items-center lg:items-start gap-1.5 group/item"
              >
                <div className="flex items-center gap-2 text-[9px] font-black tracking-[0.2em] text-white/20 uppercase transition-colors group-hover/item:text-white/40">
                  <span className="text-padel-blue">{stat.icon}</span>
                  {stat.label}
                </div>
                <div className={cn(
                  "text-2xl md:text-3xl font-display font-black tracking-tighter transition-transform group-hover/item:scale-105",
                  stat.color
                )}>
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats Divider (Desktop Only) */}
          <div className="hidden lg:block w-[1px] h-10 bg-white/5" />

          {/* Action Call */}
          <a
            href="https://padelarenavendome.villagepadel.fr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="shrink-0 flex items-center gap-4 py-3 px-8 rounded-full bg-white/[0.03] border border-white/5 hover:bg-padel-blue hover:border-padel-blue transition-all duration-300 group"
            >
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white">RÉSERVER VOTRE MATCH</span>
              <div className="w-6 h-6 rounded-full bg-padel-yellow/10 flex items-center justify-center text-padel-yellow group-hover:bg-white group-hover:text-padel-blue transition-colors">
                <Trophy size={12} />
              </div>
            </motion.button>
          </a>

        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
