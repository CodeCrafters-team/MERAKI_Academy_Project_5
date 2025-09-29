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

const { pool } = require("../models/db");

const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;

    let {
      module_id,
      title,
      description,
      video_url,
      resources,      
      lesson_order,
      duration_sec,
      is_free_preview,
    } = req.body;

    const resourcesArray = Array.isArray(resources)
      ? resources
      : resources
      ? [resources]
      : null; 

    if (lesson_order !== undefined) {
      lesson_order = Number(lesson_order);
      if (Number.isNaN(lesson_order) || lesson_order < 0)
        return res.status(400).json({ success: false, message: "Invalid lesson_order" });
    }
    if (duration_sec !== undefined) {
      duration_sec = Number(duration_sec);
      if (Number.isNaN(duration_sec) || duration_sec < 0)
        return res.status(400).json({ success: false, message: "Invalid duration_sec" });
    }
    if (is_free_preview !== undefined) {
      is_free_preview = !!is_free_preview;
    }

    const sql = `
      UPDATE lessons
      SET
        module_id      = COALESCE($1, module_id),
        title          = COALESCE($2, title),
        description    = COALESCE($3, description),
        video_url      = COALESCE($4, video_url),
        resources      = COALESCE($5, resources),
        lesson_order   = COALESCE($6, lesson_order),
        duration_sec   = COALESCE($7, duration_sec),
        is_free_preview= COALESCE($8, is_free_preview)
      WHERE id = $9
      RETURNING *;
    `;

    const { rows } = await pool.query(sql, [
      module_id ?? null,
      title ?? null,
      description ?? null,
      video_url ?? null,
      resourcesArray,          
      lesson_order ?? null,
      duration_sec ?? null,
      is_free_preview ?? null,
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Lesson Not Found" });
    }

    res.status(200).json({
      success: true,
      message: "Lesson Updated Successfully",
      data: rows[0],
    });
  } catch (err) {
    if (err.code === "23503") {
      return res.status(400).json({ success: false, message: "Invalid module_id" });
    }
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};


module.exports={getAllLessons,getLessonById,createLesson,deleteLesson,getLessonByModulesId,updateLesson}