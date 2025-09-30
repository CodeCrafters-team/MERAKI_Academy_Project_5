const { pool } = require("../models/db");

const getAllCourses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        courses.id,
        courses.title,
        courses.description,
        courses.cover_url,
        courses.price,
        courses.is_published,
        courses.created_at,
        courses.updated_at,
        users.id,
        users.avatar_url,
        users.first_name,
        users.last_name,
        users.email
      FROM courses
      JOIN users ON courses.created_by = users.id
      ORDER BY courses.id ASC
    `);

    if (!result.rows) {
      res.status(404).json({
        success: false,
        message: "No Courses Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Fitched Data Succefully",
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      SELECT 
        c.id,
        c.category_id,
        c.title,
        c.description,
        c.cover_url,
        c.price,
        c.is_published,
        c.created_by,
        c.created_at,
        c.updated_at,
        u.first_name,
        u.last_name,
        u.email,
        u.avatar_url,
        u.bio
      FROM courses c
      LEFT JOIN users u ON u.id = c.created_by
      WHERE c.id = $1
      LIMIT 1
    `;
    const result = await pool.query(sql, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Fetched Course Successfully",
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

const createCourse = async (req, res) => {
  try {
    const { category_id, title, description, cover_url, price, is_published, created_by } = req.body;
    const result = await pool.query(
      `INSERT INTO courses (category_id, title, description, cover_url, price, is_published, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        category_id || null,
        title,
        description || null,
        cover_url || null,
        price || 0,
        is_published || false,
        created_by || null,
      ]
    );
    res.status(201).json({
      success: true,
      message: "Course Created Successfully",
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM courses WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Course Deleted Successfully",
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

const getCoursesByCategoryId = async (req, res) => {
  try {
    const { category_id } = req.params;
    const result = await pool.query(
      `SELECT 
        courses.id,
        courses.title,
        courses.description,
        courses.cover_url,
        courses.price,
        courses.is_published,
        courses.created_at,
        courses.updated_at,
        users.id AS user_id,
        users.avatar_url,
        users.first_name,
        users.last_name,
        users.email
      FROM courses
      JOIN users ON courses.created_by = users.id
      WHERE courses.category_id = $1
      ORDER BY courses.id ASC`,
      [category_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Courses Found For This Category",
      });
    }
    res.status(200).json({
      success: true,
      message: "Fetched Courses By Category Successfully",
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    let { title, description, price, cover_url, is_published, category_id } = req.body;

    if (price !== undefined) {
      price = Number(price);
      if (Number.isNaN(price) || price < 0) {
        return res.status(400).json({ success: false, message: "Invalid price" });
      }
    }
    if (is_published !== undefined) {
      is_published = !!is_published;
    }

    const sql = `
      UPDATE courses
      SET
        title        = COALESCE($1, title),
        description  = COALESCE($2, description),
        price        = COALESCE($3, price),
        cover_url    = COALESCE($4, cover_url),
        is_published = COALESCE($5, is_published),
        category_id  = COALESCE($6, category_id),
        updated_at   = NOW()
      WHERE id = $7
      RETURNING *;
    `;

    const { rows } = await pool.query(sql, [
      title ?? null,
      description ?? null,
      price ?? null,
      cover_url ?? null,
      is_published ?? null,
      category_id ?? null,
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Course Not Found" });
    }

    res.status(200).json({
      success: true,
      message: "Course Updated Successfully",
      data: rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};



const getTrendingCourses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM courses
      WHERE is_published = true
      ORDER BY created_at DESC
      LIMIT 8
    `);
    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMostSellingCourses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM courses
      WHERE is_published = true
      ORDER BY id DESC
      LIMIT 8
    `);
    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getCoursesByInstructor = async (req, res) => {
  try {
    const { id } = req.params; 

    const result = await pool.query(`
      SELECT 
        courses.id,
        courses.title,
        courses.description,
        courses.cover_url,
        courses.price,
        courses.is_published,
        courses.created_at,
        courses.updated_at,
        users.id AS instructor_id,
        users.avatar_url AS instructor_avatar,
        users.first_name AS instructor_first_name,
        users.last_name AS instructor_last_name,
        users.email AS instructor_email
      FROM courses
      JOIN users ON courses.created_by = users.id
      WHERE courses.created_by = $1
      ORDER BY courses.id ASC
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Courses Found for this Instructor",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fetched Instructor Courses Successfully",
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  deleteCourse,
  updateCourse,
  getCoursesByCategoryId,
  getTrendingCourses,
  getMostSellingCourses,
  getCoursesByInstructor
};
