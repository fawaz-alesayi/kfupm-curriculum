const admin = require('express').Router()
const pool = require('../app.js').pool
const bcrypt = require('bcrypt')

admin.get('/login', (req, res) => {
    res.render('adminlogin.ejs', { result: true })
})

admin.post('/login', async (req, res) => {
    try {
        let result = await pool.query('SELECT * FROM admins WHERE username=?', req.body.username)
        if (result.length == 0) {
            res.render('adminlogin.ejs', { result: false })
        }
        else {
            const saltedPwd = String(result[0].pwd)
            const pwdIsCorrect = await bcrypt.compare(req.body.password, saltedPwd)
            if (pwdIsCorrect) { // Succesful Login
                req.session.username = req.body.username;
                req.session.role = 'admin'
                res.redirect('/')
            }
            else
                res.render('adminlogin.ejs', { result: false })
        }
    } catch (err) {
        res.sendStatus(404)
        console.error(err)
    }

})

admin.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err)
            res.sendStatus(500)
        } else {
            res.redirect('/')
        }
    })
})

admin.post('/register', async (req, res) => {
    if (req.body.apikey == process.env.apikey) {
        const hash = await bcrypt.hash(req.body.password, 10)
        try {
        let result = await pool.query('INSERT INTO admins(username, pwd) VALUES (?, ?)', [req.body.username, hash])
        console.log('affected rows: ' + result.affectedRows)
        res.sendStatus(201)
        } catch(err) {
            console.error(err)
            if (err.code == 'ER_DUP_ENTRY')
                res.send("Already Exists")
            else {
                res.sendStatus(500)
            }
        }
    } else {
        res.send(403) // Forbidden
    }
})

module.exports = admin