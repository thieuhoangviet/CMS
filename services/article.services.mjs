import { BadRequestError } from "../core/error.response.mjs";
import ArticleModel from "../models/Article.model.mjs";
import slugify from 'slugify'

export class ArticleService {
    static updateArticle = async (req) => {
        const article = await ArticleModel.findById(req.params.id);
        if (!article) {
            throw new BadRequestError('Article not found');
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
        return article
    }

    static deleteArticle = async (id) => {
        const article = await ArticleModel.findById(id);
        if (!article) {
            throw new BadRequestError('Article not found');
        }
        await article.remove();
        return { msg: 'Article removed' }
    }

    static getArticle = async (id) => {
        const article = await ArticleModel.findOne({ article_slug: id })

        if (!article) {
            throw new BadRequestError('Article not found');
        }
        return article
    }

    static createArticle = async (slug, content, excerpt, image, draft, published) => {
        if (!slug) {
            throw new BadRequestError('Slug is required')
        }

        // Tạo bài viết và lưu vào cơ sở dữ liệu
        const article = await ArticleModel.create({
            slug: slug,
            content: content,
            excerpt: excerpt,
            image: image,
            draft: draft,
            published: published
        });

        // Trả về phản hồi cho client
        return {
            savedArticle: article
        }

    }
}