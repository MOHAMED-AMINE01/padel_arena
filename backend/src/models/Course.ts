import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
    title: string;
    description: string;
    coach: string;
    level: 'DEBUTANT' | 'INTERMEDIAIRE' | 'AVANCE' | 'EXPERT';
    date: Date;
    duration: number; // in minutes
    maxParticipants: number;
    currentParticipants: number;
    price: number;
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
    sport: 'PADEL' | 'PICKLEBALL' | 'BADMINTON';
    participants: mongoose.Types.ObjectId[];
}

const CourseSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    coach: { type: String, required: true },
    level: { type: String, enum: ['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE', 'EXPERT'], default: 'DEBUTANT' },
    date: { type: Date, required: true },
    duration: { type: Number, required: true, default: 60 },
    maxParticipants: { type: Number, required: true, default: 8 },
    currentParticipants: { type: Number, default: 0 },
    price: { type: Number, required: true },
    status: { type: String, enum: ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'], default: 'UPCOMING' },
    sport: { type: String, enum: ['PADEL', 'PICKLEBALL', 'BADMINTON'], default: 'PADEL' },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true
});

export default mongoose.model<ICourse>('Course', CourseSchema);
