import express from 'express';
import { upload } from '../../utils/imageUpload.mjs';
import { asyncHandler } from '../../helpers/asyncHandler.mjs'; // func catch error
import { updateArticleValidator } from '../../validators/updateArticleValidator.mjs';
import { validateId } from '../../validators/validateId.mjs';
import { createArticles, deleteArticle, getArticleBySlug, updateArticle } from '../../controllers/article.Controller.mjs';

const articleRouter = express.Router();

//update article
articleRouter
    .put('/:id', validateId, updateArticleValidator, upload.single('image'), asyncHandler(updateArticle))
    // delete the article
    .delete('/:id', validateId, asyncHandler(deleteArticle))
    //get article by slug
    .get('/:id', getArticleBySlug)
    //create new article
    .post('/create-article', asyncHandler(createArticles))
export default articleRouter;