"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function NotFound() {
  useEffect(() => {
    // @ts-ignore
    void import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <main className="container text-center my-5">
      <div className="animate__animated animate__fadeIn">
        <h1
          className="display-3 fw-bold animate__animated animate__shakeX"
          style={{ color: "#77B0E4" }}
        >
          404
        </h1>
        <h2 className="fw-semibold mb-3" style={{ color: "#F6A531" }}>
          Page Not Found
        </h2>
        <p className="text-muted mb-4">
          Oops! The page you are looking for doesn’t exist or may have been
          moved.
        </p>

        <div className="d-flex justify-content-center gap-3">
          <Link
            href="/"
            className="btn rounded-3 border-0 animate__animated animate__pulse animate__infinite"
            style={{ backgroundColor: "#77B0E4", color: "white" }}
          >
            Back to Home
          </Link>
          <Link
            href="/courses"
            className="btn rounded-3"
            style={{
              backgroundColor: "#F6A531",
              color: "white",
              border: "none",
            }}
          >
            Browse Courses
          </Link>
        </div>

        <div className="mt-5">
          <img 
            src="/assets/notFound.jpg"
            alt="404 illustration"
            className="img-fluid rounded-4 shadow-sm animate__animated animate__zoomIn"
            style={{ maxWidth: "500px" }}
          />
        </div>
      </div>
    </main>
  );
}
