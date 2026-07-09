import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  });
};

export const otpEmailTemplate = (name: string, otp: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset OTP</h2>
      <p>Hi ${name},</p>
      <p>Your OTP for password reset is:</p>
      <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
        <h1 style="color: #e74c3c; letter-spacing: 8px; font-size: 36px;">${otp}</h1>
      </div>
      <p>This OTP is valid for <strong>10 minutes</strong>.</p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Thanks,<br/>Yoocasta Team</p>
    </div>
  `;
};

export const welcomeEmailTemplate = (name: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to Yoocasta!</h2>
      <p>Hi ${name},</p>
      <p>Your account has been created successfully.</p>
      <p>You can now log in and complete your profile.</p>
      <p>Thanks,<br/>Yoocasta Team</p>
    </div>
  `;
};

export const verifyEmailTemplate = (name: string, verifyUrl: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Verify Your Email</h2>
      <p>Hi ${name},</p>
      <p>Please click the button below to verify your email address:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" 
           style="background: #e74c3c; color: white; padding: 14px 30px; 
                  text-decoration: none; border-radius: 6px; font-size: 16px;">
          Verify Email
        </a>
      </div>
      <p>Or copy this link: <a href="${verifyUrl}">${verifyUrl}</a></p>
      <p>This link expires in <strong>24 hours</strong>.</p>
      <p>If you did not create an account, ignore this email.</p>
      <p>Thanks,<br/>Yoocasta Team</p>
    </div>
  `;
};