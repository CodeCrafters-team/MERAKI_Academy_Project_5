"use client";

import { useEffect, useState } from "react";
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // @ts-ignore
    void import("bootstrap/dist/js/bootstrap.bundle.min.js");

    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed-top">
      <div
        className={
          scrolled ? "container my-2 animate__animated animate__fadeInDown" : ""
        }
      >
        <nav
          className={`navbar navbar-expand-lg navbar-light ${
            scrolled
              ? "bg-light border rounded-4 shadow-sm px-2"
              : "bg-white border-bottom px-2"
          }`}
        >
          <div className="container-fluid">
            <a className="navbar-brand  fw-bold" href="#">
              <img
                src="https://i.postimg.cc/GhSB7m8C/logo.png"
                alt=""
                style={{ width: "9em", height: "2em" }}
              />
            </a>

            <div className="d-flex  justify-content-end  gap-2">
              <button
                className="btn btn-outline-secondary d-lg-none rounded-3"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#mobileSearch"
              >
                <i className="bi bi-search"></i>
              </button>

              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#mainNav"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>

            <div className="collapse navbar-collapse" id="mainNav">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link" href="#home">
                   <b>Home</b> 
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#courses">
                    <b>  Courses</b>
                   
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="login">
                   
                    <b> About</b>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#contact">
                    <b> Contact</b>
                   
                  </a>
                </li>
              </ul>
              <form className="d-none d-lg-flex">
                <div className="input-group">
                  <button className="btn btn-outline-secondary" type="submit">
                    <i className="bi bi-search"></i>
                  </button>
                  <input
                    style={{ width: "20em" }}
                    type="search"
                    className="form-control "
                    placeholder="Search courses..."
                  />
                </div>
              </form>
              <button className="btn btn-primary ms-lg-3 mt-3 mt-lg-0 rounded-3 border-0">
                Login
              </button>{" "}
            </div>
          </div>
        </nav>
      </div>

      <div
        id="mobileSearch"
        className="collapse d-lg-none bg-white border-bottom"
      >
        <div className="container-fluid py-2">
          <form className="d-flex gap-2">
            <input
              className="form-control"
              type="search"
              placeholder="Search courses..."
            />
          </form>
        </div>
      </div>
    </header>
  );
}
