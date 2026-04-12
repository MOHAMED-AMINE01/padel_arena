const mongoose = require('mongoose');
require('dotenv').config();

async function fix() {
    await mongoose.connect(process.env.MONGODB_URI);
    const inTwoDays = new Date();
    inTwoDays.setDate(inTwoDays.getDate() + 2);
    // Set to middle of the day to avoid time-of-day edge cases
    inTwoDays.setHours(12, 0, 0, 0);

    await mongoose.connection.db.collection('users').updateOne(
        { email: 'm.a.khatouf@gmail.com' },
        { $set: { subscriptionExpiresAt: inTwoDays } }
    );
    console.log('✅ Date mise à J+2 pour le test.');
    process.exit(0);
}
fix();
