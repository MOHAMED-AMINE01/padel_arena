import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Tag, Sparkles, ArrowRight, Copy, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const promos = [
  {
    title: "OFFRE BIENVENUE",
    discount: "-50%",
    desc: "Sur votre première réservation. Valable pour tous les nouveaux membres.",
    code: "WELCOME50",
    endsIn: 86400 * 3, // 3 days
    badge: "NEWPLAYER"
  },
  {
    title: "FLASH HAPPY HOUR",
    discount: "-30%",
    desc: "Tous les mardis de 14h à 16h. Profitez des créneaux calmes.",
    code: "HAPPYPADEL",
    endsIn: 3600 * 5, // 5 hours
    badge: "FASTLIVE"
  },
  {
    title: "ADVANTAGE ÉSTUDIANT",
    discount: "-20%",
    desc: "Sur présentation de votre carte étudiante. Valable toute l'année.",
    code: "STUDENT20",
    badge: "PERMANENT"
  }
];

const Countdown = ({ seconds }: { seconds: number }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;

  return (
    <div className="flex gap-2">
      {[h, m, s].map((val, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="bg-white/5 border border-white/10 w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center font-display font-black text-[10px] md:text-xs text-padel-blue">
            {val.toString().padStart(2, '0')}
          </div>
          <span className="text-[6px] font-black text-white/20 mt-1 uppercase tracking-tighter">
            {['HRS', 'MIN', 'SEC'][i]}
          </span>
        </div>
      ))}
    </div>
  );
};

export const PromotionalOffers = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section id="promos" className="relative py-24 md:py-48 px-6 bg-[#050505] overflow-hidden border-t border-white/[0.03]">
      {/* Decorative radial gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-padel-blue/5 blur-[150px] -z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-padel-yellow/5 blur-[150px] -z-0" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="text-center mb-24 md:mb-32">
          <div className="inline-flex items-center gap-4 mb-8">
            <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">OFFRES FLASH & DEALS</span>
          </div>
          <h3 className="text-4xl md:text-7xl font-display font-black tracking-tighter leading-[0.9] uppercase">
            PROFITEZ DES <br />
            <span className="text-white italic">MEILLEURES OPPORTUNITÉS</span>
          </h3>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {promos.map((promo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="relative group"
            >
              {/* Floating Badge */}
              <div className="absolute -top-4 left-10 z-20">
                <div className="bg-white text-black px-6 py-2 rounded-full font-black text-[9px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-2 border border-white/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-padel-blue animate-pulse" />
                  {promo.badge}
                </div>
              </div>

              <div className="glass p-10 md:p-14 rounded-[4rem] border-white/5 group-hover:border-padel-blue/20 transition-all duration-700 overflow-hidden relative flex flex-col h-full">
                {/* Decorative background icon */}
                <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.07] group-hover:rotate-12 transition-all duration-1000">
                  <Tag size={200} />
                </div>

                <div className="relative z-10 flex-grow">
                  <div className="flex justify-between items-start mb-12">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-padel-blue border border-white/10">
                      <Sparkles size={28} />
                    </div>
                    {promo.endsIn && <Countdown seconds={promo.endsIn} />}
                  </div>

                  <h4 className="text-xl md:text-2xl font-display font-black uppercase tracking-tight mb-4 group-hover:text-padel-blue transition-colors leading-[0.9]">
                    {promo.title}
                  </h4>
                  <div className="text-6xl md:text-8xl font-display font-black text-white mb-8 tracking-tighter group-hover:scale-105 transition-transform origin-left">
                    {promo.discount}
                  </div>

                  <p className="text-sm md:text-base text-white/30 font-medium leading-relaxed mb-12">
                    {promo.desc}
                  </p>

                  {/* Coupon Code Interface */}
                  <div
                    onClick={() => copyToClipboard(promo.code)}
                    className="p-6 rounded-3xl bg-white/[0.03] border border-dashed border-white/10 flex justify-between items-center group/code cursor-pointer hover:border-padel-blue/50 transition-all mb-10"
                  >
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">CODE PROMO</span>
                      <span className="font-display font-black text-white md:text-xl tracking-widest uppercase">
                        {promo.code}
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover/code:text-padel-blue transition-all">
                      {copied === promo.code ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Copy size={20} />}
                    </div>
                  </div>
                </div>

                <button className="relative z-10 w-full py-6 mt-auto bg-padel-blue text-white rounded-full font-black text-[10px] tracking-[0.4em] uppercase overflow-hidden shadow-2xl group/btn transition-all">
                  <span className="relative z-10">EN PROFITER</span>
                  <div className="absolute inset-0 bg-padel-yellow translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
