/**
 * Injecte les coordonnées réelles du club (adresse + réseaux sociaux + lien Maps)
 * dans les SiteSettings, sans écraser les autres champs (téléphone, email...).
 *
 * Lancer :  npx ts-node src/scripts/updateSeoSettings.ts
 * (depuis le dossier backend/, avec MONGODB_URI dans .env)
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { SiteSettings } from '../models/SiteSettings';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/padel-arena';

// --- Données réelles (source de vérité) ---
const REAL = {
  address: '16 Rue Auguste Comté, 41100 Saint-Ouen',
  googleMapsUrl:
    'https://www.google.com/maps/place/PADEL+ARENA+Vend%C3%B4me%2FSaint-Ouen,+16+Rue+Auguste+Comt%C3%A9,+41100+Saint-Ouen,+France',
  instagram: 'https://www.instagram.com/padelarenavendomois',
  facebook: 'https://www.facebook.com/share/1BzeKTr6t9/',
};

const run = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // $set en notation pointée : on ne touche QUE ces champs.
    const updated = await SiteSettings.findOneAndUpdate(
      {},
      {
        $set: {
          address: REAL.address,
          googleMapsUrl: REAL.googleMapsUrl,
          'socialLinks.instagram': REAL.instagram,
          'socialLinks.facebook': REAL.facebook,
          updatedAt: new Date(),
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    console.log('✅ SiteSettings mis à jour. Document en base :');
    console.log(JSON.stringify(
      {
        phone: updated?.phone,
        email: updated?.email,
        address: updated?.address,
        googleMapsUrl: updated?.googleMapsUrl,
        socialLinks: updated?.socialLinks,
      },
      null,
      2
    ));

    // --- Vérification automatique ---
    const checks: [string, boolean][] = [
      ['address', updated?.address === REAL.address],
      ['googleMapsUrl', updated?.googleMapsUrl === REAL.googleMapsUrl],
      ['instagram', (updated as any)?.socialLinks?.instagram === REAL.instagram],
      ['facebook', (updated as any)?.socialLinks?.facebook === REAL.facebook],
    ];
    const allOk = checks.every(([, ok]) => ok);
    console.log('\n🔎 Vérification :');
    checks.forEach(([k, ok]) => console.log(`  ${ok ? '✓' : '✗'} ${k}`));
    console.log(allOk ? '\n🎉 Tout est bien pris en compte.' : '\n⚠️  Au moins un champ ne correspond pas.');

    await mongoose.disconnect();
    process.exit(allOk ? 0 : 1);
  } catch (error) {
    console.error('❌ Erreur :', error);
    process.exit(1);
  }
};

run();
