const courses = require('express').Router()
const pool = require('../app.js').pool

courses.get('/', (req, res) => {
    res.redirect(req.url)
})


courses.get('/:course', async (req, res) => {
    try {
        let results = await pool.query('SELECT courses.course_id, courses.`code`, courses.`name`, courses.`description`, courses.`outcomes`, courses.syllabus, courses.lab_syllabus, courses.keywords, courses.course_image_url, courses.resources_url FROM courses WHERE courses.code=? LIMIT 1;',
            req.params.course)
        if (results[0]) {
            let courseInfo = results[0]

            // Give us all prerequisites codes of course
            let prereqs = await pool.query('SELECT courses.code FROM prerequisites INNER JOIN courses ON courses.course_id=prerequisites.course_id2 AND prerequisites.course_id1=?;', courseInfo.course_id)
            let related = await pool.query('SELECT DISTINCT courses.code FROM related_courses INNER JOIN courses ON (courses.course_id=related_courses.course_id1 OR courses.course_id=related_courses.course_id2) AND (related_courses.course_id2=? OR related_courses.course_id1=?) AND courses.`course_id`<>?;', [courseInfo.course_id, courseInfo.course_id, courseInfo.course_id])
            if (req.session.role == 'admin')
                res.render('course_admin.ejs', { prereqs: prereqs, courseInfo: courseInfo, related: related, admin: true })
            else
                res.render('course.ejs', { prereqs: prereqs, courseInfo: courseInfo, related: related })
        }
        else
            res.sendStatus(404)
    } catch (err) {
        res.sendStatus(500)
        console.error(err)
    }
})

courses.get('/search/:searchText', async (req, res) => {
    try {
        let results = await pool.query('SELECT courses.`code`, courses.`name` FROM courses WHERE courses.code LIKE ' + pool.escape(req.params.searchText + '%') + ';')
        if (results.length != 0) {
            res.send(results)
        } else {
            res.status(404).send("No courses found")
        }
    } catch (err) {
        res.sendStatus(500)
        console.error(err)
    }
})

courses.post('/', async (req, res) => {
    try {
        // Get Major_id from course code MATH101 -> math
        let code = await pool.query('SELECT major_id FROM majors WHERE code=?;', req.body.courseCode.toUpperCase().replace(/[0-9]/g, ''))
        if (code.length == 0) // no major found in database with that code
            res.status(404).send("No Major found with that code.")
        else {
            let prereqArray
            // if there is a prerequisite in request object
            if (req.body.prerequisite && !isEmptyArray(req.body.prerequisite)) {
                prereqArray = Array.isArray(req.body.prerequisite) ? req.body.prerequisite.filter(prereq => prereq.trim()) : [String(req.body.prerequisite)]
                // Check if prerequisites exist
                let prereqs = await pool.query('SELECT code, course_id FROM courses WHERE code IN (?);', [prereqArray])
                if (prereqs.length != prereqArray.length) {
                    let prereqCodes = prereqs.map(prereq => prereq.code)
                    let difference = prereqArray.filter(x => !prereqCodes.includes(x))

                    res.status(404).send("The following prerequisites dont exist: " + difference.join(', '))
                } else {
                    // Get a single connection to use in a transaction
                    let connection = await pool.getConnection()

                    try {
                        // Start DB Transaction
                        await connection.beginTransaction()

                        // Insert course
                        await connection.query('INSERT INTO courses(code, level, name, description, outcomes, syllabus, lab_syllabus, resources_url, keywords, major_id) VALUES\
                    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', [req.body.courseCode.toUpperCase(), req.body.courseLevel ? req.body.courseLevel : 0, req.body.courseName, req.body.courseDescription, req.body.courseOutcomes, req.body.CourseSyllabusLink, req.body.LabSyllabusLink, req.body.resourcesLink, req.body.courseKeywords, code[0].major_id])

                        // get id of the row we just inserted
                        let id = await connection.query('SELECT course_id FROM courses WHERE courses.code=?;', req.body.courseCode)

                        let prereqRelations = []
                        prereqs.forEach(prereq => prereqRelations.push([id[0].course_id, prereq.course_id]))

                        // finally insert to prerequisites
                        connection.query('INSERT INTO prerequisites(course_id1, course_id2) VALUES ?;', [prereqRelations])
                        connection.commit()
                        connection.release()
                        res.status(200).send("Added course to database")
                    } catch (err) {
                        res.send(500)
                        return await connection.rollback()
                    }
                }
            } else {
                // Insert course
                await pool.query('INSERT INTO courses(code, level, name, description, outcomes, syllabus, lab_syllabus, resources_url, keywords, major_id) VALUES\
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', [req.body.courseCode.toUpperCase(), req.body.courseLevel ? req.body.courseLevel : 0, req.body.courseName, req.body.courseDescription, req.body.courseOutcomes, req.body.CourseSyllabusLink, req.body.LabSyllabusLink, req.body.resourcesLink, req.body.courseKeywords, code[0].major_id])
                res.status(200).send("Added course to database")
            }
        }
    } catch (err) {
        res.sendStatus(500)
        console.error(err)
    }
})

courses.post('/:courseCode/survey', async (req, res) => {
    try {
        console.log(req.body)
        let code = await pool.query('SELECT courses.course_id FROM courses WHERE courses.code=? LIMIT 1;', req.params.courseCode)
        if (code.length)
            await pool.query('INSERT INTO course_surveys(taken, familiar, reliability, difficulty, need_to_improve, course_id) VALUES (?, ?, ?, ?, ?, ?);', [req.body.finish, req.body.familiar, req.body.nither, req.body.difficulty, req.body.improvec, code.course_Id])
        else
            throw new Error('No course with code name ' + code)
        res.sendStatus(200)
    } catch (err) {
        res.sendStatus(500)
        console.error(err)
    }
})

courses.put('/:courseCode', async (req, res) => {
    console.log(req.body)
    try {
        await pool.query('UPDATE courses SET code=?, name=?, description=?, outcomes=?, syllabus=?, lab_syllabus=?, keywords=?, course_image_url=?, resources_url=? WHERE courses.code=?',
            [req.body.newCode, req.body.newName, req.body.newDescription, req.body.newCourseOutcomes, req.body.newSyllabus, req.body.newSyllabusLab, req.body.newKeywords, req.body.newImageUrl, req.body.newResourceUrl, req.params.courseCode])
        res.sendStatus(200)
    } catch (err) {
        res.sendStatus(500)
        console.error(err)
    }

})

courses.delete('/:courseCode', async (req, res) => {
    if (req.session.role == 'admin') {
        try {
            await pool.query('DELETE FROM courses WHERE code=?', req.params.courseCode)
            res.sendStatus(200)
        } catch (err) {
            res.sendStatus(500)
            console.error(err)
        }

    } else {
        res.sendStatus(403)
    }
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