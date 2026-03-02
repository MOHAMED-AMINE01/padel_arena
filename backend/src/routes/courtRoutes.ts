import express from 'express';
import {
    getCourts,
    getCourt,
    createCourt,
    updateCourt,
    deleteCourt
} from '../controllers/courtController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

router.route('/')
    .get(getCourts)
    .post(protect, authorize('MANAGER', 'ADMIN'), createCourt);

router.route('/:id')
    .get(getCourt)
    .put(protect, authorize('MANAGER', 'ADMIN'), updateCourt)
    .delete(protect, authorize('MANAGER', 'ADMIN'), deleteCourt);

export default router;
