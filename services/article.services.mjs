import { BadRequestError } from "../core/error.response.mjs";
import ArticleModel from "../models/Article.model.mjs";
import slugify from 'slugify'
import pagination from '../utils/pagination.mjs';

export class ArticleService {
    static updateArticle = async (req) => {
        const article = await ArticleModel.findOneAndUpdate(req.params.id);
        if (!article) {
            throw new BadRequestError('Article not found');
        }
        article.title = req.body.title;
        article.content = req.body.content;
        article.article_slug = slugify(req.body.title, { lower: true });
        article.draft = req.body.draft;
        article.excerpt = req.body.excerpt;
        article.published = req.body.published;
        article.image = req.body.filename;

        await article.save();
        return article
    }

    static deleteArticle = async (id) => {
        const article = await ArticleModel.findByIdAndDelete(id);
        if (!article) {
            throw new BadRequestError('Article not found');
        }

        return { msg: 'Article removed' }
    }

    static getArticle = async (req) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const total = await ArticleModel.countDocuments();

        const { startIndex, endIndex, totalPages } = pagination(total, page, limit);

        const articles = await ArticleModel.find()
            .sort({ published_at: -1 })
            .skip(startIndex)
            .limit(limit);
        if (!articles) {
            throw new BadRequestError('Article not found');
        }
        const paginationInfo = {
            page,
            limit,
            total,
            totalPages,
        };
        return articles
    }
    static findArticle = async (id) => {

        const articles = await ArticleModel.findOne({ article_slug: id })
          
        if (!articles) {
            throw new BadRequestError('Article not found');
        }
        return articles
    }

    static createArticle = async (title, content, excerpt, image, draft, published) => {

        const articleExists = await ArticleModel.findOne({ title: title })
        if (articleExists) {
            throw new BadRequestError('Article already exists');
        }
        // Tạo bài viết và lưu vào cơ sở dữ liệu
        const article = await ArticleModel.create({
            title: title,
            article_slug: slugify(title, { lower: true }),
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

