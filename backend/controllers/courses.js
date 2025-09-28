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
    users.id ,
    users.avatar_url,
    users.first_name ,
    users.last_name  ,
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
        u.first_name ,
        u.last_name  ,
        u.email      ,
        u.avatar_url ,
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
        error:   err.message,
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
    const { title, description, price } = req.body;

    const result = await pool.query(
      `UPDATE courses
       SET title = $1,
           description = $2,
           price = $3,
           updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [title, description, price, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course Updated Successfully",
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

    

module.exports={getAllCourses,getCourseById,createCourse,deleteCourse , getCoursesByCategoryId , updateCourse}