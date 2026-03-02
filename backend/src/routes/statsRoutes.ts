import express from 'express';
import { protect } from '../middlewares/auth';
import {
    getMyStats,
    getRankings,
    getMatchHistory,
    updateStats
} from '../controllers/statsController';

const router = express.Router();

// Protected routes
router.get('/me', protect, getMyStats);
router.get('/rankings', protect, getRankings);
router.get('/history', protect, getMatchHistory);
router.put('/update', protect, updateStats);

export default router;
