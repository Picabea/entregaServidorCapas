const userDAO = require('../dao/factory').user
const documentDAO = require('../dao/factory').document
class UsersStorage{
    async getUserById(uid){
        return await userDAO.getUserById(uid)
    }

    async uploadDocuments(uid, id, dom, account){
        if(id){
            const document = await documentDAO.uploadDocument(id)
            const documentId = document._id.toString()
            await userDAO.updateUserIdStatus(uid)
            await userDAO.addDocument(uid, {documentId})
        }
        if(dom){
            const document = await documentDAO.uploadDocument(dom)
            const documentId = document._id.toString()
            await userDAO.updateUserDomStatus(uid)
            await userDAO.addDocument(uid, {documentId})
        }
        if(account){
            const document = await documentDAO.uploadDocument(account)
            const documentId = document._id.toString()
            await userDAO.updateUserAccountStatus(uid)
            await userDAO.addDocument(uid, {documentId})
        }
    }

    async premium(uid){
        return await userDAO.premium(uid)
    }
}

module.exports = { UsersStorage }