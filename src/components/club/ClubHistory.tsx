import React from 'react';
import { motion } from 'motion/react';

const timeline = [
  { year: "2022", title: "LA GENÈSE", desc: "Né d'une passion profonde pour le padel, le projet voit le jour avec l'ambition de redéfinir les standards du sport." },
  { year: "2023", title: "CONCEPTION", desc: "Immersion dans l'architecture et sélection rigoureuse des meilleurs matériaux pour nos infrastructures." },
  { year: "2024", title: "OUVERTURE", desc: "Ouverture officielle des portes. L'Arène Vendôme accueille ses premiers membres dans un cadre unique." },
  { year: "2025", title: "EXPANSION", desc: "Lancement de l'Académie et intégration de nouveaux terrains panoramiques pour répondre à la demande." },
  { year: "2026", title: "EXCELLENCE", desc: "Consolidation de notre statut de référence nationale et innovation constante pour notre communauté." },
];

export const ClubHistory = () => {
  return (
    <section id="histoire" className="relative py-24 md:py-24 px-6 bg-[#050505] overflow-hidden">
      {/* Editorial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[25%]" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white mr-[25%]" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">

          {/* Side Title (4 cols) - Sticky on Desktop */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-32 h-fit text-center lg:text-left">
            <div className="inline-flex items-center gap-4 mb-8">
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">NOTRE PARCOURS</span>
            </div>
            <h3 className="text-5xl md:text-7xl font-display font-black tracking-tighter leading-[0.9] uppercase mb-8 md:mb-10 lg:pr-10">
              UNE PASSION, <br />
              <span className="text-white italic">UNE AVENTURE</span>
            </h3>
            <p className="text-sm md:text-base text-white/30 font-medium leading-relaxed max-w-sm mx-auto lg:mx-0">
              De l'idée initiale à la référence régionale, découvrez les étapes clés qui ont forgé l'Arène.
            </p>
          </div>

          {/* Timeline Content (8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-start lg:pl-12 mt-10 lg:mt-0">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="group relative pl-10 md:pl-20 pb-20 md:pb-32 last:pb-0 border-l border-white/5"
              >
                {/* Year Marker Line */}
                <div className="absolute top-0 left-[-1px] w-[2px] h-full overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: i * 0.2, ease: "easeInOut" }}
                    className="w-full bg-padel-blue origin-top"
                  />
                </div>

                {/* Animated Dot */}
                <div className="absolute top-0 left-0 -translate-x-1/2 w-4 h-4 rounded-full border border-padel-blue bg-black z-20 group-hover:scale-125 transition-transform duration-500">
                  <div className="absolute inset-[3px] rounded-full bg-padel-blue animate-pulse" />
                </div>

                <div className="relative">
                  <div className="text-padel-blue font-display font-black text-5xl md:text-7xl tracking-tighter mb-4 opacity-50 group-hover:opacity-100 transition-opacity duration-700 leading-none">
                    {item.year}
                  </div>
                  <h4 className="text-2xl md:text-4xl font-display font-black text-white uppercase mb-6 group-hover:text-padel-blue transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-sm md:text-lg text-white/40 font-medium leading-relaxed max-w-2xl group-hover:text-white/70 transition-colors">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>


    </section>
  );
};
