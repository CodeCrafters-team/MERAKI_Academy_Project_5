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
  
const login = (req, res) => {
  const email = req.body.email.trim().toLowerCase();
  const password = req.body.password

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'email & password required',
    });
  }

  const selectQuery = `
    SELECT
      u.id,
      u.email,
      u.password_hash,
      u.first_name AS "firstName",
      u.last_name  AS "lastName",
      u.avatar_url AS "avatarUrl",
      u.is_active  AS "isActive",
      u.role_id    AS "roleId",
      r.name       AS "roleName",
      r.permissions
    FROM users u
    LEFT JOIN roles r ON r.id = u.role_id
    WHERE u.email = $1
    LIMIT 1
  `;

  pool
    .query(selectQuery, [email])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: `The email doesn't exist or the password is incorrect`,
        });
      }

      const user = result.rows[0];

      if (user.isActive === false) {
        return res.status(403).json({
          success: false,
          message: 'Account is deactivated',
        });
      }

   
      return bcrypt.compare(password, user.password_hash).then((isMatch) => {
        if (!isMatch) {
          return res.status(403).json({
            success: false,
            message: `The email doesn't exist or the password is incorrect`,
          });
        }

    
        const payload = {
          userId: user.id,
          roleId: user.roleId,
          roleName: user.roleName,
          role: {
            permissions: user.permissions || []
          }
        };

        const token = jwt.sign(
          payload,
          process.env.SECRET,
          { expiresIn: '24h' }
        );

        delete user.password_hash;

        return res.status(200).json({
          success: true,
          message: 'Valid login credentials',
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatarUrl: user.avatarUrl,
            roleId: user.roleId,
            roleName: user.roleName,
            permissions: user.permissions,
          },
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'Server Error',
        err: err.message,
      });
    });
};

const getAllUsers = (req, res) => {
  const sql = `
    SELECT
      id,
      email,
      first_name AS "firstName",
      last_name  AS "lastName",
      avatar_url AS "avatarUrl",
      is_active  AS "isActive",
      created_at AS "createdAt",
      role_id    AS "roleId"
    FROM users
    ORDER BY id ASC
  `;

  pool
    .query(sql)
    .then(({ rows }) => {
      res.status(200).json({
        success: true,
        users: rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'Server Error',
        err: err.message,
      });
    });
};


const getUserById = (req, res) => {
  const { id } = req.params;
  const userId = id

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: ' user id required',
    });
  }

  const sql = `
    SELECT
      u.id,
      u.email,
      u.first_name AS "firstName",
      u.last_name  AS "lastName",
      u.avatar_url AS "avatarUrl",
      u.is_active  AS "isActive",
      u.created_at AS "createdAt",
      u.role_id    AS "roleId",
      r.name       AS "roleName",
      r.permissions
    FROM users u
    LEFT JOIN roles r ON r.id = u.role_id
    WHERE u.id = $1
    LIMIT 1
  `;

  pool
    .query(sql, [userId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      return res.status(200).json({
        success: true,
        user: rows[0],
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'Server Error',
        err: err.message,
      });
    });
};

const updateUserInfo = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, avatarUrl, email } = req.body;

  try {
    const userCheck = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const verificationCode = crypto.randomInt(100000, 999999);

    try {
      await emailjs.send(
        process.env.EMAILJS_SERVICE_ID,
        process.env.EMAILJS_TEMPLATE_ID,
        {
          to_email: email || userCheck.rows[0].email,
          to_name: firstName || userCheck.rows[0].first_name,
          message: `Your verification code is: ${verificationCode}`,
        },
        {
          publicKey: process.env.EMAILJS_PUBLIC_KEY,
          privateKey: process.env.EMAILJS_PRIVATE_KEY,
        }
      );
    } catch (err) {
      console.error("Email sending failed:", err.message);
    }

    await pool.query(
      `UPDATE users SET first_name=$1, last_name=$2, avatar_url=$3, verification_code=$4 WHERE id=$5`,
      [
        firstName || userCheck.rows[0].first_name,
        lastName || userCheck.rows[0].last_name,
        avatarUrl || userCheck.rows[0].avatar_url,
        verificationCode,
        id,
      ]
    );

    res.status(200).json({
      success: true,
      message: "Verification code sent to email",
    });
  } catch (err) {
    console.error("Error updating user:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

const verifyCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { code } = req.body;

    const user = await pool.query("SELECT verification_code FROM users WHERE id=$1", [id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (parseInt(code) !== user.rows[0].verification_code) {
      return res.status(400).json({ success: false, message: "Invalid verification code" });
    }

    await pool.query("UPDATE users SET verification_code=NULL WHERE id=$1", [id]);

    res.status(200).json({ success: true, message: "User verified successfully" });
  } catch (err) {
    console.error("Error verifying code:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = { register , login ,getAllUsers,getUserById, updateUserInfo, verifyCode};