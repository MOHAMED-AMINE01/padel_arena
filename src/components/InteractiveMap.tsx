import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Info } from 'lucide-react';
import { cn } from '../lib/utils';

const courts = [
  { id: 1, x: "20%", y: "30%", status: "occupied", players: "4/4" },
  { id: 2, x: "40%", y: "30%", status: "occupied", players: "4/4" },
  { id: 3, x: "60%", y: "30%", status: "free", players: "0/4" },
  { id: 4, x: "80%", y: "30%", status: "occupied", players: "4/4" },
  { id: 5, x: "20%", y: "60%", status: "free", players: "0/4" },
  { id: 6, x: "40%", y: "60%", status: "occupied", players: "4/4" },
  { id: 7, x: "60%", y: "60%", status: "occupied", players: "4/4" },
  { id: 8, x: "80%", y: "60%", status: "free", players: "0/4" },
];

export const InteractiveMap = () => {
  const [hoveredCourt, setHoveredCourt] = useState<number | null>(null);

  return (
    <section className="py-40 px-6 bg-dark-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-display font-bold text-padel-blue tracking-[0.5em] uppercase mb-6">Live Arena</h2>
            <h3 className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-none mb-10">
              CARTE DES <br />
              <span className="text-padel-yellow italic">COURTS</span>
            </h3>
            <p className="text-xl text-white/40 font-light leading-relaxed mb-12">
              Visualisez l'occupation de l'arène en temps réel. Sélectionnez un court 
              pour voir les détails ou réserver le prochain créneau disponible.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full bg-neon-green" />
                <span className="text-sm font-display font-bold uppercase tracking-widest">Court Disponible</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full bg-padel-blue" />
                <span className="text-sm font-display font-bold uppercase tracking-widest">Match en cours</span>
              </div>
            </div>
          </motion.div>

          <div className="relative aspect-[4/3] glass rounded-[3rem] p-12 overflow-hidden group">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-10" 
              style={{ backgroundImage: 'radial-gradient(circle, #1349d3 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
            />
            
            <div className="relative w-full h-full border border-white/5 rounded-2xl bg-black/40 flex items-center justify-center">
              {courts.map((court) => (
                <motion.div
                  key={court.id}
                  className={cn(
                    "absolute w-12 h-20 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-center",
                    court.status === 'occupied' ? "border-padel-blue bg-padel-blue/20" : "border-neon-green bg-neon-green/20"
                  )}
                  style={{ left: court.x, top: court.y }}
                  whileHover={{ scale: 1.2, zIndex: 10 }}
                  onHoverStart={() => setHoveredCourt(court.id)}
                  onHoverEnd={() => setHoveredCourt(null)}
                >
                  <span className="text-[10px] font-display font-black">{court.id}</span>
                  
                  {hoveredCourt === court.id && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 glass p-4 rounded-xl min-w-[150px] z-50"
                    >
                      <div className="text-[10px] font-bold text-white/40 uppercase mb-1">Court #{court.id}</div>
                      <div className="text-sm font-display font-bold mb-2">
                        {court.status === 'occupied' ? 'Match en cours' : 'Libre'}
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span>JOUEURS</span>
                        <span className="text-padel-yellow">{court.players}</span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
              
              <div className="absolute bottom-8 left-8 flex items-center gap-3 glass px-4 py-2 rounded-full">
                <Info size={14} className="text-padel-yellow" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Vue Satellite Arena</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
