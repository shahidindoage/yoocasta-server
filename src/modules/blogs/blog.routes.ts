import { Router } from 'express';
import { getPublicBlogs, getBlogById, getCategories } from './blog.controller';

const router = Router();

router.get('/', getPublicBlogs);
router.get('/categories', getCategories);
router.get('/:blogId', getBlogById);

export default router;
