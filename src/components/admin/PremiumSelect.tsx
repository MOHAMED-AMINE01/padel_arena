import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check, LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PremiumSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    icon?: LucideIcon;
    className?: string;
    label?: string;
}

export const PremiumSelect: React.FC<PremiumSelectProps> = ({
    value,
    onChange,
    options,
    placeholder = "Sélectionner...",
    icon: Icon,
    className,
    label
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                {Icon && (
                    <Icon
                        className={cn(
                            "absolute left-4 top-1/2 -translate-y-1/2 transition-colors",
                            isOpen ? "text-padel-blue" : "text-white/10"
                        )}
                        size={14}
                    />
                )}
                <span className={cn("block truncate", !selectedOption && "text-white/20 font-black uppercase tracking-widest text-[9px]")}>
                    {selectedOption ? selectedOption.label : placeholder}
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
                        animate={{ opacity: 1, y: 5, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="absolute z-[210] w-full mt-2 bg-[#1a1a1e] border border-white/10 rounded-[1.8rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-3xl"
                    >
                        <div className="max-h-60 overflow-y-auto custom-scrollbar p-2 space-y-1">
                            {options.length === 0 ? (
                                <div className="p-4 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">
                                    Aucune option
                                </div>
                            ) : (
                                options.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(option.value);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "w-full flex items-center justify-between px-4 py-3.5 rounded-[1.2rem] text-sm transition-all group",
                                            value === option.value
                                                ? "bg-padel-blue text-white"
                                                : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                                        )}
                                    >
                                        <span className={cn(
                                            "font-medium",
                                            value === option.value ? "font-bold" : ""
                                        )}>
                                            {option.label}
                                        </span>
                                        {value === option.value && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                            >
                                                <Check size={14} className="text-white" />
                                            </motion.div>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
