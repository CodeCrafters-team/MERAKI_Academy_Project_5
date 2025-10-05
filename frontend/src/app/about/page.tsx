"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function About() {
  useEffect(() => {
    // @ts-ignore
    void import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <main className="container py-5 mt-5">
      <section className="row align-items-center mb-5">
        <div className="col-md-6 animate__animated animate__fadeInLeft">
          <h1 className="fw-bold mb-3">
            About <span style={{color:"#49afff"}}>Smart<span style={{color:"#f59d01"}}>Path</span></span>
          </h1>
          <p className="text-muted">
            We believe education should be available to everyone, anytime,
            anywhere. SmartPath brings high-quality courses, expert instructors,
            and a supportive community together in one modern platform.
          </p>
          <div className="mt-4 d-flex gap-2">
         
            <a href="/login" className="btn btn-primary rounded-3 border-0">
              Get Started
            </a>
          </div>
        </div>

        <div className="col-md-6 text-center animate__animated animate__zoomIn">
          <Image
            src="/assets/aboutIMG.svg"
            alt="About Illustration"
            width={400}
            height={280}
            className="img-fluid rounded-4"
          />
        </div>
      </section>


    </main>
  );
}
