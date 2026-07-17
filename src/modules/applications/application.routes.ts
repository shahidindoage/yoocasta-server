import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { applyForRole, getMyApplications } from './application.controller';

const router = Router();

router.use(authenticate);

router.post('/', applyForRole);
router.get('/', getMyApplications);

export default router;
