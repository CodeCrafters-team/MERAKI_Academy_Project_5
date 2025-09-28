"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../redux/store";
import { logout } from "../../../redux/slices/authSlice";
import { useRouter } from "next/navigation";
import UserDialog from "../userDialog/userDialog";

const courses = [
  {
    title: "ARABIC",
    description: "تعلم اللغة العربية بسهولة وبطرق ممتعة",
    cover_url:
      "https://marketplace.canva.com/ympVo/MAEFC6ympVo/1/tl/canva-books-MAEFC6ympVo.jpg",
    price: 20,
  },
  {
    title: "ENGLISH",
    description: "English course for beginners",
    cover_url:
      "https://marketplace.canva.com/ympVo/MAEFC6ympVo/1/tl/canva-books-MAEFC6ympVo.jpg",
    price: 25,
  },
  {
    title: "MATH",
    description: "Learn math in a fun and interactive way",
    cover_url:
      "https://marketplace.canva.com/ympVo/MAEFC6ympVo/1/tl/canva-books-MAEFC6ympVo.jpg",
    price: 30,
  },
  {
    title: "SCIENCE",
    description: "Learn science in a fun way",
    cover_url:
      "https://marketplace.canva.com/ympVo/MAEFC6ympVo/1/tl/canva-books-MAEFC6ympVo.jpg",
    price: 35,
  },
  {
    title: "HISTORY",
    description: "Learn history easily",
    cover_url:
      "https://marketplace.canva.com/ympVo/MAEFC6ympVo/1/tl/canva-books-MAEFC6ympVo.jpg",
    price: 40,
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<typeof courses>([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const { token, avatarUrl } = useSelector((state: RootState) => state.auth);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    // @ts-ignore
    void import("bootstrap/dist/js/bootstrap.bundle.min.js");
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    if (value.length > 0) {
      const filtered = courses.filter(
        (course) =>
          course.title.toLowerCase().includes(value) ||
          course.description.toLowerCase().includes(value)
      );
      setResults(filtered.slice(0, 5));
    } else {
      setResults([]);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    handleCloseSheet();
  };

  const handleCloseSheet = () => {
    // setClosing(true);
    setSheetOpen(false);
    setClosing(false);
    // setTimeout(() => {

    // }, 400);
  };

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
            <a className="navbar-brand fw-bold" href="/">
              <img
                src="https://i.postimg.cc/GhSB7m8C/logo.png"
                alt=""
                style={{ width: "9em", height: "2em" }}
              />
            </a>
            <div className="d-flex justify-content-end gap-2">
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
              <ul className="navbar-nav ms-4 ms-lg-5 me-auto mb-2 mb-lg-0 d-flex gap-3">
                <li className="nav-item">
                  <a className="nav-link" href="/">
                    <b>Home</b>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/categories">
                    <b>Courses</b>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/about">
                    <b>About</b>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/contact">
                    <b>Contact</b>
                  </a>
                </li>
              </ul>

              <div className="container d-none d-lg-block align-self-center mt-lg-0">
                <div
                  style={{
                    position: "relative",
                    maxWidth: "350px",
                    margin: "0 auto",
                  }}
                >
                  <form
                    className="d-flex"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (search.trim().length > 0) {
                        const filtered = courses.filter(
                          (course) =>
                            course.title
                              .toLowerCase()
                              .includes(search.toLowerCase()) ||
                            course.description
                              .toLowerCase()
                              .includes(search.toLowerCase())
                        );
                        setResults(filtered.slice(0, 5));
                        if (
                          filtered.length === 1 &&
                          filtered[0].title.toLowerCase() ===
                            search.toLowerCase()
                        ) {
                          window.location.href = `/courses/${filtered[0].title.toLowerCase()}`;
                        }
                      } else {
                        setResults([]);
                      }
                    }}
                  >
                    <div className="input-group w-100">
                      <button
                        className="btn btn-outline-secondary"
                        type="submit"
                      >
                        <i className="bi bi-search"></i>
                      </button>
                      <input
                        type="search"
                        className="form-control"
                        placeholder="Search courses..."
                        value={search}
                        onChange={handleSearch}
                      />
                    </div>
                  </form>
                  {results.length > 0 && (
                    <ul
                      className="list-group position-absolute mt-2"
                      style={{
                        top: "100%",
                        left: 0,
                        width: "100%",
                        zIndex: 1050,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        borderRadius: "8px",
                        backgroundColor: "#fff",
                        overflowY: "auto",
                        maxHeight: "250px",
                      }}
                    >
                      {results.map((course, i) => (
                        <li
                          key={i}
                          className="list-group-item list-group-item-action d-flex align-items-center"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            window.location.href = `/courses/${course.title.toLowerCase()}`;
                          }}
                        >
                          <img
                            src={course.cover_url}
                            alt={course.title}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "50%",
                              marginRight: "10px",
                            }}
                          />
                          <b>{course.title}</b>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {!token ? (
                <button
                  className="btn btn-primary ms-lg-3 mt-3 mt-lg-0 rounded-3 border-0"
                  onClick={() => router.push("/login")}
                >
                  Login
                </button>
              ) : (
                <div className="d-flex align-items-center gap-3 ms-lg-3">
                  <i
                    className="bi bi-bell-fill fs-5"
                    style={{ cursor: "pointer", color: "#77B0E4" }}
                  ></i>
                  <i
                    className="bi bi-envelope-fill"
                    style={{
                      color: "#77B0E4",
                      fontSize: "1.5rem",
                      cursor: "pointer",
                    }}
                    onClick={() => router.push("/chat")}
                  ></i>

                  <img
                    src={
                      avatarUrl ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt="avatar"
                    className="rounded-circle"
                    style={{ width: "40px", height: "40px", cursor: "pointer" }}
                    onClick={() => setSheetOpen(true)}
                  />
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

      {sheetOpen && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            style={{ zIndex: 1050 }}
            onClick={handleCloseSheet}
          ></div>
          <div
            className={`position-fixed top-0 h-100 bg-white shadow-lg rounded-start animate__animated ${
              closing ? "animate__slideOutRight" : "animate__slideInRight"
            }`}
            style={{
              width: "340px",
              zIndex: 1055,
              right: 0,
              left: "auto",
            }}
          >
            <div className="d-flex flex-column h-100">
              <div className="d-flex align-items-center border-bottom p-3">
                <img
                  src={
                    avatarUrl ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="avatar"
                  className="rounded-circle me-3 border"
                  style={{ width: "55px", height: "55px", objectFit: "cover" }}
                />
                <div>
                  <h6 className="fw-bold mb-0">Username</h6>
                  <small className="text-muted">user@email.com</small>
                </div>
                <button
                  className="btn-close ms-auto"
                  onClick={handleCloseSheet}
                ></button>
              </div>
              <div className="flex-grow-1 p-3 d-flex flex-column gap-2">
                <button
                  className="btn btn-outline-primary text-start w-100 d-flex align-items-center gap-2"
                  onClick={() => {
                    router.push("/settings");
                    handleCloseSheet();
                  }}
                >
                  <i className="bi bi-gear-fill"></i> Settings
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
             
                    handleCloseSheet();
                      
                      setShowProfileModal(true)
    
                  }}
                >
                  Open Profile Modal
                </button>
                <button
                  className="btn btn-outline-primary text-start w-100 d-flex align-items-center gap-2"
                  onClick={() => {
                    router.push("/chat");
                    handleCloseSheet();
                  }}
                >
                  <i className="bi bi-chat-dots-fill"></i> Messages
                </button>
              </div>
              <div className="p-3 border-top">
                <button
                  className="btn btn-danger w-100 d-flex align-items-center gap-2 justify-content-center"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {showProfileModal && (
    
          
          <UserDialog onClose={() => setShowProfileModal(false)} />

      )}
    </header>
  );
}
