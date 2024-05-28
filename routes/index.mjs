import express from 'express';
import userRouter from "./user/users.mjs";
import articleRouter from "./article/article.mjs";
/*
    * create Route index contain user routes and article routes
*/
const router = express.Router();

router.use('/users', userRouter);
router.use('/article', articleRouter);

export default router