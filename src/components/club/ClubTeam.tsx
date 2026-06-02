import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Linkedin, ArrowUpRight } from 'lucide-react';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  socialLinks: {
    linkedin: string;
    instagram: string;
    email: string;
  };
}

const team: TeamMember[] = [
  {
    _id: 'frederic',
    name: 'Frédéric',
    role: 'Gérant',
    image: '',
    bio: '',
    socialLinks: { linkedin: '', instagram: '', email: '' },
  },
  {
    _id: 'kyllian',
    name: 'Kyllian',
    role: 'Événementiel',
    image: '',
    bio: '',
    socialLinks: { linkedin: '', instagram: '', email: '' },
  },
  {
    _id: 'simon',
    name: 'Simon',
    role: 'Alternant Communication & Prof de Padel',
    image: '',
    bio: '',
    socialLinks: { linkedin: '', instagram: '', email: '' },
  },
];

export const ClubTeam = () => {
  return (
    <section id="equipe" className="relative py-24 md:py-24 px-6 bg-[#050505] overflow-hidden">
      {/* Structural Lines */}
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-white opacity-[0.02] -z-10" />
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-white opacity-[0.02] -z-10" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 mb-16 md:mb-24 text-center lg:text-left">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-4 mb-8">
              <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">NOTRE EXPERTISE</span>
            </div>
            <h3 className="text-4xl sm:text-5xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase text-white">
              DES PASSIONNÉS <br />
              <span className="text-white italic">À VOTRE SERVICE</span>
            </h3>
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto justify-items-center">
            {team.map((member, i) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="w-full max-w-sm h-full flex flex-col group relative"
              >
                <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-8 border border-white/5">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/[0.04] to-white/[0.01]">
                      <motion.span
                        animate={{ scale: [1, 1.12, 1], opacity: [0.25, 0.6, 0.25] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-7xl md:text-8xl font-display font-black text-padel-blue/60 select-none"
                      >
                        ?
                      </motion.span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent group-hover:opacity-0 transition-opacity duration-700" />

                  {/* Hover Reveal Socials */}
                  <div className="absolute inset-0 bg-[#050505]/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-6">
                    <div className="flex gap-4">
                      {member.socialLinks?.instagram && (
                        <a
                          href={member.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-padel-blue hover:border-padel-blue transition-all"
                        >
                          <Instagram size={20} />
                        </a>
                      )}
                      {member.socialLinks?.linkedin && (
                        <a
                          href={member.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-padel-blue hover:border-padel-blue transition-all"
                        >
                          <Linkedin size={20} />
                        </a>
                      )}
                    </div>
                    {member.socialLinks?.email && (
                      <a
                        href={`mailto:${member.socialLinks.email}`}
                        className="px-6 py-2.5 bg-white text-black rounded-full font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-padel-blue hover:text-white transition-all"
                      >
                        CONTACTER <ArrowUpRight size={12} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl md:text-2xl font-display font-black text-white group-hover:text-padel-blue transition-colors">{member.name}</h4>
                    <div className="w-6 h-[1px] bg-white/10 group-hover:w-10 group-hover:bg-padel-blue transition-all" />
                  </div>
                  <p className="text-padel-blue font-display font-black text-[10px] uppercase tracking-[0.3em]">{member.role}</p>
                  <p className="text-xs md:text-sm text-white/30 font-medium leading-[1.6] group-hover:text-white/50 transition-colors">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>


    </section>
  );
};
