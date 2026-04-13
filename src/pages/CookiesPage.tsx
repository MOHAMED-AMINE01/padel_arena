import React from 'react';
import { motion } from 'motion/react';
import { Database, Cookie, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const sections = [
  {
    icon: <Cookie size={22} />,
    title: "GESTION DES COOKIES : DÉFINITION",
    content: (
      <p>Le site <strong className="text-white">Padel Arena Vendôme / St Ouen</strong> utilise des cookies pour améliorer votre navigation et analyser l'audience du site. Un cookie est un fichier texte déposé sur votre terminal lors de votre visite.</p>
    ),
  },
  {
    icon: <Database size={22} />,
    title: "TYPES DE COOKIES UTILISÉS",
    content: (
      <ul className="list-disc pl-5 space-y-3 text-white/40 mt-4">
        <li><strong className="text-white">Cookies techniques :</strong> Indispensables au bon fonctionnement du site.</li>
        <li><strong className="text-white">Cookies de mesure d'audience :</strong> Permettent d'analyser le trafic et l'utilisation du site de manière anonyme.</li>
      </ul>
    ),
  },
  {
    icon: <Settings size={22} />,
    title: "GESTION DES PRÉFÉRENCES",
    content: (
      <>
        <p className="mb-6">Lors de votre première visite, un bandeau vous permet d'accepter ou de refuser les cookies non essentiels. Vous pouvez modifier vos choix à tout moment :</p>
        <button 
          onClick={() => {
            localStorage.removeItem('padel-cookie-consent-v2');
            window.location.reload();
          }}
          className="w-full sm:w-auto px-6 py-4 bg-white/[0.05] border border-white/10 hover:border-padel-blue hover:text-padel-blue text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex justify-center items-center"
        >
          RÉINITIALISER MES CHOIX
        </button>
      </>
    ),
  },
];

export const CookiesPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="overflow-x-hidden"
    >
      {/* Hero */}
      <section className="relative pt-40 md:pt-52 pb-10 md:pb-10 px-6 bg-[#050505] overflow-hidden">
        {/* Editorial Grid Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
            <div className="w-[1px] h-full bg-white ml-[25%]" />
            <div className="w-[1px] h-full bg-white" />
            <div className="w-[1px] h-full bg-white mr-[25%]" />
          </div>
        </div>

        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-padel-blue/10 rounded-full blur-[200px] pointer-events-none" />

        <div className="max-w-[1400px] mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-4 mb-8">
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">PRÉFÉRENCES</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black tracking-tighter leading-[0.85] uppercase mb-8">
              GESTION DES <br />
              <span className="text-padel-blue italic">COOKIES</span>
            </h1>

            <p className="text-sm md:text-base text-white/30 font-medium max-w-xl mx-auto leading-relaxed">
              Consultez nos pratiques relatives à l'utilisation des cookies et vos droits en la matière.
            </p>
          </motion.div>
        </div>

        {/* Background Decor Text */}
        <div className="absolute top-32 -right-20 text-[10rem] md:text-[16rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-10 leading-none">
          COOKIES
        </div>
      </section>

      {/* Content Sections */}
      <section className="relative py-16 md:py-24 px-6 bg-[#050505] overflow-hidden">
        <div className="max-w-[900px] mx-auto relative z-10 space-y-6 md:space-y-8">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.7 }}
              className="group relative p-8 sm:p-10 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] hover:border-white/10 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-padel-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-5 mb-6 md:mb-8">
                  <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-padel-blue group-hover:bg-padel-yellow group-hover:text-white group-hover:scale-110 transition-all duration-500">
                    {section.icon}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[9px] md:text-[10px] font-black text-white/20 tracking-widest">0{i + 1}</span>
                    <h2 className="text-xs sm:text-sm md:text-base font-display font-black text-white uppercase tracking-[0.15em] md:tracking-[0.2em]">{section.title}</h2>
                  </div>
                </div>

                <div className="text-sm md:text-base text-white/40 font-medium leading-relaxed pl-0 md:pl-[4.25rem]">
                  {section.content}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="h-12 md:h-20" />
      </section>
    </motion.div>
  );
};
