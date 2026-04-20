import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subscription from '../models/Subscription';

dotenv.config();

const plans = [
    {
        name: "PASS ARENA",
        price: 40,
        durationInMonths: 1,
        features: [
            "Réservation H24 via application",
            "Accès 7j/7 aux courts",
            "Priorité de réservation J-7",
            "Accès Club House & Lounge",
            "Système de crédits intégré"
        ],
        isActive: true
    },
    {
        name: "Heures Creuses",
        price: 50,
        durationInMonths: 1,
        features: [
            "Accès illimité en heures creuses",
            "Inclus Padel, Badminton, Pickleball & Golf",
            "Réservation 7 jours à l'avance",
            "Priorité sur les événements club"
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

        console.log('✅ Subscriptions updated: PASS ARENA + Heures Creuses');
        process.exit();
    } catch (err) {
        console.error('Error seeding subscriptions:', err);
        process.exit(1);
    }
};

seedSubscriptions();
