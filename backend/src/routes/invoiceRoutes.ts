import express from 'express';
import {
    getInvoices,
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice
} from '../controllers/invoiceController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

// All routes are protected and restricted to ADMIN
router.use(protect);
router.use(authorize('ADMIN'));

router.route('/')
    .get(getInvoices)
    .post(createInvoice);

router.route('/:id')
    .get(getInvoice)
    .put(updateInvoice)
    .delete(deleteInvoice);

export default router;
