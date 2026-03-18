const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://makhatouf_db_user:IlR1DKIXfIPgQhud@cluster0.vpklluc.mongodb.net/padel-arena?retryWrites=true&w=majority&appName=Cluster0';

async function check() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        // Correcting the model name — it is probably called "Subscription" referring to a user s sub
        // Let's check model names from the DB directly to be sure
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('--- Collections ---', collections.map(c => c.name));
        
        const userId = '69aeff1b97d03167ae22d2be';
        const user = await User.findById(userId);
        console.log('User found:', user ? user.name : 'Not found');
        
        // Let's guess the user subscription model name is "UserSubscription" or similar
        // or check the backend/src/models directory
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

check();
