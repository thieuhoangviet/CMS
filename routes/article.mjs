import express from 'express';
import { deleteArticle, updateArticle } from '../controllers/articleController.mjs'
import imageUpload from '../utils/imageUpload.mjs'
import updateArticleValidator from '../validators/updateArticleValidator.mjs';
import validateId from '../validators/validateId.mjs';
import { getArticleBySlug , createArticles } from '../controllers/articleController.mjs';
const router = express.Router();

//update article
router
    .put('/:id', validateId, updateArticleValidator, imageUpload.single('image'), updateArticle)
    // delete the article
    .delete('/:id', validateId, deleteArticle)
    //get article by slug
    .get('/articles/:slug', getArticleBySlug)
    //create new article
    .post('/create-article', createArticles)
export default app;