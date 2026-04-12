const mongoose = require('mongoose');
require('dotenv').config();

const resetForSwitchTest = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const starterId = '69b8387fb2fdac61df6b107f'; // ID du Pack Starter
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await mongoose.connection.db.collection('users').updateOne(
      { email: 'm.a.khatouf@gmail.com' },
      { 
        $set: { 
          subscription: new mongoose.Types.ObjectId(starterId),
          subscriptionExpiresAt: tomorrow 
        } 
      }
    );

    console.log('✅ Compte prêt : Vous avez un STARTER qui expire dans 4 mois.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur :', err);
    process.exit(1);
  }
};

resetForSwitchTest();
