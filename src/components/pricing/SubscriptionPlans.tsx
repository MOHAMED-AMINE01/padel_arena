import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, ArrowUpRight, Star, Zap, Trophy, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';

interface IPlan {
  _id: string;
  title: string;
  price: string;
  annualPrice?: string;
  icon?: string;
  color?: string;
  accent?: string;
  featured: boolean;
  features: string[];
}

const IconMap: Record<string, React.ReactNode> = {
  Zap: <Zap size={24} />,
  Star: <Star size={24} />,
  Trophy: <Trophy size={24} />
};

export const SubscriptionPlans = () => {
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAnnual, setIsAnnual] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/pricing?type=subscription');
        if (res.data.success) setPlans(res.data.data);
      } catch (err) {
        console.error('Failed to fetch subscription plans', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
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
      <div className="py-24 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-padel-blue" />
      </div>
    );
  }

  if (plans.length === 0) return null;

  return (
    <section id="abonnements" className="relative py-24 md:py-48 px-6 bg-[#050505] overflow-hidden border-t border-white/[0.03]">
      {/* Structural Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-white opacity-[0.02] z-0" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 mb-20 md:mb-32">
          <div className="max-w-3xl text-center lg:text-left">
            <div className="inline-flex items-center gap-4 mb-8">
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-yellow uppercase">ABONNEMENTS EXCLUSIFS</span>
            </div>
            <h3 className="text-4xl sm:text-5xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase">
              REJOIGNEZ <br />
              <span className="text-padel-blue italic">LA COMMUNAUTÉ</span>
            </h3>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-6">
            <div className="flex items-center gap-6 p-2 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10">
              <button
                onClick={() => setIsAnnual(false)}
                className={cn(
                  "px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                  !isAnnual ? "bg-padel-blue text-white shadow-xl" : "text-white/30 hover:text-white"
                )}
              >
                Mensuel
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={cn(
                  "px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all relative",
                  isAnnual ? "bg-padel-blue text-white shadow-xl" : "text-white/30 hover:text-white"
                )}
              >
                Annuel
                {!isAnnual && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-padel-yellow opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-padel-yellow"></span></span>}
              </button>
            </div>
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">ÉCONOMISEZ 20% SUR LE PLAN ANNUEL</p>
          </div>
        </div>

        {/* Pricing Cards Carousel/Grid */}
        <div className="relative mb-32">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex lg:grid lg:grid-cols-3 gap-6 lg:gap-8 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory no-scrollbar pb-10 lg:pb-0"
          >
            {plans.map((plan, i) => (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className={cn(
                  "min-w-[85vw] sm:min-w-[400px] lg:min-w-0 snap-center group relative p-12 md:p-16 rounded-[4rem] border transition-all duration-700 flex flex-col h-full overflow-hidden",
                  plan.featured
                    ? "bg-[#0A0A0A] border-padel-blue/40 shadow-[0_50px_100px_rgba(19,73,211,0.1)] lg:-translate-y-8 z-20"
                    : "glass border-white/5 hover:border-white/20"
                )}
              >
                {/* Decorative background glow */}
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-700", plan.color || "from-white/5 to-white/0")} />

                {plan.featured && (
                  <div className="absolute top-8 right-8">
                    <div className="px-5 py-2 bg-padel-blue text-white text-[8px] font-black uppercase tracking-[0.4em] rounded-full">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                <div className="relative z-10 mb-16">
                  <div className={cn("w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-10 transition-colors group-hover:bg-padel-blue group-hover:text-white", plan.accent || "text-padel-blue")}>
                    {IconMap[plan.icon || ''] || <Zap size={24} />}
                  </div>
                  <h4 className="text-xl md:text-2xl font-display font-black uppercase tracking-tight mb-4 group-hover:text-padel-blue transition-colors">
                    {plan.title}
                  </h4>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl md:text-8xl font-display font-black tracking-tighter text-white">
                      {isAnnual ? (plan.annualPrice || Math.round(parseInt(plan.price) * 12 * 0.8)) : plan.price}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-2xl font-display font-black text-white italic">€</span>
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none">{isAnnual ? '/ AN' : '/ MOIS'}</span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 space-y-6 mb-16 flex-grow">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-5 group/item">
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors",
                        plan.featured ? "bg-padel-blue" : "bg-white/5 group-hover/item:bg-padel-blue"
                      )}>
                        <Check size={10} className="text-white" />
                      </div>
                      <span className="text-sm md:text-base text-white/40 font-medium group-hover/item:text-white/70 transition-colors leading-tight">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button className={cn(
                  "relative z-10 w-full py-6 rounded-full font-black text-[10px] tracking-[0.4em] uppercase transition-all duration-500 flex items-center justify-center gap-4 overflow-hidden group/btn shadow-xl",
                  plan.featured ? "bg-padel-blue text-white" : "bg-white/5 text-white border border-white/10 hover:border-padel-blue hover:text-padel-blue"
                )}>
                  <span className="relative z-10 flex items-center gap-3">
                    S'ABONNER <ArrowUpRight size={16} />
                  </span>
                  {plan.featured && <div className="absolute inset-0 bg-padel-yellow translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Pagination Indicators */}
          <div className="flex lg:hidden justify-center items-center gap-3 mt-4">
            {plans.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={cn(
                  "h-1.5 transition-all duration-500 rounded-full",
                  activeIndex === i ? "w-8 bg-padel-blue" : "w-1.5 bg-white/10"
                )}
              />
            ))}
          </div>
        </div>

        {/* ROI Simulator Section */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center px-6 md:px-16 py-16 md:py-24 glass rounded-[4rem] border-white/5 pb-32 md:pb-24">
          <div>
            <h4 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tighter leading-none mb-10">
              OPTIMISEZ <br /> <span className="text-padel-blue italic">VOTRE BUDGET</span>
            </h4>
            <p className="text-sm md:text-lg text-white/30 font-medium leading-relaxed mb-12">
              Plus vous jouez, plus vous économisez. Utilisez notre simulateur pour visualiser instantanément la rentabilité de votre abonnement Arena.
            </p>

            <div className="space-y-10">
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-4">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">SESSIONS HEBDOMADAIRES</span>
                  <span className="text-lg md:text-xl font-display font-black text-padel-blue uppercase">~4 Sessions</span>
                </div>
                <div className="h-[2px] w-full bg-white/5 rounded-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-[40%] bg-padel-blue shadow-[0_0_20px_rgba(19,73,211,0.5)]" />
                </div>
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">ÉCONOMIE MOYENNE</p>
                  <p className="text-3xl md:text-4xl font-display font-black text-white">45€<span className="text-xs text-padel-blue">/MOIS</span></p>
                </div>
                <div className="space-y-2 xs:border-l border-white/5 xs:pl-8">
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">RENTABILITÉ</p>
                  <p className="text-3xl md:text-4xl font-display font-black text-padel-yellow truncate">IMMÉDIATE</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative aspect-square md:aspect-auto md:h-[400px] rounded-[3rem] overflow-hidden group">
            <img
              src="/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-33226057.jpg"
              alt="Economy"
              className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 glass p-6 md:p-8 rounded-3xl border-white/10 backdrop-blur-3xl">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">STATISTIQUE ARENA</p>
              <p className="text-xl md:text-2xl font-display font-black text-white uppercase leading-tight">
                <span className="text-padel-blue">88%</span> DES JOUEURS RÉCURRENTS <br className="hidden sm:block" /> PASSENT À L'ABONNEMENT.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
