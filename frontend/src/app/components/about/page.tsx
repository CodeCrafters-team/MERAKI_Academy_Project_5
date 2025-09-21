"use client";

import { useEffect } from "react";

export default function About() {
  useEffect(() => {
    // @ts-ignore
    void import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <main className="container my-5">
      <section className="row align-items-center mb-5">
        <div className="col-md-6 animate__animated animate__fadeInLeft">
          <h1 className="fw-bold mb-3">
            About <span className="text-primary">SmartPath</span>
          </h1>
          <p className="text-muted">
            We believe education should be available to everyone, anytime,
            anywhere. SmartPath brings high-quality courses, expert instructors,
            and a supportive community together in one modern platform.
          </p>
          <div className="mt-4 d-flex gap-2">
            <a href="/category" className="btn btn-outline-primary rounded-3">
              Browse Courses
            </a>
            <a href="/login" className="btn btn-primary rounded-3 border-0">
              Get Started
            </a>
          </div>
        </div>
        <div className="col-md-6 text-center animate__animated animate__zoomIn">
          <img
            src="https://i.postimg.cc/GhSB7m8C/logo.png"
            alt="Illustration"
            className="img-fluid rounded-4 shadow-sm"
            style={{ maxHeight: "280px" }}
          />
        </div>
      </section>

      <section className="mb-5">
        <h2 className="fw-bold text-center mb-4">Our Values</h2>
        <div className="row g-4 text-center">
          <div className="col-md-4 animate__animated animate__fadeInUp">
            <div className="p-4 border rounded-4 shadow-sm h-100">
              <h5>Accessibility</h5>
              <p className="text-muted small">
                Courses for all levels, translated captions and mobile-friendly
                lessons.
              </p>
            </div>
          </div>
          <div className="col-md-4 animate__animated animate__fadeInUp animate__delay-1s">
            <div className="p-4 border rounded-4 shadow-sm h-100">
              <h5>Flexibility</h5>
              <p className="text-muted small">
                Learn at your own pace with on-demand videos and bite-sized
                lessons.
              </p>
            </div>
          </div>
          <div className="col-md-4 animate__animated animate__fadeInUp animate__delay-2s">
            <div className="p-4 border rounded-4 shadow-sm h-100">
              <h5>Quality</h5>
              <p className="text-muted small">
                Curated content from industry experts and practical projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-5 text-center">
        <h3 className="fw-bold mb-3">What learners say</h3>
        <blockquote className="fst-italic animate__animated animate__fadeInRight">
          "SmartPath helped me switch careers in 6 months — hands-on projects
          and supportive mentors made the difference."
        </blockquote>
        <p className="text-muted small">— Rana, Full-Stack Graduate</p>
      </section>

      <section className="text-center bg-light p-5 rounded-4 shadow-sm">
        <h4 className="fw-bold mb-2">Ready to start learning?</h4>
        <p className="text-muted mb-4">
          Join thousands of learners and take the next step in your career.
        </p>
        <a
          href="/register"
          className="btn btn-primary rounded-3 border-0 me-2 animate__animated animate__rubberBand"
        >
          Create account
        </a>
        <a href="/courses" className="btn btn-outline-primary rounded-3">
          Browse courses
        </a>
      </section>
    </main>
  );
}
