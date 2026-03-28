import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { SiteSettings } from './models/SiteSettings';
import { Testimonial } from './models/Testimonial';
import { TeamMember } from './models/TeamMember';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/padel-arena';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // 1. Site Settings
    await SiteSettings.deleteMany({});
    await SiteSettings.create({
      phone: '+33 2 00 00 00 00',
      email: 'contact@padelarena.fr',
      address: '123 Avenue du Padel, 41100 Vendôme',
      availability: '08:00 — 23:00, Sept jours sur sept',
      googleMapsUrl: 'https://maps.google.com',
      socialLinks: {
        instagram: 'https://instagram.com/padelarena',
        facebook: 'https://facebook.com/padelarena',
        twitter: '#'
      }
    });
    console.log('✅ Site Settings seeded');

    // 2. Testimonials
    await Testimonial.deleteMany({});
    const testimonials = [
      {
        name: "Marc D.",
        role: "Joueur Passionné",
        content: "Le meilleur club de la région. Les terrains panoramiques sont incroyables et l'ambiance au club house est toujours au top après les matchs.",
        rating: 5,
        avatar: "https://picsum.photos/seed/marc/100/100"
      },
      {
        name: "Julie L.",
        role: "Membre Académie",
        content: "J'ai énormément progressé grâce aux coachs. Les infrastructures sont modernes et très bien entretenues. Je recommande vivement !",
        rating: 5,
        avatar: "https://picsum.photos/seed/julie/100/100"
      },
      {
        name: "Antoine P.",
        role: "Compétiteur P250",
        content: "L'organisation des tournois est exemplaire. On sent que le club est géré par des passionnés qui connaissent les besoins des joueurs.",
        rating: 5,
        avatar: "https://picsum.photos/seed/antoine/100/100"
      }
    ];
    await Testimonial.insertMany(testimonials);
    console.log('✅ Testimonials seeded');

    // 3. Team Members
    await TeamMember.deleteMany({});
    const members = [
      {
        name: "Thomas Rivière",
        role: "Directeur du Club",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&h=800&auto=format&fit=crop",
        bio: "Visionnaire du padel moderne, Thomas assure que chaque membre vive l'expérience Arena au plus haut niveau.",
        socialLinks: { linkedin: '#', instagram: '#', email: 'thomas@padelarena.fr' },
        order: 0
      },
      {
        name: "Lucas Martin",
        role: "Head Coach",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&h=800&auto=format&fit=crop",
        bio: "Ex-joueur du circuit, Lucas transforme votre technique avec une approche analytique et passionnée.",
        socialLinks: { linkedin: '#', instagram: '#', email: 'lucas@padelarena.fr' },
        order: 1
      },
      {
        name: "Sophie Bernard",
        role: "Resp. Événements",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&h=800&auto=format&fit=crop",
        bio: "Architecte de vos tournois, elle fait de chaque rencontre un événement mémorable et parfaitement orchestré.",
        socialLinks: { linkedin: '#', instagram: '#', email: 'sophie@padelarena.fr' },
        order: 2
      },
      {
        name: "Marc Lefebvre",
        role: "Relations Club",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&h=800&auto=format&fit=crop",
        bio: "Le gardien de l'ambiance Arena. Marc tisse les liens qui font de notre club une véritable communauté.",
        socialLinks: { linkedin: '#', instagram: '#', email: 'marc@padelarena.fr' },
        order: 3
      }
    ];
    await TeamMember.insertMany(members);
    console.log('✅ Team Members seeded');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
