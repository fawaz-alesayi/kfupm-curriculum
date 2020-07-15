const routes = require('express').Router()
const root = require('./root')
const majors = require('./majors')
const courses = require('./courses')
const admin = require('./admin')

routes.use(/^\/(index)?(.html)?$/, root)
routes.use('/majors', majors)
routes.use('/courses', courses)
routes.use('/admin', admin)

module.exports = routes