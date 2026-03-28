import mongoose from 'mongoose';
import News from './models/News.js';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/padel_arena';

const seedLongNews = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const longContent = `Le Padel Arena a le plaisir de vous annoncer l'ouverture officielle de son centre de haute performance...

Cette nouvelle infrastructure comprend :
- 3 nouveaux terrains panoramiques de dernière génération.
- Un système d'éclairage LED sans ombre pour un confort de jeu optimal.
- Des caméras intelligentes pour enregistrer vos matchs et analyser vos coups.

Pourquoi cette extension ?
Notre mission a toujours été de fournir la meilleure expérience de Padel au Maroc. Avec l'augmentation croissante du nombre de joueurs, il était essentiel de s'agrandir tout en montant en gamme.

Programme de la semaine d'ouverture :
- Lundi : Découverte gratuite pour les nouveaux membres.
- Mercredi : Tournoi d'exhibition avec des joueurs du top 10 national.
- Vendredi : Soirée de gala et présentation du nouveau staff technique.

Nous avons hâte de vous voir sur les nouveaux terrains !`;

        const news = new News({
            title: "OUVERTURE DU CENTRE DE HAUTE PERFORMANCE : UNE NOUVELLE ÈRE",
            category: "OFFICIEL",
            date: "28 MARS 2026",
            image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2070&auto=format&fit=crop",
            description: "Découvrez notre nouvelle extension premium et nos installations de pointe.",
            content: longContent,
            featured: true,
            isActive: true,
            order: -1
        });

        await news.save();
        console.log('Sample news with long content added successfully!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedLongNews();
