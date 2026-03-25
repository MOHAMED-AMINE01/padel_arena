const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const CourtSchema = new mongoose.Schema({
    pricePerHour: Number,
    offPeakPrice: Number,
    peakPrice: Number
}, { strict: false });

const Court = mongoose.model('Court', CourtSchema);

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const courts = await Court.find({});
        console.log(`Found ${courts.length} courts to migrate`);

        for (const court of courts) {
            if (court.pricePerHour && (!court.offPeakPrice || !court.peakPrice)) {
                // Rule: HP = pricePerHour, HC = pricePerHour * 0.8 (approx)
                // But better follow the user's specific request: Padel HP 40 / HC 32
                let hp = court.pricePerHour;
                let hc = Math.round(hp * 0.8);
                
                await Court.updateOne(
                    { _id: court._id },
                    { 
                        $set: { 
                            offPeakPrice: hc, 
                            peakPrice: hp 
                        },
                        $unset: { pricePerHour: "" }
                    }
                );
                console.log(`Migrated court: ${court._id} (HP: ${hp}, HC: ${hc})`);
            }
        }

        console.log('Migration completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
