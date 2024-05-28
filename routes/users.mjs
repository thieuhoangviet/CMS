import express from 'express';
import User from '../models/User.mjs'; // Sử dụng ES6 module
import passport from 'passport';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Đăng nhập
router.get('/login', (req, res) => res.render('index', {
    showVerification: false,
    showRegistration: true,
    success_msg: req.flash('success_msg'),
    error_msg: req.flash('error_msg')
}));

// Đăng nhập xử lý
router.post('/login', (req, res, next) => {
    let errors = [];
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            errors.push('Thông tin đăng nhập không chính xác');
            req.flash('error_msg', 'Thông tin đăng nhập không chính xác');
            res.status(409).json({ errors });
            return res.redirect('/users/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success_msg', 'Chào mừng bạn đến với chúng tôi');
            return res.redirect('/dashboard');
        });
    })(req, res, next);
});

// Đăng ký
router.get('/register', (req, res) => res.render('index', {
    showVerification: false,
    showRegistration: true,
    success_msg: req.flash('success_msg'),
    error_msg: req.flash('error_msg')
}));



const passwordRegex = /^.{8,}$/;

// Xử lý đăng ký
router.post('/register', async (req, res, next) => {
    let errors = [];
    let success = []
    const { name, email, password, password2, role } = req.body;

    // Check required fields
    if (!name || !email || !password || !password2) {
        errors.push('Vui lòng điền vào tất cả các trường');
        return res.status(409).json({ errors });
    }

    if (email === "admin@gmail.com") {
        errors.push("Email này không được phép đăng ký")
        return res.status(409).json({ errors });
    }

    // Check passwords match
    if (password !== password2) {
        errors.push('Mật khẩu không khớp');
        return res.status(409).json({ errors });
    }

    // Check pass length
    if (!passwordRegex.test(password)) {
        errors.push('Mật khẩu phải có ít nhất 8 ký tự');
        return res.status(409).json({ errors });
    }

    if (errors.length > 0) {
        res.render('index', {
            errors,
            name,
            email,
            password,
            password2,
            showRegistration: true
        });
    } else {
        try {
            const user = await User.findOne({ email, name });

            if (user) {
                errors.push('Email hoặc tên đã được đăng ký');
                return res.status(409).json({ errors });
            }
            const newUser = new User({
                name,
                email,
                password,
                role: role || 'user',
                emailVerified: true
            });

            // Hash Password
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(newUser.password, salt);
            newUser.password = hash;

            await newUser.save();

            success.push('success_msg', 'Tài khoản đã được tạo. Bạn có thể đăng nhập')
            res.status(200).json({ success });
            res.redirect('/login')
        } catch (error) {
            console.log(error);
        }
    }
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
