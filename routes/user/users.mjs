import express from 'express';
import { AccessController } from '../../controllers/access.Controller.mjs';
import { asyncHandler } from '../../helpers/asyncHandler.mjs';
import { authentication } from '../../auth/authUtils.mjs';
const userRouter = express.Router();

// Xử lý đăng ký
userRouter
    .post('/register',asyncHandler(AccessController.registerControlers) )// ayncHandler giup bao loi~ khong bi crash ung dung

    // Đăng nhập xử lý
    .post('/login', asyncHandler(AccessController.loginControlers))
    
    userRouter.use(authentication)
    // Đăng xuất1`
    .post('/logout', asyncHandler(AccessController.logoutControlers))

    .post('/handlerRefreshToken',asyncHandler(AccessController.handlerRefreshToken))

export default userRouter;

