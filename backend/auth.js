module.exports.isAuthorized  = (req, res, next) => {
    if (req.session.role != 'admin')
        res.sendStatus(400)
    else
        next()
}