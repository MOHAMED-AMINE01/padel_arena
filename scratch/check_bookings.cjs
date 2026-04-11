const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const bookingSchema = new mongoose.Schema({
    startTime: Date,
    timeStr: String,
    dateStr: String,
    guestName: String
}, { strict: false });

const Booking = mongoose.model('Booking', bookingSchema);

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const lastBookings = await Booking.find().sort({ createdAt: -1 }).limit(3);
        
        console.log('--- Last 3 Bookings ---');
        lastBookings.forEach(b => {
            console.log(`ID: ${b._id}`);
            console.log(`Name: ${b.guestName}`);
            console.log(`startTime (UTC): ${b.startTime ? b.startTime.toISOString() : 'N/A'}`);
            console.log(`timeStr (Saved): "${b.timeStr}"`);
            console.log(`dateStr (Saved): "${b.dateStr}"`);
            console.log('------------------------');
        });
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
