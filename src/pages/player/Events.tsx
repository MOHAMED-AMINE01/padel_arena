import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Trophy,
    Users,
    Target,
    Calendar,
    ArrowRight,
    ChevronRight,
    ChevronLeft,
    Sparkles,
    Medal,
    Clock,
    Star,
    Loader2,
    GraduationCap,
    AlertCircle,
    CheckCircle2,
    Check,
    X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

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
    participants: string[];
}

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
    participants: string[];
}

export function PlayerEvents() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'COURS' | 'TOURNOIS'>('COURS');
    
    // Courses state
    const [courses, setCourses] = useState<Course[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [coursePage, setCoursePage] = useState(1);
    const [joiningCourse, setJoiningCourse] = useState<string | null>(null);
    const [leavingCourse, setLeavingCourse] = useState<string | null>(null);
    const [courseSuccess, setCourseSuccess] = useState<string | null>(null);
    
    // Tournaments state
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loadingTournaments, setLoadingTournaments] = useState(true);
    const [tournamentPage, setTournamentPage] = useState(1);
    const [joiningTournament, setJoiningTournament] = useState<string | null>(null);
    const [leavingTournament, setLeavingTournament] = useState<string | null>(null);
    const [tournamentSuccess, setTournamentSuccess] = useState<string | null>(null);

    const ITEMS_PER_PAGE = 6;

    useEffect(() => {
        fetchCourses();
        fetchTournaments();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await api.get('/courses');
            // Only show upcoming courses
            setCourses(res.data.data.filter((c: Course) => c.status === 'UPCOMING'));
        } catch (err) {
            console.error('Error fetching courses:', err);
        } finally {
            setLoadingCourses(false);
        }
    };

    const fetchTournaments = async () => {
        try {
            const res = await api.get('/tournaments');
            // Only show upcoming tournaments
            setTournaments(res.data.data.filter((t: Tournament) => t.status === 'UPCOMING' || t.status === 'ONGOING'));
        } catch (err) {
            console.error('Error fetching tournaments:', err);
        } finally {
            setLoadingTournaments(false);
        }
    };

    const handleJoinCourse = async (courseId: string) => {
        setJoiningCourse(courseId);
        try {
            await api.post(`/courses/${courseId}/join`);
            setCourseSuccess(courseId);
            setTimeout(() => setCourseSuccess(null), 3000);
            fetchCourses();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Erreur lors de l\'inscription');
        } finally {
            setJoiningCourse(null);
        }
    };

    const handleJoinTournament = async (tournamentId: string) => {
        setJoiningTournament(tournamentId);
        try {
            await api.post(`/tournaments/${tournamentId}/join`);
            setTournamentSuccess(tournamentId);
            setTimeout(() => setTournamentSuccess(null), 3000);
            fetchTournaments();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Erreur lors de l\'inscription');
        } finally {
            setJoiningTournament(null);
        }
    };

    const handleLeaveCourse = async (courseId: string) => {
        setLeavingCourse(courseId);
        try {
            await api.post(`/courses/${courseId}/leave`);
            fetchCourses();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Erreur lors de la désinscription');
        } finally {
            setLeavingCourse(null);
        }
    };

    const handleLeaveTournament = async (tournamentId: string) => {
        setLeavingTournament(tournamentId);
        try {
            await api.post(`/tournaments/${tournamentId}/leave`);
            fetchTournaments();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Erreur lors de la désinscription');
        } finally {
            setLeavingTournament(null);
        }
    };

    const getLevelLabel = (level: string) => {
        switch (level) {
            case 'DEBUTANT': return 'Débutant';
            case 'INTERMEDIAIRE': return 'Intermédiaire';
            case 'AVANCE': return 'Avancé';
            case 'EXPERT': return 'Expert';
            default: return level;
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    const coursePages = Math.ceil(courses.length / ITEMS_PER_PAGE);
    const tournamentPages = Math.ceil(tournaments.length / ITEMS_PER_PAGE);
    const paginatedCourses = courses.slice((coursePage - 1) * ITEMS_PER_PAGE, coursePage * ITEMS_PER_PAGE);
    const paginatedTournaments = tournaments.slice((tournamentPage - 1) * ITEMS_PER_PAGE, tournamentPage * ITEMS_PER_PAGE);

    return (
        <div className="space-y-8 sm:space-y-12 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-display font-black text-white italic uppercase tracking-tighter leading-none mb-3 sm:mb-4">
                        Progresser & <br /> <span className="text-padel-yellow">Se Dépasser</span>
                    </h1>
                    <div className="flex bg-white/5 rounded-xl sm:rounded-2xl p-1 sm:p-1.5 border border-white/10 w-fit">
                        <button
                            onClick={() => setActiveTab('COURS')}
                            className={cn(
                                "flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all",
                                activeTab === 'COURS' ? "bg-padel-blue text-white shadow-lg shadow-padel-blue/20" : "text-white/40 hover:text-white"
                            )}
                        >
                            <GraduationCap size={12} className="sm:w-[14px] sm:h-[14px]" /> Cours
                        </button>
                        <button
                            onClick={() => setActiveTab('TOURNOIS')}
                            className={cn(
                                "flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all",
                                activeTab === 'TOURNOIS' ? "bg-padel-blue text-white shadow-lg shadow-padel-blue/20" : "text-white/40 hover:text-white"
                            )}
                        >
                            <Trophy size={12} className="sm:w-[14px] sm:h-[14px]" /> Tournois
                        </button>
                    </div>
                </div>
                <div className="hidden sm:flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full bg-padel-blue border-4 border-[#0E0E11] flex items-center justify-center text-[10px] font-black">
                            {String.fromCharCode(65 + i)}
                        </div>
                    ))}
                    <div className="w-10 h-10 rounded-full bg-white/5 border-4 border-[#0E0E11] flex items-center justify-center text-[8px] font-black text-white/40">
                        +{courses.length + tournaments.length}
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'COURS' ? (
                    <motion.div
                        key="cours"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        {loadingCourses ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 size={40} className="text-padel-blue animate-spin" />
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Chargement des cours...</p>
                            </div>
                        ) : courses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white/[0.02] border border-white/5 rounded-2xl sm:rounded-[2.5rem]">
                                <GraduationCap size={48} className="text-white/10" />
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Aucun cours disponible</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {paginatedCourses.map((course, i) => {
                                        const isFull = course.currentParticipants >= course.maxParticipants;
                                        const spotsLeft = course.maxParticipants - course.currentParticipants;
                                        const isRegistered = user && course.participants?.includes(user._id);
                                        
                                        return (
                                            <motion.div
                                                key={course._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                whileHover={{ y: -5 }}
                                                className="bg-[#151518] border border-white/5 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 relative overflow-hidden group hover:border-padel-blue/20 transition-all"
                                            >
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-padel-blue/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-padel-blue/10 transition-all" />
                                                
                                                <div className="flex justify-between items-start mb-4 sm:mb-8">
                                                    <span className="px-2 sm:px-3 py-1 bg-padel-blue/10 border border-padel-blue/20 text-padel-blue text-[8px] sm:text-[9px] font-black uppercase tracking-wider sm:tracking-widest rounded-md">
                                                        {getLevelLabel(course.level)}
                                                    </span>
                                                    <span className="text-lg sm:text-xl font-black text-padel-yellow italic">{course.price}€</span>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="px-2 py-0.5 rounded bg-white/5 text-[7px] font-black text-white/40 uppercase">{course.sport}</span>
                                                </div>
                                                
                                                <h3 className="text-lg sm:text-2xl font-black text-white italic uppercase mb-4 sm:mb-6 tracking-tighter leading-tight group-hover:text-padel-yellow transition-colors">
                                                    {course.title}
                                                </h3>
                                                
                                                <div className="space-y-2 sm:space-y-4 mb-6 sm:mb-10">
                                                    <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-bold text-white/30 uppercase tracking-widest">
                                                        <Calendar size={12} className="text-padel-blue sm:w-[14px] sm:h-[14px]" /> 
                                                        {formatDate(course.date)} • {formatTime(course.date)}
                                                    </div>
                                                    <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-bold text-white/30 uppercase tracking-widest">
                                                        <Clock size={12} className="text-padel-blue sm:w-[14px] sm:h-[14px]" /> {course.duration} min
                                                    </div>
                                                    <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">
                                                        <Users size={12} className={cn("sm:w-[14px] sm:h-[14px]", isFull ? "text-red-500" : "text-padel-blue")} /> 
                                                        <span className={isFull ? "text-red-500/50" : "text-white/30"}>
                                                            {isFull ? 'Complet' : `${spotsLeft} place${spotsLeft > 1 ? 's' : ''}`}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-bold text-white/30 uppercase tracking-widest">
                                                        <Star size={12} className="text-padel-yellow sm:w-[14px] sm:h-[14px]" /> Coach : {course.coach}
                                                    </div>
                                                </div>
                                                
                                                {isRegistered ? (
                                                    <div className="flex gap-2">
                                                        <div className="flex-1 py-3 sm:py-5 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center gap-2">
                                                            <Check size={14} /> Inscrit
                                                        </div>
                                                        <button
                                                            onClick={() => handleLeaveCourse(course._id)}
                                                            disabled={leavingCourse === course._id}
                                                            className="px-4 sm:px-5 py-3 sm:py-5 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                                                        >
                                                            {leavingCourse === course._id ? (
                                                                <Loader2 size={14} className="animate-spin" />
                                                            ) : (
                                                                <X size={14} />
                                                            )}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button 
                                                        onClick={() => !isFull && handleJoinCourse(course._id)}
                                                        disabled={isFull || joiningCourse === course._id}
                                                        className={cn(
                                                            "w-full py-3 sm:py-5 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between px-4 sm:px-6",
                                                            courseSuccess === course._id ? "bg-green-500/20 border border-green-500/30 text-green-500" :
                                                            isFull ? "bg-white/[0.02] border border-white/5 text-white/20 cursor-not-allowed" : 
                                                            "bg-padel-blue text-white shadow-xl shadow-padel-blue/10 hover:scale-[1.02] disabled:opacity-50"
                                                        )}
                                                    >
                                                        {courseSuccess === course._id ? (
                                                            <><CheckCircle2 size={14} /> Inscrit !</>
                                                        ) : joiningCourse === course._id ? (
                                                            <><Loader2 size={14} className="animate-spin" /> Inscription...</>
                                                        ) : isFull ? (
                                                            <>Liste d'attente</>
                                                        ) : (
                                                            <>S'inscrire</>
                                                        )}
                                                        <ChevronRight size={14} className="sm:w-4 sm:h-4" />
                                                    </button>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Pagination */}
                                {coursePages > 1 && (
                                    <div className="flex items-center justify-center gap-2 sm:gap-3 pt-4">
                                        <button
                                            onClick={() => setCoursePage(p => Math.max(1, p - 1))}
                                            disabled={coursePage === 1}
                                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all disabled:opacity-30"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        {Array.from({ length: coursePages }, (_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCoursePage(i + 1)}
                                                className={cn(
                                                    "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl text-[10px] font-black transition-all",
                                                    coursePage === i + 1 ? "bg-padel-blue text-white shadow-lg shadow-padel-blue/30" : "bg-white/5 border border-white/10 text-white/40 hover:text-white"
                                                )}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setCoursePage(p => Math.min(coursePages, p + 1))}
                                            disabled={coursePage === coursePages}
                                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all disabled:opacity-30"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="tournois"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6 sm:space-y-8"
                    >
                        {loadingTournaments ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 size={40} className="text-padel-yellow animate-spin" />
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Chargement des tournois...</p>
                            </div>
                        ) : tournaments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white/[0.02] border border-white/5 rounded-2xl sm:rounded-[2.5rem]">
                                <Trophy size={48} className="text-white/10" />
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Aucun tournoi à venir</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {paginatedTournaments.map((tourney, i) => {
                                        const isFull = tourney.currentTeams >= tourney.maxTeams;
                                        const deadlinePassed = new Date(tourney.registrationDeadline) < new Date();
                                        const isRegistered = user && tourney.participants?.includes(user._id);
                                        const canJoin = !isFull && !deadlinePassed && !isRegistered && tourney.status === 'UPCOMING';
                                        const spotsLeft = tourney.maxTeams - tourney.currentTeams;
                                        
                                        return (
                                            <motion.div
                                                key={tourney._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                whileHover={{ y: -5 }}
                                                className="bg-[#151518] border border-white/5 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 relative overflow-hidden group hover:border-padel-yellow/20 transition-all flex flex-col"
                                            >
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-padel-yellow/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-padel-yellow/10 transition-all" />
                                                
                                                {/* Header */}
                                                <div className="flex justify-between items-start mb-4 sm:mb-6">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="px-2 sm:px-3 py-1 bg-padel-yellow/10 border border-padel-yellow/20 text-padel-yellow text-[8px] sm:text-[9px] font-black uppercase tracking-wider sm:tracking-widest rounded-md">
                                                            {tourney.level}
                                                        </span>
                                                        {tourney.status === 'ONGOING' && (
                                                            <span className="px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-green-500 text-[7px] sm:text-[8px] font-black uppercase tracking-widest animate-pulse">
                                                                En cours
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-padel-yellow rounded-xl sm:rounded-2xl flex items-center justify-center text-padel-blue shadow-lg group-hover:scale-110 transition-transform shrink-0">
                                                        <Trophy size={20} className="sm:w-6 sm:h-6" />
                                                    </div>
                                                </div>
                                                
                                                {/* Title */}
                                                <h3 className="text-lg sm:text-xl font-black text-white italic uppercase mb-4 sm:mb-6 tracking-tighter leading-tight group-hover:text-padel-yellow transition-colors line-clamp-2">
                                                    {tourney.name}
                                                </h3>
                                                
                                                {/* Info */}
                                                <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 flex-1">
                                                    <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-bold text-white/30 uppercase tracking-widest">
                                                        <Calendar size={12} className="text-padel-yellow sm:w-[14px] sm:h-[14px]" /> 
                                                        {formatDate(tourney.startDate)}
                                                        {tourney.endDate !== tourney.startDate && ` → ${formatDate(tourney.endDate)}`}
                                                    </div>
                                                    <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">
                                                        <Users size={12} className={cn("sm:w-[14px] sm:h-[14px]", isFull ? "text-red-500" : "text-padel-yellow")} /> 
                                                        <span className={isFull ? "text-red-500/50" : "text-white/30"}>
                                                            {isFull ? 'Complet' : `${spotsLeft} place${spotsLeft > 1 ? 's' : ''} restante${spotsLeft > 1 ? 's' : ''}`}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-bold text-white/30 uppercase tracking-widest">
                                                        <Medal size={12} className="text-padel-yellow sm:w-[14px] sm:h-[14px]" /> 
                                                        Gain : <span className="text-padel-yellow font-black">{tourney.prize}</span>
                                                    </div>
                                                    {tourney.entryFee > 0 && (
                                                        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-bold text-white/30 uppercase tracking-widest">
                                                            <Target size={12} className="text-padel-blue sm:w-[14px] sm:h-[14px]" /> 
                                                            Inscription : {tourney.entryFee}€
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Progress bar */}
                                                <div className="mb-6 sm:mb-8">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Remplissage</span>
                                                        <span className="text-[10px] font-black text-white/40">{tourney.currentTeams}/{tourney.maxTeams}</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(tourney.currentTeams / tourney.maxTeams) * 100}%` }}
                                                            className={cn(
                                                                "h-full rounded-full",
                                                                isFull ? "bg-red-500" : "bg-padel-yellow"
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                
                                                {/* Button */}
                                                {isRegistered && !deadlinePassed ? (
                                                    <div className="flex gap-2">
                                                        <div className="flex-1 py-3 sm:py-5 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center gap-2">
                                                            <Check size={14} /> Inscrit
                                                        </div>
                                                        <button
                                                            onClick={() => handleLeaveTournament(tourney._id)}
                                                            disabled={leavingTournament === tourney._id}
                                                            className="px-4 sm:px-5 py-3 sm:py-5 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                                                        >
                                                            {leavingTournament === tourney._id ? (
                                                                <Loader2 size={14} className="animate-spin" />
                                                            ) : (
                                                                <X size={14} />
                                                            )}
                                                        </button>
                                                    </div>
                                                ) : isRegistered && deadlinePassed ? (
                                                    <div className="w-full py-3 sm:py-5 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center gap-2">
                                                        <Check size={14} /> Inscrit
                                                    </div>
                                                ) : (
                                                    <button 
                                                        onClick={() => canJoin && handleJoinTournament(tourney._id)}
                                                        disabled={!canJoin || joiningTournament === tourney._id}
                                                        className={cn(
                                                            "w-full py-3 sm:py-5 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between px-4 sm:px-6",
                                                            tournamentSuccess === tourney._id ? "bg-green-500/20 border border-green-500/30 text-green-500" :
                                                            !canJoin ? "bg-white/[0.02] border border-white/5 text-white/20 cursor-not-allowed" :
                                                            "bg-padel-yellow text-padel-blue shadow-xl shadow-padel-yellow/10 hover:scale-[1.02]"
                                                        )}
                                                    >
                                                        {tournamentSuccess === tourney._id ? (
                                                            <><CheckCircle2 size={14} /> Inscrit !</>
                                                        ) : joiningTournament === tourney._id ? (
                                                            <><Loader2 size={14} className="animate-spin" /> Inscription...</>
                                                        ) : isFull ? (
                                                            <>Complet</>
                                                        ) : deadlinePassed ? (
                                                            <>Inscriptions closes</>
                                                        ) : tourney.status === 'ONGOING' ? (
                                                            <>En cours</>
                                                        ) : (
                                                            <>Participer</>
                                                        )}
                                                        <ChevronRight size={14} className="sm:w-4 sm:h-4" />
                                                    </button>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Pagination */}
                                {tournamentPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 sm:gap-3 pt-4">
                                        <button
                                            onClick={() => setTournamentPage(p => Math.max(1, p - 1))}
                                            disabled={tournamentPage === 1}
                                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all disabled:opacity-30"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        {Array.from({ length: tournamentPages }, (_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setTournamentPage(i + 1)}
                                                className={cn(
                                                    "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl text-[10px] font-black transition-all",
                                                    tournamentPage === i + 1 ? "bg-padel-blue text-white shadow-lg shadow-padel-blue/30" : "bg-white/5 border border-white/10 text-white/40 hover:text-white"
                                                )}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setTournamentPage(p => Math.min(tournamentPages, p + 1))}
                                            disabled={tournamentPage === tournamentPages}
                                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all disabled:opacity-30"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
