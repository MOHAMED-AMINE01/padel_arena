import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Subscription from '../src/models/Subscription';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/padel-arena');
        console.log('✅ Connected to MongoDB');

        const before = await Subscription.findOne({ name: /pass arena/i }, 'name price').lean();
        console.log(`Avant : ${before?.name} = ${before?.price}€`);

        const updated = await Subscription.findOneAndUpdate(
            { name: /pass arena/i },
            { $set: { price: 50 } },
            { new: true }
        );

        if (!updated) {
            console.log('⚠️  Aucun abonnement "PASS ARENA" trouvé.');
        } else {
            console.log(`♻️  PASS ARENA mis à jour : ${updated.price}€`);
        }

        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

run();
