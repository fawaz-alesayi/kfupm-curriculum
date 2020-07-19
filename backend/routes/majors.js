const majors = require('express').Router()
const pool = require('../database.js').pool
/*
    Returns:
    - All courses in major
    - Flowchart image name 
    - Keywords
*/
majors.get('/:major', (req, res) => {
    pool.query('SELECT majors.code, majors.major_id, majors.name, majors.flowchart_url, majors.keywords, majors.resource_url, majors.major_image_url FROM majors WHERE majors.code=?;', req.params.major, (err, results) => {
        if (err) {
            res.sendStatus(500)
            console.error(err)
        } else {
            console.log(results)
            if (results.length) {
                pool.query('SELECT courses.code FROM courses WHERE courses.major_id=?', results[0].major_id, (err, courses) => {
                    console.log(courses)
                    if (err) {
                        res.sendStatus(500)
                        console.error(err)
                    } else {
                        if (req.session.role == 'admin')
                            res.render('major_admin.ejs', { results, courses, admin: true })
                        else
                            res.render('major.ejs', { results, courses })
                    }
                })
            }
        }

    })
})

module.exports = majors