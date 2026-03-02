import React from 'react';
import { Outlet } from 'react-router-dom';
import { PlayerNavbar } from './PlayerNavbar';
import BackToTop from '../BackToTop';

export function PlayerLayout() {
    return (
        <div className="min-h-screen bg-[#0E0E11] text-white flex flex-col pt-32 relative overflow-hidden">
            {/* Premium Background Decorations */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-padel-blue/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-padel-yellow/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <PlayerNavbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8 md:py-12 relative z-10">
                <Outlet />
            </main>

            <div className="fixed bottom-20 right-6 md:right-8 z-[200]">
                <BackToTop />
            </div>
        </div>
    );
}
