const majors = require('express').Router()
const pool = require('../app.js').pool
/*
    Returns:
    - All courses in major
    - Flowchart image name 
    - Keywords
*/
majors.get('/:major', async (req, res) => {
    try {
        let results = await pool.query('SELECT majors.code, majors.major_id, majors.name, majors.flowchart_url, majors.keywords, majors.resource_url, majors.major_image_url FROM majors WHERE majors.code=?;', req.params.major)
        if (results.length) {
            let courses = await pool.query('SELECT courses.code FROM courses WHERE courses.major_id=?', results[0].major_id)
            if (req.session.role == 'admin')
                res.render('major_admin.ejs', { results, courses, admin: true })
            else
                res.render('major.ejs', { results, courses })
        }
    } catch (err) {
        res.send(500)
        console.error(err)
    }
})

module.exports = majors