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
import { PromoCodeInput } from '../../components/player/PromoCodeInput';

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
    const [activeTab, setActiveTab] = useState<'PROGRAMMES' | 'EVENEMENTS'>('PROGRAMMES');

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

    // Promo codes mapping
    const [promos, setPromos] = useState<{ [id: string]: { code: string, discount: number } }>({});

    const setEventPromo = (id: string, code: string, discount: number) => {
        setPromos(prev => ({ ...prev, [id]: { code, discount } }));
    };

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
            const res = await api.post(`/courses/${courseId}/join`, { promoCode: promos[courseId]?.code });
            
            if (res.data.requiresPayment && res.data.url) {
                window.location.href = res.data.url;
                return;
            }

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
            const res = await api.post(`/tournaments/${tournamentId}/join`, { promoCode: promos[tournamentId]?.code });
            
            if (res.data.requiresPayment && res.data.url) {
                window.location.href = res.data.url;
                return;
            }

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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 md:space-y-12 pb-10"
        >
            {/* Header / Hero Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-padel-blue/10 border border-padel-blue/20 flex items-center justify-center">
                            <Trophy className="text-padel-blue" size={20} />
                        </div>
                        <span className="text-[10px] font-black text-padel-blue uppercase tracking-[0.4em]">Circuit Officiel</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                        Expérience <br />
                        <span className="text-padel-blue drop-shadow-[0_0_30px_rgba(19,73,211,0.3)]">Compétition & Elite</span>
                    </h1>
                    <p className="text-xs font-bold text-white/30 uppercase tracking-[0.3em] max-w-lg">
                        Inscrivez-vous aux tournois homologués et aux programmes d'entraînement intensifs pour propulser votre classement.
                    </p>
                </div>

                {/* Tactical Tabs */}
                <div className="flex bg-white/5 backdrop-blur-md rounded-2xl p-1.5 border border-white/10 w-fit">
                    <button
                        onClick={() => setActiveTab('PROGRAMMES')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            activeTab === 'PROGRAMMES' ? "bg-padel-blue text-white shadow-xl shadow-padel-blue/20" : "text-white/40 hover:text-white"
                        )}
                    >
                        <GraduationCap size={14} /> Académie
                    </button>
                    <button
                        onClick={() => setActiveTab('EVENEMENTS')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            activeTab === 'EVENEMENTS' ? "bg-padel-blue text-white shadow-xl shadow-padel-blue/20" : "text-white/40 hover:text-white"
                        )}
                    >
                        <Trophy size={14} /> Événements
                    </button>
                </div>
            </div>

            {/* Active Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'PROGRAMMES' ? (
                    <motion.div
                        key="programmes"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        {loadingCourses ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                                <Loader2 className="animate-spin text-padel-blue" size={40} />
                                <p className="text-[10px] font-black text-white uppercase tracking-widest">Séquençage des programmes...</p>
                            </div>
                        ) : courses.length === 0 ? (
                            <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-[2.5rem]">
                                <GraduationCap size={48} className="text-white/10 mx-auto mb-6" />
                                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">Aucun programme actif</h3>
                                <p className="text-[10px] text-white/20 uppercase tracking-widest">Revenez bientôt pour de nouveaux cours Elite.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {paginatedCourses.map((course, i) => {
                                    const isEnrolled = course.participants.includes(user?._id || '');
                                    const isFull = course.currentParticipants >= course.maxParticipants;

                                    return (
                                        <motion.div
                                            key={course._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="group bg-[#151518]/60 backdrop-blur-2xl border border-white/5 rounded-[2rem] overflow-hidden hover:border-padel-blue/20 transition-all duration-500 shadow-2xl flex flex-col"
                                        >
                                            <div className="p-8 space-y-6 flex-1 flex flex-col">
                                                <div className="flex justify-between items-start">
                                                    <div className="px-3 py-1 rounded-full bg-padel-blue/10 border border-padel-blue/20 text-[8px] font-black text-padel-blue uppercase tracking-widest">
                                                        {course.sport} • {getLevelLabel(course.level)}
                                                    </div>
                                                    {isEnrolled && (
                                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/20 text-[8px] font-black text-green-500 uppercase tracking-widest">
                                                            <Check size={10} /> Inscrit
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 group-hover:text-padel-blue transition-colors">
                                                        {course.title}
                                                    </h3>
                                                    <p className="text-xs text-white/40 line-clamp-2 italic font-medium">
                                                        {course.description}
                                                    </p>
                                                </div>

                                                <div className="space-y-3 pt-2">
                                                    <div className="flex items-center gap-3 text-[10px] font-bold text-white/60 uppercase tracking-widest">
                                                        <Calendar size={14} className="text-padel-blue" />
                                                        {formatDate(course.date)} @ {formatTime(course.date)}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-[10px] font-bold text-white/60 uppercase tracking-widest">
                                                        <Users size={14} className="text-padel-blue" />
                                                        Coach: {course.coach}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-[10px] font-bold text-white/60 uppercase tracking-widest">
                                                        <Clock size={14} className="text-padel-blue" />
                                                        Durée: {course.duration} min
                                                    </div>
                                                </div>

                                                <div className="space-y-2 mt-auto pt-6 border-t border-white/5">
                                                    <div className="flex justify-between items-end mb-1">
                                                        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest italic">Slot Availability</p>
                                                        <p className="text-[10px] font-black text-white">{course.currentParticipants}/{course.maxParticipants}</p>
                                                    </div>
                                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(course.currentParticipants / course.maxParticipants) * 100}%` }}
                                                            className={cn("h-full rounded-full transition-all", isFull ? "bg-red-500" : "bg-padel-blue")}
                                                        />
                                                    </div>
                                                </div>

                                                {!isEnrolled && (
                                                    <div className="mt-4">
                                                        <PromoCodeInput
                                                            eventId={course._id}
                                                            originalPrice={course.price}
                                                            onApply={(discount, code) => setEventPromo(course._id, code, discount)}
                                                        />
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() => isEnrolled ? handleLeaveCourse(course._id) : handleJoinCourse(course._id)}
                                                    disabled={joiningCourse === course._id || leavingCourse === course._id || (!isEnrolled && isFull)}
                                                    className={cn(
                                                        "w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 mt-6 shadow-xl",
                                                        isEnrolled
                                                            ? "bg-white/5 border border-white/10 text-white/40 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
                                                            : isFull
                                                                ? "bg-white/[0.02] border border-white/5 text-white/10 cursor-not-allowed"
                                                                : "bg-padel-blue text-white hover:bg-padel-yellow hover:text-padel-blue shadow-padel-blue/20"
                                                    )}
                                                >
                                                    {joiningCourse === course._id || leavingCourse === course._id ? (
                                                        <Loader2 className="animate-spin" size={14} />
                                                    ) : isEnrolled ? (
                                                        <>SE DÉSINSCRIRE</>
                                                    ) : isFull ? (
                                                        <>COMPLET</>
                                                    ) : (
                                                        <>REJOINDRE • {promos[course._id] ? (course.price - promos[course._id].discount).toFixed(0) : course.price}€</>
                                                    )}
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}

                        {coursePages > 1 && (
                            <div className="flex justify-center items-center gap-4 pt-8">
                                <button
                                    disabled={coursePage === 1}
                                    onClick={() => setCoursePage(prev => Math.max(1, prev - 1))}
                                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all disabled:opacity-30"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Page {coursePage} / {coursePages}</span>
                                <button
                                    disabled={coursePage === coursePages}
                                    onClick={() => setCoursePage(prev => Math.min(coursePages, prev + 1))}
                                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all disabled:opacity-30"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="evenements"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        {loadingTournaments ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                                <Loader2 className="animate-spin text-padel-blue" size={40} />
                                <p className="text-[10px] font-black text-white uppercase tracking-widest">Scanning Arena satellites...</p>
                            </div>
                        ) : tournaments.length === 0 ? (
                            <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-[2.5rem]">
                                <Trophy size={48} className="text-white/10 mx-auto mb-6" />
                                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">Aucun tournoi disponible</h3>
                                <p className="text-[10px] text-white/20 uppercase tracking-widest">Les prochaines compétitions arrivent bientôt.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {paginatedTournaments.map((tourney, i) => {
                                    const isEnrolled = tourney.participants.includes(user?._id || '');
                                    const isFull = tourney.currentTeams >= tourney.maxTeams;

                                    return (
                                        <motion.div
                                            key={tourney._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="group bg-[#151518]/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-padel-yellow/20 transition-all duration-500 shadow-2xl flex flex-col"
                                        >
                                            {/* Preview Image */}
                                            <div className="relative h-48 overflow-hidden bg-white/5">
                                                {tourney.image ? (
                                                    <img src={tourney.image} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-padel-blue/20 to-padel-yellow/10">
                                                        <Trophy size={48} className="text-padel-yellow/20" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#151518] to-transparent opacity-80" />
                                                <div className="absolute top-6 left-6 flex flex-col gap-2">
                                                    <div className="px-3 py-1 rounded-full bg-padel-yellow/20 backdrop-blur-md border border-padel-yellow/20 text-[8px] font-black text-padel-yellow uppercase tracking-widest">
                                                        {tourney.level} • {tourney.maxTeams} Teams
                                                    </div>
                                                    {isEnrolled && (
                                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 backdrop-blur-md border border-green-500/20 text-[8px] font-black text-green-500 uppercase tracking-widest">
                                                            <Check size={10} /> Équipe Inscrite
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="absolute top-6 right-6">
                                                    <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-padel-yellow shadow-2xl">
                                                        <Target size={16} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-8 space-y-6 flex-1 flex flex-col">
                                                <div>
                                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 group-hover:text-padel-yellow transition-colors leading-tight">
                                                        {tourney.name}
                                                    </h3>
                                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-4">
                                                        {formatDate(tourney.startDate)} - {formatDate(tourney.endDate)}
                                                    </p>
                                                    <p className="text-xs text-white/40 line-clamp-2 italic font-medium">
                                                        {tourney.description}
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                                    <div className="space-y-1">
                                                        <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em] italic">Entry Fee</span>
                                                        <p className="text-lg font-black text-white">{tourney.entryFee}€</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em] italic">Prize Pool</span>
                                                        <p className="text-lg font-black text-padel-yellow drop-shadow-[0_0_10px_rgba(255,210,31,0.3)]">{tourney.prize.split(' ')[0]}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 mt-auto">
                                                    <div className="flex justify-between items-end mb-1">
                                                        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Slot Availability</p>
                                                        <p className="text-[10px] font-black text-white">{tourney.currentTeams}/{tourney.maxTeams}</p>
                                                    </div>
                                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(tourney.currentTeams / tourney.maxTeams) * 100}%` }}
                                                            className={cn("h-full rounded-full", isFull ? "bg-red-500" : "bg-padel-yellow")}
                                                        />
                                                    </div>
                                                </div>

                                                {!isEnrolled && (
                                                    <div className="mt-4">
                                                        <PromoCodeInput
                                                            eventId={tourney._id}
                                                            originalPrice={tourney.entryFee}
                                                            onApply={(discount, code) => setEventPromo(tourney._id, code, discount)}
                                                        />
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() => isEnrolled ? handleLeaveTournament(tourney._id) : handleJoinTournament(tourney._id)}
                                                    disabled={joiningTournament === tourney._id || leavingTournament === tourney._id || (!isEnrolled && isFull)}
                                                    className={cn(
                                                        "w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 mt-6 shadow-2xl",
                                                        isEnrolled
                                                            ? "bg-white/5 border border-white/10 text-white/40 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 shadow-none"
                                                            : isFull
                                                                ? "bg-white/[0.02] border border-white/5 text-white/10 cursor-not-allowed shadow-none"
                                                                : "bg-padel-yellow text-padel-blue hover:scale-[1.02] active:scale-95 shadow-padel-yellow/20"
                                                    )}
                                                >
                                                    {joiningTournament === tourney._id || leavingTournament === tourney._id ? (
                                                        <Loader2 className="animate-spin" size={16} />
                                                    ) : isEnrolled ? (
                                                        <>QUITTER L'INSCRIPTION</>
                                                    ) : isFull ? (
                                                        <>TOURNOI COMPLET</>
                                                    ) : (
                                                        <>S'INSCRIRE • {promos[tourney._id] ? (tourney.entryFee - promos[tourney._id].discount).toFixed(0) : tourney.entryFee}€</>
                                                    )}
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}

                        {tournamentPages > 1 && (
                            <div className="flex justify-center items-center gap-4 pt-8">
                                <button
                                    disabled={tournamentPage === 1}
                                    onClick={() => setTournamentPage(prev => Math.max(1, prev - 1))}
                                    className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all disabled:opacity-30"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Page {tournamentPage} / {tournamentPages}</span>
                                <button
                                    disabled={tournamentPage === tournamentPages}
                                    onClick={() => setTournamentPage(prev => Math.min(tournamentPages, prev + 1))}
                                    className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all disabled:opacity-30"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
