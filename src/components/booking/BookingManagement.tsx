import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, RefreshCw, XCircle, ArrowRight, Info, LayoutGrid, Clock, Calendar as CalendarIcon, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const upcoming = [
  { id: "ARENA-9012", date: "DEMAIN, 24 FÉV", time: "18:30", court: "ARENA #1", type: "SESSION", canCancel: true },
  { id: "ARENA-9105", date: "SAMEDI, 27 FÉV", time: "10:00", court: "ARENA #2", type: "OPEN MATCH", canCancel: true },
];

export const BookingManagement = () => {
  return (
    <section id="gestion" className="relative py-24 md:py-48 px-6 bg-[#050505] overflow-hidden border-t border-white/[0.03]">
      {/* Editorial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[25%]" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white mr-[25%]" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">

          {/* Rules & Info Section */}
          <div className="lg:col-span-5 sticky top-40">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-4 mb-8">
                <div className="w-12 h-[1px] bg-padel-blue" />
                <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">GESTION & FLEXIBILITÉ</span>
              </div>

              <h3 className="text-4xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase mb-12">
                LIBERTÉ <br />
                <span className="text-white italic">TOTALE</span>
              </h3>

              <p className="text-base md:text-lg text-white/30 font-medium max-w-md mb-16 leading-relaxed uppercase tracking-tighter">
                Orchestrez vos sessions selon vos impératifs. Notre système de gestion dynamique vous offre une agilité absolue sur votre calendrier sportif.
              </p>

              <div className="glass p-10 md:p-14 rounded-[3.5rem] border-padel-blue/20 bg-padel-blue/5 relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 p-20 opacity-[0.03] text-padel-blue rotate-12 group-hover:rotate-0 transition-transform duration-[2s]">
                  <AlertCircle size={200} />
                </div>

                <div className="flex items-center gap-6 mb-8 relative z-10">
                  <div className="w-14 h-14 rounded-[2rem] bg-padel-blue/10 border border-padel-blue/20 flex items-center justify-center text-padel-blue">
                    <Info size={28} />
                  </div>
                  <h4 className="text-xl font-display font-black mb-0 uppercase tracking-tight">POLITIQUE OPS</h4>
                </div>

                <ul className="space-y-6 relative z-10">
                  {[
                    "ANNULATION SANS FRAIS JUSQU'À H-24.",
                    "MODIFICATION INSTANTANÉE JUSQU'À H-12.",
                    "REMBOURSEMENT AUTOMATIQUE SUR WALLET."
                  ].map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-4 text-[10px] font-black text-white/40 uppercase tracking-widest leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-padel-blue mt-1.5 flex-shrink-0" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Upcoming Bookings List */}
          <div className="lg:col-span-7 space-y-10">
            <div className="flex items-center justify-between mb-12 px-8">
              <div>
                <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-2 leading-none">PRÉVISIONS ACTIVITÉ</h4>
                <p className="text-2xl font-display font-black text-white uppercase italic tracking-tighter">{upcoming.length} SESSIONS À VENIR</p>
              </div>
              <div className="w-12 h-12 rounded-2xl glass border border-white/10 flex items-center justify-center text-white/20">
                <LayoutGrid size={20} />
              </div>
            </div>

            {upcoming.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="group relative glass p-10 md:p-14 rounded-[4rem] border-white/5 hover:border-padel-blue/20 transition-all duration-700 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-12">
                  <div className="flex items-center gap-10">
                    <div className="w-16 h-16 rounded-[2rem] bg-padel-blue/10 border border-padel-blue/20 flex items-center justify-center text-padel-blue group-hover:scale-110 transition-transform duration-500">
                      <CalendarIcon size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-black text-padel-blue uppercase tracking-[0.4em]">{item.date}</span>
                        <span className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black text-white/20 uppercase tracking-widest leading-none">{item.type}</span>
                      </div>
                      <h4 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tighter leading-none">{item.court}</h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white/[0.02] px-6 py-3 rounded-full border border-white/5">
                    <Clock size={16} className="text-padel-yellow" />
                    <span className="text-xl font-display font-black text-white">{item.time}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <button className="flex-grow group/btn relative overflow-hidden px-8 py-5 bg-white/[0.03] border border-white/10 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3">
                    <RefreshCw size={16} className="group-hover/btn:rotate-180 transition-transform duration-700" />
                    MODIFIER LA SESSION
                  </button>
                  <button className="flex-grow group/btn relative overflow-hidden px-8 py-5 bg-red-500/5 border border-red-500/10 text-red-500/60 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3">
                    <XCircle size={16} />
                    ANNULER L'ORDRE
                  </button>
                </div>

                {/* Technical details background */}
                <div className="absolute top-0 right-0 p-12 opacity-[0.01] text-[10rem] font-display font-black pointer-events-none select-none -translate-y-8">
                  {item.id}
                </div>
              </motion.div>
            ))}

            <motion.button
              whileHover={{ x: 10 }}
              className="flex items-center gap-6 text-white/20 hover:text-padel-blue transition-all group pt-12 px-8"
            >
              <span className="text-xs font-black uppercase tracking-[0.5em]">ACCÉDER AUX ARCHIVES COMPLÈTES</span>
              <div className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center group-hover:border-padel-blue group-hover:bg-padel-blue/10 transition-all">
                <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 right-10 text-[15rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-0 leading-none uppercase">
        MANAGEMENT
      </div>
    </section>
  );
};
