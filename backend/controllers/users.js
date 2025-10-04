const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../models/db");
const crypto = require("crypto");
const emailjs = require("@emailjs/nodejs");

const register = (req, res) => {
  const { firstName, lastName, age, email, password, avatarUrl } = req.body;

  if (!firstName || !lastName || !email || !password || !age) {
    return res.status(400).json({
      success: false,
      message: "firstName, lastName, email, age, password required",
    });
  }

  bcrypt
    .hash(password, 12)
    .then((passwordHash) => {
      const insertQuery = `
        INSERT INTO users (email, password_hash, first_name, last_name, avatar_url, role_id ,age)
        VALUES ($1, $2, $3, $4, $5 ,$6 ,$7)
        RETURNING *
      `;
      const role_id = 3;
      const values = [
        email.trim().toLowerCase(),
        passwordHash,
        firstName.trim(),
        lastName.trim(),
        avatarUrl || null,
        role_id,
        age
      ];

      return pool.query(insertQuery, values);
    })
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Account Created Successfully",
        user: result.rows[0],
      });
    })
    .catch((err) => {
      if (err.code === "23505") {
        return res.status(409).json({
          success: false,
          message: "The email already exists",
        });
      }

      res.status(500).json({
        success: false,
        message: "Server Error",
        err: err.message,
      });
    });
};

const login = (req, res) => {
  const email = req.body.email.trim().toLowerCase();
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "email & password required",
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
       u.phone_number ,
        u.country ,
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
          message: "Account is deactivated",
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
            permissions: user.permissions || [],
          },
        };

        const token = jwt.sign(payload, process.env.SECRET, {
          expiresIn: "24h",
        });

        delete user.password_hash;

        return res.status(200).json({
          success: true,
          message: "Valid login credentials",
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatarUrl: user.avatarUrl,
            phoneNumber: user.phone_number,
            country: user.country,
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
        message: "Server Error",
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
        message: "Server Error",
        err: err.message,
      });
    });
};

const getUserById = (req, res) => {
  const { id } = req.params;
  const userId = id;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: " user id required",
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
      u.phoneNumber   ,
      u.country   ,
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
          message: "User not found",
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
        message: "Server Error",
        err: err.message,
      });
    });
};

const forgotPassword = (req, res) => {
  console.log(process.env.EMAILJS_SERVICE_ID);
  console.log(process.env.EMAILJS_TEMPLATE_ID);
  console.log(process.env.EMAILJS_PUBLIC_KEY);
  console.log(process.env.EMAILJS_PRIVATE_KEY);
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  pool
    .query("SELECT id, first_name FROM users WHERE email = $1", [email])
    .then((result) => {
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Email not found" });
      }

      const user = result.rows[0];
      const code = crypto.randomInt(100000, 999999);

      return pool
        .query("UPDATE users SET verification_code = $1 WHERE id = $2", [
          code,
          user.id,
        ])
        .then(() => {
          return emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_TEMPLATE_ID,
            {
              to_email: email,
              to_name: user.first_name,
              code: code,
            },
            {
              publicKey: process.env.EMAILJS_PUBLIC_KEY,
              privateKey: process.env.EMAILJS_PRIVATE_KEY,
            }
          );
        })
        .then(() => {
          res
            .status(200)
            .json({ success: true, message: "Verification code sent" });
        });
    })
    .catch((err) => {
      console.error("Forgot password error:", err);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    });
};

const verifyResetCode = (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res
      .status(400)
      .json({ success: false, message: "Email and code are required" });
  }

  pool
    .query("SELECT id, verification_code FROM users WHERE email = $1", [email])
    .then((result) => {
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const user = result.rows[0];

      if (parseInt(code) !== user.verification_code) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid code" });
      }

      return pool
        .query("UPDATE users SET verification_code = NULL WHERE id = $1", [
          user.id,
        ])
        .then(() => {
          res
            .status(200)
            .json({
              success: true,
              message: "Code verified successfully",
              userId: user.id,
            });
        });
    })
    .catch((err) => {
      console.error("Verification error:", err.message);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    });
};
const resetPassword = (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Email and new password are required" });
  }

  pool
    .query("SELECT id FROM users WHERE email = $1", [email])
    .then((result) => {
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      return bcrypt.hash(newPassword, 12).then((hashed) => {
        return pool.query(
          "UPDATE users SET password_hash = $1 WHERE email = $2",
          [hashed, email]
        );
      });
    })
    .then(() => {
      res
        .status(200)
        .json({ success: true, message: "Password changed successfully" });
    })
    .catch((err) => {
      console.error("Reset password error:", err.message);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    });
};
const updateUser = (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, age, email, avatarUrl,phoneNumber,country } = req.body;

  const sql = `
   UPDATE users
SET
  first_name   = COALESCE($1, first_name),
  last_name    = COALESCE($2, last_name),
  age          = COALESCE($3, age),
  email        = COALESCE($4, email),
  avatar_url   = COALESCE($5, avatar_url),
  phone_number = COALESCE($6, phone_number),
  country      = COALESCE($7, country)
WHERE id = $8
RETURNING *
  `;

  pool
    .query(sql, [firstName, lastName, age, email, avatarUrl,phoneNumber,country, id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      res.status(200).json(rows[0]);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    });
};
const deleteUser = (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM users WHERE id = $1 RETURNING id`;

  pool
    .query(sql, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      res.status(200).json({ success: true, message: "User deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    });
};

const setUserRole = (req, res) => {
  const { id } = req.params;
  const { roleId } = req.body;

  if (!id || !roleId) {
    return res.status(400).json({ success: false, message: "user id and roleId required" });
  }

  const sql = `UPDATE users SET role_id = $1 WHERE id = $2 RETURNING id, role_id AS "roleId"`;

  pool
    .query(sql, [roleId, id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      res.status(200).json({ success: true, message: "Role updated", user: rows[0] });
    })
    .catch((err) => {
      console.error("setUserRole error:", err.message);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    });
};

// set user active status (ban/unban)
const setUserActive = (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  if (!id || typeof isActive !== "boolean") {
    return res.status(400).json({ success: false, message: "user id and boolean isActive required" });
  }

  const sql = `UPDATE users SET is_active = $1 WHERE id = $2 RETURNING id, is_active AS "isActive"`;

  pool
    .query(sql, [isActive, id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      res.status(200).json({ success: true, message: "Status updated", user: rows[0] });
    })
    .catch((err) => {
      console.error("setUserActive error:", err.message);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    });
};

module.exports = {
  register,
  login,
  getAllUsers,
  getUserById,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  updateUser,
  deleteUser,
  setUserRole,
  setUserActive
};

