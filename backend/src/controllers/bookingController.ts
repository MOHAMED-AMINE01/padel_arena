import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Court from '../models/Court';
import Transaction from '../models/Transaction';
import User from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';
import { validateAndApplyPromoCode, incrementPromoCodeUsage } from '../services/promoCodeService';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public (Optional Authentication)
export const createBooking = asyncHandler(async (req: any, res: Response) => {
    const { courtId, startTime, endTime, userId, promoCode, guestName, guestEmail, guestPhone, players } = req.body;

    // 1. Basic validation
    if (!courtId || !startTime || !endTime) {
        return res.status(400).json({ message: 'Please provide courtId, startTime and endTime' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
        return res.status(400).json({ message: 'Start time must be before end time' });
    }

    // 2. Check if court exists and is active
    const court = await Court.findById(courtId);
    if (!court || !court.isActive) {
        return res.status(404).json({ message: 'Court not found or inactive' });
    }

    // 3. CHECK FOR CONFLICTS (The core of the engine)
    const conflict = await Booking.findOne({
        court: courtId,
        status: { $in: ['PENDING', 'CONFIRMED'] },
        $or: [
            { startTime: { $lt: end }, endTime: { $gt: start } } // Overlap logic
        ]
    });

    if (conflict) {
        return res.status(400).json({
            success: false,
            message: 'This slot is already booked. Please choose another time.'
        });
    }

    // 4. Calculate total price
    const durationInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    let totalPrice = Number((durationInHours * court.pricePerHour).toFixed(2));
    let discountAmount = 0;
    let promoCodeId = null;

    // 5. Determine user (Admin can specify userId, or we look up by email for guests)
    let finalUserId = req.user?.id;

    if (userId && req.user?.role === 'ADMIN') {
        finalUserId = userId;
    } else if (!finalUserId && guestEmail) {
        // Silent Linking: check if email exists in User database
        const existingUser = await User.findOne({ email: guestEmail.toLowerCase() });
        if (existingUser) {
            finalUserId = existingUser._id;
        }
    }

    // 6. Handle Promo Code if provided
    if (promoCode && finalUserId) {
        const promoResult = await validateAndApplyPromoCode(
            promoCode,
            totalPrice,
            'booking',
            finalUserId
        );

        if (promoResult.isValid) {
            discountAmount = promoResult.discountAmount;
            totalPrice = Math.max(0, totalPrice - discountAmount);
            promoCodeId = promoResult.promoCodeId;
        } else {
            return res.status(400).json({ success: false, message: promoResult.message });
        }
    }

    // 7. Create the booking
    const bookingData: any = {
        court: courtId,
        startTime: start,
        endTime: end,
        totalPrice,
        discountAmount,
        players: players || 4,
        promoCode: promoCode?.toUpperCase(),
        status: 'PENDING',
        paymentStatus: 'UNPAID'
    };

    if (finalUserId) {
        bookingData.user = finalUserId;
    } else {
        bookingData.guestName = guestName;
        bookingData.guestEmail = guestEmail?.toLowerCase();
        bookingData.guestPhone = guestPhone;
    }

    const booking = await Booking.create(bookingData);

    // 8. Increment promo code usage if applicable
    if (promoCodeId && finalUserId) {
        await incrementPromoCodeUsage(promoCodeId, finalUserId);
    }

    const populated = await Booking.findById(booking._id)
        .populate('user', 'name email')
        .populate('court', 'name');

    res.status(201).json({
        success: true,
        data: populated
    });
});

// @desc    Get my bookings
// @route   GET /api/bookings/me
// @access  Private
export const getMyBookings = asyncHandler(async (req: any, res: Response) => {
    const bookings = await Booking.find({ user: req.user.id })
        .populate('court', 'name type surface pricePerHour')
        .sort('-startTime');

    res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
    });
});

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private (Admin)
export const getAllBookings = asyncHandler(async (req: any, res: Response) => {
    const bookings = await Booking.find()
        .populate('user', 'name email')
        .populate('court', 'name')
        .sort('-startTime');

    res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
    });
});

// @desc    Update booking status (Admin)
// @route   PUT /api/bookings/:id
// @access  Private (Admin)
export const updateBooking = asyncHandler(async (req: any, res: Response) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
    }

    if (req.user.role !== 'ADMIN') {
        return res.status(401).json({ message: 'Not authorized' });
    }

    const { status, paymentStatus, paymentMethod } = req.body;
    if (status) {
        booking.status = status;
    }

    if (paymentStatus) {
        booking.paymentStatus = paymentStatus;
    }

    // Automated Finance Link: Create transaction if confirmed and paid
    if ((booking.status === 'CONFIRMED' || booking.status === 'COMPLETED') && booking.paymentStatus === 'PAID') {
        // Check if transaction already exists for this booking
        const existingTx = await Transaction.findOne({ booking: booking._id });
        if (!existingTx) {
            const customer = booking.user ? await User.findById(booking.user) : null;
            await Transaction.create({
                type: 'INCOME',
                amount: booking.totalPrice,
                description: `Réservation Terrain #${booking._id.toString().slice(-4)}`,
                method: paymentMethod || 'CASH',
                managedBy: req.user._id,
                customerName: customer ? customer.name : (booking.guestName || 'Client Inconnu'),
                category: 'Réservation',
                booking: booking._id,
                status: 'COMPLETED'
            });
        }
    }

    await booking.save();

    const updated = await Booking.findById(booking._id)
        .populate('user', 'name email')
        .populate('court', 'name');

    res.status(200).json({
        success: true,
        data: updated
    });
});

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
export const cancelBooking = asyncHandler(async (req: any, res: Response) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
    }

    // Check ownership (only the user who booked or an admin can cancel)
    if (booking.user?.toString() !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(401).json({ message: 'Not authorized to cancel this booking' });
    }

    // If Admin, delete permanently if requested (or by default in this context)
    if (req.user.role === 'ADMIN') {
        await booking.deleteOne();
        return res.status(200).json({
            success: true,
            message: 'Booking deleted permanently'
        });
    }

    // Check if it's too late to cancel (e.g., 24h before)
    const now = new Date();
    const hoursUntilStart = (booking.startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilStart < 24) {
        return res.status(400).json({ message: 'Cancellation is only allowed up to 24h before' });
    }

    booking.status = 'CANCELLED';
    await booking.save();

    res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully'
    });
});

// @desc    Get available slots
// @route   GET /api/bookings/available-slots
// @access  Public
export const getAvailableSlots = asyncHandler(async (req: Request, res: Response) => {
    const { sport, date } = req.query;

    if (!sport || !date) {
        return res.status(400).json({ message: 'Please provide sport and date (YYYY-MM-DD)' });
    }

    const searchDate = new Date(date as string);
    const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

    // 1. Find all courts for this sport
    const courts = await Court.find({ sport: sport as string, isActive: true });

    if (courts.length === 0) {
        return res.status(200).json({ success: true, data: [] });
    }

    // 2. For each court, calculate availability
    const results = await Promise.all(courts.map(async (court) => {
        // Get all bookings for this court today
        const bookings = await Booking.find({
            court: court._id,
            status: { $in: ['PENDING', 'CONFIRMED'] },
            startTime: { $gte: startOfDay, $lte: endOfDay }
        }).sort('startTime');

        // Define operating hours (e.g., 08:00 to 23:00)
        const slots = [];
        const slotDuration = 90; // minutes
        const opStart = 8;
        const opEnd = 22; // Last slot starts at 22:00

        for (let hour = opStart; hour <= opEnd; hour++) {
            // Minutes 0 or 30
            for (let min of [0, 30]) {
                if (hour === opEnd && min > 0) break; // Don't start a slot at 22:30

                const slotStart = new Date(startOfDay);
                slotStart.setHours(hour, min, 0, 0);

                const slotEnd = new Date(slotStart);
                slotEnd.setMinutes(slotStart.getMinutes() + slotDuration);

                // Check for conflict
                const isBooked = bookings.some(b => {
                    const bStart = new Date(b.startTime);
                    const bEnd = new Date(b.endTime);
                    return (slotStart < bEnd && slotEnd > bStart);
                });

                slots.push({
                    time: `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`,
                    available: !isBooked,
                    price: court.pricePerHour * (slotDuration / 60)
                });
            }
        }

        return {
            courtId: court._id,
            courtName: court.name,
            type: court.type,
            slots
        };
    }));

    res.status(200).json({
        success: true,
        data: results
    });
});
