 
const {pool} = require("../models/db");

const getAllEnrollment = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM enrollments`);

    if (!result || result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Enrollment Not Found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Fetched Data Successfully",
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


const getEnrollmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM enrollments WHERE id=$1`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Enrollment Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fetched Data Successfully",
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


const getEnrollmentsByUser = async (req, res) => {
  try {
    const { user_id } = req.params

    const result = await pool.query(  `SELECT * FROM enrollments WHERE user_id = $1`,[user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No enrollments found for this user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fetched enrollments successfully",
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



const createEnrollment = async (req, res) => {
  try {
    const { user_id, course_id, e } = req.body;

    const result = await pool.query(
      `INSERT INTO enrollments (user_id, course_id)
       VALUES ($1, $2) RETURNING *`,
      [
        user_id ,
        course_id ,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Enrollment Created Successfully",
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


const deleteEnrollment = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`DELETE FROM enrollments WHERE id=$1 RETURNING *`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Enrollment Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enrollment Deleted Successfully",
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

const checkEnrollmentForUserCourse = async (req, res) => {
  try {
    const userId = req.user.id 
    const courseId = Number(req.params.courseId);
    if (!userId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "user_id and course_id are required",
      });
    }

    const q = `SELECT * FROM enrollments WHERE user_id=$1 AND course_id=$2 LIMIT 1`;
    const result = await pool.query(q, [userId, courseId]);

    return res.status(200).json({
      success: true,
      message: "Enrollment check",
      enrolled: result.rows.length > 0,
      data: result.rows[0] || null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};


module.exports={getAllEnrollment,getEnrollmentById,getEnrollmentsByUser,createEnrollment,deleteEnrollment , checkEnrollmentForUserCourse}