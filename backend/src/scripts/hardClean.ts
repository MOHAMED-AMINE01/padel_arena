import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pricing from '../models/Pricing';

dotenv.config();

const hardClean = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('📦 Connexion MongoDB...');

        // 1. Lister ce qu'on trouve
        const all = await Pricing.find({});
        console.log(`📊 Total d'éléments dans Pricing : ${all.length}`);
        
        // 2. Supprimer TOUS les éléments qui ont creditAmount: 0 ou undefined
        // car une carte d'achat doit forcément avoir un montant.
        const res1 = await Pricing.deleteMany({ 
            $or: [
                { creditAmount: { $exists: false } },
                { creditAmount: 0 },
                { title: 'PADEL' },
                { title: 'SIMULATEUR DE GOLF' },
                { title: 'PICKLEBALL & BADMINTON' },
                { title: 'PACK DÉCOUVERTE' }
            ],
            type: 'wallet_pack' 
        });
        console.log(`🧹 Suppression des cartes invalides : ${res1.deletedCount} supprimées.`);

        // 3. Vérification finale des packs restants
        const remaining = await Pricing.find({ type: 'wallet_pack' });
        console.log('✅ Packs restants en base :', remaining.map(p => p.title));

        process.exit();
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
};

hardClean();
