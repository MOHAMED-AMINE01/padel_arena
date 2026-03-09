import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    senderName: string;
    senderEmail: string;
    subject: string;
    content: string;
    status: 'READ' | 'UNREAD' | 'REPLIED';
    type: 'INBOUND' | 'OUTBOUND';
    parentMessage?: mongoose.Types.ObjectId;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema: Schema = new Schema({
    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true },
    subject: { type: String, required: true },
    content: { type: String, required: true },
    status: {
        type: String,
        enum: ['READ', 'UNREAD', 'REPLIED'],
        default: 'UNREAD'
    },
    type: {
        type: String,
        enum: ['INBOUND', 'OUTBOUND'],
        default: 'INBOUND'
    },
    parentMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    },
    isArchived: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IMessage>('Message', MessageSchema);
