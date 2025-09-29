"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../redux/store";
import { logout } from "../../../redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { Bell, MessageCircle } from "react-feather";

const courses = [
  { title: "ARABIC", description: "تعلم اللغة العربية بسهولة وبطرق ممتعة", cover_url: "https://marketplace.canva.com/ympVo/MAEFC6ympVo/1/tl/canva-books-MAEFC6ympVo.jpg", price: 20 },
  { title: "ENGLISH", description: "English course for beginners", cover_url: "https://marketplace.canva.com/ympVo/MAEFC6ympVo/1/tl/canva-books-MAEFC6ympVo.jpg", price: 25 },
  { title: "MATH", description: "Learn math in a fun and interactive way", cover_url: "https://marketplace.canva.com/ympVo/MAEFC6ympVo/1/tl/canva-books-MAEFC6ympVo.jpg", price: 30 },
  { title: "SCIENCE", description: "Learn science in a fun way", cover_url: "https://marketplace.canva.com/ympVo/MAEFC6ympVo/1/tl/canva-books-MAEFC6ympVo.jpg", price: 35 },
  { title: "HISTORY", description: "Learn history easily", cover_url: "https://marketplace.canva.com/ympVo/MAEFC6ympVo/1/tl/canva-books-MAEFC6ympVo.jpg", price: 40 }
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

  useEffect(() => {
    void import("bootstrap/dist/js/bootstrap.bundle.min.js");

    const onScroll = () => setScrolled(window.scrollY > 40);
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setSheetOpen(false);
        setClosing(false);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    setSearch(val);
    if (val.length === 0) {
      setResults([]);
      return;
    }
    const filtered = courses.filter(c =>
      c.title.toLowerCase().includes(val) ||
      c.description.toLowerCase().includes(val)
    );
    setResults(filtered.slice(0, 5));
  };

  const handleLogout = () => {
    dispatch(logout());
    closeSheet();
  };

  const closeSheet = () => {
    setClosing(true);
    setTimeout(() => {
      setSheetOpen(false);
      setClosing(false);
    }, 400);
  };

  return (
    <header className={`fixed-top ${scrolled ? "bg-light border shadow-sm" : "bg-white border-bottom"}`}>
      <nav className="container d-flex align-items-center py-2">
        <a href="/" className="d-flex align-items-center me-3" style={{ minWidth: "120px" }}>
          <img src="https://i.postimg.cc/GhSB7m8C/logo.png" alt="SmartPath" style={{ width: "9em", height: "2em" }} />
        </a>

        <ul className="nav d-none d-md-flex gap-3 me-auto">
          <li><a href="/" className="nav-link px-2 fw-bold">Home</a></li>
          <li><a href="/categories" className="nav-link px-2 fw-bold">Courses</a></li>
          <li><a href="/about" className="nav-link px-2 fw-bold">About</a></li>
          <li><a href="/contact" className="nav-link px-2 fw-bold">Contact</a></li>
        </ul>

        <div className="d-flex align-items-center flex-grow-1 me-3" style={{ maxWidth: "400px" }}>
          <form className="input-group w-100" onSubmit={e => e.preventDefault()}>
            <button className="btn btn-outline-secondary" type="submit">
              <i className="bi bi-search"></i>
            </button>
            <input
              type="search"
              className="form-control"
              placeholder="Search courses..."
              value={search}
              onChange={handleSearchChange}
            />
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
                  onClick={() => (window.location.href = `/courses/${course.title.toLowerCase()}`)}
                >
                  <img
                    src={course.cover_url}
                    alt={course.title}
                    style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "50%", marginRight: "10px" }}
                  />
                  <b>{course.title}</b>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="d-flex align-items-center gap-3 me-3">
          {!token ? (
            <button className="btn btn-primary rounded-3 px-3" onClick={() => router.push("/login")}>
              Login
            </button>
          ) : (
            <>
              <Bell size={20} color="#77B0E4" style={{ cursor: "pointer" }} />
              <MessageCircle size={20} color="#77B0E4" style={{ cursor: "pointer" }} onClick={() => router.push("/chat")} />
              <img
                src={avatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt="avatar"
                className="rounded-circle"
                style={{ width: "40px", height: "40px", cursor: "pointer" }}
                onClick={() => setSheetOpen(true)}
              />
            </>
          )}
        </div>

        <button
          className="btn btn-outline-secondary d-md-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list fs-3"></i>
        </button>
      </nav>

      <div className="collapse" id="navbarCollapse">
        <ul className="nav flex-column p-3 border-top">
          <li><a href="/" className="nav-link fw-bold">Home</a></li>
          <li><a href="/categories" className="nav-link fw-bold">Courses</a></li>
          <li><a href="/about" className="nav-link fw-bold">About</a></li>
          <li><a href="/contact" className="nav-link fw-bold">Contact</a></li>
        </ul>
      </div>

      {sheetOpen && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            style={{ zIndex: 1050 }}
            onClick={closeSheet}
          />
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
                  src={avatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt="avatar"
                  className="rounded-circle me-3 border"
                  style={{ width: "55px", height: "55px", objectFit: "cover" }}
                />
                <div>
                  <h6 className="fw-bold mb-0">Username</h6>
                  <small className="text-muted">user@email.com</small>
                </div>
                <button className="btn-close ms-auto" onClick={closeSheet} />
              </div>
              <div className="flex-grow-1 p-3 d-flex flex-column gap-2">
                <button className="btn btn-outline-primary text-start w-100 d-flex align-items-center gap-2" onClick={() => { router.push("/settings"); closeSheet(); }}>
                  <i className="bi bi-gear-fill"></i> Settings
                </button>
                <button className="btn btn-outline-primary text-start w-100 d-flex align-items-center gap-2" onClick={() => { router.push("/update-profile"); closeSheet(); }}>
                  <i className="bi bi-person-lines-fill"></i> Update Profile
                </button>
                <button className="btn btn-outline-primary text-start w-100 d-flex align-items-center gap-2" onClick={() => { router.push("/chat"); closeSheet(); }}>
                  <i className="bi bi-chat-dots-fill"></i> Messages
                </button>
              </div>
              <div className="p-3 border-top">
                <button className="btn btn-danger w-100 d-flex align-items-center gap-2 justify-content-center" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
