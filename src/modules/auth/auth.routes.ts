import { Router } from 'express';
import * as authController from './auth.controller';
import {
  registerTalentValidation,
  registerRecruiterValidation,
  loginValidation,
  forgotPasswordValidation,
  verifyOtpValidation,
  resetPasswordValidation,
} from './auth.validation';

const router = Router();

router.post('/register/talent', registerTalentValidation, authController.registerTalent);
router.post('/register/recruiter', registerRecruiterValidation, authController.registerRecruiter);
router.post('/login', loginValidation, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refreshToken);
router.post('/forgot-password', forgotPasswordValidation, authController.forgotPassword);
router.post('/verify-otp', verifyOtpValidation, authController.verifyOtp);
router.post('/reset-password', resetPasswordValidation, authController.resetPassword);
router.get('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerificationEmail);
router.post('/verify-email-otp', authController.verifyEmailOtp);

export default router;