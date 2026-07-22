import { Router } from 'express';
import { getAllPlans } from './plan.controller';

const router = Router();

router.get('/', getAllPlans);

export default router;
