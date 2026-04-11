require('dotenv').config({ path: '../backend/.env' });
const mongoose = require('mongoose');

// Modèles minimalistes
const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    guestName: String,
    startTime: Date,
    endTime: Date,
    dateStr: String,
    timeStr: String,
    court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court' },
    status: { type: String, default: 'CONFIRMED' },
    paymentStatus: { type: String, default: 'PAID' },
    totalPrice: Number,
    bookingType: { type: String, default: 'COURT' }
}, { timestamps: true });

const transactionSchema = new mongoose.Schema({
    type: String,
    amount: Number,
    description: String,
    method: String,
    status: String,
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    customerName: String
}, { timestamps: true });

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
const Court = mongoose.models.Court || mongoose.model('Court', new mongoose.Schema({ name: String }));
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({ name: String, role: String }));

async function seedBookings() {
    try {
        console.log('Connexion à MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/padel_arena');
        console.log('Connecté. Recherche des terrains et utilisateurs...');

        const court = await Court.findOne();
        const user = await User.findOne({ role: 'PLAYER' }) || await User.findOne();

        if (!court) {
            console.error('Aucun terrain trouvé pour lier la réservation.');
            process.exit(1);
        }

        const pastDate1 = new Date();
        pastDate1.setDate(pastDate1.getDate() - 3); // Il y a 3 jours
        pastDate1.setHours(10, 0, 0, 0);

        const pastDate2 = new Date();
        pastDate2.setDate(pastDate2.getDate() - 5); // Il y a 5 jours
        pastDate2.setHours(14, 0, 0, 0);

        const pastDate3 = new Date();
        pastDate3.setDate(pastDate3.getDate() - 7); // Il y a 7 jours
        pastDate3.setHours(18, 0, 0, 0);

        const createBooking = async (date, price, guest) => {
            const end = new Date(date);
            end.setHours(end.getHours() + 1);
            
            const b = await Booking.create({
                user: user ? user._id : null,
                guestName: guest,
                startTime: date,
                endTime: end,
                dateStr: `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`,
                timeStr: `${date.getHours().toString().padStart(2, '0')}:00`,
                court: court._id,
                status: 'COMPLETED',
                paymentStatus: 'PAID',
                totalPrice: price
            });

            await Transaction.create({
                type: 'INCOME',
                amount: price,
                description: `Réservation Terrain #${b._id.toString().slice(-4)} (TEST SCRIPT)`,
                method: 'STRIPE',
                status: 'COMPLETED',
                booking: b._id,
                customerName: user ? user.name : guest
            });

            console.log(`✅ Créé: Réservation de test le ${b.dateStr} à ${b.timeStr} pour ${price}€`);
        };

        await createBooking(pastDate1, 30, 'Testeur Alpha');
        await createBooking(pastDate2, 35, 'Testeur Beta');
        await createBooking(pastDate3, 40, 'Testeur Gamma');

        console.log('Génération terminée avec succès.');
        process.exit(0);
    } catch (err) {
        console.error('Erreur:', err);
        process.exit(1);
    }
}

seedBookings();
