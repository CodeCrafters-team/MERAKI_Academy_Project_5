"use client";

import { useState } from "react";
import { quizzes, Question } from "../components/data/quizzes";

interface QuizProps {
  courseId: string;
}

export default function QuizPage({ courseId}: QuizProps) {
  const quizData: Question[] = quizzes[courseId] || [];

  const [start, setStart] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  if (quizData.length === 0) {
    return <div className="p-3 text-center">No quiz available for this course.</div>;
  }

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    const newAnswers = [...answers];
    newAnswers[currentQ] = index;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQ < quizData.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
    } else {
      setShowResult(true);
    }
  };

  const score = answers.reduce((acc, ans, i) => {
    if (ans === quizData[i].correctAnswer) return acc + 1;
    return acc;
  }, 0);

  return (
    <div className="p-3">
     
      {!start && !showResult && (
        <button className="btn btn-primary" onClick={() => setStart(true)}>
          Start Quiz
        </button>
      )}

      {start && !showResult && (
        <div>
          <h5 className="mb-3">{quizData[currentQ].question}</h5>
          <div className="d-flex flex-column gap-2">
            {quizData[currentQ].options.map((opt, i) => {
              let className = "btn btn-outline-primary text-start";
              if (selected !== null) {
                if (i === quizData[currentQ].correctAnswer) className = "btn btn-success text-start";
                else if (i === selected && i !== quizData[currentQ].correctAnswer) className = "btn btn-danger text-start";
              }
              return (
                <button
                  key={i}
                  className={className}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <button className="btn btn-warning mt-3" onClick={handleNext}>
              {currentQ === quizData.length - 1 ? "Show Result" : "Next Question"}
            </button>
          )}
        </div>
      )}

      {showResult && (
        <div className="text-center">
          <h4 className="mt-3">🎉 Your Score</h4>
          <p>
            {score} / {quizData.length}
          </p>
        </div>
      )}
    </div>
  );
}
