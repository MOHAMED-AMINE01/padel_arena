const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://makhatouf_db_user:IlR1DKIXfIPgQhud@cluster0.vpklluc.mongodb.net/padel-arena?retryWrites=true&w=majority&appName=Cluster0';

async function run() {
    await mongoose.connect(MONGO_URI);
    
    // 1. Clean up any bad "RESERVE PACKS" court
    const Court = mongoose.model('Court', new mongoose.Schema({}, { strict: false }));
    const badCourt = await Court.findOne({ name: 'RESERVE PACKS' });
    if (badCourt) {
        console.log('Found existing RESERVE PACKS court, removing...', badCourt._id);
        await Court.deleteOne({ _id: badCourt._id });
        console.log('Removed bad court.');
    } else {
        console.log('No existing RESERVE PACKS court found (good).');
    }
    
    // 2. Get a real admin user's ID for creating test bookings
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const admin = await User.findOne({ role: 'ADMIN' });
    console.log('Admin user:', admin ? admin.name : 'Not found', admin ? admin._id : '');

    // 3. Get the first real court's clubManager
    const firstCourt = await Court.findOne({ name: { $ne: 'RESERVE PACKS' } });
    console.log('First real court manager:', firstCourt ? firstCourt.clubManager : 'N/A');

    await mongoose.disconnect();
    console.log('Done!');
}

run().catch(console.error);
