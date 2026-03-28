import mongoose from 'mongoose';
import News from './models/News.js';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/padel_arena';

const syncContent = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const newsItems = await News.find({});
        console.log(`Found ${newsItems.length} news items.`);

        for (const item of newsItems) {
            if (!item.content || item.content === '') {
                item.content = item.description;
                await item.save();
                console.log(`Synced content for: ${item.title}`);
            }
        }

        console.log('Sync complete!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

syncContent();
