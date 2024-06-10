const ProductModel = require('./models/product.model')

class ProductDAO {
  constructor(){}
    async addProduct(title, description, price, thumbnail, code, stock, category){
        try{
          return(await ProductModel.create({
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status: true,
            category
          }))
        }catch(err){
          return(err)
        }
    }

    async getProducts(limit = null, page = 1, sort= null, queryField = null, queryContent = null){
        
        let query = {}
  
        if(queryField){
          if(queryField === "category"){
            let validContent = ["gaseosas", "electrodomestico", "comestible"].includes(queryContent)
            if(validContent){
              query = {
                category: queryContent
              }
            }else{
              throw new Error("Contenido de la query invalido")
            }
          }else if(queryField === "disponible"){
            let validContent = !isNaN(queryContent) && queryContent >= 1
  
            if(validContent){
              query = {
                stock: {
                  $gt: Number(queryContent)
                }
              }
            }else{
              throw new Error("Contenido de la query invalido")
            }
          }else{
            throw new Error("Ese campo no se puede filtrar")
          }
        }
  
        const aggregations = [
          {
            $match: query
          }
        ]
  
        const paginateOptions = {
          limit,
          page
        }
  
        let sortingOrder = null
        if(sort === "asc"){
          sortingOrder = 1
        }else if(sort === "desc"){
          sortingOrder = -1
        }

        if(sortingOrder){
          paginateOptions.sort = {price: sort}
        }
        
      
      const aggregatedResults = ProductModel.aggregate(aggregations)
      
      const results = await ProductModel.aggregatePaginate(aggregatedResults, paginateOptions,
      (err, results) => {
        if(err) {
          console.error(err);
        }else {
          return results
        }
      })
      return results
    }

    async getProductById(pid){
        return await ProductModel.findById(pid)
    }

    async deleteProduct(id){
        return await ProductModel.deleteOne({_id: id})
    }

    async updateProduct(id, newValues){
        return await ProductModel.updateOne({ _id: id}, {...newValues})
    }

    async buyProduct(pid, newQuantity){
      return await ProductModel.updateOne({_id: pid}, {stock: newQuantity})
    }
}

module.exports = ProductDAO