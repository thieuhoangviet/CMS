import Articale from '../models/Article.mjs'
import slugify from 'slugify'


export const updateArticle =  async (req, res) => {
    try {
        const id = req.params.id;
        if(!/^[a-zA-Z0-9]+$/.test(id)) {
            return res.status(404).json({ msg: "Article's Id invalid !!! It has special characters" });
        }  
        const article = await Articale.findById(id);
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
}

export const deleteArticle = async (req, res) => {
    try {
        const article = await Articale.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ msg: 'Article not found' });
        }
        await article.remove();
        return res.status(200).json({ msg: 'Article removed' });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}

