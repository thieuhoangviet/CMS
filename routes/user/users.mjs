import express from 'express';
import { AccessController } from '../../controllers/access.Controller.mjs';
import { asyncHandler } from '../../helpers/asyncHandler.mjs';
const userRouter = express.Router();

// Xử lý đăng ký
userRouter
    .post('/register',asyncHandler(AccessController.registerControlers) )// ayncHandler giup bao loi~ khong bi crash ung dung

    // Đăng nhập xử lý
    .post('/login', asyncHandler(AccessController.loginControlers))

    // Đăng xuất1`
    .get('/logout', asyncHandler(AccessController.logoutControlers));

export default userRouter;

