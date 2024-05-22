class ViewsService {
    constructor(storage) {
        this.storage = storage
    }

    async getUser(id){
        return await this.storage.getUser(id)
    }

}

module.exports = { ViewsService }