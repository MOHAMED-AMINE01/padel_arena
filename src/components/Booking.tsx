import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, ArrowRight, Zap, Target, ShieldCheck, Rocket } from 'lucide-react';
import { cn } from '../lib/utils';

export const Booking = () => {
  useEffect(() => {
    // Scroll to section only when hash is #club
    if (window.location.hash === '#club') {
      setTimeout(() => {
        const element = document.getElementById('club');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  return (
    <section id="club" className="relative py-24 md:py-32 px-6 overflow-hidden bg-dark-bg">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[25%]" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white mr-[25%]" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 xl:gap-24 items-center">

          {/* Left Content */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-4 mb-8">
                <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">RÉSERVATION LIVE</span>
              </div>

              <h2 className="text-5xl md:text-7xl xl:text-8xl font-display font-black mb-8 leading-[0.9] tracking-tighter uppercase">
                DOMINEZ <br />
                <span className="text-padel-blue italic">L'ARÈNE</span>
              </h2>

              <p className="text-base md:text-lg text-white/40 mb-12 font-medium leading-relaxed max-w-md">
                Accédez à nos terrains premium. Notre nouvelle plateforme de réservation en temps réel vous garantit une place au cœur de l'action en quelques clics.
              </p>

              <div className="hidden lg:grid grid-cols-2 gap-4">
                <div className="glass p-6 rounded-[2rem] border-white/5 bg-white/[0.02]">
                  <div className="w-8 h-8 rounded-full bg-padel-blue/20 flex items-center justify-center text-padel-blue mb-4">
                    <Zap size={16} />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-2">Instantané</h4>
                  <p className="text-[9px] text-white/20 uppercase font-bold leading-relaxed">Confirmation en temps réel de votre créneau.</p>
                </div>
                <div className="glass p-6 rounded-[2rem] border-white/5 bg-white/[0.02]">
                  <div className="w-8 h-8 rounded-full bg-padel-yellow/20 flex items-center justify-center text-padel-yellow mb-4">
                    <ShieldCheck size={16} />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-2">Sécurisé</h4>
                  <p className="text-[9px] text-white/20 uppercase font-bold leading-relaxed">Paiement 100% protégé et crypté.</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Redirection Focus */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass rounded-[2.5rem] md:rounded-[4rem] border-white/10 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.4)] bg-gradient-to-br from-white/[0.02] to-transparent p-8 md:p-16 lg:p-20 text-center relative group"
            >
              {/* Decorative background icon */}
              <CalendarIcon size={300} className="absolute -bottom-20 -right-20 text-white/[0.02] -rotate-12 pointer-events-none" />
              
              <div className="relative z-10 space-y-10">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-3xl bg-padel-blue/10 border border-padel-blue/20 flex items-center justify-center text-padel-blue shadow-[0_0_50px_rgba(19,73,211,0.2)]">
                    <CalendarIcon size={40} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tighter italic">
                    PRÊT POUR LE <br />
                    <span className="text-padel-blue">PROCHAIN MATCH ?</span>
                  </h3>
                  <p className="text-white/30 text-sm md:text-base font-medium max-w-sm mx-auto leading-relaxed">
                    Cliquez sur le bouton ci-dessous pour accéder à notre nouveau planning interactif et réserver vos terrains de Padel, Pickleball, Badminton ou Golf.
                  </p>
                </div>

                <div className="pt-4">
                  <motion.a
                    href="https://padelarenavendome.villagepadel.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-6 px-12 py-6 bg-padel-blue text-white rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(19,73,211,0.3)] hover:bg-padel-yellow hover:text-padel-blue transition-all duration-500 group"
                  >
                    RÉSERVER MAINTENANT
                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute -top-20 -right-20 text-[15rem] font-display font-black text-white/[0.01] select-none pointer-events-none -z-10 uppercase">
        ARENA
      </div>
    </section>
  );
};
