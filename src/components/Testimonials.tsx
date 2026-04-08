import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, Quote, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import api from '../lib/api';

interface ITestimonial {
  _id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
}

export const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.get('/content/testimonials');
        setTestimonials(res.data.data);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, offsetWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / offsetWidth);
      setActiveIndex(index);
    }
  };

  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * scrollRef.current.offsetWidth,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  if (loading) {
    return (
      <section id="avis" className="py-24 md:py-40 px-6 bg-dark-bg flex flex-col items-center justify-center gap-6">
        <Loader2 className="animate-spin text-padel-yellow" size={40} />
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Chargement des avis...</p>
      </section>
    );
  }

  return (
    <section id="avis" className="py-24 md:py-24 px-6 relative overflow-hidden bg-dark-bg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-sm font-display font-bold text-padel-blue tracking-[0.5em] uppercase mb-6">Témoignages</h2>
            <h3 className="text-4xl md:text-8xl font-display font-black tracking-tighter leading-none">
              ILS FONT VIBRER <br />
              <span className="text-padel-blue italic">NOTRE ARÈNE</span>
            </h3>
          </motion.div>
        </div>

        <div className="relative">
          {/* Main Slider */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 md:gap-8 pb-12"
          >
            {testimonials.map((t, idx) => (
              <div
                key={t._id}
                className="min-w-full md:min-w-[calc(50%-1rem)] lg:min-w-[calc(33.333%-1.5rem)] snap-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  className="relative bg-white/[0.02] border border-white/5 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] group hover:border-padel-blue/30 transition-all duration-700 h-full flex flex-col justify-between"
                >
                  <div>
                    <Quote className="absolute top-6 right-6 text-padel-blue/10 group-hover:text-padel-blue/20 transition-colors" size={60} />

                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={cn(i < t.rating ? "text-padel-yellow fill-padel-yellow" : "text-white/10")} />
                      ))}
                    </div>

                    <p className="text-lg md:text-xl text-white/80 font-medium italic mb-10 leading-relaxed relative z-10 break-words">
                      "{t.content}"
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                      <img src={t.avatar || `https://ui-avatars.com/api/?name=${t.name}&background=random`} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-white uppercase tracking-tighter">{t.name}</h4>
                      <p className="text-[10px] font-bold text-padel-blue uppercase tracking-widest">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Pagination - Only if more than 3 */}
          {testimonials.length > 3 && (
            <div className="flex justify-center gap-4 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={cn(
                    "h-1.5 transition-all duration-500 rounded-full",
                    activeIndex === i ? "w-12 bg-padel-blue shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "w-1.5 bg-white/10"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
