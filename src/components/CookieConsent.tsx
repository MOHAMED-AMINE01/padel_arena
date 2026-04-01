import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Vérifier si le choix des cookies a déjà été fait (nouvelle clé pour forcer réaffichage)
    const consent = localStorage.getItem('padel-cookie-consent-v2');
    if (!consent) {
      // Afficher le bandeau après un léger délai
      const timer = setTimeout(() => setShow(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('padel-cookie-consent-v2', 'accepted');
    // Initialisation conditionnelle d'auditeurs (Google Analytics, etc.) si nécessaire
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('padel-cookie-consent-v2', 'declined');
    // Bloquer les scripts de tracking si nécessaire
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 150, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="fixed bottom-0 left-0 right-0 z-[999] p-4 md:p-6 pb-28 md:pb-6 pointer-events-none"
        >
          <div className="max-w-4xl mx-auto glass border border-white/10 rounded-[2rem] p-6 md:p-8 backdrop-blur-3xl shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative overflow-hidden pointer-events-auto">
            {/* Background glow */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-48 h-48 bg-padel-blue/20 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-center justify-between">
              
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-padel-blue shadow-[0_0_20px_rgba(19,73,211,0.2)]">
                    <Cookie size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] leading-none mb-1">Gérer vos cookies</h3>
                    <p className="text-[9px] font-black text-white/30 tracking-widest uppercase">CONTRÔLE DE LA CONFIDENTIALITÉ</p>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-white/50 leading-relaxed font-medium md:max-w-xl">
                  Nous utilisons des cookies pour optimiser votre expérience sur notre site et analyser notre trafic.
                  Les cookies techniques sont nécessaires, mais vous pouvez choisir d'activer ou non les cookies d'audience.
                  <Link to="/cookies" className="text-padel-blue hover:text-white transition-colors ml-1 underline underline-offset-4 decoration-padel-blue/30">En savoir plus.</Link>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 shrink-0">
                <button
                  onClick={handleDecline}
                  className="px-6 py-4 rounded-xl border border-white/10 text-white/70 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-3"
                >
                  <X size={14} className="text-white/40" />
                  Refuser
                </button>
                <button
                  onClick={handleAccept}
                  className="px-6 py-4 rounded-xl bg-padel-blue text-white text-[10px] font-black uppercase tracking-widest hover:bg-padel-yellow hover:text-padel-blue transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(19,73,211,0.4)] hover:shadow-[0_0_30px_rgba(255,210,31,0.4)]"
                >
                  <Check size={14} />
                  Accepter tout
                </button>
              </div>
              
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
