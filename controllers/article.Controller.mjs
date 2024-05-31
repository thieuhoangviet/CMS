
import { SuccessResponse, CREATED } from '../core/success.response.mjs';
import { ArticleService } from '../services/article.services.mjs';

export class Article {
    static updateArticle = async (req, res) => {
        new SuccessResponse({// create new success response
            message: "update success",
            metadata: await ArticleService.updateArticle(req)
        }).send(res)
    }

    static deleteArticle = async (req, res) => {
        new SuccessResponse({// create new success response
            message: "update success",
            metadata: await ArticleService.deleteArticle(req.params.id)
        }).send(res)
    }

    static getArticleAll = async (req, res) => {
        new SuccessResponse({// create new success response
            message: " SuccessFull ",
            metadata: await ArticleService.getArticle(req)
        }).send(res)
    }

    static findArticle = async (req, res) => {
        const id = req.params.id
        new SuccessResponse({// create new success response
            message: " SuccessFull ",
            metadata: await ArticleService.getArticle(id)
        }).send(res)
    }

    static createArticles = async (req, res) => {
        const {title, content, excerpt, image, draft, published } = req.body;
        new CREATED({// create new success response
            message: "update success",
            metadata: await ArticleService.createArticle(title, content, excerpt, image, draft, published)
        }).send(res)
    }
}








