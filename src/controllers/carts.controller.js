class CartsController{
    constructor(productsService) {
        this.service = productsService
    }

    async getCartById(req, res){
        const cid = req.params.cid
        const response = await this.service.getCartById(cid)
        res.send(response)
    }

    async createCart(req, res){
        const products = req.body
        console.log(products)
        if(products.length >= 1){
            res.send(await this.service.createCart(products))
        }else{
            res.send(await this.service.createCart([]))
        }
    }

    async addProductToCart(req, res){
        const cid = req.params.cid
        const pid = req.params.pid
        const quantity = req.body.quantity

        const response = await this.service.addProductToCart(cid, pid, quantity)
        res.send(response)
    }

    async deleteProductFromCart(req, res){
        const cid = req.params.cid
        const pid = req.params.pid

        const result = await this.service.deleteProductFromCart(cid, pid)
        res.status(200).json(result)
    }

    async deleteProductsFromCart(req, res){
        const cid = req.params.cid

        const result = await this.service.deleteProductsFromCart(cid)
        res.status(200).json(result)
    }

    async updateProductsFromCart(req, res){
        const cid = req.params.cid
        const products = req.body

        const result = await this.service.updateProductsFromCart(cid, products)
        res.status(200).json(result)
    }

    async updateProductQuantity(req, res){
        const cid = req.params.cid
        const pid = req.params.pid

        const newQuantity = req.body["newQuantity"]

        const result = await this.service.updateProductQuantity(cid, pid, newQuantity)
        
        res.json(result)
    }

    async purchase(req, res){
            const userEmail = req.session.user.email
            const user = await this.service.getUser(userEmail)
            const cart = await this.service.getCartById(user.cart._id.toString())
            
            let boughtProducts = []
            let unboughtProducts = []
            let unboughtResponse = []

            let total = 0
            console.log(cart.products)
            if(cart.products.length > 0){
                cart.products.forEach(async product => {
                    console.log(product)
                    const stock = product.productId.stock
                    const quantity = product.quantity
                    const hasStock = stock - quantity >= 0
                    console.log(`stock: ${stock}`)
                    console.log(`Quantity: ${quantity}`)
                    console.log(hasStock)
        
                    if(hasStock){
                        this.service.buyProduct(product.productId._id, stock - quantity)
                        boughtProducts.push({
                            pid: product.productId._id,
                            quantity
                        })
                        total = total + (product.productId.price * quantity)
                    }else{
                        unboughtProducts.push({
                            productId: product.productId._id,
                            quantity
                        })
                        unboughtResponse.push(product.productId)
                    }
                })
            }else{
                res.json({error: 'El carrito debe tener productos'})
            }

            console.log(total)
            console.log(unboughtProducts)
            console.log(boughtProducts)
        
            const result = await this.service.createTicket(total, userEmail)
            await this.service.updateProductsFromCart(user.cart._id.toString(), unboughtProducts)
            res.json({result, unboughtResponse})
    }
}

module.exports = { CartsController }