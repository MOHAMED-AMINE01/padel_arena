import express from 'express';
import { getMyWallet, updateBalanceManual } from '../controllers/walletController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

router.get('/me', protect, getMyWallet);
router.put('/update/:userId', protect, authorize('ADMIN'), updateBalanceManual);

export default router;
