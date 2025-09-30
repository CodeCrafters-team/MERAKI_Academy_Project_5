import React from "react";
import HeroSection from "./components/LottiePlayer/HeroSection";
import ContactSection from "./components/LottiePlayer/ContactSection";
import JoinSection from "./components/LottiePlayer/JoinSection";
import TestimonialsSection from "./components/OurStudents";

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
              <HeroSection />
            </div>
          </div>
        </div>
      </section>
      <section className="container py-5">
        <div className="row align-items-center g-5">
          <div className="col-12 col-lg-6 text-center">
            <ContactSection />
          </div>

          <div className="col-12 col-lg-6">
            <h2 className="fw-bold mb-3">Need Help? Get in Touch!</h2>
            <p className="text-muted mb-4">
              Our support team is here to assist you with any questions or
              issues. Reach out and we’ll respond as soon as possible.
            </p>
            <a href="/contact" className="btn btn-primary btn-lg px-4 border-0">
              Contact Us
            </a>
          </div>
        </div>
      </section>
<section className="container py-5">
  <div className="row align-items-center">
    <div className="col-md-6 order-2 order-md-1 text-center text-md-start">
      <h2 className="fw-bold mb-3">Become an Instructor</h2>
      <p
        className="lead text-muted mb-4 mx-auto mx-md-0"
        style={{ maxWidth: "520px" }}
      >
        Share your knowledge and inspire learners around the world. Join our
        network of expert instructors and start teaching online with ease.
      </p>
      <div className="d-flex justify-content-center justify-content-md-start gap-3">
        <a href="https://forms.gle/wTME4Wqy9BHLAYRL9" target="_blank" className="btn btn-primary btn-lg px-4 border-0">
          Join Now
        </a>
      </div>
    </div>

    <div className="col-md-6 order-1 order-md-2 mb-4 mb-md-0 text-center">
      <JoinSection />
    </div>
  </div>
  
</section>
<section> 
  <TestimonialsSection/>
</section>
    </>
  );
}
