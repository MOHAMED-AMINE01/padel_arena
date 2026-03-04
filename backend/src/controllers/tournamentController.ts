import { Request, Response } from 'express';
import Tournament from '../models/Tournament';
import { asyncHandler } from '../utils/asyncHandler';
import { validateAndApplyPromoCode, incrementPromoCodeUsage } from '../services/promoCodeService';

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
        } else {
            return res.status(400).json({ success: false, message: promoResult.message });
        }
    }

    // Actually, join logic might need more detail (teams of 2, etc.)
    // For now, let's keep it simple: just add the user
    tournament.participants.push(req.user.id);
    tournament.currentTeams += 0.5; // If it's single user joining, 2 users = 1 team?

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

    tournament.participants.splice(participantIndex, 1);
    tournament.currentTeams = Math.max(0, tournament.currentTeams - 0.5);

    await tournament.save();

    res.status(200).json({
        success: true,
        message: 'Désinscription réussie.',
        data: tournament
    });
});
