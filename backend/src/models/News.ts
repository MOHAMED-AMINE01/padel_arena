import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
    title: string;
    category: string;
    date: string;
    image: string;
    description: string;
    featured: boolean;
    link: string;
    isActive: boolean;
    order: number;
    content: string;
}

const NewsSchema: Schema = new Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    image: { type: String },
    description: { type: String, required: true },
    content: { type: String },
    featured: { type: Boolean, default: false },
    link: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model<INews>('News', NewsSchema);
