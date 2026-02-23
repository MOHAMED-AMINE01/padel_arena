import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Filter, ChevronLeft, ChevronRight, Search, Zap, Clock, LayoutGrid, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const hours = Array.from({ length: 15 }, (_, i) => i + 8); // 8h to 22h
const courts = ["ARENA #1", "ARENA #2", "ARENA #3"];

const mockEvents = [
  { id: 1, court: "ARENA #1", start: 9, duration: 1.5, type: "MATCH", title: "DÉFIS ÉLITE", color: "bg-padel-blue" },
  { id: 2, court: "ARENA #2", start: 11, duration: 1, type: "ACADEMY", title: "COACHING PRO", color: "bg-padel-yellow text-padel-blue" },
  { id: 3, court: "ARENA #3", start: 14, duration: 2, type: "EVENT", title: "TOURNOI MASTERS", color: "bg-white/10" },
  { id: 4, court: "ARENA #1", start: 17, duration: 1.5, type: "OPEN", title: "SESSION LIBRE", color: "bg-padel-blue" },
];

export const RealTimePlanning = () => {
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');

  return (
    <section id="planning" className="relative py-24 md:py-48 px-6 bg-[#050505] overflow-hidden border-t border-white/[0.03]">
      {/* Background Decor */}
      <div className="absolute top-0 right-[10%] w-[1px] h-full bg-white opacity-[0.02] z-0" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20 md:mb-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-padel-blue" />
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">PLANNING LIVE</span>
            </div>
            <h3 className="text-4xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase">
              RÉSEAU <br />
              <span className="text-white italic">DISPONIBILITÉS</span>
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex glass rounded-[2rem] p-1.5 border-white/10">
              {['day', 'week', 'month'].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v as any)}
                  className={cn(
                    "px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500",
                    view === v ? "bg-padel-blue text-white shadow-xl" : "text-white/30 hover:text-white"
                  )}
                >
                  {v === 'day' ? 'DAILY' : v === 'week' ? 'WEEKLY' : 'MONTHLY'}
                </button>
              ))}
            </div>
            <button className="w-14 h-14 glass rounded-2xl border-white/10 text-white/40 hover:text-padel-blue hover:border-padel-blue transition-all flex items-center justify-center">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="glass rounded-[4rem] border-white/5 overflow-hidden shadow-2xl relative">
          {/* Calendar Header */}
          <div className="bg-white/[0.02] p-10 md:p-14 flex flex-col md:flex-row justify-between items-center gap-10 border-b border-white/[0.05]">
            <div className="flex items-center gap-10">
              <div className="flex gap-4">
                <button className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-white/20 hover:text-padel-blue hover:border-padel-blue transition-all shadow-lg group">
                  <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <button className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-white/20 hover:text-padel-blue hover:border-padel-blue transition-all shadow-lg group">
                  <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-2 leading-none">CURRENT TIMELINE</p>
                <h4 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tighter leading-none">
                  LUNDI <span className="text-padel-blue">23</span> FÉVRIER
                </h4>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-10 bg-white/[0.03] px-10 py-4 rounded-full border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-padel-blue" />
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none">MATCH</span>
              </div>
              <div className="w-[1px] h-4 bg-white/10" />
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-padel-yellow" />
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none">ACADEMY</span>
              </div>
              <div className="w-[1px] h-4 bg-white/10" />
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-white/40" />
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none">EVENT</span>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="relative overflow-x-auto no-scrollbar">
            <div className="min-w-[1000px]">
              <div className="grid grid-cols-[140px_repeat(3,1fr)]">
                <div className="p-8 border-r border-white/5 bg-white/[0.01]" />
                {courts.map(court => (
                  <div key={court} className="p-8 text-center bg-white/[0.01] border-r border-white/5 last:border-r-0">
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-2 leading-none italic">ARENA STATION</span>
                      <span className="text-xl font-display font-black uppercase tracking-widest text-white">{court}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative">
                {hours.map(hour => (
                  <div key={hour} className="grid grid-cols-[140px_repeat(3,1fr)] h-24 border-t border-white/[0.03]">
                    <div className="p-8 text-right bg-white/[0.01] border-r border-white/5">
                      <span className="text-xs font-black text-white/20 uppercase tracking-widest">{hour}:00</span>
                    </div>
                    <div className="border-r border-white/[0.03] relative">
                      <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-padel-blue/5 transition-opacity flex items-center justify-center">
                        <button className="w-8 h-8 rounded-full bg-padel-blue flex items-center justify-center text-white">
                          <Zap size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="border-r border-white/[0.03]" />
                    <div />
                  </div>
                ))}

                {/* Events Overlay */}
                {mockEvents.map(event => {
                  const courtIdx = courts.indexOf(event.court);
                  const top = (event.start - 8) * 96; // 96px is row height (24 * 4)
                  const height = event.duration * 96;
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      style={{
                        position: 'absolute',
                        top: `${top}px`,
                        left: `${140 + (courtIdx * (100 / 3))}%`,
                        width: `${100 / 3}%`,
                        height: `${height}px`,
                        padding: '10px'
                      }}
                      className="group"
                    >
                      <div className={cn(
                        "w-full h-full rounded-[2rem] p-6 border border-white/10 shadow-3xl flex flex-col justify-between transition-all duration-700 cursor-pointer overflow-hidden relative",
                        event.color
                      )}>
                        {/* Event Decor */}
                        <div className="absolute top-0 right-0 p-8 opacity-[0.05] -rotate-12 translate-x-4 -translate-y-4 group-hover:rotate-0 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-1000">
                          {event.type === 'MATCH' ? <Zap size={80} /> : event.type === 'ACADEMY' ? <LayoutGrid size={80} /> : <CalendarIcon size={80} />}
                        </div>

                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60">{event.type}</span>
                          </div>
                          <div className="text-sm md:text-lg font-display font-black uppercase leading-tight tracking-tight">{event.title}</div>
                        </div>

                        <div className="relative z-10 flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-2">
                            <Clock size={12} className="opacity-40" />
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{event.start}:00 — {event.start + event.duration}:00</span>
                          </div>
                          <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Global Statistics Footer */}
        <div className="mt-20 grid md:grid-cols-4 gap-10">
          {[
            { label: "TAUZE D'OCCUPATION", value: "88%", desc: "Dernières 24h" },
            { label: "MATCHS RÉSEAU", value: "42", desc: "Sessions live" },
            { label: "DISPO PROCHAINES 48H", value: "12", desc: "Créneaux libres" },
            { label: "TEMPS MOYEN SÉANCE", value: "90", desc: "Minutes" },
          ].map((stat, i) => (
            <div key={i} className="glass p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-padel-blue scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700" />
              <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] mb-4">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <h5 className="text-4xl font-display font-black text-white">{stat.value}</h5>
                <span className="text-[10px] font-bold text-padel-blue uppercase">{stat.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
