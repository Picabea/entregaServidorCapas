class CartsController{
    constructor(productsService) {
        this.service = productsService
    }

    async getCartById(req, res){
        const cid = req.params.cid
        try{
            const response = await this.service.getCartById(cid)
            console.log(response)
            res.render("cart",{products: response.products})
        }catch(error){
            res.json({error})
        }
    }

    async createCart(req, res){
        const products = req.body
        console.log(products)
        try{
            if(products.length >= 1){
                res.send(await this.service.createCart(products))
            }else{
                res.send(await this.service.createCart([]))
            }
        }catch(error){
            res.json({error})
        }
    }

    async addProductToCart(req, res){
        const cid = req.params.cid
        const pid = req.params.pid
        const quantity = req.body.quantity

        try{
            const response = await this.service.addProductToCart(cid, pid, quantity)
            res.send(response)
        }catch(error){
            res.json({error})
        }
    }

    async deleteProductFromCart(req, res){
        const cid = req.params.cid
        const pid = req.params.pid

        try{
            const result = await this.service.deleteProductFromCart(cid, pid)
            res.status(200).json(result)
        }catch(err){
            res.status(400).send(err)
        }
    }

    async deleteProductsFromCart(req, res){
        const cid = req.params.cid
        try{
            const result = await this.service.deleteProductsFromCart(cid)
            res.status(200).json(result)
        }catch(err){
            res.status(400).json(err)
        }
    }

    async updateProductsFromCart(req, res){
        const cid = req.params.cid
        const products = req.body

        try{
            const result = await this.service.updateProductsFromCart(cid, products)
            res.status(200).json(result)
        }catch(err){
            res.status(400).send(err)
        }
    }

    async updateProductQuantity(req, res){
        const cid = req.params.cid
        const pid = req.params.pid

        const newQuantity = req.body["newQuantity"]

        try{
            const result = await this.service.updateProductQuantity(cid, pid, newQuantity)
            
            res.json(result)
        }catch(err){
            res.json(err)
        }
    }
}

module.exports = { CartsController }