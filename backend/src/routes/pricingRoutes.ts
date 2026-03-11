import express from 'express';
import { getPublicPricing, getAllPricing, createPricing, updatePricing, deletePricing } from '../controllers/pricingController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

router.get('/', getPublicPricing);
router.get('/all', protect, authorize('ADMIN'), getAllPricing);
router.post('/', protect, authorize('ADMIN'), createPricing);
router.put('/:id', protect, authorize('ADMIN'), updatePricing);
router.delete('/:id', protect, authorize('ADMIN'), deletePricing);

export default router;
