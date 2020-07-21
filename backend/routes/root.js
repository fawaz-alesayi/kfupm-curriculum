const root = require('express').Router()
const pool = require('../app.js').pool;
/*
    data array:
    [
        {
            college: "name of college",
            majors: {
                code: "code name of major",
                name: "name of major"
            }
        },
        ...
    ]
*/
root.get('/', async (req, res) => {
    let options = {
        sql: 'SELECT colleges.`name`, colleges.`description`, majors.`name`, majors.code FROM colleges \
    INNER JOIN majors ON colleges.college_id = majors.college_id;',
        nestTables: true
    };
    let obj = {}
    try {
        let results = await pool.query(options)
        console.log(results)
        results.forEach(result => {
            if (!obj[result.colleges.name]) obj[result.colleges.name] = []
            obj[result.colleges.name].push({ code: result.majors.code, name: result.majors.name })
        })
        console.log(obj)
        let data = Object.keys(obj).map(key => {
            return { college: key, majors: obj[key] }
        })
        console.log(data)
        if (req.session.role == 'admin')
            res.render('index_admin.ejs', { data, admin: true })
        else
            res.render('index.ejs', { data })
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
})

module.exports = root