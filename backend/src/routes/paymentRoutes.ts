import express from 'express';
import { createCheckoutSession, createWalletCheckoutSession, handleWebhook, payWithWallet } from '../controllers/paymentController';
import { protect } from '../middlewares/auth';

const router = express.Router();

// Public route for creating checkout session
router.post('/create-checkout-session', createCheckoutSession);
// Wallet session needs dynamic plan handling and auth
router.post('/create-wallet-session', protect, createWalletCheckoutSession);
// Pay using internal balance
router.post('/pay-with-wallet', protect, payWithWallet);

// Webhook route - Stripe calls this (Needs RAW body handling in index.ts)
router.post('/webhook', handleWebhook);

export default router;
