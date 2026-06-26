import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Seo } from '../components/Seo';
import { webPageJsonLd } from '../lib/seo';
import { CourtPricing } from '../components/pricing/CourtPricing';
import { PricingHero } from '../components/pricing/PricingHero';
import { SubscriptionPlans } from '../components/pricing/SubscriptionPlans';
import { WalletBonus } from '../components/pricing/WalletBonus';
import { UserSubscriptionStatus } from '../components/pricing/UserSubscriptionStatus';

export const PricingPage = () => {
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
                title="Tarifs & Abonnements"
                description="Tarifs du Padel Arena Vendôme : location de terrains de padel, abonnements, packs Arena Wallet et formules avantageuses. Des prix transparents pour jouer au padel à Vendôme (41100)."
                path="/tarifs"
                breadcrumbs={[
                    { name: 'Accueil', path: '/' },
                    { name: 'Tarifs', path: '/tarifs' },
                ]}
                jsonLd={webPageJsonLd({
                    path: '/tarifs',
                    name: 'Tarifs & Abonnements — Padel Arena Vendôme',
                    description:
                        'Location de terrains, abonnements et packs Arena Wallet au Padel Arena Vendôme.',
                })}
            />
            <PricingHero />

            {/* User Personal Status (Visible only if logged in) */}
            {/* <UserSubscriptionStatus /> */}

            <CourtPricing />
            <SubscriptionPlans />
            <WalletBonus />
        </motion.div>
    );
};
