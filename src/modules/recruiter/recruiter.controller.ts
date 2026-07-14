import { Request, Response, NextFunction } from 'express';
import * as recruiterService from './recruiter.service';
import { ApiResponse } from '../../utils/apiResponse';
import { AuthRequest } from '../../middleware/auth.middleware';

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await recruiterService.getRecruiterProfile(req.user!.userId);
    ApiResponse.success(res, result, 'Profile fetched');
  } catch (err) { next(err); }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await recruiterService.updateRecruiterProfile(req.user!.userId, req.body);
    ApiResponse.success(res, result, result.message);
  } catch (err) { next(err); }
};

export const uploadLogo = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return ApiResponse.error(res, 'No file uploaded', 400);
    const result = await recruiterService.uploadLogoService(req.user!.userId, req.file);
    ApiResponse.success(res, result, result.message);
  } catch (err) { next(err); }
};

export const uploadTradeLicense = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return ApiResponse.error(res, 'No file uploaded', 400);
    const result = await recruiterService.uploadTradeLicenseService(req.user!.userId, req.file);
    ApiResponse.success(res, result, result.message);
  } catch (err) { next(err); }
};

export const updateLocation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { cityId } = req.body;
    const result = await recruiterService.updateRecruiterLocation(req.user!.userId, cityId);
    ApiResponse.success(res, null, result.message);
  } catch (err) { next(err); }
};