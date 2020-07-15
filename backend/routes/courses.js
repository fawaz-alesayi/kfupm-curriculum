const courses = require('express').Router()
const pool = require('../database.js').pool

courses.get('/:course', (req, res) => {
    let executionTimes = 0;
    let courseInfo
    let prereqs
    pool.query('SELECT courses.course_id, courses.`code`, courses.`name`, courses.`description`, courses.syllabus, courses.lab_syllabus, courses.keywords, courses.course_image_name, courses.resources_url FROM courses WHERE courses.code=? LIMIT 1;',
        req.params.course, (err, results) => {
            if (err) {
                res.sendStatus(404)
                throw err;
            }
            console.log(results)
            if (results[0]) {
                courseInfo = results[0]

                pool.query('SELECT courses.code FROM prerequisites INNER JOIN courses ON courses.course_id=prerequisites.course_id2 AND prerequisites.course_id1=?;', courseInfo.course_id, (err, results2) => {
                    if (err) {
                        res.sendStatus(404)
                        throw err;
                    }
                    prereqs = results2
                    console.log("EXECUTED INNER...")
                    res.render('course.ejs', { prereqs: prereqs, courseInfo: courseInfo })
                })
            }
            else
                res.end()
        })
})

module.exports = courses