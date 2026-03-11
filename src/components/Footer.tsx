import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, ArrowUpRight, Globe, CheckCircle2, X } from 'lucide-react';
import { cn } from '../lib/utils';

export const Footer = () => {
  const [modal, setModal] = useState<{ show: boolean; title: string; message: string; type: 'success' | 'error' }>({
    show: false,
    title: '',
    message: '',
    type: 'success'
  });

  return (
    <footer className="relative bg-[#050505] pt-24 pb-12 px-6 overflow-hidden border-t border-white/[0.03]">
      {/* Editorial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[25%]" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white mr-[25%]" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8 mb-24 items-start">

          {/* Brand Section (5 cols on lg, 1 col on md/sm) */}
          <div className="lg:col-span-5 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex flex-col items-center md:items-start gap-6">
              <img
                src="/IMAGES/newLogo_tr.png"
                alt="Padel Arena"
                className="h-24 md:h-32 scale-150 object-contain md:-ml-4"
              />
              <p className="text-base md:text-lg text-white/50 font-medium max-w-sm leading-relaxed">
                L'arène ultime dédiée à l'excellence du <span className="notranslate" translate="no">padel</span>. Une expérience immersive où chaque détail est pensé pour la performance.
              </p>
            </div>
          </div>

          {/* Navigation Columns (7 cols total) - 2 cols on tablet, 3 on desktop */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">

            {/* Column 1: Le Club */}
            <div className="space-y-8 flex flex-col items-center md:items-start text-center md:text-left">
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">LE CLUB</h4>
              <ul className="space-y-4">
                {[
                  { name: 'PRÉSENTATION', href: '/le-club#presentation' },
                  { name: 'VISION', href: '/le-club#vision' },
                  { name: 'L\'ÉQUIPE', href: '/le-club#equipe' },
                  { name: 'ACTIVITÉS', href: '/activites' },
                  { name: 'CONTACT', href: '/contact' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-white/50 hover:text-white transition-colors text-[11px] font-black tracking-widest uppercase flex items-center justify-center md:justify-start group">
                      <span className="hidden md:block w-0 group-hover:w-3 h-[1px] bg-padel-blue transition-all duration-300 group-hover:mr-2" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Découvrir */}
            <div className="space-y-8 flex flex-col items-center md:items-start text-center md:text-left">
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">DÉCOUVRIR</h4>
              <ul className="space-y-4">
                {[
                  { name: 'TERRAINS', href: '/activites#installations' },
                  { name: 'ACTIVITÉS', href: '/activites' },
                  { name: 'TOURNOIS', href: '/activites#tournois' },
                  { name: 'RÉSERVATION', href: '/reservation' },
                  { name: 'TARIFS', href: '/tarifs' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-white/50 hover:text-white transition-colors text-[11px] font-black tracking-widest uppercase flex items-center justify-center md:justify-start group">
                      <span className="hidden md:block w-0 group-hover:w-3 h-[1px] bg-padel-yellow transition-all duration-300 group-hover:mr-2" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Contact (2nd column on tablet, 3rd on desktop) */}
            <div className="space-y-8 flex flex-col items-center md:items-start text-center md:text-left">
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">CONTACT</h4>
              <ul className="space-y-4 justify-center md:justify-start">
                <li>
                  <div className="text-white/50 transition-colors text-[11px] font-black tracking-widest uppercase flex items-center justify-center md:justify-start group">
                    <span className="hidden md:block w-0 h-[1px] transition-all duration-300 group-hover:mr-2" />
                    <span className="whitespace-nowrap">123 Avenue du <span className="notranslate" translate="no">Padel</span>, 41100 Vendôme</span>
                  </div>
                </li>
                <li>
                  <a href="tel:+33200000000" className="text-white/50 hover:text-white transition-colors text-[11px] font-black tracking-widest uppercase flex items-center justify-center md:justify-start group">
                    <span className="hidden md:block w-0 h-[1px] transition-all duration-300 group-hover:mr-2" />
                    +33 2 00 00 00 00
                  </a>
                </li>
                <li>
                  <a href="mailto:contact@padelarena.fr" className="text-white/50 hover:text-white transition-colors text-[11px] font-black tracking-widest uppercase flex items-center justify-center md:justify-start group">
                    <span className="hidden md:block w-0 h-[1px] transition-all duration-300 group-hover:mr-2" />
                    contact@padelarena.fr
                  </a>
                </li>
              </ul>

              {/* Ultra Stylized & Compact Newsletter */}
              <div className="w-full pt-8 border-t border-white/5 mt-4">
                <h4 className="text-[9px] font-black text-padel-blue uppercase tracking-[0.4em] mb-4">NEWSLETTER</h4>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                    try {
                      const res = await fetch(`${(import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api'}/newsletter/subscribe`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email })
                      });
                      const data = await res.json();
                      if (data.success) {
                        setModal({
                          show: true,
                          title: 'BIENVENUE DANS L\'ELITE',
                          message: 'Votre synchronisation est confirmée. Vous recevrez désormais nos exclusivités.',
                          type: 'success'
                        });
                        form.reset();
                      } else {
                        setModal({
                          show: true,
                          title: 'ERREUR STORAGE',
                          message: data.message || 'Une erreur est survenue lors de l\'inscription.',
                          type: 'error'
                        });
                      }
                    } catch (err) {
                      setModal({
                        show: true,
                        title: 'ÉCHEC RÉSEAU',
                        message: 'Impossible de joindre l\'arène pour le moment.',
                        type: 'error'
                      });
                    }
                  }}
                  className="relative group"
                >
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="EMAIL..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-5 text-[9px] font-black tracking-widest text-white focus:outline-none focus:border-padel-blue/40 transition-all placeholder:text-white/10 uppercase"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-4 bg-padel-blue text-white rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-padel-yellow hover:text-padel-blue transition-all active:scale-95"
                  >
                    JOIN
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>

        {/* Custom Confirmation Modal */}
        <AnimatePresence>
          {modal.show && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setModal({ ...modal, show: false })}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-sm bg-[#0C0C0E] border border-white/10 rounded-3xl p-8 text-center shadow-3xl overflow-hidden"
              >
                {/* Background Accent */}
                <div className={cn(
                  "absolute top-0 left-0 w-full h-1",
                  modal.type === 'success' ? "bg-padel-blue" : "bg-red-500"
                )} />

                <div className={cn(
                  "w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6",
                  modal.type === 'success' ? "bg-padel-blue/10 text-padel-blue" : "bg-red-500/10 text-red-500"
                )}>
                  {modal.type === 'success' ? <CheckCircle2 size={40} /> : <X size={40} />}
                </div>

                <h3 className="text-[12px] font-black text-white uppercase tracking-[0.4em] mb-4">
                  {modal.title}
                </h3>
                <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest leading-relaxed mb-8 italic">
                  {modal.message}
                </p>

                <button
                  onClick={() => setModal({ ...modal, show: false })}
                  className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-[0.3em] transition-all"
                >
                  FERMER
                </button>

                {/* Decorative Elements */}
                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-padel-blue/5 rounded-full blur-3xl pointer-events-none" />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Brand Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8 text-center lg:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-[9px] font-black text-white/70 uppercase tracking-widest">
              © 2026 <span className="notranslate" translate="no">PADEL ARENA</span> VENDÔME. DESIGNED FOR EXCELLENCE.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 text-white/70">
            <div className="flex gap-8">
              <a href="#" className="text-[9px] font-black text-white/70 hover:text-white uppercase tracking-widest transition-colors">MENTIONS LÉGALES</a>
              <a href="#" className="text-[9px] font-black text-white/70 hover:text-white uppercase tracking-widest transition-colors">politique de confidentialité</a>
            </div>
            <div className="flex items-center gap-2 group cursor-default">
              <span className="text-[9px] font-black tracking-widest uppercase group-hover:text-padel-blue transition-colors">VENDÔME, FR</span>
              <Globe size={12} className="group-hover:rotate-45 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
