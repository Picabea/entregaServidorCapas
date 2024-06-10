class CartsService {
    constructor(storage) {
        this.storage = storage
    }

    async getCartById(cid){
        if(cid){
            return await this.storage.getCartById(cid)
        }else{
            throw new Error('invalid data')
        }
    }

    async createCart(products){
        return await this.storage.createCart(products)
    }

    async addProductToCart(cid, pid, quantity){
        return await this.storage.addProductToCart(cid, pid, quantity)
    }

    async deleteProductFromCart(cid, pid){
        return await this.storage.deleteProductFromCart(cid, pid)
    }

    async deleteProductsFromCart(cid){
        return await this.storage.deleteProductsFromCart(cid)
    }

    async updateProductsFromCart(cid, products){
        return await this.storage.updateProductsFromCart(cid, products)
    }

    async updateProductQuantity(cid, pid, newQuantity){
        if(!newQuantity){
            throw new Error('invalid data')
        }
        return await this.storage.updateProductQuantity(cid, pid, newQuantity)
    }

    async getUser(email){
        return await this.storage.getUser(email)
    }

    async getProductStock(pid){
        return await this.storage.getProductStock(pid)
    }

    async buyProduct(pid, newQuantity){
        return await this.storage.buyProduct(pid, newQuantity)
    }

    async createTicket(total, userEmail){
        if(total <= 0){
            throw new Error("Total invalido")
        }
        const date = Date.now()
        const code = date * total
        return await this.storage.createTicket(code, date, total, userEmail)
    }

    async updateProductsFromCart(cid, unboughtProducts){
        return await this.storage.updateProductsFromCart(cid, unboughtProducts)
    }
}

module.exports = { CartsService }