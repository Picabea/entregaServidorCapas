const UserModel = require('./models/user.model')
const { hashPassword } = require('../../utils/hashing')

class UserDAO {
    constructor(){}
    async getUser(userEmail){
        return await UserModel.findOne({email: userEmail}).lean()
    }

    async restorePassword(email, newPassword){
        return await UserModel.findOneAndUpdate({email}, {password: hashPassword(newPassword)})
    }

    async getUserById(id){
        return await UserModel.findById(id)
    }

    async restorePassword(email, newPassword){
        return await UserModel.findOneAndUpdate({email}, {password: hashPassword(newPassword)})
    }
}

module.exports = UserDAO