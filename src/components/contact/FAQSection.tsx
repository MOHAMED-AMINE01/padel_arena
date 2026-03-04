import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Search, HelpCircle, ArrowUpRight, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

const faqs = [
  {
    category: "RÉSERVATION & PAIEMENT",
    label: "BOOKING",
    questions: [
      { q: "COMMENT RÉSERVER UN TERRAIN ?", a: "L'orchestration de vos sessions se fait instantanément via notre plateforme digitale. Sélectionnez votre créneau, confirmez en ligne, et votre terrain vous attend. Un email de confirmation détaillé vous sera envoyé dans la foulée." },
      { q: "PUIS-JE MODIFIER UNE RÉSERVATION ?", a: "La flexibilité est au cœur de notre service. Les annulations et modifications sont autorisées sans frais jusqu'à 24h avant l'échéance. Le crédit est immédiatement restitué sur votre Arena Wallet pour une utilisation future." },
      { q: "QUELS SONT LES MODES DE PAIEMENT ?", a: "Nous acceptons l'ensemble des réseaux bancaires internationaux (Visa, Mastercard, Amex), ainsi que les portefeuilles digitaux Apple Pay et Google Pay pour une expérience fluide." }
    ]
  },
  {
    category: "MEMBRES & ABONNEMENTS",
    label: "MEMBERSHIP",
    questions: [
      { q: "EST-CE UN ABONNEMENT SANS ENGAGEMENT ?", a: "Nos formules mensuelles sont conçues pour votre liberté. Vous pouvez suspendre votre accès en un clic depuis votre dashboard. Les versions annuelles, quant à elles, vous offrent les avantages tarifaires les plus compétitifs." },
      { q: "QUELS SONT LES PRIVILÈGES ÉLITE ?", a: "Les membres bénéficient d'un accès anticipé de 14 jours sur le calendrier, de tarifs préférentiels sur l'ensemble du complexe et d'un accès illimité au Lounge VIP Arena." }
    ]
  },
  {
    category: "ACADÉMIE & COACHING",
    label: "ACADEMY",
    questions: [
      { q: "PROPOSEZ-VOUS DU COACHING INDIVIDUEL ?", a: "Absolument. Nos coachs certifiés proposent des sessions de haute performance adaptées à votre style de jeu, que vous soyez en phase d'initiation ou de préparation à la compétition." },
      { q: "QUEL EST L'ÂGE MINIMUM REQUIS ?", a: "L'excellence commence tôt. Notre Kids Academy accueille les futurs champions dès l'âge de 6 ans avec un programme pédagogique exclusif Padel Arena." }
    ]
  }
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<string | null>("RÉSERVATION & PAIEMENT-0");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section id="faq" className="relative py-24 md:py-48 px-6 bg-[#050505] overflow-hidden border-t border-white/[0.03]">
      {/* Editorial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[25%]" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white mr-[25%]" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">

          {/* Sidebar / Header */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-4 mb-8">
                <span className="text-[10px] font-black tracking-[0.4em] text-padel-yellow uppercase">QUESTIONS FRÉQUENTES</span>
              </div>

              <h3 className="text-4xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase mb-12">
                DES RÉPONSES <br />
                <span className="text-padel-blue italic">PRÉCISES</span>
              </h3>

              <p className="text-base md:text-lg text-white/30 font-medium max-w-md mb-16 leading-relaxed">
                Retrouvez toutes les informations essentielles pour naviguer dans l'écosystème Padel Arena en toute sérénité.
              </p>

              {/* Search Bar */}
              <div className="relative group mb-16 max-w-md">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-padel-blue group-focus-within:scale-110 transition-transform">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  placeholder="RECHERCHER DANS L'ARENA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-6 pl-16 pr-8 text-xs font-bold text-white focus:border-padel-blue focus:outline-none transition-all placeholder:text-white/10 uppercase tracking-widest uppercase"
                />
              </div>

              <div className="flex items-center gap-6 p-10 glass rounded-[3rem] border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.05] -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                  <HelpCircle size={100} />
                </div>
                <div className="relative z-10">
                  <h4 className="text-xl font-display font-black uppercase tracking-tight mb-4 text-white">BESOIN D'ASSISTANCE ?</h4>
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-8">Notre équipe support est active 24/7 pour vos requêtes urgentes.</p>
                  <button className="flex items-center gap-4 text-padel-blue font-black text-[10px] tracking-[0.4em] uppercase group/btn">
                    NOUS CONTACTER <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Accordion Content */}
          <div className="lg:col-span-7">
            <div className="space-y-20">
              {faqs.map((cat, i) => {
                const filteredQuestions = cat.questions.filter(faq =>
                  !searchQuery || faq.q.toLowerCase().includes(searchQuery.toLowerCase())
                );

                if (searchQuery && filteredQuestions.length === 0) return null;

                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/[0.05]">
                      <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">{cat.category}</h4>
                      <span className="text-[9px] font-black text-padel-blue tracking-[0.2em]">{cat.label}</span>
                    </div>

                    <div className="space-y-6">
                      {filteredQuestions.map((faq, j) => {
                        const id = `${cat.category}-${j}`;
                        const isOpen = openIndex === id;

                        return (
                          <motion.div
                            key={j}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={cn(
                              "relative group rounded-[2.5rem] border transition-all duration-500 overflow-hidden",
                              isOpen ? "bg-white/[0.02] border-padel-blue/20" : "border-white/5 hover:border-white/10"
                            )}
                          >
                            <button
                              onClick={() => setOpenIndex(isOpen ? null : id)}
                              className="w-full p-10 md:p-12 flex items-center justify-between text-left relative z-10"
                            >
                              <span className={cn(
                                "text-lg md:text-xl font-display font-black uppercase tracking-tight pr-12 transition-colors",
                                isOpen ? "text-padel-blue" : "text-white group-hover:text-white/80"
                              )}>
                                {faq.q}
                              </span>
                              <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-700",
                                isOpen ? "bg-padel-yellow text-padel-blue rotate-180" : "bg-white/5 text-white/20 group-hover:bg-white/10"
                              )}>
                                {isOpen ? <Minus size={20} strokeWidth={3} /> : <Plus size={20} strokeWidth={3} />}
                              </div>
                            </button>

                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                                >
                                  <div className="px-10 md:px-12 pb-12">
                                    <div className="h-[1px] w-12 bg-padel-blue/30 mb-8" />
                                    <p className="text-sm md:text-base text-white/40 font-medium leading-[1.8] max-w-2xl uppercase tracking-tighter">
                                      {faq.a}
                                    </p>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Hover accent */}
                            {!isOpen && <div className="absolute inset-0 bg-gradient-to-r from-padel-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      <div className="absolute top-1/2 -left-40 text-[15rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-0 -rotate-90 leading-none uppercase">
        ANSWERS
      </div>
    </section>
  );
};
