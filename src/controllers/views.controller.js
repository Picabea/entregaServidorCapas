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
}

module.exports = { ViewsController }