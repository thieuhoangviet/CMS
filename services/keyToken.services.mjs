import { keytokenModel } from "../models/keyToken.model.mjs"
import { Types } from "mongoose"

export class KeyTokenService {
    static findByUserID = async (userId) => {
        console.log(userId);
        return await keytokenModel.findOne({ user: new Types.ObjectId(userId) }).lean()
    }
    static createKeyToken = async ({ userID, publicKey, privateKey, refreshToken }) => {
        try {
            const update = {
                publicKey, privateKey, refreshTokenUsed: [], refreshToken
            }
            const filter = { user: userID }
            const options = { upsert: true, new: true }

            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null

        } catch (error) {
            return error
        }
    }
    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne({ _id: new Types.ObjectId(id) })
    }

    static findRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
    }

    static findRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshToken }).lean()
    }

    static deleteKeyById = async (userId) => {
        return await keytokenModel.deleteOne({ user: userId })
    }

    static updateRefreshToken = async ({ refreshToken, refreshTokensUsed, userID }) => {
        const filter = { user: new Types.ObjectId(userID) }
        const update = {
            $set: { refreshToken },
            $addToSet: { refreshTokensUsed }// was used to get new token
        }
        return await keytokenModel.updateOne(filter,update)
    }
}