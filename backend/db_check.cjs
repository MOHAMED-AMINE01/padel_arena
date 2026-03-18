const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://makhatouf_db_user:IlR1DKIXfIPgQhud@cluster0.vpklluc.mongodb.net/padel-arena?retryWrites=true&w=majority&appName=Cluster0';

async function check() {
    try {
        await mongoose.connect(MONGO_URI);
        const Booking = mongoose.model('Booking', new mongoose.Schema({}, { strict: false }));
        // Check for any bookings created today
        const start = new Date();
        start.setHours(0,0,0,0);
        
        const count = await Booking.countDocuments({ createdAt: { $gte: start } });
        console.log('Today bookings count:', count);
        
        const last = await Booking.findOne().sort({ createdAt: -1 });
        console.log('Last booking overall:', last);
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

check();
