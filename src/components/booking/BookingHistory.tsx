import React from 'react';
import { motion } from 'motion/react';
import { FileText, Download, Calendar as CalendarIcon, Clock, LayoutGrid, TrendingUp, Wallet, ArrowUpRight, Zap, Target } from 'lucide-react';
import { cn } from '../../lib/utils';

const history = [
  { id: "ARENA-8492", date: "20 FÉV 2026", time: "18:30", court: "ARENA #1", amount: "40.00€", status: "TERMINÉ", type: "SESSION" },
  { id: "ARENA-8415", date: "15 FÉV 2026", time: "12:30", court: "ARENA #3", amount: "51.00€", status: "TERMINÉ", type: "ACADEMY" },
  { id: "ARENA-8390", date: "10 FÉV 2026", time: "20:00", court: "ARENA #2", amount: "32.00€", status: "TERMINÉ", type: "SESSION" },
];

export const BookingHistory = () => {
  return (
    <section id="historique" className="relative py-24 md:py-48 px-6 bg-[#050505] overflow-hidden border-t border-white/[0.03]">
      {/* Background Decor */}
      <div className="absolute top-0 left-[20%] w-[1px] h-full bg-white opacity-[0.02] z-0" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 mb-32">

          {/* Main Log Section */}
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-padel-blue" />
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">LOG ACTIVITÉ</span>
            </div>
            <h3 className="text-4xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase mb-20">
              ARCHIVES <br />
              <span className="text-white italic">DÉTAILLÉES</span>
            </h3>

            <div className="space-y-6">
              {history.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="group relative glass p-8 md:p-12 rounded-[3.5rem] border-white/5 flex flex-wrap items-center justify-between gap-10 hover:border-padel-blue/20 transition-all duration-700 overflow-hidden"
                >
                  <div className="flex items-center gap-10">
                    <div className="w-16 h-16 rounded-[2rem] bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/20 group-hover:bg-padel-blue/10 group-hover:text-padel-blue group-hover:rotate-12 transition-all duration-500">
                      <LayoutGrid size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{item.id}</span>
                        <span className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black text-padel-yellow uppercase tracking-widest leading-none">{item.type}</span>
                      </div>
                      <h4 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight">{item.court}</h4>
                    </div>
                  </div>

                  <div className="flex items-center flex-wrap gap-12 ml-auto md:ml-0">
                    <div className="hidden lg:block space-y-3">
                      <div className="flex items-center gap-3 text-white/20">
                        <CalendarIcon size={16} />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">{item.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-white/20">
                        <Clock size={16} />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">{item.time}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-display font-black text-white group-hover:text-padel-blue transition-colors mb-2">{item.amount}</div>
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none">
                        <CheckCircle2 size={10} />
                        {item.status}
                      </div>
                    </div>

                    <button className="w-12 h-12 rounded-2xl glass border border-white/10 flex items-center justify-center text-white/20 hover:bg-padel-blue hover:text-white hover:border-padel-blue transition-all shadow-xl">
                      <Download size={20} />
                    </button>
                  </div>

                  {/* Background decor text */}
                  <div className="absolute top-0 right-10 p-12 opacity-[0.01] text-8xl font-display font-black pointer-events-none select-none -translate-x-12">
                    SESSION
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats & Finance Sidebar */}
          <div className="lg:col-span-4 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass p-12 rounded-[4rem] border-white/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-white rotate-12 group-hover:rotate-0 transition-transform duration-[2s]">
                <TrendingUp size={120} />
              </div>

              <div className="flex items-center gap-6 mb-12 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-padel-blue/10 flex items-center justify-center text-padel-blue">
                  <TrendingUp size={28} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-1">DATA ANALYSIS</h4>
                  <h5 className="text-2xl font-display font-black text-white uppercase tracking-tight">PROGRESSION</h5>
                </div>
              </div>

              <div className="space-y-10 relative z-10">
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">SESSIONS DISPUTÉES</span>
                    <span className="text-xl font-display font-black text-white">12 / 20</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/[0.03]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '60%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className="h-full bg-padel-blue shadow-[0_0_20px_rgba(19,73,211,0.5)]"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">TEMPS DE JEU TOTAL</span>
                    <span className="text-xl font-display font-black text-white">18.5H</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/[0.03]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '45%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                      className="h-full bg-padel-yellow shadow-[0_0_20px_rgba(255,184,0,0.3)]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass p-12 rounded-[4rem] border-white/5 bg-gradient-to-br from-padel-blue/10 to-transparent relative overflow-hidden group shadow-3xl"
            >
              <div className="absolute bottom-0 right-0 p-10 opacity-[0.03] text-white -rotate-12 group-hover:rotate-0 transition-transform duration-[2s]">
                <Wallet size={120} />
              </div>

              <div className="flex items-center gap-6 mb-10 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-padel-blue flex items-center justify-center text-white shadow-xl">
                  <Wallet size={28} />
                </div>
                <h4 className="text-xl font-display font-black text-white uppercase tracking-tight">ARENA WALLET</h4>
              </div>

              <div className="relative z-10 mb-10">
                <div className="text-5xl md:text-6xl font-display font-black text-white tracking-tighter leading-none mb-3">124.50€</div>
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.3em] leading-loose">SOLDE DISPONIBLE POUR VOS PROCHAINES SESSIONS D'ÉLITE.</p>
              </div>

              <button className="relative w-full group overflow-hidden py-6 bg-white text-black rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] transition-all shadow-2xl relative z-10">
                <span className="relative z-10 group-hover:text-white transition-colors">RECHARGER LE COMPTE</span>
                <div className="absolute inset-0 bg-padel-blue translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </motion.div>

            {/* Loyalty Badge Placeholder */}
            <div className="p-10 border border-dashed border-white/10 rounded-[3rem] text-center">
              <Target size={32} className="mx-auto text-white/10 mb-6" />
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">MEMBRE FONDATEUR VENDÔME</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-10 text-[15rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-0 leading-none uppercase">
        HISTORY
      </div>
    </section>
  );
};

const CheckCircle2 = ({ size, className }: { size?: number, className?: string }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
