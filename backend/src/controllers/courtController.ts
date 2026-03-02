import { Request, Response } from 'express';
import Court from '../models/Court';
import { asyncHandler } from '../utils/asyncHandler';

// @desc    Get all courts
// @route   GET /api/courts
// @access  Public
export const getCourts = asyncHandler(async (req: Request, res: Response) => {
    let query;
    // Show all courts if 'all' is passed in query, otherwise show only active ones
    if (req.query.all === 'true') {
        query = {};
    } else {
        query = { isActive: true };
    }
    const courts = await Court.find(query);
    res.status(200).json({ success: true, count: courts.length, data: courts });
});

// @desc    Get single court
// @route   GET /api/courts/:id
// @access  Public
export const getCourt = asyncHandler(async (req: Request, res: Response) => {
    const court = await Court.findById(req.params.id);
    if (!court) {
        return res.status(404).json({ message: 'Court not found' });
    }
    res.status(200).json({ success: true, data: court });
});

// @desc    Create new court
// @route   POST /api/courts
// @access  Private (Admin)
export const createCourt = asyncHandler(async (req: any, res: Response) => {
    // Add user to req.body
    req.body.clubManager = req.user.id;

    const court = await Court.create(req.body);
    res.status(201).json({ success: true, data: court });
});

// @desc    Update court
// @route   PUT /api/courts/:id
// @access  Private (Admin)
export const updateCourt = asyncHandler(async (req: any, res: Response) => {
    let court = await Court.findById(req.params.id);

    if (!court) {
        return res.status(404).json({ message: 'Court not found' });
    }

    // Only Admin can update
    if (req.user.role !== 'ADMIN') {
        return res.status(401).json({ message: 'User not authorized' });
    }

    court = await Court.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: court });
});

// @desc    Delete court
// @route   DELETE /api/courts/:id
// @access  Private (Admin)
export const deleteCourt = asyncHandler(async (req: any, res: Response) => {
    const court = await Court.findById(req.params.id);

    if (!court) {
        return res.status(404).json({ message: 'Court not found' });
    }

    // Only Admin can delete
    if (req.user.role !== 'ADMIN') {
        return res.status(401).json({ message: 'User not authorized' });
    }

    await court.deleteOne();

    res.status(200).json({ success: true, data: {} });
});
