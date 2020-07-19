const admin = require('express').Router()
const pool = require('../database.js').pool
const bcrypt = require('bcrypt')

admin.get('/login', (req, res) => {
    res.render('adminlogin.ejs', { result: true })
})

admin.post('/login', async (req, res) => {
    pool.query('SELECT * FROM admins WHERE username=?', req.body.username, async (err, result) => {
        if (err) {
            console.error(err)
            res.send(404)
        }
        else {
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
        }
    })
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
    if (req.body.apikey === process.env.apikey) {
        const hash = await bcrypt.hash(req.body.password, 10)
        pool.query('INSERT INTO admins(username, pwd) VALUES (?, ?)', [req.body.username, hash], (err, result) => {
            if (err) {
                console.error(err)
                if (err.code == 'ER_DUP_ENTRY')
                    res.send("Already Exists")
                else {
                    res.send(500)
                }
            } else {
                console.log('affected rows: ' + result.affectedRows)
                res.sendStatus(201)
            }
        })
    } else {
        res.send(403) // Forbidden
    }
})

module.exports = admin