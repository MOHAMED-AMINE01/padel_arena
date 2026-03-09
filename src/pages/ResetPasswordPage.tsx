import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, ArrowRight, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import api from '../lib/api';

export function ResetPasswordPage() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setIsLoading(true);

        try {
            await api.post(`/auth/reset-password/${token}`, { password });
            setSuccess(true);
            // Redirect to login after 3 seconds
            setTimeout(() => navigate('/auth'), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-dark-bg min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow relative flex items-center justify-center overflow-hidden pt-20">
                {/* Background gradient */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-padel-blue/20 rounded-full blur-[128px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-padel-yellow/10 rounded-full blur-[128px]" />
                </div>

                <div className="relative z-10 w-full max-w-[440px] p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white/[0.02] border border-white/10 rounded-[2.8rem] p-6 md:p-9 backdrop-blur-md shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
                    >
                        {/* Logo */}
                        <div className="mb-5 flex justify-center">
                            <Link to="/">
                                <motion.img
                                    src="/IMAGES/newLogo_tr.png"
                                    alt="Logo"
                                    className="h-18 drop-shadow-[0_0_20px_rgba(19,73,211,0.2)]"
                                    whileHover={{ scale: 1.05 }}
                                />
                            </Link>
                        </div>

                        {!success ? (
                            <>
                                <div className="mb-6 text-center">
                                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-padel-blue/20 text-padel-blue text-[10px] font-bold uppercase tracking-widest mb-4 border border-padel-blue/30">
                                        Nouveau mot de passe
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-display font-black text-white mb-2 italic leading-[0.95] uppercase tracking-tighter">
                                        Créez votre<br />nouveau mot de passe
                                    </h1>
                                    <p className="text-white/40 text-[12px] leading-relaxed max-w-[280px] mx-auto">
                                        Choisissez un mot de passe sécurisé d'au moins 6 caractères.
                                    </p>
                                </div>

                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-[11px] font-bold uppercase tracking-widest text-center"
                                        >
                                            {error}
                                        </motion.div>
                                    )}

                                    <div className="relative group">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-padel-yellow transition-colors" size={18} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Nouveau mot de passe"
                                            className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-3.5 pl-14 pr-12 focus:outline-none focus:border-padel-yellow/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-white/20 text-sm"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    <div className="relative group">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-padel-yellow transition-colors" size={18} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirmer le mot de passe"
                                            className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-3.5 pl-14 pr-4 focus:outline-none focus:border-padel-yellow/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-white/20 text-sm"
                                            required
                                        />
                                    </div>

                                    {/* Password strength indicator */}
                                    {password && (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                {password.length >= 6 ? (
                                                    <CheckCircle className="text-green-500" size={14} />
                                                ) : (
                                                    <XCircle className="text-red-500" size={14} />
                                                )}
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${password.length >= 6 ? 'text-green-500' : 'text-red-500'}`}>
                                                    Au moins 6 caractères
                                                </span>
                                            </div>
                                            {confirmPassword && (
                                                <div className="flex items-center gap-2">
                                                    {password === confirmPassword ? (
                                                        <CheckCircle className="text-green-500" size={14} />
                                                    ) : (
                                                        <XCircle className="text-red-500" size={14} />
                                                    )}
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${password === confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                                                        Les mots de passe correspondent
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={isLoading || password.length < 6 || password !== confirmPassword}
                                        className="w-full bg-padel-blue text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-padel-blue/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Réinitialiser
                                                <ArrowRight size={16} />
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-6"
                            >
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="text-green-500" size={32} />
                                </div>
                                <h2 className="text-xl font-display font-black text-white mb-3 italic uppercase tracking-tighter">
                                    Mot de passe modifié !
                                </h2>
                                <p className="text-white/40 text-[12px] leading-relaxed max-w-[280px] mx-auto mb-6">
                                    Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion.
                                </p>
                                <div className="w-8 h-8 border-2 border-padel-blue/20 border-t-padel-blue rounded-full animate-spin mx-auto" />
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
