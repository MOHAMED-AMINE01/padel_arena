import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function resetSubscriptions() {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection;

        // 1. Delete ALL existing subscriptions
        const subResult = await db.collection('subscriptions').deleteMany({});
        console.log(`🗑️  Deleted ${subResult.deletedCount} subscriptions`);

        // 2. Delete ALL pricing entries of type "subscription"
        const pricingResult = await db.collection('pricings').deleteMany({ type: 'subscription' });
        console.log(`🗑️  Deleted ${pricingResult.deletedCount} subscription pricings`);

        // 3. Create the single subscription: Heures Creuses 50€
        const newSub = await db.collection('subscriptions').insertOne({
            name: 'Heures Creuses',
            price: 50,
            durationInMonths: 1,
            features: [
                'Accès illimité en heures creuses',
                'Inclus Padel, Badminton, Pickleball & Golf',
                'Réservation 7 jours à l\'avance',
                'Priorité sur les événements club'
            ],
            isActive: true,
            subscriberCount: 0,
            revenue: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log(`✨ Created subscription "Heures Creuses" - 50€/mois (ID: ${newSub.insertedId})`);

        console.log('\n🎯 Done! Only "Heures Creuses" at 50€/month is now available.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

resetSubscriptions();
