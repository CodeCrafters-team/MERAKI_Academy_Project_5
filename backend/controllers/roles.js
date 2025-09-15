const { pool } = require("../models/db");



const createRole = (req, res) => {
  const { name, permissions } = req.body;

  const normName = String(name || '').trim();
  if (!normName) {
    return res.status(400).json({ success: false, message: 'name is required' });
  }

  const normPerms = permissions.map(perm => perm.trim());

  pool
    .query('SELECT id FROM roles WHERE LOWER(name) = LOWER($1) LIMIT 1', [normName])
    .then(({ rows }) => {
      if (rows.length > 0) {
        return res.status(409).json({ success: false, message: 'Role name already exists' });
      }
      return pool.query(
        `INSERT INTO roles (name, permissions)
         VALUES ($1, $2)
         RETURNING id, name, permissions, created_at AS "createdAt"`,
        [normName, normPerms]
      )
      .then(({ rows }) =>
        res.status(201).json({
          success: true,
          message: 'Role created',
          role: rows[0],
        })
      );
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: 'Server Error', err: err.message });
    });
};
 
const getAllRoles = (req, res) => {
  const sql = `
 SELECT * FROM roles
  `;
  pool
    .query(sql)
    .then(({ rows }) => {
      res.status(200).json({ success: true, roles: rows });
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: 'Server Error', err: err.message });
    });
};

module.exports = {createRole
    ,getAllRoles
};
