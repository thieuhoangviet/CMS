import { CREATED, SuccessResponse } from '../core/success.response.mjs';// ham dung de thong bao thanh cong.....
import { AccessService } from '../services/access.services.mjs';

/*
    * create class of Controller Access
*/
export class AccessController {
    static registerControlers = async (req, res, next) => {
        const { name, email, password, password1 } = req.body;
        new CREATED({ // create new success response 
            message: "Sign Up Success",
            metadata: await AccessService.register(name, email, password, password1) // service register
        }).send(res)
    }

    static loginControlers = async (req, res, next) => {
        await AccessService.login(req, res, next)
        new SuccessResponse({// create new success response
            message: "login success"
        }).send(res)
    }

    static logoutControlers = async (req, res, next) => {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            res.redirect('/users/login')
        });
        new SuccessResponse({// create new success response
            message: "logout success"
        }).send(res)
    }
}
