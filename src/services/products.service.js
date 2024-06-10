const {ProductsDTO} = require('../dao/DTOs/products.dto')

class ProductsService {
    constructor(storage) {
        this.storage = storage
    }

    async getProducts(limit = null, page = 1, sort= null, queryField = null, queryContent = null){
        let results = await this.storage.getProducts(limit, page, sort, queryField, queryContent)

        const data = new ProductsDTO(limit, queryField, queryContent, sort, results).data
        
        return data;
    }

    async getProductById(pid){
        const product = await this.storage.getProductById(pid)
        if(product){
            return(product)
        }else{
            throw new Error("not found")
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock, category){
        //Validar que esten todos los datos y el stock y precio sean correctos
        const validStock = !isNaN(stock) || stock >= 0
        const validPrice = !isNaN(price) || price >= 0

        if(title && description && code && stock && category && validStock && validPrice){
            return await this.storage.addProduct(title, description, price, thumbnail, code, stock, category)
        }else{
            throw new Error("invalid data")
        }
    }

    async deleteProduct(id){
        //Controlar que el id sea valida antes de enviar la orden a la DB
        let validId = id.length == 24
        if(validId){
            return await this.storage.deleteProduct(id)
        }else{
            throw new Error("invalid data")
        }
    }

    async updateProduct(id, newValues){
        let invalidId = id.length != 24


    //Keys posibles a editar
      let validKeys = ["title", "description", "price", "thumbnail", "code", "stock"]
      //Keys a editar
      let newKeys = Object.keys(newValues) 

      //El id no puede ser modificado, por lo cual se controla que no se lo haga
      if(newKeys.includes("id") || invalidId){
        throw new Error('invalid data')
      }

      //Controlar que se modifiquen campos validos
      newKeys.forEach((key) => {
        if(!validKeys.includes(key)){
          throw new Error('invalid data')
        }
      })

      return await this.storage.updateProduct(id, newValues)
    }

    async getUser(userEmail){
      if(userEmail){
        return await this.storage.getUser(userEmail)
      }else{
        throw new Error('invalid data')
      }
    }
}

module.exports = {ProductsService}