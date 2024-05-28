import passport from 'passport';
import { SuccessResponse } from '../core/success.response.mjs';
import { AccessService } from '../services/access.services.mjs';

/*
    * create class of Controller Access
*/
export class AccessController { 
    static registerControlers = async (req, res, next) => {
        const { name, email, password, password2 } = req.body;
        new SuccessResponse({ // create new success response
            message: "Sign Up Success",
            metadata: await AccessService.register(name, email, password, password2) // service register
        }).send(res)
    }

    static loginControlers = async (req, res, next) => {
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
        // new SuccessResponse({// create new success response
        //     message: "login success"
        // }).send(res)
    }

    static logoutControlers = async (req, res, next) => {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            res.redirect('/users/login')
        });
        new SuccessResponse({// create new success response
            message: "login success"
        }).send(res)
    }
}
