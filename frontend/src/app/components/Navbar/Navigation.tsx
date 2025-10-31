"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../redux/store";
import { logout } from "../../../redux/slices/authSlice";
import { useRouter, usePathname } from "next/navigation";
import "./nav.css";

import { connectSocket, onNewMessage } from "../../socket";

type Course = {
  id: string | number;
  title: string;
  description: string;
  cover_url: string;
};

type NotificationItem = {
  id: string | number;
  text: string;
  time: number;
  conversationId: number;
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Course[]>([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const { token, avatarUrl, firstName, lastName, email } = useSelector(
    (state: RootState) => state.auth
  );

   const roleName = window.localStorage.getItem("roleName");
  const fullName = `${firstName ?? ""}${firstName && lastName ? " " : ""}${lastName ?? ""}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const t = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(t)) setShowProfileMenu(false);
      if (notifRef.current && !notifRef.current.contains(t)) setShowNotifMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

//@ts-ignore
  useEffect(() => {
    connectSocket();
    const off = onNewMessage((payload: any) => {
      if (pathname?.startsWith("/chat")) return;

      const convId =
        Number(payload?.conversation_id ?? payload?.conversationId ?? payload?.conv_id ?? 0) || 0;
      if (!convId) return;

      const item: NotificationItem = {
        id: payload?.id ?? `${Date.now()}-${Math.random()}`,
        text: "You have a new message",
        time: Date.now(),
        conversationId: convId,
      };

      setNotifications((prev) => [item, ...prev].slice(0, 12));
      setUnread((u) => u + 1);
    });

    return () => off?.();
  }, [token, pathname]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (!value.trim()) return setResults([]);
    try {
      const res = await fetch(
        `https://meraki-academy-project-5-anxw.onrender.com/courses/search?q=${encodeURIComponent(value)}`
      );
      const data = await res.json();
      setResults(data.success ? data.data.slice(0, 5) : []);
    } catch {
      setResults([]);
    }
  };
  const triggerSearch = async () => {
    if (!search.trim()) return setResults([]);
    try {
      const res = await fetch(
        `https://meraki-academy-project-5-anxw.onrender.com/courses/search?q=${encodeURIComponent(search)}`
      );
      const data = await res.json();
      setResults(data.success ? data.data.slice(0, 5) : []);
    } catch {
      setResults([]);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowProfileMenu(false);
  };

  const timeAgo = (t: number) => {
    const s = Math.floor((Date.now() - t) / 1000);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    const d = Math.floor(h / 24);
    return `${d}d`;
  };

  if (pathname && pathname.startsWith("/admin")) return null;

  return (
    <header className="fixed-top">
      <div className={scrolled ? "container my-2 animate__animated animate__fadeInDown" : ""}>
        <nav
          className={`navbar navbar-expand-lg navbar-light ${
            scrolled ? "bg-light border rounded-4 shadow-sm px-2" : "bg-white border-bottom px-2"
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

            <button className="navbar-toggler" type="button" onClick={() => setIsNavOpen(!isNavOpen)}>
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
                  style={{ position: "relative", minWidth: "350px", maxWidth: "500px" }}
                >
                  <div className="input-group w-100 shadow-sm" style={{ borderRadius: "12px", overflow: "hidden" }}>
                    <span
                      className="input-group-text bg-white border-0"
                      style={{ cursor: "pointer" }}
                      onClick={triggerSearch}
                    >
                      <i className="bi bi-search" style={{ color: "#000000ff", fontSize: "1.2rem" }}></i>
                    </span>
                    <input
                      type="search"
                      className="form-control border-0"
                      placeholder="Search courses..."
                      value={search}
                      onChange={handleSearch}
                      style={{ padding: "10px 15px", fontSize: "0.95rem" }}
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
                      {results.map((course) => (
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
                      ref={notifRef}
                      className="position-relative"
                      onClick={() => setShowNotifMenu((s) => !s)}
                      style={{
                        width: 42,
                        height: 42,
                        backgroundColor: "#EAF4FB",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "transform .3s ease, box-shadow .3s ease",
                      }}
                      title="Notifications"
                    >
                      <i className="bi bi-bell" style={{ fontSize: "1.2rem", color: "#000000ff" }} ></i>
                      {unread > 0 && (
                        <span
                          className="position-absolute translate-middle badge rounded-pill bg-danger"
                          style={{ top: 6, right: 2, fontSize: 10 }}
                        >
                          {unread > 99 ? "99+" : unread}
                        </span>
                      )}

                      {showNotifMenu && (
                        <div
                          className="position-absolute shadow-lg rounded-4 p-2"
                          style={{
                            top: "120%",
                            right: 0,
                            width: 320,
                            zIndex: 1060,
                            background: "#ffffff",
                            border: "1px solid #e0e0e0",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="d-flex align-items-center justify-content-between px-2 py-1">
                            <b>Notifications</b>
                            <button
                              className="btn btn-link btn-sm p-0"
                              onClick={() => setUnread(0)}
                              title="Mark all as read"
                            >
                              Mark read
                            </button>
                          </div>

                          {notifications.length === 0 ? (
                            <div className="text-muted small px-2 py-2">No notifications yet.</div>
                          ) : (
                            <ul className="list-unstyled mb-0">
                              {notifications.map((n) => (
                                <li
                                  key={String(n.id)}
                                  className="px-2 py-2 d-flex gap-2 align-items-start border-top"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    router.push(`/chat/${n.conversationId}`);
                                    setShowNotifMenu(false);
                                    setUnread((u) => Math.max(0, u - 1));
                                  }}
                                >
                                  <div
                                    className="rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center"
                                    style={{ width: 32, height: 32 }}
                                  >
                                    <i className="bi bi-chat-left-text text-primary " />
                                  </div>
                                  <div className="flex-grow-1">
                                    <div className="small">
                                      <b>You have a new message</b>
                                    </div>
                                    <div className="text-muted" style={{ fontSize: 11 }}>
                                      {timeAgo(n.time)} ago
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>

                    <div
                      className="d-flex justify-content-center align-items-center rounded-circle"
                      style={{
                        width: 42,
                        height: 42,
                        backgroundColor: "#EAF4FB",
                        cursor: "pointer",
                        transition: "transform .3s ease, box-shadow .3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.15) rotate(-5deg)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 16px rgba(0,0,0,.25)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                      }}
                      onClick={() => router.push("/chat")}
                      title="Open chat"
                    >
                      <i className="bi bi-chat-left-text" style={{ fontSize: "1.2rem", color: "#000000ff" }}></i>
                    </div>

                    <div
                      className="d-flex justify-content-center align-items-center rounded-circle"
                      style={{
                        width: 42,
                        height: 42,
                        backgroundColor: "#EAF4FB",
                        cursor: "pointer",
                        transition: "transform .3s ease, box-shadow .3s ease",
                        overflow: "hidden",
                      }}
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      title="Profile"
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
                          width: "260px",
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
                            style={{ width: 45, height: 45, objectFit: "cover" }}
                          />
                          <div>
                            <b>{fullName || "User"}</b>
                            <div style={{ fontSize: ".85rem", color: "#6c757d" }}>
                              {email || "user@email.com"}
                            </div>
                          </div>
                        </div>

                        <button
                          className="btn btn-primary w-100 mb-2 fw-semibold border-0"
                          onClick={() => {
                            setShowProfileMenu(false);
                            router.push("/profile");
                          }}
                        >
                          View Profile
                        </button>

                        {roleName?.toLowerCase() == "instructor" && (
                          <button
                            className="btn btn-secondary w-100 mb-2 fw-semibold border-0"
                            onClick={() => {
                              setShowProfileMenu(false);
                              router.push("/instructor");
                            }}
                          >
                            Dashboard
                          </button>
                        )}

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
