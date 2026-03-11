import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
    user?: mongoose.Types.ObjectId;
    guestName?: string;
    guestEmail?: string;
    guestPhone?: string;
    court: mongoose.Types.ObjectId;
    startTime: Date;
    endTime: Date;
    totalPrice: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED';
    stripePaymentIntentId?: string;
    promoCode?: string;
    discountAmount?: number;
    players?: number;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    guestName: { type: String },
    guestEmail: { type: String },
    guestPhone: { type: String },
    court: { type: Schema.Types.ObjectId, ref: 'Court', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    players: { type: Number, default: 4 },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
        default: 'PENDING'
    },
    paymentStatus: {
        type: String,
        enum: ['UNPAID', 'PAID', 'REFUNDED'],
        default: 'UNPAID'
    },
    stripePaymentIntentId: { type: String },
    promoCode: { type: String },
    discountAmount: { type: Number, default: 0 }
}, {
    timestamps: true
});

// Create index to quickly find conflicts and bookings per user/court
BookingSchema.index({ court: 1, startTime: 1, endTime: 1 });
BookingSchema.index({ user: 1 });

export default mongoose.model<IBooking>('Booking', BookingSchema);
