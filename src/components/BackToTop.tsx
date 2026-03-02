import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

interface BackToTopProps {
    containerSelector?: string; // CSS selector for scroll container (uses window if not provided)
}

export default function BackToTop({ containerSelector }: BackToTopProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [container, setContainer] = useState<Element | Window | null>(null);

    // Find the container after mount
    useEffect(() => {
        const findContainer = () => {
            if (containerSelector) {
                const el = document.querySelector(containerSelector);
                if (el) {
                    setContainer(el);
                    return true;
                }
                return false;
            } else {
                setContainer(window);
                return true;
            }
        };

        // Try immediately
        if (!findContainer()) {
            // Retry after a short delay if not found
            const timeout = setTimeout(findContainer, 100);
            return () => clearTimeout(timeout);
        }
    }, [containerSelector]);

    // Listen to scroll events
    useEffect(() => {
        if (!container) return;

        const toggleVisibility = () => {
            const scrollTop = container === window 
                ? window.pageYOffset 
                : (container as Element).scrollTop;
            
            setIsVisible(scrollTop > 300);
        };

        container.addEventListener('scroll', toggleVisibility);
        toggleVisibility(); // Check initial state
        
        return () => container.removeEventListener('scroll', toggleVisibility);
    }, [container]);

    const scrollToTop = useCallback(() => {
        if (!container) return;
        
        if (container === window) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            (container as Element).scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [container]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    onClick={scrollToTop}
                    className="w-12 h-12 bg-padel-blue text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(19,73,211,0.5)] hover:bg-padel-yellow hover:text-padel-blue transition-all duration-300 group"
                    aria-label="Back to top"
                >
                    <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
