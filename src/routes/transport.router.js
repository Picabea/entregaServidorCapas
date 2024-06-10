const { Router } = require('express')

// const passport = require('passport')

const router = Router()
//Llevar lo relacionado a transport a mailing y exportar on objeto con la funcion sendmail unicamente. Llamarlo desde el contorlador

const transport = require('../transport')
router.get('/mail', async (_, res) => {
    await transport.sendMail({
        from: 'Prueba',
        to: 'iniakipicabea@gmail.com',
        html: "<img src='cid:fotoEjemplo'>",
        subject: 'Prueba coder',
        attachments: [{
            filename: 'fotoEjemplo.jpg',
            path: __dirname+'../../../public/images/fotoEjemplo.jpg',
            //Si no se envia un cid la foto no aparece en el mail, sino adjunta
            cid: 'fotoEjemplo'
        }]
    })

    res.send('Email enviado')
})

module.exports = {
    configure: app => app.use('/api/transport', router)
}