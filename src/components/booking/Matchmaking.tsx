import React from 'react';
import { motion } from 'motion/react';
import { Search, MessageSquare, Zap, Star, MapPin, Target, ArrowUpRight, ShieldCheck, Globe } from 'lucide-react';
import { cn } from '../../lib/utils';

const players = [
  { name: "JULIEN D.", level: 4.5, matches: 124, winRate: "68%", image: "/IMAGES/ACTIVITIES - COACHING/pexels-atbo-245208.jpg", status: "online", rank: "ELITE" },
  { name: "SARAH L.", level: 3.2, matches: 45, winRate: "52%", image: "/IMAGES/ACTIVITIES - COACHING/pexels-atbo-245208.jpg", status: "offline", rank: "PRO" },
  { name: "MARC A.", level: 5.1, matches: 210, winRate: "75%", image: "/IMAGES/ACTIVITIES - COACHING/pexels-atbo-245208.jpg", status: "online", rank: "MASTER" },
  { name: "EMMA B.", level: 2.8, matches: 12, winRate: "40%", image: "/IMAGES/ACTIVITIES - COACHING/pexels-atbo-245208.jpg", status: "online", rank: "CHALLENGER" },
];

export const Matchmaking = () => {
  return (
    <section id="matchmaking" className="relative py-24 md:py-48 px-6 bg-[#050505] overflow-hidden border-t border-white/[0.03]">
      {/* Editorial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[25%]" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white mr-[25%]" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start mb-32">

          {/* Headline Section */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-4 mb-8">
                <div className="w-12 h-[1px] bg-padel-blue" />
                <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">MATCHMAKING ÉLITE</span>
              </div>

              <h3 className="text-4xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase mb-12">
                REJOIGNEZ <br />
                <span className="text-white italic">LE RÉSEAU</span>
              </h3>

              <p className="text-base md:text-lg text-white/30 font-medium max-w-md mb-16 leading-relaxed uppercase tracking-tighter">
                Ne jouez plus jamais seul. Notre algorithme haute précision orchestré par l'IA vous connecte avec des partenaires de votre calibre.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 mb-16">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative px-10 py-6 bg-padel-blue text-white rounded-full font-black text-[11px] uppercase tracking-[0.4em] overflow-hidden shadow-2xl transition-all"
                >
                  <span className="relative z-10 flex items-center justify-center gap-4 group-hover:text-padel-blue transition-colors">
                    LANCER LE SCAN LIVE
                    <Zap size={16} />
                  </span>
                  <div className="absolute inset-0 bg-padel-yellow translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </motion.button>
                <button className="px-10 py-6 glass border border-white/10 text-white rounded-full font-black text-[11px] uppercase tracking-[0.4em] hover:bg-white/5 transition-all">
                  MES PRÉFÉRENCES
                </button>
              </div>

              {/* Data Badge */}
              <div className="inline-flex items-center gap-6 p-8 glass rounded-[2.5rem] border-white/5 bg-white/[0.01]">
                <div className="w-12 h-12 rounded-full border border-padel-blue/30 flex items-center justify-center text-padel-blue animate-pulse">
                  <Globe size={24} />
                </div>
                <div>
                  <h5 className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">NETWORK ACTIVITY</h5>
                  <p className="text-xl font-display font-black text-white uppercase">1,248 JOUEURS ACTIFS</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Players Grid */}
          <div className="lg:col-span-7">
            <div className="grid sm:grid-cols-2 gap-8">
              {players.map((player, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="group glass p-8 rounded-[3rem] border-white/5 hover:border-padel-blue/20 transition-all duration-700 relative overflow-hidden"
                >
                  {/* Rank Badge Header */}
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] italic">{player.rank} RANK</span>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      player.status === 'online' ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-white/10"
                    )} />
                  </div>

                  <div className="flex items-center gap-6 mb-10">
                    <div className="relative flex-shrink-0">
                      <img src={player.image} alt={player.name} className="w-20 h-20 rounded-[2rem] object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                      <div className="absolute inset-0 rounded-[2rem] border border-white/10" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-display font-black text-white group-hover:text-padel-blue transition-colors uppercase leading-none mb-2">{player.name}</h4>
                      <div className="flex items-center gap-2 text-[10px] font-black text-padel-yellow uppercase tracking-widest leading-none">
                        <Star size={12} className="fill-padel-yellow" />
                        NIVEAU {player.level}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/[0.03]">
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-2">SESSIONS</p>
                      <p className="text-xl font-display font-black text-white leading-none">{player.matches}</p>
                    </div>
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/[0.03]">
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-2">WIN RATE</p>
                      <p className="text-xl font-display font-black text-emerald-500 leading-none">{player.winRate}</p>
                    </div>
                  </div>

                  <button className="w-full relative py-5 bg-white/[0.03] border border-white/10 hover:bg-padel-blue hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 group/btn overflow-hidden">
                    <span className="relative z-10 flex items-center justify-center gap-4">
                      DÉFIER LE RIVAL <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </span>
                  </button>

                  {/* Background decor text */}
                  <div className="absolute top-0 right-0 p-12 opacity-[0.02] text-9xl font-display font-black pointer-events-none select-none -translate-y-4">
                    {player.name[0]}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Split */}
        <div className="grid md:grid-cols-3 gap-12 pt-24 border-t border-white/[0.05]">
          {[
            { title: "ALGORITHME QUANTIQUE", icon: <Target size={24} />, desc: "CALCUL DE COMPATIBILITÉ BASÉ SUR 14 PARAMÈTRES TECHNIQUES.", label: "INTELLIGENT MATCH" },
            { title: "MESSAGERIE SÉCURISÉE", icon: <MessageSquare size={24} />, desc: "COORDINATION OPS ET SYNCHRONISATION D'ÉQUIPE EN TEMPS RÉEL.", label: "OPS CHAT" },
            { title: "PROXIMITÉ GÉO-STATS", icon: <MapPin size={24} />, desc: "DÉTECTION DES JOUEURS D'ÉLITE DANS VOTRE ZONE DÉPARTEMENTALE.", label: "GEO LOCAL" }
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-padel-blue/5 border border-padel-blue/10 flex items-center justify-center text-padel-blue group-hover:bg-padel-blue group-hover:text-white transition-all duration-500">
                  {f.icon}
                </div>
                <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.4em]">{f.label}</span>
              </div>
              <h4 className="text-xl font-display font-black text-white uppercase tracking-tight mb-4 group-hover:text-padel-blue transition-colors">
                {f.title}
              </h4>
              <p className="text-[11px] text-white/30 font-medium leading-relaxed uppercase tracking-tighter max-w-xs">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 right-10 text-[15rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-0 leading-none uppercase">
        PLAYERS
      </div>
    </section>
  );
};
