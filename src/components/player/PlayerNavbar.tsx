import React, { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
    User,
    LogOut,
    Menu,
    X,
    LayoutDashboard,
    Calendar,
    History,
    Trophy,
    Ticket,
    CreditCard,
    Sparkles,
    Shield,
    ChevronDown,
    ArrowRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export function PlayerNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Handle scroll effect
    React.useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: 'Tableau de Bord', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Réserver', href: '/book', icon: Calendar },
        { label: 'Mes Matchs', href: '/my-reservations', icon: History },
        { label: 'Tournois', href: '/events', icon: Trophy },
        { label: 'Abonnement', href: '/subscription', icon: Ticket },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/auth');
    };

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 mb-12",
            scrolled ? "py-4" : "py-6"
        )}>
            <div className="max-w-7xl mx-auto px-6">
                <div className={cn(
                    "relative flex items-center justify-between px-6 h-20 rounded-[2rem] border transition-all duration-500",
                    scrolled
                        ? "bg-[#0E0E11]/80 backdrop-blur-2xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                        : "bg-white/[0.02] border-white/5 backdrop-blur-md"
                )}>
                    {/* Background Shimmer */}
                    <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
                    </div>

                    {/* Logo Section */}
                    <div className="flex items-center shrink-0">
                        <Link to="/" className="relative group">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="relative z-10"
                            >
                                <img
                                    src="/IMAGES/logo_tr.png"
                                    alt="Logo"
                                    className="h-12 scale-200 w-auto drop-shadow-[0_0_15px_rgba(19,73,211,0.3)] transition-transform duration-500"
                                />
                            </motion.div>
                            <div className="absolute inset-0 bg-padel-blue/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </Link>
                    </div>

                    {/* Desktop Menu - Centered */}
                    <div className="hidden lg:flex items-center gap-0 absolute left-1/2 -translate-x-1/2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    className={cn(
                                        "relative px-3 py-2 group overflow-hidden transition-all",
                                        location.pathname === link.href ? "text-white" : "text-white/40 hover:text-white/80"
                                    )}
                                >
                                    <div className="relative z-10 flex items-center gap-2">
                                        <link.icon size={16} className={cn(
                                            "transition-colors",
                                            location.pathname === link.href ? "text-padel-blue" : "text-current"
                                        )} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.15em] italic whitespace-nowrap">
                                            {link.label}
                                        </span>
                                    </div>
                                    {location.pathname === link.href && (
                                        <motion.div
                                            layoutId="nav-active"
                                            className="absolute inset-0 bg-white/[0.05] rounded-xl border border-white/10"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-padel-blue group-hover:w-full transition-all duration-500 opacity-50" />
                                </Link>
                            ))}
                        </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2">
                        {/* Admin Shortcut */}
                        {user?.role === 'ADMIN' && (
                            <Link
                                to="/admin"
                                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-padel-blue/10 border border-padel-blue/20 text-padel-blue hover:bg-padel-blue hover:text-white transition-all duration-500 group"
                            >
                                <Shield size={14} className="group-hover:rotate-12 transition-transform" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Administration</span>
                            </Link>
                        )}

                        {/* User Profile Hook */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-500",
                                    showProfileMenu ? "bg-white/10" : "bg-white/[0.03] hover:bg-white/5 border border-white/5"
                                )}
                            >
                                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white/60">
                                    <User size={18} />
                                </div>
                                <span className="text-[11px] font-black text-white uppercase tracking-wider hidden sm:block">
                                    {user?.name?.split(' ')[0] || 'Joueur'}
                                </span>
                                <ChevronDown size={14} className={cn(
                                    "text-white/30 transition-transform duration-500 hidden sm:block",
                                    showProfileMenu && "rotate-180 text-white"
                                )} />
                            </button>

                            <AnimatePresence>
                                {showProfileMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                        className="absolute top-[calc(100%+8px)] right-0 w-64 bg-[#0E0E11]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-3 shadow-[0_25px_80px_rgba(0,0,0,0.8)] z-[200] overflow-hidden"
                                    >
                                        {/* Dropdown Header */}
                                        <div className="relative p-3 mb-3 rounded-xl bg-white/[0.03] border border-white/5 overflow-hidden">
                                            <div className="absolute -top-12 -right-12 w-24 h-24 bg-padel-blue/10 rounded-full blur-2xl" />
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-padel-blue shadow-lg flex items-center justify-center text-white font-black text-lg italic border border-white/20">
                                                    {user?.name?.charAt(0) || 'P'}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-black text-white truncate uppercase italic tracking-tight">{user?.name || 'Nom Joueur'}</p>
                                                    <p className="text-[10px] text-white/30 font-bold truncate tracking-wider">{user?.email || 'email@exemple.com'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dropdown Items */}
                                        <div className="space-y-0.5">
                                            <button
                                                onClick={() => { navigate('/profile'); setShowProfileMenu(false); }}
                                                className="w-full text-left px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center gap-3 group"
                                            >
                                                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-padel-blue/20 group-hover:text-padel-blue transition-all">
                                                    <User size={14} />
                                                </div>
                                                Mon Profil
                                            </button>
                                            <button
                                                onClick={() => { navigate('/ranking'); setShowProfileMenu(false); }}
                                                className="w-full text-left px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center gap-3 group"
                                            >
                                                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-padel-yellow/20 group-hover:text-padel-yellow transition-all">
                                                    <Trophy size={14} />
                                                </div>
                                                Niveau & Classement
                                            </button>

                                            <div className="h-2" />

                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-red-500/80 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-3 group border border-transparent hover:border-red-500/20"
                                            >
                                                <div className="w-7 h-7 rounded-lg bg-red-500/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <LogOut size={14} />
                                                </div>
                                                Déconnexion
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden w-11 h-11 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-95"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
                        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        className="fixed inset-0 top-[100px] z-50 bg-black/60 lg:hidden px-6 pb-20 overflow-y-auto"
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="grid grid-cols-2 gap-4 pt-10"
                        >
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "relative flex flex-col items-center gap-4 p-8 rounded-[2rem] border transition-all duration-300 group overflow-hidden",
                                        location.pathname === link.href
                                            ? "bg-padel-blue border-padel-blue text-white shadow-2xl shadow-padel-blue/40"
                                            : "bg-[#0E0E11]/80 border-white/10 text-white/40"
                                    )}
                                >
                                    <div className={cn(
                                        "p-3 rounded-xl transition-all group-hover:scale-110 group-hover:rotate-6",
                                        location.pathname === link.href ? "bg-white/20 shadow-inner" : "bg-white/5"
                                    )}>
                                        <link.icon size={28} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] font-display text-center leading-tight italic">
                                        {link.label}
                                    </span>
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-white/10 transition-all pointer-events-none" />
                                </Link>
                            ))}
                        </motion.div>

                        <div className="mt-8 space-y-4 pb-20">
                            {user?.role === 'ADMIN' && (
                                <Link
                                    to="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full flex items-center justify-between p-6 rounded-[2rem] bg-padel-blue/10 border border-padel-blue/20 text-padel-blue"
                                >
                                    <div className="flex items-center gap-4">
                                        <Shield size={20} />
                                        <span className="text-xs font-black uppercase tracking-widest italic">Administration</span>
                                    </div>
                                    <ArrowRight size={18} />
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-between p-6 rounded-[2rem] bg-red-500/10 border border-red-500/20 text-red-500"
                            >
                                <div className="flex items-center gap-4">
                                    <LogOut size={20} />
                                    <span className="text-xs font-black uppercase tracking-widest italic">Déconnexion</span>
                                </div>
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
