import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Subscription from '../models/Subscription';
import { sendEmail, getEmailTemplate } from '../services/mailService';

dotenv.config();

const sendReminders = async () => {
  try {
    console.log('🚀 Démarrage de la vérification des expirations d\'abonnement...');
    
    // Connect to DB
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Base de données connectée');

    // Calculate dates
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
    
    const startOfTargetDay = new Date(twoDaysFromNow.setHours(0, 0, 0, 0));
    const endOfTargetDay = new Date(twoDaysFromNow.setHours(23, 59, 59, 999));

    // Ensure models are registered even if import was cached
    if (!mongoose.models.Subscription) {
      mongoose.model('Subscription', Subscription.schema);
    }

    // Find users expiring in exactly 2 days
    const usersToExpire = await User.find({
      subscriptionExpiresAt: {
        $gte: startOfTargetDay,
        $lte: endOfTargetDay
      }
    }).populate('subscription').catch(err => {
      console.warn('⚠️ Populate error:', err.message);
      return User.find({
        subscriptionExpiresAt: {
          $gte: startOfTargetDay,
          $lte: endOfTargetDay
        }
      });
    });

    console.log(`🔍 ${usersToExpire.length} utilisateur(s) expirent dans 2 jours.`);

    for (const user of usersToExpire) {
      console.log(`📧 Envoi du rappel à : ${user.email}`);
      
      const emailTitle = "Renouvellement d'abonnement";
      const emailBody = `
        Bonjour **${user.name}**,
        
        C'est déjà presque l'heure ! Votre abonnement **${(user.subscription as any)?.name || 'Premium'}** arrive à échéance le **${user.subscriptionExpiresAt?.toLocaleDateString('fr-FR')}**.
        
        Pour continuer à profiter de vos avantages (accès prioritaire, remises membres, etc.), vous pouvez renouveler votre abonnement directement depuis votre espace personnel.
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.CLIENT_URL || '#'}/subscription" class="btn">Renouveler mon abonnement</a>
        </div>
        
        Si vous avez des questions, n'hésitez pas à contacter notre équipe.
      `;

      await sendEmail({
        to: user.email,
        subject: '⚠️ Votre abonnement Padel Arena expire bientôt !',
        text: `Bonjour ${user.name}, votre abonnement expire le ${user.subscriptionExpiresAt?.toLocaleDateString('fr-FR')}. Renouvelez-le sur votre espace client.`,
        html: getEmailTemplate(emailTitle, emailBody)
      });
    }

    console.log('✅ Rappels envoyés avec succès.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur lors des rappels :', err);
    process.exit(1);
  }
};

sendReminders();
