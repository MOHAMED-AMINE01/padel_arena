const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const CourtSchema = new mongoose.Schema({
    name: String,
    type: String,
    sport: String,
    surface: String,
    offPeakPrice: Number,
    peakPrice: Number,
    description: String,
    isActive: Boolean,
    clubManager: mongoose.Schema.Types.ObjectId
});

const Court = mongoose.model('Court', CourtSchema);

async function addGolf() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find a club manager ID to use (essential for the model)
        const someCourt = await Court.findOne({});
        const managerId = someCourt ? someCourt.clubManager : new mongoose.Types.ObjectId();

        const golfCourt = await Court.create({
            name: "SIMULATEUR GOLF 1",
            type: "Golf Simulator",
            sport: "Golf",
            surface: "PRO_TURF",
            offPeakPrice: 20,
            peakPrice: 24,
            description: "Simulateur de golf haute précision avec analyse Trackman 4.",
            isActive: true,
            clubManager: managerId
        });

        console.log('Golf court added successfully:', golfCourt._id);
        process.exit(0);
    } catch (err) {
        console.error('Failed to add golf court:', err);
        process.exit(1);
    }
}

addGolf();
