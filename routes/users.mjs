import express from 'express';
import User from '../models/User.mjs'; // Sử dụng ES6 module
import passport from 'passport';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { loginControlers } from '../controllers/access.Controller.mjs';
const router = express.Router();

// Đăng nhập
router.get('/login', (req, res) => res.render('index', {
    showVerification: false,
    showRegistration: true,
    success_msg: req.flash('success_msg'),
    error_msg: req.flash('error_msg')
}));

// Đăng ký
router.get('/register', (req, res) => res.render('index', {
    showVerification: false,
    showRegistration: true,
    success_msg: req.flash('success_msg'),
    error_msg: req.flash('error_msg')
}));

// Tạo một đối tượng transporter sử dụng SMTP transport mặc định
let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
        user: 'thieuhoangviet63@gmail.com', // Email của bạn
        pass: 'xuwfvjobnbybmhps' // Mật khẩu email của bạn
    }
});

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

// Xử lý đăng ký
router.post('/register', loginControlers);

// Đường dẫn xác thực
router.get('/verify', (req, res) => {
    const email = req.query.email;
    res.render('verify', { email });
});

router.post('/verify', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (user && user.verificationCode === req.body.verificationCode) {
            user.emailVerified = true;
            await user.save();
            return res.render('index', { email: user.email, message: 'Email đã được xác thực. Bạn có thể đăng nhập.' });
        } else {
            return res.render('verify', { email: user.email, message: 'Mã xác thực không đúng' });
        }
    } catch (error) {
        console.log(error);
    }
});

// Đăng nhập xử lý
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true,
        success_msg: "Chào mừng bạn đến với chúng tôi"
    })(req, res, next);
});

// Đăng xuất
router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/users/login');
    });
});

export default router;

