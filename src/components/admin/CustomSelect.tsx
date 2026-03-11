import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Option {
    label: string;
    value: string;
}

interface CustomSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    label: string;
    placeholder?: string;
}

export function CustomSelect({ options, value, onChange, label, placeholder }: CustomSelectProps) {
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
        <div className="space-y-4" ref={containerRef}>
            <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">{label}</label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 text-sm font-bold text-white flex items-center justify-between transition-all hover:bg-white/[0.05] hover:border-padel-blue group outline-none focus:border-padel-blue",
                        isOpen && "border-padel-blue shadow-[0_0_30px_rgba(19,73,211,0.15)] ring-1 ring-padel-blue/50"
                    )}
                >
                    <span className={cn("uppercase", !selectedOption && "opacity-20")}>
                        {selectedOption ? selectedOption.label : placeholder || "SÉLECTIONNER..."}
                    </span>
                    <ChevronDown size={18} className={cn("text-white/20 group-hover:text-padel-blue transition-all", isOpen && "rotate-180 text-padel-blue")} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute z-[200] top-full mt-3 w-full bg-[#0c0c0e] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-2xl"
                        >
                            <div className="p-2 max-h-60 overflow-y-auto custom-scrollbar">
                                {options.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(option.value);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left group",
                                            value === option.value ? "bg-padel-blue text-white" : "text-white/40 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        <span className="text-[11px] font-black uppercase tracking-wider">{option.label}</span>
                                        {value === option.value && <Check size={14} className="text-white" />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
