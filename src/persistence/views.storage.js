const userDao = require('../dao/factory').user

class ViewsStorage{
    async getUser(id){
        return await userDao.getUserById(id)
    }
}

module.exports = { ViewsStorage }