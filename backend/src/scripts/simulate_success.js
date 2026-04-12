const mongoose = require('mongoose');
require('dotenv').config();

const applySuccess = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const user = await mongoose.connection.db.collection('users').findOne({ email: 'm.a.khatouf@gmail.com' });
    
    if (!user) {
      console.log('⚠️ Utilisateur non trouvé.');
      process.exit(1);
    }

    let currentExpiry = user.subscriptionExpiresAt ? new Date(user.subscriptionExpiresAt) : new Date();
    // Simulate adding 1 month (30 days)
    currentExpiry.setDate(currentExpiry.getDate() + 30);

    await mongoose.connection.db.collection('users').updateOne(
      { email: 'm.a.khatouf@gmail.com' },
      { 
        $set: { 
          subscriptionExpiresAt: currentExpiry 
        } 
      }
    );

    console.log('✅ Paiement Simulé !');
    console.log('Nouvelle date d\'expiration : ' + currentExpiry.toLocaleDateString());
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur :', err);
    process.exit(1);
  }
};

applySuccess();
