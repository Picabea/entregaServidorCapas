const userDAO = require('../dao/factory').user

class SessionStorage{
    async getUser(email){
        console.log(3)
        return await userDAO.getUser(email)
    }

    async restorePassword(email, newPassword){
        return await userDAO.restorePassword(email, newPassword)
    }
}

module.exports = { SessionStorage }