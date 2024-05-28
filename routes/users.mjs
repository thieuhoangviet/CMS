import express from 'express';
import User from '../models/User.mjs'; // Sử dụng ES6 module
import passport from 'passport';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

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
            return res.status(409).json({ errors });
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

// Tạo một đối tượng transporter sử dụng SMTP transport mặc định
let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
        user: 'thieuhoangviet63@gmail.com', // Email của bạn
        pass: 'xuwfvjobnbybmhps' // Mật khẩu email của bạn
    }
});

const passwordRegex = /^.{8,}$/;

// Xử lý đăng ký
router.post('/register', async (req, res, next) => {
    let errors = [];
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

            req.flash('success_msg', 'Tài khoản đã được tạo. Bạn có thể đăng nhập')
            res.redirect('/login')
        } catch (error) {
            console.log(error);
        }
    }
});

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

// // Đăng nhập xử lý
// router.post('/login', (req, res, next) => {
//     passport.authenticate('local', {
//         successRedirect: '/dashboard',
//         failureRedirect: '/users/login',
//         failureFlash: true,
//         success_msg: "Chào mừng bạn đến với chúng tôi"
//     })(req, res, next);
// });

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


// const express = require('express');
// const router = express.Router();
// const User = require('../models/User.mjs');
// const passport = require('passport');
// const bcrypt = require('bcryptjs');
// const nodemailer = require('nodemailer');

// // Đăng nhập
// router.get('/login', (req, res) => res.render('index', {
//     showVerification: false,
//     showRegistration: true,
//     success_msg: req.flash('success_msg'),
//     error_msg: req.flash('error_msg')
// }));

// // Đăng ký
// router.get('/register', (req, res) => res.render('index', {
//     showVerification: false,
//     showRegistration: true,
//     success_msg: req.flash('success_msg'),
//     error_msg: req.flash('error_msg')
// }));

// // Tạo một đối tượng transporter sử dụng SMTP transport mặc định
// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     secure: true,
//     auth: {
//         user: 'thieuhoangviet63@gmail.com', // Email của bạn
//         pass: 'xuwfvjobnbybmhps' // Mật khẩu email của bạn
//     }
// });
// const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
// // Xử lý đăng ký
// router.post('/register', (req, res, next) => {
//     let errors = [];
//     const { name, email, password, password2, role } = req.body;


//     // Check required fields
//     if (!name || !email || !password || !password2) {
//         errors.push('Vui lòng điền vào tất cả các trường');
//     }

//     if (email === "admin@gmail.com") {
//         errors.push("Email này không được phép đăng ký")
//     }

//     // Check passwords match
//     if (password !== password2) {
//         errors.push('Mật khẩu không khớp');
//     }

//     // Check pass length
//     if (!passwordRegex.test(password)) {
//         errors.push('Mật khẩu phải có ít nhất 8 ký tự và bao gồm ít nhất một chữ hoa, một chữ thường, một số, và một ký tự đặc biệt');
//     }

//     if (errors.length > 0) {
//         res.render('index', {
//             errors,
//             name,
//             email,
//             password,
//             password2,
//             showRegistration: true
//         });
//     } else {
//         User.findOne({ email: email, name: name }).then(user => {
// if (user) {
//     errors.push('Email hoặc Doanh nghiệp đã được đăng ký');
//                 res.render('index', {
//                     showVerification: true,
//                     errors,
//                     name,
//                     email,
//                     password,
//                     password2,
//                     showRegistration: true
//                 });
//             } else {

//                 const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Tạo mã xác thực
//                 const newUser = new User({
//                     name,
//                     email,
//                     password,
//                     role: role || 'user',
//                     verificationCode,
//                     emailVerified: false
//                 });

//                 // Hash Password
//                 bcrypt.genSalt(10, (err, salt) =>
//                     bcrypt.hash(newUser.password, salt, (err, hash) => {
//                         if (err) throw err;
//                         // Set password to hashed
//                         newUser.password = hash;
//                         // Save user
//                         newUser.save()
//                             .then(user => {
//                                 // Gửi email xác thực
//                                 let mailOptions = {
//                                     from: 'thieuhoangviet63@gmail.com',
//                                     to: user.email,
//                                     subject: 'Xác Thực Email',
//                                     text: `Mã xác thực của bạn là ${verificationCode}`
//                                 };
//                                 transporter.sendMail(mailOptions, (error, info) => {
//                                     if (error) {
//                                         console.log(error);
//                                         res.redirect('/users/register');
//                                     } else {
//                                         req.flash('success_msg', 'Vui lòng kiểm tra email để nhận mã xác thực.');
//                                         res.redirect('/users/verify?email=' + user.email)
//                                     }
//                                 });
//                             }).catch(err => console.log(err));
//                     }));
//             }
//         });
//     }
// });

// // Đường dẫn xác thực
// router.get('/verify', (req, res) => {
//     // res.send('hello')
//     const email = req.query.email
//     res.render('verify', { email });
// });

// router.post('/verify', (req, res) => {
//     User.findOne({ email: req.body.email }).then(user => {
//         if (user && user.verificationCode === req.body.verificationCode) {
//             user.emailVerified = true;
//             user.save().then(() => {
//                 res.render('index', { email: user.email, message: 'Email đã được xác thực. Bạn có thể đăng nhập.' });
//             });
//         } else {
//             res.render('verify', { email: user.email, message: 'Mã xác thực không đúng' });
//         }
//     });
// });

// // Đăng nhập xử lý
// router.post('/login', (req, res, next) => {
//     passport.authenticate('local', {
//         successRedirect: '/dashboard',
//         failureRedirect: '/users/login',
//         failureFlash: true,
//         success_msg: "Chào mừng bạn đến với chúng tôi"
//     })(req, res, next);
// });

// // Đăng xuất
// router.get('/logout', (req, res) => {
//     req.logout(function (err) {
//         if (err) {
//             return next(err);
//         }
//         res.redirect('/users/login');
//     });


// });

// module.exports = router;
