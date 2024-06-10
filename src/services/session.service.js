class SessionService {
    constructor(storage) {
        this.storage = storage
    }

    async getUser(email){
        console.log(2)
        if(email){
            return await this.storage.getUser(email)
        }else{
            throw new Error('No email')
        }
    }

    async restorePassword(email, newPassword){
        return await this.storage.restorePassword(email, newPassword)
    }
}

module.exports = { SessionService }