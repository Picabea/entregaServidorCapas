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

    async purchase(req, res){
        try{
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
        }catch(err){
            res.send(`Error: ${err.message}`)
        }
    }
}

module.exports = { CartsController }