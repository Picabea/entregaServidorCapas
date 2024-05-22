const UserModel = require('../dao/models/user.model')

class ViewsStorage{
    async getUser(id){
        return UserModel.findById(id)
    }
}

module.exports = { ViewsStorage }