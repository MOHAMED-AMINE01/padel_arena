import mongoose from 'mongoose';
import Tournament from '../src/models/Tournament';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const tournaments = [
    {
        name: "Vendôme Masters P1000",
        description: "Le tournoi le plus prestigieux de la saison avec les meilleurs joueurs de la région. Ambiance électrique et niveau de jeu exceptionnel au rendez-vous.",
        startDate: new Date('2026-05-15T09:00:00'),
        endDate: new Date('2026-05-17T18:00:00'),
        registrationDeadline: new Date('2026-05-01T23:59:59'),
        status: 'UPCOMING',
        maxTeams: 32,
        currentTeams: 0,
        entryFee: 40,
        prize: "2500€ + Équipement Wilson",
        level: 'P1000',
        image: "https://images.unsplash.com/photo-1554068865-24cecd4e34fb?q=80&w=1470&auto=format&fit=crop"
    },
    {
        name: "Spring Open P250",
        description: "Un tournoi ouvert à tous les joueurs amateurs cherchant à monter au classement. Convivialité, sportivité et compétition sont les maîtres mots.",
        startDate: new Date('2026-04-10T10:00:00'),
        endDate: new Date('2026-04-12T20:00:00'),
        registrationDeadline: new Date('2026-04-01T23:59:59'),
        status: 'UPCOMING',
        maxTeams: 16,
        currentTeams: 0,
        entryFee: 25,
        prize: "500€ + Bons d'achat",
        level: 'P250',
        image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1470&auto=format&fit=crop"
    },
    {
        name: "Nocturne Summer P100",
        description: "Tournoi en soirée sous les projecteurs. Venez vivre l'expérience Padel Arena de nuit dans une atmosphère unique.",
        startDate: new Date('2026-06-20T19:00:00'),
        endDate: new Date('2026-06-21T02:00:00'),
        registrationDeadline: new Date('2026-06-15T23:59:59'),
        status: 'UPCOMING',
        maxTeams: 8,
        currentTeams: 0,
        entryFee: 15,
        prize: "Lots de sponsors + Trophées",
        level: 'P100',
        image: "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?q=80&w=1470&auto=format&fit=crop"
    }
];

const seedDB = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/padel-arena';
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing tournaments if you want (but user said leave them, so let's check first)
        // For a seed, we usually clear.
        await Tournament.deleteMany({});
        console.log('🗑️ Existing tournaments deleted');

        await Tournament.insertMany(tournaments);
        console.log('🌱 Database seeded with 3 example tournaments!');

        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    }
};

seedDB();
