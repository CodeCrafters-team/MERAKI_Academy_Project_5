"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../redux/store";
import { logout } from "../../../redux/slices/authSlice";
import { useRouter } from "next/navigation";
import UserDialog from "../userDialog/userDialog"; 

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
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showUserDialog, setShowUserDialog] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const { token, avatarUrl, userId } = auth;

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
      const filtered = courses.filter(course =>
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
    setSheetOpen(false);
  };

  return (
    <header className="fixed-top">
      <div className={scrolled ? "container my-2 animate__animated animate__fadeInDown" : ""}>
        <nav className={`navbar navbar-expand-lg navbar-light ${scrolled ? "bg-light border rounded-4 shadow-sm px-2" : "bg-white border-bottom px-2"}`}>
          <div className="container-fluid">
            <a className="navbar-brand fw-bold" href="#">
              <img src="https://i.postimg.cc/GhSB7m8C/logo.png" alt="" style={{ width: "9em", height: "2em" }} />
            </a>

            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-outline-secondary d-lg-none rounded-3" type="button" data-bs-toggle="collapse" data-bs-target="#mobileSearch">
                <i className="bi bi-search"></i>
              </button>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>

            <div className="collapse navbar-collapse" id="mainNav">
              <ul className="navbar-nav ms-4 ms-lg-5 me-auto mb-2 mb-lg-0 d-flex gap-3">
                <li className="nav-item"><a className="nav-link" href="/home"><b>Home</b></a></li>
                <li className="nav-item"><a className="nav-link" href="#courses"><b>Courses</b></a></li>
                <li className="nav-item"><a className="nav-link" href="/about"><b>About</b></a></li>
                <li className="nav-item"><a className="nav-link" href="#contact"><b>Contact</b></a></li>
              </ul>

              {!token ? (
                <button
                  className="btn btn-primary ms-lg-3 mt-3 mt-lg-0 rounded-3 border-0"
                  onClick={() => router.push("/login")}
                >
                  Login
                </button>
              ) : (
                <div className="d-flex align-items-center gap-3 ms-lg-3">
                  <i className="bi bi-bell fs-5" style={{ cursor: "pointer", color: "#77B0E4" }}></i>
                  <i className="bi bi-chat-dots-fill" style={{ color: "#77B0E4", fontSize: "1.5rem", cursor: "pointer" }}
                    onClick={() => router.push("/chat")}
                  ></i>

                  <img
                    src={avatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
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
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1050 }}
            onClick={() => setSheetOpen(false)}
          ></div>

          <div
            className="position-fixed top-0 h-100 bg-white shadow rounded-3 p-4 d-flex flex-column"
            style={{
              width: "350px",
              zIndex: 1055,
              right: 0,
              transform: sheetOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.3s ease-in-out",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold m-0" style={{ color: "#77B0E4" }}>Edit profile</h5>
              <button
                className="btn-close"
                style={{ width: "0.8rem", height: "0.8rem" }}
                onClick={() => setSheetOpen(false)}
              ></button>
            </div>

            <button
              className="w-100 mb-3 text-white fw-bold"
              style={{
                backgroundColor: "#77B0E4",
                border: "none",
                padding: "0.75rem",
                borderRadius: "8px",
              }}
              onClick={() => {
                setShowUserDialog(true); 
                setSheetOpen(false);
              }}
            >
              Update Profile
            </button>

            <div className="flex-grow-1"></div>

            <button
              className="w-100 text-white fw-bold mt-3"
              style={{
                backgroundColor: "#F6A531",
                border: "none",
                padding: "0.75rem",
                borderRadius: "8px",
              }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </>
      )}

     {sheetOpen && userId !== null && (
  <UserDialog
    userId={userId}   
    onClose={() => setSheetOpen(false)}
  />
)}
    </header>
  );
}
