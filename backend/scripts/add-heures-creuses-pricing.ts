import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function addHeuresCreusesToPricings() {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection;

        // 1. Remove any old subscription-type entries from pricings
        const deleted = await db.collection('pricings').deleteMany({ type: 'subscription' });
        console.log(`🗑️  Removed ${deleted.deletedCount} old subscription pricings`);

        // 2. Get the max order value to place it after existing items
        const lastItem = await db.collection('pricings').find().sort({ order: -1 }).limit(1).toArray();
        const nextOrder = lastItem.length > 0 ? (lastItem[0].order || 0) + 1 : 0;

        // 3. Add "Heures Creuses" to the pricings collection
        const result = await db.collection('pricings').insertOne({
            title: 'HEURES CREUSES',
            type: 'subscription',
            description: 'Accès illimité en heures creuses. Inclus Padel, Badminton, Pickleball & Golf.',
            price: '50',
            features: [
                'Accès illimité en heures creuses',
                'Inclus Padel, Badminton, Pickleball & Golf',
                'Réservation 7 jours à l\'avance',
                'Priorité sur les événements club'
            ],
            featured: true,
            icon: 'Zap',
            isActive: true,
            order: nextOrder,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log(`✨ Added "HEURES CREUSES" to Tarifs page (ID: ${result.insertedId})`);
        console.log('🎯 It will now appear in BO > Tarifs!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

addHeuresCreusesToPricings();
