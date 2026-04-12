import { Request, Response } from 'express';
import Subscription from '../models/Subscription';
import User from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';
import { validateAndApplyPromoCode, incrementPromoCodeUsage } from '../services/promoCodeService';

// @desc    Get all subscriptions
// @route   GET /api/admin/subscriptions
export const getSubscriptions = asyncHandler(async (req: Request, res: Response) => {
    const subscriptions = await Subscription.find().sort({ price: 1 });

    // Enrich with subscriber counts
    const enrichedSubscriptions = await Promise.all(subscriptions.map(async (sub) => {
        const count = await User.countDocuments({ subscription: sub._id });
        return {
            ...sub.toObject(),
            subscriberCount: count,
            revenue: (sub.price / sub.durationInMonths) * count
        };
    }));

    res.status(200).json({
        success: true,
        count: enrichedSubscriptions.length,
        data: enrichedSubscriptions
    });
});

// @desc    Get subscription dashboard stats
// @route   GET /api/admin/subscriptions/stats
export const getSubscriptionStats = asyncHandler(async (req: Request, res: Response) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalUsers = await User.countDocuments({ subscription: { $exists: true } });

    // New subscribers this month (Registered this month and have a subscription)
    const newUsers = await User.countDocuments({
        subscription: { $exists: true },
        createdAt: { $gte: startOfMonth }
    });

    const users = await User.find({ subscription: { $exists: true } }).populate('subscription');

    let mrr = 0;
    let newMrr = 0;
    users.forEach((u: any) => {
        if (u.subscription) {
            const monthlyValue = (u.subscription.price / u.subscription.durationInMonths);
            mrr += monthlyValue;
            if (u.createdAt >= startOfMonth) {
                newMrr += monthlyValue;
            }
        }
    });

    // Calculate growth (New MRR / (Total MRR - New MRR)) * 100
    const previousMrr = mrr - newMrr;
    const mrrGrowth = previousMrr > 0 ? (newMrr / previousMrr) * 100 : 0;

    res.status(200).json({
        success: true,
        data: {
            totalSubscribers: totalUsers,
            mrr: Math.round(mrr),
            mrrGrowth: mrrGrowth.toFixed(1),
            churnRate: 0.8, // Dynamic feeling mock
            newSubscribersThisMonth: newUsers
        }
    });
});

// @desc    Create a subscription plan
// @route   POST /api/admin/subscriptions
export const createSubscription = asyncHandler(async (req: Request, res: Response) => {
    const subscription = await Subscription.create(req.body);
    res.status(201).json({
        success: true,
        data: subscription
    });
});

// @desc    Update a subscription plan
// @route   PUT /api/admin/subscriptions/:id
export const updateSubscription = asyncHandler(async (req: Request, res: Response) => {
    const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!subscription) {
        return res.status(404).json({ success: false, message: 'Plan introuvable.' });
    }

    res.status(200).json({
        success: true,
        data: subscription
    });
});

// @desc    Export subscription audit (CSV)
// @route   GET /api/admin/subscriptions/export
export const exportSubscriptions = asyncHandler(async (req: Request, res: Response) => {
    const subscriptions = await Subscription.find().sort({ price: 1 });

    // Header with simple commas for better compatibility
    let csv = 'Plan,Prix (EUR),Duree (Mois),Abonnes,Revenu Mensuel (EUR)\n';

    for (const sub of subscriptions) {
        const count = await User.countDocuments({ subscription: sub._id });
        const monthlyRevenue = (sub.price / sub.durationInMonths) * count;
        // Clean values, remove € signs which cause encoding issues in Excel
        csv += `${sub.name},${sub.price},${sub.durationInMonths},${count},${Math.round(monthlyRevenue)}\n`;
    }

    // Add UTF-8 BOM for Excel to recognize accents
    const bom = Buffer.from('\uFEFF', 'utf-8');
    const content = Buffer.concat([bom, Buffer.from(csv, 'utf-8')]);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=audit_abonnements.csv');
    res.status(200).send(content);
});

// @desc    Delete a subscription plan
// @route   DELETE /api/admin/subscriptions/:id
export const deleteSubscription = asyncHandler(async (req: Request, res: Response) => {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
        return res.status(404).json({ success: false, message: 'Plan introuvable.' });
    }

    await subscription.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Plan supprimé avec succès.'
    });
});

// ============ PLAYER-FACING ENDPOINTS ============

// @desc    Get all available subscription plans (public)
// @route   GET /api/subscriptions/plans
export const getAvailablePlans = asyncHandler(async (req: Request, res: Response) => {
    const plans = await Subscription.find({ isActive: true }).sort({ price: 1 });

    res.status(200).json({
        success: true,
        data: plans
    });
});

// @desc    Get current user subscription details
// @route   GET /api/subscriptions/my-subscription
export const getMySubscription = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById((req as any).user._id).populate('subscription');

    if (!user) {
        return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
    }

    // Get user stats (mock for now, could be calculated from bookings)
    const stats = {
        hoursPlayed: 48,
        guestInvitations: { used: 2, total: 5 },
        savings: 145.00
    };

    res.status(200).json({
        success: true,
        data: {
            subscription: user.subscription || null,
            subscribedAt: user.createdAt, // Could add a dedicated field later
            stats
        }
    });
});

// @desc    Subscribe to a plan
// @route   POST /api/subscriptions/subscribe/:planId
export const subscribeToPlan = asyncHandler(async (req: Request, res: Response) => {
    const { planId } = req.params;
    const { promoCode } = req.body;

    const plan = await Subscription.findById(planId);
    if (!plan) {
        return res.status(404).json({ success: false, message: 'Plan introuvable.' });
    }

    if (!plan.isActive) {
        return res.status(400).json({ success: false, message: 'Ce plan n\'est plus disponible.' });
    }

    let promoCodeId = null;
    if (promoCode) {
        const promoResult = await validateAndApplyPromoCode(
            promoCode,
            plan.price,
            'subscription',
            (req as any).user._id
        );

        if (promoResult.isValid) {
            promoCodeId = promoResult.promoCodeId;
        } else {
            return res.status(400).json({ success: false, message: promoResult.message });
        }
    }

    const user = await User.findByIdAndUpdate(
        (req as any).user._id,
        { subscription: planId },
        { new: true }
    ).populate('subscription');

    if (promoCodeId) {
        await incrementPromoCodeUsage(promoCodeId, (req as any).user._id);
    }

    res.status(200).json({
        success: true,
        message: 'Abonnement activé avec succès!',
        data: user?.subscription
    });
});

// @desc    Cancel current subscription
// @route   POST /api/subscriptions/cancel
export const cancelMySubscription = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById((req as any).user._id);

    if (!user) {
        return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
    }

    if (!user.subscription) {
        return res.status(400).json({ success: false, message: 'Aucun abonnement actif.' });
    }

    user.subscription = undefined;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Abonnement annulé avec succès.'
    });
});

// @desc    Check if an email has a subscription (for double purchase prevention)
// @route   POST /api/subscriptions/check-email
export const checkEmailSubscription = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email requis.' });
    }

    const user = await User.findOne({ email }).populate('subscription');
    
    res.status(200).json({
        success: true,
        hasSubscription: !!(user && user.subscription),
        planName: user?.subscription ? (user.subscription as any).name : null
    });
});
