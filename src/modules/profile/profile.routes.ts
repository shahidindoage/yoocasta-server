import { Router } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth.middleware';
import { uploadProfilePhoto, uploadPortfolioFile } from '../../middleware/upload.middleware';
import {
  getProfile,
  updateBasicInfo,
  updatePhysicalAttributes,
  updateCategoriesAndSkills,
  updateBioAndDescription,
  uploadProfilePhotoHandler,
  getFormOptions,
  checkProfileComplete,
  getPortfolioMediaHandler,
  uploadPortfolioMediaHandler,
  deletePortfolioMediaHandler,
  // NEW IMPORTS BELOW
  addCareerHistoryHandler,
  updateCareerHistoryHandler,
  deleteCareerHistoryHandler,
  addCourseHandler,
  updateCourseHandler,
  deleteCourseHandler,
  addPortfolioLinkHandler,
  reorderPortfolioHandler
} from './profile.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get form options (nationalities, cities, categories etc.)
router.get('/options', getFormOptions);

// Get my profile
router.get('/me', getProfile);

// Step 1 - Basic Info
router.put('/basic-info', updateBasicInfo);

// Step 2 - Physical Attributes
router.put('/physical-attributes', updatePhysicalAttributes);

// Step 3 - Categories & Skills
router.put('/categories-skills', updateCategoriesAndSkills);

// Step 4 - Bio & Description
router.put('/bio-description', updateBioAndDescription);

// Step 5 - Profile Photo
router.post('/photo', uploadProfilePhoto, uploadProfilePhotoHandler);

// Check complete
router.post('/check-complete', checkProfileComplete);

// Portfolio Media (Files)
router.get('/portfolio', getPortfolioMediaHandler);
router.post('/portfolio', uploadPortfolioFile, uploadPortfolioMediaHandler);
router.delete('/portfolio/:mediaId', deletePortfolioMediaHandler);

// ── NEW ROUTES BELOW ────────────────────────────────────────

// Career History
router.post('/career-history', addCareerHistoryHandler);
router.put('/career-history/:historyId', updateCareerHistoryHandler);
router.delete('/career-history/:historyId', deleteCareerHistoryHandler);

// Talent Courses
router.post('/courses', addCourseHandler);
router.put('/courses/:courseId', updateCourseHandler);
router.delete('/courses/:courseId', deleteCourseHandler);

// Portfolio Links & Reordering
router.post('/portfolio/link', addPortfolioLinkHandler);
router.put('/portfolio/reorder', reorderPortfolioHandler);

export default router;