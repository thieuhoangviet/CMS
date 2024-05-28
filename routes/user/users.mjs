import express from 'express';
import { AccessController } from '../../controllers/access.Controller.mjs';
const userRouter = express.Router();

// Xử lý đăng ký
userRouter
    .post('/register', AccessController.registerControlers)

    // Đăng nhập xử lý
    .post('/login', AccessController.loginControlers)

    // Đăng xuất
    .get('/logout', AccessController.logoutControlers);

export default userRouter;

