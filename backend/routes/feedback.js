const feedback = require('express').Router()
const pool = require('../app.js').pool

feedback.post('/surveys', async (req, res) => {

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

    try {
        await pool.query('INSERT INTO surveys(recommend, likes, reliability, multi_choice1, multi_choice2, multi_choice3, multi_choice4) VALUES (?, ?, ?, ?)', [req.body.recommend, req.body.like, req.body.either, improve])
        res.sendStatus(200)
    } catch (err) {
        res.sendStatus(500)
        console.error(err)
    }
})


feedback.post('/messages', async (req, res) => {

    console.log(req.body)
    try {
    await pool.query('INSERT INTO user_messages(`name`, `city`, `email`, `message`) VALUES (?, ?, ?, ?)', [req.body.name, req.body.city, req.body.email, req.body.message])
    res.sendStatus(200)
    } catch (err) {
        res.sendStatus(500)
        console.error(err)
    }

})

module.exports = feedback