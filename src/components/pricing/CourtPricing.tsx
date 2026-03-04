import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Sun, Moon, Calendar, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

const pricingData = [
  {
    type: "INDOOR PANORAMIQUE",
    offPeak: 32,
    peak: 40,
    weekend: 44,
    features: ["Verrerie ST7", "Éclairage LED 400W", "Surface MONDO WPT"]
  },
  {
    type: "OUTDOOR PREMIUM",
    offPeak: 24,
    peak: 32,
    weekend: 36,
    features: ["Gazon sablé", "Vue dégagée", "Éclairage nocturne"]
  },
  {
    type: "PRO COMPETITION",
    offPeak: 36,
    peak: 45,
    weekend: 50,
    features: ["Sorties de piste", "Full Panoramique", "Streaming Live incl."]
  },
];

export const CourtPricing = () => {
  const [activeType, setActiveType] = useState(0);

  return (
    <section id="terrains" className="relative py-24 md:py-48 px-6 bg-[#050505] overflow-hidden">
      {/* Editorial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[25%]" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white mr-[25%]" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 mb-24 text-center lg:text-left">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-4 mb-8">
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">TARIFICATION TERRAINS</span>
            </div>
            <h3 className="text-4xl sm:text-5xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase">
              RESERVEZ L' <br />
              <span className="text-white italic">EXCELLENCE</span>
            </h3>
          </div>
          <div className="hidden lg:block pb-4 text-right">
            <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 text-right">PRICING POLICY</div>
            <p className="text-sm text-white/40 font-medium max-w-[300px] leading-relaxed">
              Nos tarifs sont calculés par terrain pour une session de 90 minutes.
            </p>
          </div>
        </div>

        {/* Pricing Layout */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Sidebar Info/Policy */}
          <div className="lg:col-span-4 space-y-8 order-2 lg:order-1">
            {[
              { icon: <Sun size={20} />, title: "HEURES CREUSES", hours: "08:00 — 17:00", day: "Lundi au Vendredi", label: "-20% APPLIED" },
              { icon: <Moon size={20} />, title: "HEURES PLEINES", hours: "17:00 — 23:00", day: "Lundi au Vendredi", label: "STANDARD" },
              { icon: <Calendar size={20} />, title: "WEEK-END", hours: "ALL DAY", day: "Samedi & Dimanche", label: "PEAK RATE" }
            ].map((item, i) => (
              <div key={i} className="group glass p-8 rounded-[2rem] border-white/5 hover:border-padel-blue/20 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-padel-blue group-hover:bg-padel-blue group-hover:text-white transition-all">
                    {item.icon}
                  </div>
                  <span className="text-[8px] font-black text-white/30 tracking-[0.2em]">{item.label}</span>
                </div>
                <h4 className="text-[11px] font-black text-white tracking-[0.2em] mb-2 uppercase">{item.title}</h4>
                <p className="text-xl font-display font-black text-white uppercase">{item.hours}</p>
                <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest mt-1">{item.day}</p>
              </div>
            ))}

            <div className="p-8 bg-padel-blue/5 border border-padel-blue/20 rounded-[2.5rem]">
              <div className="flex items-center gap-4 mb-6">
                <ShieldCheck className="text-padel-blue" size={24} />
                <h5 className="text-[10px] font-black text-white tracking-widest uppercase">AVANTAGE MEMBRE</h5>
              </div>
              <p className="text-sm text-white/40 font-medium leading-relaxed mb-6">
                Devenez membre et bénéficiez de <span className="text-white">-10% de réduction immédiate</span> sur toutes vos réservations.
              </p>
              <div className="flex items-center gap-2 text-padel-blue font-black text-[10px] tracking-widest uppercase cursor-pointer group">
                EN SAVOIR PLUS <ArrowUpRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Pricing Table/Grid */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="space-y-6">
              {pricingData.map((row, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={cn(
                    "group relative glass rounded-[3.5rem] border-white/5 overflow-hidden transition-all duration-700",
                    activeType === i ? "border-padel-blue/40 ring-1 ring-padel-blue/20" : "hover:border-white/20"
                  )}
                  onClick={() => setActiveType(i)}
                >
                  <div className="p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="max-w-sm">
                      <h4 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tight mb-6 group-hover:text-padel-blue transition-colors">
                        {row.type}
                      </h4>
                      <div className="flex flex-wrap gap-4">
                        {row.features.map((f, j) => (
                          <div key={j} className="flex items-center gap-2">
                            <Zap size={10} className="text-padel-blue" />
                            <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8 md:gap-12">
                      <div className="text-center">
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-2">OFF-PEAK</p>
                        <p className="text-2xl md:text-4xl font-display font-black text-white">{row.offPeak}€</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-2">PEAK</p>
                        <p className="text-2xl md:text-4xl font-display font-black text-padel-blue">{row.peak}€</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-2">WEEKEND</p>
                        <p className="text-2xl md:text-4xl font-display font-black text-white">{row.weekend}€</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-padel-blue to-transparent opacity-0 group-hover:opacity-40 transition-opacity" />
                </motion.div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <button className="flex items-center gap-6 py-6 px-12 bg-padel-blue text-white rounded-full font-black text-[11px] uppercase tracking-[0.4em] overflow-hidden relative group shadow-2xl">
                <span className="relative z-10">RÉSERVER VOTRE CRÉNEAU</span>
                <ArrowUpRight size={16} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <div className="absolute inset-0 bg-padel-yellow translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decor Text */}
      <div className="absolute top-1/2 -right-40 text-[12rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-10 -rotate-90 leading-none">
        COURT RATES
      </div>
    </section>
  );
};
