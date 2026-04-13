import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, Users, Heart, Sparkles, ArrowUpRight, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

const jobs = [
  { title: "COACH PADEL SENIOR", type: "CDI / TEMPS PLEIN", location: "CENTRE VENDÔME", desc: "Orchestrez l'excellence technique de nos membres et de notre Kids Academy haut de gamme." },
  { title: "RESPONSABLE HOSPITALITÉ", type: "CDI / TEMPS PLEIN", location: "CENTRE VENDÔME", desc: "Gérez l'expérience client 5 étoiles, de l'accueil personnalisé à l'animation du Lounge VIP." },
  { title: "CONCIERGE D'ACCUEIL", type: "CDD / ÉTUDIANT", location: "CENTRE VENDÔME", desc: "Incarnez l'image de Padel Arena et assurez une fluidité opérationnelle exemplaire le weekend." },
];

export const RecruitmentSection = () => {
  return (
    <section id="recrutement" className="relative py-24 md:py-48 px-6 bg-[#050505] overflow-hidden border-t border-white/[0.03]">
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">

          <div className="lg:col-span-5 sticky top-40">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-4 mb-8">
                <div className="w-12 h-[1px] bg-padel-blue" />
                <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">CARRIÈRES ARENA</span>
              </div>

              <h3 className="text-4xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase mb-10">
                FAITES PARTIE <br />
                <span className="text-white italic">DU MOUVEMENT</span>
              </h3>

              <p className="text-sm md:text-lg text-white/30 font-medium max-w-lg mb-12 leading-relaxed uppercase tracking-tighter">
                Nous recherchons des visionnaires et des passionnés pour redéfinir l'expérience du padel en France. Intégrez une structure d'élite en pleine expansion.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Users size={18} />, title: "TEAM ARENA", desc: "Synergie et excellence collective." },
                  { icon: <Heart size={18} />, title: "PASSION ACTIVE", desc: "Vivez le sport à chaque instant." },
                  { icon: <Sparkles size={18} />, title: "CADRE ÉLITE", desc: "Infrastructures haut de gamme." },
                  { icon: <Briefcase size={18} />, title: "PROGRESSION", desc: "Trajectoires de carrière sur mesure." },
                ].map((val, i) => (
                  <div key={i} className="glass p-8 rounded-3xl border-white/5 group hover:border-padel-blue/20 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-padel-blue mb-6 group-hover:bg-padel-blue group-hover:text-white transition-all">
                      {val.icon}
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-2">{val.title}</h4>
                    <p className="text-[9px] text-white/20 font-medium uppercase leading-relaxed tracking-tighter">{val.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 px-6">
              <div>
                <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-2 leading-none">CURRENT OPPORTUNITIES</h4>
                <p className="text-2xl font-display font-black text-white uppercase italic tracking-tighter">3 POSTES OUVERTS</p>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-padel-blue transition-colors">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  placeholder="FILTRER LES OFFRES"
                  className="bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-6 text-[10px] font-black text-white focus:border-padel-blue focus:outline-none transition-all uppercase tracking-widest placeholder:text-white/5 w-64"
                />
              </div>
            </div>

            {jobs.map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="group relative glass p-10 md:p-14 rounded-[4rem] border-white/5 hover:border-padel-blue/20 transition-all duration-700 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-10">
                  <div className="max-w-md">
                    <h5 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tight mb-4 group-hover:text-padel-blue transition-colors leading-tight">
                      {job.title}
                    </h5>
                    <div className="flex flex-wrap gap-4">
                      <span className="px-4 py-2 rounded-full bg-padel-blue/10 text-[9px] font-black text-padel-blue uppercase tracking-widest border border-padel-blue/20">
                        {job.type}
                      </span>
                      <span className="px-4 py-2 rounded-full bg-white/5 text-[9px] font-black text-white/20 uppercase tracking-widest border border-white/10">
                        {job.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-[2rem] glass border border-white/10 flex items-center justify-center text-white/20 group-hover:bg-padel-blue group-hover:text-white group-hover:rotate-12 transition-all duration-500">
                      <ArrowUpRight size={28} />
                    </div>
                  </div>
                </div>

                <p className="text-sm md:text-base text-white/30 font-medium leading-relaxed mb-12 uppercase tracking-tighter">
                  {job.desc}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <button className="w-full sm:w-auto px-10 py-5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.4em] hover:bg-padel-blue hover:text-white transition-all shadow-xl">
                    CANDIDATURE PRIORITAIRE
                  </button>
                  <button className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-padel-blue transition-colors">
                    VOIR LA FICHE DE POSTE
                  </button>
                </div>

                {/* Technical lines background */}
                <div className="absolute top-0 right-0 w-full h-full opacity-[0.02] pointer-events-none select-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-white" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-full bg-white" />
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="p-12 rounded-[4rem] border border-dashed border-white/10 text-center group"
            >
              <h4 className="text-xl font-display font-black text-white uppercase mb-4">AUCUNE OFFRE NE VOUS CORRESPOND ?</h4>
              <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em] mb-10 max-w-sm mx-auto leading-loose">
                VOTRE TALENT NOUS INTÉRESSE. ENVOYEZ NOUS VOTRE PORTFOLIO ET VOTRE VISION DU SPORT.
              </p>
              <button className="px-12 py-5 glass border border-white/10 text-white rounded-full font-black text-[10px] uppercase tracking-[0.4em] hover:bg-padel-blue hover:border-padel-blue transition-all group-hover:shadow-[0_0_30px_rgba(19,73,211,0.2)]">
                CANDIDATURE SPONTANÉE
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
