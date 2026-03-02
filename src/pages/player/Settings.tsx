import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Settings,
    Moon,
    Sun,
    Globe,
    Shield,
    Eye,
    EyeOff,
    Smartphone,
    Volume2,
    VolumeX,
    Vibrate,
    HelpCircle,
    FileText,
    Mail,
    MessageSquare,
    ChevronRight,
    CheckCircle2
} from 'lucide-react';
import { cn } from '../../lib/utils';

// Toggle Component
const Toggle = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
    <button
        onClick={onClick}
        className={cn(
            "w-11 h-6 rounded-full relative transition-all duration-300 cursor-pointer",
            active ? "bg-padel-blue shadow-lg shadow-padel-blue/20" : "bg-white/10"
        )}
    >
        <div className={cn(
            "absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300",
            active ? "left-6" : "left-1"
        )} />
    </button>
);

// Setting Item Component
const SettingItem = ({ 
    icon: Icon, 
    label, 
    description, 
    rightElement,
    onClick,
    iconColor = "text-padel-blue"
}: { 
    icon: any; 
    label: string; 
    description?: string;
    rightElement?: React.ReactNode;
    onClick?: () => void;
    iconColor?: string;
}) => (
    <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all group"
    >
        <div className="flex items-center gap-3 sm:gap-4">
            <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center transition-colors", iconColor)}>
                <Icon size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div className="text-left">
                <p className="text-[11px] sm:text-xs font-black text-white uppercase tracking-wider">{label}</p>
                {description && (
                    <p className="text-[9px] sm:text-[10px] text-white/30 font-bold mt-0.5">{description}</p>
                )}
            </div>
        </div>
        {rightElement || <ChevronRight size={16} className="text-white/20 group-hover:text-white/40 transition-colors" />}
    </button>
);

export function PlayerSettings() {
    const [settings, setSettings] = useState({
        darkMode: true,
        sounds: true,
        vibrations: true,
        profileVisible: true,
        statsVisible: true,
        historyVisible: false
    });

    const [language, setLanguage] = useState('fr');

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-8 md:space-y-12 pb-10">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-display font-black text-white italic uppercase tracking-tighter leading-none mb-2 sm:mb-4">
                    Para<span className="text-padel-blue">mètres</span>
                </h1>
                <p className="text-white/40 text-[11px] sm:text-[13px] font-medium max-w-md uppercase tracking-widest">
                    Personnalisez l'application selon vos préférences.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Appearance */}
                <div className="bg-[#151518] border border-white/10 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8">
                    <h3 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-[0.3em] mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
                        <Moon size={16} className="text-padel-blue sm:w-[18px] sm:h-[18px]" /> Apparence
                    </h3>

                    <div className="space-y-3 sm:space-y-4">
                        <SettingItem
                            icon={settings.darkMode ? Moon : Sun}
                            label="Mode sombre"
                            description="Thème de l'application"
                            rightElement={<Toggle active={settings.darkMode} onClick={() => toggleSetting('darkMode')} />}
                        />
                        
                        <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5">
                            <div className="flex items-center gap-3 sm:gap-4 mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center text-padel-blue">
                                    <Globe size={18} className="sm:w-5 sm:h-5" />
                                </div>
                                <div>
                                    <p className="text-[11px] sm:text-xs font-black text-white uppercase tracking-wider">Langue</p>
                                    <p className="text-[9px] sm:text-[10px] text-white/30 font-bold mt-0.5">Choisir la langue</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { code: 'fr', label: '🇫🇷 Français' },
                                    { code: 'en', label: '🇬🇧 English' },
                                    { code: 'es', label: '🇪🇸 Español' },
                                ].map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => setLanguage(lang.code)}
                                        className={cn(
                                            "px-4 py-2.5 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all",
                                            language === lang.code
                                                ? "bg-padel-blue/10 border border-padel-blue text-padel-blue"
                                                : "bg-white/5 border border-white/5 text-white/50 hover:border-white/20"
                                        )}
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications & Sounds */}
                <div className="bg-[#151518] border border-white/10 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8">
                    <h3 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-[0.3em] mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
                        <Smartphone size={16} className="text-padel-yellow sm:w-[18px] sm:h-[18px]" /> Application
                    </h3>

                    <div className="space-y-3 sm:space-y-4">
                        <SettingItem
                            icon={settings.sounds ? Volume2 : VolumeX}
                            label="Sons"
                            description="Effets sonores"
                            iconColor="text-padel-yellow"
                            rightElement={<Toggle active={settings.sounds} onClick={() => toggleSetting('sounds')} />}
                        />
                        <SettingItem
                            icon={Vibrate}
                            label="Vibrations"
                            description="Retour haptique"
                            iconColor="text-padel-yellow"
                            rightElement={<Toggle active={settings.vibrations} onClick={() => toggleSetting('vibrations')} />}
                        />
                    </div>
                </div>

                {/* Privacy */}
                <div className="bg-[#151518] border border-white/10 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8">
                    <h3 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-[0.3em] mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
                        <Shield size={16} className="text-green-500 sm:w-[18px] sm:h-[18px]" /> Confidentialité
                    </h3>

                    <div className="space-y-3 sm:space-y-4">
                        <SettingItem
                            icon={settings.profileVisible ? Eye : EyeOff}
                            label="Profil public"
                            description="Visible par les autres joueurs"
                            iconColor="text-green-500"
                            rightElement={<Toggle active={settings.profileVisible} onClick={() => toggleSetting('profileVisible')} />}
                        />
                        <SettingItem
                            icon={settings.statsVisible ? Eye : EyeOff}
                            label="Statistiques"
                            description="Afficher mes stats"
                            iconColor="text-green-500"
                            rightElement={<Toggle active={settings.statsVisible} onClick={() => toggleSetting('statsVisible')} />}
                        />
                        <SettingItem
                            icon={settings.historyVisible ? Eye : EyeOff}
                            label="Historique matchs"
                            description="Visible publiquement"
                            iconColor="text-green-500"
                            rightElement={<Toggle active={settings.historyVisible} onClick={() => toggleSetting('historyVisible')} />}
                        />
                    </div>
                </div>

                {/* Support */}
                <div className="bg-[#151518] border border-white/10 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8">
                    <h3 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-[0.3em] mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
                        <HelpCircle size={16} className="text-purple-500 sm:w-[18px] sm:h-[18px]" /> Aide & Support
                    </h3>

                    <div className="space-y-3 sm:space-y-4">
                        <SettingItem
                            icon={HelpCircle}
                            label="Centre d'aide"
                            description="FAQ et guides"
                            iconColor="text-purple-500"
                        />
                        <SettingItem
                            icon={MessageSquare}
                            label="Nous contacter"
                            description="Support par chat"
                            iconColor="text-purple-500"
                        />
                        <SettingItem
                            icon={Mail}
                            label="Feedback"
                            description="Donnez votre avis"
                            iconColor="text-purple-500"
                        />
                    </div>
                </div>

                {/* Legal */}
                <div className="lg:col-span-2 bg-[#151518] border border-white/10 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8">
                    <h3 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-[0.3em] mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
                        <FileText size={16} className="text-white/40 sm:w-[18px] sm:h-[18px]" /> Informations légales
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {[
                            { label: 'Conditions d\'utilisation', icon: FileText },
                            { label: 'Politique de confidentialité', icon: Shield },
                            { label: 'Mentions légales', icon: FileText },
                            { label: 'CGV', icon: FileText },
                        ].map((item, i) => (
                            <button
                                key={i}
                                className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
                            >
                                <item.icon size={14} className="text-white/30" />
                                <span className="text-[10px] sm:text-[11px] font-bold text-white/50 group-hover:text-white/70 transition-colors">
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/5 text-center">
                        <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                            Padel Arena • Version 1.0.0
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
