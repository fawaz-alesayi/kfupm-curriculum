const feedback = require('express').Router()
const pool = require('../database.js').pool

feedback.post('/surveys', (req, res) => {

    console.log(req.body)
    let improve
    if (!req.body.improve)
        improve = [null, null, null, null]
    else {
        if (Array.isArray(req.body.improve)) {
            while (req.body.improve.length < 4)
                req.body.improve.push(null)
            improve = req.body.improve
        }
        else
            improve = [req.body.improve, null, null, null]
    }

    pool.query('INSERT INTO surveys(recommend, likes, reliability, multi_choice1, multi_choice2, multi_choice3, multi_choice4) VALUES (?, ?, ?, ?)', [req.body.recommend, req.body.like, req.body.either, improve], (err, result) => {
        if (err) {
            res.sendStatus(500)
            console.error(err)
        } else {
            res.sendStatus(200)
        }
    })
})


feedback.post('/messages', (req, res) => {

    console.log(req.body)
    pool.query('INSERT INTO user_messages(`name`, `city`, `email`, `message`) VALUES (?, ?, ?, ?)', [req.body.name, req.body.city, req.body.email, req.body.message], (err, result) => {
        if (err) {
            res.sendStatus(500)
            console.error(err)
        } else {
            res.sendStatus(200)
        }
    })
})

module.exports = feedback