import { Request, Response } from 'express';
import Tournament from '../models/Tournament';
import { asyncHandler } from '../utils/asyncHandler';
import { validateAndApplyPromoCode, incrementPromoCodeUsage } from '../services/promoCodeService';
import Booking from '../models/Booking';
import Court from '../models/Court';
import Stripe from 'stripe';
import { refundPayment } from './paymentController';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// @desc    Get all tournaments
// @route   GET /api/tournaments
// @access  Public
export const getTournaments = asyncHandler(async (req: Request, res: Response) => {
    const tournaments = await Tournament.find().sort('startDate');
    res.status(200).json({ success: true, count: tournaments.length, data: tournaments });
});

// @desc    Get single tournament
// @route   GET /api/tournaments/:id
// @access  Public
export const getTournament = asyncHandler(async (req: Request, res: Response) => {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
        return res.status(404).json({ message: 'Tournoi introuvable' });
    }
    res.status(200).json({ success: true, data: tournament });
});

// @desc    Create new tournament
// @route   POST /api/tournaments
// @access  Private (Admin)
export const createTournament = asyncHandler(async (req: Request, res: Response) => {
    const tournament = await Tournament.create(req.body);
    res.status(201).json({ success: true, data: tournament });
});

// @desc    Update tournament
// @route   PUT /api/tournaments/:id
// @access  Private (Admin)
export const updateTournament = asyncHandler(async (req: Request, res: Response) => {
    let tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
        return res.status(404).json({ message: 'Tournoi introuvable' });
    }

    tournament = await Tournament.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: tournament });
});

// @desc    Delete tournament
// @route   DELETE /api/tournaments/:id
// @access  Private (Admin)
export const deleteTournament = asyncHandler(async (req: Request, res: Response) => {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
        return res.status(404).json({ message: 'Tournoi introuvable' });
    }

    await tournament.deleteOne();

    res.status(200).json({ success: true, data: {} });
});

// @desc    Join tournament
// @route   POST /api/tournaments/:id/join
// @access  Private (Player)
export const joinTournament = asyncHandler(async (req: any, res: Response) => {
    const { promoCode } = req.body;
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
        return res.status(404).json({ message: 'Tournoi introuvable' });
    }

    if (tournament.status !== 'UPCOMING') {
        return res.status(400).json({ message: 'Les inscriptions sont closes pour ce tournoi.' });
    }

    if (tournament.currentTeams >= tournament.maxTeams) {
        return res.status(400).json({ message: 'Ce tournoi est complet.' });
    }

    // Check if registration deadline has passed
    if (new Date() > tournament.registrationDeadline) {
        return res.status(400).json({ message: 'La date limite d\'inscription est dépassée.' });
    }

    // Check if user is already registered
    const isRegistered = tournament.participants.includes(req.user.id);
    if (isRegistered) {
        return res.status(400).json({ message: 'Vous êtes déjà inscrit à ce tournoi.' });
    }

    let discountAmount = 0;
    let finalFee = tournament.entryFee;
    let promoCodeId = null;

    if (promoCode) {
        const promoResult = await validateAndApplyPromoCode(
            promoCode,
            tournament.entryFee,
            'tournament',
            req.user.id
        );

        if (promoResult.isValid) {
            promoCodeId = promoResult.promoCodeId;
            discountAmount = promoResult.discountAmount;
            finalFee = Math.max(0, tournament.entryFee - discountAmount);
        } else {
            return res.status(400).json({ success: false, message: promoResult.message });
        }
    }

    // --- STRIPE INTEGRATION ---
    if (finalFee > 0) {
        // Find virtual court
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

        // Create PENDING booking
        const booking = await Booking.create({
            user: req.user.id,
            court: eventCourt._id,
            startTime: tournament.startDate,
            endTime: tournament.endDate,
            totalPrice: finalFee,
            discountAmount,
            promoCode: promoCode?.toUpperCase(),
            bookingType: 'TOURNAMENT',
            tournament: tournament._id,
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
                        name: `Inscription Tournoi : ${tournament.name}`,
                        description: `Date: ${new Date(tournament.startDate).toLocaleDateString('fr-FR')}`,
                    },
                    unit_amount: Math.round(finalFee * 100),
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/succes?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/tournois`,
            customer_email: req.user.email,
            metadata: {
                bookingId: booking._id.toString(),
                type: 'TOURNAMENT_REGISTRATION'
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

    // Free entry logic
    tournament.participants.push(req.user.id);
    tournament.currentTeams += 0.5;
    await tournament.save();

    if (promoCodeId) {
        await incrementPromoCodeUsage(promoCodeId, req.user.id);
    }

    res.status(200).json({
        success: true,
        message: 'Inscription réussie ! Préparez vos raquettes.',
        data: tournament
    });
});

// @desc    Leave tournament
// @route   POST /api/tournaments/:id/leave
// @access  Private (Player)
export const leaveTournament = asyncHandler(async (req: any, res: Response) => {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
        return res.status(404).json({ message: 'Tournoi introuvable' });
    }

    // Check if registration deadline has passed
    if (new Date() > tournament.registrationDeadline) {
        return res.status(400).json({ message: 'La date limite de désinscription est dépassée.' });
    }

    // Check if user is registered
    const participantIndex = tournament.participants.indexOf(req.user.id);
    if (participantIndex === -1) {
        return res.status(400).json({ message: 'Vous n\'êtes pas inscrit à ce tournoi.' });
    }

    // Handle automated refund if there's a paid booking
    const booking = await Booking.findOne({
        user: req.user.id,
        tournament: tournament._id,
        status: 'CONFIRMED'
    });

    let refundStatus = "";
    if (booking && booking.paymentStatus === 'PAID' && booking.stripePaymentIntentId) {
        const refundResult = await refundPayment(booking.stripePaymentIntentId);
        if (refundResult.success) {
            booking.status = 'CANCELLED';
            booking.paymentStatus = 'REFUNDED';
            await booking.save();
            refundStatus = " Un remboursement a été traité.";
        } else {
             console.error(`❌ Tournament Refund Error: ${refundResult.error}`);
        }
    } else if (booking) {
        booking.status = 'CANCELLED';
        await booking.save();
    }

    tournament.participants.splice(participantIndex, 1);
    tournament.currentTeams = Math.max(0, tournament.currentTeams - 0.5);

    await tournament.save();

    res.status(200).json({
        success: true,
        message: `Désinscription réussie.${refundStatus}`,
        data: tournament
    });
});
