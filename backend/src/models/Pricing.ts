import mongoose, { Schema, Document } from 'mongoose';

export interface IPricing extends Document {
    title: string;
    type: string; // 'court', 'subscription', 'pack'
    description: string;
    offPeak?: number;
    peak?: number;
    weekend?: number;
    price?: string;
    annualPrice?: string;
    durationInMonths?: number;
    features: string[];
    featured: boolean;
    color?: string;
    accent?: string;
    icon?: string;
    isActive: boolean;
    order: number;
    creditAmount?: number; // For Wallet Packs
    bonusAmount?: number;  // Optional bonus credits
}

const PricingSchema: Schema = new Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String },
    offPeak: { type: Number },
    peak: { type: Number },
    weekend: { type: Number },
    price: { type: String },
    annualPrice: { type: String },
    durationInMonths: { type: Number, default: 1 },
    features: [{ type: String }],
    featured: { type: Boolean, default: false },
    color: { type: String },
    accent: { type: String },
    icon: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    creditAmount: { type: Number },
    bonusAmount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model<IPricing>('Pricing', PricingSchema);
