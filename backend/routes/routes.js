const routes = require('express').Router()
const root = require('./root')
const majors = require('./majors')
const courses = require('./courses')
const admin = require('./admin')
const feedback = require('./feedback')

// Match paths: / /index /index.html
routes.use(/^\/(index)?(.html)?$/, root)

routes.use('/majors', majors)

routes.use('/courses', courses)

routes.use('/admin', admin)

routes.use('/feedback', feedback)

routes.get(/^\/(help)?(.html)?$/, (req, res) => {
    if (req.session.role == 'admin')
        res.render('help_admin', {admin: true})
    else
        res.render('help')
})

routes.get(/^\/(about)?(.html)?$/, (req, res) => {
    if (req.session.role == 'admin')
        res.render('‏‏about_admin.ejs', {admin: true})
    else
        res.render('about')
})

module.exports = routes