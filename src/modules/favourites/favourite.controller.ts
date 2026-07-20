import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as favouriteService from './favourite.service';
import { ApiResponse } from '../../utils/apiResponse';

export const add = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const talentUserId = req.params.talentUserId as string;
    const result = await favouriteService.addFavourite(req.user!.userId, talentUserId);
    ApiResponse.success(res, result, 'Added to favourites');
  } catch (err) { next(err); }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const talentUserId = req.params.talentUserId as string;
    const result = await favouriteService.removeFavourite(req.user!.userId, talentUserId);
    ApiResponse.success(res, result, 'Removed from favourites');
  } catch (err) { next(err); }
};

export const ids = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await favouriteService.getFavouriteIds(req.user!.userId);
    ApiResponse.success(res, result);
  } catch (err) { next(err); }
};

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { search, nationalities, gender, ageFrom, ageTo } = req.query;
    const result = await favouriteService.getFavourites({
      userId: req.user!.userId,
      search: search as string | undefined,
      nationalities: nationalities ? (nationalities as string).split(',') : undefined,
      gender: gender as string | undefined,
      ageFrom: ageFrom ? Number(ageFrom) : undefined,
      ageTo: ageTo ? Number(ageTo) : undefined,
    });
    ApiResponse.success(res, result);
  } catch (err) { next(err); }
};
