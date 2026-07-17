import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as applicationService from './application.service';
import { ApiResponse } from '../../utils/apiResponse';

export const applyForRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { roleId, formData } = req.body;
    if (!roleId) return ApiResponse.error(res, 'roleId is required', 400);
    const result = await applicationService.applyForRole(req.user!.userId, roleId, formData || {});
    ApiResponse.success(res, result, 'Application submitted successfully');
  } catch (err) { next(err); }
};

export const getMyApplications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await applicationService.getMyApplications(req.user!.userId);
    ApiResponse.success(res, result, 'Applications fetched');
  } catch (err) { next(err); }
};
