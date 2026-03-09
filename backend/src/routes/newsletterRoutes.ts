import express from 'express';
import {
    subscribe,
    getSubscribers,
    sendNewsletter,
    toggleSubscriber,
    deleteSubscriber
} from '../controllers/newsletterController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

// Public route for subscription
router.post('/subscribe', subscribe);

// Admin only routes
router.use(protect);
router.use(authorize('ADMIN'));

router.get('/subscribers', getSubscribers);
router.post('/send', sendNewsletter);
router.patch('/subscribers/:id', toggleSubscriber);
router.delete('/subscribers/:id', deleteSubscriber);

export default router;
