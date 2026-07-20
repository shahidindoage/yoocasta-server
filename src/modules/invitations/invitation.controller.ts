import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as invitationService from './invitation.service';
import { ApiResponse } from '../../utils/apiResponse';

export const send = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { jobId, talentUserId } = req.body;
    const result = await invitationService.sendInvitation(req.user!.userId, jobId, talentUserId);
    ApiResponse.success(res, result, 'Invitation sent');
  } catch (err) { next(err); }
};

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await invitationService.getSentInvitations(req.user!.userId);
    ApiResponse.success(res, result);
  } catch (err) { next(err); }
};

export const talentIds = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const jobId = req.query.jobId as string;
    if (!jobId) return ApiResponse.error(res, 'jobId is required', 400);
    const result = await invitationService.getInvitationTalentIds(req.user!.userId, jobId);
    ApiResponse.success(res, result);
  } catch (err) { next(err); }
};

export const getMy = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const filters = req.query;
    const result = await invitationService.getMyInvitations(req.user!.userId, filters);
    ApiResponse.success(res, result);
  } catch (err) { next(err); }
};

export const getPublic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobId = req.params.jobId as string;
    const result = await invitationService.getPublicJobInvitation(jobId);
    ApiResponse.success(res, result);
  } catch (err) { next(err); }
};
