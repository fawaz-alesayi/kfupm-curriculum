const routes = require('express').Router()
const root = require('./root')
const majors = require('./majors')
const courses = require('./courses')

routes.use(/^\/(index)?(.html)?$/, root)
routes.use('/majors', majors)
routes.use('/courses', courses)

module.exports = routes