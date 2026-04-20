import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pricing from '../models/Pricing';
import Subscription from '../models/Subscription';

dotenv.config();

const sync = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Connected to MongoDB');

        const pricingSubs = await Pricing.find({ type: 'subscription' });
        
        // Remove subscriptions that are NOT in Pricing as type=subscription
        const validIds = pricingSubs.map(ps => ps._id.toString());
        const allSubs = await Subscription.find({});
        
        for (const sub of allSubs) {
            if (!validIds.includes(sub._id.toString())) {
                console.log('Removing orphaned subscription:', sub.name);
                await Subscription.findByIdAndDelete(sub._id);
            }
        }

        // Add/Update existing ones
        for (const ps of pricingSubs) {
            await Subscription.findByIdAndUpdate(ps._id, {
                name: ps.title,
                price: parseFloat(ps.price || '0'),
                durationInMonths: ps.durationInMonths || 1,
                features: ps.features || [],
                isActive: ps.isActive
            }, { upsert: true });
            console.log('Synced:', ps.title);
        }

        process.exit();
    } catch (err) {
        console.error('Sync error:', err);
        process.exit(1);
    }
};

sync();
