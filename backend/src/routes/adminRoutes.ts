import express from 'express';
import { getAdminStats, getAllUsers, deleteUser, updateUser } from '../controllers/adminController';
import { getTransactions, createTransaction, deleteTransaction } from '../controllers/transactionController';
import { getCurrentShift, openShift, closeShift, getShiftHistory, deleteShift } from '../controllers/cashShiftController';
import { getSubscriptions, createSubscription, updateSubscription, deleteSubscription, getSubscriptionStats, exportSubscriptions } from '../controllers/subscriptionController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

// All routes are protected and restricted to ADMIN
router.use(protect);
router.use(authorize('ADMIN'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.route('/users/:id')
    .put(updateUser)
    .delete(deleteUser);

router.route('/transactions')
    .get(getTransactions)
    .post(createTransaction);

router.delete('/transactions/:id', deleteTransaction);

// Cash shift management
router.get('/cash-shift/current', getCurrentShift);
router.post('/cash-shift/open', openShift);
router.post('/cash-shift/close', closeShift);
router.get('/cash-shift/history', getShiftHistory);
router.delete('/cash-shift/:id', deleteShift);

// Subscriptions
router.get('/subscriptions/stats', getSubscriptionStats);
router.get('/subscriptions/export', exportSubscriptions);
router.route('/subscriptions')
    .get(getSubscriptions)
    .post(createSubscription);
router.route('/subscriptions/:id')
    .put(updateSubscription)
    .delete(deleteSubscription);

export default router;
