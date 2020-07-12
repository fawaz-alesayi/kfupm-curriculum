const majors = require('express').Router()
const connection = require('../database.js')
/*
    Returns:
    - All courses in major
    - Flowchart image name 
    - Keywords
*/
majors.get('/:major', (req, res) => {
    connection.query('SELECT courses.code, majors.flowchart_image_name, majors.keywords FROM majors INNER JOIN courses on courses.major_id=majors.major_id AND majors.code=?;', req.params.major, (err, results) => {
        if (err)
        {
            res.end()
            throw err
        }
        res.render('major.ejs', {results})
    })
})

module.exports = majors