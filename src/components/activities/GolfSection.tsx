import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Target, Trophy, Clock, Zap } from 'lucide-react';

export const GolfSection = () => {
  return (
    <section id="golf" className="py-24 px-6 bg-[#050505] relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-4 mb-8">
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">TECHNOLOGIE DE POINTE</span>
            </div>

            <h2 className="text-5xl md:text-8xl font-display font-black mb-10 leading-[0.9] uppercase tracking-tighter">
              SIMULATEUR <br />
              <span className="text-white italic">GOLF INDOOR</span>
            </h2>

            <p className="text-xl text-white/50 mb-12 font-medium leading-relaxed max-w-xl">
              Vivez une immersion totale sur les plus beaux parcours du monde. Notre simulateur haute précision analyse chaque détail de votre swing pour une progression réelle, quel que soit le temps dehors.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {[
                { title: "PRÉCISION ULTIME", icon: <Target className="text-padel-yellow" />, desc: "Analyse balistique haute vitesse." },
                { title: "PARCOURS MYTHIQUES", icon: <Trophy className="text-padel-yellow" />, desc: "Jouez à Pebble Beach ou St Andrews." },
              ].map((item, i) => (
                <div key={i} className="flex gap-5">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-white uppercase tracking-wider mb-1">{item.title}</h4>
                    <p className="text-xs text-white/30 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/reservation?sport=Golf" className="relative group inline-block">
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(19, 73, 211, 0.2)",
                    "0 0 40px rgba(19, 73, 211, 0.4)",
                    "0 0 20px rgba(19, 73, 211, 0.2)"
                  ]
                }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="relative p-[2px] rounded-full overflow-hidden"
              >
                {/* Rotating Border Beam (Blue version for Golf) */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0%,transparent_30%,#1349D3_50%,transparent_70%,transparent_100%)] opacity-100"
                />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative px-12 py-5 bg-[#0A0A0B] text-white font-display font-black text-xs rounded-full uppercase tracking-[0.3em] transition-all duration-500 overflow-hidden group/btn flex items-center gap-4 border border-white/5 hover:bg-white/60"
                >
                  <span className="relative z-10 group-hover:text-black transition-colors duration-500">
                    RÉSERVER UNE SESSION
                  </span>
                  <Zap size={14} className="relative z-10 text-padel-blue animate-pulse" />

                  {/* Internal hover glow */}
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
                </motion.button>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Video Placeholder Box with Premium Styling */}
            <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] group">
              <div className="absolute inset-0 bg-padel-blue/10 animate-pulse group-hover:opacity-0 transition-opacity" />

              {/* This would be the actual video player */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm group-hover:backdrop-blur-none transition-all">
                <div className="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-xl group-hover:scale-110 transition-transform cursor-pointer">
                  <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-2" />
                </div>
              </div>

              {/* Background image as poster if video not loaded */}
              <img
                src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop"
                alt="Golf Simulator"
                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000"
              />

              {/* Overlay info */}
              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                <div className="px-6 py-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl">
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Session Live</p>
                  <p className="text-sm font-bold text-white uppercase">Augusta National - Hole 12</p>
                </div>
              </div>
            </div>

            {/* Floating Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-padel-blue opacity-10 blur-[80px]" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-padel-yellow opacity-10 blur-[80px]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
