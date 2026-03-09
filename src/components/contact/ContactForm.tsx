import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ArrowUpRight, MessageSquare, Instagram, Facebook, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';

const contactInfo = [
  { icon: <MapPin size={24} />, label: "LOCALISATION", value: "123 Avenue du Padel", subValue: "41100 Vendôme, France", link: "https://maps.google.com" },
  { icon: <Phone size={24} />, label: "LIGNE DIRECTE", value: "02 54 XX XX XX", subValue: "Disponibilité immédiate", link: "tel:+33254000000" },
  { icon: <Mail size={24} />, label: "REQUÊTES", value: "contact@padelarena.fr", subValue: "Réponse sous 24h", link: "mailto:contact@padelarena-vendome.fr" },
  { icon: <Clock size={24} />, label: "DISPONIBILITÉ", value: "08:00 — 23:00", subValue: "Sept jours sur sept", link: null },
];

export const ContactForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: 'PRÉSERVATION DE COURT',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/messages/contact', {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 8000);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: 'PRÉSERVATION DE COURT',
        message: ''
      });
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative bg-[#050505] overflow-hidden pt-40 md:pt-60 px-6">
      {/* Editorial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[25%]" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white mr-[25%]" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">

          {/* Left Column: Branding & Info */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-4 mb-8">
                <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">NOUS CONTACTER</span>
              </div>

              <h1 className="text-4xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase mb-12">
                CONTACTEZ <br />
                <span className="text-white italic">LE CLUB</span>
              </h1>

              <p className="text-base md:text-lg text-white/30 font-medium max-w-md mb-16 leading-relaxed mx-auto lg:mx-0">
                Une demande spécifique ? Notre équipe d'experts est à votre disposition pour orchestrer votre expérience Padel Arena.
              </p>

              <div className="grid sm:grid-cols-2 gap-8 mb-16 text-left">
                {contactInfo.map((info, i) => (
                  <div key={i} className="group cursor-default">
                    <div className="flex items-center gap-3 mb-4 text-padel-yellow justify-center sm:justify-start">
                      {info.icon}
                      <span className="text-[9px] font-black tracking-[0.2em] text-white/20 uppercase">{info.label}</span>
                    </div>
                    {info.link ? (
                      <a href={info.link} className="block group/link text-center sm:text-left">
                        <p className="text-md font-display font-black text-white group-hover/link:text-padel-blue transition-colors uppercase leading-none mb-1">
                          {info.value}
                        </p>
                        <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest">{info.subValue}</p>
                      </a>
                    ) : (
                      <div className="text-center sm:text-left">
                        <p className="text-md font-display font-black text-white uppercase leading-none mb-1">{info.value}</p>
                        <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest">{info.subValue}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-10 pt-10 border-t border-white/[0.03] justify-center lg:justify-start">
                <div className="flex gap-6">
                  <Instagram size={20} className="text-white/20 hover:text-padel-blue cursor-pointer transition-colors" />
                  <Facebook size={20} className="text-white/20 hover:text-padel-blue cursor-pointer transition-colors" />
                </div>
                <div className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em]">SOCIAL CONNECT</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Form Container */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass p-10 md:p-16 rounded-[4rem] border-white/5 relative shadow-2xl overflow-hidden"
            >
              {/* Form decor */}
              <div className="absolute top-0 right-0 p-16 opacity-[0.02] text-[15rem] font-display font-black select-none pointer-events-none -z-0">
                @
              </div>

              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    onSubmit={handleSubmit}
                    className="relative z-10 space-y-10"
                  >
                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">PRÉNOM</label>
                        <input
                          required
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-sm font-bold text-white focus:border-padel-yellow focus:outline-none transition-all placeholder:text-white/5 uppercase"
                          placeholder="JEAN"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">NOM</label>
                        <input
                          required
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-sm font-bold text-white focus:border-padel-yellow focus:outline-none transition-all placeholder:text-white/5 uppercase"
                          placeholder="DUPONT"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">EMAIL BUSINESS</label>
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-sm font-bold text-white focus:border-padel-yellow focus:outline-none transition-all placeholder:text-white/5 uppercase"
                          placeholder="JEAN@ARENA.FR"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">MOBILE</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-sm font-bold text-white focus:border-padel-yellow focus:outline-none transition-all placeholder:text-white/5 uppercase"
                          placeholder="+33 XX XX XX XX"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">OBJET DE LA DEMANDE</label>
                      <div className="relative">
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-sm font-bold text-white focus:border-padel-yellow focus:outline-none transition-all appearance-none uppercase"
                        >
                          <option className="bg-[#111]">PRÉSERVATION DE COURT</option>
                          <option className="bg-[#111]">COACHING & ACADÉMIE</option>
                          <option className="bg-[#111]">OFFRES CORPORATE</option>
                          <option className="bg-[#111]">ÉVÉNEMENTIEL</option>
                          <option className="bg-[#111]">AUTRE</option>
                        </select>
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                          <ArrowUpRight size={16} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">MESSAGE</label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 px-8 text-sm font-bold text-white focus:border-padel-yellow focus:outline-none transition-all resize-none placeholder:text-white/5 uppercase"
                        placeholder="DÉTAILLEZ VOTRE DEMANDE ICI..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full group relative py-6 bg-padel-blue text-white rounded-full font-black text-[11px] uppercase tracking-[0.4em] overflow-hidden shadow-2xl transition-all disabled:opacity-50"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-4 group-hover:text-padel-blue transition-colors">
                        {isSubmitting ? (
                          <>SYNCHRONISATION... <Loader2 size={16} className="animate-spin" /></>
                        ) : (
                          <>INITIER LE CONTACT <Send size={16} /></>
                        )}
                      </span>
                      {!isSubmitting && <div className="absolute inset-0 bg-padel-yellow translate-y-full group-hover:translate-y-0 transition-transform duration-500" />}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-24 md:py-32"
                  >
                    <div className="w-24 h-24 rounded-full bg-padel-blue/10 flex items-center justify-center text-padel-blue mb-10 shadow-[0_0_50px_rgba(19,73,211,0.2)]">
                      <CheckCircle2 size={48} />
                    </div>
                    <h4 className="text-3xl md:text-5xl font-display font-black mb-6 uppercase tracking-tight">TRANSMISSION RÉUSSIE</h4>
                    <p className="text-white/30 text-sm md:text-base max-w-xs font-medium uppercase tracking-widest leading-loose">
                      NOTRE ÉQUIPE D'EXPERTS <br /> VOUS CONTACTERA <br /> SOUS 24 HEURES.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative background text */}
      <div className="absolute bottom-10 right-10 text-[15rem] font-display font-black text-white/[0.01] tracking-tighter select-none pointer-events-none -z-0 leading-none uppercase">
        CONTACT
      </div>
    </section>
  );
};
