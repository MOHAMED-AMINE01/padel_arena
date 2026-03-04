import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Target,
    Settings,
    Plus,
    Clock,
    Zap,
    AlertTriangle,
    CheckCircle2,
    Calendar,
    Sparkles,
    ShieldCheck,
    X,
    Loader2,
    Trash2,
    Search,
    Filter,
    Download,
    Edit2,
    Save,
    MoreHorizontal,
    ChevronDown
} from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';

interface Court {
    _id: string;
    name: string;
    type: string;
    sport: 'Padel' | 'Pickleball' | 'Badminton';
    pricePerHour: number;
    description?: string;
    isActive: boolean;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Types d'infrastructure par sport
const typesBySport: Record<string, string[]> = {
    Padel: ['Padel Panorama', 'Padel Classic', 'Padel Indoor', 'Padel Outdoor'],
    Pickleball: ['Pickleball High', 'Pickleball Standard', 'Pickleball Indoor'],
    Badminton: ['Badminton Simple', 'Badminton Double', 'Badminton Pro'],
};

// Champs spécifiques par sport
const sportSpecificFields: Record<string, { label: string; key: string; type: string }[]> = {
    Padel: [
        { label: 'Murs vitrés', key: 'glasswalls', type: 'boolean' },
        { label: 'Éclairage LED', key: 'ledLighting', type: 'boolean' },
    ],
    Pickleball: [
        { label: 'Filet réglable', key: 'adjustableNet', type: 'boolean' },
        { label: 'Lignes permanentes', key: 'permanentLines', type: 'boolean' },
    ],
    Badminton: [
        { label: 'Volants fournis', key: 'shuttlecocks', type: 'boolean' },
        { label: 'Hauteur plafond (m)', key: 'ceilingHeight', type: 'number' },
    ],
};

export function AdminCourts() {
    const [courts, setCourts] = useState<Court[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [courtUsage, setCourtUsage] = useState<Record<string, number>>({});

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [sportFilter, setSportFilter] = useState<'ALL' | 'Padel' | 'Pickleball' | 'Badminton'>('ALL');
    const [typeFilter, setTypeFilter] = useState<string>('ALL');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'active' | 'maintenance'>('ALL');
    const [showFilters, setShowFilters] = useState(false);

    // Edit State
    const [editingCourt, setEditingCourt] = useState<Court | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        type: 'Padel Panorama',
        sport: 'Padel' as 'Padel' | 'Pickleball' | 'Badminton',
        pricePerHour: 45,
        description: '',
        isActive: true
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, id: string }>({
        isOpen: false,
        id: ''
    });
    const [isTypeOpen, setIsTypeOpen] = useState(false);

    const fetchCourts = async () => {
        try {
            const res = await api.get('/courts?all=true');
            setCourts(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching courts:', err);
            setLoading(false);
        }
    };

    // Calcul du taux d'usage par terrain (sur les 7 derniers jours)
    const fetchUsageStats = async () => {
        try {
            const res = await api.get('/bookings');
            const bookings = res.data.data || [];

            const now = new Date();
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

            // Heures d'ouverture par jour (8h à 22h = 14h par jour, 7 jours = 98h max)
            const maxHoursPerWeek = 14 * 7;

            const usageByCourtId: Record<string, number> = {};

            bookings.forEach((booking: any) => {
                const bookingDate = new Date(booking.date || booking.startTime);
                if (bookingDate >= sevenDaysAgo && bookingDate <= now) {
                    const courtId = booking.court?._id || booking.court;
                    if (courtId) {
                        // Durée en heures (par défaut 1.5h si non spécifié)
                        const duration = booking.duration ? booking.duration / 60 : 1.5;
                        usageByCourtId[courtId] = (usageByCourtId[courtId] || 0) + duration;
                    }
                }
            });

            // Convertir en pourcentage
            const usagePercentages: Record<string, number> = {};
            Object.keys(usageByCourtId).forEach(courtId => {
                usagePercentages[courtId] = Math.min(100, Math.round((usageByCourtId[courtId] / maxHoursPerWeek) * 100));
            });

            setCourtUsage(usagePercentages);
        } catch (err) {
            console.error('Error fetching usage stats:', err);
        }
    };

    useEffect(() => {
        fetchCourts();
        fetchUsageStats();
    }, []);

    const handleCreateCourt = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (editingCourt) {
                await api.put(`/courts/${editingCourt._id}`, formData);
            } else {
                await api.post('/courts', formData);
            }
            setShowModal(false);
            setEditingCourt(null);
            setFormData({ name: '', type: 'Padel Panorama', sport: 'Padel', pricePerHour: 45, description: '', isActive: true });
            fetchCourts();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Une erreur est survenue.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCourt = (id: string) => {
        setDeleteModal({ isOpen: true, id });
    };

    const confirmDelete = async () => {
        setIsSubmitting(true);
        try {
            await api.delete(`/courts/${deleteModal.id}`);
            setDeleteModal({ ...deleteModal, isOpen: false });
            fetchCourts();
        } catch (err) {
            console.error('Error deleting court:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditCourt = (court: Court) => {
        setEditingCourt(court);
        setFormData({
            name: court.name,
            type: court.type,
            sport: court.sport || 'Padel',
            pricePerHour: court.pricePerHour,
            description: court.description || '',
            isActive: court.isActive
        });
        setShowModal(true);
    };

    const handleExportCSV = () => {
        const headers = ['Nom', 'Sport', 'Type', 'Tarif/h', 'Status', 'Description', 'Créé le', 'Modifié le'];
        const csvRows = filteredCourts.map(c => [
            `"${c.name}"`,
            c.sport || 'Padel',
            `"${c.type}"`,
            c.pricePerHour,
            c.isActive ? 'Actif' : 'Maintenance',
            `"${(c.description || '').replace(/"/g, '""')}"`,
            c.createdAt ? new Date(c.createdAt).toLocaleDateString('fr-FR') : 'N/A',
            c.updatedAt ? new Date(c.updatedAt).toLocaleDateString('fr-FR') : 'N/A'
        ].join(';')); // Utilise ; pour compatibilité Excel FR

        const BOM = '\uFEFF'; // UTF-8 BOM pour Excel
        const csvContent = BOM + [headers.join(';'), ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `padel_arena_terrains_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredCourts = courts.filter(court => {
        const matchesSearch = court.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSport = sportFilter === 'ALL' || court.sport === sportFilter;
        const matchesType = typeFilter === 'ALL' || court.type === typeFilter;
        const matchesStatus = statusFilter === 'ALL' ||
            (statusFilter === 'active' && court.isActive) ||
            (statusFilter === 'maintenance' && !court.isActive);
        return matchesSearch && matchesSport && matchesType && matchesStatus;
    });

    // Types disponibles selon le filtre sport actuel
    const availableTypes = sportFilter === 'ALL'
        ? Object.values(typesBySport).flat()
        : typesBySport[sportFilter] || [];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-12 pb-10"
        >
            {/* Intel Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8 border-b border-white/5 pb-8 md:pb-10 pt-6 md:pt-0">
                <div className="space-y-3 md:space-y-4">

                    <div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white uppercase tracking-tighter leading-[0.9] md:leading-[0.85]">
                            Contrôle <br /> <span className="text-padel-yellow drop-shadow-[0_0_30px_rgba(255,210,31,0.3)]">Terrains</span>
                        </h1>
                        <p className="text-[10px] md:text-xs font-bold text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em] mt-3 md:mt-4">Optimisation Flux • Monitoring Technique</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="bg-white/5 backdrop-blur-md p-2 rounded-2xl border border-white/10 flex">
                        <div className="flex-1 px-4 md:px-6 py-2 md:py-3 border-r border-white/5 text-center">
                            <p className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-widest mb-0.5 md:mb-1">Actifs</p>
                            <p className="text-xl md:text-2xl font-black text-white tracking-tighter">{courts.filter(c => c.isActive).length}</p>
                        </div>
                        <div className="flex-1 px-4 md:px-6 py-2 md:py-3 text-center">
                            <p className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-widest mb-0.5 md:mb-1">Total</p>
                            <p className="text-xl md:text-2xl font-black text-white tracking-tighter">{courts.length}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setEditingCourt(null);
                            setFormData({ name: '', type: 'Padel Panorama', sport: 'Padel', pricePerHour: 45, description: '', isActive: true });
                            setShowModal(true);
                        }}
                        className="flex items-center justify-center gap-3 px-6 md:px-10 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] bg-padel-blue text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-padel-yellow hover:text-padel-blue transition-all duration-500"
                    >
                        <Plus size={18} className="md:w-5 md:h-5" /> Configurer Terrain
                    </button>
                </div>
            </div>

            {/* Tactical Control Bar */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-between">
                <div className="relative w-full md:max-w-xl group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-padel-blue transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher un terrain..."
                        className="w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl md:rounded-[1.5rem] py-4 md:py-5 pl-14 md:pl-16 pr-6 md:pr-8 text-xs md:text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-padel-blue/40 transition-all font-bold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-3 md:gap-4 w-full md:w-auto relative">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            "flex-1 md:flex-none flex items-center justify-center gap-2 md:gap-3 px-4 md:px-8 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all group",
                            showFilters && "border-padel-blue/40 bg-white/10"
                        )}
                    >
                        <Filter size={14} className={cn("text-white/40 group-hover:text-padel-blue transition-colors md:w-4 md:h-4", showFilters && "text-padel-blue")} /> Filtres
                    </button>

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-[110%] left-0 w-full md:w-80 bg-[#1A1A1E] border border-white/10 rounded-2xl p-4 z-50 shadow-3xl backdrop-blur-xl"
                            >
                                <div className="space-y-5">
                                    {/* Sport Filter */}
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-2">Discipline sportive</p>
                                        <div className="flex flex-wrap gap-2">
                                            {(['ALL', 'Padel', 'Pickleball', 'Badminton'] as const).map(sport => (
                                                <button
                                                    key={sport}
                                                    onClick={() => {
                                                        setSportFilter(sport);
                                                        setTypeFilter('ALL'); // Reset type when sport changes
                                                    }}
                                                    className={cn(
                                                        "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                                        sportFilter === sport
                                                            ? sport === 'Padel' ? "bg-padel-blue text-white"
                                                                : sport === 'Pickleball' ? "bg-padel-yellow text-black"
                                                                    : sport === 'Badminton' ? "bg-white text-black"
                                                                        : "bg-padel-blue text-white"
                                                            : "text-white/40 hover:bg-white/5 bg-white/5"
                                                    )}
                                                >
                                                    {sport === 'ALL' ? 'Tous' : sport}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Type Filter */}
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-2">Type d'infrastructure</p>
                                        <div className="flex flex-col gap-1 max-h-40 overflow-y-auto custom-scrollbar">
                                            <button
                                                onClick={() => setTypeFilter('ALL')}
                                                className={cn(
                                                    "text-left px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                                    typeFilter === 'ALL' ? "bg-padel-blue text-white" : "text-white/40 hover:bg-white/5"
                                                )}
                                            >
                                                Tous les types
                                            </button>
                                            {availableTypes.map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => setTypeFilter(type)}
                                                    className={cn(
                                                        "text-left px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                                        typeFilter === type ? "bg-padel-blue text-white" : "text-white/40 hover:bg-white/5"
                                                    )}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Status Filter */}
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-2">Statut</p>
                                        <div className="flex gap-2">
                                            {([
                                                { value: 'ALL', label: 'Tous' },
                                                { value: 'active', label: 'Actifs' },
                                                { value: 'maintenance', label: 'Maintenance' }
                                            ] as const).map(status => (
                                                <button
                                                    key={status.value}
                                                    onClick={() => setStatusFilter(status.value)}
                                                    className={cn(
                                                        "flex-1 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                                        statusFilter === status.value
                                                            ? status.value === 'active' ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
                                                                : status.value === 'maintenance' ? "bg-red-500/20 text-red-500 border border-red-500/30"
                                                                    : "bg-padel-blue text-white"
                                                            : "text-white/40 hover:bg-white/5 bg-white/5"
                                                    )}
                                                >
                                                    {status.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Active Filters Count */}
                                    {(sportFilter !== 'ALL' || typeFilter !== 'ALL' || statusFilter !== 'ALL') && (
                                        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                                            <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">
                                                {[sportFilter !== 'ALL', typeFilter !== 'ALL', statusFilter !== 'ALL'].filter(Boolean).length} filtre(s) actif(s)
                                            </span>
                                            <button
                                                onClick={() => {
                                                    setSportFilter('ALL');
                                                    setTypeFilter('ALL');
                                                    setStatusFilter('ALL');
                                                }}
                                                className="text-[8px] font-black text-padel-blue uppercase tracking-widest hover:text-padel-yellow transition-colors"
                                            >
                                                Réinitialiser
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={handleExportCSV}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 md:gap-3 px-4 md:px-10 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all group"
                    >
                        <Download size={14} className="text-white/40 group-hover:text-padel-blue md:w-4 md:h-4" /> Export
                    </button>
                </div>
            </div>

            {/* Matrix Operational Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 size={48} className="text-padel-blue animate-spin" />
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Chargement des données satellites...</p>
                    </div>
                ) : (
                    <>
                        {[...filteredCourts, 'ADD_CARD'].slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item, i) => (
                            item === 'ADD_CARD' ? (
                                <motion.div
                                    key="add-card"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 0.98 }}
                                    onClick={() => {
                                        setEditingCourt(null);
                                        setFormData({ name: '', type: 'Padel Panorama', sport: 'Padel', pricePerHour: 45, description: '', isActive: true });
                                        setShowModal(true);
                                    }}
                                    className="border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center gap-8 group cursor-pointer hover:border-padel-blue/30 transition-all min-h-[400px]"
                                >
                                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-white/10 group-hover:bg-padel-blue/10 group-hover:text-padel-blue group-hover:scale-110 transition-all duration-500">
                                        <Plus size={48} />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-black text-white uppercase tracking-widest mb-2">Expansion Terrain</p>
                                        <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                                            <ShieldCheck size={12} /> Auto-provisioning prêt
                                        </p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={(item as Court)._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.05 * i }}
                                    whileHover={{ y: -10, borderColor: 'rgba(19, 73, 211, 0.4)' }}
                                    className="bg-[#151518]/60 backdrop-blur-xl border border-white/5 rounded-2xl md:rounded-[3rem] p-6 md:p-10 group transition-all relative overflow-hidden shadow-3xl flex flex-col h-full"
                                >
                                    {/* Status Aura */}
                                    <div className={cn(
                                        "absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-0 group-hover:opacity-10 transition-opacity",
                                        (item as Court).isActive ? 'bg-green-500' : 'bg-red-500'
                                    )} />

                                    <div className="flex justify-between items-start mb-8 md:mb-12 relative z-10">
                                        <div className={cn(
                                            "w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-110",
                                            (item as Court).isActive ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                'bg-red-500/10 text-red-500 border border-red-500/20'
                                        )}>
                                            <Target size={24} className="md:w-8 md:h-8" />
                                        </div>
                                        <div className={cn(
                                            "flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] border backdrop-blur-md",
                                            (item as Court).isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                'bg-red-500/10 text-red-500 border-red-500/20'
                                        )}>
                                            <div className={cn("w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse",
                                                (item as Court).isActive ? 'bg-green-500' : 'bg-red-500'
                                            )} />
                                            {(item as Court).isActive ? 'Actif' : 'Maint.'}
                                        </div>
                                    </div>

                                    <div className="mb-8 md:mb-10 relative z-10">
                                        <div className="flex items-center gap-2 mb-1.5 md:mb-2">
                                            <Sparkles size={12} className="text-padel-yellow md:w-[14px] md:h-[14px]" />
                                            <p className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.4em] truncate">{(item as Court).type}</p>
                                        </div>
                                        <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter group-hover:text-padel-blue transition-colors leading-tight truncate">{(item as Court).name}</h3>
                                        {/* Sport badge */}
                                        {(item as Court).sport && (
                                            <div
                                                className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border"
                                                style={{
                                                    color: (item as Court).sport === 'Padel' ? '#1349D3' : (item as Court).sport === 'Pickleball' ? '#FFD21F' : '#ffffff',
                                                    backgroundColor: (item as Court).sport === 'Padel' ? '#1349D315' : (item as Court).sport === 'Pickleball' ? '#FFD21F15' : '#ffffff10',
                                                    borderColor: (item as Court).sport === 'Padel' ? '#1349D330' : (item as Court).sport === 'Pickleball' ? '#FFD21F30' : '#ffffff20',
                                                }}
                                            >
                                                <Zap size={8} /> {(item as Court).sport}
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8 relative z-10 flex-1">
                                        <div className="bg-white/[0.03] border border-white/5 p-4 md:p-6 rounded-xl md:rounded-[1.5rem] group/stat">
                                            <p className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-widest mb-1.5 md:mb-2 group-hover/stat:text-padel-blue transition-colors">Tarif</p>
                                            <p className="text-lg md:text-2xl font-black text-white tracking-tighter">{(item as Court).pricePerHour}€<span className="text-[10px] md:text-xs text-white/30 ml-0.5 md:ml-1">/h</span></p>
                                        </div>
                                        <div className="bg-white/[0.03] border border-white/5 p-4 md:p-6 rounded-xl md:rounded-[1.5rem] group/stat">
                                            <p className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-widest mb-1.5 md:mb-2 group-hover/stat:text-padel-yellow transition-colors">Usage 7j</p>
                                            <p className={cn(
                                                "text-lg md:text-2xl font-black tracking-tighter",
                                                (courtUsage[(item as Court)._id] || 0) >= 70 ? "text-emerald-400" :
                                                    (courtUsage[(item as Court)._id] || 0) >= 40 ? "text-padel-yellow" :
                                                        (courtUsage[(item as Court)._id] || 0) > 0 ? "text-orange-400" : "text-white/40"
                                            )}>
                                                {courtUsage[(item as Court)._id] || 0}%
                                            </p>
                                        </div>
                                    </div>

                                    {/* Audit Information */}
                                    <div className="bg-white/[0.02] border border-white/5 p-3 md:p-4 rounded-xl mb-6 relative z-10">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar size={10} className="text-white/20" />
                                            <p className="text-[7px] md:text-[8px] font-black text-white/20 uppercase tracking-widest">Audit Trail</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-[7px] font-bold text-white/15 uppercase tracking-widest mb-0.5">Créé le</p>
                                                <p className="text-[9px] font-black text-white/40">
                                                    {(item as Court).createdAt
                                                        ? new Date((item as Court).createdAt!).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
                                                        : 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[7px] font-bold text-white/15 uppercase tracking-widest mb-0.5">Modifié le</p>
                                                <p className="text-[9px] font-black text-white/40">
                                                    {(item as Court).updatedAt
                                                        ? new Date((item as Court).updatedAt!).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
                                                        : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 md:gap-4 relative z-10 mt-auto">
                                        <button
                                            onClick={() => handleEditCourt(item as Court)}
                                            className="flex-1 py-4 md:py-5 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/60 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                                        >
                                            <Edit2 size={14} className="group-hover/btn:scale-110 transition-transform md:w-4 md:h-4" /> Config
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCourt((item as Court)._id)}
                                            className="w-12 md:w-14 py-4 md:py-5 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center"
                                        >
                                            <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                                        </button>
                                    </div>
                                </motion.div>
                            )
                        ))}
                    </>
                )}
            </div>

            {/* Pagination Controls */}
            {!loading && (filteredCourts.length + 1) > itemsPerPage && (
                <div className="flex justify-center items-center gap-6 pt-4">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    >
                        Précédent
                    </button>
                    <div className="flex items-center gap-3">
                        {Array.from({ length: Math.ceil((filteredCourts.length + 1) / itemsPerPage) }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={cn(
                                    "w-10 h-10 rounded-lg text-[10px] font-black transition-all border",
                                    currentPage === i + 1 ? "bg-padel-blue border-padel-blue text-white shadow-xl shadow-padel-blue/20" : "bg-white/5 border-white/5 text-white/20 hover:text-white"
                                )}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        disabled={currentPage === Math.ceil((filteredCourts.length + 1) / itemsPerPage)}
                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil((filteredCourts.length + 1) / itemsPerPage), prev + 1))}
                        className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    >
                        Suivant
                    </button>
                </div>
            )}

            {/* Modal de Configuration */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-dark-bg/90 backdrop-blur-2xl"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#1a1a1e] border border-white/10 w-full max-w-2xl rounded-2xl md:rounded-[3rem] p-6 md:p-8 relative z-10 shadow-3xl max-h-[95vh] overflow-y-auto custom-scrollbar"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 md:top-8 right-4 md:right-8 w-10 md:h-10 lg:w-12 lg:h-12 bg-white/5 rounded-full flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <X size={18} className="md:w-5 md:h-5" />
                            </button>

                            <div className="mb-6">
                                <h2 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tighter">
                                    {editingCourt ? 'Modifier' : 'Nouveau'} <span className="text-padel-yellow">Terrain</span>
                                </h2>
                                <p className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-1">Configuration infrastructure Padel Arena</p>
                            </div>

                            <form onSubmit={handleCreateCourt} className="space-y-5">
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Nom du Terrain</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="ex: Vendôme Court Central"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm font-bold focus:outline-none focus:border-padel-blue transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                                                <Target size={12} className="text-padel-blue" /> Type d'infrastructure
                                            </label>
                                            <div className="relative group">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsTypeOpen(!isTypeOpen)}
                                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white text-[10px] font-black transition-all flex items-center justify-between hover:bg-white/[0.06] hover:border-padel-blue"
                                                >
                                                    {formData.type}
                                                    <MoreHorizontal size={14} className={cn("transition-transform duration-500", isTypeOpen ? "rotate-90 text-padel-blue" : "text-white/20")} />
                                                </button>

                                                <AnimatePresence>
                                                    {isTypeOpen && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            className="absolute top-full left-0 w-full mt-2 bg-[#1a1a1e] border border-white/10 rounded-2xl overflow-hidden z-[110] shadow-3xl backdrop-blur-3xl max-h-48 overflow-y-auto custom-scrollbar"
                                                        >
                                                            {(typesBySport[formData.sport] || []).map(t => (
                                                                <button
                                                                    key={t}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setFormData({ ...formData, type: t });
                                                                        setIsTypeOpen(false);
                                                                    }}
                                                                    className={cn(
                                                                        "w-full px-6 py-4 text-left text-[10px] font-black transition-all hover:bg-white/[0.05] flex items-center justify-between uppercase tracking-widest",
                                                                        formData.type === t ? "text-padel-blue bg-padel-blue/5" : "text-white/40"
                                                                    )}
                                                                >
                                                                    {t}
                                                                    {formData.type === t && <CheckCircle2 size={12} className="text-padel-blue" />}
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                                                <Sparkles size={12} className="text-padel-yellow" /> Tarif (€/h)
                                            </label>
                                            <div className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-2xl p-1 h-[54px] group-hover:border-padel-yellow/30 transition-all">
                                                <button type="button" onClick={() => setFormData(p => ({ ...p, pricePerHour: Math.max(0, p.pricePerHour - 5) }))} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all font-black text-lg">-</button>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-padel-yellow font-black text-sm">€</span>
                                                    <input
                                                        type="number" required
                                                        value={formData.pricePerHour}
                                                        onChange={(e) => setFormData(p => ({ ...p, pricePerHour: parseInt(e.target.value) || 0 }))}
                                                        className="w-16 bg-transparent text-center text-lg font-black text-white focus:outline-none appearance-none"
                                                    />
                                                </div>
                                                <button type="button" onClick={() => setFormData(p => ({ ...p, pricePerHour: p.pricePerHour + 5 }))} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all font-black text-lg">+</button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Sport ── */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                                            <Zap size={12} className="text-padel-blue" /> Discipline sportive
                                        </label>
                                        <div className="flex gap-3">
                                            {[
                                                { value: 'Padel', color: '#1349D3' },
                                                { value: 'Pickleball', color: '#FFD21F' },
                                                { value: 'Badminton', color: '#ffffff' },
                                            ].map(s => (
                                                <button
                                                    key={s.value}
                                                    type="button"
                                                    onClick={() => {
                                                        const newSport = s.value as 'Padel' | 'Pickleball' | 'Badminton';
                                                        const defaultType = typesBySport[newSport][0];
                                                        setFormData(p => ({ ...p, sport: newSport, type: defaultType }));
                                                    }}
                                                    className={cn(
                                                        'flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300',
                                                        formData.sport === s.value
                                                            ? ''
                                                            : 'bg-white/5 border-white/10 text-white/30 hover:text-white hover:bg-white/8'
                                                    )}
                                                    style={formData.sport === s.value ? {
                                                        color: s.color,
                                                        backgroundColor: `${s.color}18`,
                                                        borderColor: `${s.color}40`,
                                                        boxShadow: `0 0 20px ${s.color}15`
                                                    } : {}}
                                                >
                                                    {s.value}{formData.sport === s.value ? ' ✓' : ''}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">État de l'infrastructure</label>
                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, isActive: true })}
                                                className={cn(
                                                    "flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                                    formData.isActive ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-white/5 border-white/10 text-white/40"
                                                )}
                                            >
                                                Opérationnel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, isActive: false })}
                                                className={cn(
                                                    "flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                                    !formData.isActive ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-white/5 border-white/10 text-white/40"
                                                )}
                                            >
                                                Maintenance
                                            </button>
                                        </div>
                                    </div>

                                    {/* Sport-Specific Features */}
                                    {sportSpecificFields[formData.sport] && sportSpecificFields[formData.sport].length > 0 && (
                                        <div className="space-y-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                            <div className="flex items-center gap-2">
                                                <Settings size={12} className="text-padel-blue" />
                                                <label className="text-[9px] font-black text-white/30 uppercase tracking-widest">
                                                    Options spécifiques {formData.sport}
                                                </label>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                {sportSpecificFields[formData.sport].map(field => (
                                                    <div key={field.key} className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/5">
                                                        <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">{field.label}</span>
                                                        {field.type === 'boolean' ? (
                                                            <div className="w-8 h-5 rounded-full bg-white/10 relative cursor-pointer hover:bg-white/15 transition-colors">
                                                                <div className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white/30 transition-transform" />
                                                            </div>
                                                        ) : (
                                                            <input
                                                                type="number"
                                                                className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white text-center font-bold focus:outline-none focus:border-padel-blue"
                                                                placeholder="0"
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-[7px] text-white/20 font-bold uppercase tracking-widest text-center mt-2">
                                                Ces options seront sauvegardées avec le terrain
                                            </p>
                                        </div>
                                    )}

                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Description Stratégique</label>
                                        <textarea
                                            rows={2}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Détails techniques, équipements..."
                                            className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-white text-xs font-bold focus:outline-none focus:border-padel-blue transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[9px] font-black uppercase tracking-widest text-center">
                                        {error}
                                    </div>
                                )}

                                <button
                                    disabled={isSubmitting}
                                    className="w-full py-5 bg-padel-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-3xl shadow-padel-blue/20 hover:bg-padel-yellow hover:text-padel-blue transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    {editingCourt ? 'Sauvegarder modifications' : 'Finaliser Déploiement'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={confirmDelete}
                title="Supprimer le Terrain"
                message="Attention : Cette action est irréversible. Toutes les configurations techniques, historiques et réservations futures associées à ce court seront perdues."
                isLoading={isSubmitting}
            />
        </motion.div>
    );
}
