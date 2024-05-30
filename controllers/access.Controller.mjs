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
        const { email, password } = req.body;
        new SuccessResponse({// create new success response
            message: "login success",
            metadata: await AccessService.login(email, password)
        }).send(res)
    }

    static logoutControlers = async (req, res, next) => {
        new SuccessResponse({// create new success response
            message: "logout success",
            metadata: await AccessService.logout(req)
        }).send(res)
    }

    static handlerRefreshToken = async (req, res, next) => {
        new SuccessResponse({// create new success response
            message: "handler refresh token success",
            metadata: await AccessService.handlerRefreshToken({
                refreshToken: req.headers['x-rtoken-id'],
                user: req.headers.user,
                keyStore: req.headers.keyStore
            })
        }).send(res)
    }
}
