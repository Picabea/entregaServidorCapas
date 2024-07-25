const CurrentUserDTO = require('../dao/DTOs/currentUser.dto')

class SessionController{
    constructor(productsService) {
        this.service = productsService
    }

    login(req, res){
        // Crear sesion
        req.session.user = {email: req.user.email, _id: req.user._id.toString()}
        console.log("Dentro de login")
        const isLoggedIn = ![null, undefined].includes(req.session.user)
        res.render('index', {
            title: 'Home',
            isLoggedIn,
            isNotLoggedIn: !isLoggedIn,
        })
    }

    register(_, res){
        res.redirect('/')
    }

    failRegister(_, res){
        res.send('Error registering user!')
    }

    failLogin(_, res){
        res.send('Error logging in user!')
    }

    async logout(req, res){
        const { email } = req.session.user
        console.log(email)
        const result = await this.service.userLastConnection(email)
        console.log(result)
        req.session.destroy(_ => {
            res.redirect('/login')
        })
    }

    async current(req, res){
        console.log(1)
        const userEmail = req.session.user.email
        const user = new CurrentUserDTO(await this.service.getUser(userEmail)) 
        res.render('currentUser', {
            user,
            cart: user.cart
        })
    }
    
    async restorePassword(req, res){
        const { email, newPassword } = req.body
        const user = await this.service.restorePassword(email, newPassword)
        if(user){
            res.status(200).redirect('/')
        }else{
            res.status(400).json({success: false})
        }
    }

    async githubcallback(req, res){
        req.session.user = { _id: req.user._id}
        res.redirect('/')
    }

    async userByEmail(req, res){
        const { email } = req.body
        const response = await this.service.userByEmail(email)
        res.json(response)
    }
}

module.exports = { SessionController }