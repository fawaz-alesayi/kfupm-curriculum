const mysql = require('mysql')
const dbName = 'maindb'

let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
});

connection.connect((err) => {
    if (err) {
        console.error(`Connection Error: ${err}`)
        return
    }
});

connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName};`, err => {
    if (err) {
        console.error(`could not create database ${dbName}. Error: ${err}`)
        return
    }
    connection.query(`USE ${dbName};`, err => { if (err) throw err })
})

module.exports = connection;

