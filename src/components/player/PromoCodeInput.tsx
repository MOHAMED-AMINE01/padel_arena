import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface PromoCodeInputProps {
  onApply: (discount: number, code: string) => void;
  className?: string;
  applicationType?: 'booking' | 'subscription' | 'course' | 'tournament';
  purchaseAmount?: number;
}

export const PromoCodeInput: React.FC<PromoCodeInputProps> = ({ onApply, className, applicationType = 'booking', purchaseAmount = 0 }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleApply = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await api.post('/promo-codes/validate', { code, applicationType, purchaseAmount });
      if (res.data.success && res.data.data && res.data.data.discountAmount > 0) {
        setSuccess('Code appliqué !');
        onApply(res.data.data.discountAmount, code);
      } else {
        setError('Code invalide ou expiré');
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Erreur lors de la validation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn('w-full flex flex-col gap-2', className)}>
      <div className="flex items-center gap-2 w-full">
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Code promo"
          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-padel-blue outline-none text-sm font-bold transition-all"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={loading || !code}
          className="px-5 py-3 rounded-xl bg-padel-blue text-white text-xs font-bold uppercase transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Appliquer'}
        </button>
      </div>
      {error && (
        <div className="flex items-center gap-2 text-red-500 text-xs font-semibold">
          <XCircle size={16} /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 text-green-500 text-xs font-semibold">
          <CheckCircle2 size={16} /> {success}
        </div>
      )}
    </div>
  );
};
