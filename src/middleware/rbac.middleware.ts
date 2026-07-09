import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { ApiResponse } from '../utils/apiResponse';

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return ApiResponse.error(res, 'Unauthorized', 401);
    }

    if (!roles.includes(req.user.role)) {
      return ApiResponse.error(res, 'Forbidden — insufficient permissions', 403);
    }

    next();
  };
};