import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as blogService from './blog.service';
import { ApiResponse } from '../../utils/apiResponse';

export const getPublicBlogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await blogService.getPublicBlogs(req.query);
    ApiResponse.success(res, result, 'Blogs fetched');
  } catch (err) {
    next(err);
  }
};

export const getBlogById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const blogId = parseInt(req.params.blogId as string);
    if (isNaN(blogId)) {
      return ApiResponse.error(res, 'Invalid blog ID', 400);
    }
    const blog = await blogService.getBlogById(blogId);
    if (!blog) {
      return ApiResponse.error(res, 'Blog not found', 404);
    }
    ApiResponse.success(res, blog, 'Blog fetched');
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const categories = await blogService.getCategories();
    ApiResponse.success(res, categories, 'Categories fetched');
  } catch (err) {
    next(err);
  }
};
