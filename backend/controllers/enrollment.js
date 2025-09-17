 
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
    const { user_id, course_id, enrolled_at, username, course_name } = req.body;

    const result = await pool.query(
      `INSERT INTO enrollments (user_id, course_id, enrolled_at, username, course_name)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        user_id || null,
        course_id || null,
        enrolled_at || new Date(),
        username || null,
        course_name || null,
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




module.exports={getAllEnrollment,getEnrollmentById,getEnrollmentsByUser,createEnrollment,deleteEnrollment}