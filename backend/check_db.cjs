require('dotenv').config({path: './.env'});
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const db = mongoose.connection.db;
    const b = await db.collection('bookings').find().sort({createdAt: -1}).limit(1).toArray();
    console.log(JSON.stringify(b, null, 2));
    process.exit(0);
}).catch(console.error);
