import React from 'react';
import { motion } from 'motion/react';
import { Database, Target, ShieldCheck, Scale, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const sections = [
  {
    icon: <Database size={22} />,
    title: "COLLECTE DES DONNÉES",
    content: (
      <p><strong className="text-white">Padel Arena Vendôme / St Ouen</strong> collecte des données personnelles via le formulaire de contact (nom, prénom, email, téléphone). Ces informations sont strictement nécessaires au traitement de vos demandes de devis ou d'informations.</p>
    ),
  },
  {
    icon: <Target size={22} />,
    title: "FINALITÉS DU TRAITEMENT",
    content: (
      <>
        <p className="mb-4">Les données recueillies servent uniquement à :</p>
        <ul className="list-disc pl-5 space-y-2 text-white/40">
          <li>L'établissement de propositions commerciales.</li>
          <li>La gestion de la relation client.</li>
          <li>L'envoi d'informations relatives à vos projets (réservations, abonnements, etc.).</li>
        </ul>
      </>
    ),
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "CONSERVATION ET SÉCURITÉ",
    content: (
      <p>Vos données sont conservées pendant la durée nécessaire à la finalité du traitement (maximum 3 ans après le dernier contact commercial). <strong className="text-white">Padel Arena Vendôme / St Ouen</strong> s'engage à mettre en œuvre les mesures techniques nécessaires pour garantir la sécurité et la confidentialité de vos informations.</p>
    ),
  },
  {
    icon: <Scale size={22} />,
    title: "VOS DROITS (RGPD)",
    content: (
      <>
        <p>Conformément à la réglementation européenne, vous disposez d'un droit d'accès, de rectification, d'effacement et d'opposition au traitement de vos données. Pour exercer ces droits, contactez-nous à :</p>
        <div className="flex items-center gap-3 mt-4">
          <Mail size={14} className="text-padel-yellow shrink-0" />
          <Link to="/contact" className="text-padel-yellow hover:text-white transition-colors">Via notre formulaire de contact</Link>
        </div>
      </>
    ),
  },
];

export const PolitiqueConfidentialitePage = () => {
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
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">DONNÉES PERSONNELLES</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black tracking-tighter leading-[0.85] uppercase mb-8">
              POLITIQUE DE <br />
              <span className="text-padel-blue italic">CONFIDENTIALITÉ</span>
            </h1>

            <p className="text-sm md:text-base text-white/30 font-medium max-w-xl mx-auto leading-relaxed">
              Nous accordons une grande importance à la protection et à la confidentialité de vos données personnelles.
            </p>
          </motion.div>
        </div>

        {/* Background Decor Text */}
        <div className="absolute top-32 -right-20 text-[10rem] md:text-[16rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-10 leading-none">
          PRIVACY
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
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-padel-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-5 mb-6 md:mb-8">
                  <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-padel-blue group-hover:bg-padel-yellow group-hover:text-white group-hover:scale-110 transition-all duration-500">
                    {section.icon}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[9px] md:text-[10px] font-black text-white/20 tracking-widest">0{i + 1}</span>
                    <h2 className="text-xs sm:text-sm md:text-base font-display font-black text-white uppercase tracking-[0.15em] md:tracking-[0.2em]">{section.title}</h2>
                  </div>
                </div>

                {/* Content */}
                <div className="text-sm md:text-base text-white/40 font-medium leading-relaxed pl-0 md:pl-[4.25rem]">
                  {section.content}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom spacer */}
        <div className="h-12 md:h-20" />
      </section>
    </motion.div>
  );
};
