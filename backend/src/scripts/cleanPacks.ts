import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pricing from '../models/Pricing';

dotenv.config();

const cleanAndSeed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('📦 Connexion MongoDB...');

        // 1. Suppression de TOUS les wallet_pack existants pour repartir sur une base propre
        await Pricing.deleteMany({ type: 'wallet_pack' });
        console.log('🗑️ Anciennes cartes supprimées.');

        // 2. Définition des packs officiels
        const officialPacks = [
            {
                title: 'PACK ESSENTIEL',
                type: 'wallet_pack',
                description: 'Rechargement de base pour vos parties régulières.',
                price: '50',
                creditAmount: 50,
                bonusAmount: 0,
                features: ['Sans limite de durée', 'Valable sur tous les terrains'],
                icon: 'Wallet',
                order: 1,
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
                order: 2,
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
                order: 3,
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
                order: 4,
                isActive: true
            }
        ];

        // 3. Insertion des packs officiels
        await Pricing.insertMany(officialPacks);
        console.log('✅ Packs officiels réenregistrés.');

        // 4. Facultatif : Nettoyage des packs "0€" qui pourraient traîner dans le type "pack" standard
        // (Uniquement ceux qui ont creditAmount: 0 ou qui ressemblent à des erreurs)
        const result = await Pricing.deleteMany({ 
            type: 'pack', 
            $or: [
                { creditAmount: 0 },
                { title: { $in: ['PADEL', 'SIMULATEUR DE GOLF', 'PICKLEBALL & BADMINTON'] } }
            ]
        });
        console.log(`🧹 Nettoyage des résidus terminé (${result.deletedCount} supprimés).`);

        console.log('🚀 Base de données propre et prête !');
        process.exit();
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
};

cleanAndSeed();
