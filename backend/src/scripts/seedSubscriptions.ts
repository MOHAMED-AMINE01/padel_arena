import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subscription from '../models/Subscription';

dotenv.config();

const plans = [
    {
        name: "PASS ARENA",
        price: 45,
        durationInMonths: 1,
        features: [
            "Heures creuses : de 10h à 12h et de 14h à 17h30",
            "Hors week-ends et jours fériés",
            "Sans engagement",
            "Hors piste single",
            "2 heures de jeu maximum par jour"
        ],
        isActive: true
    }
];

const seedSubscriptions = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Connected to MongoDB');

        await Subscription.deleteMany({});
        await Subscription.insertMany(plans);

        console.log('✅ Subscriptions updated: PASS ARENA (45€)');
        process.exit();
    } catch (err) {
        console.error('Error seeding subscriptions:', err);
        process.exit(1);
    }
};

seedSubscriptions();
