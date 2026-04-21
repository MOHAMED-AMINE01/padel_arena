import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pricing from '../models/Pricing';

dotenv.config();

const packs = [
  {
    title: 'PACK ESSENTIEL',
    type: 'wallet_pack',
    description: 'Rechargement de base pour vos parties régulières.',
    price: '50',
    creditAmount: 50,
    bonusAmount: 0,
    features: ['Sans limite de durée', 'Valable sur tous les terrains'],
    icon: 'Wallet',
    order: 100,
    isActive: true
  },
  {
    title: 'PACK POPULAIRE',
    type: 'wallet_pack',
    description: 'Le meilleur rapport qualité-prix pour les passionnés.',
    price: '100',
    creditAmount: 100,
    bonusAmount: 10,
    features: ['10€ de bonus inclus', 'Sans limite de durée', 'Priorité réservation'],
    icon: 'Zap',
    featured: true,
    order: 101,
    isActive: true
  },
  {
    title: 'PACK VIP',
    type: 'wallet_pack',
    description: 'Pour ceux qui ne ratent aucun match de la semaine.',
    price: '200',
    creditAmount: 200,
    bonusAmount: 30,
    features: ['30€ de bonus inclus', 'Accès événements VIP', 'Cadeau de bienvenue'],
    icon: 'Star',
    order: 102,
    isActive: true
  },
  {
    title: 'PACK ÉLITE',
    type: 'wallet_pack',
    description: 'Le pack ultime pour les compétiteurs acharnés.',
    price: '500',
    creditAmount: 500,
    bonusAmount: 100,
    features: ['100€ de bonus inclus', 'Service conciergerie', 'Analyse de jeu'],
    icon: 'Trophy',
    order: 103,
    isActive: true
  }
];

const seedPacks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('📦 Connexion à MongoDB réussie...');

    // Remove existing packs to avoid duplicates if needed, 
    // or just insert if they don't exist.
    // For this task, we insert them.

    for (const pack of packs) {
      await Pricing.findOneAndUpdate(
        { title: pack.title, type: 'pack' },
        pack,
        { upsert: true, new: true }
      );
      console.log(`✅ Pack "${pack.title}" synchronisé.`);
    }

    console.log('🚀 Migration des Cartes d\'achat terminée !');
    process.exit();
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    process.exit(1);
  }
};

seedPacks();
