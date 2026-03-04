import mongoose, { Schema, Document } from 'mongoose';

export interface IPromoCode extends Document {
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minPurchaseAmount?: number;
    maxUsageCount?: number;
    currentUsageCount: number;
    usedBy: mongoose.Types.ObjectId[];
    validFrom: Date;
    validUntil: Date;
    isActive: boolean;
    applicableTo: 'all' | 'booking' | 'subscription' | 'course';
    createdBy: mongoose.Types.ObjectId;
}

const PromoCodeSchema: Schema = new Schema({
    code: { 
        type: String, 
        required: true, 
        unique: true, 
        uppercase: true,
        trim: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    discountType: { 
        type: String, 
        enum: ['percentage', 'fixed'], 
        required: true 
    },
    discountValue: { 
        type: Number, 
        required: true,
        min: 0 
    },
    minPurchaseAmount: { 
        type: Number, 
        default: 0 
    },
    maxUsageCount: { 
        type: Number, 
        default: null 
    },
    currentUsageCount: { 
        type: Number, 
        default: 0 
    },
    usedBy: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    validFrom: { 
        type: Date, 
        required: true 
    },
    validUntil: { 
        type: Date, 
        required: true 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    applicableTo: { 
        type: String, 
        enum: ['all', 'booking', 'subscription', 'course'], 
        default: 'all' 
    },
    createdBy: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }
}, {
    timestamps: true
});

// Index for faster lookups
PromoCodeSchema.index({ code: 1 });
PromoCodeSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });

export default mongoose.model<IPromoCode>('PromoCode', PromoCodeSchema);
