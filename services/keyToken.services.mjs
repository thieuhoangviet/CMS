import { keytokenModel } from "../models/keyToken.model.mjs"
import { Types } from "mongoose"

export class KeyTokenService {
    static findByUserID = async (userId) => {
        return await keytokenModel.findOne({ user: Types.ObjectId(userId) }).lean()
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
}