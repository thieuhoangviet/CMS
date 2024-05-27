import { body } from 'express-validator';

const updateArticleValidator = [
  body('title').notEmpty().withMessage('Tiêu đề là bắt buộc'),
  body('content').notEmpty().withMessage('Content là bắt buộc'),
  body('published_at').if(body('published').equals(true)).notEmpty().withMessage('published_at phải được cung cấp khi published là true'),
];

export default updateArticleValidator;