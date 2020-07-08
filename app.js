const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000;
const connection = require('./database.js')


app.set('view engine', 'ejs')


app.get('/', (req, res) => {
    res.send("All O.K.")
})


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})