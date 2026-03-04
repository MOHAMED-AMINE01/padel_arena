import PromoCode from '../models/PromoCode';
import mongoose from 'mongoose';

export interface ValidationResult {
    isValid: boolean;
    message?: string;
    discountAmount: number;
    promoCodeId?: string;
}

export const validateAndApplyPromoCode = async (
    code: string,
    purchaseAmount: number,
    applicationType: 'booking' | 'subscription' | 'course' | 'tournament' | 'all',
    userId: string
): Promise<ValidationResult> => {
    if (!code) {
        return { isValid: false, message: 'Code promo requis.', discountAmount: 0 };
    }

    const promoCode = await PromoCode.findOne({ code: code.toUpperCase() });

    if (!promoCode) {
        return { isValid: false, message: 'Code promo invalide.', discountAmount: 0 };
    }

    const now = new Date();

    // Check if active
    if (!promoCode.isActive) {
        return { isValid: false, message: 'Ce code promo n\'est plus actif.', discountAmount: 0 };
    }

    // Check validity dates
    if (now < promoCode.validFrom) {
        return { isValid: false, message: 'Ce code promo n\'est pas encore valide.', discountAmount: 0 };
    }

    if (now > promoCode.validUntil) {
        return { isValid: false, message: 'Ce code promo a expiré.', discountAmount: 0 };
    }

    // Check max usage
    if (promoCode.maxUsageCount && promoCode.currentUsageCount >= promoCode.maxUsageCount) {
        return { isValid: false, message: 'Ce code promo a atteint sa limite d\'utilisation.', discountAmount: 0 };
    }

    // Check applicable type
    if (promoCode.applicableTo !== 'all' && promoCode.applicableTo !== applicationType) {
        return {
            isValid: false,
            message: `Ce code est valable uniquement pour: ${promoCode.applicableTo}`,
            discountAmount: 0
        };
    }

    // Check minimum purchase amount
    if (promoCode.minPurchaseAmount && purchaseAmount < promoCode.minPurchaseAmount) {
        return {
            isValid: false,
            message: `Montant minimum requis: ${promoCode.minPurchaseAmount}€`,
            discountAmount: 0
        };
    }

    // Calculate discount
    let discountAmount = 0;
    if (promoCode.discountType === 'percentage') {
        discountAmount = (purchaseAmount * promoCode.discountValue) / 100;
    } else {
        discountAmount = Math.min(promoCode.discountValue, purchaseAmount);
    }

    discountAmount = Math.round(discountAmount * 100) / 100;

    return {
        isValid: true,
        discountAmount,
        promoCodeId: promoCode._id.toString()
    };
};

export const incrementPromoCodeUsage = async (promoCodeId: string, userId: string) => {
    const promoCode = await PromoCode.findById(promoCodeId);
    if (!promoCode) return;

    promoCode.currentUsageCount += 1;

    const userObjectId = new mongoose.Types.ObjectId(userId);
    if (!promoCode.usedBy.includes(userObjectId)) {
        promoCode.usedBy.push(userObjectId);
    }

    await promoCode.save();
};
