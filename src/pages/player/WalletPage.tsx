import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, Zap, Plus, History, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

export const WalletPage = () => {
  const { user } = useAuth();

  const creditPacks = [
    { amount: 50, bonus: 0, price: 50, tag: "Essentiel" },
    { amount: 100, bonus: 10, price: 100, tag: "Populaire", featured: true },
    { amount: 200, bonus: 30, price: 200, tag: "VIP" },
    { amount: 500, bonus: 100, price: 500, tag: "Élite" },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
           <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-padel-blue/10 border border-padel-blue/20 text-padel-blue text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              <Zap size={12} /> Système de Crédits
           </div>
           <h1 className="text-5xl md:text-8xl font-display font-black text-white italic uppercase tracking-tighter leading-none">
              MON <br />
              <span className="text-padel-blue italic">PORTEFEUILLE</span>
           </h1>
        </div>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] flex items-center gap-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-padel-blue opacity-10 blur-3xl pointer-events-none" />
          <div>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2 italic">Solde Actuel</p>
            <p className="text-6xl font-display font-black text-white italic tracking-tighter">
              {user?.balance || 0}€
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-padel-blue flex items-center justify-center text-white shadow-lg shadow-padel-blue/20">
             <CreditCard size={32} />
          </div>
        </motion.div>
      </div>

      {/* Credit Packs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {creditPacks.map((pack, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -8 }}
            className={cn(
              "p-8 rounded-[2.5rem] border transition-all duration-500 relative group flex flex-col",
              pack.featured 
                ? "bg-padel-blue border-white/20 shadow-2xl shadow-padel-blue/20" 
                : "bg-white/[0.03] border-white/5 hover:border-white/10"
            )}
          >
            {pack.featured && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-padel-yellow text-padel-blue text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                RECOMMANDÉ
              </div>
            )}
            
            <div className="mb-6 flex justify-between items-start">
               <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">{pack.tag}</div>
               <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Plus size={18} className="text-white/30" />
               </div>
            </div>

            <div className="mb-8">
               <div className="text-4xl font-display font-black text-white italic mb-1">
                  {pack.amount + pack.bonus}€
               </div>
               {pack.bonus > 0 && (
                 <p className="text-[10px] font-black text-padel-yellow uppercase tracking-widest italic">
                    Inclut {pack.bonus}€ offerts
                 </p>
               )}
            </div>

            <div className="mt-auto pt-8 border-t border-white/5">
                <div className="flex justify-between items-end mb-6">
                   <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Prix</p>
                   <p className="text-2xl font-display font-black text-white">{pack.price}€</p>
                </div>
                <button className={cn(
                  "w-full py-4 rounded-2xl font-display font-black text-[10px] uppercase tracking-widest transition-all",
                  pack.featured 
                    ? "bg-white text-padel-blue" 
                    : "bg-padel-blue text-white hover:bg-padel-blue/80"
                )}>
                  ACHETER MAINTENANT
                </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Benefits Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#151518]/60 border border-white/5 rounded-[3rem] p-10 flex items-start gap-8">
           <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
              <ShieldCheck size={32} />
           </div>
           <div>
              <h3 className="text-2xl font-display font-black text-white italic uppercase tracking-tighter mb-4">PAIEMENT SÉCURISÉ</h3>
              <p className="text-white/40 font-medium leading-relaxed">
                 Vos transactions sont entièrement sécurisées par cryptage SSL de bout en bout. 
                 Vos crédits sont valables sans limite de durée sur tous nos services.
              </p>
           </div>
        </div>

        <div className="bg-[#151518]/60 border border-white/5 rounded-[3rem] p-10 flex items-start gap-8">
           <div className="w-16 h-16 rounded-2xl bg-padel-yellow/10 flex items-center justify-center text-padel-yellow shrink-0">
              <History size={32} />
           </div>
           <div>
              <h3 className="text-2xl font-display font-black text-white italic uppercase tracking-tighter mb-4">HISTORIQUE</h3>
              <p className="text-white/40 font-medium leading-relaxed">
                 Retrouvez le détail de vos consommations et rechargements directement dans 
                 votre espace personnel. Transparence totale.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
