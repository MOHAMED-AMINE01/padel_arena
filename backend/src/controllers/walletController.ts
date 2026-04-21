import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User';
import Transaction from '../models/Transaction';
import mongoose from 'mongoose';

// @desc    Get current user balance and history
// @route   GET /api/wallet/me
export const getMyWallet = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById((req as any).user._id);
    if (!user) {
        res.status(404);
        throw new Error('Utilisateur non trouvé');
    }

    // Fetch transactions where managedBy is the user
    const history = await Transaction.find({ managedBy: user._id })
        .sort({ createdAt: -1 })
        .limit(20);

    res.status(200).json({
        success: true,
        balance: user.balance || 0,
        history
    });
});

// @desc    (Admin) Update user balance manually
// @route   PUT /api/wallet/update/:userId
export const updateBalanceManual = asyncHandler(async (req: Request, res: Response) => {
    const { amount, description, type } = req.body; // type: 'INCOME' or 'EXPENSE'
    const targetUser = await User.findById(req.params.userId);

    if (!targetUser) {
        res.status(404);
        throw new Error('Utilisateur non trouvé');
    }

    const changeAmount = parseFloat(amount);
    if (type === 'INCOME') {
        targetUser.balance = (targetUser.balance || 0) + changeAmount;
    } else {
        targetUser.balance = (targetUser.balance || 0) - changeAmount;
    }

    await targetUser.save();

    // Log transaction
    await Transaction.create({
        type,
        amount: changeAmount,
        description: description || `Ajustement manuel par Admin`,
        method: 'CASH',
        status: 'COMPLETED',
        customerName: targetUser.name,
        managedBy: targetUser._id,
        category: 'Wallet'
    });

    res.status(200).json({
        success: true,
        newBalance: targetUser.balance
    });
});
