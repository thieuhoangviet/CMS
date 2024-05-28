import Article from '../models/Article.model.mjs'
import slugify from 'slugify'


export const updateArticle = async (req, res) => {
    try {
        const article = await Articale.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ msg: 'Article not found' });
        }
        article.title = req.body.title;
        article.content = req.body.content;
        article.article_slug = slugify(req.body.title, { lower: true });
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

export const getArticleBySlug = async (req, res) => {
    try {
        const { id } = req.params;
        const article = await Article.findOne({ article_slug: id })
        console.log(id);

        if (!article) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Bài viết không tồn tại.',
                statusCode: 404
            });
        }

        return res.status(HttpStatus.OK).json(article);
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message,
            statusCode: 500
        });
    }


}

export const createArticles = async (req, res) => {
    const { slug, content, excerpt, image, draft, published } = req.body;
    console.log(req.body);

    if (!slug) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Slug is required',
            statusCode: 400
        });
    }

    try {
        // Tạo bài viết và lưu vào cơ sở dữ liệu
        const article = await CMS.create({
            slug: slug,
            content: content,
            excerpt: excerpt,
            image: image,
            draft: draft,
            published: published
        });

        // Trả về phản hồi cho client
        res.status(201).json({
            savedArticle: article,
            message: 'Article created successfully',
            statusCode: 201
        });
    } catch (error) {
        // Xử lý lỗi nếu có
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message,
            statusCode: 500
        });
    }
}
