import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../src/models/User';
import Subscription from '../src/models/Subscription';

dotenv.config({ path: path.join(__dirname, '../.env') });

const activateSubscription = async () => {
  const email = process.argv[2];
  
  if (!email) {
    console.error('Veuillez fournir un email : npm run activate-sub user@example.com');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connecté à la base de données...');

    // 1. Trouver le plan Heures Creuses
    const plan = await Subscription.findOne({ name: 'HEURES CREUSES' });
    if (!plan) {
      console.error('Plan "HEURES CREUSES" introuvable. Avez-vous exécuté le script reset-subscriptions.ts ?');
      process.exit(1);
    }

    // 2. Trouver l'utilisateur
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.error(`Utilisateur "${email}" introuvable.`);
      process.exit(1);
    }

    // 3. Activer l'abonnement
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + plan.durationInMonths);

    user.subscription = plan._id as any;
    user.subscriptionExpiresAt = expiryDate;
    await user.save();

    console.log(`✅ Succès ! L'abonnement a été activé pour ${email}.`);
    console.log(`Plan : ${plan.name}`);
    console.log(`Expire le : ${expiryDate.toLocaleDateString()}`);

    process.exit(0);
  } catch (error) {
    console.error('Erreur :', error);
    process.exit(1);
  }
};

activateSubscription();
