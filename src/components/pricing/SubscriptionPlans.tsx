import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Check, ArrowUpRight, Star, Zap, Trophy, Loader2, Target, Heart, Users, Building2, ShieldCheck } from 'lucide-react';
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
  Trophy: <Trophy size={24} />,
  ShieldCheck: <ShieldCheck size={24} />,
  Target: <Target size={24} />,
  Heart: <Heart size={24} />,
  Users: <Users size={24} />,
  Building2: <Building2 size={24} />
};

export const SubscriptionPlans = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAnnual] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [userSubData, setUserSubData] = useState<any>(null);
  const currentUserSub = userSubData?.subscription;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dbSubsRes, userSubRes] = await Promise.all([
          api.get('/subscriptions/plans'),
          isAuthenticated ? api.get('/subscriptions/my-subscription') : Promise.resolve({ data: { data: null } })
        ]);

        if (dbSubsRes.data.success) {
          const fetchedPlans = dbSubsRes.data.data.map((sub: any) => {
            let icon = 'Star';
            if (sub.name.includes('PASS')) icon = 'ShieldCheck';
            if (sub.name.includes('Creuses')) icon = 'Zap';

            return {
              _id: sub._id,
              title: sub.name,
              price: sub.price.toString(),
              featured: sub.name.includes('PASS'),
              icon: icon,
              features: sub.features
            };
          });
          setPlans(fetchedPlans);
        }

        if (isAuthenticated && userSubRes.data.success) {
          setUserSubData(userSubRes.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  const canRenew = useMemo(() => {
    if (!userSubData?.expiresAt) return true;
    const expires = new Date(userSubData.expiresAt);
    const now = new Date();
    const diff = expires.getTime() - now.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    return days <= 7;
  }, [userSubData]);

  const isSubscribed = !!currentUserSub;

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
      <div className="py-24 flex justify-center bg-[#050505]">
        <Loader2 className="w-8 h-8 animate-spin text-padel-blue" />
      </div>
    );
  }

  if (plans.length === 0) return null;

  const isSingle = plans.length === 1;

  return (
    <section id="abonnements" className="relative py-24 md:py-24 px-6 bg-[#050505] overflow-hidden border-t border-white/[0.03]">
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
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className={cn(
              "flex gap-6 lg:gap-8 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory no-scrollbar pb-10 lg:pb-0",
              isSingle ? "lg:flex lg:justify-center" : "lg:grid lg:grid-cols-3"
            )}
          >
            {isSubscribed && !canRenew ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="col-span-full bg-padel-blue/10 border border-padel-blue/30 rounded-[4rem] p-12 md:p-20 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-96 h-96 bg-padel-blue/20 blur-[100px] -mr-48 -mt-48" />
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                  <div className="space-y-6 text-center md:text-left">
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                      <ShieldCheck size={16} className="text-emerald-500" />
                      <span className="text-[10px] font-black text-emerald-500 tracking-[0.3em] uppercase">ABONNEMENT ACTIF</span>
                    </div>
                    <h4 className="text-4xl md:text-6xl font-display font-black text-white italic uppercase tracking-tighter leading-none">
                      VOUS ÊTES <br /> <span className="text-padel-blue">MEMBRE ARENA</span>
                    </h4>
                    <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">PLAN ACTUEL</p>
                        <p className="text-xl font-display font-black text-white uppercase italic">{currentUserSub.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">EXPIRE LE</p>
                        <p className="text-xl font-display font-black text-padel-blue uppercase italic">
                          {userSubData.expiresAt ? new Date(userSubData.expiresAt).toLocaleDateString() : 'ILLIMITÉ'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-auto">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-relaxed text-center mb-6">
                        VOTRE ABONNEMENT EST ACTIF ET EN COURS. <br />
                        LA POSSIBILITÉ DE RENOUVELLEMENT APPARAÎTRA <br />
                        7 JOURS AVANT LA DATE D'EXPIRATION.
                      </p>
                      <button
                        disabled
                        className="w-full py-4 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-white/20 cursor-not-allowed"
                      >
                        EN COURS DE VALIDITÉ
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              plans.map((plan, i) => (
                <motion.div
                  key={plan._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className={cn(
                    "min-w-[85vw] sm:min-w-[400px] lg:min-w-0 snap-center group relative p-12 md:p-16 rounded-[4rem] border transition-all duration-700 flex flex-col h-full overflow-hidden",
                    isSingle && "lg:w-[460px] lg:max-w-full lg:flex-none",
                    plan.featured
                      ? cn("bg-[#0A0A0A] border-padel-blue/40 shadow-[0_50px_100px_rgba(19,73,211,0.1)] z-20", !isSingle && "lg:-translate-y-8")
                      : "glass border-white/5 hover:border-white/20"
                  )}
                >
                  <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-700", plan.color || "from-white/5 to-white/0")} />
                  {plan.featured && (
                    <div className="absolute top-8 right-8 z-20">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="px-5 py-2 bg-gradient-to-r from-padel-blue to-blue-600 text-white text-[8px] font-black uppercase tracking-[0.4em] rounded-full shadow-[0_0_20px_rgba(19,73,211,0.5)] border border-white/20"
                      >
                        {isSubscribed && canRenew ? 'RENOUVELLEMENT' : 'recommandé'}
                      </motion.div>
                    </div>
                  )}

                  <div className="relative z-10 mb-16">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-10 transition-all duration-500 group-hover:bg-padel-blue group-hover:text-white group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[0_0_30px_rgba(19,73,211,0.4)]",
                      plan.accent || "text-padel-blue"
                    )}>
                      {IconMap[plan.icon || ''] || <Zap size={24} />}
                    </div>
                    <h4 className="text-xl md:text-2xl font-display font-black uppercase tracking-tight mb-4 group-hover:text-padel-blue transition-colors">
                      {plan.title}
                    </h4>
                    <div className="flex items-baseline gap-3">
                      <span className="text-5xl md:text-8xl font-display font-black tracking-tighter text-white group-hover:scale-[1.02] transition-transform duration-500 inline-block text-nowrap">
                        {plan.price}
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

                  <div className="block cursor-not-allowed">
                    <button
                      disabled
                      className={cn(
                        "relative z-10 w-full py-6 rounded-full font-black text-[10px] tracking-[0.4em] uppercase transition-all duration-500 flex items-center justify-center gap-4 overflow-hidden group/btn shadow-xl bg-white/[0.02] border border-white/5 text-white/10"
                      )}>
                      <span className="relative z-10 flex items-center gap-3">
                        {isSubscribed && canRenew ? (
                          <>RENOUVELER MON PLAN <ArrowUpRight size={16} /></>
                        ) : (
                          <>S'ABONNER <ArrowUpRight size={16} /></>
                        )}
                      </span>
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

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
      </div>
    </section>
  );
};
