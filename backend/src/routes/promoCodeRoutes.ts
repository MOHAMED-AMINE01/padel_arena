import express from 'express';
import {
    getPromoCodes,
    getPromoCode,
    getPromoCodeStats,
    validatePromoCode,
    createPromoCode,
    updatePromoCode,
    deletePromoCode,
    togglePromoCode,
    applyPromoCode
} from '../controllers/promoCodeController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

// Public route - validate a promo code
router.post('/validate', validatePromoCode);

// Protected routes - require authentication
router.use(protect);

// User can apply a promo code
router.post('/:id/apply', applyPromoCode);

// Admin only routes
router.use(authorize('ADMIN'));

router.get('/', getPromoCodes);
router.get('/stats', getPromoCodeStats);
router.get('/:id', getPromoCode);
router.post('/', createPromoCode);
router.put('/:id', updatePromoCode);
router.delete('/:id', deletePromoCode);
router.patch('/:id/toggle', togglePromoCode);

export default router;
