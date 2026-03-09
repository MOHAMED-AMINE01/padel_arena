import mongoose, { Document, Schema } from 'mongoose';

export interface INewsletterSubscriber extends Document {
    email: string;
    isActive: boolean;
    subscribedAt: Date;
}

const newsletterSubscriberSchema: Schema = new Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.model<INewsletterSubscriber>('NewsletterSubscriber', newsletterSubscriberSchema);
