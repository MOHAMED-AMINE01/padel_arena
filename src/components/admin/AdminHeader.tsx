import React from 'react';
import { motion } from 'motion/react';
import { Menu, Search, Bell, User, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export const AdminHeader = ({ setMobileOpen }: { setMobileOpen: (v: boolean) => void }) => {
    return (
        <header className="h-20 bg-[#0E0E11]/80 backdrop-blur-xl border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-[130]">
            {/* Search & Mobile Menu Toggle */}
            <div className="flex items-center gap-6 flex-1">
                <button
                    onClick={() => setMobileOpen(true)}
                    className="lg:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white"
                >
                    <Menu size={20} />
                </button>

                <div className="hidden md:flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 max-w-md w-full focus-within:border-padel-blue/50 transition-all">
                    <Search size={18} className="text-white/20" />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/20 w-full font-medium"
                    />
                </div>
            </div>

            {/* Profile & Notifications */}
            <div className="flex items-center gap-4">
                <button className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all group">
                    <Bell size={20} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-padel-yellow rounded-full border-2 border-[#0E0E11] animate-pulse" />
                </button>

                <div className="w-[1px] h-6 bg-white/10 mx-2 hidden sm:block" />

                <button className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-white/5 transition-all group">
                    <div className="w-9 h-9 rounded-lg bg-padel-blue flex items-center justify-center text-white font-black text-xs shadow-lg shadow-padel-blue/20">
                        EM
                    </div>
                    <div className="hidden sm:block text-left">
                        <p className="text-[11px] font-black text-padel-yellow uppercase tracking-widest leading-none mb-1">Elite Manager</p>
                        <p className="text-xs font-bold text-white leading-none">M. Amine</p>
                    </div>
                    <ChevronDown size={14} className="text-white/20 group-hover:text-white transition-colors" />
                </button>

            </div>
        </header>
    );
};
