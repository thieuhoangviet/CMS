import express from 'express';
import {deleteArticle , updateArticle} from '../controllers/articleController.mjs'
import imageUpload from '../utils/imageUpload.mjs'
import updateArticleValidator from '../validators/updateArticleValidator.mjs';
import validateId from '../validators/validateId.mjs';
const app = express.Router();

//update article
app.put('/:id', validateId, updateArticleValidator, imageUpload.single('image'), updateArticle);
// delete the article
app.delete('/:id',validateId , deleteArticle); 

export default app;