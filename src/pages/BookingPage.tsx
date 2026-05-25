import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Rocket, ArrowRight, ShieldCheck, Zap, Calendar } from 'lucide-react';

export const BookingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] bg-padel-blue/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-padel-yellow/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-padel-blue/10 border border-padel-blue/20 rounded-full mb-8">
            <Zap size={14} className="text-padel-blue" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-padel-blue">Nouvelle Plateforme de Réservation</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-white leading-[0.9] tracking-tighter uppercase mb-8">
            RÉSERVEZ VOTRE <br />
            <span className="text-padel-blue italic">PROCHAIN MATCH</span>
          </h1>

          <p className="text-white/40 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            Pour vous offrir la meilleure expérience possible, nous utilisons désormais une plateforme de réservation dédiée et sécurisée.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: <Calendar className="text-padel-blue" />, title: "Disponibilité Live", desc: "Consultez les créneaux en temps réel." },
              { icon: <ShieldCheck className="text-padel-blue" />, title: "Paiement Sécurisé", desc: "Transactions protégées et rapides." },
              { icon: <Rocket className="text-padel-blue" />, title: "Accès Instantané", desc: "Recevez vos codes d'accès par email." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-white font-black text-xs uppercase tracking-widest mb-2">{item.title}</h3>
                <p className="text-white/20 text-[11px] leading-relaxed uppercase font-bold">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.a
            href="https://padelarenavendome.villagepadel.fr"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-4 px-12 py-6 bg-padel-blue text-white rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(19,73,211,0.3)] hover:bg-padel-yellow hover:text-padel-blue transition-all duration-500 group"
          >
            Accéder au planning
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};
