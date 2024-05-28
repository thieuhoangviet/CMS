import CMS from '../models/Article.mjs';
import HttpStatus from 'http-status-codes';

export const getArticleBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const article = await CMS.findOne({ article_slug: slug })

        if (!article) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Not Found Article',
                statusCode: 404
            });
        }
        console.log(article)

        return res.status(HttpStatus.OK).json({
            article: article,
            statusCode: 200,
            message: 'Find article successfully',
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message,
            statusCode: 500
        });
    }
};

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