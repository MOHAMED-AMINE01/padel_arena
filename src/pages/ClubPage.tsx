import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Seo } from '../components/Seo';
import { webPageJsonLd } from '../lib/seo';
import { ClubHero } from '../components/club/ClubHero';
import { ClubConcept } from '../components/club/ClubConcept';
import { ClubStats } from '../components/club/ClubStats';
import { ClubWhyUs } from '../components/club/ClubWhyUs';
import { ClubInstallations } from '../components/club/ClubInstallations';
import { ClubTeam } from '../components/club/ClubTeam';
import { ClubValues } from '../components/club/ClubValues';
import { ClubGallery } from '../components/club/ClubGallery';
import { ClubVirtualTour } from '../components/club/ClubVirtualTour';

export const ClubPage = () => {
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
        title="Le Club — Concept, Installations & Équipe"
        description="Découvrez Padel Arena Vendôme : un complexe sportif premium dédié au padel, au badminton et au golf indoor. Notre concept, nos installations, notre équipe et nos valeurs à Vendôme (41100)."
        path="/le-club"
        breadcrumbs={[
          { name: 'Accueil', path: '/' },
          { name: 'Le Club', path: '/le-club' },
        ]}
        jsonLd={webPageJsonLd({
          path: '/le-club',
          name: 'Le Club — Padel Arena Vendôme',
          description:
            'Le concept, les installations, l’équipe et les valeurs du Padel Arena Vendôme.',
        })}
      />
      <ClubHero />
      <ClubConcept />
      <ClubStats />
      <ClubWhyUs />
      {/* <ClubInstallations /> */}
      <ClubTeam />
      {/* <ClubValues /> */}
      <ClubGallery />
      {/* <ClubVirtualTour /> */}
    </motion.div>
  );
};
