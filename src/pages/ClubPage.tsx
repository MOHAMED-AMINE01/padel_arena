import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
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
