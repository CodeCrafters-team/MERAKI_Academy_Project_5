"use client";

import { useState, useEffect } from "react";
import axios from "axios";

type Lesson = {
  id: number;
  title: string;
  duration_sec: number | null;
  video_url?: string;
  is_free_preview?: boolean;
};

const fmtDuration = (sec?: number | null) => {
  if (sec == null) return "";
  const m = Math.floor(sec / 60),
    s = sec % 60;
  return `${m}m${s ? ` ${s}s` : ""}`;
};

interface LessonModalProps {
  open: boolean;
  lesson: Lesson | null;
  coverUrl?: string | null;
  onClose: () => void;
  onMarkCompleted?: (lessonId: number) => void;
}

export default function LessonModal({
  open,
  lesson,
  onClose,
  onMarkCompleted,
}: LessonModalProps) {
  const API_BASE = "https://meraki-academy-project-5-anxw.onrender.com";

  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  });

  useEffect(() => {
    if (!lesson?.id) return;
    setIsCompleted(false);
    setLoading(true);
    axios
      .get(`${API_BASE}/progress/lesson/${lesson.id}`, {
        headers: authHeader(),
      })
      .then((res: any) => {
        const completed = Boolean(res?.data?.data?.isCompleted);
        setIsCompleted(completed);
      })
      .catch((err) => {
        console.error("Failed to fetch lesson progress:", err);
        setIsCompleted(false);
      })
      .finally(() => setLoading(false));
  }, [lesson?.id]);

  if (!lesson) return null;


  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      className={`position-fixed start-0 w-100 h-100 animate__animated animate__fadeIn `}
      style={{
        background: "rgba(0,0,0,.45)",
        zIndex: 1050,
        top: "2rem",
        pointerEvents: open ? "auto" : "none",
      }}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded shadow p-3 animate__animated animate__faster animate__zoomIn`}
        style={{ width: 920, maxWidth: "95%", margin: "4% auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex align-items-start justify-content-between mb-2">
          <div>
            <h5 className="mb-1">{lesson.title}</h5>
            <small className="text-muted">
              {lesson.duration_sec
                ? fmtDuration(lesson.duration_sec)
                : "No duration"}
              {lesson.is_free_preview ? " • Free preview" : ""}
            </small>
          </div>
        </div>

        <div className="mb-3">
          {lesson.video_url ? (
            <video
              key={lesson.id}
              controls
              className="w-100 rounded animate__animated animate__fadeIn"
              style={{ maxHeight: "60vh", background: "#000" }}
            >
              <source src="https://res.cloudinary.com/dkgru3hra/video/upload/v1758883311/jfjpxmg6vv0ambsfbxwc.mp4" type={"video/mp4"} />
              Your browser does not support HTML5 video.
            </video>
          ) : (
            <div className="alert alert-warning mb-0">
              No video URL for this lesson.
            </div>
          )}
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-outline-secondary" onClick={onClose}>
            Close
          </button>
          {!isCompleted ? (
            <button
              className="btn btn-success border-0"
              onClick={() => onMarkCompleted?.(lesson.id)}
              disabled={loading}
            >
              {loading ? "Loading..." : "Mark as completed"}
            </button>
          ) : (
            <button onClick={onClose} className="btn btn-success border-0">
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
