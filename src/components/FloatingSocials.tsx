import React from 'react';
import { motion } from 'motion/react';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

const socials = [
    {
        icon: <Facebook className="w-[18px] h-[18px] md:w-5 md:h-5" />,
        href: 'https://web.facebook.com/profile.php?id=61587336327009&locale=fr_FR',
        label: 'Facebook',
        color: 'border-[#1877F2]/40 text-[#1877F2] shadow-[0_0_10px_rgba(24,119,242,0.2)] hover:border-[#1877F2] hover:shadow-[0_0_20px_rgba(24,119,242,0.4)]',
    },
    {
        icon: <Instagram className="w-[18px] h-[18px] md:w-5 md:h-5" />,
        href: 'https://www.instagram.com/padelarenavendome/',
        label: 'Instagram',
        color: 'border-[#E2725B]/40 text-[#E2725B] shadow-[0_0_10px_rgba(226,114,91,0.2)] hover:border-[#E2725B] hover:shadow-[0_0_20px_rgba(226,114,91,0.4)]',
    },
    /* {
        icon: <Linkedin className="w-[18px] h-[18px] md:w-5 md:h-5" />,
        href: '#',
        label: 'LinkedIn',
        color: 'border-[#0A66C2]/40 text-[#0A66C2] shadow-[0_0_10px_rgba(10,102,194,0.2)] hover:border-[#0A66C2] hover:shadow-[0_0_20px_rgba(10,102,194,0.4)]',
    }, */
];

export default function FloatingSocials() {
    return (
        <div className="flex flex-col gap-3 md:gap-4 items-center">
            {socials.map((social, i) => (
                <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/[0.03] backdrop-blur-md border flex items-center justify-center transition-all duration-300 ${social.color}`}
                >
                    {social.icon}
                </motion.a>
            ))}
        </div>
    );
}
