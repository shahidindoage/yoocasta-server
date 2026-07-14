import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/rbac.middleware';
import { uploadCompanyLogo, uploadTradeLicense } from '../../middleware/upload.middleware';
import * as recruiterController from './recruiter.controller';

const router = Router();

// All routes require RECRUITER role
router.use(authenticate, authorize('RECRUITER'));

router.get('/profile', recruiterController.getProfile);
router.put('/profile', recruiterController.updateProfile);
router.put('/profile/location', recruiterController.updateLocation); // ADD THIS
router.post('/profile/logo', uploadCompanyLogo, recruiterController.uploadLogo);
router.post('/profile/license', uploadTradeLicense, recruiterController.uploadTradeLicense);

export default router;