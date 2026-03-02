/**
 * Script: setSportOnCourts.ts
 * 
 * Met à jour le champ `sport` sur les terrains existants en base.
 * Padel Arena Vendôme a :
 *   - 3 terrains de Padel
 *   - 1 terrain partagé Pickleball / Badminton
 * 
 * Usage: npx ts-node -r tsconfig-paths/register scripts/setSportOnCourts.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Court from '../src/models/Court';

async function setSportOnCourts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('✅ Connected to MongoDB');

        const courts = await Court.find();
        console.log(`\n📋 ${courts.length} terrain(s) trouvé(s) :\n`);
        courts.forEach((c, i) => {
            console.log(`  ${i + 1}. [${c._id}] "${c.name}" — type: ${c.type} — sport actuel: ${c.sport || 'NON DÉFINI'}`);
        });

        if (courts.length === 0) {
            console.log('\n❌ Aucun terrain en base. Ajoutez des terrains d\'abord via le dashboard admin.');
            return;
        }

        // ── Règles de mapping automatique ──────────────────────────────────
        // Logique : si le nom ou le type contient "Pickleball"/"Badminton" → assign sport
        // Sinon → Padel par défaut

        let updated = 0;
        for (const court of courts) {
            const nameLower = court.name?.toLowerCase() || '';
            const typeLower = court.type?.toLowerCase() || '';

            let sport: 'Padel' | 'Pickleball' | 'Badminton' = 'Padel';

            if (nameLower.includes('pickleball') || typeLower.includes('pickleball')) {
                sport = 'Pickleball';
            } else if (nameLower.includes('badminton') || typeLower.includes('badminton')) {
                sport = 'Badminton';
            }

            if (court.sport !== sport) {
                await Court.findByIdAndUpdate(court._id, { sport });
                console.log(`  ✏️  "${court.name}" → sport mis à jour : ${sport}`);
                updated++;
            } else {
                console.log(`  ✔  "${court.name}" → sport déjà correct : ${sport}`);
            }
        }

        console.log(`\n✅ ${updated} terrain(s) mis à jour.`);
        console.log('\n💡 Conseil : Si le terrain partagé Pickleball/Badminton apparaît comme un seul terrain,');
        console.log('   créez deux terrains distincts dans le dashboard admin :');
        console.log('   - Un avec sport = "Pickleball"');
        console.log('   - Un avec sport = "Badminton"');

        await mongoose.disconnect();
        console.log('\n✅ Terminé.');
    } catch (err) {
        console.error('❌ Erreur:', err);
        process.exit(1);
    }
}

setSportOnCourts();
