import { AuthFailedError, BadRequestError, ForbiddenError } from '../core/error.response.mjs';
import User from '../models/User.mjs';
import { generateKeyPairSync } from "crypto"
import bcrypt from 'bcryptjs';
import { createTokenPair } from '../auth/authUtils.mjs';
import { KeyTokenService } from './keyToken.services.mjs';
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

        if (newUser) {//create prikey and pubkey

            const { privateKey, publicKey } = generateKeyPairSync('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem'
                }
            });

            const publicKeyString = await KeyTokenService.createKeyToken({
                userID: newUser._id.toString(),
                publicKey: publicKey.toString(),
                privateKey: privateKey.toString(),
                refreshToken: ""
            })

            if (!publicKeyString || publicKeyString == undefined) {
                return {
                    code: 'xxxx',
                    message: 'publicKeyString error'
                }
            }
            //create token pair 
            const tokens = await createTokenPair(
                {
                    userID: newUser._id, email
                },
                publicKeyString.toString(),
                privateKey.toString()
            )

            if (!tokens || tokens == undefined) {
                return {
                    code: 'xxxx',
                    message: 'tokens error'
                }
            }
            return {
                code: 201,
                metadata: {
                    user: newUser,
                }
            }
        }
    }

    static login = async (email, password) => {

        const foundUser = await User.findOne({ email }).lean()
        if (!foundUser) throw new BadRequestError(`User not Registered`)

        const match = await bcrypt.compare(password, foundUser.password)//2

        if (match == false || !match) throw new AuthFailedError(`Authentication Failed`)

        const { privateKey, publicKey } = generateKeyPairSync('rsa', {//3
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });

        const tokens = await createTokenPair(//4
            {
                userID: foundUser._id, email
            },
            publicKey, privateKey,
        )

        await KeyTokenService.createKeyToken({
            userID: foundUser._id,
            privateKey,
            publicKey,
            refreshToken: tokens.refreshToken
        })

        return {
            User: foundUser, tokens
        }

    }

    static logout = async (keyStore) => {
        const id = keyStore.headers['keyStore']?.toString() || ""

        await KeyTokenService.removeKeyById(id) // remove id from key store

        return {
            message: "logout success"
        }
    }

    static handlerRefreshToken = async ({ refreshToken, user, keyStore }) => {
        const { userID, email } = JSON.parse(user)
        const _KeyStore = JSON.parse(keyStore)

        if (_KeyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userID)
            throw new ForbiddenError('Something went wrong ! Please relogin')
        }

        if (_KeyStore.refreshToken !== refreshToken) {
            throw new AuthFailedError('User not Registered 1')
        }

        let select = {}
        const foundUser = await findByEmail({ email, select })
        if (!foundUser) throw new AuthFailedError('User not Registered 2')

        /*
            * create new token  
        */
        const tokens = await createTokenPair({ userID, email }, _KeyStore.publicKey, _KeyStore.privateKey)

        /*
            ? update token
        */

        await KeyTokenService.updateRefreshToken(
            { refreshToken: tokens.refreshToken, refreshTokensUsed: refreshToken, userID }
        )

        return {
            user: { userID, email },
            tokens
        }
    }
}

export const findByEmail = async ({ email, select = {
    email: 1, password: 2, name: 1, roles: 1
} }) => {
    return await User.findOne({ email }).select(select).lean()
}