import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Subscription from '../src/models/Subscription';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function resetSubscriptions() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/padel-arena');
        console.log('Connected to MongoDB');

        // Delete all existing plans
        await Subscription.deleteMany({});
        console.log('Cleared existing subscription plans.');

        // Create the new plan requested by the user
        const offPeakPlan = await Subscription.create({
            name: 'HEURES CREUSES',
            price: 50,
            durationInMonths: 1,
            features: [
                'Accès illimité en heures creuses',
                'Inclus Padel, Badminton, Pickleball & Golf',
                'Réservation 7 jours à l\'avance',
                'Priorité sur les événements club'
            ],
            isActive: true
        });

        console.log('Created new plan:', offPeakPlan.name);
        process.exit(0);
    } catch (error) {
        console.error('Error resetting subscriptions:', error);
        process.exit(1);
    }
}

resetSubscriptions();
