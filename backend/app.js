const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000;
const routes = require('./routes/routes.js')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const pool = require('./database').pool
const MySQLStore = require('express-mysql-session')(session)
const sessionStore = new MySQLStore({}, pool)
const compression = require('compression')
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(compression())
app.use(cookieParser())
app.use(session({
    key: 'kfupmcurriculum.sid',
    secret: process.env.storeSecret || 'changethislater',
    store: sessionStore,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}))
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, '/public')))
app.set('view engine', 'ejs')
app.use('/', routes)


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})