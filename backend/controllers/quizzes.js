import { pool } from "../models/db";
 const getAllQuizzes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM quizzes");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 const getQuizById = async (req, res) => {
  const { id } = req.params;
  try {
    const quiz = await pool.query("SELECT * FROM quizzes WHERE id = $1", [id]);

    if (quiz.rows.length === 0) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const questions = await pool.query(
      "SELECT * FROM questions WHERE quiz_id = $1",
      [id]
    );

    const answers = await pool.query(
      "SELECT * FROM answers WHERE question_id = ANY($1::int[])",
      [questions.rows.map(q => q.id)]
    );

    res.json({
      quiz: quiz.rows[0],
      questions: questions.rows.map(q => ({
        ...q,
        answers: answers.rows.filter(a => a.question_id === q.id),
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 const submitQuiz = async (req, res) => {
  const { userId, quizId, answers } = req.body; 
  try {
    const result = await pool.query(
      "INSERT INTO user_quiz_results (user_id, quiz_id, score) VALUES ($1, $2, 0) RETURNING id",
      [userId, quizId]
    );
    const userQuizResultId = result.rows[0].id;

    for (const answer of answers) {
      await pool.query(
        `INSERT INTO user_answers (user_quiz_result_id, question_id, answer_id, user_text_answer) 
         VALUES ($1, $2, $3, $4)`,
        [userQuizResultId, answer.questionId, answer.answerId || null, answer.textAnswer || null]
      );
    }

    const correctAnswers = await pool.query(
      `SELECT COUNT(*) AS correct_count
       FROM user_answers ua
       JOIN answers a ON ua.answer_id = a.id
       WHERE ua.user_quiz_result_id = $1
       AND a.is_correct = TRUE`,
      [userQuizResultId]
    );

    const score = correctAnswers.rows[0].correct_count;

    await pool.query(
      "UPDATE user_quiz_results SET score = $1 WHERE id = $2",
      [score, userQuizResultId]
    );

    res.json({ message: "Quiz submitted successfully", attemptId: userQuizResultId, score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports={getAllQuizzes,getQuizById,submitQuiz}