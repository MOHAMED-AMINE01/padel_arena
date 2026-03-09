import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoice extends Document {
    number: string;
    client: string;
    email?: string;
    address?: string;
    amount: number;
    status: 'PAID' | 'UNPAID' | 'CANCELLED';
    date: Date;
    dueDate: Date;
    items: Array<{
        description: string;
        quantity: number;
        price: number;
    }>;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const InvoiceSchema: Schema = new Schema({
    number: { type: String, required: true, unique: true },
    client: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['PAID', 'UNPAID', 'CANCELLED'],
        default: 'UNPAID'
    },
    date: { type: Date, default: Date.now },
    dueDate: { type: Date },
    items: [{
        description: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true }
    }],
    notes: { type: String }
}, { timestamps: true });

export default mongoose.model<IInvoice>('Invoice', InvoiceSchema);
