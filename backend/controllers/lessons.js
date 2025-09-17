const { pool } = require("../models/db");

const getAllLessons = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM lessons ORDER BY id ASC");

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "No lessons Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Fetched Data Succefully",
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
      const result = await pool.query("SELECT * FROM lessons WHERE id = $1", [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Lesson Not Found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Fetched lesson Successfully",
        data: result.rows[0]
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Server Error",
        error: err.message,
      });
    }
  };

const getLessonByModulesId=async(req,res)=>{
    const {module_id}=req.params    
try{
if (!module_id){
    return res.status(404).json({
          success: false,
          message: "Module id is requried",
        });
}
const result=await pool.query(`SELECT * FROM  lessons WHERE module_id=$1`,[module_id])
 if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Lesson Not Found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Fetched lesson Successfully",
        data: result.rows,
      });

}catch(err){
res.status(500).json({
        success: false,
        message: "Server Error",
        error: err.message,
      });
}



}



const createLesson = async (req, res) => {
  try {
    const {
      module_id,
      title,
      description,
      video_url,
      resources,
      lesson_order,
      duration_sec,
      is_free_preview
    } = req.body;

  
    const resourcesArray = Array.isArray(resources) ? resources : resources ? [resources] : [];

    const result = await pool.query(
      `INSERT INTO lessons
        (module_id, title, description, video_url, resources, "lesson_order", duration_sec, created_at, is_free_preview)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        module_id || null,
        title,
        description || null,
        video_url || null,
        resourcesArray,
        lesson_order || null,
        duration_sec || null,
        new Date(),
        is_free_preview || false
      ]
    );

    res.status(201).json({
      success: true,
      message: "Lesson Created Successfully",
      data: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message
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




module.exports={getAllLessons,getLessonById,createLesson,deleteLesson,getLessonByModulesId}