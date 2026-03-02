import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Spline from '@splinetool/react-spline';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, X, Sparkles, Phone, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { cn } from '../lib/utils';

import { useAuth } from '../context/AuthContext';

export function AuthPage() {
    const navigate = useNavigate();
    const { login, register, googleLogin } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            setError('');
            try {
                // In some cases we might need the ID token, but here we'll assume the backend
                // can verify the access token or we get the id_token if configured.
                // Actually, react-oauth/google by default gives access_token.
                // Let's use the credential response if we used GoogleLogin component, 
                // but with hook it's different.

                // Let's fetch user info from Google to get the email/id if needed, 
                // but usually the backend should verify the token.
                // For safety, let's use the ID token if we can.
                // Actually, the simplest way is to pass the access_token and let backend verify it via Google API.

                const data = await googleLogin(tokenResponse.access_token);
                if (data?.user?.role === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } catch (err: any) {
                setError('La connexion Google a échoué. Veuillez réessayer.');
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => setError('La connexion Google a échoué.')
    });

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setName('');
        setPhone('');
        setAddress('');
        setPassword('');
        setConfirmPassword('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            let loggedUser;
            if (isLogin) {
                loggedUser = await login({ email, password });
            } else {
                if (password !== confirmPassword) {
                    setError('Les mots de passe ne correspondent pas.');
                    setIsLoading(false);
                    return;
                }
                loggedUser = await register({ name, email, password, phone, address });
            }

            // On success, navigate based on role returned from the context call
            if (loggedUser?.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'authentification.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#020617] min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow relative flex items-center justify-center lg:justify-end overflow-hidden pt-20">
                {/* SECTION ANIMATION : Spline restauré avec fond de secours stable */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#020617]">
                    <div className="w-full h-full scale-[1.25] lg:scale-[1.3] translate-y-[3%] translate-x-[-10%] lg:translate-x-[-15%]">
                        <Spline
                            scene="https://prod.spline.design/Y6Vw5mezHebP93rh/scene.splinecode"
                            className="w-full h-full"
                        />
                    </div>
                    {/* Filtre pour assombrir légèrement le fond et aider la lisibilité */}
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                {/* SECTION FORMULAIRE : Transparent, 40% de width en desktop, décalé vers la gauche */}
                <div className="relative z-10 w-full lg:w-[40%] flex items-center justify-center p-6 lg:p-12 xl:p-20 lg:mr-[5%]">
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                        className="w-full max-w-[440px] bg-white/[0.02] border border-white/10 rounded-[2.8rem] p-6 md:p-9 backdrop-blur-md relative shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
                    >
                        {/* Logo Section */}
                        <div className="mb-5 flex justify-center">
                            <Link to="/">
                                <motion.img
                                    src="/IMAGES/logo_tr.png"
                                    alt="Logo"
                                    className="h-28 md:h-36 drop-shadow-[0_0_40px_rgba(19,73,211,0.4)] object-contain"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    whileHover={{ scale: 1.1, rotate: -2 }}
                                    transition={{ 
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 15 
                                    }}
                                />
                            </Link>
                        </div>

                        <div className="mb-6 text-center">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-padel-blue/20 text-padel-blue text-[10px] font-bold uppercase tracking-widest mb-4 border border-padel-blue/30">
                                {isLogin ? 'Connexion' : 'Inscription'}
                            </div>
                            <h1 className="text-2xl md:text-4xl font-display font-black text-white mb-2 italic leading-[0.9] uppercase tracking-tighter">
                                {isLogin ? 'Bon retour \nau club' : 'Rejoignez \nl\'arène'}
                            </h1>
                            <p className="text-white/40 text-[12px] leading-relaxed max-w-[280px] mx-auto">
                                {isLogin
                                    ? 'Accédez à votre espace membre et à vos réservations.'
                                    : 'Créez votre profil pour commencer l\'aventure Padel Arena.'}
                            </p>
                        </div>

                        <form className="space-y-3.5" onSubmit={handleSubmit}>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-[11px] font-bold uppercase tracking-widest text-center"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <AnimatePresence mode="wait">
                                {!isLogin && (
                                    <motion.div
                                        key="register-fields"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-3.5"
                                    >
                                        <div className="relative group">
                                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-padel-yellow transition-colors" size={18} />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Nom complet"
                                                className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-3.5 pl-14 pr-4 focus:outline-none focus:border-padel-yellow/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-white/20 text-sm"
                                                required={!isLogin}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3.5">
                                            <div className="relative group">
                                                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-padel-yellow transition-colors" size={18} />
                                                <input
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    placeholder="Téléphone"
                                                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-3.5 pl-14 pr-4 focus:outline-none focus:border-padel-yellow/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-white/20 text-sm"
                                                />
                                            </div>
                                            <div className="relative group">
                                                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-padel-yellow transition-colors" size={18} />
                                                <input
                                                    type="text"
                                                    value={address}
                                                    onChange={(e) => setAddress(e.target.value)}
                                                    placeholder="Ville / Adresse"
                                                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-3.5 pl-14 pr-4 focus:outline-none focus:border-padel-yellow/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-white/20 text-sm"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

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

                            <div className={cn(!isLogin ? "grid grid-cols-2 gap-3.5" : "space-y-3.5")}>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-padel-yellow transition-colors" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Mot de passe"
                                        className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-3.5 pl-14 pr-10 focus:outline-none focus:border-padel-yellow/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-white/20 text-sm"
                                        required
                                    />
                                    {isLogin && (
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors p-1"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    )}
                                </div>

                                {!isLogin && (
                                    <div className="relative group">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-padel-yellow transition-colors" size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirmer"
                                            className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-3.5 pl-14 pr-4 focus:outline-none focus:border-padel-yellow/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-white/20 text-sm"
                                            required={!isLogin}
                                        />
                                    </div>
                                )}
                            </div>

                            {isLogin && (
                                <div className="flex justify-end pr-2 font-display">
                                    <Link to="/forgot-password" className="text-[10px] text-padel-yellow/60 hover:text-padel-yellow transition-all uppercase font-black tracking-[0.2em]">
                                        Oublié ?
                                    </Link>
                                </div>
                            )}

                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(255, 210, 31, 0.3)" }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-padel-blue text-padel-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-4 group transition-all mt-2 uppercase text-[11px] tracking-[0.2em] disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {isLogin ? 'Se connecter' : 'Valider'}
                                        <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        <div className="mt-8">
                            <div className="relative flex items-center mb-6 text-white/10 overflow-hidden">
                                <div className="flex-grow border-t border-current opacity-30"></div>
                                <span className="mx-4 text-[9px] uppercase tracking-[0.4em] font-black whitespace-nowrap opacity-50">Ou avec</span>
                                <div className="flex-grow border-t border-current opacity-30"></div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                onClick={() => handleGoogleLogin()}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-4 bg-white/5 border border-white/10 py-4 rounded-2xl transition-all font-bold disabled:opacity-50"
                            >
                                <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-5 h-5" />
                                <span className="text-[11px] uppercase tracking-widest font-black text-white/90">Continuer avec Google</span>
                            </motion.button>

                            <p className="mt-8 text-center text-white/30 text-[11px] font-black uppercase tracking-widest leading-loose">
                                {isLogin ? "Pas d'accès ?" : "Inscrit ?"}{' '}
                                <button
                                    onClick={toggleAuthMode}
                                    className="text-white hover:text-padel-yellow transition-all ml-1 underline underline-offset-8 decoration-padel-blue/40"
                                >
                                    {isLogin ? "S'inscrire" : "Se connecter"}
                                </button>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
