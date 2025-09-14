const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../models/db");

const register = (req, res) => {
  const { firstName, lastName, email, password, avatarUrl } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'firstName, lastName, email, password required',
    });
  }

  bcrypt
    .hash(password, 12)
    .then((passwordHash) => {
      const insertQuery = `
        INSERT INTO users (email, password_hash, first_name, last_name, avatar_url, role_id)
        VALUES ($1, $2, $3, $4, $5 ,$6)
        RETURNING *
      `;
const role_id= 3    
 const values = [
        email.trim().toLowerCase(),
        passwordHash,
        firstName.trim(),
        lastName.trim(),
        avatarUrl || null,
         role_id
      ];

      return pool.query(insertQuery, values);
    })
    .then((result) => {
      res.status(201).json({
        success: true,
        message: 'Account Created Successfully',
        user: result.rows[0],
      });
    })
    .catch((err) => {
      if (err.code === '23505') {
        return res.status(409).json({
          success: false,
          message: 'The email already exists',
        });
      }

      res.status(500).json({
        success: false,
        message: 'Server Error',
        err: err.message,
      });
    });
};
  


module.exports = { register , login ,getAllUsers,getUserById};