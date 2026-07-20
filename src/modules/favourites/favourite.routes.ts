import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/rbac.middleware';
import * as favouriteController from './favourite.controller';

const router = Router();

router.use(authenticate, authorize('RECRUITER'));

router.get('/', favouriteController.list);
router.get('/ids', favouriteController.ids);
router.post('/:talentUserId', favouriteController.add);
router.delete('/:talentUserId', favouriteController.remove);

export default router;
