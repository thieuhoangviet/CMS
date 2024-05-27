import express from 'express';
import {deleteArticle , updateArticle} from '../controllers/articleController.mjs'
import imageUpload from '../utils/imageUpload.mjs'
import updateArticleValidator from '../validators/updateArticleValidator';
const app = express.Router();

//update article
app.put('/:id',updateArticleValidator,imageUpload.single('image'), updateArticle);
// delete the article
app.delete('/:id',deleteArticle); 

export default app;