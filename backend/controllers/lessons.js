const { pool } = require("../models/db");

const getAllLessons = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM lessons ORDER BY id ASC");

    if (!result.rows) {
      res.status(404).json({
        success: false,
        message: "No lessons Found",
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

const getLessonById = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query("SELECT * FROM lesson WHERE id = $1", [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Lesson Not Found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Fetched lesson Successfully",
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


  const createLesson = async (req, res) => {
    try {
      const { module_id, title, description, video_url, resousces, order, duration_sec,created_at,is_free_previev,module} = req.body;
  
      const result = await pool.query(
        `INSERT INTO lessons (module_id, title, description, video_url, resousces, order, duration_sec,created_at,is_free_previev,module)
         VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9,$10) RETURNING *`,
        [
          module_id || null,
          title,
          description || null,
          video_url || null,
        resousces || null, 
        order || null, 
        duration_sec || null,
          created_by || null,
          is_free_previev || null,
          module || null
        ]
      );
  
      res.status(201).json({
        success: true,
        message: "Lesson Created Successfully",
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


const deleteLesson = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query("DELETE FROM lessons WHERE id = $1 RETURNING *", [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Lesson Not Found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Lesson Deleted Successfully",
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




module.exports={getAllLessons,getLessonById,createLesson,deleteLesson}