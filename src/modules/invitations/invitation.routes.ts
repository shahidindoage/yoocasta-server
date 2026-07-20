import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/rbac.middleware';
import * as invitationController from './invitation.controller';

const router = Router();

// Public route
router.get('/public/:jobId', invitationController.getPublic);

// Protected recruiter routes
router.post('/', authenticate, authorize('RECRUITER'), invitationController.send);
router.get('/', authenticate, authorize('RECRUITER'), invitationController.list);
router.get('/talent-ids', authenticate, authorize('RECRUITER'), invitationController.talentIds);

// Protected talent route
router.get('/my', authenticate, authorize('TALENT'), invitationController.getMy);

export default router;
