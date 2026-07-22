import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as planService from './plan.service';
import { ApiResponse } from '../../utils/apiResponse';

export const getAllPlans = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const plans = await planService.getAllPlans();
    ApiResponse.success(res, plans, 'Plans fetched');
  } catch (err) {
    next(err);
  }
};
