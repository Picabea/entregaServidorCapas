const compression = require('express-compression')
const zlib = require('zlib')

class ViewsController{
    constructor(productsService) {
        this.service = productsService
    }

    renderHome(req, res){
        const isLoggedIn = ![null, undefined].includes(req.session.user)

        res.render('index', {
            title: 'Home',
            isLoggedIn,
            isNotLoggedIn: !isLoggedIn,
        })
    }

    login(_, res){
        res.render('login', {
            title: 'Login'
        })
    }

    register(_, res){
        res.render('register', {
            title: 'Register'
        })
    }

    async profile(req, res){
        let user;
        if(req.session.user.email === "adminCoder@coder.com"){
            user = {
                firstName: "Admin",
                lastName: "Coder",
                age: "-",
                email: "adminCoder@coder.com"
            }
        }
        
        const idFromSession = req.session.user._id

        user = await this.service.getUser(idFromSession)
        res.render('profile', {
            title: 'My profile',
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                age: user.age,
                email: user.email
            }
        })
    }
    
    restorePassword(_, res){
        res.render('restorePassword')
    }

    //Utilizando zlib(tecnologia vieja)
    testEnconding(req, res){
        const response = 'respuesta muy larga'.repeat(1000)

        res.setHeader('Content-Encoding', 'deflate')
        zlib.deflate(response, (err, result) => {
            res.write(result)
        })
    }

    //Utilizando gzip 

    //Hay que poner esta linea sobre el req, res para que se comprima
    // app.use(compression())
    testEnconding(req, res){
        const response = 'respuesta muy larga'.repeat(1000)

        res.send(response)
    }

    //Utilizando gzip manualmente
    
    testEnconding(req, res){
        const response = 'respuesta muy larga'.repeat(1000)

        res.setHeader('Content-Encoding', 'gzip')
        zlib.gzip(response, {level: 1, strategy: 4}, (err, result) => {
            res.write(result)
        })
    }

    //Utilizando brotli
    //Hay que poner esta linea sobre el req, res para que se comprima
    // app.use(compression({brotli: {enabled: true, zlib: {}}}))
    testEnconding(req, res){
        const response = 'respuesta muy larga'.repeat(1000)

        res.send(response)
    }
}

module.exports = { ViewsController }