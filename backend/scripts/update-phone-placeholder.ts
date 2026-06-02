import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { SiteSettings } from '../src/models/SiteSettings';

dotenv.config({ path: path.join(__dirname, '../.env') });

const PLACEHOLDER_PHONE = '07 XX XX XX XX';

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/padel-arena');
        console.log('✅ Connected to MongoDB');

        const before = await SiteSettings.findOne({}, 'phone').lean();
        console.log(`📞 Numéro actuel : ${(before as any)?.phone ?? '(aucun document)'}`);

        const updated = await SiteSettings.findOneAndUpdate(
            {},
            { phone: PLACEHOLDER_PHONE, updatedAt: new Date() },
            { new: true, upsert: true }
        );
        console.log(`♻️  Nouveau numéro : ${updated?.phone}`);

        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

run();
