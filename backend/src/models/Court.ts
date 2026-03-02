import mongoose, { Schema, Document } from 'mongoose';

export interface ICourt extends Document {
    name: string;
    type: 'INDOOR' | 'OUTDOOR' | 'Padel Panorama' | 'Padel Classic' | 'Pickleball High';
    sport: 'Padel' | 'Pickleball' | 'Badminton';
    surface: 'CLAY' | 'CONCRETE' | 'SYNTHETIC' | 'PRO_TURF';
    pricePerHour: number;
    images: string[];
    description: string;
    isActive: boolean;
    clubManager: mongoose.Types.ObjectId;
}

const CourtSchema: Schema = new Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['INDOOR', 'OUTDOOR', 'Padel Panorama', 'Padel Classic', 'Pickleball High'], required: true },
    sport: { type: String, enum: ['Padel', 'Pickleball', 'Badminton'], default: 'Padel' },
    surface: { type: String, enum: ['CLAY', 'CONCRETE', 'SYNTHETIC', 'PRO_TURF'], default: 'PRO_TURF' },
    pricePerHour: { type: Number, required: true },
    images: [{ type: String }],
    description: { type: String },
    isActive: { type: Boolean, default: true },
    clubManager: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});

export default mongoose.model<ICourt>('Court', CourtSchema);
