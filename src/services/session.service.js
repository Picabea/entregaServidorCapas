const { CustomError } = require("../errors/CustomError")
const { ErrorCodes } = require("../errors/errorCodes")

class SessionService {
    constructor(storage) {
        this.storage = storage
    }

    async getUser(email){
        console.log(2)
        if(email){
            return await this.storage.getUser(email)
        }else{
            throw CustomError.createError({
                name: 'Invalid Data',
                cause: 'Invalid Email',
                message: 'There is no users with that Email',
                code: ErrorCodes.INVALID_DATA_ERROR
            })
        }
    }

    async restorePassword(email, newPassword){
        return await this.storage.restorePassword(email, newPassword)
    }
}

module.exports = { SessionService }