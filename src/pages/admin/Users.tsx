import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Users as UsersIcon,
    Search,
    Filter,
    Mail,
    Phone,
    Calendar,
    ShieldCheck,
    UserX,
    Eye,
    ArrowUpDown,
    Loader2,
    Trash2,
    AlertCircle,
    Edit2,
    X,
    Save,
    Download,
    ChevronDown,
    MoreHorizontal,
    CheckCircle2,
    User,
    MapPin,
    Plus,
    Lock,
    Target,
    Zap
} from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'PLAYER' | 'ADMIN';
    phone?: string;
    address?: string;
    createdAt: string;
}

export function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'ALL' | 'PLAYER' | 'ADMIN'>('ALL');
    const [error, setError] = useState<string | null>(null);

    // Edit Modal State
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, id: string, name: string }>({
        isOpen: false,
        id: '',
        name: ''
    });
    const [isRoleOpen, setIsRoleOpen] = useState(false);

    // History Modal State
    const [historyModal, setHistoryModal] = useState<{
        isOpen: boolean;
        user: User | null;
        data: any;
        loading: boolean;
    }>({
        isOpen: false,
        user: null,
        data: null,
        loading: false
    });

    const openHistory = async (user: User) => {
        setHistoryModal({ isOpen: true, user, data: null, loading: true });
        try {
            const res = await api.get(`/admin/users/${user._id}/history`);
            setHistoryModal(prev => ({ ...prev, data: res.data.data, loading: false }));
        } catch (err) {
            console.error(err);
            setHistoryModal(prev => ({ ...prev, loading: false }));
        }
    };

    // Create Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'PLAYER' as 'PLAYER' | 'ADMIN',
        phone: '',
        address: ''
    });
    const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Impossible de charger les utilisateurs.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            const res = await api.post('/admin/users', newUser);
            setUsers([res.data.data, ...users]);
            setIsCreateModalOpen(false);
            setNewUser({
                name: '',
                email: '',
                password: '',
                role: 'PLAYER',
                phone: '',
                address: ''
            });
        } catch (err: any) {
            alert(err.response?.data?.message || 'Erreur lors de la création.');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleDeleteUser = (id: string, name: string) => {
        setDeleteModal({ isOpen: true, id, name });
    };

    const confirmDelete = async () => {
        setUpdateLoading(true);
        try {
            await api.delete(`/admin/users/${deleteModal.id}`);
            setUsers(users.filter(u => u._id !== deleteModal.id));
            setDeleteModal({ ...deleteModal, isOpen: false });
        } catch (err: any) {
            alert(err.response?.data?.message || 'Erreur lors de la suppression.');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        setUpdateLoading(true);
        try {
            const res = await api.put(`/admin/users/${editingUser._id}`, editingUser);
            setUsers(users.map(u => u._id === editingUser._id ? res.data.data : u));
            setIsEditModalOpen(false);
            setEditingUser(null);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Erreur lors de la mise à jour.');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleExportCSV = () => {
        const headers = ['Nom', 'Email', 'Role', 'Telephone', 'Adresse', 'Date Inscription'];

        // Only export PLAYERS as requested
        const playersToExport = filteredUsers.filter(u => u.role === 'PLAYER');

        const csvRows = playersToExport.map(u => {
            const dateObj = u.createdAt ? new Date(u.createdAt) : null;
            const formattedDate = dateObj && !isNaN(dateObj.getTime())
                ? dateObj.toLocaleDateString('fr-FR')
                : 'Non renseignée';

            return [
                `"${u.name}"`,
                `"${u.email}"`,
                `"${u.role}"`,
                `"\t${u.phone || ''}"`, // Force text
                `"${(u.address || '').replace(/"/g, '""')}"`,
                `"\t${formattedDate}"` // Force text for Date to prevent #######
            ].join(',');
        });

        // Add UTF-8 BOM for Excel to recognize special characters and formatting
        const csvContent = '\uFEFF' + [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `padel_arena_athletes_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-12 pb-10"
        >
            {/* Elite Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10 pt-4 md:pt-0">
                <div className="space-y-4">

                    <div>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-white uppercase tracking-tighter leading-[0.85]">
                            Contrôle <br /> <span className="text-padel-yellow drop-shadow-[0_0_30px_rgba(255,210,31,0.3)] text-3xl sm:text-5xl md:text-7xl">Athlètes</span>
                        </h1>
                        <p className="text-[10px] md:text-xs font-bold text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em] mt-4">Gestion centralisée • Performance • Sécurité</p>
                    </div>
                </div>

                <div className="flex bg-white/5 backdrop-blur-md p-1.5 md:p-2 rounded-2xl border border-white/10 w-fit">
                    <div className="px-4 md:px-6 py-2 md:py-3 border-r border-white/5">
                        <p className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Total</p>
                        <p className="text-xl md:text-2xl font-black text-white tracking-tighter">{users.length}</p>
                    </div>
                    <div className="px-4 md:px-6 py-2 md:py-3">
                        <p className="text-[8px] md:text-[9px] font-black text-padel-yellow/50 uppercase tracking-widest mb-1">Filtrés</p>
                        <p className="text-xl md:text-2xl font-black text-white tracking-tighter">{filteredUsers.length}</p>
                    </div>
                </div>
            </div>

            {/* Tactical Control Bar */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="relative w-full md:max-w-xl group order-1 md:order-none">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-padel-blue transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou email..."
                        className="w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-[1.5rem] py-4 md:py-5 pl-14 md:pl-16 pr-8 text-xs md:text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-padel-blue/40 focus:bg-white/[0.05] transition-all font-bold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-4 w-full md:w-auto relative">
                    {/* <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            "flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-5 rounded-[1.5rem] bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all group",
                            showFilters && "border-padel-blue/40 bg-white/10"
                        )}
                    >
                        <Filter size={16} className={cn("text-white/40 group-hover:text-padel-blue transition-colors", showFilters && "text-padel-blue")} /> Filtres Avancés
                    </button>

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-[110%] left-0 w-full md:w-64 bg-[#1A1A1E] border border-white/10 rounded-2xl p-4 z-50 shadow-3xl backdrop-blur-xl"
                            >
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-2">Filtrer par rôle</p>
                                        <div className="flex flex-col gap-1">
                                            {(['ALL', 'PLAYER', 'ADMIN'] as const).map(role => (
                                                <button
                                                    key={role}
                                                    onClick={() => setRoleFilter(role)}
                                                    className={cn(
                                                        "text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                        roleFilter === role ? "bg-padel-blue text-white" : "text-white/40 hover:bg-white/5"
                                                    )}
                                                >
                                                    {role === 'ALL' ? 'Tous les rôles' : role}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence> */}

                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-[1.5rem] bg-padel-blue text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-padel-blue/30 hover:bg-padel-yellow hover:text-padel-blue transition-all duration-500"
                    >
                        <Plus size={14} className="md:w-4 md:h-4" /> Nouveau Membre
                    </button>

                    <button
                        onClick={handleExportCSV}
                        className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-[1.5rem] bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white transition-all duration-500"
                    >
                        <Download size={14} className="md:w-4 md:h-4" /> Export Flux
                    </button>
                </div>
            </div>

            {/* Results Grid - Card View */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {loading ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 size={48} className="text-padel-blue animate-spin" />
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Chargement des données satellites...</p>
                    </div>
                ) : error ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4 text-red-500/50">
                        <AlertCircle size={48} />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em]">{error}</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4 text-white/20">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em]">Aucun utilisateur trouvé</p>
                    </div>
                ) : (
                    filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((user, idx) => (
                        <motion.div
                            key={user._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.05 * idx }}
                            whileHover={{ y: -10 }}
                            className="bg-[#151518]/60 backdrop-blur-2xl border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 group hover:border-padel-blue/20 transition-all shadow-3xl flex flex-col relative overflow-hidden h-full"
                        >
                            {/* Role Badge Floating */}
                            <div className="absolute top-4 md:top-6 right-4 md:right-6">
                                <div className={cn(
                                    "px-2 md:px-3 py-1 rounded-lg border text-[7px] md:text-[8px] font-black uppercase tracking-widest backdrop-blur-md",
                                    user.role === 'ADMIN' ? "bg-padel-yellow/10 border-padel-yellow/20 text-padel-yellow" : "bg-padel-blue/10 border-padel-blue/20 text-padel-blue"
                                )}>
                                    {user.role}
                                </div>
                            </div>

                            {/* User Profile Header */}
                            <div className="flex items-center gap-4 md:gap-5 mb-6 md:mb-8">
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-padel-blue/20 to-padel-blue/5 border border-padel-blue/20 flex items-center justify-center text-padel-blue font-black text-base md:text-lg group-hover:scale-110 transition-transform duration-500">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg md:text-xl font-black text-white truncate pr-16 group-hover:text-padel-blue transition-colors leading-tight uppercase tracking-tighter">{user.name}</h3>
                                    <p className="text-[9px] md:text-[10px] text-white/30 font-bold uppercase tracking-widest truncate">{user.email}</p>
                                </div>
                            </div>

                            {/* User Intel Info */}
                            <div className="grid grid-cols-1 gap-3 md:gap-4 mb-6 md:mb-8">
                                <div className="bg-white/[0.02] border border-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl space-y-1">
                                    <p className="text-[7px] md:text-[8px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2">
                                        <Phone size={10} className="text-padel-blue" /> Contact Direct
                                    </p>
                                    <p className="text-xs md:text-sm font-black text-white tracking-tighter">{user.phone || 'Non renseigné'}</p>
                                </div>
                                <div className="bg-white/[0.02] border border-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl space-y-1">
                                    <p className="text-[7px] md:text-[8px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2">
                                        <Calendar size={10} className="text-padel-yellow" /> Déploiement Profil
                                    </p>
                                    <p className="text-xs md:text-sm font-black text-white tracking-tighter">
                                        {new Date(user.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            {/* Quick Action Matrix */}
                            <div className="flex gap-3 md:gap-4 mt-auto">
                                <button
                                    onClick={() => openHistory(user)}
                                    className="flex-1 py-3 md:py-4 rounded-xl bg-white/10 border border-white/10 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-padel-blue hover:bg-padel-blue hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    <Eye size={12} className="md:w-3.5 md:h-3.5" /> Détails
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingUser(user);
                                        setIsEditModalOpen(true);
                                    }}
                                    className="flex-1 py-3 md:py-4 rounded-xl bg-white/5 border border-white/10 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white/40 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <Edit2 size={12} className="md:w-3.5 md:h-3.5" />
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(user._id, user.name)}
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 border border-white/10 text-red-500/30 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500 transition-all flex items-center justify-center shrink-0"
                                >
                                    <Trash2 size={14} className="md:w-4 md:h-4" />
                                </button>
                            </div>

                            {/* Subtle Aura */}
                            <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-padel-blue/5 blur-3xl rounded-full" />
                        </motion.div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {!loading && filteredUsers.length > itemsPerPage && (
                <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 pt-4">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className="px-6 md:px-8 py-3 md:py-4 rounded-xl bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    >
                        Précédent
                    </button>
                    <div className="flex items-center gap-2 md:gap-3">
                        {Array.from({ length: Math.ceil(filteredUsers.length / itemsPerPage) }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={cn(
                                    "w-8 h-8 md:w-10 md:h-10 rounded-lg text-[9px] md:text-[10px] font-black transition-all border",
                                    currentPage === i + 1 ? "bg-padel-blue border-padel-blue text-white shadow-xl shadow-padel-blue/20" : "bg-white/5 border-white/5 text-white/20 hover:text-white"
                                )}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        disabled={currentPage === Math.ceil(filteredUsers.length / itemsPerPage)}
                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredUsers.length / itemsPerPage), prev + 1))}
                        className="px-6 md:px-8 py-3 md:py-4 rounded-xl bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    >
                        Suivant
                    </button>
                </div>
            )}

            {/* Insight Footer Removed (Redundant with Pagination) */}

            {/* Edit User Modal */}
            <AnimatePresence>
                {isEditModalOpen && editingUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-xl bg-[#1A1A1E] border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-3xl max-h-[90vh] overflow-y-auto custom-scrollbar"
                        >
                            <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#1A1A1E]/80 backdrop-blur-xl z-20">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter leading-none">Modifier <span className="text-padel-blue">Profil</span></h3>
                                    <p className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-widest mt-1.5 truncate max-w-[200px] md:max-w-none">ID: {editingUser._id}</p>
                                </div>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="p-2.5 md:p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
                                >
                                    <X size={18} className="md:w-5 md:h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateUser} className="p-6 md:p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em] ml-1 flex items-center gap-2">
                                            <User size={12} className="text-padel-blue" /> Nom complet
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                required
                                                value={editingUser.name}
                                                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 px-4 md:px-6 text-xs md:text-sm text-white focus:outline-none focus:border-padel-blue/40 transition-all font-black group-hover:bg-white/[0.06]"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em] ml-1 flex items-center gap-2">
                                            <Mail size={12} className="text-padel-blue" /> Email
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="email"
                                                required
                                                value={editingUser.email}
                                                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 px-4 md:px-6 text-xs md:text-sm text-white focus:outline-none focus:border-padel-blue/40 transition-all font-black group-hover:bg-white/[0.06]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em] ml-1 flex items-center gap-2">
                                            <Phone size={12} className="text-padel-blue" /> Téléphone
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                value={editingUser.phone || ''}
                                                onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                                                placeholder="+33 6 00 00 00 00"
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 px-4 md:px-6 text-xs md:text-sm text-white focus:outline-none focus:border-padel-blue/40 transition-all font-black group-hover:bg-white/[0.06]"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em] ml-1 flex items-center gap-2">
                                            <ShieldCheck size={12} className="text-padel-yellow" /> Rôle compte
                                        </label>
                                        <div className="relative group">
                                            <button
                                                type="button"
                                                onClick={() => setIsRoleOpen(!isRoleOpen)}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-white text-[9px] md:text-[10px] font-black transition-all flex items-center justify-between hover:bg-white/[0.06] hover:border-padel-yellow"
                                            >
                                                {editingUser.role === 'PLAYER' ? 'JOUEUR (ATHLÈTE)' : 'ADMINISTRATEUR'}
                                                <MoreHorizontal size={14} className={cn("transition-transform duration-500", isRoleOpen ? "rotate-90 text-padel-yellow" : "text-white/20")} />
                                            </button>

                                            <AnimatePresence>
                                                {isRoleOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        className="absolute top-full left-0 w-full mt-2 bg-[#1a1a1e] border border-white/10 rounded-xl md:rounded-2xl overflow-hidden z-[110] shadow-3xl backdrop-blur-3xl"
                                                    >
                                                        {[
                                                            { id: 'PLAYER', label: 'JOUEUR (ATHLÈTE)' },
                                                            { id: 'ADMIN', label: 'ADMINISTRATEUR' }
                                                        ].map(r => (
                                                            <button
                                                                key={r.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setEditingUser({ ...editingUser, role: r.id as 'PLAYER' | 'ADMIN' });
                                                                    setIsRoleOpen(false);
                                                                }}
                                                                className={cn(
                                                                    "w-full px-4 md:px-6 py-3 md:py-4 text-left text-[9px] md:text-[10px] font-black transition-all hover:bg-white/[0.05] flex items-center justify-between uppercase tracking-widest",
                                                                    editingUser.role === r.id ? "text-padel-yellow bg-padel-yellow/5" : "text-white/40"
                                                                )}
                                                            >
                                                                {r.label}
                                                                {editingUser.role === r.id && <CheckCircle2 size={12} className="text-padel-yellow" />}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em] ml-1 flex items-center gap-2">
                                        <MapPin size={12} className="text-padel-blue" /> Résidence
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            value={editingUser.address || ''}
                                            onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
                                            placeholder="123 Avenue des Champs, 75000 Paris"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 px-4 md:px-6 text-xs md:text-sm text-white focus:outline-none focus:border-padel-blue/40 transition-all font-black group-hover:bg-white/[0.06]"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 flex flex-col md:flex-row gap-3 md:gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="flex-1 py-4 md:py-5 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:bg-white/10 hover:text-white transition-all order-2 md:order-none"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updateLoading}
                                        className="flex-[2] py-4 md:py-5 rounded-xl md:rounded-2xl bg-padel-blue text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-padel-blue/30 hover:bg-padel-yellow hover:text-padel-blue transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {updateLoading ? (
                                            <Loader2 size={16} className="animate-spin text-white" />
                                        ) : (
                                            <Save size={16} />
                                        )}
                                        Sauvegarder
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Create User Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-xl bg-[#1A1A1E] border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-3xl max-h-[90vh] overflow-y-auto custom-scrollbar"
                        >
                            <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#1A1A1E]/80 backdrop-blur-xl z-20">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter leading-none">Nouveau <span className="text-padel-blue">Membre</span></h3>
                                    <p className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-widest mt-1.5">Création manuelle d'une fiche membre</p>
                                </div>
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="p-2.5 md:p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
                                >
                                    <X size={18} className="md:w-5 md:h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateUser} className="p-6 md:p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em] ml-1 flex items-center gap-2">
                                            <User size={12} className="text-padel-blue" /> Nom complet
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                required
                                                value={newUser.name}
                                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 px-4 md:px-6 text-xs md:text-sm text-white focus:outline-none focus:border-padel-blue/40 transition-all font-black group-hover:bg-white/[0.06]"
                                                placeholder="Jean Dupont"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em] ml-1 flex items-center gap-2">
                                            <Mail size={12} className="text-padel-blue" /> Email
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="email"
                                                required
                                                value={newUser.email}
                                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 px-4 md:px-6 text-xs md:text-sm text-white focus:outline-none focus:border-padel-blue/40 transition-all font-black group-hover:bg-white/[0.06]"
                                                placeholder="jean@exemple.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em] ml-1 flex items-center gap-2">
                                            <Lock size={12} className="text-padel-blue" /> Mot de passe
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="password"
                                                value={newUser.password}
                                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                                placeholder="Laisser vide pour 'padel123'"
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 px-4 md:px-6 text-xs md:text-sm text-white focus:outline-none focus:border-padel-blue/40 transition-all font-black group-hover:bg-white/[0.06]"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em] ml-1 flex items-center gap-2">
                                            <Phone size={12} className="text-padel-blue" /> Téléphone
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                value={newUser.phone}
                                                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                                                placeholder="+33 6 00 00 00 00"
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 px-4 md:px-6 text-xs md:text-sm text-white focus:outline-none focus:border-padel-blue/40 transition-all font-black group-hover:bg-white/[0.06]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em] ml-1 flex items-center gap-2">
                                            <ShieldCheck size={12} className="text-padel-yellow" /> Rôle
                                        </label>
                                        <div className="relative group">
                                            <button
                                                type="button"
                                                onClick={() => setIsCreateRoleOpen(!isCreateRoleOpen)}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-white text-[9px] md:text-[10px] font-black transition-all flex items-center justify-between hover:bg-white/[0.06] hover:border-padel-yellow"
                                            >
                                                {newUser.role === 'PLAYER' ? 'JOUEUR (ATHLÈTE)' : 'ADMINISTRATEUR'}
                                                <MoreHorizontal size={14} className={cn("transition-transform duration-500", isCreateRoleOpen ? "rotate-90 text-padel-yellow" : "text-white/20")} />
                                            </button>

                                            <AnimatePresence>
                                                {isCreateRoleOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        className="absolute top-full left-0 w-full mt-2 bg-[#1a1a1e] border border-white/10 rounded-xl md:rounded-2xl overflow-hidden z-[110] shadow-3xl backdrop-blur-3xl"
                                                    >
                                                        {[
                                                            { id: 'PLAYER', label: 'JOUEUR (ATHLÈTE)' },
                                                            { id: 'ADMIN', label: 'ADMINISTRATEUR' }
                                                        ].map(r => (
                                                            <button
                                                                key={r.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setNewUser({ ...newUser, role: r.id as 'PLAYER' | 'ADMIN' });
                                                                    setIsCreateRoleOpen(false);
                                                                }}
                                                                className={cn(
                                                                    "w-full px-4 md:px-6 py-3 md:py-4 text-left text-[9px] md:text-[10px] font-black transition-all hover:bg-white/[0.05] flex items-center justify-between uppercase tracking-widest",
                                                                    newUser.role === r.id ? "text-padel-yellow bg-padel-yellow/5" : "text-white/40"
                                                                )}
                                                            >
                                                                {r.label}
                                                                {newUser.role === r.id && <CheckCircle2 size={12} className="text-padel-yellow" />}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em] ml-1 flex items-center gap-2">
                                            <MapPin size={12} className="text-padel-blue" /> Résidence
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                value={newUser.address}
                                                onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                                                placeholder="123 Avenue des Champs, 75000 Paris"
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 px-4 md:px-6 text-xs md:text-sm text-white focus:outline-none focus:border-padel-blue/40 transition-all font-black group-hover:bg-white/[0.06]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 flex flex-col md:flex-row gap-3 md:gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="flex-1 py-4 md:py-5 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:bg-white/10 hover:text-white transition-all order-2 md:order-none"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updateLoading}
                                        className="flex-[2] py-4 md:py-5 rounded-xl md:rounded-2xl bg-padel-blue text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-padel-blue/30 hover:bg-padel-yellow hover:text-padel-blue transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {updateLoading ? (
                                            <Loader2 size={16} className="animate-spin text-white" />
                                        ) : (
                                            <Plus size={16} />
                                        )}
                                        Créer le Compte
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>


            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={confirmDelete}
                title="Supprimer le Compte"
                message={`Attention : Vous êtes sur le point de supprimer définitivement le compte de ${deleteModal.name}. Cette opération effacera tout son historique de réservations et ses accès au réseau.`}
                isLoading={updateLoading}
            />

            {/* History Modal (Fiche Client) */}
            <AnimatePresence>
                {historyModal.isOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setHistoryModal({ ...historyModal, isOpen: false })}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            className="relative w-full max-w-3xl bg-[#1A1A1E] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-3xl flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-padel-blue/10 border border-padel-blue/20 flex items-center justify-center text-padel-blue font-black text-xl">
                                        {historyModal.user?.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                                            Fiche <span className="text-padel-blue">Athlète</span>
                                        </h3>
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-1">{historyModal.user?.name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setHistoryModal({ ...historyModal, isOpen: false })}
                                    className="p-3 bg-white/5 rounded-xl text-white/20 hover:text-white transition-all border border-white/10"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-10">
                                {historyModal.loading ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                                        <Loader2 size={32} className="text-padel-blue animate-spin" />
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Calcul des archives...</p>
                                    </div>
                                ) : !historyModal.data ? (
                                    <div className="text-center py-20 text-white/20">
                                        <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">Erreur de chargement des données</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="p-5 bg-white/[0.03] border border-white/5 rounded-[2rem] space-y-1">
                                                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Réservations</p>
                                                <p className="text-3xl font-black text-white">{historyModal.data.bookings.length}</p>
                                            </div>
                                            <div className="p-5 bg-white/[0.03] border border-white/5 rounded-[2rem] space-y-1">
                                                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Tournois</p>
                                                <p className="text-3xl font-black text-white">{historyModal.data.tournaments.length}</p>
                                            </div>
                                            <div className="p-5 bg-white/[0.03] border border-white/5 rounded-[2rem] space-y-1">
                                                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Cours</p>
                                                <p className="text-3xl font-black text-white">{historyModal.data.courses.length}</p>
                                            </div>
                                        </div>

                                        {/* Main History Feed */}
                                        <div className="space-y-6">
                                            {/* Bookings Section */}
                                            <div className="space-y-4">
                                                <h4 className="flex items-center gap-3 text-[10px] font-black text-padel-blue uppercase tracking-[0.3em]">
                                                    <Calendar size={14} /> Historique des Courts
                                                </h4>
                                                {historyModal.data.bookings.length === 0 ? (
                                                    <p className="text-[10px] text-white/10 uppercase font-black italic ml-6">Aucune réservation enregistrée</p>
                                                ) : (
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {historyModal.data.bookings.map((b: any) => (
                                                            <div key={b._id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/[0.04] transition-all">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 rounded-xl bg-padel-blue/10 flex items-center justify-center text-padel-blue">
                                                                        <MapPin size={16} />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-black text-white uppercase tracking-tight">{b.court?.name || 'Court Inconnu'}</p>
                                                                        <p className="text-[9px] font-bold text-white/20">{new Date(b.startTime).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-[10px] font-black text-white uppercase">{new Date(b.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                                                                    <p className="text-[8px] font-black text-padel-yellow uppercase tracking-widest mt-0.5">{b.totalPrice}€ • {b.paymentStatus}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Tournaments Section */}
                                            <div className="space-y-4">
                                                <h4 className="flex items-center gap-3 text-[10px] font-black text-padel-yellow uppercase tracking-[0.3em]">
                                                    <ShieldCheck size={14} /> Engagements Compétitifs
                                                </h4>
                                                {historyModal.data.tournaments.length === 0 ? (
                                                    <p className="text-[10px] text-white/10 uppercase font-black italic ml-6">Aucun tournoi disputé</p>
                                                ) : (
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {historyModal.data.tournaments.map((t: any) => (
                                                            <div key={t._id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/[0.04] transition-all">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 rounded-xl bg-padel-yellow/10 flex items-center justify-center text-padel-yellow">
                                                                        <Target size={16} />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-black text-white uppercase tracking-tight">{t.name}</p>
                                                                        <p className="text-[9px] font-bold text-white/20">{t.level}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-[10px] font-black text-white uppercase">{new Date(t.startDate).toLocaleDateString('fr-FR')}</p>
                                                                    <div className="flex items-center justify-end gap-2 mt-0.5">
                                                                       <div className="w-1.5 h-1.5 rounded-full bg-padel-yellow animate-pulse" />
                                                                       <p className="text-[8px] font-black text-padel-yellow uppercase tracking-widest">{t.status}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Courses Section */}
                                            <div className="space-y-4">
                                                <h4 className="flex items-center gap-3 text-[10px] font-black text-padel-blue uppercase tracking-[0.3em]">
                                                    <Zap size={14} className="text-padel-blue" /> Académie & Entraînement
                                                </h4>
                                                {historyModal.data.courses.length === 0 ? (
                                                    <p className="text-[10px] text-white/10 uppercase font-black italic ml-6">Aucun programme suivi</p>
                                                ) : (
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {historyModal.data.courses.map((c: any) => (
                                                            <div key={c._id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/[0.04] transition-all">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 rounded-xl bg-padel-blue/10 flex items-center justify-center text-padel-blue">
                                                                        <Zap size={16} />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-black text-white uppercase tracking-tight">{c.title}</p>
                                                                        <p className="text-[9px] font-bold text-white/20">{c.level} • {c.duration}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-[10px] font-black text-white uppercase">{new Date(c.date).toLocaleDateString('fr-FR')}</p>
                                                                    <p className="text-[8px] font-black text-padel-blue uppercase tracking-widest mt-0.5">{c.price}€ • PAYÉ</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
                                <div className="flex items-center gap-4 text-white/20">
                                    <div className="flex flex-col">
                                        <p className="text-[7px] font-black uppercase tracking-widest">ID Système</p>
                                        <p className="text-[9px] font-bold tracking-tighter">{historyModal.user?._id}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {/* Export logic */}}
                                        className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all flex items-center gap-2"
                                    >
                                        <Download size={14} /> Rapport .PDF
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
