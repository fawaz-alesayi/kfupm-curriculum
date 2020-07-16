const majors = require('express').Router()
const pool = require('../database.js').pool
/*
    Returns:
    - All courses in major
    - Flowchart image name 
    - Keywords
*/
majors.get('/:major', (req, res) => {
    pool.query('SELECT majors.major_id, courses.code, majors.flowchart_url, majors.keywords FROM majors INNER JOIN courses on courses.major_id=majors.major_id AND majors.code=?;', req.params.major, (err, results) => {
        if (err) {
            res.end()
            throw err
        }
        if (req.session.role == 'admin')
            res.render('major_admin.ejs', { results })
        else
            res.render('major.ejs', { results })
    })
})

module.exports = majors