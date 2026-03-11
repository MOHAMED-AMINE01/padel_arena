import express from 'express';
import { getPublicNews, getAllNews, createNews, updateNews, deleteNews } from '../controllers/newsController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

router.get('/', getPublicNews);
router.get('/all', protect, authorize('ADMIN'), getAllNews);
router.post('/', protect, authorize('ADMIN'), createNews);
router.put('/:id', protect, authorize('ADMIN'), updateNews);
router.delete('/:id', protect, authorize('ADMIN'), deleteNews);

export default router;
