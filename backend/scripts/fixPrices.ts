import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Booking from '../src/models/Booking';
import User from '../src/models/User';
import Court from '../src/models/Court';

async function fixTestBookings() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('✅ Connected to MongoDB');

        // Get first user and first court
        const user = await User.findOne();
        const courts = await Court.find();

        if (!user) {
            console.log('❌ No user found.');
            process.exit(1);
        }
        if (courts.length === 0) {
            console.log('❌ No courts found.');
            process.exit(1);
        }

        // 1. Force price per hour to 45 for all courts to match user input
        await Court.updateMany({}, { pricePerHour: 45 });
        console.log('🏟️  Updated all courts to 45€/hour');

        // 2. Remove all existing bookings to start fresh
        await Booking.deleteMany({});
        console.log('🧹 Cleared all existing bookings');

        const today = new Date();
        today.setSeconds(0, 0);

        const testBookings = [
            {
                // 1h booking (9:00 - 10:00) -> 45€
                user: user._id,
                court: courts[0]._id,
                startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
                endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
                totalPrice: 45,
                status: 'CONFIRMED',
                paymentStatus: 'PAID',
                createdAt: new Date()
            },
            {
                // 1h30 booking (11:00 - 12:30) -> 67.5€
                user: user._id,
                court: courts[0]._id,
                startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0),
                endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 30),
                totalPrice: 67.5,
                status: 'CONFIRMED',
                paymentStatus: 'PAID',
                createdAt: new Date()
            },
            {
                // 2h booking (14:00 - 16:00) -> 90€
                user: user._id,
                court: courts.length > 1 ? courts[1]._id : courts[0]._id,
                startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0),
                endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0),
                totalPrice: 90,
                status: 'PENDING',
                paymentStatus: 'UNPAID',
                createdAt: new Date()
            },
            {
                // 1h booking (17:00 - 18:00) -> 45€
                user: user._id,
                court: courts[0]._id,
                startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 0),
                endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0),
                totalPrice: 45,
                status: 'PENDING',
                paymentStatus: 'UNPAID',
                createdAt: new Date()
            },
            {
                // 1h30 booking (19:00 - 20:30) CANCELLED -> 67.5€
                user: user._id,
                court: courts[0]._id,
                startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 19, 0),
                endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 20, 30),
                totalPrice: 67.5,
                status: 'CANCELLED',
                paymentStatus: 'UNPAID',
                createdAt: new Date()
            }
        ];

        const results = await Booking.insertMany(testBookings);
        console.log(`\n✅ Created ${results.length} corrected test bookings (1h=45€, 1h30=67.5€, 2h=90€)`);

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixTestBookings();
