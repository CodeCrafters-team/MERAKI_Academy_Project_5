import { pool } from "../models/db";




 const getUserResults = async (req, res) => {
  const { userId } = req.params;

  /* ur = اختصارuser_quiz_results
   q=اختصار quizzes*/
  try {
    const results = await pool.query(
      `SELECT ur.id, ur.quiz_id, q.title, ur.score, ur.submitted_at FROM user_quiz_results ur JOIN quizzes q ON ur.quiz_id = q.id
       WHERE ur.user_id = $1
       ORDER BY ur.submitted_at DESC`,
      [userId]
    );

    res.json(results.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

 const getUserResultById = async (req, res) => {
  const { resultId } = req.params;
 /* ua = اختصارuser_answers
   q=اختصار quizzes*/
  try {
    const result = await pool.query(
      `SELECT ur.id, ur.quiz_id, q.title, ur.score, ur.submitted_at FROM user_quiz_results ur JOIN quizzes q ON ur.quiz_id = q.id
       WHERE ur.id = $1`,
      [resultId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Result not found" });
    }

    const answers = await pool.query(
      `SELECT ua.id, ua.question_id, ua.answer_id, a.answer_text, a.is_correct, q.question_text
       FROM user_answers ua
       JOIN answers a ON ua.answer_id = a.id
       JOIN questions q ON ua.question_id = q.id
       WHERE ua.user_quiz_result_id = $1`,
      [resultId]
    );

    res.json({
      ...result.rows[0],
      answers: answers.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports={getUserResultById,getUserResults}