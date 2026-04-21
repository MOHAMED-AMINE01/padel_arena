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
    ArrowRight,
    MessageSquare,
    Zap
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
        { label: 'Abonnement', href: '/subscription', icon: Sparkles },
        { label: 'Portefeuille', href: '/wallet', icon: Zap },
        { label: 'Support', href: '/messages', icon: MessageSquare },
    ];

    const handleLogout = async () => {
        setIsOpen(false);
        setShowProfileMenu(false);
        await logout();
    };

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 mb-12",
            scrolled ? "py-4" : "py-6"
        )}>
            <div className="max-w-7xl mx-auto px-6">
                <div className={cn(
                    "relative flex items-center justify-between px-4 transition-all duration-700 border",
                    scrolled
                        ? "bg-[#0E0E11]/95 backdrop-blur-3xl border-white/15 shadow-[0_30px_100px_rgba(0,0,0,0.9)] h-16 rounded-[2rem]"
                        : "bg-white/[0.04] border-white/10 backdrop-blur-xl h-20 rounded-[2.5rem]"
                )}>
                    {/* Background Shimmer */}
                    <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
                    </div>

                    {/* Logo Section */}
                    <div className="flex items-center shrink-0">
                        <Link to="/" className="relative group">
                            <motion.div whileHover={{ scale: 1.05 }} className="relative z-10">
                                <img
                                    src="/IMAGES/newLogo_tr.png"
                                    alt="Logo"
                                    className={cn(
                                        "w-auto transition-all duration-700 drop-shadow-[0_0_15px_rgba(19,73,211,0.3)]",
                                        scrolled ? "h-10" : "h-14"
                                    )}
                                />
                            </motion.div>
                            <div className="absolute inset-0 bg-padel-blue/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        </Link>
                    </div>

                    {/* Navigation - Ultra Compact */}
                    <div className="hidden lg:flex items-center flex-1 justify-center px-4">
                        <div className="flex items-center gap-0.5 bg-white/[0.02] border border-white/5 p-1 rounded-2xl">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.href;
                                const isWallet = link.href === '/wallet';

                                return (
                                    <Link
                                        key={link.href}
                                        to={link.href}
                                        className={cn(
                                            "relative px-3 xxl:px-4 py-2 group transition-all duration-500 rounded-xl flex items-center gap-2",
                                            isActive ? "text-white" : "text-white/30 hover:text-white/70"
                                        )}
                                    >
                                        <div className="relative z-10 flex items-center gap-2">
                                            <link.icon size={13} className={cn(
                                                "transition-colors duration-500",
                                                isActive ? "text-padel-blue" : "group-hover:text-padel-blue/60"
                                            )} />
                                            <span className="text-[8.5px] xxl:text-[9.5px] font-black uppercase tracking-[0.15em] italic whitespace-nowrap">
                                                {link.label}
                                            </span>
                                            {isWallet && user && (
                                                <span className="px-1.5 py-0.5 rounded-full bg-padel-blue/20 text-padel-blue text-[8px] font-black border border-padel-blue/30">
                                                    {user.balance || 0}€
                                                </span>
                                            )}
                                        </div>
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-active-pill"
                                                className="absolute inset-0 bg-white/[0.08] border border-white/10"
                                                style={{ borderRadius: '0.75rem' }}
                                                transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Profile Section */}
                    <div className="flex items-center shrink-0 gap-2">
                        <div className="relative hidden lg:block">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className={cn(
                                    "flex items-center gap-2.5 px-3 py-1.5 rounded-2xl transition-all duration-700 relative overflow-hidden group border",
                                    showProfileMenu 
                                        ? "bg-padel-blue text-white shadow-lg" 
                                        : "bg-white/[0.03] hover:bg-white/[0.08] border-white/5"
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-700",
                                    showProfileMenu ? "bg-white text-padel-blue" : "bg-white/10 text-white/40 group-hover:text-padel-blue"
                                )}>
                                    <User size={14} />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest hidden xl:block">
                                    {user?.name?.split(' ')[0] || 'Joueur'}
                                </span>
                                <ChevronDown size={12} className={cn(
                                    "transition-all duration-700 opacity-30",
                                    showProfileMenu && "rotate-180 opacity-100"
                                )} />
                            </button>

                            <AnimatePresence>
                                {showProfileMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                        className="absolute top-[calc(100%+8px)] right-0 w-60 bg-[#0E0E11]/98 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-[200]"
                                    >
                                        <div className="space-y-0.5">
                                            <button
                                                onClick={() => { navigate('/profile'); setShowProfileMenu(false); }}
                                                className="w-full text-left px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center gap-3"
                                            >
                                                <User size={13} />
                                                Mon Profil
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-red-500/80 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-3"
                                            >
                                                <LogOut size={13} />
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
                            className="lg:hidden w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/60"
                        >
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
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
