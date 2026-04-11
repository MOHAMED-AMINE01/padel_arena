import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Court from '../models/Court';
import Transaction from '../models/Transaction';
import User from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';
import { validateAndApplyPromoCode, incrementPromoCodeUsage } from '../services/promoCodeService';
import { sendEmail, getEmailTemplate } from '../services/mailService';
import { refundPayment } from './paymentController';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public (Optional Authentication)
export const createBooking = asyncHandler(async (req: any, res: Response) => {
    const {
        courtId,
        startTime,
        endTime,
        userId,
        promoCode,
        guestName,
        guestEmail,
        guestPhone,
        players,
        bookingType,
        packName,
        timeStr,
        dateStr
    } = req.body;

    // 1. Basic validation
    if (bookingType !== 'PACK' && bookingType !== 'SUBSCRIPTION' && (!courtId || !startTime || !endTime)) {
        return res.status(400).json({ message: 'Please provide courtId, startTime and endTime' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    let court = null;
    let totalPrice = 0;
    let discountAmount = 0;
    let promoCodeId = null;

    // ✅ FORCE RECONSTRUCTION: Ensure we always have timeStr and dateStr
    let calibratedStart = start;
    let calibratedEnd = end;

    let finalTimeStr = timeStr;
    let finalDateStr = dateStr;

    if (!finalTimeStr || !finalDateStr) {
        // If missing, derive from startTime but treat it AS UTC to maintain our "Literal UTC" standard
        const hours = start.getUTCHours();
        const mins = start.getUTCMinutes();
        const d = start.getUTCDate();
        const m = start.getUTCMonth() + 1;
        const y = start.getUTCFullYear();

        if (!finalTimeStr) finalTimeStr = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
        if (!finalDateStr) finalDateStr = `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;

        // Re-calibrate to ensure Date object is exactly UTC at that time
        calibratedStart = new Date(Date.UTC(y, m - 1, d, hours, mins));
    } else {
        const [day, month, year] = finalDateStr.split('/').map(Number);
        const [hour, min] = finalTimeStr.split(':').map(Number);
        calibratedStart = new Date(Date.UTC(year, month - 1, day, hour, min));
    }

    const durationMs = end.getTime() - start.getTime();
    calibratedEnd = new Date(calibratedStart.getTime() + durationMs);

    if (bookingType !== 'PACK' && bookingType !== 'SUBSCRIPTION') {
        if (start >= end) {
            return res.status(400).json({ message: 'Start time must be before end time' });
        }

        // 2. Check if court exists and is active
        court = await Court.findById(courtId);
        if (!court || !court.isActive) {
            return res.status(404).json({ message: 'Court not found or inactive' });
        }

        // 3. CHECK FOR CONFLICTS (The core of the engine)
        const conflict = await Booking.findOne({
            court: courtId,
            status: { $in: ['PENDING', 'CONFIRMED'] },
            $or: [
                { startTime: { $lt: calibratedEnd }, endTime: { $gt: calibratedStart } } // Overlap logic
            ]
        });

        if (conflict) {
            return res.status(400).json({
                success: false,
                message: 'This slot is already booked. Please choose another time.'
            });
        }

        // "calibratedStart" is now explicitly stored as pseudo-UTC matching local time
        const localHour = calibratedStart.getUTCHours();

        const isPeak = localHour >= 17 || calibratedStart.getUTCDay() === 0 || calibratedStart.getUTCDay() === 6;
        const unitPrice = isPeak ? court.peakPrice : court.offPeakPrice;
        const durationInHours = (calibratedEnd.getTime() - calibratedStart.getTime()) / (1000 * 60 * 60);
        totalPrice = Number((durationInHours * unitPrice).toFixed(2));

        // 5. Link user ...
    }

    // 5. Determine user (Admin can specify userId, or we look up by email for guests)
    let finalUserId = req.user?.id;

    if (userId && req.user?.role === 'ADMIN') {
        finalUserId = userId;
    } else if (!finalUserId && guestEmail) {
        // Silent Linking: check if email exists in User database
        const existingUser = await User.findOne({ email: guestEmail.toLowerCase() });
        if (existingUser) {
            finalUserId = existingUser._id.toString();
        }
    }

    // 6. Handle Promo Code if provided
    if (promoCode && finalUserId && bookingType !== 'PACK') {
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
    console.log('📝 BOOKING CREATE DEBUG ━━━━━━━━━━━━━━━━━━━');
    console.log('timeStr from frontend:', timeStr);
    console.log('dateStr from frontend:', dateStr);
    console.log('calibratedStart UTC:', calibratedStart.toISOString());
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    let bookingData: any = {
        startTime: calibratedStart,
        endTime: calibratedEnd,
        totalPrice,
        discountAmount,
        players: players || 4,
        promoCode: promoCode?.toUpperCase(),
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        bookingType: bookingType || 'COURT',
        packName,
        timeStr: finalTimeStr,
        dateStr: finalDateStr
    };

    if (bookingType === 'PACK' || bookingType === 'SUBSCRIPTION') {
        // Special case for packs/subs: Find or create a virtual court if needed for population integrity
        let packCourt = await Court.findOne({ name: 'RESERVE PACKS' });
        if (!packCourt) {
            // Find an existing court to steal its clubManager if possible (all courts should have one)
            const someCourt = await Court.findOne();
            const managerId = someCourt ? someCourt.clubManager : '65f1a2b3c4d5e6f7a8b9c0d1'; // Fallback to an ObjectId if empty

            packCourt = await Court.create({
                name: 'RESERVE PACKS',
                type: 'INDOOR',
                surface: 'PRO_TURF',
                sport: 'Padel',
                pricePerHour: 0,
                isActive: false, // Don't show in public list
                clubManager: managerId
            });
        }
        bookingData.court = packCourt._id;
        bookingData.totalPrice = req.body.totalPrice || 0;
    } else {
        bookingData.court = courtId;
    }

    if (bookingType === 'PACK' || bookingType === 'SUBSCRIPTION') {
        // For special requests, always store the guest info from the form
        bookingData.guestName = guestName;
        bookingData.guestEmail = guestEmail?.toLowerCase();
        bookingData.guestPhone = guestPhone;
        // Optionally link to user account if email matches
        if (guestEmail) {
            const existingUser = await User.findOne({ email: guestEmail.toLowerCase() });
            if (existingUser) {
                bookingData.user = existingUser._id;
            }
        }
    } else if (finalUserId) {
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
        .populate('court', 'name')
        .sort('-startTime');

    // SAFE BACKFILL: Ensure every booking has timeStr/dateStr for "String-Only" frontend
    const sanitizedBookings = bookings.map(b => {
        const obj = b.toObject();
        if (!obj.timeStr || !obj.dateStr) {
            const d = new Date(obj.startTime);
            if (!obj.timeStr) obj.timeStr = `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
            if (!obj.dateStr) obj.dateStr = `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`;
        }
        return obj;
    });

    res.status(200).json({
        success: true,
        count: sanitizedBookings.length,
        data: sanitizedBookings
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

    // SAFE BACKFILL: Ensure every booking has timeStr/dateStr for "String-Only" frontend
    const sanitizedBookings = bookings.map(b => {
        const obj = b.toObject();
        if (!obj.timeStr || !obj.dateStr) {
            const d = new Date(obj.startTime);
            if (!obj.timeStr) obj.timeStr = `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
            if (!obj.dateStr) obj.dateStr = `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`;
        }
        return obj;
    });

    res.status(200).json({
        success: true,
        count: sanitizedBookings.length,
        data: sanitizedBookings
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
    const booking = await Booking.findById(req.params.id).populate('user');

    if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
    }

    // Check ownership
    const bookingUserId = (booking.user as any)?._id?.toString() || booking.user?.toString();
    console.log(`[Cancel] Booking User: ${bookingUserId}, Request User: ${req.user.id}, Role: ${req.user.role}`);

    // NEW RULE: Players cannot cancel by themselves anymore (as requested)
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
            success: false,
            message: "Les annulations ne peuvent être effectuées que par l'administration du club. Merci de nous contacter pour toute modification."
        });
    }

    const now = new Date();
    const hoursUntilStart = (new Date(booking.startTime).getTime() - now.getTime()) / (1000 * 60 * 60);
    const canRefund = hoursUntilStart >= 24;

    // If Admin, delete permanently if requested
    if (req.user.role === 'ADMIN') {
        const hasRefunded = (booking.paymentStatus === 'PAID' && booking.stripePaymentIntentId && canRefund);
        
        // Refund ONLY if paid via Stripe AND it's a future booking (> 24h)
        if (hasRefunded) {
            console.log(`🔄 Admin: Initiating refund for booking ${booking._id} (Lead time: ${hoursUntilStart.toFixed(1)}h)`);
            await refundPayment(booking.stripePaymentIntentId as string);
        }

        // Drop the revenue from global stats if it's a future booking being cancelled
        if (canRefund) {
            await Transaction.updateMany({ booking: booking._id }, { status: 'REFUNDED' });
        }

        // Send Email to Client before deleting
        try {
            const clientEmail = (booking.user as any)?.email || booking.guestEmail;
            const clientName = (booking.user as any)?.name || booking.guestName || 'Client';
            if (clientEmail) {
                await sendEmail({
                    to: clientEmail,
                    subject: '❌ Réservation Annulée - Padel Arena',
                    text: `Bonjour ${clientName}, votre réservation a été annulée par l'administration.`,
                    html: getEmailTemplate(
                        "Réservation Annulée",
                        `Bonjour ${clientName},\n\n` +
                        `Nous vous informons que votre réservation a été annulée par l'administration.\n` +
                        `${hasRefunded ? "Un remboursement a été déclenché sur votre compte." : ""}\n\n` +
                        `À bientôt sur les pistes !`
                    )
                });
            }
        } catch (e) {
            console.error('Error sending cancellation email (Admin):', e);
        }

        await booking.deleteOne();
        return res.status(200).json({
            success: true,
            message: `Réservation supprimée ${hasRefunded ? 'et remboursée' : ''}`
        });
    }

    // BLOCK: Normal users or fallback cases cannot cancel past bookings
    if (new Date(booking.startTime).getTime() < now.getTime()) {
        return res.status(400).json({ 
            success: false,
            message: "Vous ne pouvez pas annuler une séance déjà passée." 
        });
    }

    // Check if it's too late to cancel (e.g., 24h before)

    if (hoursUntilStart < 24) {
        return res.status(400).json({ message: 'Cancellation is only allowed up to 24h before' });
    }

    // Handle Stripe Refund if paid online
    if (booking.paymentStatus === 'PAID' && booking.stripePaymentIntentId) {
        console.log(`🔄 Initiating refund for booking ${booking._id}`);
        const refundResult = await refundPayment(booking.stripePaymentIntentId as string);

        if (refundResult.success) {
            booking.paymentStatus = 'REFUNDED';
        } else {
            console.error(`❌ Refund failed: ${refundResult.error}`);
            // Optionally, we could still allow cancellation but mark for manual refund or error
        }
    }

    booking.status = 'CANCELLED';
    await booking.save();

    // Void the finance transaction so it doesn't count as revenue
    await Transaction.updateMany({ booking: booking._id }, { status: 'REFUNDED' });

    // Send Email to Client
    try {
        const clientEmail = (booking.user as any)?.email || booking.guestEmail;
        const clientName = (booking.user as any)?.name || booking.guestName || 'Client';

        if (clientEmail) {
            await sendEmail({
                to: clientEmail,
                subject: '❌ Confirmation d\'Annulation - Padel Arena',
                text: `Bonjour ${clientName}, votre réservation a été annulée avec succès.`,
                html: getEmailTemplate(
                    "Annulation Confirmée",
                    `Bonjour ${clientName},\n\n` +
                    `Votre réservation a été annulée comme demandé.\n` +
                    `${booking.paymentStatus === 'REFUNDED' ? "Votre remboursement a été traité avec succès." : ""}\n\n` +
                    `À bientôt sur les pistes !`
                )
            });
        }
    } catch (e) {
        console.error('Error sending cancellation email:', e);
    }

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
    // Use UTC for all calculations to match MongoDB storage
    const startOfDay = new Date(Date.UTC(searchDate.getUTCFullYear(), searchDate.getUTCMonth(), searchDate.getUTCDate(), 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(searchDate.getUTCFullYear(), searchDate.getUTCMonth(), searchDate.getUTCDate(), 23, 59, 59, 999));

    // 1. Find all courts for this sport
    const courts = await Court.find({ sport: sport as string, isActive: true });

    if (courts.length === 0) {
        return res.status(200).json({ success: true, data: [] });
    }

    // 2. For each court, calculate availability
    const dObj = new Date(date as string);
    const results = await Promise.all(courts.map(async (court) => {
        // Get all bookings for this court today
        const bookings = await Booking.find({
            court: court._id,
            status: { $in: ['PENDING', 'CONFIRMED'] },
            startTime: { $gte: startOfDay, $lte: endOfDay }
        }).sort('startTime');

        // Define operating hours (e.g., 08:00 to 22:00)
        const slots = [];
        const slotDuration = 30; // minutes (check every 30-min block)
        const opStart = 8;
        const opEnd = 22; // Last slot starts at 22:00

        for (let hour = opStart; hour <= opEnd; hour++) {
            // Minutes 0 or 30
            for (let min of [0, 30]) {
                // pseudo-UTC matching local time
                const localStart = new Date(Date.UTC(dObj.getUTCFullYear(), dObj.getUTCMonth(), dObj.getUTCDate(), hour, min));

                const slotEnd = new Date(localStart);
                slotEnd.setUTCMinutes(localStart.getUTCMinutes() + slotDuration);

                // Check for conflict
                const isBooked = bookings.some(b => {
                    const bStart = new Date(b.startTime);
                    const bEnd = new Date(b.endTime);
                    return (localStart < bEnd && slotEnd > bStart);
                });

                const isPeak = hour >= 17 || localStart.getUTCDay() === 0 || localStart.getUTCDay() === 6;
                const unitPrice = isPeak ? court.peakPrice : court.offPeakPrice;

                slots.push({
                    time: `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`,
                    available: !isBooked,
                    price: unitPrice // Price per hour (standard unit)
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
