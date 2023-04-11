import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
}).promise();
//Users get and post methods
export async function getUsers(){
    const [rows] = await pool.query("SELECT * FROM users");
    return rows 
}

export async function getUser(id){
    const [rows] = await pool.query(`
    SELECT * FROM users 
    WHERE id=?
    `, [id])
    return rows
}

export async function createUser(username, email, phonenumber){
    const [result] = await pool.query(`
    INSERT INTO users (username, email, phonenumber) 
    VALUES (?,?,?)
    `, [username, email, phonenumber]);
    const id = result.insertId;
    return getUser(id);
}
//Events get and post methods
export async function getEvents() {
    const [rows] = await pool.query("SELECT * FROM events");
    return rows
}

export async function getEvent(userId) {
    const [rows] = await pool.query(`
    SELECT * FROM events
    WHERE userId=?
    `, [userId])
    return rows
}

export async function createEvent(title, description, startDate, endDate, userId) {
    const [result] = await pool.query(`
    INSERT INTO events (title, description, startDate, endDate, userId)
    VALUES (?,?,?,?,?)
    `, [title, description, startDate, endDate, userId]);
    const id = result.insertId;
    return getEvent(id);
}

export async function getUserId() {
    const [rows] = await pool.query(`
    SELECT * FROM users 
    WHERE id=1
    `)
    return rows
}

export async function setUserId(userId) {
    const [rows] = await pool.query(`
    UPDATE userid
    SET userId=?
    WHERE id=1
    `, [userId])
    return rows
}



