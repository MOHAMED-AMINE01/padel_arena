import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ContactForm } from '../components/contact/ContactForm';
import { AccessMap } from '../components/contact/AccessMap';
import { FAQSection } from '../components/contact/FAQSection';
import { SupportSection } from '../components/contact/SupportSection';
import { RecruitmentSection } from '../components/contact/RecruitmentSection';

export const ContactPage = () => {
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
      <ContactForm />
      <AccessMap />
      {/* <FAQSection /> */}
      {/* <SupportSection />
      <RecruitmentSection /> */}
    </motion.div>
  );
};
