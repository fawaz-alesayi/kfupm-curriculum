const courses = require('express').Router()
const connection = require('../database.js')

courses.get('/courses/:course', (req, res) => {

})

module.exports = courses