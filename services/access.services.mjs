import { BadRequestError, ForbiddenError } from '../core/error.response.mjs';
import User from '../models/User.mjs';
import passport from 'passport';
import bcrypt from 'bcryptjs';
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

export class AccessService {
    static register = async (name, email, password, password1) => {
        // Check required fields
        if (!name || !email || !password || !password1) {
            throw new BadRequestError('Vui lòng điền vào tất cả các trường');
        }

        if (email === "admin@gmail.com") {
            throw new BadRequestError("Email này không được phép đăng ký")
        }

        // Check passwords match
        if (password !== password1) {
            throw new BadRequestError('Mật khẩu không khớp');
        }

        // Check pass length
        if (!passwordRegex.test(password)) {
            throw new BadRequestError('Mật khẩu phải có ít nhất 8 ký tự và bao gồm ít nhất một chữ hoa, một chữ thường, một số, và một ký tự đặc biệt');
        }

        const user = await User.findOne({ email, name });

        if (user) {
            throw new BadRequestError('Email hoặc tên đã được đăng ký');
        }
        const newUser = new User({
            name,
            email,
            password,
            role: 'user',
            emailVerified: true
        });

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newUser.password, salt);
        newUser.password = hash;

        await newUser.save();

        return {
            newUser
        }
    }

    static login = async (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            console.log(err, user, info);
            if (info) {
                throw new BadRequestError(info.message);
            }
            if (err) {
                throw new BadRequestError(err);
            }
            if (!user) {
                throw new BadRequestError('Thông tin đăng nhập không chính xác')
            }
            res.redirect('/')
        })(req, res, next)
    }
}