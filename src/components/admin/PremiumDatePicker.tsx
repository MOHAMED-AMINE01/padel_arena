import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PremiumDatePickerProps {
    value: string; // ISO format (YYYY-MM-DD)
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    className?: string;
    icon?: any;
    align?: 'left' | 'right';
}

export const PremiumDatePicker: React.FC<PremiumDatePickerProps> = ({
    value,
    onChange,
    label,
    placeholder = "Sélectionner une date",
    className,
    icon: Icon = CalendarIcon,
    align = 'left'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(() => {
        if (!value) return new Date();
        const d = new Date(value);
        return isNaN(d.getTime()) ? new Date() : d;
    });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const handleMonthChange = (direction: number) => {
        const nextDate = new Date(viewDate);
        nextDate.setMonth(viewDate.getMonth() + direction);
        setViewDate(nextDate);
    };

    const handleDateSelect = (day: number) => {
        const selectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        onChange(selectedDate.toISOString().split('T')[0]);
        setIsOpen(false);
    };

    const isToday = (day: number) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            viewDate.getMonth() === today.getMonth() &&
            viewDate.getFullYear() === today.getFullYear()
        );
    };

    const isSelected = (day: number) => {
        if (!value) return false;
        const current = new Date(value);
        if (isNaN(current.getTime())) return false;
        return (
            day === current.getDate() &&
            viewDate.getMonth() === current.getMonth() &&
            viewDate.getFullYear() === current.getFullYear()
        );
    };

    const dayRange = Array.from({ length: daysInMonth(viewDate.getFullYear(), viewDate.getMonth()) }, (_, i) => i + 1);
    const blanks = Array.from({ length: (firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth()) + 6) % 7 }, (_, i) => i);

    return (
        <div className={cn("relative w-full", className)} ref={containerRef}>
            {label && (
                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-2 mb-2 block">
                    {label}
                </label>
            )}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative w-full bg-white/[0.03] border border-white/5 rounded-xl py-2.5 pl-10 pr-8 text-xs text-white text-left focus:outline-none focus:border-padel-blue/50 transition-all",
                    isOpen && "border-padel-blue/50 ring-4 ring-padel-blue/10 bg-white/[0.06]"
                )}
            >
                <Icon
                    className={cn(
                        "absolute left-4 top-1/2 -translate-y-1/2 transition-colors",
                        isOpen ? "text-padel-blue" : "text-white/10"
                    )}
                    size={14}
                />
                <span className={cn(
                    "block truncate font-bold uppercase tracking-tighter leading-none text-[11px]",
                    value ? "text-white" : "text-white/20"
                )}>
                    {(() => {
                        if (!value) return placeholder;
                        const d = new Date(value);
                        if (isNaN(d.getTime())) return placeholder;
                        return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
                    })()}
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 10 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className={cn(
                            "absolute z-[210] w-[320px] bg-[#1a1a1e] border border-white/10 rounded-[2rem] p-6 shadow-[0_30px_60px_rgba(0,0,0,0.8)] backdrop-blur-3xl overflow-hidden",
                            align === 'right' ? "right-0" : "left-0"
                        )}
                    >
                        {/* Header: Month/Year navigation */}
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <button
                                type="button"
                                onClick={() => handleMonthChange(-1)}
                                className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all group/nav"
                            >
                                <ChevronLeft size={18} className="group-hover/nav:-translate-x-0.5 transition-transform" />
                            </button>
                            <div className="text-center group/title cursor-default">
                                <motion.p
                                    key={`year-${viewDate.getFullYear()}`}
                                    initial={{ y: -5, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="text-[10px] font-black text-padel-blue uppercase tracking-[0.4em] leading-none mb-1.5 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                                >
                                    {viewDate.getFullYear()}
                                </motion.p>
                                <motion.p
                                    key={`month-${viewDate.getMonth()}`}
                                    initial={{ y: 5, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="text-xl font-display font-black text-white uppercase tracking-tighter leading-none"
                                >
                                    {viewDate.toLocaleDateString('fr-FR', { month: 'long' })}
                                </motion.p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleMonthChange(1)}
                                className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all group/nav"
                            >
                                <ChevronRight size={18} className="group-hover/nav:translate-x-0.5 transition-transform" />
                            </button>
                        </div>

                        {/* Weekday headers */}
                        <div className="grid grid-cols-7 gap-1 mb-4 relative z-10">
                            {['LU', 'MA', 'ME', 'JE', 'VE', 'SA', 'DI'].map((day, i) => (
                                <div key={i} className="text-center text-[8px] font-black text-white/20 uppercase py-2 tracking-widest">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Day grid */}
                        <div className="grid grid-cols-7 gap-1.5 relative z-10">
                            {blanks.map((_, i) => <div key={`blank-${i}`} className="w-9 h-9" />)}
                            {dayRange.map((day) => {
                                const active = isSelected(day);
                                const today = isToday(day);
                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => handleDateSelect(day)}
                                        className={cn(
                                            "w-9 h-9 flex items-center justify-center rounded-xl text-[10px] font-black transition-all relative group overflow-hidden",
                                            active
                                                ? "bg-padel-blue text-white shadow-[0_10px_20px_rgba(59,130,246,0.4)] scale-110 z-10"
                                                : "text-white/40 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        <span className="relative z-10">{day}</span>
                                        {today && !active && (
                                            <div className="absolute inset-0 border border-padel-blue/30 rounded-xl" />
                                        )}
                                        {today && (
                                            <div className={cn(
                                                "absolute bottom-1 w-1 h-1 rounded-full z-20",
                                                active ? "bg-white" : "bg-padel-blue animate-pulse shadow-[0_0_5px_rgba(59,130,246,0.8)]"
                                            )} />
                                        )}
                                        {/* Hover Glow */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
                            <button
                                type="button"
                                onClick={() => {
                                    const today = new Date();
                                    setViewDate(today);
                                    onChange(today.toISOString().split('T')[0]);
                                    setIsOpen(false);
                                }}
                                className="w-full py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-[9px] font-black text-white/40 hover:text-padel-blue hover:bg-padel-blue/5 hover:border-padel-blue/20 uppercase tracking-[0.3em] transition-all"
                            >
                                Revenir à Aujourd'hui
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
