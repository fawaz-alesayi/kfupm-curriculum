const mysqlPromise = require('promise-mysql')
const dbName = 'maindb'
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)

async function initDB(pool) {
    try {
        await pool.query('CREATE DATABASE IF NOT EXISTS ??;', dbName)
        await pool.query('USE ??;', dbName)
        await pool.query('CREATE TABLE IF NOT EXISTS colleges ( \
            college_id INT AUTO_INCREMENT,\
            `name` VARCHAR(50) NOT NULL,\
            `vision` TEXT,\
            `mission` TEXT,\
            `description` TEXT,\
            PRIMARY KEY (college_id));')

        await pool.query('CREATE TABLE IF NOT EXISTS majors (\
            major_id INT AUTO_INCREMENT,\
            name VARCHAR(255),\
            code VARCHAR(255) UNIQUE NOT NULL,\
            description TEXT,\
            flowchart_url TEXT,\
            resource_url TEXT,\
            major_image_url TEXT,\
            keywords TEXT,\
            college_id INT,\
            PRIMARY KEY (major_id),\
            FOREIGN KEY (college_id) REFERENCES colleges(college_id) );')

        await pool.query('CREATE TABLE IF NOT EXISTS courses ( \
            course_id INT AUTO_INCREMENT,\
            code VARCHAR(255) UNIQUE NOT NULL,\
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
            FOREIGN KEY (major_id) REFERENCES majors(major_id) );')

        await pool.query('CREATE TABLE IF NOT EXISTS prerequisites (\
            course_id1 INT,\
            course_id2 INT,\
            PRIMARY KEY (course_id1, course_id2),\
            FOREIGN KEY (course_id1) REFERENCES courses(course_id) ON DELETE CASCADE,\
            FOREIGN KEY (course_id2) REFERENCES courses(course_id) ON DELETE CASCADE );')

        await pool.query('CREATE TABLE IF NOT EXISTS related_courses (\
            course_id1 INT,\
            course_id2 INT,\
            PRIMARY KEY (course_id1, course_id2),\
            FOREIGN KEY (course_id1) REFERENCES courses(course_id) ON DELETE CASCADE,\
            FOREIGN KEY (course_id2) REFERENCES courses(course_id) ON DELETE CASCADE);')

        await pool.query('CREATE TABLE IF NOT EXISTS course_surveys (\
            id INT PRIMARY KEY,\
            taken BOOLEAN,\
            familiar BOOLEAN,\
            reliability TEXT,\
            difficulty TEXT,\
            need_to_improve TEXT,\
            course_id INT,\
            FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE);\
            ')

        pool.query('CREATE TABLE IF NOT EXISTS admins (\
            username VARCHAR(255) PRIMARY KEY NOT NULL,\
            pwd BINARY(60) NOT NULL\
            );')

        pool.query('CREATE TABLE IF NOT EXISTS surveys (\
            survey_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,\
            recommend VARCHAR(50),\
            likes VARCHAR(50),\
            reliability VARCHAR(50),\
            multi_choice1 VARCHAR(50),\
            multi_choice2 VARCHAR(50),\
            multi_choice3 VARCHAR(50),\
            multi_choice4 VARCHAR(50));')

        pool.query('CREATE TABLE IF NOT EXISTS user_messages (`message_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,`name` VARCHAR(255),`city` VARCHAR(255),`email` VARCHAR(255),`message` TEXT);')
    }
    catch (error) {
        console.error(error)
        process.exit()
    }
}



/*
1. create database if not exists
2. use databse
3. create session store and other tables if they do not exists
*/
module.exports = (async () => {
    var pool = await mysqlPromise.createPool({
        connectionLimit: 20,
        host: 'localhost',
        port: 3306,
        user: process.env.dbUser || 'root',
        password: process.env.dbPass || '',
        database: dbName
    })
    await initDB(pool)
    sessionStore = new MySQLStore({}, pool)
   
     return { pool, sessionStore };
   })();
