const courses = require('express').Router()
const pool = require('../database.js').pool

courses.get('/', (req, res) => {
    console.log(req.url)
    res.redirect(req.url)
})


courses.get('/:course', (req, res) => {
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
                        res.sendStatus(500)
                        throw err;
                    }
                    prereqs = results2
                    pool.query('SELECT courses.code FROM related_courses INNER JOIN courses ON courses.course_id=related_courses.course_id1 OR courses.course_id=related_courses.course_id2 AND related_courses.course_id1=?;', courseInfo.course_id, (err, results3) => {
                        if (err) {
                            res.sendStatus(500)
                            throw err
                        } else {
                            let related = results3
                            if (req.session.role == 'admin')
                                res.render('course_admin.ejs', { prereqs: prereqs, courseInfo: courseInfo, related: related })
                            else
                                res.render('course.ejs', { prereqs: prereqs, courseInfo: courseInfo, related: related })
                        }
                    })
                })
            }
            else
                res.end()
        })
})

courses.post('/', (req, res) => {

    // Get Major_id from course code MATH101 -> math
    pool.query('SELECT major_id FROM majors WHERE code=?;', req.body.courseCode.toLowerCase().replace(/[0-9]/g, ''), (err, code) => {
        if (err) {
            res.sendStatus(500)
            throw err
        }
        if (code.length == 0) { // no major found in database with that code
            res.status(404).send("No Major found with that code.")
        } else {
            console.log(code[0].major_id)


            pool.query('INSERT INTO courses(code, level, name, syllabus, lab_syllabus, resources_url, keywords, major_id) VALUES\
        (?, ?, ?, ?, ?, ?, ?, ?);', [req.body.courseCode, req.body.courseLevel ? req.body.courseLevel : 0, req.body.courseName, req.body.CourseSyllabusLink, req.body.LabSyllabusLink, req.body.resourcesLink, req.body.courseKeywords, code[0].major_id], (err, result) => {
                if (err) {
                    res.sendStatus(500)
                    throw err
                } else {
                    res.status(200).send("Added course to database")
                }
            })
        }
    })
})

module.exports = courses