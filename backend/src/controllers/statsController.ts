import { Request, Response } from 'express';
import User from '../models/User';
import Booking from '../models/Booking';
import Tournament from '../models/Tournament';
import { asyncHandler } from '../utils/asyncHandler';

// Helper function to calculate level based on points
const calculateLevel = (points: number): string => {
    if (points >= 3000) return 'ELITE';
    if (points >= 2000) return 'EXPERT';
    if (points >= 1200) return 'AVANCE';
    if (points >= 500) return 'INTERMEDIAIRE';
    return 'DEBUTANT';
};

// @desc    Get my stats
// @route   GET /api/stats/me
// @access  Private
export const getMyStats = asyncHandler(async (req: any, res: Response) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Get all players ordered by points to calculate rank
    const allPlayers = await User.find({ role: 'PLAYER', isActive: true })
        .select('stats.points')
        .sort({ 'stats.points': -1 });

    const rank = allPlayers.findIndex(p => p._id.toString() === user._id.toString()) + 1;

    // Calculate win rate
    const stats = user.stats || { points: 0, matchesPlayed: 0, wins: 0, losses: 0, streak: 0, bestRank: 999, tournamentsPlayed: 0, tournamentsWon: 0 };
    const matchesPlayed = stats.matchesPlayed || 0;
    const wins = stats.wins || 0;
    const winRate = matchesPlayed > 0 ? Math.round((wins / matchesPlayed) * 100) : 0;

    res.status(200).json({
        success: true,
        data: {
            points: stats.points || 0,
            rank: rank || 999,
            level: stats.level || calculateLevel(stats.points || 0),
            matchesPlayed: stats.matchesPlayed || 0,
            wins: stats.wins || 0,
            losses: stats.losses || 0,
            winRate,
            streak: stats.streak || 0,
            bestRank: stats.bestRank || rank,
            tournamentsPlayed: stats.tournamentsPlayed || 0,
            tournamentsWon: stats.tournamentsWon || 0
        }
    });
});

// @desc    Get club rankings
// @route   GET /api/stats/rankings
// @access  Private
export const getRankings = asyncHandler(async (req: any, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;

    const players = await User.find({ role: 'PLAYER', isActive: true })
        .select('name stats.points')
        .sort({ 'stats.points': -1 })
        .limit(limit);

    const rankings = players.map((player, index) => ({
        rank: index + 1,
        name: player.name.toUpperCase(),
        points: player.stats?.points || 0,
        avatar: player.name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2),
        change: 0 // TODO: Track rank changes over time
    }));

    res.status(200).json({
        success: true,
        data: rankings
    });
});

// @desc    Get match history
// @route   GET /api/stats/history
// @access  Private
export const getMatchHistory = asyncHandler(async (req: any, res: Response) => {
    // For now, return empty array since we don't have a Match model
    // TODO: Create a Match model to track real match results with opponents
    res.status(200).json({
        success: true,
        data: []
    });
});

// Helper to format relative date
const getRelativeDate = (date: Date | string): string => {
    if (!date) return "Date inconnue";
    
    const now = new Date();
    const targetDate = new Date(date);
    
    // Check if date is valid
    if (isNaN(targetDate.getTime())) return "Date inconnue";
    
    const diff = now.getTime() - targetDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return "Bientôt";
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Hier";
    if (days < 7) return `Il y a ${days}j`;
    if (days < 14) return "Il y a 1sem";
    if (days < 30) return `Il y a ${Math.floor(days / 7)}sem`;
    const months = Math.floor(days / 30);
    if (months === 1) return "Il y a 1 mois";
    return `Il y a ${months} mois`;
};

// @desc    Update user stats (admin or after match)
// @route   PUT /api/stats/update
// @access  Private/Admin
export const updateStats = asyncHandler(async (req: any, res: Response) => {
    const { points, wins, losses, matchesPlayed } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Update stats
    if (!user.stats) {
        user.stats = {
            points: 0,
            level: 'DEBUTANT',
            matchesPlayed: 0,
            wins: 0,
            losses: 0,
            streak: 0,
            bestRank: 999,
            tournamentsPlayed: 0,
            tournamentsWon: 0
        };
    }

    if (points !== undefined) user.stats.points = points;
    if (wins !== undefined) user.stats.wins = wins;
    if (losses !== undefined) user.stats.losses = losses;
    if (matchesPlayed !== undefined) user.stats.matchesPlayed = matchesPlayed;

    // Recalculate level
    user.stats.level = calculateLevel(user.stats.points || 0) as any;

    await user.save();

    res.status(200).json({
        success: true,
        data: user.stats
    });
});
