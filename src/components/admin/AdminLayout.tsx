import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar, AdminRole } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export const AdminLayout = ({ role = 'SUPER_ADMIN' }: { role?: AdminRole }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const handleScroll = () => {
            setShowBackToTop(el.scrollTop > 300);
        };

        el.addEventListener('scroll', handleScroll);
        return () => el.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="fixed inset-0 bg-[#0E0E11] text-white flex overflow-hidden w-full">
            <div className="flex-1 flex relative h-full w-full overflow-hidden">
                {/* Premium Background Decorations */}
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden max-w-full">
                    <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] bg-padel-blue/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-padel-yellow/5 rounded-full blur-[120px]" />
                    <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                </div>

                {/* Sidebar */}
                <AdminSidebar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                    role={role}
                />

                {/* Mobile Sidebar Toggle (Floating on the Right) */}
                <button
                    onClick={() => setMobileOpen(true)}
                    className="lg:hidden fixed top-6 right-6 z-[160] w-14 h-14 bg-padel-blue text-white rounded-2xl flex items-center justify-center shadow-[0_10px_25px_rgba(19,73,211,0.4)] border border-white/10 active:scale-90 transition-all"
                >
                    <div className="flex flex-col gap-1.5 items-center">
                        <div className="w-6 h-0.5 bg-white rounded-full"></div>
                        <div className="w-6 h-0.5 bg-white/70 rounded-full"></div>
                        <div className="w-4 h-0.5 bg-white/40 rounded-full self-end"></div>
                    </div>
                </button>

                {/* Main Content Area */}
                <div
                    ref={scrollRef}
                    className={cn(
                        "flex-1 flex flex-col h-full relative z-10 w-full min-w-0 overflow-y-auto overflow-x-hidden custom-scrollbar",
                        !collapsed ? "lg:pl-72" : "lg:pl-24"
                    )}>
                    <main className="flex-1 p-6 md:p-10 lg:p-16 pt-24 md:pt-10 lg:pt-16 w-full max-w-full overflow-x-hidden">
                        <Outlet />
                    </main>
                </div>
            </div>

            {/* Back to Top Button */}
            <AnimatePresence>
                {showBackToTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 20 }}
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 z-[200] w-12 h-12 bg-padel-blue text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(19,73,211,0.5)] hover:bg-padel-yellow hover:text-padel-blue transition-all duration-300 group"
                        aria-label="Back to top"
                    >
                        <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};
