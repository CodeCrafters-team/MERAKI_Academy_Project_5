"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface Answer {
  id: number;
  answer_text: string;
}

interface Question {
  id: number;
  question_text: string;
  answers: Answer[];
}

interface Quiz {
  id: number;
  title: string;
  description?: string;
  questions: Question[];
}

export default function QuizDetailPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;
      const token = localStorage.getItem("token");
      const res = await axios.get(`https://meraki-academy-project-5-anxw.onrender.com/quizzes/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      setQuiz(res.data.quiz);
      setLoading(false);
    };

    fetchQuiz();
  }, [id]);

  if (loading) return <p>Loading quiz...</p>;
  if (!quiz) return <p>No quiz found</p>;

  return (
    <div>
      <h1>{quiz.title}</h1>
      <p>{quiz.description}</p>
      {quiz.questions.map((q) => (
        <div key={q.id}>
          <h3>{q.question_text}</h3>
          <ul>
            {q.answers.map((a) => (
              <li key={a.id}>{a.answer_text}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
