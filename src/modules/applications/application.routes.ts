import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/rbac.middleware';
import { applyForRole, getMyApplications, getJobApplications, getApplicationById, bulkUpdateStatus } from './application.controller';

const router = Router();

router.use(authenticate);

router.post('/', applyForRole);
router.get('/', getMyApplications);
router.get('/job/:jobId', authorize('RECRUITER'), getJobApplications);
router.get('/:applicationId', authorize('RECRUITER'), getApplicationById);
router.put('/bulk-status', authorize('RECRUITER'), bulkUpdateStatus);

export default router;
