const mysql = require('mysql')
const dbName = 'maindb'
const pool = mysql.createPool({
    connectionLimit: 20,
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.dbPass || 'root',
    database: dbName
});

/*
1. create database if not exists
2. use databse
3. create session store and other tables if they do not exists
*/
function initDB() {
    pool.query(`CREATE DATABASE IF NOT EXISTS ??;`, dbName, err => {
        if (err) {
            console.error(`could not create database ${dbName}. Error: ${err}`)
            return
        } else {
            console.log("created database")
            pool.query(`USE ${dbName};`, err => {
                if (err) throw err
                pool.query('CREATE TABLE IF NOT EXISTS colleges ( \
                    college_id INT AUTO_INCREMENT,\
                    `name` VARCHAR(50),\
                    PRIMARY KEY (college_id));', err => {
                    if (err) throw err

                    pool.query('CREATE TABLE IF NOT EXISTS majors ( \
                        major_id INT AUTO_INCREMENT,\
                        name VARCHAR(255),\
                        code VARCHAR(255),\
                        description TEXT,\
                        flowchart_url TEXT,\
                        resource_url TEXT,\
                        marjor_image_url TEXT,\
                        keywords TEXT,\
                        college_id INT,\
                        PRIMARY KEY (major_id),\
                        FOREIGN KEY (college_id) REFERENCES colleges(college_id) );', err => {
                        if (err) throw err

                        pool.query('CREATE TABLE IF NOT EXISTS courses ( \
                            course_id INT AUTO_INCREMENT,\
                            code VARCHAR(255),\
                            level INT,\
                            name VARCHAR(255),\
                            description TEXT,\
                            outcomes TEXT,\
                            syllabus TEXT,\
                            lab_syllabus TEXT,\
                            keywords TEXT,\
                            course_image_url TEXT,\
                            resources_url TEXT,\
                            major_id INT,\
                            PRIMARY KEY (course_id),\
                            FOREIGN KEY (major_id) REFERENCES majors(major_id) );', err => {
                            if (err) throw err

                            pool.query(
                                'CREATE TABLE IF NOT EXISTS prerequisites (\
                      course_id1 INT,\
                      course_id2 INT,\
                      PRIMARY KEY (course_id1, course_id2),\
                      FOREIGN KEY (course_id1) REFERENCES courses(course_id),\
                      FOREIGN KEY (course_id2) REFERENCES courses(course_id) );'
                            )

                            pool.query(
                                'CREATE TABLE IF NOT EXISTS related_courses (\
                      course_id1 INT,\
                      course_id2 INT,\
                      PRIMARY KEY (course_id1, course_id2),\
                      FOREIGN KEY (course_id1) REFERENCES courses(course_id),\
                      FOREIGN KEY (course_id2) REFERENCES courses(course_id) );'
                            )
                        })
                    })
                })

                // pool.query('CREATE TABLE IF NOT EXISTS departments ( \
                //     department_id INT AUTO_INCREMENT,\
                //     `name` VARCHAR(255),\
                //     code VARCHAR(255),\
                //     college_id INT,\
                //     PRIMARY KEY (department_id),\
                //     FOREIGN KEY (college_id) REFERENCES colleges(college_id) );', err => {
                //     if (err) throw err
                // })

                pool.query(
                    'CREATE TABLE IF NOT EXISTS admins (\
          username VARCHAR(255) PRIMARY KEY NOT NULL,\
          pwd BINARY(60) NOT NULL\
          );'
                )
            })
        }
    })
}

try {
    initDB()
    console.log('Database Initilization successful')
} catch (err) {
    console.err('Error in initlizing database' + err)
}

module.exports = { pool }