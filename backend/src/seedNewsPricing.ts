import mongoose from 'mongoose';
import dotenv from 'dotenv';
import News from './models/News';
import Pricing from './models/Pricing';

dotenv.config();

const newsData = [
    {
        title: "VENDÔME OPEN 2026 : LES INSCRIPTIONS SONT OUVERTES",
        category: "COMPÉTITION",
        date: "23 FÉB 2026",
        image: "/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-33226057.jpg",
        description: "Le tournoi le plus prestigieux de la région revient en Mars. Préparez-vous à affronter l'élite.",
        featured: true,
        link: "/reservation?sport=Padel#club",
        isActive: true,
        order: 1
    },
    {
        title: "SOIRÉE DJ & TAPAS : CE VENDREDI AU CLUB HOUSE",
        category: "ÉVÉNEMENT",
        date: "21 FÉB 2026",
        image: "/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-34285600.jpg",
        description: "Venez fêter la fin de semaine avec nos DJ sets et une sélection de tapas artisanales.",
        featured: false,
        link: "/contact",
        isActive: true,
        order: 2
    },
    {
        title: "3 CONSEILS POUR AMÉLIORER VOTRE BANDEJA",
        category: "BLOG TECHNIQUE",
        date: "19 FÉB 2026",
        image: "/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-33226056.jpg",
        description: "Nos experts partagent les secrets d'un coup de defense devenu une arme d'attaque redoutable.",
        featured: false,
        link: "/contact",
        isActive: true,
        order: 3
    },
    {
        title: "NOUVELLES RAQUETTES BULLPADEL EN TEST",
        category: "ÉQUIPEMENT",
        date: "15 FÉB 2026",
        image: "/IMAGES/IMAGES CARROUSEL/pexels-criticalimagery-32897038.jpg",
        description: "Venez tester gratuitement la nouvelle gamme Vertex et Hack dans notre Pro-Shop.",
        featured: false,
        link: "/contact",
        isActive: true,
        order: 4
    }
];

const pricingData = [
    // Court pricing
    {
        title: "PADEL",
        type: "court",
        offPeak: 32,
        peak: 40,
        weekend: 44,
        features: ["Verrerie ST7", "Éclairage LED 400W", "Surface MONDO WPT"],
        featured: false,
        isActive: true,
        order: 1
    },
    {
        title: "SIMULATEUR DE GOLF",
        type: "court",
        offPeak: 20,
        peak: 24,
        weekend: 28,
        features: ["Trackman 4", "100+ parcours", "Analyse vidéo"],
        featured: false,
        isActive: true,
        order: 2
    },
    {
        title: "PICKLEBALL & BADMINTON",
        type: "court",
        offPeak: 7,
        peak: 8,
        weekend: 10,
        features: ["Parquet amortissant", "Filets ajustables", "Location matériel"],
        featured: false,
        isActive: true,
        order: 3
    },
    // Subscription plans
    {
        title: "STARTER",
        type: "subscription",
        price: "29",
        icon: "Zap",
        color: "from-emerald-500/20 to-emerald-500/5",
        accent: "text-emerald-500",
        featured: false,
        features: [
            "4 sessions / mois",
            "Réduction 10% sur les sessions sup",
            "Priorité réservation J-3",
            "Accès vestiaires premium",
            "Invitation 1 ami / mois"
        ],
        isActive: true,
        order: 4
    },
    {
        title: "PRO PERFORMANCE",
        type: "subscription",
        price: "59",
        icon: "Star",
        color: "from-padel-blue/20 to-padel-blue/5",
        accent: "text-padel-blue",
        featured: true,
        features: [
            "Accès illimité heures creuses",
            "8 sessions heures pleines / mois",
            "1h de coaching collectif / mois",
            "Réduction 15% boutique Pro-Shop",
            "Priorité réservation J-7",
            "Accès Lounge VIP Exclusive"
        ],
        isActive: true,
        order: 5
    },
    {
        title: "ELITE ARENA",
        type: "subscription",
        price: "99",
        icon: "Trophy",
        color: "from-padel-yellow/20 to-padel-yellow/5",
        accent: "text-padel-yellow",
        featured: false,
        features: [
            "Accès illimité total 24/7",
            "Coaching individuel 1h / mois",
            "Service serviettes & SPA inclus",
            "Invitations tournois Master",
            "Priorité réservation J-14",
            "Casiers privés nominatifs"
        ],
        isActive: true,
        order: 6
    },
    // Packs
    {
        title: "PACK DÉCOUVERTE",
        type: "pack",
        price: "45€",
        description: "Idéal pour vos premiers pas. Inclut 1 session + location raquette + 1h de coaching initiation.",
        icon: "Target",
        isActive: true,
        order: 7
    },
    {
        title: "PACK COMPÉTITION",
        type: "pack",
        price: "120€",
        description: "Préparez vos tournois. 5 sessions + analyse vidéo + 1 boîte de balles premium offerte.",
        icon: "Trophy",
        isActive: true,
        order: 8
    },
    {
        title: "PACK FAMILLE",
        type: "pack",
        price: "180€",
        description: "Le padel pour tous. 10 sessions valables pour 4 personnes + accès académie junior.",
        icon: "Heart",
        isActive: true,
        order: 9
    },
    {
        title: "PACK AMIS & LIFESTYLE",
        type: "pack",
        price: "140€",
        description: "Jouez ensemble. 4 sessions réservées simultanément sur 2 terrains + boissons offertes.",
        icon: "Users",
        isActive: true,
        order: 10
    },
    {
        title: "PACK B2B ARENA",
        type: "pack",
        price: "DEVIS",
        description: "Team building & Networking. Privatisation terrains + catering + tournoi organisé sur mesure.",
        icon: "Building2",
        isActive: true,
        order: 11
    },
    // Promos
    {
        title: "OFFRE BIENVENUE",
        type: "promo",
        price: "-50%",
        description: "Sur votre première réservation. Valable pour tous les nouveaux membres.",
        icon: "WELCOME50",
        accent: "NEWPLAYER",
        isActive: true,
        order: 12
    },
    {
        title: "FLASH HAPPY HOUR",
        type: "promo",
        price: "-30%",
        description: "Tous les mardis de 14h à 16h. Profitez des créneaux calmes.",
        icon: "HAPPYPADEL",
        accent: "FASTLIVE",
        isActive: true,
        order: 13
    },
    {
        title: "ADVANTAGE ÉSTUDIANT",
        type: "promo",
        price: "-20%",
        description: "Sur présentation de votre carte étudiante. Valable toute l'année.",
        icon: "STUDENT20",
        accent: "PERMANENT",
        isActive: true,
        order: 14
    }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Connected to MongoDB');

        await News.deleteMany({});
        await News.insertMany(newsData);
        console.log('✅ News seeded');

        await Pricing.deleteMany({});
        await Pricing.insertMany(pricingData);
        console.log('✅ Pricing seeded');

        process.exit();
    } catch (err) {
        console.error('Error seeding:', err);
        process.exit(1);
    }
};

seed();
