const UserModel = require('../dao/models/user.model')
const { hashPassword } = require('../utils/hashing')


class SessionStorage{
    async getUser(email){
        return await UserModel.findOne({email}).lean()
    }

    async restorePassword(email, newPassword){
        return await UserModel.findOneAndUpdate({email}, {password: hashPassword(newPassword)})
    }
}

module.exports = { SessionStorage }