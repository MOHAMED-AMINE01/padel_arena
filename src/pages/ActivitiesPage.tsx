import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Seo } from '../components/Seo';
import { webPageJsonLd } from '../lib/seo';
import { ActivitiesHero } from '../components/activities/ActivitiesHero';
import { Coaching } from '../components/activities/Coaching';
import { TournamentsSection } from '../components/activities/TournamentsSection';
import { Events } from '../components/activities/Events';
import { Services } from '../components/activities/Services';
import { Pricing } from '../components/activities/Pricing';
import { Corporate } from '../components/activities/Corporate';

export const ActivitiesPage = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="overflow-x-hidden"
    >
      <Seo
        title="Activités & Cours — Padel, Badminton & Golf"
        description="Padel, badminton, simulateur de golf, cours particuliers, stages, tournois et événements d'entreprise à Vendôme. Toutes les activités du Padel Arena Vendôme pour jouer, progresser et s'amuser."
        path="/activites"
        breadcrumbs={[
          { name: 'Accueil', path: '/' },
          { name: 'Activités', path: '/activites' },
        ]}
        jsonLd={webPageJsonLd({
          path: '/activites',
          name: 'Activités & Cours — Padel Arena Vendôme',
          description:
            'Padel, badminton, simulateur de golf, coaching, stages, tournois et offres entreprise à Vendôme.',
        })}
      />
      <ActivitiesHero />
      <Coaching />
      {/* <TournamentsSection /> */}

      <Services />
      <Events />
      {/* <Pricing /> */}
      {/* <Corporate /> */}
    </motion.div>
  );
};
