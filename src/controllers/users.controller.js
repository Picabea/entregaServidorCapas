
class UsersController{
    constructor(productsService) {
        this.service = productsService
    }

    async premium(req, res){
        let uid = req.params.uid

        const user = await this.service.getUserById(uid)
        const results = await this.service.premium(user, uid)

        res.json(results)
    }

    async uploadDocuments(req, res){  
        const uid = req.params.uid

        const results = await this.service.uploadDocuments(uid, req.files)

        res.json({status: "success", payload: results})
    }

    async uploadFiles(req, res){
        const {_id} = req.session.user
        const user = await this.service.getUserById(_id)
        const { id_loaded, dom_loaded, account_loaded } = user
        const allLoaded = id_loaded && dom_loaded && account_loaded
        console.log(allLoaded)
        res.render('uploadFiles', {
            _id,
            allLoaded,
            id_loaded,
            dom_loaded,
            account_loaded
        })
    }
}

module.exports = { UsersController }