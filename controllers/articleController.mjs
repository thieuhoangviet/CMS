import Article from '../models/Article.mjs';
import HttpStatus from 'http-status-codes';

export const getArticleBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const article = await Article.findOne({article_slug: slug})
        
        console.log(slug)
        console.log(article)

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
};