import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pricing from '../models/Pricing';

dotenv.config();

const passArena = {
    title: "PASS ARENA",
    type: "subscription",
    price: "40",
    durationInMonths: 1,
    features: [
        "Réservation H24 via application",
        "Accès 7j/7 aux courts",
        "Priorité de réservation J-7",
        "Accès Club House & Lounge",
        "Système de crédits intégré"
    ],
    featured: true,
    icon: "ShieldCheck",
    isActive: true,
    order: 40
};

const addPassArenaToPricing = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Connected to MongoDB');

        // Check if it already exists to avoid duplicates
        const existing = await Pricing.findOne({ title: "PASS ARENA", type: "subscription" });
        if (existing) {
            await Pricing.updateOne({ _id: existing._id }, passArena);
            console.log('✅ PASS ARENA updated in Pricing collection');
        } else {
            await Pricing.create(passArena);
            console.log('✅ PASS ARENA added to Pricing collection');
        }

        process.exit();
    } catch (err) {
        console.error('Error updating pricing:', err);
        process.exit(1);
    }
};

addPassArenaToPricing();
