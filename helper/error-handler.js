function errorHandler(err, req, res, next) {
    if (err, name == "UnauthorizedError") {
        return res.status(401).send({ message: "authentication failed" })
    } else if (err.name == "ValidationError") {
        return res.status(500).send({ message: err })
    } else {

    }
    return res.status(500).send({ message: err })
}