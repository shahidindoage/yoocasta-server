import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import * as authService from './auth.service';
import { ApiResponse } from '../../utils/apiResponse';

const handleValidation = (req: Request, res: Response): boolean => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    ApiResponse.error(res, 'Validation failed', 422, errors.array());
    return false;
  }
  return true;
};

export const registerTalent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!handleValidation(req, res)) return;
    const result = await authService.registerTalent(req.body);
    ApiResponse.success(res, result, 'Talent registered successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const registerRecruiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!handleValidation(req, res)) return;
    const result = await authService.registerRecruiter(req.body);
    ApiResponse.success(res, result, 'Recruiter registered successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!handleValidation(req, res)) return;
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    ApiResponse.success(res, result, 'Login successful');
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return ApiResponse.error(res, 'Refresh token required', 400);
    const result = await authService.refreshToken(refreshToken);
    ApiResponse.success(res, result, 'Token refreshed');
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!handleValidation(req, res)) return;
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    ApiResponse.success(res, result, result.message);
  } catch (err) {
    next(err);
  }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!handleValidation(req, res)) return;
    const { email, otp } = req.body;
    const result = await authService.verifyOtp(email, otp);
    ApiResponse.success(res, result, result.message);
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!handleValidation(req, res)) return;
    const { email, otp, password } = req.body;
    const result = await authService.resetPassword(email, otp, password);
    ApiResponse.success(res, result, result.message);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response) => {
  // JWT is stateless — logout handled on frontend by clearing tokens
  ApiResponse.success(res, null, 'Logged out successfully');
};


export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query;
    if (!token) return ApiResponse.error(res, 'Token is required', 400);
    const result = await authService.verifyEmail(token as string);
    ApiResponse.success(res, result, result.message);
  } catch (err) {
    next(err);
  }
};

export const resendVerificationEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) return ApiResponse.error(res, 'Email is required', 400);
    const result = await authService.resendVerificationEmail(email);
    ApiResponse.success(res, result, result.message);
  } catch (err) {
    next(err);
  }
};

export const verifyEmailOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return ApiResponse.error(res, 'Email and OTP required', 400);
    const result = await authService.verifyEmailOtp(email, otp);
    ApiResponse.success(res, result, result.message);
  } catch (err) {
    next(err);
  }
};