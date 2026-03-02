import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface PremiumTimePickerProps {
    value: string;
    onChange: (value: string) => void;
    icon?: React.ElementType;
}

export const PremiumTimePicker: React.FC<PremiumTimePickerProps> = ({
    value,
    onChange,
    icon: Icon = Clock
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Generate time slots every 30 minutes from 08:00 to 22:00
    const timeSlots = [];
    for (let hour = 8; hour <= 22; hour++) {
        const h = hour.toString().padStart(2, '0');
        timeSlots.push(`${h}:00`);
        if (hour !== 22) {
            timeSlots.push(`${h}:30`);
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (time: string) => {
        onChange(time);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative w-full bg-white/[0.03] border border-white/5 rounded-xl py-2.5 pl-10 pr-8 text-xs text-white text-left focus:outline-none focus:border-padel-blue/50 transition-all group",
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
                <span className="block truncate font-bold text-white uppercase italic tracking-tighter leading-none text-[12px]">
                    {value.replace(':', 'h')}
                </span>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown
                        className={cn("w-3.5 h-3.5 text-white/10 transition-transform duration-300", isOpen && "rotate-180 text-padel-blue")}
                    />
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-[300] left-0 right-0 mt-2 p-2 bg-[#1a1a1e] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl max-h-[240px] overflow-y-auto custom-scrollbar"
                    >
                        <div className="grid grid-cols-3 gap-1">
                            {timeSlots.map((time) => (
                                <button
                                    key={time}
                                    type="button"
                                    onClick={() => handleSelect(time)}
                                    className={cn(
                                        "py-2 px-1 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all",
                                        value === time
                                            ? "bg-padel-blue text-white shadow-lg shadow-padel-blue/20 scale-[1.05]"
                                            : "text-white/20 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {time.replace(':', 'h')}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


