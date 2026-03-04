import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ActivitiesHero } from '../components/activities/ActivitiesHero';
import { Coaching } from '../components/activities/Coaching';
import { TournamentsSection } from '../components/activities/TournamentsSection';
import { Events } from '../components/activities/Events';
import { Academy } from '../components/activities/Academy';
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
      <ActivitiesHero />
      <Coaching />
      {/* <TournamentsSection /> */}
      <Events />
      <Academy />
      <Services />
      <Pricing />
      {/* <Corporate /> */}
    </motion.div>
  );
};
