import express from 'express';
import {deleteArticle , updateArticle} from '../controllers/articleController.mjs'
import imageUpload from '../utils/imageUpload.mjs'
const app = express.Router();

//update article
app.put('/:id',imageUpload.single('image'), updateArticle);
// delete the article
app.delete('/:id',deleteArticle); 

export default app;