import React from 'react';
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

export const HomePage = () => {
  return (
    <div className="relative">
      <Hero />
      <Presentation />
      <OurActivities />
      <Activities />
      <Booking />
      {/* <Tournaments /> */}
      <Testimonials />
      {/* <LiveStats /> */}
      <FinalCTA />
      <Infrastructure />
    </div>
  );
};
