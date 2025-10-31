"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

interface Quiz {
  id: number;
  title: string;
  description?: string;
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://meraki-academy-project-5-anxw.onrender.com/quizzes", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        setQuizzes(res.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) return <p>Loading quizzes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>All Quizzes</h1>
      <ul>
        {quizzes.map((q) => (
          <li key={q.id}>
            <Link href={`/quizzes/${q.id}`}>{q.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
