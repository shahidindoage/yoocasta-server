import { Request, Response, NextFunction } from 'express';
import * as talentService from './talent.service';
import { ApiResponse } from '../../utils/apiResponse';
import { AuthRequest } from '../../middleware/auth.middleware';

export const getPublicProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;
    const result = await talentService.getPublicProfile({
      username: typeof username === 'string' ? username : username[0],  
      viewerUserId: req.user?.userId,   // undefined if not logged in
      viewerRole: req.user?.role,       // undefined if not logged in
    });
    ApiResponse.success(res, result, 'Profile fetched successfully');
  } catch (err) { next(err); }
};