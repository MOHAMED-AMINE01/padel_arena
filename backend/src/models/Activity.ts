import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
    title: string;
    subtitle?: string;
    description: string;
    type: string;
    icon: string;
    image: string;
    link: string;
    items?: string[];
    order: number;
    isActive: boolean;
}

const ActivitySchema: Schema = new Schema({
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String, required: true },
    type: { type: String, required: true },
    icon: { type: String },
    image: { type: String },
    link: { type: String },
    items: [{ type: String }],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IActivity>('Activity', ActivitySchema);
