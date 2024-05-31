import express from 'express';
import { upload } from '../../utils/imageUpload.mjs';
import { asyncHandler } from '../../helpers/asyncHandler.mjs'; // func catch error
import { updateArticleValidator } from '../../validators/updateArticleValidator.mjs';
import { validateId } from '../../validators/validateId.mjs';
import { Article } from '../../controllers/article.Controller.mjs';
import { authentication } from '../../auth/authUtils.mjs';
const articleRouter = express.Router();

//update article
articleRouter
    .get('/', Article.getArticleAll)
    .get('/:id', Article.findArticle)

articleRouter.use(authentication)
    .put('/:id', validateId, updateArticleValidator, upload.single('image'), asyncHandler(Article.updateArticle))// ayncHandler giup bao loi~ khong bi crash ung dung
    // delete the article
    .delete('/:id', validateId, asyncHandler(Article.deleteArticle))
    //create new article
    .post('/create-article', asyncHandler(Article.createArticles))
export default articleRouter;