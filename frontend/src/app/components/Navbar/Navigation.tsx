"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../redux/store";
import { logout } from "../../../redux/slices/authSlice";
import { useRouter, usePathname } from "next/navigation";
import "./nav.css";



export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState("");
  type Course = {
    id: string | number;
    title: string;
    description: string;
    cover_url: string;
  };
  
    const [results, setResults] = useState<Course[]>([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  if (pathname && pathname.startsWith("/admin")) return null;

  const router = useRouter();
  const dispatch = useDispatch();
  const { token, avatarUrl, firstName, lastName, email } = useSelector(
    (state: RootState) => state.auth
  );

  const fullName = `${firstName ?? ""}${firstName && lastName ? " " : ""}${lastName ?? ""}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setSearch(value);

  if (value.trim().length === 0) {
    setResults([]);
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/courses/search?q=${encodeURIComponent(value)}`);
    const data = await res.json();

    if (data.success) {
      setResults(data.data.slice(0, 5)); 
    } else {
      setResults([]);
    }
  } catch (err) {
    console.error("Search error:", err);
    setResults([]);
  }
};

const triggerSearch = async () => {
  if (search.trim().length === 0) {
    setResults([]);
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/courses/search?q=${encodeURIComponent(search)}`);
    const data = await res.json();

    if (data.success) {
      setResults(data.data.slice(0, 5)); 
    } else {
      setResults([]);
    }
  } catch (err) {
    console.error("Search trigger error:", err);
    setResults([]);
  }
};

  const handleLogout = () => {
    dispatch(logout());
    setShowProfileMenu(false);
  };

 return (
  <header className="fixed-top">
    <div className={scrolled ? "container my-2 animate__animated animate__fadeInDown" : ""}>
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
              alt="Logo"
              style={{ width: "9em", height: "2em" }}
            />
          </a>

          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`} id="mainNav">
            <ul className="navbar-nav ms-4 ms-lg-5 mb-2 mb-lg-0 d-flex gap-3 me-4">
    <li className="nav-item"><a className="nav-link fw-bold" href="/">Home</a></li>
    <li className="nav-item"><a className="nav-link fw-bold" href="/categories">Courses</a></li>
    <li className="nav-item"><a className="nav-link fw-bold" href="/about">About</a></li>
    <li className="nav-item"><a className="nav-link fw-bold" href="/contact">Contact</a></li>
  </ul>

  <div className="d-flex align-items-center gap-3 ms-auto">
    
    <div 
      className="d-flex flex-grow-1 mx-3 me-5" 
      style={{ 
        position: "relative",
        minWidth: "350px", 
        maxWidth: "500px" ,
      }}
    >
      <div className="input-group w-100 shadow-sm" style={{ borderRadius: "12px", overflow: "hidden" }}>
        <span 
          className="input-group-text bg-white border-0"
          style={{ cursor: "pointer" }}
          onClick={triggerSearch}
        >
          <i className="bi bi-search" style={{ color: "#5A9BD5", fontSize: "1.2rem" }}></i>
        </span>
        <input
          type="search"
          className="form-control border-0"
          placeholder="Search courses..."
          value={search}
          onChange={handleSearch}
          style={{
            padding: "10px 15px",
            fontSize: "0.95rem",
          }}
        />
      </div>
  {results.length > 0 && (
    <ul
 className="list-group position-absolute mt-2 shadow-lg"
style={{
 top: "100%",
left: 0,
 width: "100%",
        zIndex: 1050,
        borderRadius: "12px",
        backgroundColor: "#fff",
        overflowY: "auto",
        maxHeight: "250px",
      }}
    >
      {results.map((course, i) => (
      <li
  key={course.id}
  className="list-group-item list-group-item-action d-flex align-items-center"
  style={{ cursor: "pointer" }}
  onClick={() => {
    router.push(`/courses/${course.id}`);
    setResults([]);
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

              
              {!token ? (
                <button
                  className="btn btn-primary ms-lg-3 mt-3 mt-lg-0 rounded-3 border-0"
                  onClick={() => router.push("/login")}
                >
                  Login
                </button>
              ) : (
                <div className="d-flex align-items-center gap-3 position-relative">
                  <div
                    className="d-flex justify-content-center align-items-center rounded-circle"
                    style={{
                      width: "42px",
                      height: "42px",
                      backgroundColor: "#EAF4FB",
                      cursor: "pointer",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.15) rotate(5deg)";
                      e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <i className="bi bi-bell" style={{ fontSize: "1.2rem", color: "#5A9BD5" }}></i>
                  </div>

                  <div
                    className="d-flex justify-content-center align-items-center rounded-circle"
                    style={{
                      width: "42px",
                      height: "42px",
                      backgroundColor: "#EAF4FB",
                      cursor: "pointer",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.15) rotate(-5deg)";
                      e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    onClick={() => router.push("/chat")}
                  >
                    <i className="bi bi-chat-left-text" style={{ fontSize: "1.2rem", color: "#5A9BD5" }}></i>
                  </div>

                  <div
                    className="d-flex justify-content-center align-items-center rounded-circle"
                    style={{
                      width: "42px",
                      height: "42px",
                      backgroundColor: "#EAF4FB",
                      cursor: "pointer",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.15) rotate(5deg)";
                      e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  >
                    <img
                      src={avatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      alt="avatar"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  {showProfileMenu && (
                    <div
                      ref={menuRef}
                      className="position-absolute shadow-lg rounded-4 p-3"
                      style={{
                        top: "120%",
                        right: 0,
                        width: "240px",
                        zIndex: 1060,
                        background: "#ffffff",
                        border: "1px solid #e0e0e0",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                        animation: "fadeIn 0.3s ease",
                      }}
                    >
                      <div className="d-flex align-items-center mb-3">
                        <img
                          src={avatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                          alt="profile"
                          className="rounded-circle me-2 border"
                          style={{ width: "45px", height: "45px", objectFit: "cover" }}
                        />
                        <div>
                          <b>{fullName || "User"}</b>
                          <div style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                            {email || "user@email.com"}
                          </div>
                        </div>
                      </div>

                      <button
                        className="btn btn-outline-primary w-100 mb-2 fw-semibold"
                        style={{
                          background: "rgba(26, 163, 231, 0.7)",
                          color: "#fff",
                          border: "none",
                          backdropFilter: "blur(6px)",
                        }}
                        onClick={() => {
                          setShowProfileMenu(false);
                          router.push("/profile");
                        }}
                      >
                        View Profile
                      </button>

                      <button
                        className="btn w-100 fw-semibold text-light"
                        style={{
                          background: "rgba(241, 23, 23, 0.7)",
                          border: "none",
                          backdropFilter: "blur(6px)",
                        }}
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
);
} 
