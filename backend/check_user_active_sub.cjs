const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://makhatouf_db_user:IlR1DKIXfIPgQhud@cluster0.vpklluc.mongodb.net/padel-arena?retryWrites=true&w=majority&appName=Cluster0';

async function check() {
    try {
        await mongoose.connect(MONGO_URI);
        const userId = '69aeff1b97d03167ae22d2be';
        const Subscription = mongoose.model('Subscription', new mongoose.Schema({}, { strict: false }));
        
        const sub = await Subscription.findOne({ user: userId });
        console.log('Subscription for user:', sub ? sub : 'None');
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

check();
