import express from 'express';
import {
    createBooking,
    getMyBookings,
    getAllBookings,
    cancelBooking,
    updateBooking,
    getAvailableSlots
} from '../controllers/bookingController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

router.get('/available-slots', getAvailableSlots);

// All other routes are protected
router.use(protect);

router.route('/')
    .get(authorize('ADMIN'), getAllBookings)
    .post(createBooking);

router.get('/me', getMyBookings);

router.route('/:id')
    .put(authorize('ADMIN'), updateBooking)
    .delete(cancelBooking);

export default router;
