import express from 'express';
import { createCheckoutSession, handleWebhook } from '../controllers/paymentController';

const router = express.Router();

// Public route for creating checkout session
router.post('/create-checkout-session', express.json(), createCheckoutSession);

// Webhook route - Stripe calls this (Needs RAW body handling in index.ts)
router.post('/webhook', handleWebhook);

export default router;
