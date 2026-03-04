import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Booking from '../models/Booking';
import Court from '../models/Court';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/padel-arena';

const frenchNames = [
    { name: 'Jean Dupont', email: 'jean.dupont@gmail.com' },
    { name: 'Marie Lefebvre', email: 'marie.lefebvre@hotmail.fr' },
    { name: 'Pierre Martin', email: 'p.martin@yahoo.fr' },
    { name: 'Sophie Bernard', email: 'sophie.bernard@gmail.com' },
    { name: 'Thomas Petit', email: 'thomas.petit@outlook.com' },
    { name: 'Isabelle Dubois', email: 'isabelle.dubois@gmail.com' },
    { name: 'Nicolas Roux', email: 'n.roux@free.fr' },
    { name: 'Catherine Simon', email: 'c.simon@orange.fr' },
    { name: 'Antoine Laurent', email: 'antoine.laurent@gmail.com' },
    { name: 'Julie Mercier', email: 'julie.mercier@gmail.com' }
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Delete all bookings
        await Booking.deleteMany({});
        console.log('Deleted all bookings');

        // 2. Delete all non-admin users
        await User.deleteMany({ role: 'PLAYER' });
        console.log('Deleted all non-admin users');

        // 3. Get at least one court
        const courts = await Court.find({ isActive: true });
        if (courts.length === 0) {
            console.error('No active courts found to create bookings');
            process.exit(1);
        }

        // 4. Create French players
        const players = [];
        for (const data of frenchNames) {
            const player = await User.create({
                name: data.name,
                email: data.email,
                password: 'password123',
                role: 'PLAYER',
                phone: '06' + Math.floor(10000000 + Math.random() * 90000000),
                authProvider: 'local',
                isActive: true
            });
            players.push(player);
        }
        console.log(`Created ${players.length} French players`);

        // 5. Create 5 new bookings for today/tomorrow
        const statuses = ['CONFIRMED', 'PENDING', 'CANCELLED', 'COMPLETED'];
        const now = new Date();

        for (let i = 0; i < 5; i++) {
            const player = players[i % players.length];
            const court = courts[i % courts.length];

            const startHour = 9 + (i * 2);
            const startTime = new Date(now);
            startTime.setHours(startHour, 0, 0, 0);

            const endTime = new Date(startTime);
            endTime.setHours(startHour + 1);

            await Booking.create({
                user: player._id,
                court: court._id,
                startTime,
                endTime,
                totalPrice: court.pricePerHour || 40,
                status: i === 0 ? 'CANCELLED' : (i === 1 ? 'PENDING' : 'CONFIRMED'),
                paymentStatus: i === 3 ? 'PAID' : 'UNPAID'
            });
        }
        console.log('Created 5 new bookings');

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seed();
