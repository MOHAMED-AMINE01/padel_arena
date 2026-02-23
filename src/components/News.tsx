import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Calendar, Tag } from 'lucide-react';

const articles = [
  {
    id: 1,
    date: '15 FEV 2026',
    category: 'Compétition',
    title: 'LE TOURNOI P250 VENDÔME OPEN DÉBARQUE CE WEEKEND',
    desc: 'Préparez-vous pour le plus grand événement de la saison. Plus de 32 équipes s\'affronteront pour le titre suprême dans une ambiance survoltée.',
    image: '/pexels-criticalimagery-33226056.jpg',
    featured: true
  },
  {
    id: 2,
    date: '12 FEV 2026',
    category: 'Club',
    title: 'Lancement de l\'Académie Enfants : Les inscriptions sont ouvertes',
    desc: 'Une école de padel dédiée aux 6-16 ans pour former les futurs champions.',
    image: '/pexels-criticalimagery-33226057.jpg',
    featured: false
  },
  {
    id: 3,
    date: '08 FEV 2026',
    category: 'Coaching',
    title: 'Masterclass : Améliorer son smash avec notre coach pro',
    desc: 'Apprenez les secrets du "Par 3" avec nos experts certifiés.',
    image: '/pexels-criticalimagery-32897038.jpg',
    featured: false
  }
];

export const News = () => {
  return (
    <section id="news" className="py-40 px-6 relative overflow-hidden bg-dark-bg">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-padel-blue/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-display font-bold text-padel-blue tracking-[0.5em] uppercase mb-6">Actualités</h2>
            <h3 className="text-6xl md:text-9xl font-display font-black tracking-tighter leading-[0.85]">
              DERNIERS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 italic">SETS</span>
            </h3>
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-4 px-10 py-5 glass rounded-full font-display font-bold hover:bg-white hover:text-black transition-all"
          >
            VOIR TOUT LE BLOG
            <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Featured Article */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 group cursor-pointer"
          >
            <div className="relative aspect-[16/10] rounded-[3rem] overflow-hidden mb-10 shadow-2xl">
              <img 
                src={articles[0].image} 
                alt={articles[0].title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
              <div className="absolute top-10 left-10 glass px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-padel-yellow animate-pulse" />
                À LA UNE
              </div>
            </div>
            
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2 text-padel-yellow font-mono text-sm font-bold">
                <Calendar size={14} />
                {articles[0].date}
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <div className="flex items-center gap-2 text-white/40 font-display font-bold text-xs uppercase tracking-widest">
                <Tag size={14} />
                {articles[0].category}
              </div>
            </div>
            
            <h4 className="text-4xl md:text-6xl font-display font-black mb-6 group-hover:text-padel-yellow transition-colors leading-tight tracking-tighter">
              {articles[0].title}
            </h4>
            <p className="text-xl text-white/40 font-light leading-relaxed max-w-2xl">
              {articles[0].desc}
            </p>
          </motion.div>

          {/* Secondary Articles Column */}
          <div className="lg:col-span-5 flex flex-col gap-16">
            {articles.slice(1).map((news, i) => (
              <motion.div 
                key={news.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group cursor-pointer flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-8 items-start"
              >
                <div className="w-full sm:w-48 lg:w-full xl:w-48 aspect-square shrink-0 rounded-[2rem] overflow-hidden shadow-xl">
                  <img 
                    src={news.image} 
                    alt={news.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-padel-yellow font-mono text-xs font-bold">{news.date}</span>
                    <span className="text-white/20 font-display font-bold text-[10px] uppercase tracking-widest">{news.category}</span>
                  </div>
                  <h4 className="text-2xl font-display font-bold group-hover:text-padel-yellow transition-colors leading-tight mb-4 tracking-tight">
                    {news.title}
                  </h4>
                  <p className="text-sm text-white/30 font-light leading-relaxed line-clamp-2">
                    {news.desc}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-[10px] font-display font-bold tracking-widest text-white/20 group-hover:text-white transition-colors">
                    LIRE LA SUITE
                    <div className="w-4 h-[1px] bg-white/10 group-hover:w-8 group-hover:bg-white transition-all" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
