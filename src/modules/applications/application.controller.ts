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

export const getJobApplications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const jobId = req.params.jobId as string;
    const result = await applicationService.getJobApplications(req.user!.userId, jobId);
    ApiResponse.success(res, result, 'Job applications fetched');
  } catch (err) { next(err); }
};

export const getApplicationById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const applicationId = req.params.applicationId as string;
    const result = await applicationService.getApplicationById(req.user!.userId, applicationId);
    ApiResponse.success(res, result, 'Application details fetched');
  } catch (err) { next(err); }
};

export const bulkUpdateStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { applicationIds, status, subject, body } = req.body;
    if (!applicationIds?.length) return ApiResponse.error(res, 'applicationIds is required', 400);
    if (!status) return ApiResponse.error(res, 'status is required', 400);
    if (!subject) return ApiResponse.error(res, 'subject is required', 400);
    if (!body) return ApiResponse.error(res, 'body is required', 400);
    const result = await applicationService.bulkUpdateStatus(req.user!.userId, applicationIds, status, subject, body);
    ApiResponse.success(res, result, 'Status updated and emails sent');
  } catch (err) { next(err); }
};
