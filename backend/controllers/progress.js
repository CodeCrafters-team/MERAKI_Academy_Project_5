const { pool } = require("../models/db");


const completeLesson = async (req, res) => {
  const { user_id, lesson_id } = req.body || {};
  if (!user_id || !lesson_id)
    return res.status(400).json({ success: false, message: "userId & courseId required" });

  const sql = `
    INSERT INTO course_progress (user_id, lesson_id, is_completed)
    VALUES ($1, $2, TRUE)
    ON CONFLICT (user_id, lesson_id) DO UPDATE SET is_completed = TRUE
    RETURNING user_id, lesson_id, is_completed;
  `;
  try {
    const { rows } = await pool.query(sql, [user_id, lesson_id]);
    res.json({ success: true, data: rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};


const uncompleteLesson = async (req, res) => {
  const { user_id, lesson_id } = req.body || {};
  if (!user_id || !lesson_id)
    return res.status(400).json({ success: false, message:"userId & courseId required" });

  try {
    const { rows } = await pool.query(
      `UPDATE course_progress SET is_completed = FALSE
       WHERE user_id = $1 AND lesson_id = $2
       RETURNING user_id, lesson_id, is_completed;`,
      [user_id, lesson_id]
    );
    res.json({ success: true, data: rows[0] || { user_id, lesson_id, is_completed: false } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};


const getCourseProgress = async (req, res) => {
  const courseId = Number(req.params.courseId);
    const userId = req.user.id 
  if (!courseId || !userId)
    return res.status(400).json({ success: false, message: "userId & courseId required"});

  const sql = `
    SELECT
      COUNT(l.id) AS total_lessons,
      COALESCE(SUM(CASE WHEN cp.is_completed THEN 1 ELSE 0 END), 0) AS completed_lessons,
      ROUND(
        CASE WHEN COUNT(l.id)=0 THEN 0
             ELSE 100.0 * COALESCE(SUM(CASE WHEN cp.is_completed THEN 1 ELSE 0 END),0) / COUNT(l.id)
        END, 1
      ) AS progress_percent
    FROM lessons l
    JOIN modules m ON l.module_id = m.id
    LEFT JOIN course_progress cp
      ON cp.lesson_id = l.id AND cp.user_id = $1
    WHERE m.course_id = $2;
  `;
  try {
    const { rows } = await pool.query(sql, [userId, courseId]);
    const r = rows[0];
    res.json({
      success: true,
      data: {
        totalLessons: Number(r.total_lessons),
        completedLessons: Number(r.completed_lessons),
        progressPercent: Number(r.progress_percent),
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

const checkLessonComplete = async (req, res) => {
  const lessonId = Number(req.params.lessonId )
  const userId = req.user?.id; 

  if (!lessonId || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "userId & lessonId required" });
  }

  try {
    const { rows } = await pool.query(
      `SELECT is_completed
         FROM course_progress
        WHERE user_id = $1 AND lesson_id = $2
        LIMIT 1;`,
      [userId, lessonId]
    );

    const isCompleted = rows.length ? !!rows[0].is_completed : false;

    return res.json({
      success: true,
      data: { lessonId, isCompleted },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};


module.exports = { completeLesson, uncompleteLesson, getCourseProgress ,checkLessonComplete };
