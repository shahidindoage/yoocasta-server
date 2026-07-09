import { Router } from 'express';
import { optionalAuthenticate } from '../../middleware/optionalAuth.middleware';
import * as talentController from './talent.controller';

const router = Router();

// Public route: Anyone can view, but optional auth checks for Internal Company logic
router.get('/:username', optionalAuthenticate, talentController.getPublicProfile);

export default router;