const majors = require('express').Router()
const connection = require('../database.js')
/*
    Returns:
    - All courses in major
    - Flowchart path 
    - Keywords
*/
majors.get('/:major', (req, res) => {
    res.render('major.ejs')
    console.log(req.params)
})

module.exports = majors