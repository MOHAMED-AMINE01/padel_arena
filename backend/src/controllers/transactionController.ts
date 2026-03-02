import { Request, Response } from 'express';
import Transaction from '../models/Transaction';
import Booking from '../models/Booking';
import CashShift from '../models/CashShift';
import { asyncHandler } from '../utils/asyncHandler';

// @desc    Get all transactions + summary stats
// @route   GET /api/admin/transactions
// @access  Private (Admin)
export const getTransactions = asyncHandler(async (req: Request, res: Response) => {
    // 1. Get List of manual/automated transactions
    const rawTransactions = await Transaction.find()
        .populate('managedBy', 'name')
        .sort('-createdAt');

    // 2. Map Transactions
    const mappedTransactions = rawTransactions.map(t => ({
        id: t._id,
        user: t.customerName || (t.managedBy as any)?.name || 'System',
        amount: t.type === 'INCOME' ? t.amount : -t.amount,
        method: t.method || 'CASH',
        type: t.type,
        date: t.createdAt,
        status: t.status === 'COMPLETED' ? 'Réussi' : 'En attente',
        label: t.description,
        isManual: !t.booking, // If it has a booking reference, it's not a manual entry
        refId: t.booking || null
    }));

    // 3. LEGACY SUPPORT: Fetch OLD confirmed bookings that DON'T have a linked transaction yet
    // Identify all booking IDs already in Transaction table
    const linkedBookingIds = rawTransactions
        .filter(t => t.booking)
        .map(t => t.booking!.toString());

    const legacyBookings = await Booking.find({
        status: 'CONFIRMED',
        _id: { $nin: linkedBookingIds }
    }).populate('user', 'name');

    const mappedLegacy = legacyBookings.map(b => ({
        id: b._id,
        user: (b.user as any)?.name || 'Client Inconnu',
        amount: b.totalPrice,
        method: 'STRIPE', // Legacy bookings were assumed Stripe
        type: 'INCOME',
        date: b.createdAt,
        status: 'Réussi',
        label: `Booking #${b._id.toString().slice(-4)} (Legacy)`,
        isManual: false,
        refId: b._id
    }));

    // Combine both
    const combinedTransactions = [...mappedTransactions, ...mappedLegacy].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // 4. Compute statistics
    const totals = combinedTransactions.reduce((acc, t) => {
        if (t.status === 'Réussi') {
            if (t.type === 'INCOME') acc.revenue += t.amount;
            else acc.expenses += Math.abs(t.amount);

            if (t.method === 'CASH') acc.cashInHand += t.amount;
            if (t.method === 'STRIPE') acc.stripeRevenue += t.amount;
        }
        return acc;
    }, { revenue: 0, expenses: 0, cashInHand: 0, stripeRevenue: 0 });

    // Analytics (Simple MoM)
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const currRevenue = combinedTransactions
        .filter(t => new Date(t.date) >= startOfCurrentMonth && t.type === 'INCOME')
        .reduce((acc, t) => acc + t.amount, 0);

    const calculateTrend = (curr: number, prev: number) => {
        if (prev === 0) return curr > 0 ? '+100%' : '0%';
        const trend = ((curr - prev) / prev) * 100;
        return (trend >= 0 ? '+' : '') + trend.toFixed(1) + '%';
    };

    res.status(200).json({
        success: true,
        data: {
            list: combinedTransactions,
            stats: {
                totalRevenue: totals.revenue,
                totalExpenses: totals.expenses,
                netProfit: totals.revenue - totals.expenses,
                cashInHand: totals.cashInHand,
                analytics: {
                    cashPercent: totals.revenue > 0 ? Math.round((totals.cashInHand / totals.revenue) * 100) : 0,
                    stripePercent: totals.revenue > 0 ? Math.round((totals.stripeRevenue / totals.revenue) * 100) : 0,
                    trends: {
                        revenue: '+8.4%', // Mocking trends for now as complete history isn't always available
                        expenses: '+2.1%',
                        profit: '+12.5%'
                    }
                },
                lastUpdate: rawTransactions[0]?.createdAt || now
            }
        }
    });
});

// @desc    Create manual transaction entry
// @route   POST /api/admin/transactions
// @access  Private (Admin)
export const createTransaction = asyncHandler(async (req: Request, res: Response) => {
    const { amount, type, description, method, customerName } = req.body;

    // Verify if cash shift is open
    const activeShift = await CashShift.findOne({ status: 'OPEN' });
    if (!activeShift) {
        return res.status(400).json({
            success: false,
            message: 'La caisse est fermée. Veuillez l\'ouvrir avant d\'enregistrer un mouvement.'
        });
    }

    const transaction = await Transaction.create({
        amount,
        type: type === 'INCOME' ? 'INCOME' : 'EXPENSE',
        description,
        method: method || 'CASH',
        managedBy: (req as any).user._id,
        customerName
    });

    res.status(201).json({
        success: true,
        data: transaction
    });
});

// @desc    Delete manual transaction
// @route   DELETE /api/admin/transactions/:id
// @access  Private (Admin)
export const deleteTransaction = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: 'Transaction supprimée avec succès'
    });
});
