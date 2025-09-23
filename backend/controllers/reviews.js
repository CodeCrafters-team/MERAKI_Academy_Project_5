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

module.exports = {
  getReviewsByCourseId,
  createReview,
  updateReview,
  deleteReview,
};
