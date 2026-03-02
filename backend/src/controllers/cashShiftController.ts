import { Request, Response } from 'express';
import CashShift from '../models/CashShift';
import Transaction from '../models/Transaction';
import { asyncHandler } from '../utils/asyncHandler';

// @desc    Get current active cash shift
// @route   GET /api/admin/cash-shift/current
export const getCurrentShift = asyncHandler(async (req: Request, res: Response) => {
    const shift = await CashShift.findOne({ status: 'OPEN' })
        .populate('openedBy', 'name');

    res.status(200).json({
        success: true,
        data: shift
    });
});

// @desc    Open a new cash shift
// @route   POST /api/admin/cash-shift/open
export const openShift = asyncHandler(async (req: Request, res: Response) => {
    const { startingCash, notes } = req.body;

    const activeShift = await CashShift.findOne({ status: 'OPEN' });
    if (activeShift) {
        return res.status(400).json({ success: false, message: 'Une caisse est déjà ouverte.' });
    }

    let finalStartingCash = startingCash;

    if (finalStartingCash === undefined || finalStartingCash === null) {
        const lastClosedShift = await CashShift.findOne({ status: 'CLOSED' }).sort('-endTime');
        finalStartingCash = lastClosedShift ? lastClosedShift.endingCash : 0;
    }

    const shift = await CashShift.create({
        openedBy: (req as any).user._id,
        startingCash: finalStartingCash || 0,
        notes,
        status: 'OPEN'
    });

    res.status(201).json({
        success: true,
        data: shift
    });
});

// @desc    Close the current cash shift
// @route   POST /api/admin/cash-shift/close
export const closeShift = asyncHandler(async (req: Request, res: Response) => {
    const { endingCash, notes } = req.body;

    const shift = await CashShift.findOne({ status: 'OPEN' });
    if (!shift) {
        return res.status(400).json({ success: false, message: 'Aucune caisse ouverte à clôturer.' });
    }

    // Calculate movements for ALL payment methods during shift
    const transactions = await Transaction.find({
        createdAt: { $gte: shift.startTime },
        status: 'COMPLETED'
    });

    const cashMovement = transactions.filter(t => t.method === 'CASH').reduce((acc, t) => {
        return acc + (t.type === 'INCOME' ? t.amount : -t.amount);
    }, 0);

    const stripeRevenue = transactions.filter(t => t.method === 'STRIPE').reduce((acc, t) => {
        return acc + (t.type === 'INCOME' ? t.amount : 0);
    }, 0);

    const otherRevenue = transactions.filter(t => t.method === 'CARD' || t.method === 'TRANSFER').reduce((acc, t) => {
        return acc + (t.type === 'INCOME' ? t.amount : 0);
    }, 0);

    const expectedEndingCash = shift.startingCash + cashMovement;
    const finalEndingCash = (endingCash === undefined || endingCash === null) ? expectedEndingCash : endingCash;

    shift.status = 'CLOSED';
    shift.closedBy = (req as any).user._id;
    shift.endTime = new Date();
    shift.endingCash = finalEndingCash;
    shift.expectedEndingCash = expectedEndingCash;
    shift.stripeRevenue = stripeRevenue;
    shift.totalRevenue = (cashMovement > 0 ? cashMovement : 0) + stripeRevenue + otherRevenue;
    shift.notes = notes || shift.notes;

    await shift.save();

    res.status(200).json({
        success: true,
        data: shift,
        summary: {
            startingCash: shift.startingCash,
            netMovement: cashMovement,
            stripeRevenue: stripeRevenue,
            otherRevenue: otherRevenue,
            totalRevenue: (cashMovement > 0 ? cashMovement : 0) + stripeRevenue + otherRevenue,
            expected: expectedEndingCash,
            actual: finalEndingCash,
            difference: finalEndingCash - expectedEndingCash
        }
    });
});

// @desc    Get shift history
// @route   GET /api/admin/cash-shift/history
export const getShiftHistory = asyncHandler(async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;
    let query: any = {};

    if (startDate || endDate) {
        query.startTime = {};
        if (startDate) query.startTime.$gte = new Date(startDate as string);
        if (endDate) query.startTime.$lte = new Date(endDate as string);
    }

    const shifts = await CashShift.find(query)
        .populate('openedBy', 'name')
        .populate('closedBy', 'name')
        .sort('-startTime')
        .limit(50);

    res.status(200).json({
        success: true,
        data: shifts
    });
});

// @desc    Delete a cash shift record
// @route   DELETE /api/admin/cash-shift/:id
export const deleteShift = asyncHandler(async (req: Request, res: Response) => {
    const shift = await CashShift.findById(req.params.id);

    if (!shift) {
        return res.status(404).json({ success: false, message: 'Shift introuvable.' });
    }

    if (shift.status === 'OPEN') {
        return res.status(400).json({ success: false, message: 'Impossible de supprimer un shift ouvert.' });
    }

    await shift.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Shift supprimé avec succès.'
    });
});
