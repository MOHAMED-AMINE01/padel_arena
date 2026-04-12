const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User').default || require('../models/User');
const { sendEmail } = require('../services/mailService');

const runTest = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // 1. Set date to EXACTLY 2 days from now
        const twoDaysFromNow = new Date();
        twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
        twoDaysFromNow.setHours(12, 0, 0, 0); // Noon

        await mongoose.connection.db.collection('users').updateOne(
            { email: 'm.a.khatouf@gmail.com' },
            { $set: { subscriptionExpiresAt: twoDaysFromNow } }
        );
        
        console.log('✅ Date mise à jour à J+2');

        // 2. Run the logic from subscriptionReminders
        const startOfTargetDay = new Date(new Date(twoDaysFromNow).setHours(0, 0, 0, 0));
        const endOfTargetDay = new Date(new Date(twoDaysFromNow).setHours(23, 59, 59, 999));

        const user = await mongoose.model('User').findOne({
            email: 'm.a.khatouf@gmail.com',
            subscriptionExpiresAt: {
                $gte: startOfTargetDay,
                $lte: endOfTargetDay
            }
        }).populate('subscription');

        if (user) {
            console.log('📧 Envoi de l\'email de rappel...');
            const emailContent = `<h1>Rappel d'Abonnement Padel Arena</h1><p>Bonjour ${user.name}, votre abonnement expire bientôt !</p>`;
            
            await sendEmail({
                to: user.email,
                subject: '⚠️ Votre abonnement Padel Arena expire bientôt !',
                html: emailContent // In real it uses the template, but this is a forced test
            });
            console.log('✅ Email envoyé ! Verifiez votre boîte (m.a.khatouf@gmail.com)');
        } else {
            console.log('❌ Utilisateur non trouvé pour cette plage de dates.');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

runTest();
