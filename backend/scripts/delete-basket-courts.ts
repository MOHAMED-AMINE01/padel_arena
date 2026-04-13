import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Court from '../src/models/Court';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

async function deleteBasketCourts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/padel-arena');
        console.log('Connected to MongoDB');

        const result = await Court.deleteMany({ sport: 'Basket' });
        console.log(`Deleted ${result.deletedCount} basketball courts.`);

        process.exit(0);
    } catch (error) {
        console.error('Error deleting basket courts:', error);
        process.exit(1);
    }
}

deleteBasketCourts();
