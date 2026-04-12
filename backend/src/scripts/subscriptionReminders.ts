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
      
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #1349D3; margin-bottom: 5px;">PADEL ARENA</h1>
            <p style="text-transform: uppercase; font-size: 12px; letter-spacing: 2px; color: #888;">Renouvellement d'abonnement</p>
          </div>
          
          <p>Bonjour <strong>${user.name}</strong>,</p>
          
          <p>C'est déjà presque l'heure ! Votre abonnement <strong>${(user.subscription as any)?.name || 'Premium'}</strong> arrive à échéance le <strong>${user.subscriptionExpiresAt?.toLocaleDateString('fr-FR')}</strong>.</p>
          
          <p>Pour continuer à profiter de vos avantages (accès prioritaire, remises membres, etc.), vous pouvez renouveler votre abonnement directement depuis votre espace personnel.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/subscription" style="background-color: #1349D3; color: white; padding: 15px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; text-transform: uppercase; font-size: 14px;">RENONVELER MON ABONNEMENT</a>
          </div>
          
          <p style="font-size: 12px; color: #888; text-align: center;">
            Si vous avez des questions, n'hésitez pas à contacter notre équipe.
          </p>
        </div>
      `;

      await sendEmail({
        to: user.email,
        subject: '⚠️ Votre abonnement Padel Arena expire bientôt !',
        text: `Bonjour ${user.name}, votre abonnement expire le ${user.subscriptionExpiresAt?.toLocaleDateString('fr-FR')}. Renouvelez-le sur votre espace client.`,
        html: emailContent
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
