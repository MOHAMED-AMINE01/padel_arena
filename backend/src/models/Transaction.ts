import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
    type: 'INCOME' | 'EXPENSE';
    amount: number;
    description: string;
    method: 'CASH' | 'CARD' | 'STRIPE' | 'TRANSFER' | 'WALLET';
    status: 'COMPLETED' | 'PENDING' | 'FAILED';
    managedBy: mongoose.Types.ObjectId;
    customerName?: string;
    category?: string;
    booking?: mongoose.Types.ObjectId;
    subscription?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema: Schema = new Schema({
    type: { type: String, enum: ['INCOME', 'EXPENSE'], required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    method: { type: String, enum: ['CASH', 'CARD', 'STRIPE', 'TRANSFER', 'WALLET'], default: 'CASH' },
    status: { type: String, enum: ['COMPLETED', 'PENDING', 'FAILED'], default: 'COMPLETED' },
    managedBy: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    customerName: { type: String },
    category: { type: String, default: 'General' },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking' },
    subscription: { type: Schema.Types.ObjectId, ref: 'Subscription' },
}, { timestamps: true });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
