import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Settings,
    User,
    Lock,
    Save,
    ChevronRight,
    ShieldCheck,
    Mail,
    KeyRound,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

export function AdminSettings() {
    const { user, setUser } = useAuth() as any;
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPass, setLoadingPass] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingProfile(true);
        try {
            const res = await api.put('/auth/update-profile', profileData);
            setUser(res.data.data);
            setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la mise à jour' });
        } finally {
            setLoadingProfile(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
            return;
        }
        setLoadingPass(true);
        try {
            await api.put('/auth/change-password', {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setMessage({ type: 'success', text: 'Mot de passe modifié avec succès !' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors du changement' });
        } finally {
            setLoadingPass(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-20"
        >
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8 border-b border-white/5 pb-8 md:pb-10 pt-6 md:pt-0">
                <div className="space-y-3 md:space-y-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-padel-blue/10 border border-padel-blue/20 text-padel-blue text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]"
                    >
                        <Settings size={10} className="md:w-3 md:h-3" /> Account Governance
                    </motion.div>
                    <div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white italic uppercase tracking-tighter leading-[0.9] md:leading-[0.85]">
                            Profil & <br /> <span className="text-padel-yellow drop-shadow-[0_0_30px_rgba(255,210,31,0.2)]">Sécurité</span>
                        </h1>
                        <p className="text-[10px] md:text-xs font-bold text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em] mt-3 md:mt-4 italic">Gérez vos accès et informations</p>
                    </div>
                </div>
            </div>

            {/* Notification Toast */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: 20 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, y: -20, x: 20 }}
                        className={cn(
                            "fixed top-24 sm:top-32 right-4 sm:right-10 z-[200] px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-2xl border flex items-center gap-3 md:gap-4 backdrop-blur-xl",
                            message.type === 'success' ? "bg-green-500/10 border-green-500/50 text-green-500" : "bg-red-500/10 border-red-500/50 text-red-500"
                        )}
                    >
                        {message.type === 'success' ? <CheckCircle2 size={16} className="md:w-5 md:h-5" /> : <AlertCircle size={16} className="md:w-5 md:h-5" />}
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{message.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Profile Section */}
                <div className="lg:col-span-6">
                    <form onSubmit={handleUpdateProfile} className="bg-[#151518]/60 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-[3rem] p-6 md:p-10 space-y-8 md:space-y-10 shadow-3xl h-full">
                        <div className="flex items-center justify-between pb-6 md:pb-8 border-b border-white/5">
                            <h3 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3 md:gap-4">
                                <User className="text-padel-blue md:w-6 md:h-6" size={20} /> Infos Publiques
                            </h3>
                        </div>

                        <div className="space-y-5 md:space-y-6">
                            <div className="space-y-2 md:space-y-3">
                                <label className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em] ml-2">Nom Complet</label>
                                <div className="relative group/input">
                                    <div className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-padel-blue transition-colors">
                                        <User size={16} className="md:w-[18px] md:h-[18px]" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl pl-12 md:pl-16 pr-6 py-4 md:py-5 text-sm md:text-base text-white font-bold focus:outline-none focus:border-padel-blue/40 focus:bg-white/[0.06] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 md:space-y-3">
                                <label className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em] ml-2">Adresse Email</label>
                                <div className="relative group/input">
                                    <div className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-padel-blue transition-colors">
                                        <Mail size={16} className="md:w-[18px] md:h-[18px]" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl pl-12 md:pl-16 pr-6 py-4 md:py-5 text-sm md:text-base text-white font-bold focus:outline-none focus:border-padel-blue/40 focus:bg-white/[0.06] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={loadingProfile}
                                    className="w-full py-4 md:py-5 bg-padel-blue text-white rounded-xl md:rounded-[1.5rem] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-padel-yellow hover:text-padel-blue active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                                >
                                    {loadingProfile ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Settings size={14} className="md:w-4 md:h-4" /></motion.div> : <Save size={14} className="md:w-4 md:h-4" />}
                                    SAUVEGARDER LE PROFIL
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Password Section */}
                <div className="lg:col-span-6">
                    <form onSubmit={handleChangePassword} className="bg-[#151518]/60 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-[3rem] p-6 md:p-10 space-y-8 md:space-y-10 shadow-3xl h-full">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 md:pb-8 border-b border-white/5">
                            <h3 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3 md:gap-4">
                                <Lock className="text-padel-yellow md:w-6 md:h-6" size={20} /> Sécurité Accès
                            </h3>
                            <div className="flex items-center gap-2 text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-widest bg-white/5 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/5">
                                <ShieldCheck size={12} className="text-green-500 md:w-3.5 md:h-3.5" /> AES-256
                            </div>
                        </div>

                        <div className="space-y-5 md:space-y-6">
                            <div className="space-y-2 md:space-y-3">
                                <label className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em] ml-2">Mot de passe actuel</label>
                                <div className="relative group/input">
                                    <div className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-padel-yellow transition-colors">
                                        <KeyRound size={16} className="md:w-[18px] md:h-[18px]" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={passwordData.oldPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl pl-12 md:pl-16 pr-6 py-4 md:py-5 text-sm md:text-base text-white font-bold focus:outline-none focus:border-padel-yellow/40 focus:bg-white/[0.06] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                <div className="space-y-2 md:space-y-3">
                                    <label className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em] ml-2">Nouveau</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-4 md:py-5 text-sm md:text-base text-white font-bold focus:outline-none focus:border-padel-yellow/40 focus:bg-white/[0.06] transition-all"
                                    />
                                </div>
                                <div className="space-y-2 md:space-y-3">
                                    <label className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em] ml-2">Confirmation</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-4 md:py-5 text-sm md:text-base text-white font-bold focus:outline-none focus:border-padel-yellow/40 focus:bg-white/[0.06] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={loadingPass}
                                    className="w-full py-4 md:py-5 bg-white/5 border border-white/10 text-white rounded-xl md:rounded-[1.5rem] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] hover:bg-padel-yellow hover:text-padel-blue hover:border-padel-yellow transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                                >
                                    {loadingPass ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Settings size={14} className="md:w-4 md:h-4" /></motion.div> : <ShieldCheck size={14} className="md:w-4 md:h-4" />}
                                    ACTUALISER LA SÉCURITÉ
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}
