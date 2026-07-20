import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as zcardService from './zcard.service';

export const generatePdf = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { talentIds } = req.body;
    if (!talentIds || !Array.isArray(talentIds) || talentIds.length === 0) {
      return res.status(400).json({ success: false, message: 'talentIds array is required' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="zcard-${talentIds.length}-talents.pdf"`);

    await zcardService.streamZCardPdf(talentIds, res);
  } catch (err) {
    next(err);
  }
};
