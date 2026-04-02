import { Request, Response } from 'express';
import Course from '../models/Course';
import { asyncHandler } from '../utils/asyncHandler';
import { validateAndApplyPromoCode, incrementPromoCodeUsage } from '../services/promoCodeService';
import Booking from '../models/Booking';
import Court from '../models/Court';
import Stripe from 'stripe';
import { refundPayment } from './paymentController';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = asyncHandler(async (req: Request, res: Response) => {
    const courses = await Course.find().sort('date');
    res.status(200).json({ success: true, count: courses.length, data: courses });
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
export const getCourse = asyncHandler(async (req: Request, res: Response) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        return res.status(404).json({ message: 'Cours introuvable' });
    }
    res.status(200).json({ success: true, data: course });
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Admin)
export const createCourse = asyncHandler(async (req: Request, res: Response) => {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Admin)
export const updateCourse = asyncHandler(async (req: Request, res: Response) => {
    let course = await Course.findById(req.params.id);

    if (!course) {
        return res.status(404).json({ message: 'Cours introuvable' });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: course });
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Admin)
export const deleteCourse = asyncHandler(async (req: Request, res: Response) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        return res.status(404).json({ message: 'Cours introuvable' });
    }

    await course.deleteOne();

    res.status(200).json({ success: true, data: {} });
});

// @desc    Join course
// @route   POST /api/courses/:id/join
// @access  Private (Player)
export const joinCourse = asyncHandler(async (req: any, res: Response) => {
    const { promoCode } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
        return res.status(404).json({ message: 'Cours introuvable' });
    }

    if (course.status !== 'UPCOMING') {
        return res.status(400).json({ message: 'Les inscriptions sont closes pour ce cours.' });
    }

    if (course.currentParticipants >= course.maxParticipants) {
        return res.status(400).json({ message: 'Ce cours est complet.' });
    }

    // Check if user is already registered
    const isRegistered = course.participants.includes(req.user.id);
    if (isRegistered) {
        return res.status(400).json({ message: 'Vous êtes déjà inscrit à ce cours.' });
    }

    let discountAmount = 0;
    let finalPrice = course.price;
    let promoCodeId = null;

    if (promoCode) {
        const promoResult = await validateAndApplyPromoCode(
            promoCode,
            course.price,
            'course',
            req.user.id
        );

        if (promoResult.isValid) {
            promoCodeId = promoResult.promoCodeId;
            discountAmount = promoResult.discountAmount;
            finalPrice = Math.max(0, course.price - discountAmount);
        } else {
            return res.status(400).json({ success: false, message: promoResult.message });
        }
    }

    // --- STRIPE INTEGRATION ---
    if (finalPrice > 0) {
        // Find or create virtual court for Events
        let eventCourt = await Court.findOne({ name: 'ÉVÉNEMENTS & ACADÉMIE' });
        if (!eventCourt) {
            const someCourt = await Court.findOne();
            eventCourt = await Court.create({
                name: 'ÉVÉNEMENTS & ACADÉMIE',
                type: 'INDOOR',
                surface: 'PRO_TURF',
                sport: 'Padel',
                offPeakPrice: 0,
                peakPrice: 0,
                isActive: false,
                clubManager: someCourt?.clubManager || '65f1a2b3c4d5e6f7a8b9c0d1'
            });
        }

        // Create a PENDING booking tracking the registration
        const booking = await Booking.create({
            user: req.user.id,
            court: eventCourt._id,
            startTime: course.date,
            endTime: new Date(new Date(course.date).getTime() + (course.duration || 60) * 60000),
            totalPrice: finalPrice,
            discountAmount,
            promoCode: promoCode?.toUpperCase(),
            bookingType: 'COURSE',
            course: course._id,
            status: 'PENDING',
            paymentStatus: 'UNPAID'
        });

        // Create Stripe Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: `Inscription Académie : ${course.title}`,
                        description: `Date: ${new Date(course.date).toLocaleDateString('fr-FR')}`,
                    },
                    unit_amount: Math.round(finalPrice * 100),
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/succes?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/tournois`,
            customer_email: req.user.email,
            metadata: {
                bookingId: booking._id.toString(),
                type: 'COURSE_REGISTRATION'
            }
        });

        if (promoCodeId) {
            await incrementPromoCodeUsage(promoCodeId, req.user.id);
        }

        return res.status(200).json({
            success: true,
            requiresPayment: true,
            url: session.url
        });
    }

    // If free or already handled by meta logic (but here it's for 0 price)
    course.participants.push(req.user.id);
    course.currentParticipants += 1;
    await course.save();

    if (promoCodeId) {
        await incrementPromoCodeUsage(promoCodeId, req.user.id);
    }

    res.status(200).json({
        success: true,
        message: 'Inscription réussie ! Rendez-vous sur le terrain.',
        data: course
    });
});

// @desc    Leave course
// @route   POST /api/courses/:id/leave
// @access  Private (Player)
export const leaveCourse = asyncHandler(async (req: any, res: Response) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        return res.status(404).json({ message: 'Cours introuvable' });
    }

    // Check if user is registered
    const participantIndex = course.participants.indexOf(req.user.id);
    if (participantIndex === -1) {
        return res.status(400).json({ message: 'Vous n\'êtes pas inscrit à ce cours.' });
    }

    // Check if there's a paid booking and handle refund
    const booking = await Booking.findOne({ 
        user: req.user.id, 
        course: course._id, 
        status: 'CONFIRMED' 
    });

    let refundStatus = "";
    if (booking && booking.paymentStatus === 'PAID' && booking.stripePaymentIntentId) {
        // Simple policy: Refund if course is in the future
        const now = new Date();
        if (new Date(course.date) > now) {
            const refundResult = await refundPayment(booking.stripePaymentIntentId);
            if (refundResult.success) {
                booking.status = 'CANCELLED';
                booking.paymentStatus = 'REFUNDED';
                await booking.save();
                refundStatus = " Un remboursement a été traité.";
            } else {
                console.error(`❌ Refund failed for course ${course._id}: ${refundResult.error}`);
            }
        }
    } else if (booking) {
        // Just cancel if not paid or other
        booking.status = 'CANCELLED';
        await booking.save();
    }

    course.participants.splice(participantIndex, 1);
    course.currentParticipants = Math.max(0, course.currentParticipants - 1);

    await course.save();

    res.status(200).json({
        success: true,
        message: `Désinscription réussie.${refundStatus}`,
        data: course
    });
});
