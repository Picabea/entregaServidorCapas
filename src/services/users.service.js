const { CustomError } = require("../errors/CustomError")
const { ErrorCodes } = require("../errors/errorCodes")

class UsersService {
    constructor(storage) {
        this.storage = storage
    }

    async getUserById(uid){
        const user = await this.storage.getUserById(uid)
        return user
    }

    async premium(user, uid){
        if(user.id_loaded && user.dom_loaded && user.account_loaded){
            return await this.storage.premium(uid)
        }else{
            throw CustomError.createError({
                name: 'Uncomplete documentation',
                cause: 'Debes subir toda la documentacion para poder ser premium',
                message: 'Falta documentacion',
                code: ErrorCodes.UNCOMPLETE_DOCUMENTATION
            })
        }
    }

    async uploadDocuments(uid, files){
        let id = false
        let dom = false
        let account = false
        console.log(files)
        if(files.id){
            id = {name: files.id[0].originalname, reference: files.id[0].path}
        }
        if(files.dom){
            dom = {name: files.dom[0].originalname, reference: files.dom[0].path}
        }
        if(files.account){
            account = {name: files.account[0].originalname, reference: files.account[0].path}
        }
        console.log(id)
        console.log(dom)
        console.log(account)

        await this.storage.uploadDocuments(uid, id, dom, account)
        const user = await this.getUserById(uid)
        return {id: user.id_loaded, dom: user.dom_loaded, account: user.account_loaded}
    }
}

module.exports = { UsersService }