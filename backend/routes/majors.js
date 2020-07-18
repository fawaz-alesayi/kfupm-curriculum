const majors = require('express').Router()
const pool = require('../database.js').pool
/*
    Returns:
    - All courses in major
    - Flowchart image name 
    - Keywords
*/
majors.get('/:major', (req, res) => {
    pool.query('SELECT majors.major_id, courses.code, majors.name, majors.flowchart_url, majors.keywords, majors.resource_url, majors.major_image_url FROM majors INNER JOIN courses on courses.major_id=majors.major_id AND majors.code=?;', req.params.major, (err, results) => {
        if (err) {
            res.end()
            throw err
        }
        console.log(results)
        if (req.session.role == 'admin')
            res.render('major_admin.ejs', { results, admin: true })
        else
            res.render('major.ejs', { results })
    })
})

module.exports = majors