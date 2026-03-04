import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Gift, Mail, QrCode, ArrowUpRight, CreditCard, Sparkles, Send } from 'lucide-react';
import { cn } from '../../lib/utils';

const amounts = [50, 100, 150, 200];

export const GiftCards = () => {
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');

  return (
    <section id="cadeaux" className="relative py-24 md:py-48 px-6 bg-[#050505] overflow-hidden border-t border-white/[0.03]">
      {/* Structural Lines */}
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-white opacity-[0.02] z-0" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-4 mb-8">
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-yellow uppercase">CARTE CADEAU ARENA</span>
            </div>
            <h3 className="text-4xl md:text-8xl font-display font-black tracking-tighter leading-[0.85] uppercase mb-10">
              OFFREZ LE <br />
              <span className="text-padel-blue italic">MOUVEMENT</span>
            </h3>
            <p className="text-sm md:text-lg text-white/30 font-medium leading-relaxed mb-12 max-w-lg mx-auto lg:mx-0">
              Le privilège de jouer sur les meilleurs terrains. Personnalisez votre cadeau, ajoutez une touche personnelle et envoyez-le instantanément.
            </p>

            <div className="grid sm:grid-cols-2 gap-8 text-left max-w-xl mx-auto lg:mx-0">
              <div className="group glass p-8 rounded-[2rem] border-white/5 hover:border-padel-blue/20 transition-all">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-padel-blue mb-6 group-hover:bg-padel-blue group-hover:text-white transition-all">
                  <Send size={20} />
                </div>
                <h4 className="text-[11px] font-black text-white tracking-widest uppercase mb-2">ENVOI DIGITAL</h4>
                <p className="text-[10px] text-white/20 font-medium leading-relaxed uppercase">Réception immédiate par email ou SMS.</p>
              </div>
              <div className="group glass p-8 rounded-[2rem] border-white/5 hover:border-padel-blue/20 transition-all">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-padel-blue mb-6 group-hover:bg-padel-blue group-hover:text-white transition-all">
                  <QrCode size={20} />
                </div>
                <h4 className="text-[11px] font-black text-white tracking-widest uppercase mb-2">SCAN & PLAY</h4>
                <p className="text-[10px] text-white/20 font-medium leading-relaxed uppercase">Utilisation flexible sur tous nos services.</p>
              </div>
            </div>
          </motion.div>

          {/* Card Configurator */}
          <div className="glass p-10 md:p-14 rounded-[4rem] border-white/5 relative overflow-hidden shadow-2xl">
            {/* Card Preview - Cinematic Version */}
            <motion.div
              className="aspect-[1.6/1] w-full h-[250px] md:h-full bg-[#0F0F0F] rounded-[2.5rem] p-10 relative mb-12 shadow-[0_30px_60px_rgba(0,0,0,0.4)] overflow-hidden group perspective-1000"
              whileHover={{ rotateX: 5, rotateY: -10, scale: 1.02 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Background textures/glows */}
              <div className="absolute inset-0 bg-gradient-to-br from-padel-blue/20 via-transparent to-transparent opacity-40" />
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-padel-blue/10 blur-[80px]" />
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                <Gift size={200} />
              </div>

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <img src="/IMAGES/logo_tr.png" className="h-10 opacity-60 group-hover:opacity-100 transition-opacity" alt="Logo" />
                    <p className="text-[7px] font-black text-white/20 tracking-[0.4em] uppercase">OFFICIAL GIFT CARD</p>
                  </div>
                  <Sparkles className="text-padel-yellow animate-pulse" size={24} />
                </div>

                <div>
                  <div className="text-5xl md:text-7xl font-display font-black text-white mb-2 tracking-tighter group-hover:text-padel-blue transition-colors">
                    {customAmount || selectedAmount}<span className="text-xl md:text-3xl italic ml-1 opacity-50 font-light">€</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-[1px] w-6 bg-padel-yellow/40" />
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20 italic">Validated Elite Asset</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Selection UI */}
            <div className="space-y-10">
              <div>
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-6 block">VALEUR DE LA CARTE</label>
                <div className="grid grid-cols-4 gap-4">
                  {amounts.map(amount => (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount('');
                      }}
                      className={cn(
                        "py-4 rounded-2xl border font-display font-black text-sm md:text-lg transition-all duration-500",
                        selectedAmount === amount && !customAmount
                          ? "bg-padel-blue border-padel-blue text-white shadow-[0_0_30px_rgba(19,73,211,0.3)]"
                          : "bg-white/5 border-white/5 text-white/30 hover:border-white/20"
                      )}
                    >
                      {amount}€
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-4 block">MONTANT LIBRE</label>
                <div className="relative group">
                  <input
                    type="number"
                    placeholder="ENTREZ VOTRE MONTANT"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white font-display font-black focus:border-padel-blue focus:outline-none transition-all placeholder:text-white/10 uppercase tracking-widest text-sm"
                  />
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <div className="w-[1px] h-6 bg-white/10 mr-2" />
                    <span className="text-white font-display font-black">€</span>
                  </div>
                </div>
              </div>

              <button className="relative w-full py-6 bg-padel-blue text-white rounded-full font-black text-[11px] tracking-[0.4em] uppercase flex items-center justify-center gap-5 overflow-hidden group/btn shadow-2xl transition-all">
                <span className="relative z-10 group-hover/btn:text-padel-blue transition-colors">ACHETER LA CARTE</span>
                <CreditCard size={18} className="relative z-10 group-hover/btn:text-padel-blue group-hover/btn:scale-110 transition-all" />
                <div className="absolute inset-0 bg-padel-yellow translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 right-10 text-[10rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-0 leading-none">
        GIFT
      </div>
    </section>
  );
};
