class ProductsController{
    constructor(productsService) {
        this.service = productsService
    }

    #handleError(res, err) {
        console.log(err)
        if (err.message === 'not found') {
            return res.status(404).json({ error: 'Not found' })
        }

        if (err.message === 'invalid data') {
            return res.status(400).json({ error: 'Invalid data' })
        }

        return res.status(500).json({ error: err })
    }

    async getProducts(req, res){
        const userEmail = req.session.user.email
        let user = await this.service.getUser(userEmail)
        let limit = req.query.limit
        ?req.query.limit
        :10
        let page = req.query.page
        let sort = req.query.sort
        let queryField = req.query.queryfield
        let queryContent = req.query.querycontent
        let response = await this.service.getProducts(limit, page, sort, queryField, queryContent)
        let isUser = user.role === 'user'
        let isAdmin = user.role === 'admin'

        res.render('home', {
            user,
            response,
            isUser,
            isAdmin,
            cid: user.cart._id,
            scripts: [
                'products.js'
            ],
            useWS: true,
        })
    }

    async getProductById(req, res){
        let productId = req.params.pid
        try{
            let product = await this.service.getProductById(productId)
            res.send(product)
        }catch(err){
            this.#handleError(res, err)
        }
    }

    async addProduct(req, res){
        const info = req.body
        const { title, description, price, thumbnail, code, stock, category } = info

        const result = await this.service.addProduct(title, description, price, thumbnail, code, stock, category)
        res.send({product: result})
    }

    async deleteProduct(req, res){
        const pid = req.params.pid
        const result = await this.service.deleteProduct(pid)
        console.log(result)
        res.status(200).send(result)
    }

    async updateProduct(req, res){
        let id = req.params.pid
        const result = await this.service.updateProduct(id, req.body)
        res.send({acknowledged: result.acknowledged, modifiedCount: result.modifiedCount})
    }

    async mockingProducts(_, res){
        await this.service.mockingProducts()
        res.status(200).send('success')
    }
}

module.exports = {ProductsController}