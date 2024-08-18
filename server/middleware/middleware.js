const errorHandler = (err, req, res, next) => {
    if (err.statusCode === 500 || !err.statusCode) {
        console.error(err);
        return res.status(500).jsend.error({ message: 'An internal server error has occurred. Please try again later' })
    }
    else {
        return res.status(err.statusCode).jsend.fail({
            statusCode: err.statusCode, result: {
                message: err.message
            }
        })
    }
}

module.exports = { errorHandler };