import React from 'react';
import { motion } from 'motion/react';
import Spline from '@splinetool/react-spline';
import { Maximize2, MousePointer2, Info } from 'lucide-react';

export const ClubVirtualTour = () => {
  return (
    <section id="visite-3d" className="relative py-24 md:py-48 px-6 bg-[#050505] overflow-hidden">
      {/* Editorial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[25%]" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white mr-[25%]" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-padel-blue" />
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">EXPÉRIENCE IMMERSIVE</span>
            </div>
            <h3 className="text-5xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase">
              EXPLOREZ <br />
              <span className="text-white italic">L'ARÈNE EN 3D</span>
            </h3>
          </div>
        </div>

        <div className="relative aspect-video rounded-[3rem] md:rounded-[5rem] overflow-hidden border border-white/5 bg-black group shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
          {/* Spline Scene */}
          <div className="absolute inset-0">
            <Spline
              scene="https://prod.spline.design/qw3FlgO7ym39H3tV/scene.splinecode"
            />
          </div>

          {/* Controls Overlay */}
          <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row justify-between items-center gap-6 pointer-events-none">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="glass px-6 py-4 rounded-full flex items-center gap-4 pointer-events-auto backdrop-blur-2xl border-white/10">
                <div className="w-8 h-8 rounded-full bg-padel-blue/20 flex items-center justify-center text-padel-blue">
                  <MousePointer2 size={16} />
                </div>
                <div className="text-[10px] font-black text-white uppercase tracking-widest leading-none">
                  INTERAGIR AVEC LA SCÈNE
                </div>
              </div>
              <div className="glass px-6 py-4 rounded-full flex items-center gap-4 pointer-events-auto backdrop-blur-2xl border-white/10">
                <div className="w-8 h-8 rounded-full bg-padel-yellow/20 flex items-center justify-center text-padel-yellow">
                  <Info size={16} />
                </div>
                <div className="text-[10px] font-black text-white uppercase tracking-widest leading-none">
                  POINTS D'INTÉRÊT
                </div>
              </div>
            </div>

            <button className="w-14 h-14 rounded-full glass flex items-center justify-center text-white hover:bg-padel-blue hover:border-padel-blue transition-all duration-500 pointer-events-auto border-white/10">
              <Maximize2 size={24} />
            </button>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {[
            { title: "COURTS PANORAMIQUES", desc: "Visualisez la précision de nos vitres 12mm." },
            { title: "ATMOSPHÈRE LOUNGE", desc: "Plongez dans l'ambiance de notre bar dessiné par des designers." },
            { title: "VESTIAIRES ELITE", desc: "Découvrez le confort absolu de nos installations de récupération." }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glass p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] border-white/5 hover:border-padel-blue/20 transition-all duration-500 group"
            >
              <h4 className="text-[11px] font-black text-padel-blue tracking-[0.2em] uppercase mb-4 group-hover:text-padel-yellow transition-colors">{item.title}</h4>
              <p className="text-sm text-white/30 font-medium leading-relaxed group-hover:text-white/50 transition-colors">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>


    </section>
  );
};
