const { pool } = require("../models/db");

const getReviewsByCourseId = (req, res) => {
  const { course_id } = req.params;

  if (!course_id) {
    return res.status(400).json({
      success: false,
      message: "course_id required",
    });
  }

  const sql = `
    SELECT
      r.id,
      r.course_id,
      r.user_id,
      r.rating,
      r.comment,
      r.created_at,
      u.first_name,
      u.last_name,
      u.avatar_url
    FROM reviews r
    LEFT JOIN users u ON u.id = r.user_id
    WHERE r.course_id = $1
    ORDER BY r.created_at DESC
  `;

  pool
    .query(sql, [course_id])
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Fetched reviews successfully",
        data: result.rows,
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

const createReview = (req, res) => {
  const { course_id, user_id, rating, comment } = req.body;

  if (!course_id || !user_id || !rating) {
    return res.status(400).json({
      success: false,
      message: "course_id, user_id, rating required",
    });
  }

  const sql = `
    INSERT INTO reviews (course_id, user_id, rating, comment)
    VALUES ($1, $2, $3, $4)
    RETURNING id, course_id, user_id, rating, comment, created_at
  `;

  pool
    .query(sql, [course_id, user_id, rating, comment || null])
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Review created successfully",
        data: result.rows[0],
      });
    })
    .catch((err) => {
      if (err.code === "23505") {
        return res.status(409).json({
          success: false,
          message: "User already reviewed this course",
        });
      }
      res.status(500).json({
        success: false,
        message: "Server Error",
        err: err.message,
      });
    });
};

const updateReview = (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "id required",
    });
  }

  const sql = `
    UPDATE reviews
    SET
      rating  = COALESCE($1, rating),
      comment = COALESCE($2, comment)
    WHERE id = $3
    RETURNING id, course_id, user_id, rating, comment, created_at
  `;

  pool
    .query(sql, [rating ?? null, comment ?? null, id])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Review not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Review updated successfully",
        data: result.rows[0],
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

const deleteReview = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "id required",
    });
  }

  pool
    .query(`DELETE FROM reviews WHERE id = $1 RETURNING *`, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Review not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Review deleted successfully",
        data: result.rows[0],
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

const getInstructorReviews = async (req, res) => {
  try {
    const { id } = req.params; 
    if (!id) {
      return res.status(400).json({ success: false, message: "instructor id required" });
    } 

     const sql = `
      SELECT
        c.id AS course_id,
        c.title AS course_title,
        c.cover_url,
        c.price,
        c.is_published,
        COUNT(DISTINCT e.user_id) AS student_count, 
        COUNT(r.id) AS review_count,
        COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) AS avg_rating,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', r.id,
              'user_id', r.user_id,
              'rating', r.rating,
              'comment', r.comment,
              'created_at', r.created_at,
              'first_name', u.first_name,
              'last_name',  u.last_name,
              'avatar_url', u.avatar_url
            )
            ORDER BY r.created_at DESC
          ) FILTER (WHERE r.id IS NOT NULL),
          '[]'
        ) AS reviews
      FROM courses c
      LEFT JOIN reviews r ON r.course_id = c.id
      LEFT JOIN users   u ON u.id = r.user_id
      LEFT JOIN enrollments e ON e.course_id = c.id 
      WHERE c.created_by = $1
      GROUP BY c.id, c.title, c.cover_url, c.price, c.is_published
      ORDER BY c.id;
    `;

    const { rows } = await pool.query(sql, [id]);

    return res.status(200).json({
      success: true,
      message: "Fetched instructor reviews successfully",
      data: rows, 
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};


module.exports = {
  getReviewsByCourseId,
  createReview,
  updateReview,
  deleteReview,
  getInstructorReviews
};
