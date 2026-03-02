import express from 'express';
import {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    joinCourse,
    leaveCourse
} from '../controllers/courseController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

router.route('/')
    .get(getCourses)
    .post(protect, authorize('ADMIN'), createCourse);

router.route('/:id')
    .get(getCourse)
    .put(protect, authorize('ADMIN'), updateCourse)
    .delete(protect, authorize('ADMIN'), deleteCourse);

router.route('/:id/join')
    .post(protect, joinCourse);

router.route('/:id/leave')
    .post(protect, leaveCourse);

export default router;
