import express from 'express';
import {
    getAvailablePlans,
    getMySubscription,
    subscribeToPlan,
    cancelMySubscription,
    checkEmailSubscription
} from '../controllers/subscriptionController';
import { protect } from '../middlewares/auth';

const router = express.Router();

// Public routes
router.get('/plans', getAvailablePlans);
router.post('/check-email', checkEmailSubscription);

// Protected routes - require authentication
router.use(protect);
router.get('/my-subscription', getMySubscription);
router.post('/subscribe/:planId', subscribeToPlan);
router.post('/cancel', cancelMySubscription);

export default router;
