import express from 'express';
import slugify from 'slugify';
import  Articale  from '../models/article.mjs';
import upload from '../utils/imageUpload.mjs';
const app = express.Router();

//get
app.get('/', (req,res) => {
    return res.status(200).send({message: 'hello'})
})
//create article
app.post('/',upload.single('image'),async (req,res) => {
    try {
        const article = new Articale({
            title: req.body.title,
            content: req.body.content,
            article_slug: slugify(req.body.title,{ lower: true }),
            draft: req.body.draft,
            excerpt: req.body.excerpt,
            published: req.body.published,
            image: req.file.filename
        });
        
        await article.save();
        return res.status(200).json(article);
    } catch (error) {
        return res.status(500).json({ error: error });
    }
  
})
//update article
app.put('/:id',upload.single('image') , async (req, res) => {
    try {
        const article = await Articale.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ msg: 'Article not found' });
        }
        article.title = req.body.title;
        article.content = req.body.content;
        article.article_slug = slugify(req.body.title,{ lower: true });
        article.draft = req.body.draft;
        article.excerpt = req.body.excerpt;
        article.published = req.body.published;
        if (req.file) {
            article.image = req.file.filename;
        }
        await article.save();
        return res.status(200).json(article);
    } catch (error) {
        return res.status(500).json({ error: error });
    }
})
// delete the article
app.delete('/:id', async  (req, res) => {
    try {
        const article = await Articale.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ msg: 'Article not found' });
        }
        await article.remove();
        return res.status(200).json({ msg: 'Article deleted' });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
    
})
export default app;