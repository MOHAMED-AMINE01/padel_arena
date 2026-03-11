import express from 'express';
import {
    createBooking,
    getMyBookings,
    getAllBookings,
    cancelBooking,
    updateBooking,
    getAvailableSlots
} from '../controllers/bookingController';
import { protect, authorize, optionalProtect } from '../middlewares/auth';

const router = express.Router();

router.get('/available-slots', getAvailableSlots);

// Global protection from this point downwards, 
// But the POST / route should be accessible to guests.
router.route('/')
    .get(protect, authorize('ADMIN'), getAllBookings)
    .post(optionalProtect, createBooking);

router.use(protect);

router.get('/me', getMyBookings);

router.route('/:id')
    .put(authorize('ADMIN'), updateBooking)
    .delete(cancelBooking);

export default router;
