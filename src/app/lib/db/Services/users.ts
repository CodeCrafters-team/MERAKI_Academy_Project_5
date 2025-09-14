import pool from "../index";


export const getAllUsers = async ()=>{
const res = await pool.query('SELECT * FROM users');
return res.rows;
}