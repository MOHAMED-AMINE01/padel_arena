import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Clock, Users, ChevronRight, CheckCircle2, MapPin, ArrowRight, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

export const Booking = () => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<number | null>(null);
  const [players, setPlayers] = useState(4);

  const timeSlots = [
    '09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30', '21:00'
  ];

  const courts = [
    { id: 1, name: "CENTRAL PANORAMIC", tag: "PRO", price: 40 },
    { id: 2, name: "ARENA INDOOR #2", tag: "PREMIUM", price: 35 },
    { id: 3, name: "CLASSIC COURT #3", tag: "STANDARD", price: 30 },
    { id: 4, name: "OUTDOOR VISTA", tag: "OPEN AIR", price: 30 },
  ];

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <section id="club" className="relative py-24 md:py-40 px-6 overflow-hidden bg-dark-bg">
      {/* Editorial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="max-w-[1400px] mx-auto h-full w-full flex justify-between border-x border-white">
          <div className="w-[1px] h-full bg-white ml-[25%]" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white mr-[25%]" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 xl:gap-24 items-start">

          {/* Left Content - Sticky Info (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="inline-flex items-center gap-4 mb-8">
                <span className="text-[10px] font-black tracking-[0.4em] text-padel-blue uppercase">RÉSERVATION LIVE</span>
              </div>

              <h2 className="text-5xl md:text-7xl xl:text-8xl font-display font-black mb-8 leading-[0.9] tracking-tighter uppercase">
                DOMINEZ <br />
                <span className="text-padel-blue italic">L'ARÈNE</span>
              </h2>

              <p className="text-base md:text-lg text-white/40 mb-12 font-medium leading-relaxed max-w-md">
                Accédez à nos terrains de classe mondiale. Notre système de réservation temps réel vous garantit une place au cœur de l'action.
              </p>

              {/* Quick Info Box */}
              <div className="hidden lg:block glass p-8 rounded-[2rem] border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-padel-blue/20 flex items-center justify-center text-padel-blue">
                    <Zap size={20} />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-widest">Disponibilité Immédiate</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black tracking-widest uppercase">
                    <span className="text-white/20">Aujourd'hui</span>
                    <span className="text-padel-yellow">12 Créneaux Libres</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-padel-blue" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Booking Engine (7 cols) */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="glass rounded-[2.5rem] md:rounded-[4rem] border-white/10 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.4)]"
            >
              {/* Custom Header Flow */}
              <div className="px-8 md:px-12 py-8 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
                <div className="flex gap-4">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={cn(
                        "h-1 rounded-full transition-all duration-700",
                        step === s ? "w-12 bg-padel-yellow" : "w-4 bg-white/10",
                        step > s && "bg-padel-blue"
                      )}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">ÉTAPE 0{step} / 03</span>
              </div>

              <div className="p-8 md:p-14 min-h-[500px] flex flex-col">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-12 flex-grow"
                    >
                      <section>
                        <h4 className="text-sm font-black tracking-[0.2em] uppercase text-white/20 mb-8 flex items-center gap-3">
                          <CalendarIcon size={14} className="text-padel-blue" /> 01. SÉLECTION DE LA DATE
                        </h4>
                        <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                          {[...Array(7)].map((_, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() + i);
                            const dateStr = date.toISOString().split('T')[0];
                            const isSelected = selectedDate === dateStr;
                            return (
                              <button
                                key={i}
                                onClick={() => setSelectedDate(dateStr)}
                                className={cn(
                                  "flex flex-col items-center py-5 rounded-2xl transition-all duration-500",
                                  isSelected ? "bg-padel-blue text-white shadow-xl" : "bg-white/5 hover:bg-white/10 text-white/40"
                                )}
                              >
                                <span className="text-[9px] uppercase font-black mb-1">{date.toLocaleDateString('fr-FR', { weekday: 'short' })}</span>
                                <span className="text-xl font-display font-black">{date.getDate()}</span>
                              </button>
                            );
                          })}
                        </div>
                      </section>

                      <section>
                        <h4 className="text-sm font-black tracking-[0.2em] uppercase text-white/20 mb-8 flex items-center gap-3">
                          <Clock size={14} className="text-padel-blue" /> 02. CHOIX DU CRÉNEAU
                        </h4>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                          {timeSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={cn(
                                "py-4 rounded-xl font-black text-xs transition-all duration-300",
                                selectedTime === time
                                  ? "bg-padel-yellow text-black scale-105"
                                  : "bg-white/5 hover:bg-white/10 text-white/40"
                              )}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </section>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-10 flex-grow"
                    >
                      <section>
                        <h4 className="text-sm font-black tracking-[0.2em] uppercase text-white/20 mb-8 flex items-center gap-3">
                          <MapPin size={14} className="text-padel-blue" /> 03. TERRAIN & CONFIGURATION
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {courts.map((court) => (
                            <button
                              key={court.id}
                              onClick={() => setSelectedCourt(court.id)}
                              className={cn(
                                "p-6 rounded-3xl border transition-all duration-500 text-left relative overflow-hidden group",
                                selectedCourt === court.id
                                  ? "bg-padel-blue/10 border-padel-blue"
                                  : "bg-white/5 border-white/5 hover:border-white/20"
                              )}
                            >
                              <div className="flex justify-between items-start mb-4">
                                <span className="text-[9px] font-black text-padel-blue tracking-widest uppercase">{court.tag}</span>
                                <span className="text-lg font-black text-white">{court.price}€</span>
                              </div>
                              <h5 className="text-xl font-display font-black text-white mb-1 uppercase">{court.name}</h5>
                              <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Gazon WPT • LED Pro</p>

                              {selectedCourt === court.id && (
                                <div className="absolute top-0 right-0 p-2">
                                  <div className="w-2 h-2 rounded-full bg-padel-blue" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </section>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="bg-white/5 p-6 rounded-3xl">
                          <h5 className="text-[10px] font-black tracking-widest text-white/30 mb-4 uppercase">Joueurs</h5>
                          <div className="flex gap-4">
                            {[2, 4].map(n => (
                              <button
                                key={n}
                                onClick={() => setPlayers(n)}
                                className={cn(
                                  "flex-1 py-3 rounded-xl font-black text-xs transition-all",
                                  players === n ? "bg-padel-blue text-white" : "bg-white/5 hover:bg-white/10"
                                )}
                              >
                                {n} PERS.
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white/5 p-6 rounded-3xl">
                          <h5 className="text-[10px] font-black tracking-widest text-white/30 mb-4 uppercase">Durée</h5>
                          <div className="flex gap-4">
                            {['60MIN', '90MIN'].map(d => (
                              <button key={d} className="flex-1 py-3 rounded-xl bg-white/5 font-black text-xs hover:bg-white/10 transition-all">
                                {d}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-10 flex-grow flex flex-col items-center justify-center"
                    >
                      <div className="w-24 h-24 bg-padel-yellow rounded-full flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(255,210,31,0.3)]">
                        <CheckCircle2 size={48} className="text-black" />
                      </div>
                      <h4 className="text-4xl md:text-5xl font-display font-black mb-4 tracking-tighter uppercase">RÈGLEMENT CONFIRMÉ</h4>
                      <p className="text-sm text-white/30 mb-12 max-w-xs mx-auto font-medium leading-relaxed">
                        Votre créneau est désormais réservé. Le code d'accès vous a été envoyé par SMS.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Footer Actions */}
                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                  {step < 3 ? (
                    <>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Total Estimé</span>
                        <div className="text-3xl font-display font-black text-white">40,00€</div>
                      </div>
                      <div className="flex gap-4 w-full sm:w-auto">
                        {step > 1 && (
                          <button
                            onClick={prevStep}
                            className="flex-1 sm:flex-none px-8 py-4 rounded-2xl bg-white/5 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                          >
                            RETOUR
                          </button>
                        )}
                        <button
                          onClick={nextStep}
                          disabled={step === 1 && !selectedTime}
                          className={cn(
                            "flex-1 sm:flex-none px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all",
                            selectedTime || step > 1 ? "bg-padel-blue text-white hover:scale-105" : "bg-white/5 text-white/20 cursor-not-allowed"
                          )}
                        >
                          ÉTAPE SUIVANTE <ArrowRight size={14} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => setStep(1)}
                      className="w-full py-5 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-padel-yellow transition-all"
                    >
                      EFFECTUER UNE AUTRE RÉSERVATION
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Background Decor Text */}
      <div className="absolute -top-20 -right-20 text-[15rem] font-display font-black text-white/[0.01] select-none pointer-events-none -z-10 uppercase">
        BOOKING
      </div>
    </section>
  );
};
