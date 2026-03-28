const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/padel_arena';

const syncContent = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const collection = db.collection('news');
        
        const newsItems = await collection.find({}).toArray();
        console.log(`Found ${newsItems.length} news items.`);

        for (const item of newsItems) {
            if (!item.content || item.content === '') {
                await collection.updateOne(
                    { _id: item._id },
                    { $set: { content: item.description } }
                );
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
