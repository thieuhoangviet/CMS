import { AuthFailedError, NotFoundError } from "../core/error.response.mjs"
import { asyncHandler } from "../helpers/asyncHandler.mjs"
import jwt from "jsonwebtoken"
import { KeyTokenService } from "../services/keyToken.services.mjs"

const HEADER = {
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: "x-rtoken-id",
    keyStore: 'keyStore',
    user: 'user'
}

export const createTokenPair = async (payload, publicKey, privateKey) => {

    // accesstoken 
    const accessToken = await jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '2h'
    })

    // refreshtoken 
    const refreshToken = await jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '12h'
    })

    jwt.verify(accessToken, publicKey, (err, decode) => {
        if (err)
            console.log(`error verify`, err)
        else
            console.log(`decode verify`, decode)
    })
    return { accessToken, refreshToken }
}

export const authentication = asyncHandler(async (req, res, next) => {
    /*
        3 - verify Token
        4 - check user in db 
        5 - check keyStore with this userId
        6 - ok all  => return next()
    */
   //#1
    const userIdREQ = req.headers[HEADER.CLIENT_ID]?.toString()
    if (!userIdREQ || "") throw new AuthFailedError('invalid Request')
    //#2
    const keyStore = await KeyTokenService.findByUserID(userIdREQ)

    if (!keyStore || "") throw new NotFoundError('Not found keystore')
    //#3
    const refreshToken = req.headers[HEADER.REFRESHTOKEN]?.toString()

    if (refreshToken) {
        try {
            const DecodeUser = jwt.verify(refreshToken, keyStore.privateKey)
            console.log("4",DecodeUser);

            if (userIdREQ !== DecodeUser.userID) throw new AuthFailedError('invalid userId')//#5

            req.headers[HEADER.keyStore] = JSON.stringify(keyStore)
            req.headers[HEADER.REFRESHTOKEN] = refreshToken
            req.headers[HEADER.user] = JSON.stringify(DecodeUser)

            return next()//#6
        } catch (error) {
            throw error
        }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString()
    console.log("5",accessToken);
    if (!accessToken || "") throw new AuthFailedError('invalid Request')

    try {//#4
        const User = jwt.verify(accessToken, keyStore.publicKey)

        if (userIdREQ !== User.userID) throw new AuthFailedError('invalid userId')//#5

        req.headers[HEADER.keyStore] = keyStore?._id
        return next()//#6
    } catch (error) {
        throw error
    }

})

export const verifyJWT = async (token, keySecret) => {
    return await jwt.verify(token, keySecret)
}