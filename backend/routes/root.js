const root = require('express').Router()
const pool = require('../database.js').pool;
// Match paths: / /index /index.html
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
root.get('/', (req, res) => {
    let options = {
        sql: 'SELECT colleges.`name`, majors.`name`, majors.code FROM colleges \
    INNER JOIN departments ON colleges.college_id = departments.college_id \
    INNER JOIN majors ON departments.department_id = majors.department_id;',
        nestTables: true
    };
    let obj = {}
    pool.query(options, (err, results) => {
        if (err) {
            res.sendStatus(500)
        } else {
            results.forEach(result => {
                if (!obj[result.colleges.name]) obj[result.colleges.name] = []
                obj[result.colleges.name].push({ code: result.majors.code, name: result.majors.name })
            })
            let data = Object.keys(obj).map(key => {
                return { college: key, majors: obj[key] }
            })
            console.log(data)
            if (req.session.role == 'admin')
                res.render('index_admin.ejs', { data })
            else
                res.render('index.ejs', { data })
        }
    })

})

module.exports = root