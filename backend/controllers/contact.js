const { pool } = require("../models/db");

const createContact = (req, res) => {
  const { email, firstName, lastName, message } = req.body;

  if (!email || !firstName || !lastName || !message) {
    return res.status(400).json({
      success: false,
      message: "email, firstName, lastName, and message are required",
    });
  }

  const insertQuery = `
    INSERT INTO contact (email, first_name, last_name, message)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const values = [email.trim().toLowerCase(), firstName.trim(), lastName.trim(), message.trim()];

  pool
    .query(insertQuery, values)
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Contact message created successfully",
        contact: result.rows[0],
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err.message,
      });
    });
};

const getAllContacts = (req, res) => {
  const sql = `
    SELECT id, email, first_name AS "firstName", last_name AS "lastName", message, created_at AS "createdAt"
    FROM contact
    ORDER BY created_at DESC
  `;

  pool
    .query(sql)
    .then(({ rows }) => {
      res.status(200).json({
        success: true,
        contacts: rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err.message,
      });
    });
};

const deleteContactById = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Contact id is required",
    });
  }

  const sql = `DELETE FROM contact WHERE id = $1 RETURNING *`;

  pool
    .query(sql, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Contact not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Contact deleted successfully",
        deleted: rows[0],
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err.message,
      });
    });
};

module.exports = {
  createContact,
  getAllContacts,
  deleteContactById,
};
