import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    LayoutDashboard,
    Building2,
    Users,
    CalendarCheck2,
    CreditCard,
    Ticket,
    BarChart3,
    Settings,
    ShieldAlert,
    LogOut,
    ChevronLeft,
    X,
    Sparkles,
    Receipt,
    Mail,
    Target,
    ClipboardList,
    CalendarDays,
    Wallet,
    BadgePercent,
    Newspaper,
    Zap,
    Medal,
    MessageSquare
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

interface SidebarItemProps {
    icon: any;
    label: string;
    href: string;
    active?: boolean;
    collapsed?: boolean;
    key?: string | number;
}

const SidebarItem = ({ icon: Icon, label, href, active, collapsed }: SidebarItemProps) => (
    <Link to={href} className="block w-full">
        <motion.div
            whileHover={{ x: collapsed ? 0 : 6 }}
            className={cn(
                "flex items-center rounded-2xl transition-all duration-500 group relative overflow-hidden",
                collapsed
                    ? "justify-center w-14 h-14 mx-auto"
                    : "gap-4 px-5 py-3.5",
                active
                    ? "bg-padel-blue text-white shadow-lg shadow-padel-blue/30"
                    : "text-white/30 hover:text-white hover:bg-white/5"
            )}
        >
            {active && (
                <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 bg-gradient-to-r from-padel-blue to-blue-600 -z-10"
                />
            )}

            <Icon size={collapsed ? 24 : 22} className={cn(
                "transition-all duration-500",
                active ? "scale-110 text-white" : "group-hover:scale-110 group-hover:text-padel-yellow"
            )} />

            {!collapsed && (
                <span className={cn(
                    "text-[11px] font-black uppercase tracking-[0.2em] transition-all",
                    active ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                )}>
                    {label}
                </span>
            )}

            {active && !collapsed && (
                <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-padel-blue animate-pulse" />
            )}
        </motion.div>
    </Link>
);

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN_CLUB';

export const AdminSidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen, role = 'SUPER_ADMIN' }: {
    collapsed: boolean;
    setCollapsed: (v: boolean) => void;
    mobileOpen: boolean;
    setMobileOpen: (v: boolean) => void;
    role?: AdminRole;
}) => {
    const location = useLocation();
    const { user: authUser, logout } = useAuth();

    // Prepare profile data
    const user = {
        name: authUser?.name || 'M. Amine',
        initials: authUser?.name
            ? authUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
            : 'EM'
    };

    const managerMenu = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
        { icon: Users, label: 'Adhérents', href: '/admin/users' },
        { icon: CalendarCheck2, label: 'Réservations', href: '/admin/reservations' },
        { icon: Mail, label: 'Boîte Mail', href: '/admin/mailbox' },
        { icon: Sparkles, label: 'Newsletter', href: '/admin/newsletter' },
        { icon: Target, label: 'Terrains', href: '/admin/courts' },
        { icon: ClipboardList, label: 'Programmes', href: '/admin/courses' },
        { icon: CalendarDays, label: 'Événements', href: '/admin/tournaments' },
        { icon: MessageSquare, label: 'Témoignages', href: '/admin/testimonials' },
        { icon: Medal, label: 'Équipe Arena', href: '/admin/team' },
        { icon: Wallet, label: 'Paiements', href: '/admin/payments' },
        { icon: BadgePercent, label: 'Codes Promo', href: '/admin/promo-codes' },
        { icon: Newspaper, label: 'Actualités', href: '/admin/news' },
        { icon: Receipt, label: 'Tarifs', href: '/admin/plans' },
        { icon: Wallet, label: 'Cartes d\'achat', href: '/admin/wallet-packs' },
    ];

    const handleLogout = async () => {
        if (setMobileOpen) setMobileOpen(false);
        await logout();
    };

    const renderSidebarContent = (isMobile: boolean = false) => (
        <div className="flex flex-col h-full py-0 pb-10 px-0">
            {/* Header / Logo */}
            <div className={cn(
                "px-8 mb-5 flex items-center justify-between",
                (collapsed && !isMobile) && "px-0 py-10 justify-center"
            )}>
                {(!collapsed || isMobile) ? (
                    <Link to="/" className="flex flex-col gap-4 group">
                        <motion.img
                            src="/IMAGES/newLogo_tr.png"
                            alt="Logo"
                            className="h-42 w-42 group-hover:scale-105 transition-all duration-700 drop-shadow-[0_0_25px_rgba(19,73,211,0.25)]"
                        />

                    </Link>
                ) : (
                    <Link to="/" className="w-full flex justify-center group">
                        <motion.img
                            src="/IMAGES/newLogo_tr.png"
                            alt="Logo"
                            className="h-8 scale-350 group-hover:scale-400 transition-all duration-700"
                        />
                    </Link>
                )}
            </div>

            {/* Menu Items */}
            <div className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                {managerMenu.map((item) => (
                    <SidebarItem
                        key={item.label}
                        icon={item.icon}
                        label={item.label}
                        href={item.href}
                        active={location.pathname === item.href}
                        collapsed={collapsed && !isMobile}
                    />
                ))}
            </div>

            {/* Footer / Profile & Logout */}
            <div className="px-4 mt-auto pt-6 border-t border-white/5 space-y-4">
                {/* User Profile Card */}
                <Link to="/admin/settings" className="block" onClick={() => isMobile && setMobileOpen(false)}>
                    <div className={cn(
                        "relative group/profile rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500",
                        (collapsed && !isMobile) ? "w-14 h-14 mx-auto flex items-center justify-center" : "p-3 flex items-center gap-4"
                    )}>
                        {/* Background Glow */}
                        <div className="absolute inset-0 bg-padel-blue/5 opacity-0 group-hover/profile:opacity-100 blur-xl transition-opacity rounded-2xl" />

                        <div className="relative">
                            <div className={cn(
                                "rounded-xl bg-gradient-to-br from-padel-blue to-blue-700 flex items-center justify-center text-white font-black text-[10px] shadow-[0_8px_16px_rgba(19,73,211,0.2) group-hover:scale-105 transition-transform duration-500",
                                (collapsed && !isMobile) ? "w-10 h-10" : "w-10 h-10"
                            )}>
                                {user?.initials || 'EM'}
                            </div>
                            {/* Status Dot */}
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#0E0E11] flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            </div>
                        </div>

                        {(!collapsed || isMobile) && (
                            <div className="flex-1 min-w-0 pr-2 leading-tight">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                    <span className="text-[8px] font-black text-padel-blue uppercase tracking-[0.2em]">Manager</span>
                                </div>
                                <p className="text-[11px] font-black text-white tracking-tight truncate">{user.name}</p>
                            </div>
                        )}
                    </div>
                </Link>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className={cn(
                        "w-full flex items-center transition-all duration-500 group relative rounded-2xl overflow-hidden",
                        (collapsed && !isMobile) ? "justify-center w-14 h-14 mx-auto" : "px-5 py-3.5 gap-4 hover:bg-red-500/10"
                    )}>
                    <LogOut
                        size={(collapsed && !isMobile) ? 20 : 18}
                        className="text-white/20 group-hover:text-red-500 group-hover:rotate-[-8deg] transition-all duration-500"
                    />

                    {(!collapsed || isMobile) && (
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-white transition-colors">
                            Quitter
                        </span>
                    )}
                </button>
            </div>

            {/* Collapse Toggle (Desktop) */}
            {!isMobile && (
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-padel-blue text-white rounded-full items-center justify-center border border-white/10 shadow-xl hover:scale-110 transition-transform z-50"
                >
                    <ChevronLeft size={16} className={cn("transition-transform duration-500", collapsed && "rotate-180")} />
                </button>
            )}
        </div>
    );

    return (
        <>
            {/* Mobile Sidebar */}
            <div className={cn(
                "fixed inset-0 z-[150] bg-black/80 backdrop-blur-md lg:hidden transition-opacity duration-300",
                mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )} onClick={() => setMobileOpen(false)}>
                <motion.aside
                    initial={{ x: '-100%' }}
                    animate={{ x: mobileOpen ? 0 : '-100%' }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="w-80 h-full bg-[#0E0E11] border-r border-white/5 flex flex-col relative"
                    onClick={e => e.stopPropagation()}
                >
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="absolute top-8 right-8 text-white/20 hover:text-white p-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all z-[160]"
                    >
                        <X size={20} />
                    </button>
                    {renderSidebarContent(true)}
                </motion.aside>
            </div>

            {/* Desktop Sidebar */}
            <aside className={cn(
                "hidden lg:flex flex-col h-screen fixed top-0 left-0 bg-[#0E0E11] border-r border-white/5 transition-all duration-500 z-[140]",
                collapsed ? "w-24" : "w-72"
            )}>
                {renderSidebarContent(false)}
            </aside>
        </>
    );
};
