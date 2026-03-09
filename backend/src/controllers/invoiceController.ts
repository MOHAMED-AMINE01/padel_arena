import { Request, Response } from 'express';
import Invoice from '../models/Invoice';
import { asyncHandler } from '../utils/asyncHandler';

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private (Admin)
export const getInvoices = asyncHandler(async (req: Request, res: Response) => {
    const invoices = await Invoice.find().sort('-createdAt');

    // Stats
    const stats = {
        totalAmount: invoices.reduce((sum, inv) => sum + inv.amount, 0),
        paidAmount: invoices.filter(inv => inv.status === 'PAID').reduce((sum, inv) => sum + inv.amount, 0),
        unpaidAmount: invoices.filter(inv => inv.status === 'UNPAID').reduce((sum, inv) => sum + inv.amount, 0),
        cancelledAmount: invoices.filter(inv => inv.status === 'CANCELLED').reduce((sum, inv) => sum + inv.amount, 0),
    };

    res.status(200).json({
        success: true,
        data: invoices,
        stats
    });
});

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Private (Admin)
export const getInvoice = asyncHandler(async (req: Request, res: Response) => {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
        return res.status(404).json({ success: false, message: 'Facture non trouvée' });
    }
    res.status(200).json({ success: true, data: invoice });
});

// @desc    Create invoice
// @route   POST /api/invoices
// @access  Private (Admin)
export const createInvoice = asyncHandler(async (req: Request, res: Response) => {
    // Generate invoice number if not provided
    if (!req.body.number) {
        const count = await Invoice.countDocuments();
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        req.body.number = `INV-${year}${month}-${(count + 1).toString().padStart(4, '0')}`;
    }

    const invoice = await Invoice.create(req.body);
    res.status(201).json({ success: true, data: invoice });
});

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Private (Admin)
export const updateInvoice = asyncHandler(async (req: Request, res: Response) => {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!invoice) {
        return res.status(404).json({ success: false, message: 'Facture non trouvée' });
    }
    res.status(200).json({ success: true, data: invoice });
});

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private (Admin)
export const deleteInvoice = asyncHandler(async (req: Request, res: Response) => {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
        return res.status(404).json({ success: false, message: 'Facture non trouvée' });
    }
    res.status(200).json({ success: true, message: 'Facture supprimée avec succès' });
});
