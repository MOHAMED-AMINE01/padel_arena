import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Users, ArrowRight, Calendar, Star, ChevronRight, Award } from 'lucide-react';
import { cn } from '../lib/utils';

const tournaments = [
  {
    title: "HOMOLOGUÉS FÉDÉRAL",
    subtitle: "P250 & P500",
    desc: "L'arène pour les guerriers. Grimpez au classement national et affrontez l'élite régionale sur nos terrains panoramiques.",
    image: "/IMAGES/cal-gao-CA3laY8sok0-unsplash.jpg",
    tag: "ELITE",
    icon: <Trophy size={20} />
  },
  {
    title: "SOCIAL CUP LOISIRS",
    subtitle: "TOUS NIVEAUX",
    desc: "L'aspect social avant tout. Des tournois conviviaux suivis d'un moment de partage au Club House.",
    image: "/IMAGES/IMG_4502.JPG",
    tag: "CONVIVIAL",
    icon: <Medal size={20} />
  },
  {
    title: "MONTÉES-DESCENTES",
    subtitle: "DYNAMIQUE",
    desc: "Le format ultime pour progresser. Challengez des joueurs de votre niveau et tentez d'atteindre le terrain numéro 1.",
    image: "/IMAGES/artur-kornakov-ArI-foyWnfA-unsplash.jpg",
    tag: "GROWTH",
    icon: <Award size={20} />
  }
];

export const Tournaments = () => {
  return (
    <section id="tournois" className="relative py-24 md:py-48 px-6 overflow-hidden bg-dark-bg">
      {/* Ajout du code promo pour les tournois */}
      <div className="max-w-md mx-auto mb-12">
        <h4 className="text-lg font-black text-white mb-2 uppercase tracking-widest">Code promo tournoi</h4>
        <PromoCodeInput
          applicationType="tournament"
          onApply={(discount, code) => {
            setPromoDiscount(discount);
            setPromoCode(code);
          }}
        />
        {promoDiscount > 0 && (
          <div className="mt-2 text-green-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} />
            Code appliqué : <span className="font-mono bg-green-500/10 px-2 py-1 rounded">{promoCode}</span> (-{promoDiscount}€)
          </div>
        )}
        <div className="mt-2 text-white text-xs font-bold">
          Prix final : <span className="font-mono bg-padel-blue/10 px-2 py-1 rounded">{tournamentPrice - promoDiscount}€</span>
        </div>
      </div>
      {/* Editorial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[25%]" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white mr-[25%]" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start justify-between mb-20 md:mb-32 gap-12">
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-4 mb-8"
            >
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">L'ARÈNE DES CHAMPIONS</span>
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase"
            >
              RELEVEZ LE <br />
              <span className="text-padel-yellow italic">GRAND DÉFI</span>
            </motion.h3>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:pt-20"
          >
            <p className="text-white/40 max-w-sm text-base font-medium leading-relaxed">
              La compétition est gravée dans notre ADN. Rejoignez un environnement électrique où chaque point compte et chaque match vous fait grandir.
            </p>
          </motion.div>
        </div>

        {/* Tournaments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 mb-24 md:mb-40">
          {tournaments.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.23, 1, 0.32, 1] }}
              className="group relative h-[500px] md:h-[650px] rounded-[3rem] overflow-hidden cursor-pointer"
            >
              <img
                src={t.image}
                alt={t.title}
                className="absolute inset-0 w-full h-full object-cover grayscale-[40%] blur-[2px] group-hover:grayscale-0 hover:blur-[0px] group-hover:transition-all duration-1000 scale-110 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

              <div className="absolute inset-0 p-10 md:p-14 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white group-hover:bg-padel-blue group-hover:border-padel-blue transition-all duration-500">
                    {t.icon}
                  </div>
                  <span className="text-[9px] font-black tracking-[0.4em] text-padel-yellow uppercase">{t.tag}</span>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-padel-yellow text-[10px] font-black tracking-[0.3em] uppercase mb-1">{t.subtitle}</p>
                    <h4 className="text-4xl font-display font-black tracking-tighter text-white uppercase leading-none">
                      {t.title}
                    </h4>
                  </div>

                  <p className="text-white/40 text-xs md:text-sm leading-relaxed font-medium group-hover:text-white/70 transition-colors h-16 line-clamp-3">
                    {t.desc}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-widest">
                      <Calendar size={14} className="text-padel-blue" />
                      Inscriptions Ouvertes
                    </div>
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-padel-blue group-hover:border-padel-blue group-hover:translate-x-1 transition-all">
                      <ArrowRight size={18} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Leaderboard Section - Reimagined */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <div className="inline-flex items-center gap-3 py-1.5 px-4 rounded-full bg-padel-yellow/10 border border-padel-yellow/20 mb-8">
              <Star size={14} className="text-padel-yellow fill-padel-yellow" />
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-yellow uppercase">LIVE RANKING</span>
            </div>

            <h4 className="text-4xl md:text-6xl font-display font-black mb-8 leading-[0.95] tracking-tighter uppercase">
              LEADERBOARD <br />
              <span className="text-padel-blue italic">DU CLUB</span>
            </h4>

            <p className="text-white/40 text-base font-medium leading-relaxed mb-12 max-w-sm">
              Chaque match, chaque victoire compte. Suivez votre progression en temps réel et gagnez votre place au sommet de la hiérarchie.
            </p>

            <button className="group relative pr-16 py-4 text-white font-black text-xs uppercase tracking-[0.3em] overflow-hidden">
              <span className="relative z-10 transition-colors group-hover:text-padel-yellow">Tous les classements</span>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-padel-blue group-hover:w-full group-hover:rounded-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
                <ChevronRight size={16} className="text-white group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          </motion.div>

          <div className="lg:col-span-7">
            <div className="space-y-4">
              {[
                { rank: 1, name: "THOMAS R.", points: 2450, winRate: "82%", trend: "up" },
                { rank: 2, name: "LUCAS M.", points: 2120, winRate: "75%", trend: "up" },
                { rank: 3, name: "SOPHIE L.", points: 1980, winRate: "78%", trend: "down" }
              ].map((player, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="flex items-center justify-between p-8 glass rounded-[2rem] border-white/5 hover:border-padel-blue/30 transition-all group overflow-hidden relative"
                >
                  {/* Rank background decor */}
                  <span className="absolute -left-4 -bottom-8 text-8xl font-display font-black text-white/[0.02] select-none pointer-events-none">
                    0{player.rank}
                  </span>

                  <div className="flex items-center gap-8 relative z-10">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center font-display font-black text-xs",
                      i === 0 ? "bg-padel-yellow text-black" : "bg-white/5 text-white/40"
                    )}>
                      {player.rank}
                    </div>
                    <div>
                      <h5 className="font-display font-black text-xl text-white tracking-tight">{player.name}</h5>
                      <span className="text-[9px] font-black text-white/20 tracking-widest uppercase">{player.winRate} WIN RATE</span>
                    </div>
                  </div>

                  <div className="text-right relative z-10">
                    <div className="text-2xl font-display font-black text-padel-blue">{player.points}</div>
                    <span className="text-[9px] font-black tracking-widest text-padel-yellow uppercase">PTS ARENA</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Background Decor Text */}
      <div className="absolute -bottom-20 -right-20 text-[15rem] md:text-[25rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-10 leading-none">
        RANKING
      </div>
    </section>
  );
};
