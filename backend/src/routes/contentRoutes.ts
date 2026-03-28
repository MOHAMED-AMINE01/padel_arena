import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/SettingsController';
import { getAllTestimonials, adminGetTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/TestimonialController';
import { getAllTeamMembers, adminGetTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '../controllers/TeamMemberController';
import { protect, authorize } from '../middlewares/auth';

const router = Router();

// Site Settings
router.get('/settings', getSettings);
router.put('/settings', protect, authorize('ADMIN', 'SUPER_ADMIN'), updateSettings);

// Testimonials
router.get('/testimonials', getAllTestimonials);
router.get('/admin/testimonials', protect, authorize('ADMIN', 'SUPER_ADMIN'), adminGetTestimonials);
router.post('/testimonials', protect, authorize('ADMIN', 'SUPER_ADMIN'), createTestimonial);
router.put('/testimonials/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), updateTestimonial);
router.delete('/testimonials/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), deleteTestimonial);

// Team Members
router.get('/team', getAllTeamMembers);
router.get('/admin/team', protect, authorize('ADMIN', 'SUPER_ADMIN'), adminGetTeamMembers);
router.post('/team', protect, authorize('ADMIN', 'SUPER_ADMIN'), createTeamMember);
router.put('/team/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), updateTeamMember);
router.delete('/team/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), deleteTeamMember);

export default router;
