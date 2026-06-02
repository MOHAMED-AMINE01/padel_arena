import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Subscription from '../src/models/Subscription';

dotenv.config({ path: path.join(__dirname, '../.env') });

const PASS_ARENA_FEATURES = [
    "Heures creuses : de 10h à 12h et de 14h à 17h30",
    "Hors week-ends et jours fériés",
    "Sans engagement",
    "Hors piste single",
    "2 heures de jeu maximum par jour"
];

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/padel-arena');
        console.log('✅ Connected to MongoDB');

        // 1) Remove the "Heures Creuses" subscription
        const del = await Subscription.deleteMany({ name: /heures creuses/i });
        console.log(`🗑️  Abonnement "Heures Creuses" supprimé : ${del.deletedCount}`);

        // 2) Update PASS ARENA -> 45€ + nouvelles features (créé s'il n'existe pas)
        const updated = await Subscription.findOneAndUpdate(
            { name: /pass arena/i },
            {
                name: "PASS ARENA",
                price: 45,
                durationInMonths: 1,
                features: PASS_ARENA_FEATURES,
                isActive: true
            },
            { new: true, upsert: true }
        );
        console.log(`♻️  PASS ARENA mis à jour : ${updated?.price}€`);

        const all = await Subscription.find({}, 'name price').lean();
        console.log('📋 Abonnements restants :');
        all.forEach((s: any) => console.log(`   - ${s.name} : ${s.price}€`));

        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

run();
