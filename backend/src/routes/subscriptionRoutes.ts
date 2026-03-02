import express from 'express';
import {
    getAvailablePlans,
    getMySubscription,
    subscribeToPlan,
    cancelMySubscription
} from '../controllers/subscriptionController';
import { protect } from '../middlewares/auth';

const router = express.Router();

// Public route - get all available plans
router.get('/plans', getAvailablePlans);

// Protected routes - require authentication
router.use(protect);
router.get('/my-subscription', getMySubscription);
router.post('/subscribe/:planId', subscribeToPlan);
router.post('/cancel', cancelMySubscription);

export default router;
