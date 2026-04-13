import React, { useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface IntroExperienceProps {
  onEnter: () => void;
}

export const IntroExperience: React.FC<IntroExperienceProps> = ({ onEnter }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Automatic progress increment
    const duration = 1500; // 1.5 seconds for auto-rotation
    const interval = 10;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsDone(true);
          setTimeout(onEnter, 500);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onEnter]);

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
      <div className="absolute inset-0 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full py-20 px-6 max-w-4xl w-full">
        {/* Top Text Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-4 tracking-tighter uppercase italic leading-[0.9] notranslate" translate="no">
            PADEL <span className="text-padel-blue">ARENA</span> <span className="text-padel-blue">VENDÔMOIS</span>
          </h1>
          <div className="h-1 w-24 bg-padel-blue mx-auto rounded-full" />
        </motion.div>

        {/* Central Design (Static but animated circle) */}
        <div className="relative select-none">
          {/* Circular Progress Ring (Automated) */}
          <svg className="absolute -inset-8 w-[calc(100%+64px)] h-[calc(100%+64px)] -rotate-90 scale-110" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
              strokeOpacity="0.1"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="#1349d3"
              strokeWidth="2.5"
              strokeDasharray="301.59"
              initial={{
                strokeDashoffset: 301.59,
                opacity: 0.3
              }}
              animate={{
                strokeDashoffset: 301.59 - (301.59 * progress) / 100,
                opacity: 1
              }}
              transition={{ type: "tween", ease: "linear" }}
              strokeLinecap="round"
              className="drop-shadow-[0_0_15px_rgba(19,73,211,0.8)] rounded-full"
            />
          </svg>

          {/* Glowing Aura */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -inset-4 bg-padel-blue blur-3xl rounded-full transition-all duration-300 pointer-events-none"
          />

          {/* The Logo Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{ duration: 0.8 }}
            className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-2 border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center overflow-hidden z-20"
          >
            <img
              src="/IMAGES/newLogo.png"
              alt="Logo"
              className="w-[85%] h-[85%] object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] rounded-full select-none"
            />
          </motion.div>
        </div>

        {/* Bottom Text Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-lg md:text-2xl font-display font-light text-white/60 mb-8 tracking-[0.2em] uppercase max-w-3xl leading-relaxed">
            ENTREZ DANS L’UNIVERS DU PADEL VENDÔMOIS <br />
          </h2>
        </motion.div>
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
