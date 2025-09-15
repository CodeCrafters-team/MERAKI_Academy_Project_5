const { pool } = require("../models/db");

const createModule = (req, res) => {
  const { courseId, title } = req.body;

  if (!courseId || !title) {
    return res.status(400).json({
      success: false,
      message: "courseId and title are required",
    });
  }

  const sql = `
    INSERT INTO modules (course_id, title)
    VALUES ($1, $2)
    RETURNING id, course_id AS "courseId", title, created_at AS "createdAt"
  `;

  pool.query(sql, [courseId, title.trim()])
    .then(({ rows }) => {
      res.status(201).json({
        success: true,
        message: "Module created successfully",
        module: rows[0],
      });
    })
    .catch((err) => {
      if (err.code === "23503") {
        return res.status(400).json({ success: false, message: "Invalid courseId" });
      }
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    });
};

module.exports = {
    createModule
};
 