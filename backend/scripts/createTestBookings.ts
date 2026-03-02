import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Booking from '../src/models/Booking';
import User from '../src/models/User';
import Court from '../src/models/Court';

async function createTestBookings() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('✅ Connected to MongoDB');

        // Get first user and first court
        const user = await User.findOne();
        const courts = await Court.find();

        if (!user) {
            console.log('❌ No user found. Create a user first.');
            process.exit(1);
        }
        if (courts.length === 0) {
            console.log('❌ No courts found. Create a court first.');
            process.exit(1);
        }

        console.log(`👤 User: ${user.name} (${user._id})`);
        console.log(`🏟️  Courts: ${courts.map(c => c.name).join(', ')}`);

        const today = new Date();
        today.setSeconds(0, 0);

        const testBookings = [
            {
                // 1h booking at 9h today
                user: user._id,
                court: courts[0]._id,
                startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
                endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
                totalPrice: 40,
                status: 'CONFIRMED',
                paymentStatus: 'PAID'
            },
            {
                // 1h30 booking at 11h today
                user: user._id,
                court: courts[0]._id,
                startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0),
                endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 30),
                totalPrice: 55,
                status: 'CONFIRMED',
                paymentStatus: 'PAID'
            },
            {
                // 2h booking at 14h today
                user: user._id,
                court: courts.length > 1 ? courts[1]._id : courts[0]._id,
                startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0),
                endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0),
                totalPrice: 70,
                status: 'PENDING',
                paymentStatus: 'UNPAID'
            },
            {
                // 1h booking at 17h today
                user: user._id,
                court: courts[0]._id,
                startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 0),
                endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0),
                totalPrice: 40,
                status: 'PENDING',
                paymentStatus: 'UNPAID'
            },
            {
                // 1h30 booking tomorrow at 10h
                user: user._id,
                court: courts[0]._id,
                startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 10, 0),
                endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 30),
                totalPrice: 55,
                status: 'CONFIRMED',
                paymentStatus: 'PAID'
            }
        ];

        const results = await Booking.insertMany(testBookings);
        console.log(`\n✅ Created ${results.length} test bookings:\n`);

        results.forEach((b: any, i: number) => {
            const start = new Date(b.startTime);
            const end = new Date(b.endTime);
            const durationMin = (end.getTime() - start.getTime()) / (1000 * 60);
            const durationStr = durationMin >= 60
                ? `${Math.floor(durationMin / 60)}h${durationMin % 60 > 0 ? durationMin % 60 : ''}`
                : `${durationMin}min`;
            console.log(`  ${i + 1}. ${start.toLocaleDateString('fr-FR')} | ${start.getHours()}h → ${end.getHours()}h${end.getMinutes() > 0 ? end.getMinutes() : ''} (${durationStr}) | ${b.status} | Court: ${courts.find(c => c._id.toString() === b.court.toString())?.name}`);
        });

        await mongoose.disconnect();
        console.log('\n✅ Disconnected. Go check your planning!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

createTestBookings();
