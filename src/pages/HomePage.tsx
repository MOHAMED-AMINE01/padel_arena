import React from 'react';
import { Seo } from '../components/Seo';
import { webPageJsonLd } from '../lib/seo';
import { Hero } from '../components/Hero';
import { Presentation } from '../components/Presentation';
import { OurActivities } from '../components/OurActivities';
import { Infrastructure } from '../components/Infrastructure';
import { Activities } from '../components/Activities';
import { Booking } from '../components/Booking';
import { Tournaments } from '../components/Tournaments';
import { Testimonials } from '../components/Testimonials';
import { LiveStats } from '../components/LiveStats';
import { FinalCTA } from '../components/FinalCTA';
import { ClubHouse } from '../components/ClubHouse';
import { GolfSection } from '../components/activities/GolfSection';

export const HomePage = () => {
  return (
    <div className="relative">
      <Seo
        rawTitle
        title="Padel Arena Vendôme — Club de Padel, Badminton & Golf Indoor (41100)"
        path="/"
        jsonLd={webPageJsonLd({
          path: '/',
          name: 'Padel Arena Vendôme',
          description:
            "Club de padel premium à Vendôme : padel, badminton, simulateur de golf et club house. Réservation de terrains 24h/24.",
        })}
      />
      <Hero />
      <Presentation />
      <OurActivities />
      <Activities />
      <GolfSection />
      <Booking />
      <ClubHouse />
      {/* <Tournaments /> */}
      <Testimonials />
      {/* <LiveStats /> */}
      <FinalCTA />
      <Infrastructure />
    </div>
  );
};
