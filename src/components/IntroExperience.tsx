import React, { useState } from 'react';
import Spline from '@splinetool/react-spline';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface IntroExperienceProps {
  onEnter: () => void;
}

export const IntroExperience: React.FC<IntroExperienceProps> = ({ onEnter }) => {
  const [isDone, setIsDone] = useState(false);

  const handleEnterClick = () => {
    setIsDone(true);
    setTimeout(onEnter, 800); // Wait for finishing animation partially, then transition
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#05112B] overflow-hidden flex items-center justify-center">
      {/* Spline Background */}
      <div className="absolute inset-0 opacity-70 lg:w-[120%] h-[120%]">
        <Spline
          scene="https://prod.spline.design/OB1NQECltMJM2hNQ/scene.splinecode"
        />
      </div>

      {/* Overlay Gradients */}
      <div className="absolute inset-0 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(5,17,43,0.8)]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full py-10 px-6 max-w-4xl w-full">
        {/* Top Text Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center absolute top-[10%]"
        >
          <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4 tracking-tighter uppercase italic leading-[0.9] notranslate" translate="no">
            PADEL <span className="text-padel-blue">ARENA</span> <span className="text-padel-blue">VENDÔME / ST OUEN</span>
          </h1>
          <div className="h-1 w-24 bg-padel-blue mx-auto rounded-full" />
        </motion.div>

        {/* Central Design */}
        <div className="relative select-none flex flex-col items-center mt-20">
          {/* Glowing Aura for the Logo */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-0 bg-padel-blue blur-3xl rounded-full transition-all duration-300 pointer-events-none w-64 h-64"
          />

          {/* The Logo Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{ duration: 0.8 }}
            className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-2 border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center overflow-hidden z-20 shadow-2xl mb-16"
          >
            <img
              src="/IMAGES/newLogo.png"
              alt="Logo"
              className="w-[85%] h-[85%] object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] rounded-full select-none"
            />
          </motion.div>

          {/* CTA Button "Premium" */}
          <motion.button
            onClick={handleEnterClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative z-30 group overflow-hidden bg-white/5 backdrop-blur-md border border-white/20 hover:border-padel-blue text-white px-8 md:px-12 py-4 md:py-5 rounded-full font-display uppercase tracking-widest text-sm md:text-base font-semibold shadow-[0_0_20px_rgba(19,73,211,0.2)] hover:shadow-[0_0_30px_rgba(19,73,211,0.5)] transition-all duration-300 flex items-center gap-3 cursor-pointer"
          >
            <span className="relative z-10">ENTRER DANS L'ARÈNE</span>
            <ChevronRight className="w-5 h-5 text-padel-blue group-hover:translate-x-1 transition-transform relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-padel-blue/0 via-padel-blue/20 to-padel-blue/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
          </motion.button>
        </div>
      </div>

      {/* Finishing Animation Overlay */}
      <AnimatePresence>
        {isDone && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 20, opacity: 1 }}
            transition={{ duration: 0.8, ease: "circIn" }}
            className="absolute z-[110] w-64 h-64 bg-white rounded-full pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
