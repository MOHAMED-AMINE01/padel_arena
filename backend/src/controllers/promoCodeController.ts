import { Request, Response } from 'express';
import PromoCode from '../models/PromoCode';
import { asyncHandler } from '../utils/asyncHandler';

// @desc    Get all promo codes
// @route   GET /api/promo-codes
export const getPromoCodes = asyncHandler(async (req: Request, res: Response) => {
    const promoCodes = await PromoCode.find()
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: promoCodes.length,
        data: promoCodes
    });
});

// @desc    Get promo code stats
// @route   GET /api/promo-codes/stats
export const getPromoCodeStats = asyncHandler(async (req: Request, res: Response) => {
    const now = new Date();

    const totalCodes = await PromoCode.countDocuments();
    const activeCodes = await PromoCode.countDocuments({ 
        isActive: true,
        validFrom: { $lte: now },
        validUntil: { $gte: now }
    });
    const expiredCodes = await PromoCode.countDocuments({
        validUntil: { $lt: now }
    });

    // Total usage
    const usageAgg = await PromoCode.aggregate([
        { $group: { _id: null, totalUsage: { $sum: '$currentUsageCount' } } }
    ]);
    const totalUsage = usageAgg[0]?.totalUsage || 0;

    // Most used code
    const mostUsed = await PromoCode.findOne().sort({ currentUsageCount: -1 }).limit(1);

    res.status(200).json({
        success: true,
        data: {
            totalCodes,
            activeCodes,
            expiredCodes,
            totalUsage,
            mostUsedCode: mostUsed ? {
                code: mostUsed.code,
                usageCount: mostUsed.currentUsageCount
            } : null
        }
    });
});

// @desc    Get single promo code
// @route   GET /api/promo-codes/:id
export const getPromoCode = asyncHandler(async (req: Request, res: Response) => {
    const promoCode = await PromoCode.findById(req.params.id)
        .populate('createdBy', 'name email')
        .populate('usedBy', 'name email');

    if (!promoCode) {
        return res.status(404).json({ success: false, message: 'Code promo introuvable.' });
    }

    res.status(200).json({
        success: true,
        data: promoCode
    });
});

// @desc    Validate a promo code (public)
// @route   POST /api/promo-codes/validate
export const validatePromoCode = asyncHandler(async (req: Request, res: Response) => {
    const { code, purchaseAmount, applicationType } = req.body;

    if (!code) {
        return res.status(400).json({ success: false, message: 'Code promo requis.' });
    }

    const promoCode = await PromoCode.findOne({ code: code.toUpperCase() });

    if (!promoCode) {
        return res.status(404).json({ success: false, message: 'Code promo invalide.' });
    }

    const now = new Date();

    // Check if active
    if (!promoCode.isActive) {
        return res.status(400).json({ success: false, message: 'Ce code promo n\'est plus actif.' });
    }

    // Check validity dates
    if (now < promoCode.validFrom) {
        return res.status(400).json({ success: false, message: 'Ce code promo n\'est pas encore valide.' });
    }

    if (now > promoCode.validUntil) {
        return res.status(400).json({ success: false, message: 'Ce code promo a expiré.' });
    }

    // Check max usage
    if (promoCode.maxUsageCount && promoCode.currentUsageCount >= promoCode.maxUsageCount) {
        return res.status(400).json({ success: false, message: 'Ce code promo a atteint sa limite d\'utilisation.' });
    }

    // Check minimum purchase amount
    if (purchaseAmount && promoCode.minPurchaseAmount && purchaseAmount < promoCode.minPurchaseAmount) {
        return res.status(400).json({ 
            success: false, 
            message: `Montant minimum requis: ${promoCode.minPurchaseAmount}€` 
        });
    }

    // Check applicable type
    if (applicationType && promoCode.applicableTo !== 'all' && promoCode.applicableTo !== applicationType) {
        return res.status(400).json({ 
            success: false, 
            message: `Ce code est valable uniquement pour: ${promoCode.applicableTo}` 
        });
    }

    // Calculate discount
    let discountAmount = 0;
    if (purchaseAmount) {
        if (promoCode.discountType === 'percentage') {
            discountAmount = (purchaseAmount * promoCode.discountValue) / 100;
        } else {
            discountAmount = Math.min(promoCode.discountValue, purchaseAmount);
        }
    }

    res.status(200).json({
        success: true,
        data: {
            code: promoCode.code,
            description: promoCode.description,
            discountType: promoCode.discountType,
            discountValue: promoCode.discountValue,
            discountAmount: Math.round(discountAmount * 100) / 100,
            applicableTo: promoCode.applicableTo
        }
    });
});

// @desc    Create a promo code
// @route   POST /api/promo-codes
export const createPromoCode = asyncHandler(async (req: Request, res: Response) => {
    // Add the creator
    req.body.createdBy = (req as any).user._id;

    // Ensure code is uppercase
    if (req.body.code) {
        req.body.code = req.body.code.toUpperCase();
    }

    const promoCode = await PromoCode.create(req.body);

    res.status(201).json({
        success: true,
        data: promoCode
    });
});

// @desc    Update a promo code
// @route   PUT /api/promo-codes/:id
export const updatePromoCode = asyncHandler(async (req: Request, res: Response) => {
    // Ensure code is uppercase if provided
    if (req.body.code) {
        req.body.code = req.body.code.toUpperCase();
    }

    const promoCode = await PromoCode.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!promoCode) {
        return res.status(404).json({ success: false, message: 'Code promo introuvable.' });
    }

    res.status(200).json({
        success: true,
        data: promoCode
    });
});

// @desc    Delete a promo code
// @route   DELETE /api/promo-codes/:id
export const deletePromoCode = asyncHandler(async (req: Request, res: Response) => {
    const promoCode = await PromoCode.findByIdAndDelete(req.params.id);

    if (!promoCode) {
        return res.status(404).json({ success: false, message: 'Code promo introuvable.' });
    }

    res.status(200).json({
        success: true,
        message: 'Code promo supprimé avec succès.'
    });
});

// @desc    Toggle promo code active status
// @route   PATCH /api/promo-codes/:id/toggle
export const togglePromoCode = asyncHandler(async (req: Request, res: Response) => {
    const promoCode = await PromoCode.findById(req.params.id);

    if (!promoCode) {
        return res.status(404).json({ success: false, message: 'Code promo introuvable.' });
    }

    promoCode.isActive = !promoCode.isActive;
    await promoCode.save();

    res.status(200).json({
        success: true,
        data: promoCode
    });
});

// @desc    Apply promo code (increment usage)
// @route   POST /api/promo-codes/:id/apply
export const applyPromoCode = asyncHandler(async (req: Request, res: Response) => {
    const promoCode = await PromoCode.findById(req.params.id);

    if (!promoCode) {
        return res.status(404).json({ success: false, message: 'Code promo introuvable.' });
    }

    const userId = (req as any).user._id;

    // Increment usage
    promoCode.currentUsageCount += 1;
    
    // Add user to usedBy if not already present
    if (!promoCode.usedBy.includes(userId)) {
        promoCode.usedBy.push(userId);
    }

    await promoCode.save();

    res.status(200).json({
        success: true,
        data: promoCode
    });
});
