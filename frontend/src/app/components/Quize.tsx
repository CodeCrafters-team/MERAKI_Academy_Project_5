"use client";

import { useState, useEffect } from "react";
import { quizzes, Question } from "../components/data/quizzes";
import { useRouter } from "next/navigation";
import { BsCheckSquareFill } from "react-icons/bs";

interface QuizProps {
  courseId: string;
  onIssueCertificate?: () => void;
  issuing?: boolean;
  cert?: any;
}

export default function QuizPage({ courseId, onIssueCertificate, issuing, cert }: QuizProps) {
  const router = useRouter();
  const quizData: Question[] = quizzes[courseId] || [];

  const [start, setStart] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [nextAvailableTime, setNextAvailableTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");


  if (quizData.length === 0) {
    return (
      <div className="text-center">
        <div className="alert alert-info">No quiz available for this course.</div>
        {cert?.certificate_no ? (
          <button
            className="btn btn-primary border-0 mt-3"
            onClick={() => window.location.href = `/certificates/${cert.certificate_no}`}
          >
            Show Certificate
          </button>
        ) : (
          <button
            className="btn btn-success mt-3"
            disabled={!!issuing}
            onClick={onIssueCertificate}
          >
            {issuing ? "Issuing..." : "Get Certificate"}
          </button>
        )}
      </div>
    );
  }

  const handleStart = () => {
    const lastAttempt = localStorage.getItem(`quiz-${courseId}-lastAttempt`);
    if (lastAttempt) {
      const nextTime = parseInt(lastAttempt) + 7 * 24 *60 *60 * 60 * 1000; 
      if (Date.now() < nextTime) {
        setNextAvailableTime(nextTime);
        return; 
      }
    }
    setNextAvailableTime(null);
    setStart(true);
  };

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    const newAnswers = [...answers];
    newAnswers[currentQ] = index;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    setSelected(null);
    if (currentQ < quizData.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);
    }
  };

 
  useEffect(() => {
    if (showResult) {
      localStorage.setItem(`quiz-${courseId}-lastAttempt`, Date.now().toString());
    }
  }, [showResult, courseId]);

  useEffect(() => {
    if (!nextAvailableTime) return;

    const interval = setInterval(() => {
      const diff = nextAvailableTime - Date.now();
      if (diff <= 0) {
        clearInterval(interval);
        setNextAvailableTime(null);
        setTimeLeft("");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [nextAvailableTime]);

  const score = answers.reduce((acc, ans, i) => {
    if (ans === quizData[i].correctAnswer) return acc + 1;
    return acc;
  }, 0);

  return (
    <div className="p-3">
      {!start && !showResult && (
        <div className="text-center">
          <p className="mb-3 text-danger ">
            <BsCheckSquareFill /> You will only earn the certificate if you get a perfect score. Otherwise, you may need to try the quiz after 1 week from now!
          </p>

          {nextAvailableTime && timeLeft && (
            <div className="alert alert-warning">
              ⏳ You can retake this quiz after: <strong>{timeLeft}</strong>
            </div>
          )}

          <button className="btn btn-primary" onClick={handleStart} disabled={!!nextAvailableTime}>
            Start Quiz
          </button>
        </div>
      )}

      {start && !showResult && (
        <div>
          <h5 className="mb-3">Question {currentQ + 1}: {quizData[currentQ].question}</h5>
          <div className="d-grid gap-2 mb-3">
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
            <div className="text-start">
              <button className="btn btn-warning" onClick={handleNext}>
                {currentQ === quizData.length - 1 ? "See Result" : "Next Question"}
              </button>
            </div>
          )}
        </div>
      )}

      {showResult && (
        <div className="text-center mt-4">
          <h4>🎉 Your Score</h4>
          <p>{score} / {quizData.length}</p>

          {score === quizData.length ? (
            <div className="mt-3">
              <h5 className="text-success">Congratulations! You earned a certificate 🎓</h5>
              {cert?.certificate_no ? (
                <button
                  className="btn btn-primary mt-2 border-0"
                  onClick={() => window.location.href = `/certificates/${cert.certificate_no}`}
                >
                  Show Certificate
                </button>
              ) : (
                <button
                  className="btn btn-success mt-2"
                  disabled={!!issuing}
                  onClick={onIssueCertificate}
                >
                  {issuing ? "Issuing..." : "Get Certificate"}
                </button>
              )}
            </div>
          ) : (
            <div className="mt-3">
              <h5 className="text-danger">
                You need a perfect score to earn the certificate.
              </h5>
              <button
                className="btn btn-secondary"
                onClick={() => router.push(`/courses/${courseId}#overview`)}
              >
                Exit Quiz
              </button>
            </div>
          )}

          <div className="mt-3 text-start">
            {quizData.map((q, i) => (
              <div key={i} className="mb-2 p-2 border rounded">
                <strong>Q{i + 1}: {q.question}</strong>
                <ul className="list-unstyled mb-0">
                  {q.options.map((opt, j) => {
                    let colorClass = "";
                    if (j === q.correctAnswer) colorClass = "text-success";
                    else if (answers[i] === j && j !== q.correctAnswer) colorClass = "text-danger";
                    return <li key={j} className={colorClass}>{opt}</li>;
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
