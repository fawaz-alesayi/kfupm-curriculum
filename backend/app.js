const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000;
const routes = require('./routes/routes.js')
const path = require('path')

app.use(express.static(path.join(__dirname, '/public')))
app.set('view engine', 'ejs')
app.use('/', routes)


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})