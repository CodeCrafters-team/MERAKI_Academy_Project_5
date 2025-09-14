const { pool } = require("../models/db");

const getAllCourses = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM courses ORDER BY id ASC");

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
    res
      .status(500)
      .json({
        success: false,
        message: "Server Error",
        error:err.message ,
      });
  }
};

const getCourseById = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query("SELECT * FROM courses WHERE id = $1", [id]);
  
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
        error:   err.message,
      });
    }
  };
    

module.exports={getAllCourses,getCourseById,createCourse,deleteCourse}