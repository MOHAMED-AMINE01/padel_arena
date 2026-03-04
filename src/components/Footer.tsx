import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, ArrowUpRight, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

export const Footer = () => {
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
          <div className="lg:col-span-5 flex flex-col items-center md:items-start text-center md:text-left space-y-10">
            <div className="flex flex-col items-center md:items-start gap-6">
              <img
                src="/IMAGES/logo_tr.png"
                alt="Padel Arena"
                className="h-24 md:h-32 object-contain md:-ml-4"
              />
              <p className="text-base md:text-lg text-white/50 font-medium max-w-sm leading-relaxed">
                L'arène ultime dédiée à l'excellence du <span className="notranslate" translate="no">padel</span>. Une expérience immersive où chaque détail est pensé pour la performance.
              </p>
            </div>

            <div className="flex gap-4">
              {[
                { icon: <Instagram size={18} />, label: "INSTAGRAM" },
                { icon: <Facebook size={18} />, label: "FACEBOOK" },
                { icon: <Twitter size={18} />, label: "TWITTER" }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-padel-blue hover:border-padel-blue transition-all duration-300"
                >
                  {social.icon}
                </motion.a>
              ))}
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
                    <Link to={link.href} className="text-white/50 hover:text-white transition-colors text-[11px] font-black tracking-widest uppercase flex items-center justify-center md:justify-start gap-2 group">
                      <span className="hidden md:block w-0 group-hover:w-3 h-[1px] bg-padel-blue transition-all duration-300" />
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
                    <Link to={link.href} className="text-white/50 hover:text-white transition-colors text-[11px] font-black tracking-widest uppercase flex items-center justify-center md:justify-start gap-2 group">
                      <span className="hidden md:block w-0 group-hover:w-3 h-[1px] bg-padel-yellow transition-all duration-300" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Contact (2nd column on tablet, 3rd on desktop) */}
            <div className="space-y-8 flex flex-col items-center md:items-start text-center md:text-left sm:col-span-2 lg:col-span-1">
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">CONTACT</h4>
              <ul className="flex flex-col md:flex-row lg:flex-col gap-6 md:gap-12 lg:gap-6 w-full justify-center md:justify-start">
                <li className="space-y-2">
                  <p className="text-[11px] font-black text-white/50 uppercase tracking-[0.2em]">LOCALISATION</p>
                  <a href="#" className="text-white/50 hover:text-white transition-colors text-xs font-medium block leading-relaxed">
                    123 Avenue du <span className="notranslate" translate="no">Padel</span>,<br />41100 Vendôme
                  </a>
                </li>
                <li className="space-y-2">
                  <p className="text-[11px] font-black text-white/50 uppercase tracking-[0.2em]">TÉLÉPHONE</p>
                  <a href="tel:+33200000000" className="text-white/50 hover:text-white transition-colors text-xs font-black">
                    +33 2 00 00 00 00
                  </a>
                </li>
                <li className="space-y-2">
                  <p className="text-[11px] font-black text-white/50 uppercase tracking-[0.2em]">EMAIL US</p>
                  <a href="mailto:contact@padelarena.fr" className="text-white/50 hover:text-white transition-colors text-xs font-medium">
                    contact@padelarena.fr
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>

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
              <a href="#" className="text-[9px] font-black text-white/70 hover:text-white uppercase tracking-widest transition-colors">PRIVACY POLICY</a>
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
