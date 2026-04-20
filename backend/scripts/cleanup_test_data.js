const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env');
    process.exit(1);
}

async function cleanup() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected.');

        // Collections to clear
        const Transaction = mongoose.model('Transaction', new mongoose.Schema({}, { strict: false }));
        const CashShift = mongoose.model('CashShift', new mongoose.Schema({}, { strict: false }));
        const Invoice = mongoose.model('Invoice', new mongoose.Schema({}, { strict: false }));
        const Booking = mongoose.model('Booking', new mongoose.Schema({}, { strict: false }));

        console.log('🗑 Cleaning Transactions...');
        const tResult = await Transaction.deleteMany({});
        console.log(`✅ Deleted ${tResult.deletedCount} transactions.`);

        console.log('🗑 Cleaning Cash Shifts...');
        const cResult = await CashShift.deleteMany({});
        console.log(`✅ Deleted ${cResult.deletedCount} cash shifts.`);

        console.log('🗑 Cleaning Invoices...');
        const iResult = await Invoice.deleteMany({});
        console.log(`✅ Deleted ${iResult.deletedCount} invoices.`);

        console.log('🗑 Cleaning Bookings (Test Data)...');
        const bResult = await Booking.deleteMany({});
        console.log(`✅ Deleted ${bResult.deletedCount} bookings.`);

        console.log('👤 Resetting User Subscriptions and Stats...');
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const uResult = await User.updateMany({}, {
            $set: {
                subscription: null,
                subscriptionExpiresAt: null,
                'stats.points': 0,
                'stats.matchesPlayed': 0,
                'stats.wins': 0,
                'stats.losses': 0,
                'stats.tournamentsPlayed': 0,
                'stats.tournamentsWon': 0
            }
        });
        console.log(`✅ Reset data for ${uResult.modifiedCount} users.`);

        console.log('\n✨ Database cleaned successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during cleanup:', error);
        process.exit(1);
    }
}

cleanup();
