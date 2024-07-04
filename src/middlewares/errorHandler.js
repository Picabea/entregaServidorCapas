const { ErrorCodes } = require("../errors/errorCodes")

/**
 * @type {import("express").ErrorRequestHandler}
 */
const errorHandler = (error, req, res, next) => {
    console.log(error.cause)
    req.logger.error(`Error ${error.name} en ${req.method} ${req.url}`)
    switch (error.code) {
        case ErrorCodes.INVALID_DATA_ERROR:
            res.status(400).send({ status: 'error', error: error.name })
            break
        case ErrorCodes.ROUTING_ERROR:
            res.status(500).send({ status: 'error', error: error.name})
        case ErrorCodes.DATABASE_ERROR:
            res.status(400).send({ status: 'error', error: error.name })
        case ErrorCodes.NOT_FOUND:
            res.status(400).send({ status: 'error', error: error.name })
        case ErrorCodes.INVALID_TOTAL_ERROR:
            res.status(400).send({ status: 'error', error: error.name })
        case ErrorCodes.INVALID_CART_ERROR:
            res.status(400).send({ status: 'error', error: error.name })
        default:
            res.status(500).send({ status: 'error', error: 'Unknown' })
    }
    next()
}

module.exports = { errorHandler }