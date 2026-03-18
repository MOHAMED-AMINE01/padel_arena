import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
    Trophy,
    Users,
    Calendar,
    Plus,
    Target,
    ArrowRight,
    Sparkles,
    Star,
    TrendingUp,
    Zap,
    MapPin,
    Crown,
    X,
    Loader2,
    Trash2,
    Edit2,
    Save,
    Image as ImageIcon,
    Clock,
    CheckCircle2,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    ArrowRight as ArrowRightIcon,
    GraduationCap,
    Dumbbell,
    Upload,
    ExternalLink
} from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';

interface Tournament {
    _id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    registrationDeadline: string;
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
    maxTeams: number;
    currentTeams: number;
    entryFee: number;
    prize: string;
    level: string;
    image: string;
}

interface Course {
    _id: string;
    title: string;
    description: string;
    coach: string;
    level: 'DEBUTANT' | 'INTERMEDIAIRE' | 'AVANCE' | 'EXPERT';
    date: string;
    duration: number;
    maxParticipants: number;
    currentParticipants: number;
    price: number;
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
    sport: 'PADEL' | 'PICKLEBALL' | 'BADMINTON';
}

// Custom Tactical Date Time Picker
const TacticalDateTimePicker = ({ value, onChange, label, icon: Icon, color = 'blue' }: {
    value: string,
    onChange: (val: string) => void,
    label: string,
    icon: any,
    color?: 'blue' | 'yellow' | 'red'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
    const selectedDate = value ? new Date(value) : null;

    const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
    const firstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    const handleDateSelect = (day: number) => {
        const newDate = new Date(viewDate);
        newDate.setDate(day);
        if (selectedDate) {
            newDate.setHours(selectedDate.getHours());
            newDate.setMinutes(selectedDate.getMinutes());
        }
        onChange(newDate.toISOString().slice(0, 16));
    };

    const handleTimeChange = (type: 'hours' | 'minutes', val: number) => {
        const newDate = selectedDate ? new Date(selectedDate) : new Date(viewDate);
        if (type === 'hours') newDate.setHours(val);
        else newDate.setMinutes(val);
        onChange(newDate.toISOString().slice(0, 16));
    };

    const accentColor = color === 'blue' ? 'text-padel-blue' : color === 'yellow' ? 'text-padel-yellow' : 'text-red-500';
    const borderColor = color === 'blue' ? 'focus-within:border-padel-blue' : color === 'yellow' ? 'focus-within:border-padel-yellow' : 'focus-within:border-red-500';
    const bgColor = color === 'blue' ? 'bg-padel-blue' : color === 'yellow' ? 'bg-padel-yellow' : 'bg-red-500';
    const glowColor = color === 'blue' ? 'shadow-[0_0_20px_rgba(0,149,255,0.2)]' : color === 'yellow' ? 'shadow-[0_0_20px_rgba(255,210,31,0.2)]' : 'shadow-[0_0_20px_rgba(239,68,68,0.2)]';

    return (
        <div className="space-y-3 relative">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                <Icon size={12} className={accentColor} /> {label}
            </label>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white text-[10px] font-black cursor-pointer transition-all flex items-center justify-between hover:bg-white/[0.06] hover:border-white/20 group",
                    isOpen && "border-white/20 bg-white/[0.06]"
                )}
            >
                <div className="flex items-center gap-3">
                    <span className={cn("transition-colors", value ? "text-white" : "text-white/20")}>
                        {value ? new Date(value).toLocaleString('fr-FR', {
                            day: '2-digit', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                        }) : 'DÉFINIR DATE & HEURE'}
                    </span>
                </div>
                <Calendar size={14} className={cn("transition-colors", isOpen ? accentColor : "text-white/20")} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-[120]" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 15, scale: 0.95 }}
                            className={cn(
                                "absolute top-full left-0 mt-2 bg-[#1a1a1e] border border-white/10 rounded-[2.5rem] p-6 z-[130] backdrop-blur-3xl w-[320px] origin-top-left",
                                glowColor
                            )}
                        >
                            {/* Calendar Header */}
                            <div className="flex items-center justify-between mb-6 px-2">
                                <button type="button" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all"><ChevronLeft size={16} /></button>
                                <p className="text-[10px] font-black text-white uppercase tracking-[0.3em]">{monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}</p>
                                <button type="button" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))} className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all"><ChevronRight size={16} /></button>
                            </div>

                            {/* Weekdays */}
                            <div className="grid grid-cols-7 gap-1 mb-4">
                                {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => (
                                    <div key={d} className="text-[9px] font-black text-white/20 text-center uppercase">{d}</div>
                                ))}
                            </div>

                            {/* Days Grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth()) }).map((_, i) => (
                                    <div key={`empty-${i}`} />
                                ))}
                                {Array.from({ length: daysInMonth(viewDate.getFullYear(), viewDate.getMonth()) }).map((_, i) => {
                                    const d = i + 1;
                                    const isSelected = selectedDate?.getDate() === d &&
                                        selectedDate?.getMonth() === viewDate.getMonth() &&
                                        selectedDate?.getFullYear() === viewDate.getFullYear();
                                    const isToday = new Date().getDate() === d &&
                                        new Date().getMonth() === viewDate.getMonth() &&
                                        new Date().getFullYear() === viewDate.getFullYear();

                                    return (
                                        <button
                                            key={d}
                                            type="button"
                                            onClick={() => handleDateSelect(d)}
                                            className={cn(
                                                "aspect-square rounded-xl text-[10px] font-black transition-all flex items-center justify-center relative group/day",
                                                isSelected ? bgColor + " text-white " + glowColor :
                                                    isToday ? "bg-white/5 border border-white/10 text-white" : "text-white/40 hover:bg-white/[0.03] hover:text-white"
                                            )}
                                        >
                                            {d}
                                            {isToday && !isSelected && <div className={cn("absolute bottom-1.5 w-1 h-1 rounded-full", bgColor)} />}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Time Picker */}
                            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20">
                                        <Clock size={14} />
                                    </div>
                                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Temporalité</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2 gap-2 group/time">
                                        <select
                                            value={selectedDate?.getHours() || 0}
                                            onChange={(e) => handleTimeChange('hours', parseInt(e.target.value))}
                                            className="bg-transparent text-[11px] font-black text-white focus:outline-none appearance-none cursor-pointer text-center w-6"
                                        >
                                            {Array.from({ length: 24 }).map((_, i) => <option key={i} value={i} className="bg-[#1a1a1e]">{i.toString().padStart(2, '0')}</option>)}
                                        </select>
                                        <span className="text-white/20 font-black text-[11px]">:</span>
                                        <select
                                            value={selectedDate?.getMinutes() || 0}
                                            onChange={(e) => handleTimeChange('minutes', parseInt(e.target.value))}
                                            className="bg-transparent text-[11px] font-black text-white focus:outline-none appearance-none cursor-pointer text-center w-6"
                                        >
                                            {Array.from({ length: 60 }).map((_, i) => <option key={i} value={i} className="bg-[#1a1a1e]">{i.toString().padStart(2, '0')}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export function AdminEvents({ defaultTab = 'TOURNOIS' }: { defaultTab?: 'TOURNOIS' | 'COURS' }) {
    const navigate = useNavigate();
    // Tab state
    const [activeTab, setActiveTab] = useState<'TOURNOIS' | 'COURS'>(defaultTab);

    useEffect(() => {
        setActiveTab(defaultTab);
    }, [defaultTab]);

    const handleTabChange = (tab: 'TOURNOIS' | 'COURS') => {
        setActiveTab(tab);
        navigate(tab === 'TOURNOIS' ? '/admin/tournaments' : '/admin/courses');
    };

    // Tournament states
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, id: string }>({
        isOpen: false,
        id: ''
    });
    const [isLevelOpen, setIsLevelOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);

    // Course states
    const [courses, setCourses] = useState<Course[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [courseError, setCourseError] = useState<string | null>(null);
    const [courseDeleteModal, setCourseDeleteModal] = useState<{ isOpen: boolean, id: string }>({ isOpen: false, id: '' });
    const [coursePage, setCoursePage] = useState(1);
    const [isCourseLevel, setIsCourseLevel] = useState(false);
    const [isCourseSport, setIsCourseSport] = useState(false);
    const [isCourseStatus, setIsCourseStatus] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        registrationDeadline: '',
        maxTeams: 16,
        entryFee: 25,
        prize: '',
        level: 'P250',
        image: '',
        status: 'UPCOMING'
    });

    const [participantsModal, setParticipantsModal] = useState<{
        isOpen: boolean;
        title: string;
        participants: any[];
        loading: boolean;
        type: 'TOURNOI' | 'COURS';
    }>({
        isOpen: false,
        title: '',
        participants: [],
        loading: false,
        type: 'TOURNOI'
    });

    const openParticipants = async (id: string, name: string, type: 'TOURNOI' | 'COURS') => {
        setParticipantsModal({ ...participantsModal, isOpen: true, title: name, loading: true, type });
        try {
            const endpoint = type === 'TOURNOI'
                ? `/admin/tournaments/${id}/participants`
                : `/admin/courses/${id}/participants`;
            const res = await api.get(endpoint);
            setParticipantsModal(prev => ({ ...prev, participants: res.data.data, loading: false }));
        } catch (err) {
            console.error(err);
            setParticipantsModal(prev => ({ ...prev, loading: false }));
        }
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const [courseFormData, setCourseFormData] = useState({
        title: '',
        description: '',
        coach: '',
        level: 'INTERMEDIAIRE' as const,
        date: '',
        duration: 60,
        maxParticipants: 8,
        price: 25,
        status: 'UPCOMING' as const,
        sport: 'PADEL' as const
    });

    const fetchTournaments = async () => {
        try {
            const res = await api.get('/tournaments');
            setTournaments(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching tournaments:', err);
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const res = await api.get('/courses');
            setCourses(res.data.data);
            setLoadingCourses(false);
        } catch (err) {
            console.error('Error fetching courses:', err);
            setLoadingCourses(false);
        }
    };

    useEffect(() => {
        fetchTournaments();
        fetchCourses();
    }, []);

    // ─── Course CRUD handlers ───
    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setCourseError(null);

        const now = new Date();
        const courseDate = new Date(courseFormData.date);

        if (!editingCourse && courseDate < now) {
            setCourseError("La date du cours ne peut pas être dans le passé.");
            setIsSubmitting(false);
            return;
        }

        try {
            if (editingCourse) {
                await api.put(`/courses/${editingCourse._id}`, courseFormData);
            } else {
                await api.post('/courses', courseFormData);
            }
            setShowCourseModal(false);
            setEditingCourse(null);
            resetCourseForm();
            fetchCourses();
        } catch (err: any) {
            setCourseError(err.response?.data?.message || 'Une erreur est survenue.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditCourse = (course: Course) => {
        setEditingCourse(course);
        setCourseFormData({
            title: course.title,
            description: course.description || '',
            coach: course.coach,
            level: course.level,
            date: new Date(course.date).toISOString().slice(0, 16),
            duration: course.duration,
            maxParticipants: course.maxParticipants,
            price: course.price,
            status: course.status,
            sport: course.sport
        });
        setShowCourseModal(true);
    };

    const handleDeleteCourse = (id: string) => {
        setCourseDeleteModal({ isOpen: true, id });
    };

    const confirmDeleteCourse = async () => {
        setIsSubmitting(true);
        try {
            await api.delete(`/courses/${courseDeleteModal.id}`);
            setCourseDeleteModal({ ...courseDeleteModal, isOpen: false });
            fetchCourses();
        } catch (err) {
            console.error('Error deleting course:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetCourseForm = () => {
        setCourseFormData({
            title: '',
            description: '',
            coach: '',
            level: 'INTERMEDIAIRE',
            date: '',
            duration: 60,
            maxParticipants: 8,
            price: 25,
            status: 'UPCOMING',
            sport: 'PADEL'
        });
    };

    const handleCreateTournament = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const now = new Date();
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const deadline = new Date(formData.registrationDeadline);

        // Date Validations
        if (!editingTournament && start < now) {
            setError("La date de début ne peut pas être dans le passé.");
            setIsSubmitting(false);
            return;
        }

        if (start >= end) {
            setError("La date de début doit être antérieure à la date de fin.");
            setIsSubmitting(false);
            return;
        }

        if (deadline >= start) {
            setError("La date limite d'inscription doit être avant le début du tournoi.");
            setIsSubmitting(false);
            return;
        }

        if (!editingTournament && deadline < now) {
            setError("La date limite d'inscription ne peut pas être dans le passé.");
            setIsSubmitting(false);
            return;
        }

        try {
            if (editingTournament) {
                await api.put(`/tournaments/${editingTournament._id}`, formData);
            } else {
                await api.post('/tournaments', formData);
            }
            setShowModal(false);
            setEditingTournament(null);
            resetForm();
            fetchTournaments();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Une erreur est survenue.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTournament = (id: string) => {
        setDeleteModal({ isOpen: true, id });
    };

    const confirmDelete = async () => {
        setIsSubmitting(true);
        try {
            await api.delete(`/tournaments/${deleteModal.id}`);
            setDeleteModal({ ...deleteModal, isOpen: false });
            fetchTournaments();
        } catch (err) {
            console.error('Error deleting tournament:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditTournament = (t: Tournament) => {
        setEditingTournament(t);
        setFormData({
            name: t.name,
            description: t.description,
            startDate: new Date(t.startDate).toISOString().slice(0, 16),
            endDate: new Date(t.endDate).toISOString().slice(0, 16),
            registrationDeadline: new Date(t.registrationDeadline).toISOString().slice(0, 16),
            maxTeams: t.maxTeams,
            entryFee: t.entryFee,
            prize: t.prize,
            level: t.level,
            image: t.image,
            status: t.status
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            startDate: '',
            endDate: '',
            registrationDeadline: '',
            maxTeams: 16,
            entryFee: 25,
            prize: '',
            level: 'P250',
            image: '',
            status: 'UPCOMING'
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            const res = await api.post('/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                setFormData(prev => ({ ...prev, image: res.data.url }));
            }
        } catch (err) {
            setError("Échec de l'upload de l'image");
        } finally {
            setUploading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-10"
        >
            {/* Legend Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8 border-b border-white/5 pb-8 md:pb-10 pt-6 md:pt-0">
                <div className="space-y-3 md:space-y-4">

                    <div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white uppercase tracking-tighter leading-[0.9] md:leading-[0.85]">
                            {activeTab === 'TOURNOIS' ? (
                                <>Circuit <br /> <span className="text-padel-blue drop-shadow-[0_0_30px_rgba(19,73,211,0.3)]">Elite & Rankings</span></>
                            ) : (
                                <>Académie <br /> <span className="text-padel-blue drop-shadow-[0_0_30px_rgba(19,73,211,0.3)]">& Coaching</span></>
                            )}
                        </h1>
                        <p className="text-[10px] md:text-xs font-bold text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em] mt-3 md:mt-4">
                            {activeTab === 'TOURNOIS' ? 'Déploiement Stratégique • Homologation FFT' : 'Progression • Excellence • Performance'}
                        </p>
                    </div>

                    {/* Tabs */}
                    {/* <div className="flex bg-white/5 rounded-2xl p-1.5 border border-white/10 w-fit mt-4">
                        <button
                            onClick={() => handleTabChange('TOURNOIS')}
                            className={cn(
                                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                activeTab === 'TOURNOIS' ? "bg-padel-blue text-white shadow-lg shadow-padel-blue/20" : "text-white/40 hover:text-white"
                            )}
                        >
                            <Trophy size={12} /> Événements
                        </button>
                        <button
                            onClick={() => handleTabChange('COURS')}
                            className={cn(
                                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                activeTab === 'COURS' ? "bg-padel-blue text-white shadow-lg shadow-padel-blue/20" : "text-white/40 hover:text-white"
                            )}
                        >
                            <GraduationCap size={12} /> Programmes
                        </button>
                    </div> */}
                </div>

                <div className="flex gap-4">
                    {activeTab === 'TOURNOIS' ? (
                        <button
                            onClick={() => { setEditingTournament(null); resetForm(); setShowModal(true); }}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-3 md:gap-4 px-6 md:px-12 py-4 md:py-6 rounded-xl md:rounded-[2rem] bg-padel-blue text-white text-[9px] md:text-[11px] font-black uppercase tracking-widest shadow-2xl hover:bg-padel-yellow hover:text-padel-blue transition-all duration-500 group"
                        >
                            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500 md:w-[22px] md:h-[22px]" /> Nouveau Tournoi
                        </button>
                    ) : (
                        <button
                            onClick={() => { setEditingCourse(null); resetCourseForm(); setShowCourseModal(true); }}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-3 md:gap-4 px-6 md:px-12 py-4 md:py-6 rounded-xl md:rounded-[2rem] bg-padel-blue text-white text-[9px] md:text-[11px] font-black uppercase tracking-widest shadow-2xl hover:bg-padel-yellow hover:text-padel-blue transition-all duration-500 group"
                        >
                            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500 md:w-[22px] md:h-[22px]" /> Nouveau Cours
                        </button>
                    )}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'TOURNOIS' ? (
                    <motion.div
                        key="tournois"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {loading ? (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
                                    <Loader2 size={48} className="text-padel-blue animate-spin" />
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Chargement des données satellites...</p>
                                </div>
                            ) : (
                                tournaments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((tourney, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        key={tourney._id}
                                        className="bg-[#151518]/60 backdrop-blur-2xl border border-white/5 rounded-2xl md:rounded-[2.5rem] overflow-hidden group hover:border-padel-yellow/20 transition-all duration-500 shadow-3xl relative flex flex-col"
                                    >
                                        {/* Card Header: Image & Badges */}
                                        <div className="relative h-40 md:h-48 overflow-hidden">
                                            {tourney.image ? (
                                                <img src={tourney.image} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                            ) : (
                                                <div className="w-full h-full bg-padel-yellow flex items-center justify-center text-padel-blue">
                                                    <Trophy size={48} className="md:w-[64px] md:h-[64px]" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#151518] to-transparent" />

                                            {/* Status Badge (Floating) */}
                                            <div className="absolute top-4 md:top-6 left-4 md:left-6">
                                                <span className={cn(
                                                    "px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border backdrop-blur-md shadow-2xl",
                                                    tourney.status === 'CANCELLED' ? 'bg-red-500/20 text-red-500 border-red-500/10' :
                                                        tourney.status === 'UPCOMING' ? 'bg-green-500/20 text-green-500 border-green-500/10' :
                                                            'bg-padel-blue/20 text-padel-blue border-padel-blue/10'
                                                )}>{tourney.status}</span>
                                            </div>

                                            {/* Quick Actions */}
                                            <div className="absolute top-4 md:top-6 right-4 md:right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                                <button
                                                    onClick={() => openParticipants(tourney._id, tourney.name, 'TOURNOI')}
                                                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-padel-yellow hover:text-padel-blue transition-all"
                                                    title="Voir les inscrits"
                                                >
                                                    <Users size={12} className="md:w-[16px] md:h-[16px]" />
                                                </button>
                                                <button
                                                    onClick={() => handleEditTournament(tourney)}
                                                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-padel-blue hover:border-padel-blue transition-all"
                                                >
                                                    <Edit2 size={12} className="md:w-[16px] md:h-[16px]" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTournament(tourney._id)}
                                                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-500/10 border border-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all transition-all"
                                                >
                                                    <Trash2 size={12} className="md:w-[16px] md:h-[16px]" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Card Content */}
                                        <div className="p-6 md:p-8 space-y-4 md:space-y-6 flex-1 flex flex-col">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2 md:mb-3">
                                                    <div className="px-2 py-0.5 md:px-3 md:py-1 rounded-md bg-padel-blue/10 border border-padel-blue/20 text-[7px] md:text-[8px] font-black text-padel-blue uppercase tracking-widest">{tourney.level}</div>
                                                    <div className="flex items-center gap-1 text-[7px] md:text-[8px] font-black text-white/20 uppercase tracking-widest">
                                                        <MapPin size={8} className="md:w-[10px] md:h-[10px]" /> ARENA
                                                    </div>
                                                </div>
                                                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-1 md:mb-2 group-hover:text-padel-yellow transition-colors leading-tight line-clamp-2 md:line-clamp-none">{tourney.name}</h3>
                                                <p className="text-[9px] md:text-[10px] font-bold text-white/30 uppercase tracking-[0.1em] md:tracking-[0.2em]">
                                                    {new Date(tourney.startDate).toLocaleDateString('fr-FR')} - {new Date(tourney.endDate).toLocaleDateString('fr-FR')}
                                                </p>
                                            </div>

                                            {/* Filling Progress */}
                                            <div className="space-y-1.5 md:space-y-2">
                                                <div className="flex justify-between items-end">
                                                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Remplissage</p>
                                                    <p className="text-[10px] md:text-11px] font-black text-white">{tourney.currentTeams}/{tourney.maxTeams}</p>
                                                </div>
                                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(tourney.currentTeams / tourney.maxTeams) * 100}%` }}
                                                        className="h-full bg-padel-blue rounded-full"
                                                    />
                                                </div>
                                            </div>

                                            {/* Footer Stats */}
                                            <div className="pt-4 md:pt-6 border-t border-white/5 grid grid-cols-2 gap-4 mt-auto">
                                                <div className="space-y-0.5 md:space-y-1">
                                                    <p className="text-[7px] md:text-[8px] font-black text-white/20 uppercase tracking-widest">Entry Fee</p>
                                                    <p className="text-sm md:text-lg font-black text-white">{tourney.entryFee}€</p>
                                                </div>
                                                <div className="space-y-0.5 md:space-y-1">
                                                    <p className="text-[7px] md:text-[8px] font-black text-white/20 uppercase tracking-widest">Prize Pool</p>
                                                    <p className="text-sm md:text-lg font-black text-padel-yellow tracking-tighter">{tourney.prize.split(' ')[0]}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Pagination Controls */}
                        {!loading && tournaments.length > itemsPerPage && (
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 pt-8 md:pt-12">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all"
                                >
                                    Précédent
                                </button>
                                <div className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-2 sm:pb-0 custom-scrollbar max-w-full">
                                    {Array.from({ length: Math.ceil(tournaments.length / itemsPerPage) }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={cn(
                                                "w-8 h-8 md:w-10 md:h-10 rounded-lg text-[9px] md:text-[10px] font-black transition-all border shrink-0",
                                                currentPage === i + 1 ? "bg-padel-blue border-padel-blue text-white shadow-xl shadow-padel-blue/20" : "bg-white/5 border-white/5 text-white/20 hover:text-white"
                                            )}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    disabled={currentPage === Math.ceil(tournaments.length / itemsPerPage)}
                                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(tournaments.length / itemsPerPage), prev + 1))}
                                    className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all"
                                >
                                    Suivant
                                </button>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    /* ─── COURSES SECTION ─── */
                    <motion.div
                        key="cours"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {loadingCourses ? (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
                                    <Loader2 size={48} className="text-padel-blue animate-spin" />
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Chargement des cours...</p>
                                </div>
                            ) : courses.length === 0 ? (
                                <div className="col-span-full text-center py-20">
                                    <GraduationCap size={48} className="text-white/10 mx-auto mb-4" />
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Aucun cours programmé</p>
                                </div>
                            ) : (
                                courses.slice((coursePage - 1) * itemsPerPage, coursePage * itemsPerPage).map((course, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        key={course._id}
                                        className="bg-[#151518]/60 backdrop-blur-2xl border border-white/5 rounded-2xl md:rounded-[2rem] overflow-hidden group hover:border-padel-blue/20 transition-all duration-500 shadow-xl relative flex flex-col"
                                    >
                                        {/* Card Header */}
                                        <div className="relative h-32 md:h-40 overflow-hidden bg-gradient-to-br from-padel-blue/20 to-padel-yellow/10 flex items-center justify-center">
                                            <GraduationCap size={48} className="text-white/20" />

                                            {/* Status Badge */}
                                            <div className="absolute top-4 left-4">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border backdrop-blur-md",
                                                    course.status === 'CANCELLED' ? 'bg-red-500/20 text-red-500 border-red-500/10' :
                                                        course.status === 'COMPLETED' ? 'bg-white/10 text-white/50 border-white/10' :
                                                            course.status === 'UPCOMING' ? 'bg-green-500/20 text-green-500 border-green-500/10' :
                                                                'bg-padel-blue/20 text-padel-blue border-padel-blue/10'
                                                )}>{course.status === 'UPCOMING' ? 'À venir' : course.status === 'ONGOING' ? 'En cours' : course.status === 'COMPLETED' ? 'Terminé' : 'Annulé'}</span>
                                            </div>

                                            {/* Level Badge */}
                                            <div className="absolute top-4 right-4">
                                                <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-padel-yellow/20 text-padel-yellow border border-padel-yellow/20">
                                                    {course.level}
                                                </span>
                                            </div>

                                            {/* Quick Actions */}
                                            <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <button
                                                    onClick={() => openParticipants(course._id, course.title, 'COURS')}
                                                    className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-padel-yellow hover:text-padel-blue transition-all"
                                                    title="Voir les inscrits"
                                                >
                                                    <Users size={12} />
                                                </button>
                                                <button
                                                    onClick={() => handleEditCourse(course)}
                                                    className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-padel-blue hover:border-padel-blue transition-all"
                                                >
                                                    <Edit2 size={12} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCourse(course._id)}
                                                    className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Card Content */}
                                        <div className="p-5 md:p-6 space-y-4 flex-1 flex flex-col">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="px-2 py-0.5 rounded bg-padel-blue/10 text-padel-blue text-[7px] font-black uppercase tracking-widest">
                                                        {course.sport}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg md:text-xl font-display font-black text-white uppercase tracking-tighter leading-tight group-hover:text-padel-blue transition-colors">
                                                    {course.title}
                                                </h3>
                                            </div>

                                            <div className="space-y-2 flex-1">
                                                <div className="flex items-center gap-2 text-[9px] font-bold text-white/30 uppercase tracking-widest">
                                                    <Calendar size={12} className="text-padel-blue" />
                                                    {new Date(course.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                                                    {' • '}
                                                    {new Date(course.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="flex items-center gap-2 text-[9px] font-bold text-white/30 uppercase tracking-widest">
                                                    <Clock size={12} className="text-padel-blue" /> {course.duration} min
                                                </div>
                                                <div className="flex items-center gap-2 text-[9px] font-bold text-white/30 uppercase tracking-widest">
                                                    <Users size={12} className="text-padel-blue" /> {course.currentParticipants}/{course.maxParticipants} places
                                                </div>
                                                <div className="flex items-center gap-2 text-[9px] font-bold text-white/30 uppercase tracking-widest">
                                                    <Star size={12} className="text-padel-yellow" /> Coach : {course.coach}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                <span className="text-2xl font-display font-black text-padel-yellow">{course.price}€</span>
                                                <span className={cn(
                                                    "text-[8px] font-black uppercase tracking-widest",
                                                    course.currentParticipants >= course.maxParticipants ? "text-red-500" : "text-green-500"
                                                )}>
                                                    {course.currentParticipants >= course.maxParticipants ? 'Complet' : `${course.maxParticipants - course.currentParticipants} places restantes`}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Courses Pagination */}
                        {!loadingCourses && courses.length > itemsPerPage && (
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 pt-8">
                                <button
                                    disabled={coursePage === 1}
                                    onClick={() => setCoursePage(prev => Math.max(1, prev - 1))}
                                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all disabled:opacity-30"
                                >
                                    Précédent
                                </button>
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: Math.ceil(courses.length / itemsPerPage) }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCoursePage(i + 1)}
                                            className={cn(
                                                "w-8 h-8 rounded-lg text-[9px] font-black transition-all border",
                                                coursePage === i + 1 ? "bg-padel-blue border-padel-blue text-white shadow-xl shadow-padel-blue/20" : "bg-white/5 border-white/5 text-white/20 hover:text-white"
                                            )}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    disabled={coursePage === Math.ceil(courses.length / itemsPerPage)}
                                    onClick={() => setCoursePage(prev => Math.min(Math.ceil(courses.length / itemsPerPage), prev + 1))}
                                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all disabled:opacity-30"
                                >
                                    Suivant
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal de Configuration Tournoi */}
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
                            className="bg-[#1a1a1e] border border-white/10 w-full max-w-4xl rounded-2xl md:rounded-[3rem] p-6 md:p-8 relative z-10 shadow-3xl max-h-[95vh] overflow-y-auto custom-scrollbar"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 md:top-8 right-4 md:right-8 w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-full flex items-center justify-center text-white/20 hover:text-white transition-all"
                            >
                                <X size={18} className="md:w-5 md:h-5" />
                            </button>

                            <div className="mb-6">
                                <h2 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tighter">
                                    {editingTournament ? 'Modifier' : 'Configurer'} <span className="text-padel-yellow">Tournoi</span>
                                </h2>
                                <p className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-1">DÉPLOIEMENT COMPÉTITION ÉLITE</p>
                            </div>

                            <form onSubmit={handleCreateTournament} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left Column */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                                <Target size={12} className="text-padel-blue" /> Nom du Tournoi
                                            </label>
                                            <input
                                                type="text" required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="ex: Vendôme Winter Masters"
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white text-sm font-bold focus:outline-none focus:border-padel-blue focus:bg-white/[0.06] transition-all"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                                <Sparkles size={12} className="text-padel-yellow" /> Description Stratégique
                                            </label>
                                            <textarea
                                                rows={3} required
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Détails, règles, ambiance..."
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-3xl px-6 py-4 text-white text-sm font-bold focus:outline-none focus:border-padel-blue focus:bg-white/[0.06] transition-all resize-none"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Grade / Niveau</label>
                                                <div className="relative group">
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsLevelOpen(!isLevelOpen)}
                                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white text-[10px] font-black transition-all flex items-center justify-between hover:bg-white/[0.06] hover:border-padel-blue group"
                                                    >
                                                        {formData.level}
                                                        <MoreHorizontal size={14} className={cn("transition-transform duration-500", isLevelOpen ? "rotate-90 text-padel-blue" : "text-white/20")} />
                                                    </button>

                                                    <AnimatePresence>
                                                        {isLevelOpen && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                className="absolute top-full left-0 w-full mt-2 bg-[#1a1a1e] border border-white/10 rounded-2xl overflow-hidden z-[110] shadow-3xl backdrop-blur-3xl"
                                                            >
                                                                {['P25', 'P100', 'P250', 'P500', 'P1000', 'OPEN'].map(l => (
                                                                    <button
                                                                        key={l}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setFormData({ ...formData, level: l });
                                                                            setIsLevelOpen(false);
                                                                        }}
                                                                        className={cn(
                                                                            "w-full px-6 py-4 text-left text-[10px] font-black transition-all hover:bg-white/[0.05] flex items-center justify-between uppercase tracking-widest",
                                                                            formData.level === l ? "text-padel-blue bg-padel-blue/5" : "text-white/40"
                                                                        )}
                                                                    >
                                                                        {l}
                                                                        {formData.level === l && <CheckCircle2 size={12} className="text-padel-blue" />}
                                                                    </button>
                                                                ))}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Statut Initial</label>
                                                <div className="relative group">
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsStatusOpen(!isStatusOpen)}
                                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white text-[10px] font-black transition-all flex items-center justify-between hover:bg-white/[0.06] hover:border-padel-yellow"
                                                    >
                                                        {formData.status === 'UPCOMING' ? 'À VENIR' :
                                                            formData.status === 'ONGOING' ? 'EN COURS' :
                                                                formData.status === 'COMPLETED' ? 'TERMINÉ' : 'ANNULÉ'}
                                                        <MoreHorizontal size={14} className={cn("transition-transform duration-500", isStatusOpen ? "rotate-90 text-padel-yellow" : "text-white/20")} />
                                                    </button>

                                                    <AnimatePresence>
                                                        {isStatusOpen && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                className="absolute top-full left-0 w-full mt-2 bg-[#1a1a1e] border border-white/10 rounded-2xl overflow-hidden z-[110] shadow-3xl backdrop-blur-3xl"
                                                            >
                                                                {[
                                                                    { val: 'UPCOMING', label: 'À VENIR' },
                                                                    { val: 'ONGOING', label: 'EN COURS' },
                                                                    { val: 'COMPLETED', label: 'TERMINÉ' },
                                                                    { val: 'CANCELLED', label: 'ANNULÉ' }
                                                                ].map(s => (
                                                                    <button
                                                                        key={s.val}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setFormData({ ...formData, status: s.val as any });
                                                                            setIsStatusOpen(false);
                                                                        }}
                                                                        className={cn(
                                                                            "w-full px-6 py-4 text-left text-[10px] font-black transition-all hover:bg-white/[0.05] flex items-center justify-between uppercase tracking-widest",
                                                                            formData.status === s.val ? "text-padel-yellow bg-padel-yellow/5" : "text-white/40"
                                                                        )}
                                                                    >
                                                                        {s.label}
                                                                        {formData.status === s.val && <CheckCircle2 size={12} className="text-padel-yellow" />}
                                                                    </button>
                                                                ))}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <TacticalDateTimePicker
                                                label="Début du Tournoi"
                                                icon={Calendar}
                                                color="blue"
                                                value={formData.startDate}
                                                onChange={(val) => setFormData({ ...formData, startDate: val })}
                                            />
                                            <TacticalDateTimePicker
                                                label="Fin du Tournoi"
                                                icon={Calendar}
                                                color="blue"
                                                value={formData.endDate}
                                                onChange={(val) => setFormData({ ...formData, endDate: val })}
                                            />
                                        </div>

                                        <TacticalDateTimePicker
                                            label="Deadline Inscription"
                                            icon={Clock}
                                            color="red"
                                            value={formData.registrationDeadline}
                                            onChange={(val) => setFormData({ ...formData, registrationDeadline: val })}
                                        />

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                                                    <Users size={12} className="text-padel-blue" /> Max Teams
                                                </label>
                                                <div className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-2xl p-1 h-[54px] group-hover:border-white/20 transition-all">
                                                    <button type="button" onClick={() => setFormData(p => ({ ...p, maxTeams: Math.max(2, p.maxTeams - 2) }))} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all font-black text-lg">-</button>
                                                    <input
                                                        type="number" required
                                                        value={formData.maxTeams}
                                                        onChange={(e) => setFormData(p => ({ ...p, maxTeams: parseInt(e.target.value) || 0 }))}
                                                        className="w-16 bg-transparent text-center text-lg font-black text-white focus:outline-none"
                                                    />
                                                    <button type="button" onClick={() => setFormData(p => ({ ...p, maxTeams: p.maxTeams + 2 }))} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all font-black text-lg">+</button>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                                                    <Star size={12} className="text-padel-yellow" /> Frais (€)
                                                </label>
                                                <div className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-2xl p-1 h-[54px] group-hover:border-white/20 transition-all">
                                                    <button type="button" onClick={() => setFormData(p => ({ ...p, entryFee: Math.max(0, p.entryFee - 5) }))} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all font-black text-lg">-</button>
                                                    <input
                                                        type="number" required
                                                        value={formData.entryFee}
                                                        onChange={(e) => setFormData(p => ({ ...p, entryFee: parseInt(e.target.value) || 0 }))}
                                                        className="w-16 bg-transparent text-center text-lg font-black text-white focus:outline-none"
                                                    />
                                                    <button type="button" onClick={() => setFormData(p => ({ ...p, entryFee: p.entryFee + 5 }))} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all font-black text-lg">+</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                                <Trophy size={12} className="text-padel-yellow" /> Grand Prix / Dotation
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-padel-yellow transition-colors">
                                                    <Star size={16} />
                                                </div>
                                                <input
                                                    type="text" required
                                                    value={formData.prize}
                                                    onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                                                    placeholder="ex: 1000€ + Pack Bullpadel"
                                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-16 pr-6 py-4 text-white text-xs font-bold focus:outline-none focus:border-padel-blue focus:bg-white/[0.06] transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1 flex items-center gap-2">
                                                <ImageIcon size={10} className="text-padel-blue" /> Image de l'évènement
                                            </label>
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="aspect-[21/9] rounded-[1.5rem] border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-padel-blue/50 hover:bg-padel-blue/5 transition-all group overflow-hidden relative shadow-2xl"
                                            >
                                                {formData.image ? (
                                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                                                ) : (
                                                    <>
                                                        <div className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center text-white/20 group-hover:bg-padel-blue group-hover:text-white transition-all shadow-xl">
                                                            {uploading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-[9px] font-black text-white uppercase tracking-widest group-hover:text-padel-blue transition-colors">
                                                                {uploading ? 'Téléchargement...' : 'Cliquez pour uploader'}
                                                            </p>
                                                        </div>
                                                    </>
                                                )}
                                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                            </div>
                                            <div className="relative group">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-padel-blue transition-colors">
                                                    <ExternalLink size={16} />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={formData.image}
                                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                    placeholder="Ou coller une URL..."
                                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-16 pr-6 py-4 text-white text-xs font-bold focus:outline-none focus:border-padel-blue focus:bg-white/[0.06] transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[9px] font-black uppercase tracking-widest text-center">
                                        ⚡ Error: {error}
                                    </motion.div>
                                )}

                                <button
                                    disabled={isSubmitting}
                                    className="w-full py-5 bg-padel-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-3xl shadow-padel-blue/20 hover:bg-padel-yellow hover:text-padel-blue transition-all duration-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 group"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} className="group-hover:rotate-12 transition-transform" />}
                                    {editingTournament ? 'Valider les modifications Système' : 'Initialiser Déploiement'}
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
                title="Supprimer le Tournoi"
                message="Cette action est critique. Toutes les équipes inscrites, les rankings et l'organisation du tournoi seront définitivement effacés du réseau."
                isLoading={isSubmitting}
            />

            {/* ─── Course Modal ─── */}
            <AnimatePresence>
                {showCourseModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCourseModal(false)}
                            className="absolute inset-0 bg-dark-bg/90 backdrop-blur-2xl"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#1a1a1e] border border-white/10 w-full max-w-2xl rounded-2xl md:rounded-[3rem] p-6 md:p-8 relative z-10 shadow-3xl max-h-[95vh] overflow-y-auto custom-scrollbar"
                        >
                            <button
                                onClick={() => setShowCourseModal(false)}
                                className="absolute top-4 md:top-8 right-4 md:right-8 w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-full flex items-center justify-center text-white/20 hover:text-white transition-all"
                            >
                                <X size={18} />
                            </button>

                            <div className="mb-6">
                                <h2 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tighter">
                                    {editingCourse ? 'Modifier' : 'Créer'} <span className="text-padel-blue">Cours</span>
                                </h2>
                                <p className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-1">COACHING & FORMATION</p>
                            </div>

                            <form onSubmit={handleCreateCourse} className="space-y-5">
                                {/* Title */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Titre du cours</label>
                                    <input
                                        type="text" required
                                        value={courseFormData.title}
                                        onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                                        placeholder="ex: Perfectionnement Volée"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white text-sm font-bold focus:outline-none focus:border-padel-blue transition-all"
                                    />
                                </div>

                                {/* Coach */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Coach</label>
                                    <input
                                        type="text" required
                                        value={courseFormData.coach}
                                        onChange={(e) => setCourseFormData({ ...courseFormData, coach: e.target.value })}
                                        placeholder="ex: Marcelo B."
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white text-sm font-bold focus:outline-none focus:border-padel-blue transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Sport */}
                                    <div className="space-y-2 relative">
                                        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Sport</label>
                                        <button
                                            type="button"
                                            onClick={() => setIsCourseSport(!isCourseSport)}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white text-sm font-bold text-left flex items-center justify-between hover:border-white/20 transition-all"
                                        >
                                            {courseFormData.sport}
                                            <ChevronRight size={14} className={cn("transition-transform", isCourseSport && "rotate-90")} />
                                        </button>
                                        <AnimatePresence>
                                            {isCourseSport && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1e] border border-white/10 rounded-xl overflow-hidden z-20"
                                                >
                                                    {['PADEL', 'PICKLEBALL', 'BADMINTON'].map(s => (
                                                        <button
                                                            key={s}
                                                            type="button"
                                                            onClick={() => { setCourseFormData({ ...courseFormData, sport: s as any }); setIsCourseSport(false); }}
                                                            className={cn("w-full px-5 py-3 text-left text-[10px] font-black transition-all hover:bg-white/5", courseFormData.sport === s ? "text-padel-blue bg-padel-blue/5" : "text-white/40")}
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Level */}
                                    <div className="space-y-2 relative">
                                        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Niveau</label>
                                        <button
                                            type="button"
                                            onClick={() => setIsCourseLevel(!isCourseLevel)}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white text-sm font-bold text-left flex items-center justify-between hover:border-white/20 transition-all"
                                        >
                                            {courseFormData.level}
                                            <ChevronRight size={14} className={cn("transition-transform", isCourseLevel && "rotate-90")} />
                                        </button>
                                        <AnimatePresence>
                                            {isCourseLevel && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1e] border border-white/10 rounded-xl overflow-hidden z-20"
                                                >
                                                    {['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE', 'EXPERT'].map(l => (
                                                        <button
                                                            key={l}
                                                            type="button"
                                                            onClick={() => { setCourseFormData({ ...courseFormData, level: l as any }); setIsCourseLevel(false); }}
                                                            className={cn("w-full px-5 py-3 text-left text-[10px] font-black transition-all hover:bg-white/5", courseFormData.level === l ? "text-padel-yellow bg-padel-yellow/5" : "text-white/40")}
                                                        >
                                                            {l}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Date & Duration */}
                                <div className="grid grid-cols-2 gap-4">
                                    <TacticalDateTimePicker
                                        label="Date & Heure"
                                        icon={Calendar}
                                        color="blue"
                                        value={courseFormData.date}
                                        onChange={(val) => setCourseFormData({ ...courseFormData, date: val })}
                                    />
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                                            <Clock size={12} className="text-padel-blue" /> Durée (min)
                                        </label>
                                        <div className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-2xl p-1 h-[54px]">
                                            <button type="button" onClick={() => setCourseFormData(p => ({ ...p, duration: Math.max(30, p.duration - 15) }))} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all font-black">-</button>
                                            <span className="text-lg font-black text-white">{courseFormData.duration}</span>
                                            <button type="button" onClick={() => setCourseFormData(p => ({ ...p, duration: p.duration + 15 }))} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all font-black">+</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Max Participants & Price */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Max Participants</label>
                                        <div className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-xl p-1 h-[54px]">
                                            <button type="button" onClick={() => setCourseFormData(p => ({ ...p, maxParticipants: Math.max(1, p.maxParticipants - 1) }))} className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all font-black">-</button>
                                            <span className="text-lg font-black text-white">{courseFormData.maxParticipants}</span>
                                            <button type="button" onClick={() => setCourseFormData(p => ({ ...p, maxParticipants: p.maxParticipants + 1 }))} className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all font-black">+</button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Prix (€)</label>
                                        <div className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-xl p-1 h-[54px]">
                                            <button type="button" onClick={() => setCourseFormData(p => ({ ...p, price: Math.max(0, p.price - 5) }))} className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all font-black">-</button>
                                            <span className="text-lg font-black text-white">{courseFormData.price}</span>
                                            <button type="button" onClick={() => setCourseFormData(p => ({ ...p, price: p.price + 5 }))} className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all font-black">+</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Status (for editing) */}
                                {editingCourse && (
                                    <div className="space-y-2 relative">
                                        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Statut</label>
                                        <button
                                            type="button"
                                            onClick={() => setIsCourseStatus(!isCourseStatus)}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white text-sm font-bold text-left flex items-center justify-between hover:border-white/20 transition-all"
                                        >
                                            {courseFormData.status}
                                            <ChevronRight size={14} className={cn("transition-transform", isCourseStatus && "rotate-90")} />
                                        </button>
                                        <AnimatePresence>
                                            {isCourseStatus && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1e] border border-white/10 rounded-xl overflow-hidden z-20"
                                                >
                                                    {['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'].map(s => (
                                                        <button
                                                            key={s}
                                                            type="button"
                                                            onClick={() => { setCourseFormData({ ...courseFormData, status: s as any }); setIsCourseStatus(false); }}
                                                            className={cn("w-full px-5 py-3 text-left text-[10px] font-black transition-all hover:bg-white/5", courseFormData.status === s ? "text-green-500 bg-green-500/5" : "text-white/40")}
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                {courseError && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[9px] font-black uppercase tracking-widest text-center">
                                        ⚡ {courseError}
                                    </motion.div>
                                )}

                                <button
                                    disabled={isSubmitting}
                                    className="w-full py-5 bg-padel-blue text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-padel-blue/20 hover:bg-padel-yellow hover:text-padel-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                                    {editingCourse ? 'Mettre à jour le cours' : 'Créer le cours'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <DeleteConfirmModal
                isOpen={courseDeleteModal.isOpen}
                onClose={() => setCourseDeleteModal({ ...courseDeleteModal, isOpen: false })}
                onConfirm={confirmDeleteCourse}
                title="Supprimer le Cours"
                message="Cette action supprimera définitivement ce cours et désinscrit tous les participants."
                isLoading={isSubmitting}
            />

            {/* Modal Participants */}
            <AnimatePresence>
                {participantsModal.isOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setParticipantsModal({ ...participantsModal, isOpen: false })}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            className="relative w-full max-w-2xl bg-[#1A1A1E] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-3xl flex flex-col max-h-[85vh]"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                                        Liste des <span className="text-padel-blue">Inscrits</span>
                                    </h3>
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-1 line-clamp-1">{participantsModal.title}</p>
                                </div>
                                <button
                                    onClick={() => setParticipantsModal({ ...participantsModal, isOpen: false })}
                                    className="p-3 bg-white/5 rounded-xl text-white/20 hover:text-white transition-all border border-white/10"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                                {participantsModal.loading ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                                        <Loader2 size={32} className="text-padel-blue animate-spin" />
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Récupération des profils...</p>
                                    </div>
                                ) : participantsModal.participants.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-white/20">
                                        <Users size={48} className="mb-4 opacity-50" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">Aucun participant pour le moment</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                                <p className="text-[8px] font-black text-white/20 uppercase mb-1">Total Inscrits</p>
                                                <p className="text-2xl font-black text-white">{participantsModal.participants.length}</p>
                                            </div>
                                            <div className="p-4 bg-padel-blue/5 rounded-2xl border border-padel-blue/10">
                                                <p className="text-[8px] font-black text-padel-blue uppercase mb-1">Status</p>
                                                <p className="text-2xl font-black text-white">CONFIRMÉ</p>
                                            </div>
                                        </div>

                                        {participantsModal.participants.map((p, idx) => (
                                            <div key={p._id || idx} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all group">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-padel-blue/20 to-padel-blue/5 flex items-center justify-center text-padel-blue font-black text-sm border border-padel-blue/20">
                                                    {p.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '??'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-padel-blue transition-colors truncate">{p.name}</p>
                                                    <p className="text-[10px] font-bold text-white/20 truncate">{p.email}</p>
                                                </div>
                                                <div className="hidden sm:block text-right">
                                                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">{p.phone || 'N/A'}</p>
                                                    <p className="text-[8px] font-bold text-white/10 mt-1 uppercase">Inscrit le {new Date(p.createdAt).toLocaleDateString('fr-FR')}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-8 border-t border-white/5 bg-white/[0.01] flex justify-end">
                                <button
                                    onClick={() => {/* TODO: Export logic */}}
                                    className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all group"
                                >
                                    <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    Exporter Liste d'appel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                input[type="number"]::-webkit-inner-spin-button,
                input[type="number"]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                input[type="number"] {
                    -moz-appearance: textfield;
                }
                input[type="datetime-local"]::-webkit-calendar-picker-indicator {
                    filter: invert(1);
                    cursor: pointer;
                    opacity: 0.5;
                    transition: opacity 0.2s;
                }
                input[type="datetime-local"]::-webkit-calendar-picker-indicator:hover {
                    opacity: 1;
                }
            `}</style>
        </motion.div >
    );
}
