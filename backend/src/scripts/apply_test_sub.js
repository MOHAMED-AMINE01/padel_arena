const mongoose = require('mongoose');
require('dotenv').config();

const applyTest = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await mongoose.connection.db.collection('users').updateOne(
      { email: 'm.a.khatouf@gmail.com' },
      { 
        $set: { 
          subscription: new mongoose.Types.ObjectId('69b8387fb2fdac61df6b107f'), 
          subscriptionExpiresAt: tomorrow 
        } 
      }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Compte mis à jour pour le test !');
      console.log('Utilisateur : m.a.khatouf@gmail.com');
      console.log('Date d\'expiration simulée : ' + tomorrow.toLocaleDateString());
    } else {
      console.log('⚠️ Aucun compte mis à jour (vérifiez l\'e-mail).');
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur :', err);
    process.exit(1);
  }
};

applyTest();
