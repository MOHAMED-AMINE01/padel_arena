import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Zap, Target, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

export const NotFoundPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Cinematic Video/Ambience */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover grayscale blur-[2px] scale-110"
        >
          <source src="/VIDEOS/Vidéo-non-prioritaire.MOV" type="video/quicktime" />
          <source src="/VIDEOS/Vidéo-non-prioritaire.MOV" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]" />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[25%]" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white mr-[25%]" />
        </div>
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-padel-blue/10 rounded-full blur-[150px] animate-pulse pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl text-center flex flex-col items-center">
        {/* Giant Text Effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="relative inline-block mb-12"
        >
          <h1 className="text-[14rem] md:text-[24rem] font-display font-black text-white/[0.03] leading-none tracking-tighter italic select-none">
            404
          </h1>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <motion.div
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.4 }}
               className="flex flex-col items-center"
             >
               <div className="w-20 h-20 rounded-3xl bg-padel-blue/20 flex items-center justify-center text-padel-blue mb-8 border border-padel-blue/30 shadow-[0_0_30px_rgba(19,73,211,0.3)] animate-bounce-slow">
                 <Search size={40} />
               </div>
               
               <h2 className="text-5xl md:text-8xl font-display font-black text-white uppercase tracking-tighter italic leading-none mb-4">
                 BALLE <span className="text-padel-blue">FAUTE</span>
               </h2>
               
               <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-padel-yellow to-transparent mb-4" />
               
               <p className="text-[10px] md:text-xs font-black text-padel-yellow uppercase tracking-[0.5em] italic">
                 OUT OF BOUNDS • SESSION TERMINATED
               </p>
             </motion.div>
          </div>
        </motion.div>

        {/* Description & Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-xl"
        >
          <p className="text-white/40 text-sm md:text-base font-medium tracking-wide leading-relaxed mb-12">
            La trajectoire n'était pas la bonne. La page que vous tentez d'atteindre est restée dans le filet ou n'a jamais décollé.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'}
              className="group relative w-full sm:w-auto px-10 py-6 bg-padel-blue text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] overflow-hidden shadow-2xl transition-all hover:scale-105"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                <Home size={16} />
                MON PANEL {user?.role === 'ADMIN' ? 'ADMIN' : 'JOUEUR'}
              </div>
              <div className="absolute inset-0 bg-padel-yellow translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-6 rounded-2xl bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white/10 hover:text-white transition-all group shadow-xl"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              REVENIR EN ARRIÈRE
            </button>
          </div>

          <div className="mt-20 pt-10 border-t border-white/5 flex items-center justify-center gap-10 opacity-20">
             <div className="flex items-center gap-3">
               <Target size={14} />
               <span className="text-[9px] font-black uppercase tracking-[0.2em]">Cible Manquée</span>
             </div>
             <div className="flex items-center gap-3">
               <Zap size={14} />
               <span className="text-[9px] font-black uppercase tracking-[0.2em]">Erreur Réseau</span>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Structural Decor */}
      <div className="absolute top-1/2 -left-40 text-[10rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -rotate-90 leading-none">
        NOT FOUND
      </div>
    </div>
  );
};
