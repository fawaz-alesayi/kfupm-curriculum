const mysql = require('mysql')
const dbName = 'maindb'

let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
});

// connects to the DB server, creates the database and tables.
function initDB() {
    connection.connect(err => {
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
    })

    connection.query(`USE ${dbName};`, err => { if (err) throw err })

    connection.query('CREATE TABLE IF NOT EXISTS colleges ( \
                      college_id INT,\
                      `name` VARCHAR(50),\
                      PRIMARY KEY (college_id));', err => {
                          if (err) throw err
                      })

    connection.query('CREATE TABLE IF NOT EXISTS departments ( \
                      department_id INT,\
                      `name` VARCHAR(50),\
                      code VARCHAR(6),\
                      college_id INT,\
                      PRIMARY KEY (department_id),\
                      FOREIGN KEY (college_id) REFERENCES colleges(college_id) );', err => {
                          if (err) throw err
                      })
    
    connection.query('CREATE TABLE IF NOT EXISTS majors ( \
                      major_id INT,\
                      name VARCHAR(255),\
                      code VARCHAR(10),\
                      flowchart_image_name VARCHAR(50),\
                      keywords TEXT,\
                      department_id INT,\
                      PRIMARY KEY (major_id),\
                      FOREIGN KEY (department_id) REFERENCES departments(department_id) );', err => {
                          if (err) throw err
                      })

    connection.query('CREATE TABLE IF NOT EXISTS courses ( \
                      course_id INT,\
                      code VARCHAR(10),\
                      level INT,\
                      name VARCHAR(255),\
                      description TEXT,\
                      keywords TEXT,\
                      course_image_name VARCHAR(255),\
                      resources_url TEXT,\
                      major_id INT,\
                      PRIMARY KEY (course_id),\
                      FOREIGN KEY (major_id) REFERENCES majors(major_id) );', err => {
                          if (err) throw err
                      })

    connection.query(
        'CREATE TABLE IF NOT EXISTS prerequisites (\
            course_id1 INT,\
            course_id2 INT,\
            PRIMARY KEY (course_id1, course_id2),\
            FOREIGN KEY (course_id1) REFERENCES courses(course_id),\
            FOREIGN KEY (course_id2) REFERENCES courses(course_id) );'
    )

    connection.query(
        'CREATE TABLE IF NOT EXISTS related_courses (\
            course_id1 INT,\
            course_id2 INT,\
            PRIMARY KEY (course_id1, course_id2),\
            FOREIGN KEY (course_id1) REFERENCES courses(course_id),\
            FOREIGN KEY (course_id2) REFERENCES courses(course_id) );'
    )
}

try {
    initDB()
    console.log('Database Initilization successful')
} catch (err) {
    console.err('Error in initlizing database' + err)
}

module.exports = connection;

