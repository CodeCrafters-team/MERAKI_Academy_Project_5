import React from "react";
import LottiePlayer from "./components/LottiePlayer/LottiePlayer";

export default function Page() {
  return (
    <>
      <section className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6 order-2 order-md-1 text-center text-md-start">
            <h1 className="fw-bold mb-3">Learn from Experts, Anytime.</h1>
            <p
              className="lead text-muted mb-4 mx-auto mx-md-0"
              style={{ maxWidth: "520px" }}
            >
              Join live and recorded interactive classes, track your progress,
              and build job-ready skills with hands-on learning.
            </p>
            <div className="d-flex justify-content-center justify-content-md-start gap-3">
              <a
                href="#get-started"
                className="btn btn-primary btn-lg px-4 border-0"
              >
                Get Started
              </a>
            </div>
          </div>

          <div className="col-md-6 order-1 order-md-2 mb-4 mb-md-0 text-center">
            <div>
              <LottiePlayer />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
