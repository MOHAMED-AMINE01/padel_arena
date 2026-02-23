import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { CourtBooking } from '../components/booking/CourtBooking';
import { RealTimePlanning } from '../components/booking/RealTimePlanning';
import { Matchmaking } from '../components/booking/Matchmaking';
import { CoachingBooking } from '../components/booking/CoachingBooking';
import { BookingHistory } from '../components/booking/BookingHistory';
import { BookingManagement } from '../components/booking/BookingManagement';

export const BookingPage = () => {
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
      <CourtBooking />
      {/* <RealTimePlanning /> */}
      {/* <Matchmaking /> */}
      {/* <CoachingBooking />
      <BookingHistory />
      <BookingManagement /> */}
    </motion.div>
  );
};
