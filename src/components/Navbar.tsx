import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, Info, Activity, Newspaper, BadgeEuro, MessageSquare, Target, GraduationCap, Trophy, Users, MapPin, Calendar, Rocket, Star } from 'lucide-react';
import { cn } from '../lib/utils';

const menuStructure = [
  {
    name: 'Le Club',
    href: '/le-club',
    description: 'Découvrez notre univers et nos valeurs premium.',
    icon: Info,
    dropdown: [
      { name: 'Présentation', href: '/le-club#presentation', desc: 'Notre vision du padel moderne.', icon: Rocket },
      { name: 'L’Équipe', href: '/le-club#equipe', desc: 'Des experts à votre service.', icon: Users },
    ]
  },
  {
    name: 'Activités',
    href: '/activites',
    description: 'Cours, tournois et événements exclusifs.',
    icon: Activity,
    isMega: true,
    megaMenu: [
      {
        title: 'Sports de raquette',
        links: [
          { name: 'Padel', href: '/activites#coaching', desc: '3 terrains dernière génération.', icon: Target },
          { name: 'Pickleball', href: '/activites#coaching', desc: 'Terrain polyvalent adapté.', icon: Activity },
          { name: 'Badminton', href: '/activites#coaching', desc: 'Cours réguliers pour tous.', icon: Users },
        ]
      },
      {
        title: 'Loisirs & Événements',
        links: [
          { name: 'Simulateur de golf', href: '/activites#coaching', desc: 'Expérience ultra réaliste.', icon: Star },
          { name: 'Tournois & événements', href: '/activites#tournois', desc: 'Compétitions toute l\'année.', icon: Trophy },
        ]
      },
    ]
  },
  {
    name: 'Actualités',
    href: '/actualites',
    description: 'Plongez dans l’écosystème Padel Arena.',
    icon: Newspaper,
    dropdown: [
      { name: 'Dernières News', href: '/actualites#news', desc: 'Toute la vie du club en direct.', icon: Calendar },
      { name: 'Le Blog', href: '/actualites#news', desc: 'Conseils, tech et guides experts.', icon: Newspaper },
      { name: 'Compétition', href: '/actualites#news', desc: 'Résultats et annonces de tournois.', icon: Trophy },
    ]
  },
  {
    name: 'Tarifs',
    href: '/tarifs',
    description: 'Nos offres flexibles pour tous les joueurs.',
    icon: BadgeEuro,
    dropdown: [
      { name: 'Tarifs terrains', href: '/tarifs#terrains', desc: 'Prix à l’heure et heures creuses.', icon: BadgeEuro },
      { name: 'Abonnements', href: '/tarifs#abonnements', desc: 'Jouez sans limite avec nos forfaits.', icon: Star },
    ]
  },
  {
    name: 'Contact',
    href: '/contact',
    description: 'Besoin d’aide ? Contactez notre équipe.',
    icon: MessageSquare,
    dropdown: [
      { name: 'Nous contacter', href: '/contact#contact', desc: 'Réponse rapide garantie.', icon: MessageSquare },
      { name: 'FAQ', href: '/contact#faq', desc: 'Toutes les réponses à vos questions.', icon: Info },
    ]
  },
];

import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const dashboardPath = user?.role === 'ADMIN' ? '/admin' : '/dashboard';

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 w-full z-[100] transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]",
          scrolled ? "pt-4" : "pt-2"
        )}
      >
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">

          {/* Logo Section - Impactful Size */}
          <Link to="/" className="relative z-[110] group">
            <motion.img
              src="/IMAGES/newLogo_tr.png"
              alt="Logo"
              className={cn(
                "transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] drop-shadow-[0_0_25px_rgba(19,73,211,0.25)]",
                scrolled ? "h-20 md:h-28" : "h-28 md:h-38 lg:h-42 xl:h-38"
              )}
            />
          </Link>

          {/* Desktop Navigation "Pill" - Professional & Clear */}
          <div className={cn(
            "hidden lg:flex items-center gap-1 transition-all duration-700 px-2 py-1.5 rounded-full relative",
            scrolled
              ? "bg-transparent backdrop-blur-sm border border-white/5"
              : "bg-transparent border border-white/10"
          )}>
            {menuStructure.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.href}
                  className={cn(
                    "relative flex items-center gap-2 px-6 py-3 text-[11px] font-display font-black uppercase tracking-[0.2em] transition-all duration-300 rounded-full",
                    activeDropdown === item.name || location.pathname === item.href ? "text-white" : "text-white/40"
                  )}
                >
                  {item.name}
                  {item.dropdown && <ChevronDown size={11} className={cn("transition-transform duration-500 opacity-40", activeDropdown === item.name && "rotate-180 opacity-100")} />}

                  {activeDropdown === item.name && (
                    <motion.div
                      layoutId="pill-nav-bg"
                      className="absolute inset-0 bg-white/5 rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
                    />
                  )}
                </Link>

                {/* Professional Dropdown */}
                <AnimatePresence>
                  {activeDropdown === item.name && (item.dropdown || item.megaMenu) && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                      className={cn(
                        "absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50",
                        item.isMega ? "w-[550px]" : "w-80"
                      )}
                    >
                      <div className="bg-[#0c0c0c]/98 backdrop-blur-3xl border border-white/10 p-7 rounded-[1.8rem] shadow-[0_50px_100px_rgba(0,0,0,0.7)] overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-padel-blue to-transparent opacity-40" />

                        {item.isMega ? (
                          <div className="grid grid-cols-2 gap-10">
                            {item.megaMenu?.map((section) => (
                              <div key={section.title}>
                                <h4 className="text-[10px] font-black text-padel-blue uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                  <span className="w-1.5 h-[1px] bg-padel-blue/60" />
                                  {section.title}
                                </h4>
                                <div className="space-y-6">
                                  {section.links.map((link) => (
                                    <Link
                                      key={link.name}
                                      to={link.href}
                                      className="group flex gap-4 items-start"
                                    >
                                      <div className="p-2 rounded-xl bg-white/5 group-hover:bg-padel-blue/20 transition-all duration-300">
                                        <link.icon size={16} className="text-white/30 group-hover:text-padel-blue transition-colors" />
                                      </div>
                                      <div>
                                        <p className="text-[13px] font-bold text-white group-hover:text-padel-blue transition-colors mb-0.5">{link.name}</p>
                                        <p className="text-[11px] text-white/20 font-medium leading-tight">{link.desc}</p>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {item.dropdown?.map((sub) => (
                              <Link
                                key={sub.name}
                                to={sub.href}
                                className="group flex gap-4 items-start"
                              >
                                <div className="p-2 rounded-xl bg-white/5 group-hover:bg-padel-blue/20 transition-all duration-300">
                                  <sub.icon size={16} className="text-white/30 group-hover:text-padel-blue transition-colors" />
                                </div>
                                <div>
                                  <p className="text-[13px] font-bold text-white group-hover:text-padel-blue transition-colors mb-0.5">{sub.name}</p>
                                  <p className="text-[11px] text-white/20 font-medium leading-tight">{sub.desc}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right Action Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                <Link to={dashboardPath}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className={cn(
                      "hidden lg:flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 transition-all",
                      scrolled ? "bg-white/5" : "bg-transparent"
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-padel-blue flex items-center justify-center text-[10px] font-black uppercase text-white shadow-[0_0_15px_rgba(19,73,211,0.5)]">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-[10px] text-white font-black uppercase tracking-widest hidden xl:block">
                      {user.name.split(' ')[0]}
                    </span>
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.1, color: '#ef4444' }}
                  onClick={logout}
                  className="hidden lg:flex w-10 h-10 items-center justify-center text-white/20 hover:text-red-500 transition-colors"
                >
                  <LogOut size={18} />
                </motion.button>
              </div>
            ) : (
              <Link to="/auth">
                <motion.button
                  whileHover={{ scale: 1.1, background: "rgba(255, 255, 255, 0.08)" }}
                  className={cn(
                    "hidden lg:flex w-11 h-11 rounded-full border items-center justify-center text-white/40 hover:text-white transition-all duration-300",
                    scrolled ? "bg-white/5 border-white/10 shadow-inner" : "bg-transparent border-white/5"
                  )}
                >
                  <User size={20} />
                </motion.button>
              </Link>
            )}

            <Link to="/reservation">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(255, 210, 31, 0.4)",
                  backgroundColor: "#ffd21f"
                }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-4 bg-padel-yellow text-padel-blue font-display font-black text-xs rounded-full uppercase tracking-[0.25em] shadow-xl border-none transition-all duration-300 hover:bg-padel-yellow/80"
              >
                <span className="notranslate" translate="no">RÉSERVER</span>
              </motion.button>
            </Link>

            {/* Compact Mobile Toggle */}
            <button
              className={cn(
                "lg:hidden w-11 h-11 flex items-center justify-center rounded-full border transition-all duration-500",
                scrolled ? "bg-white/5 border-white/5 shadow-inner" : "bg-transparent border-white/10"
              )}
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="w-5 h-4 flex flex-col justify-between overflow-hidden">
                <span className={cn("block h-[2px] bg-white transition-all duration-300 rounded-full", isOpen ? "w-5 rotate-45 translate-y-1.5" : "w-5")} />
                <span className={cn("block h-[2px] bg-white transition-all duration-300 rounded-full", isOpen ? "w-0 opacity-0" : "w-3 ml-auto")} />
                <span className={cn("block h-[2px] bg-white transition-all duration-300 rounded-full", isOpen ? "w-5 -rotate-45 -translate-y-2" : "w-5")} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Premium Minimal Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-[200] bg-dark-bg/95 backdrop-blur-3xl flex flex-col"
          >
            {/* Header Area */}
            <div className="flex items-center justify-between p-6">
              <img src="/IMAGES/newLogo_tr.png" alt="Logo" className="h-20 object-contain" />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Compact List */}
            <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-8">
              {menuStructure.map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className="group block"
                  >
                    <div className="flex items-center gap-4 mb-1.5">
                      <div className={cn(
                        "w-1 h-1 rounded-full",
                        location.pathname === item.href ? "bg-padel-blue" : "bg-white/10"
                      )} />
                      <h2 className={cn(
                        "text-2xl font-display font-black uppercase tracking-tight",
                        location.pathname === item.href ? "text-padel-blue" : "text-white"
                      )}>
                        {item.name}
                      </h2>
                    </div>
                    <p className="pl-5 text-white/20 text-[11px] font-medium leading-normal max-w-[240px]">
                      {item.description}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center gap-3 mb-6">
              {user ? (
                <Link to={dashboardPath} onClick={() => setIsOpen(false)}>
                  <button className="w-14 h-14 border border-white/10 bg-padel-blue text-white font-display font-black text-lg uppercase rounded-full flex items-center justify-center">
                    {user.name.charAt(0)}
                  </button>
                </Link>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <button className="w-14 h-14 py-4 border border-white/10 bg-white/5 text-white font-display font-black text-[10px] uppercase tracking-[0.2em] rounded-full flex items-center justify-center gap-2">
                    <User size={14} />
                  </button>
                </Link>
              )}
            </div>

            {/* Minimal Footer CTA */}
            <div className="p-6 border-t border-white/5 bg-black/20">
              <div className="flex justify-center gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
                <span>Instagram</span>
                <span>Facebook</span>
                <span>Twitter</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
