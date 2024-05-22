const express = require('express')
const handlebars = require('express-handlebars')

const { ProductsStorage } = require('./persistence/products.storage.js')
const { ViewsStorage } = require('./persistence/Views.storage.js')
const { SessionStorage } = require('./persistence/session.storage.js')
const { CartsStorage } = require('./persistence/carts.storage.js')

const config = require('./config.js')

const sessionMiddleware = require('./session/mongoStorage.js')

//recursos necesarios de passport
const passport = require('passport')
const initializeStrategy = require('./config/passport.config.js')
const initializeGithubStrategy = require('./config/passport-github.config.js')

const routes = [
    require('./routes/products.router'),
    require('./routes/session.router.js'),
    require('./routes/views.router.js'),
    require('./routes/carts.router.js')
]

const mongoose = require('mongoose')

const app = express()

//Se configura el usoi de sesiones
app.use(sessionMiddleware)

//Inicializacion de passport
initializeGithubStrategy()
initializeStrategy()
app.use(passport.initialize())
app.use(passport.session())


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

const main = async () => {
    //Inicializar mongo y prender servidor

    await mongoose.connect(config.MONGO_URI,{
        dbName: 'ecommerce'
    })

    app.listen(8080, () => {
        console.log('Servidor listo!')
    })
}

main()