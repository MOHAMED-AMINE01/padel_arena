import mongoose, { Schema, Document } from 'mongoose';

export interface ITournament extends Document {
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    registrationDeadline: Date;
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
    maxTeams: number;
    currentTeams: number;
    entryFee: number;
    prize: string;
    image: string;
    level: 'P25' | 'P100' | 'P250' | 'P500' | 'P1000' | 'OPEN';
    participants: mongoose.Types.ObjectId[];
}

const TournamentSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    registrationDeadline: { type: Date, required: true },
    status: { type: String, enum: ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'], default: 'UPCOMING' },
    maxTeams: { type: Number, required: true },
    currentTeams: { type: Number, default: 0 },
    entryFee: { type: Number, required: true },
    prize: { type: String, required: true },
    image: { type: String },
    level: { type: String, enum: ['P25', 'P100', 'P250', 'P500', 'P1000', 'OPEN'], default: 'OPEN' },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true
});

export default mongoose.model<ITournament>('Tournament', TournamentSchema);
