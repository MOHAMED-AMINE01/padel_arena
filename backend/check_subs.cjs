const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://makhatouf_db_user:IlR1DKIXfIPgQhud@cluster0.vpklluc.mongodb.net/padel-arena?retryWrites=true&w=majority&appName=Cluster0';

async function check() {
    try {
        await mongoose.connect(MONGO_URI);
        const Booking = mongoose.model('Booking', new mongoose.Schema({}, { strict: false }));
        
        // Find bookings with type SUBSCRIPTION
        const subs = await Booking.find({ bookingType: 'SUBSCRIPTION' }).sort({ createdAt: -1 });
        console.log('--- Subscription Bookings ---');
        subs.forEach(s => {
            console.log(`ID: ${s._id}, Type: ${s.bookingType}, Status: ${s.status}, Guest: ${s.guestName}, UserID: ${s.user}, Created: ${s.createdAt}`);
        });
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

check();
