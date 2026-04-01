import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, Star, Target, Activity } from 'lucide-react';

const stats = [
  { label: "TERRAINS DE PADEL", value: "03", icon: <Target size={18} />, color: "text-padel-blue" },
  { label: "M² DE SURFACE", value: "1600", icon: <Activity size={18} />, color: "text-white" },
  { label: "DISCIPLINES INDOOR", value: "04", icon: <Star size={18} />, color: "text-padel-yellow" },
  { label: "CLUB-HOUSE BAR", value: "01", icon: <Trophy size={18} />, color: "text-white" },
];

export const ClubStats = () => {
  return (
    <div className="relative py-16 md:py-20 border-y border-white/[0.03] bg-[#080808] overflow-hidden">
      {/* Decorative Background Accent */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-padel-blue to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-padel-yellow to-transparent" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="relative flex flex-col items-center lg:items-start text-center lg:text-left group"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-[1px] bg-white/10 group-hover:w-12 transition-all duration-500" />
                <div className="text-padel-blue opacity-50">{stat.icon}</div>
              </div>

              <div className={`text-5xl md:text-7xl font-display font-black tracking-tighter mb-4 ${stat.color} transition-transform group-hover:scale-105 duration-700`}>
                {stat.value}
              </div>

              <div className="relative">
                <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] leading-none mb-2">
                  {stat.label}
                </h4>
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-padel-blue opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Subtle Progress Bar */}
              <div className="w-full h-[2px] bg-white/5 mt-6 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5 + i * 0.1 }}
                  className={`h-full bg-current ${stat.color} opacity-20`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
