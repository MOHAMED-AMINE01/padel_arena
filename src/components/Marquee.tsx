import React from 'react';
import { motion } from 'motion/react';

const partners = [
  "BULLPADEL", "NOX", "HEAD", "BABOLAT", "ADIDAS", "WILSON", "KUIPER", "VENDÔME CITY"
];

export const Marquee = () => {
  return (
    <div className="py-20 bg-dark-bg border-y border-white/5 overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-dark-bg to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-dark-bg to-transparent z-10" />
      
      <motion.div 
        animate={{ x: [0, -1000] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap gap-20 items-center"
      >
        {[...partners, ...partners, ...partners].map((partner, i) => (
          <div 
            key={i} 
            className="text-4xl md:text-6xl font-display font-black text-white/10 hover:text-padel-yellow transition-colors cursor-default select-none tracking-tighter"
          >
            {partner}
          </div>
        ))}
      </motion.div>
    </div>
  );
};
