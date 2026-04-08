import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { Plus, Maximize2, X } from 'lucide-react';

const images = [
  { src: "/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-33226056.jpg", size: "tall" },
  { src: "/IMAGES/IMG_4503.JPG", size: "wide" },
  { src: "/IMAGES/home.jpeg", size: "square" },
  { src: "/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-33226057.jpg", size: "tall" },
  { src: "/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-32897038.jpg", size: "square" },
  { src: "/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-34285600.jpg", size: "wide" },
];

export const ClubGallery = () => {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  return (
    <section id="galerie" className="relative py-24 md:py-24 px-6 bg-[#050505] overflow-hidden">
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
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-yellow uppercase">L'EXPÉRIENCE VISUELLE</span>
            </div>
            <h3 className="text-5xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase">
              L'IMMERSION <br />
              <span className="text-padel-blue italic">PAR L'IMAGE</span>
            </h3>
          </div>
          <div className="hidden lg:block text-right">
            <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">CURATED COLLECTION</div>
            <p className="text-4xl font-display font-black text-white uppercase opacity-10">GALLERY</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 auto-rows-[250px] md:auto-rows-[350px]">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              onClick={() => setSelectedImg(img.src)}
              className={cn(
                "relative rounded-3xl overflow-hidden group cursor-pointer border border-white/5",
                img.size === 'tall' ? "row-span-2" : "",
                img.size === 'wide' ? "md:col-span-2" : ""
              )}
            >
              <img
                src={img.src}
                alt={`Gallery ${i}`}
                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
              />

              {/* Premium Hover Overlay */}
              <div className="absolute inset-0 bg-[#050505]/40 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px] flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-padel-blue text-white flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500 shadow-2xl">
                  <Maximize2 size={24} />
                </div>
                <div className="absolute bottom-8 left-8">
                  <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    VOIR L'IMAGE
                  </p>
                </div>
              </div>

              {/* Subtle Corner Accent */}
              <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-padel-yellow opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
            className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-padel-blue transition-all z-[1010]"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImg(null);
              }}
            >
              <X size={24} />
            </motion.button>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative max-w-7xl max-h-full rounded-3xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] cursor-default px-1"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImg}
                alt="Selected Gallery"
                className="w-full h-auto max-h-[85vh] object-contain rounded-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Text */}
      <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 text-[15rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-10 -rotate-90">
        VISUAL
      </div>
    </section>
  );
};
