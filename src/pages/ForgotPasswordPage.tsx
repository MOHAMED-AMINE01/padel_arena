import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import api from '../lib/api';

export function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await api.post('/auth/forgot-password', { email });
            setSuccess(true);
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
                                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-padel-yellow/20 text-padel-yellow text-[10px] font-bold uppercase tracking-widest mb-4 border border-padel-yellow/30">
                                        Récupération
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-display font-black text-white mb-2 italic leading-[0.95] uppercase tracking-tighter">
                                        Mot de passe<br />oublié ?
                                    </h1>
                                    <p className="text-white/40 text-[12px] leading-relaxed max-w-[280px] mx-auto">
                                        Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
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
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-padel-yellow transition-colors" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Adresse e-mail"
                                            className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-3.5 pl-14 pr-4 focus:outline-none focus:border-padel-yellow/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-white/20 text-sm"
                                            required
                                        />
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-padel-blue text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-padel-blue/90 transition-all disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Envoyer le lien
                                                <ArrowRight size={16} />
                                            </>
                                        )}
                                    </motion.button>
                                </form>

                                <div className="mt-6 text-center">
                                    <Link
                                        to="/auth"
                                        className="inline-flex items-center gap-2 text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                                    >
                                        <ArrowLeft size={14} />
                                        Retour à la connexion
                                    </Link>
                                </div>
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
                                    Email envoyé !
                                </h2>
                                <p className="text-white/40 text-[12px] leading-relaxed max-w-[280px] mx-auto mb-6">
                                    Si un compte existe avec l'email <span className="text-white">{email}</span>, vous recevrez un lien de réinitialisation.
                                </p>
                                <p className="text-white/30 text-[11px] mb-6">
                                    Vérifiez également vos spams.
                                </p>
                                <Link
                                    to="/auth"
                                    className="inline-flex items-center gap-2 text-padel-blue hover:text-padel-blue/80 text-xs font-bold uppercase tracking-widest transition-colors"
                                >
                                    <ArrowLeft size={14} />
                                    Retour à la connexion
                                </Link>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
