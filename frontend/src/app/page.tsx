"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  return (
    <>
      <section
        className="d-flex align-items-center justify-content-center text-center"
        style={{
          height: "100vh",
          background:
            "url(https://i.postimg.cc/1zbJdRZd/back.png) no-repeat center center / cover",
          color: "white",
          position: "relative",
        }}
        data-aos="fade-up"
      >
        <div className="container">
          <h1 className="display-4 fw-bold" style={{ fontSize: "3.8rem", color: "#F6A531" }}>
            Learn Anytime, Anywhere
          </h1>
          <p className="lead mb-4" style={{ fontSize: "1.4rem", color: "#fff" }}>
            Join our platform and start your learning journey today with expert instructors and flexible schedules.
          </p>
          <a
            href="#courses"
            className="btn btn-primary btn-lg"
            style={{
              backgroundColor: "#77B0E4",
              padding: "12px 40px",
              borderRadius: "50px",
              fontSize: "1.1rem",
              transition: "background-color 0.3s ease",
            }}
          >
            Get Started
          </a>
        </div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.3)",
            zIndex: "-1",
          }}
        ></div>
      </section>

      <div
        style={{
          width: "0",
          height: "0",
          borderLeft: "50vw solid transparent",
          borderRight: "50vw solid transparent",
          borderTop: "60px solid #77B0E4",
          marginTop: "-1px",
        }}
      ></div>

      <section className="py-5" style={{ backgroundColor: "#f8f9fa" }} data-aos="fade-up">
        <div className="container text-center">
          <div className="row">
            <div className="col-md-6 mb-4">
              <h2 className="fw-bold" style={{ color: "#77B0E4", fontSize: "2.8rem" }}>About SmartPath</h2>
              <p className="lead mb-4" style={{ fontSize: "1.2rem", color: "#555" }}>
                SmartPath is an innovative platform that aims to provide accessible, flexible, and world-class learning experiences. Whether you are looking to enhance your current skills or explore new fields, we are here to guide you.
              </p>
              <ul className="list-unstyled" style={{ fontSize: "1.1rem", color: "#555" }}>
                <li><i className="bi bi-check-circle" style={{ color: "#77B0E4" }}></i> World-class instructors</li>
                <li><i className="bi bi-check-circle" style={{ color: "#77B0E4" }}></i> Flexible learning schedules</li>
                <li><i className="bi bi-check-circle" style={{ color: "#77B0E4" }}></i> Accessible from anywhere</li>
                <li><i className="bi bi-check-circle" style={{ color: "#77B0E4" }}></i> Personalized learning paths</li>
              </ul>
            </div>

            <div className="col-md-6 mb-4">
              <h2 className="fw-bold" style={{ color: "#77B0E4", fontSize: "2.8rem" }}>Why Choose Us?</h2>
              <ul className="list-unstyled" style={{ fontSize: "1.1rem", color: "#555" }}>
                <li><i className="bi bi-person-check" style={{ color: "#77B0E4" }}></i> Expert Instructors</li>
                <li><i className="bi bi-laptop" style={{ color: "#77B0E4" }}></i> Online Courses</li>
                <li><i className="bi bi-award" style={{ color: "#77B0E4" }}></i> Certified Courses</li>
                <li><i className="bi bi-support" style={{ color: "#77B0E4" }}></i> 24/7 Support</li>
              </ul>
            </div>
          </div>
        </div>
        <div
          style={{
            width: "0", 
            height: "0", 
            borderLeft: "50vw solid transparent", 
            borderRight: "50vw solid transparent", 
            borderTop: "60px solid #77B0E4",
            marginTop: "-1px",
          }}
        ></div>
      </section>

      <section
        id="courses"
        className="py-5"
        style={{ backgroundColor: "#f8f9fa" }}
        data-aos="fade-up"
      >
        <div className="container text-center">
          <h2 className="fw-bold" style={{ color: "#77B0E4", fontSize: "2.5rem" }}>
            Featured Courses
          </h2>
          <p className="lead mb-4" style={{ color: "#555", fontSize: "1.1rem" }}>
            Explore our most popular courses taught by industry leaders.
          </p>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card shadow-lg border-0 rounded-3">
                <img
                  src="https://via.placeholder.com/350x200"
                  className="card-img-top"
                  alt="Course 1"
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    transition: "transform 0.3s",
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title" style={{ fontSize: "1.3rem", color: "#77B0E4" }}>
                    Web Design & Development
                  </h5>
                  <p className="card-text" style={{ color: "#555" }}>
                    Learn the fundamentals of web design and development with hands-on projects.
                  </p>
                  <p className="text-primary">$149.00</p>
                  <a href="#" className="btn btn-primary" style={{ backgroundColor: "#F6A531" }}>
                    Join Now
                  </a>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card shadow-lg border-0 rounded-3">
                <img
                  src="https://via.placeholder.com/350x200"
                  className="card-img-top"
                  alt="Course 2"
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    transition: "transform 0.3s",
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title" style={{ fontSize: "1.3rem", color: "#77B0E4" }}>
                    Graphic Design Mastery
                  </h5>
                  <p className="card-text" style={{ color: "#555" }}>
                    Master the art of graphic design with Photoshop, Illustrator, and more.
                  </p>
                  <p className="text-primary">$199.00</p>
                  <a href="#" className="btn btn-primary" style={{ backgroundColor: "#F6A531" }}>
                    Join Now
                  </a>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card shadow-lg border-0 rounded-3">
                <img
                  src="https://via.placeholder.com/350x200"
                  className="card-img-top"
                  alt="Course 3"
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    transition: "transform 0.3s",
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title" style={{ fontSize: "1.3rem", color: "#77B0E4" }}>
                    SEO Masterclass
                  </h5>
                  <p className="card-text" style={{ color: "#555" }}>
                    Learn how to optimize websites for search engines and increase traffic.
                  </p>
                  <p className="text-primary">$179.00</p>
                  <a href="#" className="btn btn-primary" style={{ backgroundColor: "#F6A531" }}>
                    Join Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5" style={{ backgroundColor: "#f2f2f2" }} data-aos="fade-up">
        <div className="container text-center">
          <h2 className="fw-bold" style={{ color: "#77B0E4", fontSize: "2.5rem" }}>What Our Students Say</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="testimonial-box p-4 bg-white rounded shadow-sm">
                <img
                  src="https://via.placeholder.com/100"
                  alt="John Doe"
                  className="rounded-circle mb-3"
                  style={{ width: "100px", height: "100px" }}
                />
                <p>"This platform helped me gain new skills and get certified. I feel more confident in my career now!"</p>
                <p><strong>John Doe</strong></p>
                <p>Web Development</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="testimonial-box p-4 bg-white rounded shadow-sm">
                <img
                  src="https://via.placeholder.com/100"
                  alt="Jane Smith"
                  className="rounded-circle mb-3"
                  style={{ width: "100px", height: "100px" }}
                />
                <p>"The courses were so engaging and easy to follow. I learned a lot and now I have a great job!"</p>
                <p><strong>Jane Smith</strong></p>
                <p>Graphic Design</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="testimonial-box p-4 bg-white rounded shadow-sm">
                <img
                  src="https://via.placeholder.com/100"
                  alt="Emily Brown"
                  className="rounded-circle mb-3"
                  style={{ width: "100px", height: "100px" }}
                />
                <p>"The instructors are very knowledgeable, and the courses have helped me land my dream job."</p>
                <p><strong>Emily Brown</strong></p>
                <p>Digital Marketing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ backgroundColor: "#333", color: "white", padding: "30px 0" }}>
        <div className="container text-center">
          <h4 className="mb-3">Follow Us</h4>
          <div className="d-flex justify-content-center mb-4">
            <a href="#" className="text-white mx-3 fs-3">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" className="text-white mx-3 fs-3">
              <i className="bi bi-twitter"></i>
            </a>
            <a href="#" className="text-white mx-3 fs-3">
              <i className="bi bi-linkedin"></i>
            </a>
            <a href="#" className="text-white mx-3 fs-3">
              <i className="bi bi-instagram"></i>
            </a>
          </div>
          <p>&copy; 2025 **smartPath**. All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
}
