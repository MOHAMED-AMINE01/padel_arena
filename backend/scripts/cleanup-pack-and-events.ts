import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Pricing from '../src/models/Pricing';
import Tournament from '../src/models/Tournament';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Real upcoming events to display in the "ÉVÉNEMENTS" tab.
// Modeled on the Tournament schema (level OPEN = social / non-competitive event).
const realEvents = [
    {
        name: "Soirée Coupe du Monde — Écran Géant",
        description: "Vivez les matchs de la Coupe du Monde 2026 sur écran géant au Club House ! Ambiance survoltée, planches à partager et boissons fraîches. Venez supporter vos équipes dans une atmosphère unique.",
        startDate: new Date('2026-06-11T18:00:00'),
        endDate: new Date('2026-06-11T23:30:00'),
        registrationDeadline: new Date('2026-06-10T23:59:59'),
        status: 'UPCOMING',
        maxTeams: 80,
        currentTeams: 0,
        entryFee: 0,
        prize: "Diffusion sur écran géant • Entrée libre",
        level: 'OPEN',
        image: ""
    },
    {
        name: "Soirée Tapas au Club House",
        description: "Prolongez l'expérience après le jeu autour de nos planches de tapas et d'une sélection de boissons. Une soirée conviviale pour rencontrer la communauté Padel Arena dans une ambiance chaleureuse.",
        startDate: new Date('2026-06-19T19:00:00'),
        endDate: new Date('2026-06-19T23:00:00'),
        registrationDeadline: new Date('2026-06-18T23:59:59'),
        status: 'UPCOMING',
        maxTeams: 50,
        currentTeams: 0,
        entryFee: 15,
        prize: "Planche de tapas incluse • Convivialité",
        level: 'OPEN',
        image: ""
    }
];

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/padel-arena');
        console.log('✅ Connected to MongoDB');

        // 1) Remove the PACK FAMILLE pricing entry
        const packResult = await Pricing.deleteMany({ title: 'PACK FAMILLE', type: 'pack' });
        console.log(`🗑️  PACK FAMILLE supprimé : ${packResult.deletedCount} document(s)`);

        // 2) Remove fictitious tournaments / events, then insert the real ones
        const existing = await Tournament.find({}, 'name').lean();
        console.log(`📋 Tournois/events actuels (${existing.length}) :`);
        existing.forEach((t: any) => console.log(`   - ${t.name}`));

        const delResult = await Tournament.deleteMany({});
        console.log(`🗑️  Events fictifs supprimés : ${delResult.deletedCount}`);

        const inserted = await Tournament.insertMany(realEvents);
        console.log(`🌱 Vrais events insérés : ${inserted.length}`);
        inserted.forEach((t: any) => console.log(`   + ${t.name}`));

        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

run();
