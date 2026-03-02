import { Request, Response } from 'express';
import Course from '../models/Course';
import { asyncHandler } from '../utils/asyncHandler';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = asyncHandler(async (req: Request, res: Response) => {
    const courses = await Course.find().sort('date');
    res.status(200).json({ success: true, count: courses.length, data: courses });
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
export const getCourse = asyncHandler(async (req: Request, res: Response) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        return res.status(404).json({ message: 'Cours introuvable' });
    }
    res.status(200).json({ success: true, data: course });
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Admin)
export const createCourse = asyncHandler(async (req: Request, res: Response) => {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Admin)
export const updateCourse = asyncHandler(async (req: Request, res: Response) => {
    let course = await Course.findById(req.params.id);

    if (!course) {
        return res.status(404).json({ message: 'Cours introuvable' });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: course });
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Admin)
export const deleteCourse = asyncHandler(async (req: Request, res: Response) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        return res.status(404).json({ message: 'Cours introuvable' });
    }

    await course.deleteOne();

    res.status(200).json({ success: true, data: {} });
});

// @desc    Join course
// @route   POST /api/courses/:id/join
// @access  Private (Player)
export const joinCourse = asyncHandler(async (req: any, res: Response) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        return res.status(404).json({ message: 'Cours introuvable' });
    }

    if (course.status !== 'UPCOMING') {
        return res.status(400).json({ message: 'Les inscriptions sont closes pour ce cours.' });
    }

    if (course.currentParticipants >= course.maxParticipants) {
        return res.status(400).json({ message: 'Ce cours est complet.' });
    }

    // Check if user is already registered
    const isRegistered = course.participants.includes(req.user.id);
    if (isRegistered) {
        return res.status(400).json({ message: 'Vous êtes déjà inscrit à ce cours.' });
    }

    course.participants.push(req.user.id);
    course.currentParticipants += 1;

    await course.save();

    res.status(200).json({
        success: true,
        message: 'Inscription réussie ! Rendez-vous sur le terrain.',
        data: course
    });
});

// @desc    Leave course
// @route   POST /api/courses/:id/leave
// @access  Private (Player)
export const leaveCourse = asyncHandler(async (req: any, res: Response) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        return res.status(404).json({ message: 'Cours introuvable' });
    }

    // Check if user is registered
    const participantIndex = course.participants.indexOf(req.user.id);
    if (participantIndex === -1) {
        return res.status(400).json({ message: 'Vous n\'êtes pas inscrit à ce cours.' });
    }

    course.participants.splice(participantIndex, 1);
    course.currentParticipants = Math.max(0, course.currentParticipants - 1);

    await course.save();

    res.status(200).json({
        success: true,
        message: 'Désinscription réussie.',
        data: course
    });
});
