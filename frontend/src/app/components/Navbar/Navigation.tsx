"use client";


import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../redux/store";
import { logout } from "../../../redux/slices/authSlice";
import { useRouter } from "next/navigation";

const courses = [
  {
    title: "ARABIC",
    description: "تعلم اللغة العربية بسهولة وبطرق ممتعة",
    cover_url: "https://marketplace.canva.com/ympVo/MAEFC6ympVo/1/tl/canva-books-MAEFC6ympVo.jpg",
    price: 20,
  },
  {
    title: "ENGLISH",
    description: "English course for beginners",
    cover_url: "https://marketplace.canva.com/ympVo/MAEFC6ympVo/1/tl/canva-books-MAEFC6ympVo.jpg",
    price: 25,
  },
  {
    title: "MATH",
    description: "Learn math in a fun and interactive way",
    cover_url: "https://marketplace.canva.com/ympVo/MAEFC6ympVo/1/tl/canva-books-MAEFC6ympVo.jpg",
    price: 30,
  },
  {
    title: "SCIENCE",
    description: "Learn science in a fun way",
    cover_url: "https://marketplace.canva.com/ympVo/MAEFC6ympVo/1/tl/canva-books-MAEFC6ympVo.jpg",
    price: 35,
  },
  {
    title: "HISTORY",
    description: "Learn history easily",
    cover_url: "https://marketplace.canva.com/ympVo/MAEFC6ympVo/1/tl/canva-books-MAEFC6ympVo.jpg",
    price: 40,
  }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<typeof courses>([]);
  const router = useRouter(); 
  const dispatch = useDispatch(); 
  const { token, avatarUrl } = useSelector((state: RootState) => state.auth); 
  const [sheetOpen, setSheetOpen] = useState(false); 


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
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(value) ||
      course.description.toLowerCase().includes(value)
      
    );
    setResults(filtered.slice(0, 5));
; // Limit to top 5 results
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
            <ul className="navbar-nav ms-4 ms-lg-5 me-auto mb-2 mb-lg-0 d-flex gap-3">
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


<div className="container d-none d-lg-block align-self-center mt-lg-0">
  <div style={{ position: "relative", maxWidth: "350px", margin: "0 auto" }}>
    <form className="d-flex" 
    onSubmit={(e) => {
  e.preventDefault();

  if (search.trim().length > 0) {
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase())
    );
    setResults(filtered.slice(0, 5));

  if (filtered.length === 1 && filtered[0].title.toLowerCase() === search.toLowerCase()) {
  window.location.href = `/courses/${filtered[0].title.toLowerCase()}`;
}
  } else {
    setResults([]);
  }
}}>
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
                  <i className="bi bi-bell fs-5" style={{ cursor: "pointer" ,color: "#77B0E4"}}></i>
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
        left: "auto",
        transform: sheetOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s ease-in-out",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5
  className="fw-bold m-0"
  style={{ color: "#77B0E4" }}
>
  Edit profile
</h5>
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
          router.push("/settings");
          setSheetOpen(false);
        }}
      >
        Settings
      </button>

      <button
        className="w-100 text-white fw-bold"
        style={{
          backgroundColor: "#77B0E4",
          border: "none",
          padding: "0.75rem",
          borderRadius: "8px",
        }}
        onClick={() => {
          router.push("/update-profile");
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
    </header>
  );
}
