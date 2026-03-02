import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Bell,
    Lock,
    Camera,
    Gamepad2,
    Save,
    Trash2,
    CheckCircle2,
    Loader2,
    AlertCircle,
    Eye,
    EyeOff
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

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

export function PlayerProfile() {
    const { user, refreshUser } = useAuth();
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    
    // Password state
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    
    // Notifications state
    const [notifications, setNotifications] = useState({
        match: true,
        news: false,
        promo: true
    });
    
    // Preferences state
    const [selectedSports, setSelectedSports] = useState<string[]>(['Padel']);
    const availableSports = ['Padel', 'Pickleball', 'Badminton'];

    // Load user data
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: (user as any).phone || '',
                address: (user as any).address || ''
            });
            setNotifications((user as any).notifications || { match: true, news: false, promo: true });
            setSelectedSports((user as any).preferences?.sports || ['Padel']);
        }
    }, [user]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        setSuccess(false);

        try {
            await api.put('/auth/update-profile', {
                ...formData,
                notifications,
                preferences: { sports: selectedSports }
            });
            
            setSuccess(true);
            if (refreshUser) refreshUser();
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('Les mots de passe ne correspondent pas');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setPasswordLoading(true);
        setPasswordError('');
        setPasswordSuccess(false);

        try {
            await api.put('/auth/change-password', {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            
            setPasswordSuccess(true);
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setPasswordSuccess(false), 3000);
        } catch (err: any) {
            setPasswordError(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
        } finally {
            setPasswordLoading(false);
        }
    };

    const toggleSport = (sport: string) => {
        setSelectedSports(prev => 
            prev.includes(sport) 
                ? prev.filter(s => s !== sport)
                : [...prev, sport]
        );
    };

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-8 md:space-y-12 pb-10">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-display font-black text-white italic uppercase tracking-tighter leading-none mb-2 sm:mb-4">
                        Mon <span className="text-padel-blue">Profil</span>
                    </h1>
                    <p className="text-white/40 text-[11px] sm:text-[13px] font-medium max-w-md uppercase tracking-widest">
                        Personnalisez votre expérience et gérez vos préférences.
                    </p>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-padel-blue text-white text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-xl shadow-padel-blue/30 hover:shadow-padel-blue/50 transition-all disabled:opacity-50"
                >
                    {saving ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : success ? (
                        <CheckCircle2 size={16} />
                    ) : (
                        <Save size={16} />
                    )}
                    <span className="hidden sm:inline">{saving ? 'Sauvegarde...' : success ? 'Sauvegardé!' : 'Sauvegarder'}</span>
                    <span className="sm:hidden">{saving ? '...' : success ? 'OK' : 'Sauver'}</span>
                </motion.button>
            </div>

            {/* Error/Success Messages */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500"
                    >
                        <AlertCircle size={18} />
                        <span className="text-xs font-bold">{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
                {/* Left: Info */}
                <div className="lg:col-span-8 space-y-6 lg:space-y-8">
                    {/* Profile Info Card */}
                    <div className="bg-[#151518] border border-white/10 rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] p-6 sm:p-8 lg:p-12">
                        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-12 items-center sm:items-start mb-8 lg:mb-12">
                            {/* Avatar */}
                            <div className="relative group cursor-pointer shrink-0">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] bg-padel-blue/10 border-2 border-padel-blue flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl font-black text-padel-blue overflow-hidden group-hover:scale-105 transition-transform duration-500 shadow-2xl shadow-padel-blue/20">
                                    {user?.name?.charAt(0) || 'P'}
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera size={28} className="text-white" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 bg-padel-yellow rounded-lg sm:rounded-xl flex items-center justify-center text-padel-blue shadow-lg border-2 sm:border-4 border-[#151518]">
                                    <Gamepad2 size={16} className="sm:w-5 sm:h-5" />
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 w-full">
                                {[
                                    { label: 'Prénom & Nom', field: 'name', icon: User, value: formData.name },
                                    { label: 'E-mail', field: 'email', icon: Mail, value: formData.email },
                                    { label: 'Téléphone', field: 'phone', icon: Phone, value: formData.phone },
                                    { label: 'Ville', field: 'address', icon: MapPin, value: formData.address },
                                ].map((item, i) => (
                                    <div key={i} className="space-y-2 sm:space-y-3">
                                        <label className="text-[9px] sm:text-[10px] font-black text-white/30 uppercase tracking-[0.15em] sm:tracking-[0.2em] flex items-center gap-2 sm:gap-3">
                                            <item.icon size={12} className="text-padel-blue sm:w-[14px] sm:h-[14px]" /> {item.label}
                                        </label>
                                        <input
                                            type={item.field === 'email' ? 'email' : 'text'}
                                            value={item.value}
                                            onChange={(e) => handleInputChange(item.field, e.target.value)}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl sm:rounded-2xl py-3 sm:py-4 lg:py-5 px-4 sm:px-5 lg:px-6 text-xs sm:text-sm font-bold text-white outline-none focus:border-padel-blue transition-all"
                                            placeholder={item.label}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Password Section - Only for local auth users */}
                        {(user as any)?.authProvider !== 'google' && (
                        <div className="pt-6 lg:pt-8 border-t border-white/5">
                            <h3 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-[0.3em] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                                <Lock size={14} className="text-padel-blue sm:w-4 sm:h-4" /> Changer le mot de passe
                            </h3>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                {[
                                    { label: 'Mot de passe actuel', field: 'oldPassword', show: showPasswords.old, toggleKey: 'old' },
                                    { label: 'Nouveau', field: 'newPassword', show: showPasswords.new, toggleKey: 'new' },
                                    { label: 'Confirmation', field: 'confirmPassword', show: showPasswords.confirm, toggleKey: 'confirm' },
                                ].map((item, i) => (
                                    <div key={i} className="space-y-2 sm:space-y-3">
                                        <label className="text-[9px] sm:text-[10px] font-black text-white/30 uppercase tracking-[0.15em]">
                                            {item.label}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={item.show ? 'text' : 'password'}
                                                value={passwordData[item.field as keyof typeof passwordData]}
                                                onChange={(e) => setPasswordData(prev => ({ ...prev, [item.field]: e.target.value }))}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl sm:rounded-2xl py-3 sm:py-4 px-4 sm:px-5 pr-10 sm:pr-12 text-xs sm:text-sm font-bold text-white outline-none focus:border-padel-blue transition-all"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords(prev => ({ ...prev, [item.toggleKey]: !prev[item.toggleKey as keyof typeof prev] }))}
                                                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                            >
                                                {item.show ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Password Error/Success */}
                            <AnimatePresence>
                                {passwordError && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-red-500 text-[10px] sm:text-xs font-bold mt-3"
                                    >
                                        {passwordError}
                                    </motion.p>
                                )}
                                {passwordSuccess && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-green-500 text-[10px] sm:text-xs font-bold mt-3 flex items-center gap-2"
                                    >
                                        <CheckCircle2 size={14} /> Mot de passe mis à jour!
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            <button
                                onClick={handlePasswordChange}
                                disabled={passwordLoading || !passwordData.oldPassword || !passwordData.newPassword}
                                className="mt-4 sm:mt-6 flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-[10px] sm:text-xs font-black uppercase tracking-widest disabled:opacity-30"
                            >
                                {passwordLoading ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                                Modifier
                            </button>
                        </div>
                        )}
                    </div>
                </div>

                {/* Right: Preferences */}
                <div className="lg:col-span-4 space-y-4 sm:space-y-6 lg:space-y-8">
                    {/* Notifications */}
                    <div className="bg-[#151518] border border-white/10 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 lg:p-10">
                        <h3 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-6 sm:mb-8 lg:mb-10 flex items-center gap-2 sm:gap-3">
                            <Bell size={16} className="text-padel-yellow sm:w-[18px] sm:h-[18px]" /> Notifications
                        </h3>

                        <div className="space-y-5 sm:space-y-6 lg:space-y-8">
                            {[
                                { id: 'match', label: 'Matchs & Réservations', desc: 'Rappels 24h avant' },
                                { id: 'news', label: 'Actualités Club', desc: 'Tournois & Événements' },
                                { id: 'promo', label: 'Offres Privées', desc: 'Alertes Pro-Shop' },
                            ].map((item) => (
                                <div key={item.id} className="flex items-center justify-between group">
                                    <div>
                                        <p className="text-[10px] sm:text-xs font-black text-white uppercase tracking-wider sm:tracking-widest mb-0.5 sm:mb-1">{item.label}</p>
                                        <p className="text-[9px] sm:text-[10px] text-white/20 font-bold">{item.desc}</p>
                                    </div>
                                    <Toggle 
                                        active={notifications[item.id as keyof typeof notifications]} 
                                        onClick={() => toggleNotification(item.id as keyof typeof notifications)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sports Preferences */}
                    <div className="bg-[#151518] border border-white/10 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 lg:p-10">
                        <h3 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-6 sm:mb-8 lg:mb-10 flex items-center gap-2 sm:gap-3">
                            <Gamepad2 size={16} className="text-padel-blue sm:w-[18px] sm:h-[18px]" /> Sports Favoris
                        </h3>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            {availableSports.map((sport) => (
                                <button
                                    key={sport}
                                    onClick={() => toggleSport(sport)}
                                    className={cn(
                                        "px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest border transition-all",
                                        selectedSports.includes(sport) 
                                            ? "bg-padel-blue/10 border-padel-blue text-padel-blue" 
                                            : "bg-white/5 border-white/5 text-white/30 hover:border-white/20"
                                    )}
                                >
                                    {sport}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Danger Zone */}
                    {/* <div className="p-5 sm:p-6 lg:p-8 bg-red-500/5 rounded-xl sm:rounded-2xl border border-red-500/10 group cursor-pointer hover:bg-red-500/10 transition-all">
                        <div className="flex items-center gap-2 sm:gap-3 text-red-500 mb-3 sm:mb-4">
                            <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em]">Zone Critique</span>
                        </div>
                        <p className="text-[9px] sm:text-[10px] font-bold text-red-500/50 leading-relaxed uppercase">
                            La suppression du compte est définitive et entraînera la perte de votre abonnement.
                        </p>
                    </div> */}
                </div>
            </div>
        </div>
    );
}
