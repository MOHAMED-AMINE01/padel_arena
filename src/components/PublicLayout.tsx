import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import ScrollToTop from './ScrollToTop';
import BackToTop from './BackToTop';
import FloatingSocials from './FloatingSocials';
import { CookieConsent } from './CookieConsent';

export const PublicLayout = () => {
    return (
        <>
            <Navbar />
            <ScrollToTop />
            <main>
                <Outlet />
            </main>
            <Footer />
            
            {/* Control Panel (Socials + BackToTop) */}
            <div className="fixed bottom-24 md:bottom-24 right-5 md:right-8 z-[100] flex flex-col items-center gap-4 md:gap-6">
                <FloatingSocials />
                <BackToTop />
            </div>

            <CookieConsent />
        </>
    );
};
