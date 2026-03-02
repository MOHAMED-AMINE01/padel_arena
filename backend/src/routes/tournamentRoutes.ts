import express from 'express';
import {
    getTournaments,
    getTournament,
    createTournament,
    updateTournament,
    deleteTournament,
    joinTournament,
    leaveTournament
} from '../controllers/tournamentController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

router.route('/')
    .get(getTournaments)
    .post(protect, authorize('ADMIN'), createTournament);

router.route('/:id')
    .get(getTournament)
    .put(protect, authorize('ADMIN'), updateTournament)
    .delete(protect, authorize('ADMIN'), deleteTournament);

router.route('/:id/join')
    .post(protect, joinTournament);

router.route('/:id/leave')
    .post(protect, leaveTournament);

export default router;
