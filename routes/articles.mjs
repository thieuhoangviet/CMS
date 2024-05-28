import express from 'express';
import { createArticles, getArticleBySlug } from '../controllers/articleController.mjs';

const router = express.Router();

router.get('/articles/:slug', getArticleBySlug)
    .post('/create-article', createArticles)
    

export default router;

