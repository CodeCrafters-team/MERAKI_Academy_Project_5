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
    RETURNING id, course_id, title, created_at 
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

const getModulesByCourse = (req, res) => {
  const { id } = req.params;
  const courseId = id;

  if (!courseId) {
    return res.status(400).json({ success: false, message: "courseId is required" });
  }

  const sql = `
    SELECT *
    FROM modules
    WHERE course_id = $1
  `;

  pool.query(sql, [courseId])
    .then(({ rows }) => {
      res.status(200).json({ success: true, modules: rows });
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    });
};


const updateModule = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: "module id is required" });
  }
  if (!title) {
    return res.status(400).json({ success: false, message: "title is required" });
  }

  const sql = `
    UPDATE modules
    SET title = $1
    WHERE id = $2
    RETURNING *
  `;

  pool.query(sql, [title.trim(), id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "Module not found" });
      }
      res.status(200).json({
        success: true,
        message: "Module updated successfully",
        module: rows[0],
      });
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    });
};


const deleteModule = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: "module id is required" });
  }

  const sql = `
    DELETE FROM modules
    WHERE id = $1
    RETURNING *
  `;

  pool.query(sql, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "Module not found" });
      }
      res.status(200).json({
        success: true,
        message: "Module deleted successfully",
      });
    })
    .catch((err) => {
      if (err.code === "23503") {
        return res.status(409).json({
          success: false,
          message: "Cannot delete module because related lessons exist",
        });
      }
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    });
};



module.exports = {
    createModule,
    getModulesByCourse,
    updateModule,
    deleteModule
};
 