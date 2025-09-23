'use client';

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import UserDialog from "../userDialog/userDialog";
import ThemeToggle from "../ThemeToggle/themeToggle";

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
  const [showDialog, setShowDialog] = useState(false);

  const auth = useSelector((state: RootState) => state.auth);
console.log("Auth state:", auth);

  useEffect(() => {
    // @ts-ignore
    void import("bootstrap/dist/js/bootstrap.bundle.min.js");

    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  
  useEffect(() => {
    if (auth.token && auth.userId) {
      setShowDialog(true);
    }
  }, [auth.token, auth.userId]);

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

  return (
    <header className="fixed-top">
      <div className={scrolled ? "container my-2 animate__animated animate__fadeInDown" : ""}>
        <nav className={`navbar navbar-expand-lg navbar-light ${scrolled ? "bg-light border rounded-4 shadow-sm px-2" : "bg-white border-bottom px-2"}`}>
          <div className="container-fluid">
            <a className="navbar-brand fw-bold" href="#">
              <img src="https://i.postimg.cc/GhSB7m8C/logo.png" alt="Logo" style={{ width: "9em", height: "2em" }} />
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

              <div className="d-flex align-items-center ms-lg-3 mt-3 mt-lg-0 gap-2">
                <ThemeToggle />
 
 {auth.token ? (
  auth.avatarUrl ? (
    <img
      src={auth.avatarUrl}
      alt="Avatar"
      className="w-10 h-10 rounded-full cursor-pointer"
      onClick={() => setShowDialog(true)}
    />
  ) : (
    <button
      className="btn btn-secondary"
      onClick={() => setShowDialog(true)}
    >
      Profile
    </button>
  )
) : (
  <a className="btn btn-primary rounded-3" href="/login">Login</a>
)} 
              </div> 
            </div>
          </div>
        </nav>
      </div>

     
      {showDialog && auth.token && (
  <UserDialog
    userId={auth.userId ? String(auth.userId) : ""}
    avatar={auth.avatarUrl || "/default-avatar.png"}
    onClose={() => setShowDialog(false)}
  />
)}

     
      <div id="mobileSearch" className="collapse d-lg-none bg-white border-bottom">
        <div className="container-fluid py-2">
          <form className="d-flex gap-2">
            <input className="form-control" type="search" placeholder="Search courses..." />
          </form>
        </div>
      </div>

    
      <div className="container mt-3 d-none d-lg-block">
        <div style={{ position: "relative", maxWidth: "350px", margin: "0 auto" }}>
          <form className="d-flex" onSubmit={(e) => {
            e.preventDefault();
            if (search.trim().length > 0) {
              const filtered = courses.filter(course =>
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
              <button className="btn btn-outline-secondary" type="submit">
                <i className="bi bi-search"></i>
              </button>
              <input type="search" className="form-control" placeholder="Search courses..." value={search} onChange={handleSearch} />
            </div>
          </form>

          {results.length > 0 && (
            <ul className="list-group position-absolute mt-2" style={{ top: "100%", left: 0, width: "100%", zIndex: 1050, boxShadow: "0 2px 6px rgba(0,0,0,0.1)", borderRadius: "8px", backgroundColor: "#fff", overflowY: "auto", maxHeight: "250px" }}>
              {results.map((course, i) => (
                <li key={i} className="list-group-item list-group-item-action d-flex align-items-center" style={{ cursor: "pointer" }} onClick={() => { window.location.href = `/courses/${course.title.toLowerCase()}`; }}>
                  <img src={course.cover_url} alt={course.title} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "50%", marginRight: "10px" }} />
                  <b>{course.title}</b>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}