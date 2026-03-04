import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    CreditCard,
    Download,
    Filter,
    Search,
    ArrowUpRight,
    ArrowDownRight,
    CheckCircle2,
    Clock,
    XCircle,
    TrendingUp,
    Banknote,
    Wallet,
    Receipt,
    Plus,
    X,
    Save,
    Calculator,
    Zap,
    ShieldCheck,
    History,
    Loader2,
    RefreshCw,
    Trash2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';
import { PremiumDatePicker } from '../../components/admin/PremiumDatePicker';

const NumberTicker = ({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutExpo = 1 - Math.pow(2, -10 * progress);

            const current = easeOutExpo * end;
            setDisplayValue(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(end);
            }
        };

        requestAnimationFrame(animate);
    }, [value]);

    return (
        <span>{prefix}{displayValue.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{suffix}</span>
    );
};

export function AdminPayments() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isShiftOpen, setIsShiftOpen] = useState(true);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [registerFormData, setRegisterFormData] = useState({
        amount: '',
        type: 'INCOME',
        description: '',
        method: 'CASH'
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const [transactionPage, setTransactionPage] = useState(1);
    const transactionsPerPage = 4;
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, id: string, isManual: boolean }>({
        isOpen: false,
        id: '',
        isManual: false
    });

    // Cash Shift States
    const [currentShift, setCurrentShift] = useState<any>(null);
    const [shiftFormData, setShiftFormData] = useState({ startingCash: '', endingCash: '', notes: '' });
    const [closingSummary, setClosingSummary] = useState<any>(null);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [shiftHistory, setShiftHistory] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [historyFilters, setHistoryFilters] = useState({
        startDate: '',
        endDate: ''
    });
    const [deleteShiftModal, setDeleteShiftModal] = useState<{ isOpen: boolean, id: string }>({
        isOpen: false,
        id: ''
    });

    const shiftsPerPage = 4;

    const fetchCurrentShift = async () => {
        try {
            const res = await api.get('/admin/cash-shift/current');
            setCurrentShift(res.data.data);
            setIsShiftOpen(!!res.data.data);
        } catch (err) {
            console.error('Error fetching shift:', err);
        }
    };

    const fetchShiftHistory = async () => {
        try {
            const params = new URLSearchParams();
            if (historyFilters.startDate) params.append('startDate', historyFilters.startDate);
            if (historyFilters.endDate) params.append('endDate', historyFilters.endDate);

            const res = await api.get(`/admin/cash-shift/history?${params.toString()}`);
            setShiftHistory(res.data.data);
            setCurrentPage(1); // Reset to first page on filter
        } catch (err) {
            console.error('Error fetching shift history:', err);
        }
    };

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/transactions');
            setTransactions(res.data.data.list);
            setStats(res.data.data.stats);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching transactions:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
        fetchCurrentShift();
        fetchShiftHistory();
    }, [historyFilters]);

    const filteredTransactions = transactions.filter(tr => {
        const matchesSearch =
            tr.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tr.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tr.amount.toString().includes(searchTerm);

        const matchesType = filterType === 'ALL' || tr.type === filterType;

        return matchesSearch && matchesType;
    });

    const indexOfLastTransaction = transactionPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
    const totalTransactionPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/admin/transactions', {
                amount: parseFloat(registerFormData.amount),
                type: registerFormData.type,
                description: registerFormData.description,
                method: registerFormData.method
            });
            setShowRegisterModal(false);
            setRegisterFormData({ amount: '', type: 'INCOME', description: '', method: 'CASH' });
            fetchTransactions();
        } catch (err) {
            console.error('Error creating transaction:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTransaction = (id: string, isManual: boolean) => {
        if (!isManual) return;
        setDeleteModal({ isOpen: true, id, isManual });
    };

    const confirmDelete = async () => {
        setIsSubmitting(true);
        try {
            await api.delete(`/admin/transactions/${deleteModal.id}`);
            setDeleteModal({ ...deleteModal, isOpen: false });
            fetchTransactions();
        } catch (err) {
            console.error('Error deleting transaction:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenShift = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await api.post('/admin/cash-shift/open', {
                startingCash: undefined,
                notes: ""
            });
            setCurrentShift(res.data.data);
            setIsShiftOpen(true);
            setShiftFormData({ startingCash: '', endingCash: '', notes: '' });
            fetchShiftHistory();
        } catch (err) {
            console.error('Error opening shift:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseShift = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await api.post('/admin/cash-shift/close', {
                endingCash: undefined,
                notes: ""
            });
            setClosingSummary(res.data.summary);
            setShowSummaryModal(true);
            setCurrentShift(null);
            setIsShiftOpen(false);
            setShiftFormData({ startingCash: '', endingCash: '', notes: '' });
            fetchTransactions();
            fetchShiftHistory();
        } catch (err) {
            console.error('Error closing shift:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleExportAudit = () => {
        const headers = ['Reference', 'Auteur_Client', 'Label', 'Montant', 'Methode', 'Date', 'Type'];
        const csvRows = transactions.map(t => [
            t.id,
            t.user.replace(/,/g, ' '),
            t.label.replace(/,/g, ' '),
            t.amount,
            t.method,
            new Date(t.date).toISOString().replace('T', ' ').slice(0, 16),
            t.type
        ].join(','));

        const csvContent = "\uFEFF" + [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `padel_arena_audit_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDeleteShift = (id: string, status: string) => {
        if (status === 'OPEN') return;
        setDeleteShiftModal({ isOpen: true, id });
    };

    const confirmDeleteShift = async () => {
        setIsSubmitting(true);
        try {
            await api.delete(`/admin/cash-shift/${deleteShiftModal.id}`);
            setDeleteShiftModal({ isOpen: false, id: '' });
            fetchShiftHistory();
        } catch (err) {
            console.error('Error deleting shift:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const indexOfLastShift = currentPage * shiftsPerPage;
    const indexOfFirstShift = indexOfLastShift - shiftsPerPage;
    const currentShifts = shiftHistory.slice(indexOfFirstShift, indexOfLastShift);
    const totalPages = Math.ceil(shiftHistory.length / shiftsPerPage);

    const totalRevenue = stats?.totalRevenue || 0;
    const totalExpenses = stats?.totalExpenses || 0;
    const netProfit = stats?.netProfit || 0;
    const cashInRegister = stats?.cashInHand || 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-10"
        >
            {/* Tactical Financial Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 md:gap-10 border-b border-white/5 pb-8 md:pb-12 pt-6 md:pt-0">
                <div className="space-y-3 md:space-y-5">

                    <div>
                        <h1 className="text-4xl md:text-6xl xl:text-8xl font-display font-black text-white uppercase tracking-tighter leading-[0.9] md:leading-[0.8]">
                            Finances <br /> <span className="text-padel-yellow drop-shadow-[0_0_35px_rgba(255,210,31,0.25)]">& Caisses</span>
                        </h1>
                        <p className="text-[9px] md:text-xs font-bold text-white/30 uppercase tracking-[0.2em] md:tracking-[0.5em] mt-4 md:mt-6 flex items-center gap-2 md:gap-3">
                            <Zap size={12} className="text-padel-yellow md:w-4 md:h-4" /> Audit Réseau • Trésorerie Live • Reporting
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 md:gap-5 w-full xl:w-auto">
                    <div className="flex bg-[#1a1a1e] border border-white/5 p-1 md:p-1.5 rounded-xl md:rounded-2xl backdrop-blur-xl w-full sm:w-auto overflow-hidden">
                        <button
                            onClick={() => !isShiftOpen && handleOpenShift()}
                            disabled={isSubmitting}
                            className={cn(
                                "flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-3 md:py-3.5 rounded-lg md:rounded-xl text-[8px] md:text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                isShiftOpen ? "bg-green-500 text-white shadow-xl shadow-green-500/20 cursor-default" : "text-white/30 hover:text-white"
                            )}
                        >
                            {isSubmitting && !isShiftOpen ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />} Caisse Ouverte
                        </button>
                        <button
                            onClick={() => isShiftOpen && handleCloseShift()}
                            disabled={isSubmitting}
                            className={cn(
                                "flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-3 md:py-3.5 rounded-lg md:rounded-xl text-[8px] md:text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                !isShiftOpen ? "bg-red-500 text-white shadow-xl shadow-red-500/20 cursor-default" : "text-white/30 hover:text-white"
                            )}
                        >
                            {isSubmitting && isShiftOpen ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />} Clôture
                        </button>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={fetchTransactions}
                            className="flex-1 sm:flex-none p-3.5 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-white hover:text-padel-blue hover:bg-white/10 transition-all flex items-center justify-center active:scale-95"
                        >
                            <RefreshCw size={18} className={cn(loading && "animate-spin", "md:w-5 md:h-5")} />
                        </button>

                        <button
                            onClick={handleExportAudit}
                            className="flex-[2] sm:flex-none flex items-center justify-center gap-3 md:gap-4 px-6 md:px-10 py-3.5 md:py-5 rounded-xl md:rounded-[2rem] bg-white/[0.03] border border-white/10 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all group backdrop-blur-md active:scale-95 whitespace-nowrap"
                        >
                            <Download size={16} className="text-padel-blue transition-transform md:w-5 md:h-5" /> Export Audit
                        </button>
                    </div>
                </div>
            </div>

            {/* Tactical Metrics Overdrive */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {[
                    { label: 'Revenu Brut', val: totalRevenue, trend: stats?.analytics?.trends?.revenue || '+0%', icon: Wallet, color: 'blue', desc: 'Mensuel' },
                    { label: 'Fond Caisse', val: cashInRegister, trend: 'Net', icon: Banknote, color: 'yellow', desc: 'Liquide' },
                    { label: 'Sorties', val: totalExpenses, trend: stats?.analytics?.trends?.expenses || '+0%', icon: ArrowDownRight, color: 'red', desc: 'Auditées' },
                    { label: 'Bénéfice Net', val: netProfit, trend: stats?.analytics?.trends?.profit || '+0%', icon: TrendingUp, color: 'green', desc: 'Infrastructure' }
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                        whileHover={{ y: -6, scale: 1.02 }}
                        className="group bg-[#151518]/60 backdrop-blur-2xl border border-white/5 p-5 md:p-10 rounded-2xl md:rounded-[3.5rem] relative overflow-hidden shadow-2xl transition-all duration-500"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-padel-blue/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="flex items-center justify-between mb-6 md:mb-10 relative z-10">
                            <div className={cn(
                                "w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-[2rem] flex items-center justify-center border transition-all duration-700 shadow-xl",
                                stat.color === 'blue' ? "bg-padel-blue/10 border-padel-blue/20 text-padel-blue" :
                                    stat.color === 'yellow' ? "bg-padel-yellow/10 border-padel-yellow/20 text-padel-yellow" :
                                        stat.color === 'green' ? "bg-green-500/10 border-green-500/20 text-green-500" :
                                            "bg-red-500/10 border-red-500/20 text-red-500"
                            )}>
                                <stat.icon size={24} className="md:w-9 md:h-9" />
                            </div>
                            <div className={cn(
                                "flex text-[9px] md:text-[11px] font-black px-3 md:px-5 py-1.5 md:py-2.5 rounded-full border items-center gap-1.5 md:gap-2 shadow-lg",
                                stat.trend.includes('+') ? "bg-green-500/10 border-green-500/20 text-green-500" :
                                    stat.trend.includes('-') ? "bg-red-500/10 border-red-500/20 text-red-500" :
                                        "bg-padel-blue/10 border-padel-blue/20 text-padel-blue"
                            )}>
                                <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />
                                {stat.trend}
                            </div>
                        </div>

                        <div className="space-y-1 relative z-10">
                            <p className="text-[9px] md:text-xs font-black text-white/30 uppercase tracking-[0.2em] md:tracking-[0.4em] mb-1 md:mb-2">{stat.label}</p>
                            <div className="flex items-baseline gap-2">
                                <h4 className="text-xl md:text-4xl lg:text-5xl font-black text-white tracking-tighter leading-none">
                                    {typeof stat.val === 'number' ? <NumberTicker value={stat.val} /> : stat.val}
                                </h4>
                                <span className="text-xs md:text-lg font-black text-white/20 uppercase">€</span>
                            </div>
                            <p className="text-[8px] md:text-[10px] font-bold text-white/10 uppercase tracking-widest mt-2 md:mt-4 flex items-center gap-2">
                                <span className="w-4 h-[1px] bg-white/10" /> {stat.desc} Dashboard
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Tactical Matrix Display */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Transaction Matrix */}
                <div className="xl:col-span-2 bg-[#151518]/60 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-[4rem] overflow-hidden shadow-3xl">
                    <div className="p-6 md:p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
                        <div className="space-y-1 md:space-y-2">
                            <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3 md:gap-4">
                                <History className="text-padel-yellow w-4 h-4 md:w-5 md:h-5" /> Matrix Transactions
                            </h3>
                            <p className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-[0.2em] md:tracking-[0.3em]">Flux de Trésorerie • Temps Réel</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-center w-full md:w-auto">
                            <div className="relative group/search w-full sm:w-auto">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/search:text-padel-blue transition-colors" size={16} />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setTransactionPage(1);
                                    }}
                                    placeholder="ATHLÈTE, RÉF..."
                                    className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 pr-6 text-[10px] md:text-xs font-bold text-white focus:outline-none focus:border-padel-blue/40 w-full sm:w-[180px] md:w-[250px] transition-all"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    setFilterType(filterType === 'ALL' ? 'INCOME' : filterType === 'INCOME' ? 'EXPENSE' : 'ALL');
                                    setTransactionPage(1);
                                }}
                                className={cn(
                                    "w-full sm:w-auto px-4 py-3 md:p-4 rounded-xl md:rounded-2xl border transition-all active:scale-95 flex items-center justify-center gap-2",
                                    filterType === 'ALL' ? "bg-white/5 border-white/10 text-white/40" :
                                        filterType === 'INCOME' ? "bg-green-500/10 border-green-500/20 text-green-500" :
                                            "bg-red-500/10 border-red-500/20 text-red-500"
                                )}
                            >
                                <Filter size={16} />
                                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">{filterType === 'ALL' ? 'Tous' : filterType}</span>
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/[0.02] text-[8px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.2em] md:tracking-[0.4em]">
                                    <th className="px-6 md:px-10 py-6 md:py-8 whitespace-nowrap">Réf.</th>
                                    <th className="px-4 md:px-8 py-6 md:py-8">Flux</th>
                                    <th className="px-4 md:px-8 py-6 md:py-8">Montant</th>
                                    <th className="hidden sm:table-cell px-4 md:px-8 py-6 md:py-8">Vecteur</th>
                                    <th className="hidden md:table-cell px-8 py-8 whitespace-nowrap">Horodatage</th>
                                    <th className="px-6 md:px-10 py-6 md:py-8 text-right">Contrôle</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center">
                                            <Loader2 className="animate-spin text-padel-blue mx-auto mb-4" size={40} />
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Audit des flux en cours...</p>
                                        </td>
                                    </tr>
                                ) : filteredTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center">
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Aucun résultat pour cette recherche</p>
                                        </td>
                                    </tr>
                                ) : (
                                    currentTransactions.map((tr, idx) => (
                                        <motion.tr
                                            key={tr.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * idx }}
                                            className="hover:bg-white/[0.03] transition-all group border-b border-white/[0.02] last:border-0"
                                        >
                                            <td className="px-6 md:px-10 py-5 md:py-6 font-black text-white/10 tracking-[0.1em] text-[8px] md:text-[10px]">#{tr.id.toString().slice(-4).toUpperCase()}</td>
                                            <td className="px-4 md:px-8 py-5 md:py-6">
                                                <div className="flex flex-col gap-0.5 md:gap-1 min-w-0">
                                                    <p className="text-[10px] md:text-sm font-black text-white group-hover:text-padel-blue transition-colors uppercase tracking-tighter truncate max-w-[100px] md:max-w-none">{tr.user}</p>
                                                    <p className="text-[7px] md:text-[9px] font-bold text-white/20 uppercase tracking-widest truncate max-w-[100px] md:max-w-none">{tr.label}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-8 py-5 md:py-6">
                                                <div className="flex items-center gap-2 md:gap-3">
                                                    <div className={cn(
                                                        "w-1 md:w-1.5 h-4 md:h-6 rounded-full shrink-0",
                                                        (tr.type === 'INCOME' || tr.type === 'REVENUE') ? (tr.amount >= 0 ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]") : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                                                    )} />
                                                    <span className={cn(
                                                        "text-xs md:text-lg font-black tracking-tighter whitespace-nowrap",
                                                        (tr.type === 'INCOME' || tr.type === 'REVENUE') ? (tr.amount >= 0 ? "text-green-500" : "text-red-500") : "text-red-500"
                                                    )}>
                                                        {tr.type === 'EXPENSE' ? '' : tr.amount >= 0 ? '+' : ''}{tr.amount.toFixed(2)}€
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="hidden sm:table-cell px-4 md:px-8 py-6">
                                                <div className="flex items-center gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-white/5 border border-white/5 w-fit">
                                                    {tr.method === 'Stripe' ? <Zap size={10} className="text-padel-blue" /> : tr.method === 'CASH' ? <Banknote size={10} className="text-padel-yellow" /> : <CreditCard size={10} className="text-white/40" />}
                                                    <span className="text-[7px] md:text-[9px] font-black text-white/40 uppercase tracking-widest">{tr.method}</span>
                                                </div>
                                            </td>
                                            <td className="hidden md:table-cell px-8 py-6 text-[11px] font-bold text-white/20 uppercase tracking-tighter whitespace-nowrap">
                                                {new Date(tr.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="px-6 md:px-10 py-5 md:py-6 text-right">
                                                <div className="flex justify-end">
                                                    {tr.isManual ? (
                                                        <button
                                                            onClick={() => handleDeleteTransaction(tr.id, tr.isManual)}
                                                            className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all group/btn active:scale-95 shadow-lg shadow-red-500/10"
                                                        >
                                                            <Trash2 size={14} className="md:w-[18px] md:h-[18px]" />
                                                        </button>
                                                    ) : (
                                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 text-white/10 flex items-center justify-center border border-white/5">
                                                            <ShieldCheck size={14} className="md:w-[18px] md:h-[18px]" />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalTransactionPages > 1 && (
                        <div className="p-6 md:p-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest order-2 sm:order-1">
                                Page {transactionPage} sur {totalTransactionPages}
                            </p>
                            <div className="flex gap-3 w-full sm:w-auto order-1 sm:order-2">
                                <button
                                    onClick={() => setTransactionPage(prev => Math.max(prev - 1, 1))}
                                    disabled={transactionPage === 1}
                                    className="flex-1 sm:flex-none px-6 py-3 md:py-3.5 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 text-[10px] md:text-[11px] font-black text-white uppercase tracking-widest hover:bg-white/10 disabled:opacity-20 transition-all active:scale-95 shadow-lg"
                                >
                                    Précédent
                                </button>
                                <button
                                    onClick={() => setTransactionPage(prev => Math.min(prev + 1, totalTransactionPages))}
                                    disabled={transactionPage === totalTransactionPages}
                                    className="flex-1 sm:flex-none px-6 py-3 md:py-3.5 rounded-xl md:rounded-2xl bg-padel-blue text-white shadow-xl shadow-padel-blue/20 text-[10px] md:text-[11px] font-black uppercase tracking-widest hover:bg-padel-yellow hover:text-padel-blue disabled:opacity-20 transition-all active:scale-95"
                                >
                                    Suivant
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tactical Sidebar Tools */}
                <div className="space-y-6 md:space-y-10">
                    {/* Caisse Console */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-[#1a1a1e]/80 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-[3.5rem] p-6 md:p-10 shadow-3xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-padel-blue via-padel-yellow to-padel-blue animate-shimmer" />

                        <div className="flex items-center justify-between mb-8 md:mb-10">
                            <div>
                                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter leading-tight">Console <span className="text-padel-yellow">Caisse</span></h3>
                                <p className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-[0.3em] md:tracking-[0.4em] mt-1">Opérations Tactiques Directes</p>
                            </div>
                            <div className={cn(
                                "p-3 md:p-4 rounded-xl md:rounded-2xl shrink-0 transition-all duration-700",
                                isShiftOpen ? "bg-green-500/10 text-green-500 animate-pulse" : "bg-red-500/10 text-red-500"
                            )}>
                                <Calculator size={20} className="md:w-6 md:h-6" />
                            </div>
                        </div>

                        <div className="space-y-4 md:space-y-6">
                            <button
                                onClick={() => isShiftOpen && setShowRegisterModal(true)}
                                disabled={!isShiftOpen}
                                className={cn(
                                    "w-full flex items-center justify-between p-4 md:p-6 rounded-xl md:rounded-3xl transition-all duration-700 shadow-xl group/btn active:scale-95",
                                    isShiftOpen
                                        ? "bg-padel-blue text-white shadow-padel-blue/20 hover:bg-padel-yellow hover:text-padel-blue"
                                        : "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed opacity-50"
                                )}
                            >
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className={cn(
                                        "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center",
                                        isShiftOpen ? "bg-white/20" : "bg-white/5"
                                    )}>
                                        <Plus size={20} className="md:w-6 md:h-6" />
                                    </div>
                                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-left">Nouveau Flux <br /><span className="opacity-60 text-[8px] md:text-[9px]">Vente / Cash</span></span>
                                </div>
                                <ArrowUpRight className={cn("hidden sm:block", isShiftOpen ? "opacity-40" : "opacity-10")} size={20} />
                            </button>

                            <button
                                onClick={() => {
                                    if (!isShiftOpen) return;
                                    setRegisterFormData({ ...registerFormData, type: 'EXPENSE', description: '', amount: '' });
                                    setShowRegisterModal(true);
                                }}
                                disabled={!isShiftOpen}
                                className={cn(
                                    "w-full flex items-center justify-between p-4 md:p-6 rounded-xl md:rounded-3xl border transition-all duration-500 active:scale-95 group/btn",
                                    isShiftOpen
                                        ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                                        : "bg-white/[0.02] border-white/5 text-white/10 cursor-not-allowed"
                                )}
                            >
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className={cn(
                                        "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center",
                                        isShiftOpen ? "bg-white/10" : "bg-white/5"
                                    )}>
                                        <ArrowDownRight size={20} className={cn("md:w-6 md:h-6", isShiftOpen ? "text-red-500" : "text-white/10")} />
                                    </div>
                                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-left">Retrait Flux <br /><span className="opacity-60 text-[8px] md:text-[9px]">Sortie Caisse</span></span>
                                </div>
                                <ArrowUpRight className={cn("hidden sm:block", isShiftOpen ? "opacity-20" : "opacity-5")} size={20} />
                            </button>
                        </div>

                        <div className="mt-8 md:mt-10 p-5 md:p-6 rounded-2xl md:rounded-[2rem] bg-white/[0.02] border border-white/5 border-dashed space-y-4">
                            <div className="flex justify-between items-center text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                                <span className="text-white/30">Dernier mouvement</span>
                                <span className="text-white/60">
                                    {stats?.lastUpdate ? new Date(stats.lastUpdate).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Aucun'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                                <span className="text-white/30">Opérateur</span>
                                <span className="text-padel-blue">{user?.name || 'Vérification...'}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Analytics Mini-Matrix */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-gradient-to-br from-padel-blue/10 to-transparent border border-white/5 rounded-2xl md:rounded-[3.5rem] p-6 md:p-10 shadow-xl"
                    >
                        <h4 className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.2em] md:tracking-[0.3em] mb-6 md:mb-8 flex items-center gap-3">
                            <TrendingUp size={16} className="text-padel-blue" /> Analytics Express
                        </h4>

                        <div className="space-y-6 md:space-y-8">
                            {[
                                { label: 'Stripe (Digital)', val: `${stats?.analytics?.stripePercent || 0}%`, color: 'bg-padel-blue' },
                                { label: 'Espèces (Cash)', val: `${stats?.analytics?.cashPercent || 0}%`, color: 'bg-padel-yellow' }
                            ].map(item => (
                                <div key={item.label} className="space-y-2 md:space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-widest">{item.label}</span>
                                        <span className="text-[10px] md:text-xs font-black text-white">{item.val}</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: item.val }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className={cn("h-full rounded-full shadow-[0_0_15px_rgba(19,73,211,0.3)]", item.color)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Tactical Modal: Manual Register Entry */}
            <AnimatePresence>
                {
                    showRegisterModal && (
                        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowRegisterModal(false)}
                                className="absolute inset-0 bg-dark-bg/90 backdrop-blur-2xl"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                                className="bg-[#1a1a1e] border border-white/10 w-full max-w-lg rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 relative z-10 shadow-4xl max-h-[90vh] overflow-y-auto custom-scrollbar"
                            >
                                <button
                                    onClick={() => setShowRegisterModal(false)}
                                    className="absolute top-6 md:top-8 right-6 md:right-8 w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-full flex items-center justify-center text-white/20 hover:text-white"
                                >
                                    <X size={18} className="md:w-5 md:h-5" />
                                </button>

                                <div className="mb-8 md:mb-10">
                                    <h3 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tighter">Entrée <span className="text-padel-yellow">Tactique</span></h3>
                                    <p className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-2">Mouvement Trésorerie Authentifié</p>
                                </div>

                                <form onSubmit={handleRegisterSubmit} className="space-y-6 md:space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Type de Flux Tactique</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setRegisterFormData({ ...registerFormData, type: 'INCOME' })}
                                                className={cn(
                                                    "py-4 md:py-5 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95",
                                                    registerFormData.type === 'INCOME' ? "bg-green-500/10 border-green-500/40 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]" : "bg-white/5 border-white/5 text-white/20"
                                                )}
                                            >
                                                Encaissement (IN)
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setRegisterFormData({ ...registerFormData, type: 'EXPENSE' })}
                                                className={cn(
                                                    "py-4 md:py-5 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95",
                                                    registerFormData.type === 'EXPENSE' ? "bg-red-500/10 border-red-500/40 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]" : "bg-white/5 border-white/5 text-white/20"
                                                )}
                                            >
                                                Décaissement (OUT)
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Montant Transactionnel</label>
                                        <div className="relative group/amount">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-padel-yellow group-focus-within/amount:bg-padel-yellow/20 group-focus-within/amount:text-padel-yellow transition-all duration-500 shadow-xl">
                                                <Banknote size={24} className="md:w-7 md:h-7" />
                                            </div>
                                            <input
                                                type="number"
                                                required
                                                step="0.01"
                                                value={registerFormData.amount}
                                                onChange={(e) => setRegisterFormData({ ...registerFormData, amount: e.target.value })}
                                                placeholder="0.00"
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-[3rem] pl-16 md:pl-24 pr-10 py-5 md:py-8 text-2xl md:text-4xl font-black text-white focus:outline-none focus:border-padel-blue/50 focus:bg-white/[0.06] transition-all tracking-tighter placeholder:text-white/5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 text-[10px] md:text-sm font-black text-white/20 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                                                EUR
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Libellé / Justificatif</label>
                                        <div className="relative group/desc">
                                            <input
                                                type="text"
                                                required
                                                value={registerFormData.description}
                                                onChange={(e) => setRegisterFormData({ ...registerFormData, description: e.target.value })}
                                                placeholder="ex: Vente Cash Raquette Wilson"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-[1.5rem] px-6 py-4 md:py-6 text-xs md:text-base font-bold text-white focus:outline-none focus:border-padel-blue transition-all group-focus-within/desc:bg-white/[0.08] placeholder:text-white/10"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-5 md:py-8 bg-padel-blue text-white rounded-2xl md:rounded-[2.5rem] text-[11px] md:text-sm font-black uppercase tracking-[0.3em] shadow-3xl shadow-padel-blue/30 hover:bg-padel-yellow hover:text-padel-blue transition-all duration-700 flex items-center justify-center gap-4 mt-10 md:mt-12 disabled:opacity-50 active:scale-95 group/submit"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (
                                            <>
                                                <Save size={20} className="transition-transform group-hover/submit:scale-110" />
                                                <span>Sauvegarder Mouvement</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )
                }
            </AnimatePresence >

            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={confirmDelete}
                title="Supprimer la Transaction"
                message="Cette action est irréversible. Le mouvement de caisse sera définitivement retiré des audits financiers."
                isLoading={isSubmitting}
            />

            <DeleteConfirmModal
                isOpen={deleteShiftModal.isOpen}
                onClose={() => setDeleteShiftModal({ ...deleteShiftModal, isOpen: false })}
                onConfirm={confirmDeleteShift}
                title="Supprimer le rapport"
                message="Voulez-vous vraiment supprimer cet historique de shift ? Cette action est irréversible."
                isLoading={isSubmitting}
            />

            {/* Modal: Summary / Z-Report */}
            <AnimatePresence>
                {showSummaryModal && closingSummary && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSummaryModal(false)} className="absolute inset-0 bg-dark-bg/95 backdrop-blur-3xl" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-[#1a1a1e] border border-white/10 w-full max-w-md rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 relative z-10 shadow-5xl overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-padel-yellow/5 blur-3xl rounded-full -mr-16 -mt-16" />

                            <div className="w-16 h-16 md:w-20 md:h-20 bg-padel-yellow/10 text-padel-yellow rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8 border border-padel-yellow/20 relative">
                                <Receipt size={32} className="md:w-10 md:h-10" />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center text-white border-2 border-[#1a1a1e]">
                                    <ShieldCheck size={12} />
                                </div>
                            </div>

                            <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-tighter mb-2 leading-none text-center">Rapport <span className="text-padel-yellow">Analytique</span></h3>
                            <p className="text-[9px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.3em] md:tracking-[0.4em] mb-8 md:mb-10 text-center">Session d'Audit Terminée • {new Date().toLocaleDateString('fr-FR')}</p>

                            <div className="space-y-3 md:space-y-4 mb-8 md:mb-10">
                                <div className="flex justify-between items-center p-4 md:p-5 rounded-xl md:rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-xl">
                                    <span className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-widest text-left">Cash Initial</span>
                                    <span className="text-xs md:text-sm font-black text-white/60 font-mono tracking-tighter">{closingSummary.startingCash.toFixed(2)} €</span>
                                </div>
                                <div className="flex justify-between items-center p-4 md:p-5 rounded-xl md:rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-xl">
                                    <span className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-widest text-left">Mouvement Cash Net</span>
                                    <div className="flex flex-col items-end">
                                        <span className={cn("text-xs md:text-sm font-black tracking-tighter", closingSummary.netMovement >= 0 ? "text-green-500" : "text-red-500")}>
                                            {closingSummary.netMovement >= 0 ? '+' : ''}{closingSummary.netMovement.toFixed(2)} €
                                        </span>
                                        <span className="text-[7px] font-bold uppercase tracking-widest opacity-20">Audit Direct</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-4 md:p-5 rounded-xl md:rounded-2xl bg-padel-blue/5 border border-padel-blue/20">
                                    <span className="text-[9px] md:text-[10px] font-black text-padel-blue uppercase tracking-widest text-left">Flux Digital (Stripe)</span>
                                    <span className="text-xs md:text-sm font-black text-padel-blue tracking-tighter">+{closingSummary.stripeRevenue.toFixed(2)} €</span>
                                </div>
                                {closingSummary.otherRevenue > 0 && (
                                    <div className="flex justify-between items-center p-4 md:p-5 rounded-xl md:rounded-2xl bg-white/[0.03] border border-white/5">
                                        <span className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-widest text-left">Vecteurs Externes</span>
                                        <span className="text-xs md:text-sm font-black text-white tracking-tighter">+{closingSummary.otherRevenue.toFixed(2)} €</span>
                                    </div>
                                )}
                                <div className="p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-padel-yellow to-[#f59e0b] text-padel-blue shadow-2xl shadow-padel-yellow/20 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 blur-2xl rounded-full -mr-10 -mt-10" />
                                    <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mb-1 opacity-60">TOTAL RÉALISÉ SUR LE SHIFT</p>
                                    <p className="text-2xl md:text-4xl font-black tracking-tighter leading-none">{(closingSummary.totalRevenue).toFixed(2)} €</p>
                                </div>
                            </div>

                            <button onClick={() => setShowSummaryModal(false)} className="w-full py-5 md:py-7 bg-white text-dark-bg rounded-2xl md:rounded-[2.5rem] text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] hover:bg-padel-yellow transition-all duration-500 font-display active:scale-95 shadow-2xl">
                                Valider & Archiver l'Audit
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Tactical Shift History Matrix */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#151518]/40 backdrop-blur-2xl border border-white/5 rounded-2xl md:rounded-[3rem] shadow-3xl"
            >
                <div className="p-6 md:p-10 border-b border-white/5 flex flex-col xl:flex-row xl:items-center justify-between gap-6 md:gap-8">
                    <div className="space-y-3">
                        <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3 md:gap-4">
                            <Clock className="text-padel-blue w-5 h-5 md:w-6 md:h-6" size={20} /> Historique des Shifts
                        </h3>
                        <p className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-[0.3em] leading-relaxed">Chronologie des ouvertures & fermetures de caisse</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full xl:w-auto">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
                            <div className="w-full sm:w-[180px]">
                                <PremiumDatePicker
                                    value={historyFilters.startDate}
                                    onChange={(date) => setHistoryFilters({ ...historyFilters, startDate: date })}
                                    placeholder="Du..."
                                />
                            </div>
                            <div className="w-full sm:w-[180px]">
                                <PremiumDatePicker
                                    value={historyFilters.endDate}
                                    onChange={(date) => setHistoryFilters({ ...historyFilters, endDate: date })}
                                    placeholder="Au..."
                                    align="right"
                                />
                            </div>
                            {(historyFilters.startDate || historyFilters.endDate) && (
                                <button
                                    onClick={() => setHistoryFilters({ startDate: '', endDate: '' })}
                                    className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10 flex items-center justify-center"
                                    title="Réinitialiser les filtres"
                                >
                                    <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                                    <span className="sm:hidden ml-2 text-[10px] font-black uppercase tracking-widest">Réinitialiser</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-white/[0.02] text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.3em] md:tracking-[0.4em]">
                                <th className="px-6 md:px-10 py-5 md:py-6">Période</th>
                                <th className="px-6 md:px-8 py-5 md:py-6">Responsable</th>
                                <th className="px-6 md:px-8 py-5 md:py-6">Fond Initial</th>
                                <th className="px-6 md:px-8 py-5 md:py-6">Fond Final</th>
                                <th className="px-6 md:px-8 py-5 md:py-6 text-center">Flux net</th>
                                <th className="px-6 md:px-8 py-5 md:py-6 text-center">Écart / Status</th>
                                <th className="px-6 md:px-10 py-5 md:py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {currentShifts.map((shift, idx) => (
                                <tr key={shift._id} className="hover:bg-white/[0.03] transition-all group">
                                    <td className="px-6 md:px-10 py-5 md:py-6">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs md:text-sm font-black text-white uppercase tracking-tighter">
                                                {new Date(shift.startTime).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                                            </p>
                                            <p className="text-[9px] md:text-[10px] font-bold text-white/20 uppercase tracking-wider">
                                                {new Date(shift.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                {shift.endTime && ` • ${new Date(shift.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 md:px-8 py-5 md:py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-padel-blue/10 flex items-center justify-center text-padel-blue font-black text-[10px] md:text-[11px] border border-padel-blue/20">
                                                {shift.openedBy?.name?.charAt(0) || '?'}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs md:text-sm font-black text-white uppercase tracking-tighter truncate max-w-[120px] md:max-w-none">{shift.openedBy?.name || 'Tactical Admin'}</span>
                                                <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest leading-none mt-1">Manager</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 md:px-8 py-5 md:py-6 text-xs md:text-sm font-black text-white/40 font-mono tracking-tighter">
                                        {shift.startingCash.toFixed(2)} €
                                    </td>
                                    <td className="px-6 md:px-8 py-5 md:py-6 text-xs md:text-sm font-black text-white tracking-tighter">
                                        {shift.status === 'CLOSED' ? (
                                            <span className="text-white">{shift.endingCash.toFixed(2)} €</span>
                                        ) : (
                                            <span className="text-white/10">---</span>
                                        )}
                                    </td>
                                    <td className="px-6 md:px-8 py-5 md:py-6 text-center">
                                        {shift.status === 'CLOSED' ? (
                                            <div className={cn(
                                                "inline-flex flex-col items-center px-4 py-1.5 rounded-xl border",
                                                (shift.endingCash - shift.startingCash) >= 0 ? "bg-green-500/5 border-green-500/10 text-green-500" : "bg-red-500/5 border-red-500/10 text-red-500"
                                            )}>
                                                <span className="text-[11px] md:text-xs font-black tracking-tighter leading-none">
                                                    {(shift.endingCash - shift.startingCash) >= 0 ? '+' : ''}{(shift.endingCash - shift.startingCash).toFixed(2)} €
                                                </span>
                                                <span className="text-[8px] font-bold uppercase tracking-widest mt-1 opacity-50">Flux Net</span>
                                            </div>
                                        ) : (
                                            <span className="text-white/10">---</span>
                                        )}
                                    </td>
                                    <td className="px-6 md:px-8 py-5 md:py-6 text-center">
                                        {shift.status === 'OPEN' ? (
                                            <div className="flex justify-center">
                                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[8px] md:text-[9px] font-black uppercase tracking-widest animate-pulse">
                                                    <Zap size={10} className="md:w-[12px] md:h-[12px]" /> En cours
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-1">
                                                {shift.endingCash === shift.expectedEndingCash ? (
                                                    <span className="px-4 py-1.5 rounded-full bg-padel-blue/10 border border-padel-blue/20 text-padel-blue text-[8px] md:text-[9px] font-black uppercase tracking-widest">Opérationnel OK</span>
                                                ) : (
                                                    <div className={cn(
                                                        "px-4 py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border",
                                                        (shift.endingCash - shift.expectedEndingCash) > 0 ? "bg-blue-500/10 border-blue-500/20 text-blue-500" : "bg-red-500/10 border-red-500/20 text-red-500"
                                                    )}>
                                                        {(shift.endingCash - shift.expectedEndingCash) > 0 ? 'Excédent: +' : 'Écart: '}{(shift.endingCash - shift.expectedEndingCash).toFixed(2)}€
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 md:px-10 py-5 md:py-6 text-right">
                                        <div className="flex justify-end">
                                            <button
                                                disabled={shift.status === 'OPEN'}
                                                onClick={() => handleDeleteShift(shift._id, shift.status)}
                                                className={cn(
                                                    "w-10 h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl flex items-center justify-center transition-all group/btn active:scale-95 shadow-lg",
                                                    shift.status === 'OPEN' ? "bg-white/5 text-white/5 cursor-not-allowed" : "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                                                )}
                                            >
                                                <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="p-6 md:p-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                            Page {currentPage} sur {totalPages}
                        </p>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 disabled:opacity-20 transition-all active:scale-95"
                            >
                                Précédent
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-padel-blue text-white shadow-xl shadow-padel-blue/20 text-[10px] font-black uppercase tracking-widest hover:bg-padel-yellow hover:text-padel-blue disabled:opacity-20 transition-all active:scale-95"
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div >
    );
}
