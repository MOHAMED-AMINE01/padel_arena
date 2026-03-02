import mongoose, { Schema, Document } from 'mongoose';

export interface ICashShift extends Document {
    status: 'OPEN' | 'CLOSED';
    openedBy: mongoose.Types.ObjectId;
    closedBy?: mongoose.Types.ObjectId;
    startTime: Date;
    endTime?: Date;
    startingCash: number;
    endingCash?: number;
    expectedEndingCash?: number;
    stripeRevenue?: number;
    totalRevenue?: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CashShiftSchema: Schema = new Schema({
    status: { type: String, enum: ['OPEN', 'CLOSED'], default: 'OPEN' },
    openedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    closedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    startingCash: { type: Number, default: 0 },
    endingCash: { type: Number },
    expectedEndingCash: { type: Number },
    stripeRevenue: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    notes: { type: String },
}, { timestamps: true });

export default mongoose.model<ICashShift>('CashShift', CashShiftSchema);
