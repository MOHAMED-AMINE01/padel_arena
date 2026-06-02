import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { CourtPricing } from '../components/pricing/CourtPricing';
import { PricingHero } from '../components/pricing/PricingHero';
import { SubscriptionPlans } from '../components/pricing/SubscriptionPlans';
import { WalletBonus } from '../components/pricing/WalletBonus';
import { PacksAndFormulas } from '../components/pricing/PacksAndFormulas';
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
            <PricingHero />

            {/* User Personal Status (Visible only if logged in) */}
            {/* <UserSubscriptionStatus /> */}

            <CourtPricing />
            <SubscriptionPlans />
            <WalletBonus />
            <PacksAndFormulas />
        </motion.div>
    );
};
