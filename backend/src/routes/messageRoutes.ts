import express from 'express';
import {
    getMessages,
    getMessage,
    replyToMessage,
    deleteMessage,
    contactForm,
    getMyMessages,
    getMyMessageHistory,
    replyAsPlayer
} from '../controllers/messageController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

// Public route for contact form
router.post('/contact', contactForm);

// User specific routes
router.get('/me', protect, getMyMessages);
router.get('/me/:id', protect, getMyMessageHistory);
router.post('/me/:id/reply', protect, replyAsPlayer);

// All other routes protected for admin
router.use(protect);
router.use(authorize('ADMIN'));

router.get('/', getMessages);
router.get('/:id', getMessage);
router.post('/:id/reply', replyToMessage);
router.delete('/:id', deleteMessage);

export default router;
