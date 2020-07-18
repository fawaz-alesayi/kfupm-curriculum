const e = require('express')

const courses = require('express').Router()
const pool = require('../database.js').pool

courses.get('/', (req, res) => {
    res.redirect(req.url)
})


courses.get('/:course', (req, res) => {
    let courseInfo
    let prereqs
    pool.query('SELECT courses.course_id, courses.`code`, courses.`name`, courses.`description`, courses.syllabus, courses.lab_syllabus, courses.keywords, courses.course_image_url, courses.resources_url FROM courses WHERE courses.code=? LIMIT 1;',
        req.params.course, (err, results) => {
            if (err) {
                res.sendStatus(404)
                throw err;
            }
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
                                res.render('course_admin.ejs', { prereqs: prereqs, courseInfo: courseInfo, related: related, admin: true })
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

courses.get('/search/:searchText', (req, res) => {
    pool.query('SELECT courses.`code`, courses.`name` FROM courses WHERE courses.code LIKE ' + pool.escape('%' + req.params.searchText + '%') + ';', (err, results) => {
        if (err) {
            console.error(err)
        }
        else {
            if (results.length != 0) {
                res.send(results)
            } else {
                res.status(404).send("No courses found")
            }
        }
    })
})

courses.post('/', (req, res) => {
    // Get Major_id from course code MATH101 -> math
    pool.query('SELECT major_id FROM majors WHERE code=?;', req.body.courseCode.toUpperCase().replace(/[0-9]/g, ''), (err, code) => {
        if (err) {
            res.sendStatus(500)
            console.error(err)
        }
        if (code.length == 0) { // no major found in database with that code
            res.status(404).send("No Major found with that code.")
        } else {
            let prereqArray
            // if there is a prerequisite in request object
            if (req.body.prerequisite && !isEmptyArray(req.body.prerequisite)) {
                prereqArray = Array.isArray(req.body.prerequisite) ? req.body.prerequisite.filter(prereq => prereq.trim()) : [String(req.body.prerequisite)]
                // Check if prerequisites exist
                pool.query('SELECT code, course_id FROM courses WHERE code IN (?);', [prereqArray], (err, prereqs) => {
                    if (err) {
                        res.sendStatus(404)
                        console.error(err)
                    } else if (prereqs.length != prereqArray.length) {
                        let prereqCodes = prereqs.map(prereq => prereq.code)
                        let difference = prereqArray.filter(x => !prereqCodes.includes(x))

                        res.status(404).send("The following prerequisites dont exist: " + difference.join(', '))
                    } else {
                        // Get a single connection to use in a transaction
                        pool.getConnection((err, connection) => {
                            if (err) {
                                res.sendStatus(500)
                                console.error(err)
                            } else {

                                // Start DB Transaction
                                connection.beginTransaction((err) => {
                                    if (err) {
                                        connection.release();
                                        console.error(err)
                                        res.sendStatus(500)
                                    }
                                    // Insert course
                                    connection.query('INSERT INTO courses(code, level, name, syllabus, lab_syllabus, resources_url, keywords, major_id) VALUES\
                    (?, ?, ?, ?, ?, ?, ?, ?);', [req.body.courseCode.toUpperCase(), req.body.courseLevel ? req.body.courseLevel : 0, req.body.courseName, req.body.CourseSyllabusLink, req.body.LabSyllabusLink, req.body.resourcesLink, req.body.courseKeywords, code[0].major_id], (err, result) => {
                                        if (err) {
                                            return connection.rollback(() => {
                                                connection.release();
                                                res.sendStatus(500)
                                                console.error(err)
                                            })
                                        }
                                        else {
                                            // get id of the row we just inserted
                                            connection.query('SELECT course_id FROM courses WHERE courses.code=?;', req.body.courseCode, (err, id) => {
                                                if (err) {
                                                    return connection.rollback(() => {
                                                        connection.release();
                                                        res.sendStatus(500)
                                                        console.error(err)
                                                    })
                                                } else {
                                                    let prereqRelations = []
                                                    prereqs.forEach(prereq => prereqRelations.push([id[0].course_id, prereq.course_id]))
                                                    // finally insert to prerequisites
                                                    connection.query('INSERT INTO prerequisites(course_id1, course_id2) VALUES ?;', [prereqRelations], (err, relations) => {
                                                        if (err) {
                                                            return connection.rollback(() => {
                                                                connection.release();
                                                                res.sendStatus(500)
                                                                console.error(err)
                                                            })
                                                        } else {
                                                            connection.commit((err) => {
                                                                if (err) {
                                                                    connection.rollback(() => {
                                                                        connection.release()
                                                                        res.sendStatus(500)
                                                                        console.error(err)
                                                                    })
                                                                } else {
                                                                    connection.release()
                                                                    res.status(200).send("Added course to database")
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            })

                                        }
                                    })
                                })
                            }
                        })

                    }
                })
            } else {
                // Insert course
                pool.query('INSERT INTO courses(code, level, name, syllabus, lab_syllabus, resources_url, keywords, major_id) VALUES\
                                        (?, ?, ?, ?, ?, ?, ?, ?);', [req.body.courseCode, req.body.courseLevel ? req.body.courseLevel : 0, req.body.courseName, req.body.CourseSyllabusLink, req.body.LabSyllabusLink, req.body.resourcesLink, req.body.courseKeywords, code[0].major_id], (err, result) => {
                    if (err) {
                        res.sendStatus(500)
                        console.error(error)
                    } else {
                        res.status(200).send("Added course to database")
                    }
                })
            }
        }
    })
})

function isEmptyArray(array) {
    if (Array.isArray(array))
        if (array.length == 0 || array.every(element => !element))
            return true
        else
            return false
    else
        return false
}

module.exports = courses