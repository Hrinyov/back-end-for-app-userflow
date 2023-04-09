import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
}).promise();

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