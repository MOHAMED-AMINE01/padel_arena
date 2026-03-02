import React from 'react';
import { motion } from 'motion/react';
import {
    CreditCard,
    Search,
    Download,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    XCircle,
    History,
    TrendingUp,
    Receipt
} from 'lucide-react';
import { cn } from '../../lib/utils';

const transactions = [
    { id: '#TR-8821', type: 'Réservation', date: 'Demain, 26 Fév.', amount: '55.00 €', status: 'Réussi', method: '•••• 4242' },
    { id: '#TR-8815', type: 'Abonnement', date: '12 Féb. 2026', amount: '89.00 €', status: 'Réussi', method: '•••• 4242' },
    { id: '#TR-8790', type: 'Tournoi', date: '05 Féb. 2026', amount: '25.00 €', status: 'Réussi', method: '•••• 4242' },
    { id: '#TR-8742', type: 'Réservation', date: '28 Jan. 2026', amount: '45.00 €', status: 'Réussi', method: 'Cagnotte' },
];

export function PlayerPayments() {
    return (
        <div className="space-y-12 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-5xl font-display font-black text-white italic uppercase tracking-tighter leading-none mb-4">
                        Suivi des <br /> <span className="text-padel-blue">Paiements</span>
                    </h1>
                    <p className="text-white/40 text-[13px] font-medium max-w-md uppercase tracking-widest">
                        Historique complet de vos transactions et factures téléchargeables.
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-right min-w-[200px]">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Cagnotte Club</p>
                        <p className="text-2xl font-black text-padel-yellow italic">45.00 €</p>
                    </div>
                </div>
            </div>

            {/* Transaction List */}
            <div className="bg-[#151518] border border-white/10 rounded-[3rem] overflow-hidden">
                <div className="p-8 md:p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                        <Receipt size={18} className="text-padel-blue" /> Historique Récent
                    </h3>
                    <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/5 focus-within:border-padel-blue/30 transition-all">
                        <Search size={18} className="text-white/20" />
                        <input type="text" placeholder="RECHERCHER..." className="bg-transparent border-none outline-none text-[10px] font-black tracking-widest text-white placeholder:text-white/20 w-[150px]" />
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.01] text-[10px] font-black text-white/20 uppercase tracking-widest">
                                <th className="px-10 py-6">ID</th>
                                <th className="px-8 py-6">Type</th>
                                <th className="px-8 py-6">Date</th>
                                <th className="px-8 py-6">Montant</th>
                                <th className="px-8 py-6">Statut</th>
                                <th className="px-10 py-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs font-bold text-white/60">
                            {transactions.map((tr, i) => (
                                <tr key={tr.id} className="border-t border-white/5 hover:bg-white/[0.01] transition-colors group">
                                    <td className="px-10 py-6 text-white/30 font-mono text-[10px] uppercase tracking-widest">{tr.id}</td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 rounded-lg bg-white/5 text-white italic uppercase text-[9px] tracking-widest border border-white/10">{tr.type}</span>
                                    </td>
                                    <td className="px-8 py-6 text-white font-black italic">{tr.date}</td>
                                    <td className="px-8 py-6 text-padel-yellow text-sm font-black italic">{tr.amount}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-green-500 text-[9px] font-black uppercase tracking-widest">
                                            <CheckCircle2 size={12} /> {tr.status}
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <button className="p-3 rounded-xl bg-white/5 text-white/30 hover:text-white hover:bg-padel-blue transition-all group-hover:scale-110">
                                            <Download size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment methods placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#151518] border border-white/10 rounded-[2.5rem] p-10 group cursor-pointer hover:border-padel-blue/30 transition-all">
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.4em] mb-8">Méthode de paiement</h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-10 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-red-500/20 translate-x-2" />
                                <div className="w-8 h-8 rounded-full bg-yellow-500/20 -translate-x-2" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-white italic uppercase">Mastercard •••• 4242</p>
                                <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Expire 12/28</p>
                            </div>
                        </div>
                        <button className="text-[9px] font-black text-padel-blue uppercase tracking-widest hover:underline">Modifier</button>
                    </div>
                </div>

                <div className="bg-[#151518] border border-white/10 rounded-[2.5rem] p-10 flex items-center justify-center border-dashed group cursor-pointer hover:bg-white/[0.02] transition-all">
                    <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-white/20 group-hover:bg-padel-blue group-hover:text-white transition-all">
                            <CreditCard size={20} />
                        </div>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Ajouter une méthode</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
