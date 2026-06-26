import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Seo } from '../components/Seo';
import { webPageJsonLd } from '../lib/seo';
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
      <Seo
        title="Contact & Accès"
        description="Contactez le Padel Arena Vendôme : adresse, plan d'accès, horaires et formulaire. Téléphone 06 95 59 04 49. Rejoignez-nous à Vendôme (41100)."
        path="/contact"
        breadcrumbs={[
          { name: 'Accueil', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
        jsonLd={webPageJsonLd({
          path: '/contact',
          name: 'Contact & Accès — Padel Arena Vendôme',
          description:
            'Coordonnées, plan d’accès et formulaire de contact du Padel Arena Vendôme.',
        })}
      />
      <ContactForm />
      <AccessMap />
      {/* <FAQSection /> */}
      {/* <SupportSection />
      <RecruitmentSection /> */}
    </motion.div>
  );
};
