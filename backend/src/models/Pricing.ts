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
    features: string[];
    featured: boolean;
    color?: string;
    accent?: string;
    icon?: string;
    isActive: boolean;
    order: number;
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
    features: [{ type: String }],
    featured: { type: Boolean, default: false },
    color: { type: String },
    accent: { type: String },
    icon: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model<IPricing>('Pricing', PricingSchema);
