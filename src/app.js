const express = require('express')
const handlebars = require('express-handlebars')

const DAOs = require('./dao/factory.js')

const { ProductsStorage } = require('./persistence/products.storage.js')
const { ViewsStorage } = require('./persistence/views.storage.js')
const { SessionStorage } = require('./persistence/session.storage.js')
const { CartsStorage } = require('./persistence/carts.storage.js')

const {errorHandler} = require('./middlewares/errorHandler.js')

const config = require('./config.js')

const sessionMiddleware = require('./session/mongoStorage.js')

const {addLogger} = require('./utils/logger.js')

//recursos necesarios de passport
const passport = require('passport')
const initializeStrategy = require('./config/passport.config.js')
const initializeGithubStrategy = require('./config/passport-github.config.js')

const routes = [
    require('./routes/products.router'),
    require('./routes/session.router.js'),
    require('./routes/views.router.js'),
    require('./routes/carts.router.js'),
    require('./routes/transport.router.js')
]

const { Server } = require('socket.io')

const mongoose = require('mongoose')

const app = express()

//Configuracion de swagger
const swaggerJSDoc = require('swagger-jsdoc')
const { serve, setup } = require('swagger-ui-express')

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: "Documentacion del poder y del saber",
            description: "API pensada para clase swager"
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}
const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', serve, setup(specs))

//Se configura el usoi de sesiones
app.use(sessionMiddleware)

//Inicializacion de passport
initializeGithubStrategy()
initializeStrategy()
app.use(passport.initialize())
app.use(passport.session())

//Se configura el logger
app.use(addLogger)

//config handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')
app.use(express.static(`${__dirname}/../public`))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('products.storage', new ProductsStorage())
app.set('views.storage', new ViewsStorage())
app.set('session.storage', new SessionStorage())
app.set('carts.storage', new CartsStorage())


for (const route of routes) {
    route.configure(app)
}

app.use(errorHandler)

const main = async () => {
    //Inicializar mongo y prender servidor

    await mongoose.connect(config.MONGO_URI,{
        dbName: 'ecommerce'
    })

    const httpServer = app.listen(8080, () => {
        console.log('server listo')
    })  

    
    const wsServer = new Server(httpServer)

    wsServer.on("connection", (socket) => {

        socket.on("delete", (productId) => {
            productManager.deleteProduct(productId)
            .then((res) => {
                console.log(res)
                DAOs.product.getProducts()
                .then((products) => wsServer.emit("products", products))
            })
            
        })
    
        socket.on("add", (product) => {
            const { title, description, price, thumbnail, code, stock, category } = product
            console.log(hola)
            DAOs.product.addProduct(title, description, price, thumbnail, code, stock, category)
            .then((res) => console.log(res))
            DAOs.product.getProducts()
            .then((products) => wsServer.emit("products", products))
        })

        socket.on("addProductToCart", (data) => {
            try{
                DAOs.cart.addProductToCart(data.cid, data.pid, 1)
                .then(res => socket.emit("resultAddProductToCart", res))
            }catch(err){
                socket.emit("error", err)
            }
        })
    })
    // socket.on("message", (messageInfo) => {
    //     const { email, message } = messageInfo 
    //     console.log(email, message)

    //     if(email && message){
    //         try{
    //             messageModel.create({
    //                 email,
    //                 message
    //             })
    //         }catch(err){
    //             console.log(err)
    //         }    
    //     }
    //     socket.broadcast.emit("newMessage", messageInfo)
        
    // })

    // socket.on("createCart", (products) => {
    //     try{
    //         cart.createCart(products)
    //         .then(res => socket.emit("result", res))
            
    //     }catch(err){
    //         socket.emit("error", err)
    //     }
    // })

    
}

main()

//implementar dao y dto
//Impletementar patron repository

//No mostrar info sensible en /current (userDTO)

//Solo el admin puede gestionar productso y solo el usuario puede agregarlos al carrito

//Crear el modelo ticket
//Si no hay productos suficientes para la compra, el ticket se realiza con los productos que se pudo y los que no quedan en el carrito