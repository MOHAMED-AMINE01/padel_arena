import React from 'react';
import { motion } from 'motion/react';
import { Smartphone, Wallet, Gift, ArrowRight, Sparkles, Download } from 'lucide-react';
import { cn } from '../../lib/utils';

const bonusTiers = [
  { deposit: 100, credited: 120, bonus: 20 },
  { deposit: 150, credited: 180, bonus: 30 },
  { deposit: 200, credited: 250, bonus: 50 },
];

export const WalletBonus = () => {
  return (
    <section id="wallet-bonus" className="relative py-24 md:py-24 px-6 bg-[#050505] overflow-hidden border-t border-white/[0.03]">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-padel-blue/[0.06] blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 mb-20 md:mb-28">
          <div className="max-w-3xl text-center lg:text-left">
            <div className="inline-flex items-center gap-4 mb-8">
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-yellow uppercase">APPLICATION MOBILE • WALLET</span>
            </div>
            <h3 className="text-4xl sm:text-5xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase">
              RECHARGEZ, <br />
              <span className="text-padel-blue italic">ON VOUS OFFRE LE BONUS</span>
            </h3>
            <p className="text-sm md:text-lg text-white/40 font-medium leading-relaxed mt-8 max-w-2xl mx-auto lg:mx-0">
              Téléchargez l'application Padel Arena et créditez votre wallet. Utilisez votre solde pour
              <span className="text-white/70"> réserver vos terrains, cours, événements</span> — tout, partout dans l'Arena.
            </p>
          </div>
        </div>

        {/* Bonus cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-16">
          {bonusTiers.map((tier, i) => (
            <motion.div
              key={tier.deposit}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              className="group relative glass border border-white/5 hover:border-padel-blue/40 rounded-[3rem] p-10 md:p-12 transition-all duration-700 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-padel-blue/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Bonus badge */}
              <div className="absolute top-8 right-8 z-10">
                <div className="flex items-center gap-2 px-4 py-1.5 bg-padel-yellow/10 border border-padel-yellow/20 rounded-full">
                  <Gift size={12} className="text-padel-yellow" />
                  <span className="text-[9px] font-black text-padel-yellow uppercase tracking-[0.2em]">+{tier.bonus}€ offerts</span>
                </div>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-padel-blue mb-10 group-hover:bg-padel-blue group-hover:text-white transition-all duration-500">
                <Wallet size={24} />
              </div>

              <div className="flex items-center gap-5">
                {/* Deposit */}
                <div>
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">Vous déposez</p>
                  <span className="text-4xl md:text-4xl font-display font-black tracking-tighter text-white/60">{tier.deposit}€</span>
                </div>

                <ArrowRight size={28} className="text-padel-blue shrink-0 group-hover:translate-x-1 transition-transform" />

                {/* Credited */}
                <div>
                  <p className="text-[9px] font-black text-padel-blue uppercase tracking-[0.3em] mb-2">Dans le wallet</p>
                  <span className="text-4xl md:text-4xl font-display font-black tracking-tighter text-white group-hover:text-padel-blue transition-colors">{tier.credited}€</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* App download CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative max-w-4xl mx-auto rounded-[3rem] border border-white/5 bg-gradient-to-br from-padel-blue/10 to-transparent p-10 md:p-14 overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-padel-blue/10 blur-[80px] rounded-full" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-padel-blue/10 border border-padel-blue/20 flex items-center justify-center text-padel-blue shrink-0">
                <Smartphone size={28} />
              </div>
              <div>
                <h4 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tight mb-2">
                  Téléchargez l'app
                </h4>
                <p className="text-sm text-white/40 font-medium leading-relaxed max-w-md flex items-center justify-center md:justify-start gap-2">
                  <Sparkles size={14} className="text-padel-yellow shrink-0" />
                  Créditez votre wallet en 1 minute et profitez du bonus immédiatement.
                </p>
              </div>
            </div>

            <button
              className={cn(
                "group relative px-10 py-5 bg-padel-blue text-white rounded-full font-black text-[10px] tracking-[0.4em] uppercase overflow-hidden transition-all shadow-2xl shrink-0 w-full md:w-auto"
              )}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <Download size={16} /> Télécharger l'application
              </span>
              <div className="absolute inset-0 bg-padel-yellow translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
