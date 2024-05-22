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
}

module.exports = { CartsService }