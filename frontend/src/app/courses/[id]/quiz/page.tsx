"use client";

import { useState } from "react";
import { quizzes, Question } from "../../../components/data/quizzes";

export default function QuizPage({ params }: { params: { id: string } }) {
  const courseId = params.id;
  const quizData: Question[] = quizzes[courseId] || [];

  const [start, setStart] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  if (quizData.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h1 className="display-5">No quiz available for this course</h1>
      </div>
    );
  }

  const handleNext = () => {
    if (selectedOption !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQ] = selectedOption;
      setAnswers(newAnswers);
      setSelectedOption(null);

      if (currentQ < quizData.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        setShowResult(true);
      }
    }
  };

  const score = answers.reduce((acc, ans, i) => {
    if (ans === quizData[i].correctAnswer) return acc + 1;
    return acc;
  }, 0);

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5">Course #{courseId} Quiz</h1>

      {!start && !showResult && (
        <div className="text-center">
          <button className="btn btn-primary btn-lg" onClick={() => setStart(true)}>
            Start Quiz
          </button>
        </div>
      )}

      {start && !showResult && (
        <div className="card shadow p-4">
          <h4 className="mb-4">{quizData[currentQ].question}</h4>
          <div className="list-group mb-3">
            {quizData[currentQ].options.map((opt, i) => {
              let optionClass = "list-group-item list-group-item-action";
              if (selectedOption !== null) {
                if (i === quizData[currentQ].correctAnswer) optionClass += " list-group-item-success";
                else if (i === selectedOption && i !== quizData[currentQ].correctAnswer) optionClass += " list-group-item-danger";
              }

              return (
                <button
                  key={i}
                  type="button"
                  className={`${optionClass} text-start`}
                  onClick={() => setSelectedOption(i)}
                >
                  {opt}{" "}
                  {selectedOption !== null && i === selectedOption && (
                    <strong>{i === quizData[currentQ].correctAnswer ? "✔" : "✖"}</strong>
                  )}
                </button>
              );
            })}
          </div>

          <button
            className="btn btn-success"
            onClick={handleNext}
            disabled={selectedOption === null}
          >
            {currentQ === quizData.length - 1 ? "See Results" : "Next"}
          </button>
        </div>
      )}

      {showResult && (
        <div className="text-center">
          <h2 className="mb-4">🎉 Your Score</h2>
          <p className="h5 mb-4">{score} out of {quizData.length}</p>

          {quizData.map((q, i) => (
            <div key={i} className="card mb-3 shadow-sm">
              <div className="card-body text-start">
                <h6>{i + 1}. {q.question}</h6>
                <ul className="list-group mt-2">
                  {q.options.map((opt, j) => {
                    const isCorrect = j === q.correctAnswer;
                    const isSelected = answers[i] === j;
                    let className = "list-group-item";
                    if (isCorrect) className += " list-group-item-success";
                    else if (isSelected && !isCorrect) className += " list-group-item-danger";
                    return (
                      <li key={j} className={className}>
                        {opt} {isCorrect ? "✔" : isSelected ? "✖" : ""}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
