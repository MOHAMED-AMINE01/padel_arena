import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
    name: string; // e.g., 'BASIC', 'PREMIUM', 'ELITE'
    price: number;
    durationInMonths: number;
    features: string[];
    isActive: boolean;
}

const SubscriptionSchema: Schema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    durationInMonths: { type: Number, default: 1 },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
