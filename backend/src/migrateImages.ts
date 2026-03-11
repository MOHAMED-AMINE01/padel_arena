import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import News from './models/News';
import Activity from './models/Activity';

dotenv.config();

cloudinary.config({
  cloud_name: 'djks8n2nh',
  api_key: '686645735224467',
  api_secret: 'zEz9o8xa-5FVXSP8lRL03LOuZEg'
});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/padel-arena';
const PUBLIC_IMAGES_DIR = path.join(__dirname, '../../public');

async function uploadToCloudinary(localPath: string) {
    try {
        const result = await cloudinary.uploader.upload(localPath, {
            folder: 'padel-arena',
        });
        return result.secure_url;
    } catch (error) {
        console.error(`Error uploading ${localPath}:`, error);
        return null;
    }
}

async function migrate() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Migrate News Images
        const newsItems = await News.find({});
        console.log(`Found ${newsItems.length} news items`);

        for (const item of newsItems) {
            if (item.image && item.image.startsWith('/IMAGES/')) {
                const fullPath = path.join(PUBLIC_IMAGES_DIR, item.image);
                if (fs.existsSync(fullPath)) {
                    console.log(`Uploading news image: ${item.image}`);
                    const cloudUrl = await uploadToCloudinary(fullPath);
                    if (cloudUrl) {
                        item.image = cloudUrl;
                        await item.save();
                        console.log(`Updated news ${item.title} with ${cloudUrl}`);
                    }
                } else {
                    console.warn(`File not found: ${fullPath}`);
                }
            }
        }

        // Migrate Activity Images
        const activities = await Activity.find({});
        console.log(`Found ${activities.length} activities`);

        for (const item of activities) {
            if (item.image && item.image.startsWith('/IMAGES/')) {
                const fullPath = path.join(PUBLIC_IMAGES_DIR, item.image);
                if (fs.existsSync(fullPath)) {
                    console.log(`Uploading activity image: ${item.image}`);
                    const cloudUrl = await uploadToCloudinary(fullPath);
                    if (cloudUrl) {
                        item.image = cloudUrl;
                        await item.save();
                        console.log(`Updated activity ${item.title} with ${cloudUrl}`);
                    }
                } else {
                    console.warn(`File not found: ${fullPath}`);
                }
            }
        }

        console.log('Migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
