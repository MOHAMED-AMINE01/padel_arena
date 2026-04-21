import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Zap, Plus, History, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export const WalletPage = () => {
  const { user, refreshUser } = useAuth();
  const [creditPacks, setCreditPacks] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPacksLoading, setIsPacksLoading] = useState(true);
  const [isRecharging, setIsRecharging] = useState<number | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('success') === 'true') {
      toast.success('Paiement réussi ! Votre portefeuille a été mis à jour.');
      refreshUser();
      window.history.replaceState({}, '', window.location.pathname);
    }

    const fetchWalletData = async () => {
      try {
        const [walletRes, pricingRes] = await Promise.all([
          api.get('/wallet/me'),
          api.get('/pricing?type=wallet_pack')
        ]);

        if (walletRes.data.success) {
          setHistory(walletRes.data.history);
        }

        if (pricingRes.data.success) {
          const packs = pricingRes.data.data.map((p: any) => ({
            _id: p._id,
            amount: p.creditAmount || parseFloat(p.price || '0'),
            bonus: p.bonusAmount || 0,
            price: parseFloat(p.price || '0'),
            tag: p.title,
            featured: p.featured
          }));
          setCreditPacks(packs);
        }
      } catch (err) {
        console.error('Failed to fetch wallet data', err);
      } finally {
        setIsLoading(false);
        setIsPacksLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const handleRecharge = async (pack: any) => {
    const totalToCredit = pack.amount + pack.bonus;
    setIsRecharging(pack.price);
    try {
      const res = await api.post('/payments/create-wallet-session', {
        planId: pack._id,
        successUrl: window.location.origin + '/wallet?success=true',
        cancelUrl: window.location.origin + '/wallet'
      });

      if (res.data.success && res.data.url) {
        window.location.href = res.data.url;
      } else {
        toast.error('Erreur lors de la création de la session de paiement.');
      }
    } catch (err) {
      toast.error('Impossible de contacter le service de paiement.');
    } finally {
      setIsRecharging(null);
    }
  };


  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-padel-blue/10 border border-padel-blue/20 text-padel-blue text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            <Zap size={12} /> Système de Crédits
          </div>
          <h1 className="text-5xl md:text-8xl font-display font-black text-white italic uppercase tracking-tighter leading-none">
            MON <br />
            <span className="text-padel-blue italic">PORTEFEUILLE</span>
          </h1>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] flex items-center gap-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-padel-blue opacity-10 blur-3xl pointer-events-none" />
          <div>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2 italic">Solde Actuel</p>
            <p className="text-6xl font-display font-black text-white italic tracking-tighter">
              {user?.balance || 0}€
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-padel-blue flex items-center justify-center text-white shadow-lg shadow-padel-blue/20">
            <CreditCard size={32} />
          </div>
        </motion.div>
      </div>

      {/* Credit Packs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {creditPacks.map((pack, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -8 }}
            className={cn(
              "p-8 rounded-[2.5rem] border transition-all duration-500 relative group flex flex-col",
              pack.featured
                ? "bg-padel-blue border-white/20 shadow-2xl shadow-padel-blue/20"
                : "bg-white/[0.03] border-white/5 hover:border-white/10"
            )}
          >
            {pack.featured && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-padel-yellow text-padel-blue text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                RECOMMANDÉ
              </div>
            )}

            <div className="mb-6 flex justify-between items-start">
              <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">{pack.tag}</div>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <Plus size={18} className="text-white/30" />
              </div>
            </div>

            <div className="mb-8">
              <div className="text-4xl font-display font-black text-white italic mb-1">
                {pack.amount + pack.bonus}€
              </div>
              {pack.bonus > 0 && (
                <p className="text-[10px] font-black text-padel-yellow uppercase tracking-widest italic">
                  Inclut {pack.bonus}€ offerts
                </p>
              )}
            </div>

            <div className="mt-auto pt-8 border-t border-white/5">
              <div className="flex justify-between items-end mb-6">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Prix</p>
                <p className="text-2xl font-display font-black text-white">{pack.price}€</p>
              </div>
              <button
                onClick={() => handleRecharge(pack)}
                disabled={isRecharging !== null}
                className={cn(
                  "w-full py-4 rounded-2xl font-display font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                  pack.featured
                    ? "bg-white text-padel-blue"
                    : "bg-padel-blue text-white hover:bg-padel-blue/80"
                )}
              >
                {isRecharging === pack.price ? <Loader2 className="animate-spin" size={16} /> : 'ACHETER MAINTENANT'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Transaction History & Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* History List */}
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-[3rem] p-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-padel-blue">
              <History size={24} />
            </div>
            <h3 className="text-3xl font-display font-black text-white italic uppercase tracking-tighter">HISTORIQUE RÉCENT</h3>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-20 bg-white/5 animate-pulse rounded-2xl" />
              ))
            ) : history.length > 0 ? (
              history.map((tx, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-colors group">
                  <div className="flex items-center gap-5 mb-4 md:mb-0">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      tx.type === 'INCOME' ? "bg-emerald-500/10 text-emerald-500" : "bg-padel-blue/10 text-padel-blue"
                    )}>
                      <Zap size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-padel-blue transition-colors">{tx.description}</p>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mt-1">
                        {new Date(tx.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-8">
                    <div className="text-right">
                      <p className={cn(
                        "text-xl font-display font-black italic",
                        tx.type === 'INCOME' ? "text-emerald-500" : "text-white"
                      )}>
                        {tx.type === 'INCOME' ? '+' : '-'}{tx.amount}€
                      </p>
                      <p className="text-[9px] text-white/20 uppercase font-black">{tx.method}</p>
                    </div>
                    <div className={cn(
                      "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                      tx.status === 'COMPLETED' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                    )}>
                      {tx.status}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white/[0.01] rounded-3xl border border-dashed border-white/10">
                <p className="text-white/20 font-display font-black uppercase tracking-widest italic">Aucune transaction trouvée</p>
              </div>
            )}
          </div>
        </div>

        {/* Security Benefits */}
        <div className="space-y-8">
          <div className="bg-[#151518]/60 border border-white/5 rounded-[3rem] p-10">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-8">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-2xl font-display font-black text-white italic uppercase tracking-tighter mb-4 leading-none">PAIEMENT <br />SÉCURISÉ</h3>
            <p className="text-white/40 font-medium leading-relaxed text-sm">
              Vos transactions sont entièrement sécurisées par Stripe.
              Crédits valables sans limite de durée.
            </p>
          </div>

          <div className="bg-padel-blue border border-white/10 rounded-[3rem] p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 blur-3xl pointer-events-none group-hover:opacity-20 transition-opacity" />
            <div className="relative z-10">
              <h3 className="text-2xl font-display font-black text-white italic uppercase tracking-tighter mb-4 leading-none">BESOIN <br />D'AIDE ?</h3>
              <p className="text-white/70 font-medium leading-relaxed text-sm mb-8">
                Une question sur vos crédits ? Notre équipe est disponible H24.
              </p>
              <Link
                to="/messages"
                className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white hover:gap-5 transition-all"
              >
                NOUS CONTACTER <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
