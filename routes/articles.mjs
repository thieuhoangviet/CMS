import express from 'express';
import { getArticleBySlug } from '../controllers/articleController.mjs';

const router = express.Router();

router.get('/articles/:slug', getArticleBySlug);

export default router;

