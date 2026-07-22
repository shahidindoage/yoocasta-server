import { Request, Response, NextFunction } from 'express';
import { sendEmail } from '../../config/email';
import { ApiResponse } from '../../utils/apiResponse';

export const submitContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return ApiResponse.error(res, 'All fields are required', 400);
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #3835A4;">New Contact Enquiry</h2>
        <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px 12px; font-weight: bold; color: #333; border-bottom: 1px solid #eee;">Name</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${name}</td></tr>
          <tr><td style="padding: 8px 12px; font-weight: bold; color: #333; border-bottom: 1px solid #eee;">Email</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${email}</td></tr>
          <tr><td style="padding: 8px 12px; font-weight: bold; color: #333; border-bottom: 1px solid #eee;">Subject</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${subject}</td></tr>
        </table>
        <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin-top: 12px;">
          <p style="margin: 0; color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
      </div>
    `;

    await sendEmail(process.env.SMTP_FROM || 'shahid.indoage@gmail.com', `Contact: ${subject}`, html);

    ApiResponse.success(res, null, 'Your message has been sent successfully. We will get back to you soon.');
  } catch (err) {
    next(err);
  }
};
