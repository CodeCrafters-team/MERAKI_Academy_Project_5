"use client";

import React, { useState, useEffect, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const THEME = { primary: "#77b0e4", secondary: "#f6a531" };

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  isActive: boolean;
}
interface Course {
  course_id: number;
  course_title: string;
  student_count?: number;
  avg_rating?: number;
  price?: number;
  creator_first_name?: string;
  creator_last_name?: string;
  is_published?: boolean;
}
interface Contact {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  message: string;
  createdAt: string;
}
type WeeklySalesPoint = {
  day?: string;
  day_label?: string;
  amount?: number;
  total?: number;
};

const rolesMap: Record<number, string> = { 1: "admin", 2: "instructor", 3: "student" };

const sections: { key: "stats" | "users" | "courses" | "contact"; label: string }[] = [
  { key: "stats", label: "Overview" },
  { key: "users", label: "Users" },
  { key: "courses", label: "Courses" },
  { key: "contact", label: "Contact" },
];

const LOGO_FULL = "https://i.postimg.cc/sX32sXDV/logo.png"; 
const LOGO_ICON = "/images/smartpath-icon.png"; // الأيقونة فقط
const navMeta: Record<string, { label: string; icon: string }> = {
  stats: { label: "Dashboard", icon: "bi-house-door" },
  users: { label: "Users", icon: "bi-people" },
  courses: { label: "Courses", icon: "bi-journal-text" },
  contact: { label: "Mailbox", icon: "bi-envelope" },
};

function Stars({
  value,
  onChange,
  readOnly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
}) {
  return (
    <div style={{ display: "flex", gap: 4, cursor: readOnly ? "default" : "pointer" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          onClick={() => !readOnly && onChange?.(s)}
          style={{ fontSize: 20, color: s <= value ? THEME.secondary : "#ccc", lineHeight: 1 }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
function fmtMoney(amount: number) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<"stats" | "users" | "courses" | "contact">(
    "stats"
  );
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [weeklyLabels, setWeeklyLabels] = useState<string[]>([]);
  const [weeklyValues, setWeeklyValues] = useState<number[]>([]);
  const [weeklyLoading, setWeeklyLoading] = useState(false);

  const [searchName, setSearchName] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [searchBan, setSearchBan] = useState("");
  const [searchCourseName, setSearchCourseName] = useState("");
  const [searchInstructor, setSearchInstructor] = useState("");
  const [searchRating, setSearchRating] = useState("");

  const userCounts = useMemo(() => {
    const counts = { total: users.length, admin: 0, instructor: 0, student: 0, active: 0, banned: 0 };
    users.forEach((u) => {
      if (u.isActive) counts.active++;
      else counts.banned++;
      if (rolesMap[u.roleId] === "admin") counts.admin++;
      if (rolesMap[u.roleId] === "instructor") counts.instructor++;
      if (rolesMap[u.roleId] === "student") counts.student++;
    });
    return counts;
  }, [users]);

  const courseCounts = useMemo(() => {
    let published = 0,
      draft = 0;
    courses.forEach((c) => {
      if (c.is_published) published++;
      else draft++;
    });
    return { total: courses.length, published, draft };
  }, [courses]);

  const { totalUsers, totalCourses, avgRating, totalEarnings } = useMemo(() => {
    const totalUsersCalc = users.length;
    const totalCoursesCalc = courses.length;

    let sum = 0;
    let count = 0;
    for (const c of courses) {
      const r = Number(c.avg_rating);
      if (!Number.isNaN(r)) {
        sum += r;
        count += 1;
      }
    }
    const avg = count ? sum / count : 0;

    const earnings = courses.reduce((acc, c) => {
      const price = Number(c.price || 0);
      const students = Number(c.student_count || 0);
      return acc + price * students;
    }, 0);

    return {
      totalUsers: totalUsersCalc,
      totalCourses: totalCoursesCalc,
      avgRating: Number(avg.toFixed(2)),
      totalEarnings: earnings,
    };
  }, [users, courses]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const nameMatch = `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchName.toLowerCase());
      const roleMatch = searchRole ? rolesMap[user.roleId] === searchRole : true;
      const banMatch = searchBan === "" ? true : searchBan === "active" ? user.isActive : !user.isActive;
      return nameMatch && roleMatch && banMatch;
    });
  }, [users, searchName, searchRole, searchBan]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const nameMatch = course.course_title.toLowerCase().includes(searchCourseName.toLowerCase());
      const instructorMatch = searchInstructor
        ? `${course.creator_first_name || ""} ${course.creator_last_name || ""}`
            .toLowerCase()
            .includes(searchInstructor.toLowerCase())
        : true;
      const ratingMatch = searchRating ? Number(course.avg_rating || 0) >= Number(searchRating) : true;
      return nameMatch && instructorMatch && ratingMatch;
    });
  }, [courses, searchCourseName, searchInstructor, searchRating]);

  useEffect(() => {
    const needUsers = activeSection === "users" || activeSection === "stats";
    const needCourses = activeSection === "courses" || activeSection === "stats";

    if (needUsers) {
      setLoading(true);
      fetch("http://localhost:5000/users")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUsers(data.users);
            setError("");
          } else setError("Failed to fetch users");
        })
        .catch(() => setError("Server connection error"))
        .finally(() => setLoading(false));
    }

    if (needCourses) {
      setLoading(true);
      fetch("http://localhost:5000/courses/admin/all")
        .then((res) => res.json())
        .then((data) => {
          if (data.data && Array.isArray(data.data)) {
            setCourses(data.data);
            setError("");
          } else setError("Failed to fetch courses");
        })
        .catch(() => setError("Server connection error"))
        .finally(() => setLoading(false));
    }

    if (activeSection === "contact") {
      setLoading(true);
      fetch("http://localhost:5000/contact")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.contacts)) {
            setContacts(data.contacts);
            setError("");
          } else setError("Failed to fetch contact messages");
        })
        .catch(() => setError("Server connection error"))
        .finally(() => setLoading(false));
    }
  }, [activeSection]);

  useEffect(() => {
    if (activeSection !== "stats") return;
    const defaultLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    setWeeklyLoading(true);
    fetch("http://localhost:5000/enrollments/weekly-sales")
      .then((res) => res.json())
      .then((payload) => {
        const arr: WeeklySalesPoint[] = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
          ? payload.data
          : [];
        const byDay: Record<string, number> = {};
        arr.forEach((item) => {
          const day = (item.day || item.day_label || "").toString().slice(0, 3);
          const val = Number(item.amount ?? item.total ?? 0);
          if (!day) return;
          byDay[day] = val;
        });
        const labels = defaultLabels;
        const values = labels.map((d) => Number(byDay[d] || 0));
        setWeeklyLabels(labels);
        setWeeklyValues(values);
      })
      .catch(() => {
        setWeeklyLabels(defaultLabels);
        setWeeklyValues([0, 0, 0, 0, 0, 0, 0]);
      })
      .finally(() => setWeeklyLoading(false));
  }, [activeSection]);

  const roleNameToId: Record<string, number> = { admin: 1, instructor: 2, student: 3 };

  const handleRoleChange = (userId: number, newRole: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    const roleKey = newRole.toLowerCase().trim();
    const newRoleId = roleNameToId[roleKey];
    if (!newRoleId) return toast.error("Invalid role. Use: admin, instructor, or student.");

    const prev = users;
    setUsers((p) => p.map((u) => (u.id === userId ? { ...u, roleId: newRoleId } : u)));
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    fetch(`http://localhost:5000/users/${userId}/role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ roleId: newRoleId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) toast.success("Role updated");
        else {
          setUsers(prev);
          toast.error(data.message || "Failed to update role");
        }
      })
      .catch(() => {
        setUsers(prev);
        toast.error("Server error while updating role");
      });
  };

  const handleBan = (userId: number) => {
    const prev = users;
    setUsers((p) => p.map((u) => (u.id === userId ? { ...u, isActive: false } : u)));
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    fetch(`http://localhost:5000/users/${userId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ isActive: false }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) toast.success("User banned");
        else {
          setUsers(prev);
          toast.error(data.message || "Failed to ban user");
        }
      })
      .catch(() => {
        setUsers(prev);
        toast.error("Server error while banning user");
      });
  };

  const handleUnban = (userId: number) => {
    const prev = users;
    setUsers((p) => p.map((u) => (u.id === userId ? { ...u, isActive: true } : u)));
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    fetch(`http://localhost:5000/users/${userId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ isActive: true }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) toast.success("User unbanned");
        else {
          setUsers(prev);
          toast.error(data.message || "Failed to unban user");
        }
      })
      .catch(() => {
        setUsers(prev);
        toast.error("Server error while unbanning user");
      });
  };

  const handleDeleteCourse = (courseId: number) => {
    const prev = courses;
    setCourses((p) => p.filter((c) => c.course_id !== courseId));
    fetch(`http://localhost:5000/courses/${courseId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) toast.success("Course deleted");
        else {
          setCourses(prev);
          toast.error(data.message || "Failed to delete course");
        }
      })
      .catch(() => {
        setCourses(prev);
        toast.error("Server error while deleting course");
      });
  };

  const weeklyAvg = useMemo(() => {
    const arr = weeklyValues?.length ? weeklyValues : [];
    if (!arr.length) return 0;
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    return Number(avg.toFixed(2));
  }, [weeklyValues]);

  const onLogout = () => {
    try {
      localStorage.removeItem("token");
    } catch {}
    window.location.href = "/login";
  };

  const profit = React.useMemo(
  () => Number((totalEarnings * 0.10).toFixed(2)),
  [totalEarnings]
);
  return (
    <div style={{marginTop:"-4em"}} className="d-flex flex-column flex-md-row min-vh-100 bg-light">
      <aside
  className="d-none d-md-flex flex-column border-end p-3 position-fixed top-0 start-0"
  style={{ width: 260, height: "100vh", zIndex: 1030, background: "#fff" }}
>
  <div className="d-flex justify-content-center align-items-center" style={{ height: 80, marginTop: -20, marginBottom: 0 }}>
    <img src={LOGO_FULL} alt="SmartPath" style={{ maxWidth: 170, maxHeight: 60, display: "block", margin: 0 }} />
  </div>

  <ul className="nav nav-pills flex-column gap-1 mb-3">
    {sections.map((s) => {
      const meta = navMeta[s.key] ?? { label: s.label, icon: "bi-dot" };
      const active = activeSection === s.key;
      return (
        <li key={s.key} className="nav-item">
          <button
            onClick={() => setActiveSection(s.key)}
            className={`nav-link d-flex align-items-center gap-3 w-100 ${active ? "active" : ""}`}
            style={{
              background: active ? "#48aeff" : "#fff",
              color: active ? "#fff" : "#222",
              fontWeight: active ? "bold" : "normal",
              borderRadius: 12,
              boxShadow: active ? "0 2px 8px #2563eb22" : "none",
              border: active ? "1px solid #48aeff" : "1px solid #eee",
              transition: "all 0.9s"
            }}
          >
            <i className={`bi ${meta.icon} fs-5`} style={{ color: active ? "#fff" : "#48aeff" }} />
            <span className="text-truncate">{meta.label}</span>
          </button>
        </li>
      );
    })}
  </ul>

  <div className="mt-auto pt-2">
    <button className="btn btn-danger w-100 d-flex align-items-center gap-2 justify-content-center"  onClick={onLogout}>
      <i className="bi bi-box-arrow-right"/>Logout
    </button>
  </div>
</aside>

      <div className="d-md-none p-3">
        <button
          className="btn btn-outline-secondary"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#mobileSidebar"
        >
          <i className="bi bi-list me-2" />
          Menu
        </button>
      </div>

      <main className="flex-fill p-2 p-md-4" style={{ background: "#f7f7f7" }}>
        {activeSection === "users" && (
          <section>
            <div className="container py-4">
              <h1 className="mb-4">User Management</h1>

              <div className="row mb-3">
                <div className="col-md-5 mb-2 mb-md-0">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                </div>
                <div className="col-md-3 mb-2 mb-md-0">
                  <select className="form-select" value={searchRole} onChange={(e) => setSearchRole(e.target.value)}>
                    <option value="">All Roles</option>
                    <option value="admin">admin</option>
                    <option value="instructor">instructor</option>
                    <option value="student">student</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <select className="form-select" value={searchBan} onChange={(e) => setSearchBan(e.target.value)}>
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
              </div>

              <div className="card border-0 shadow-sm rounded-3">
                <div className="card-body">
                  <h5 className="m-2">Users</h5>
                  <div className="table-responsive overflow-auto" style={{ maxHeight: "60vh" }}>
                    <table className="table align-middle mb-0">
                      <thead>
                        <tr className="text-muted small">
                          <th className="sticky-top bg-body">#</th>
                          <th className="sticky-top bg-body">Name</th>
                          <th className="sticky-top bg-body">Email</th>
                          <th className="sticky-top bg-body">Role</th>
                          <th className="sticky-top bg-body">Status</th>
                          <th className="sticky-top bg-body">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user, idx) => (
                          <tr key={user.id}>
                            <td>{idx + 1}</td>
                            <td className="text-truncate" style={{ maxWidth: 200 }}>
                              {user.firstName} {user.lastName}
                            </td>
                            <td>{user.email}</td>
                            <td>{rolesMap[user.roleId] || user.roleId}</td>
                            <td className={user.isActive ? "text-success" : "text-danger"}>
                              {user.isActive ? "Active" : "Banned"}
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <select
                                  className="form-select form-select-sm"
                                  style={{ width: 120 }}
                                  value={rolesMap[user.roleId]}
                                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                >
                                  <option value="admin">admin</option>
                                  <option value="instructor">instructor</option>
                                  <option value="student">student</option>
                                </select>
                                {user.isActive ? (
                                  <button className="btn btn-sm btn-danger" onClick={() => handleBan(user.id)}>
                                    Ban
                                  </button>
                                ) : (
                                  <button className="btn btn-sm btn-success" onClick={() => handleUnban(user.id)}>
                                    Unban
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                          <tr>
                            <td colSpan={6} className="text-center text-muted py-4">
                              No data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === "courses" && (
          <section>
            <h1 className="mb-3">Course Management</h1>

            <div className="row mb-3">
              <div className="col-md-4 mb-2 mb-md-0">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by course name..."
                  value={searchCourseName}
                  onChange={(e) => setSearchCourseName(e.target.value)}
                />
              </div>
              <div className="col-md-4 mb-2 mb-md-0">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter by instructor..."
                  value={searchInstructor}
                  onChange={(e) => setSearchInstructor(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min rating..."
                  value={searchRating}
                  min={0}
                  max={5}
                  step={0.1}
                  onChange={(e) => setSearchRating(e.target.value)}
                />
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body">
                <h5 className="m-2">Courses</h5>
                <div className="table-responsive overflow-auto" style={{ maxHeight: "60vh" }}>
                  <table className="table align-middle mb-0">
                    <thead>
                      <tr className="text-muted small">
                        <th className="sticky-top bg-body">Rank</th>
                        <th className="sticky-top bg-body">Course Name</th>
                        <th className="sticky-top bg-body">Students</th>
                        <th className="sticky-top bg-body">Rating</th>
                        <th className="sticky-top bg-body">Earning</th>
                        <th className="sticky-top bg-body">Creator</th>
                        <th className="sticky-top bg-body">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCourses.map((row, i) => (
                        <tr key={row.course_id}>
                          <td className="fw-semibold">{i + 1}</td>
                          <td className="text-truncate" style={{ maxWidth: 280 }}>
                            {row.course_title}
                          </td>
                          <td>{Number(row.student_count || 0).toLocaleString()}</td>
                          <td>
                            <Stars value={Number(row.avg_rating || 0)} />
                          </td>
                          <td className="fw-semibold" style={{ color: "green" }}>
                            {fmtMoney(Number(row.price || 0) * Number(row.student_count || 0))}
                          </td>
                          <td>
                            {row.creator_first_name} {row.creator_last_name}
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteCourse(row.course_id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredCourses.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center text-muted py-4">
                            No data
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === "stats" && (
          <section>
            <h1 className="mb-4">Overview</h1>

            <div className="card border-0 shadow-sm rounded-3 mb-4">
              <div className="card-body p-4 d-flex justify-content-between align-items-center">
                <div className="pe-3" style={{ maxWidth: 680 }}>
                  <h1 className="h4 fw-bold mb-1">Welcome back , Admin</h1>
                  <p className="text-muted mb-0">let’s turn today’s insights into tomorrow’s achievements. With SmartPath, your decisions ripple across every course and every learner.</p>
                </div>
                <div className="position-relative">
                  <div
                    className="rounded-4"
                    style={{ width: 220, height: 120, background: "linear-gradient(220deg, #f69d01, #4ab0ff, #f69d01)" }}
                  />
                  <div
                    className="position-absolute top-50 start-50 translate-middle bg-white rounded-3 border shadow"
                    style={{ width: 86, height: 86, display: "grid", placeItems: "center" }}
                  >
                    <img className="rounded-3 shadow" src={String("https://i.postimg.cc/kGwNGg7v/assets-task-01k62wz9tmf3caa261b4y3qa8a-1758886680-img-3.webp")} alt="avatar" style={{ width: 82, height: 82, objectFit: "cover" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-12 col-sm-6 col-xl-3">
                <div className="card h-100 border-0 shadow-sm rounded-3">
                  <div className="card-body d-flex align-items-center gap-3">
                    <div className="rounded-3 bg-danger-subtle text-danger d-inline-grid justify-content-center" style={{ width: 46, height: 46 }}>
                      <span className="bi bi-journal-text align-self-center" />
                    </div>
                    <div>
                      <div className="text-muted small">Total Courses</div>
                      <div className="fs-4 fw-bold">{totalCourses}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-xl-3">
                <div className="card h-100 border-0 shadow-sm rounded-3">
                  <div className="card-body d-flex align-items-center gap-3">
                    <div className="rounded-3 bg-primary-subtle text-primary d-inline-grid justify-content-center" style={{ width: 46, height: 46 }}>
                      <span className="bi bi-people align-self-center" />
                    </div>
                    <div>
                      <div className="text-muted small">Total Users</div>
                      <div className="fs-4 fw-bold">{totalUsers}</div>
                    </div>
                  </div>
                </div>
              </div>

            
     
              <div className="col-12 col-sm-6 col-xl-3">
                <div className="card h-100 border-0 shadow-sm rounded-3">
                  <div className="card-body d-flex align-items-center gap-3">
                    <div className="rounded-3 bg-success-subtle text-success d-inline-grid justify-content-center" style={{ width: 46, height: 46 }}>
                      <span className="bi bi-wallet2 align-self-center" />
                    </div>
                    <div>
                      <div className="text-muted small">Total Earnings</div>
                      <div className="fs-4 fw-bold">{fmtMoney(totalEarnings)}</div>
                    </div>
                  </div>
                </div>
              </div>
                    <div className="col-12 col-sm-6 col-xl-3">
  <div className="card h-100 border-0 shadow-sm rounded-3">
    <div className="card-body d-flex align-items-center gap-3">
      <div
        className="rounded-3 bg-warning-subtle text-warning d-inline-grid justify-content-center"
        style={{ width: 46, height: 46 }}
      >
        <span className="bi bi-graph-up-arrow align-self-center" />
      </div>
      <div>
        <div className="text-muted small">Profit (10%)</div>
        <div className="fs-4 fw-bold">{fmtMoney(profit)}</div>
      </div>
    </div>
  </div>
</div>
            </div>
 

            <div className="row g-3 mb-4">
              <div className="col-12">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="card-title mb-0">This Week Sales</h5>
                      <div className="d-flex align-items-center gap-2">
                        <small className="text-muted">Revenue from enrollments (USD)</small>
                        <span className="badge text-bg-light border">Avg: ${weeklyAvg}</span>
                      </div>
                    </div>
                    {weeklyLoading ? (
                      <p className="text-muted mb-0">Loading weekly sales...</p>
                    ) : (
                      <div style={{ height: 260 }}>
                        <Bar
                          data={{
                            labels: weeklyLabels.length ? weeklyLabels : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                            datasets: [
                              {
                                label: "Sales",
                                data: weeklyValues.length ? weeklyValues : [0, 0, 0, 0, 0, 0, 0],
                                backgroundColor: "#77b0e4",
                                borderRadius: 8,
                                maxBarThickness: 28,
                              },
                            ],
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            layout: { padding: { top: 4, right: 4, left: 0, bottom: 0 } },
                            plugins: { legend: { display: false }, tooltip: { enabled: true } },
                            scales: {
                              x: { grid: { display: false }, ticks: { font: { size: 12 } } },
                              y: {
                                beginAtZero: true,
                                max: 200,
                                ticks: { stepSize: 25, callback: (val: any) => `$${val}`, font: { size: 12 } },
                                grid: { color: "rgba(0,0,0,.06)" },
                              },
                            },
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-12 col-lg-6">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">Users Distribution</h5>
                    <div style={{ height: 300 }}>
                      <Pie
                        data={{
                          labels: ["Admins", "Instructors", "Students"],
                          datasets: [
                            {
                              data: [userCounts.admin, userCounts.instructor, userCounts.student],
                              backgroundColor: ["#77b0e4", "#f6a531", "#6c757d"],
                              borderWidth: 0,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { position: "bottom", labels: { boxWidth: 14 } }, tooltip: { enabled: true } },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-6">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">Courses Status</h5>
                    <div style={{ height: 300 }}>
                      <Bar
                        data={{
                          labels: ["Published", "Draft"],
                          datasets: [
                            {
                              label: "Courses",
                              data: [courseCounts.published, courseCounts.draft],
                              backgroundColor: ["#198754", "#6c757d"],
                              borderRadius: 8,
                              maxBarThickness: 36,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { display: false } },
                          scales: {
                            x: { grid: { display: false }, ticks: { font: { size: 12 } } },
                            y: { beginAtZero: true, ticks: { stepSize: 10, font: { size: 12 } }, grid: { color: "rgba(0,0,0,.06)" } },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === "contact" && (
          <section>
            <h1 className="mb-3">Contact Messages</h1>

            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body">
                <h5 className="m-2">Messages</h5>
                <div className="table-responsive overflow-auto" style={{ maxHeight: "60vh" }}>
                  <table className="table align-middle mb-0">
                    <thead>
                      <tr className="text-muted small">
                        <th className="sticky-top bg-body">#</th>
                        <th className="sticky-top bg-body">Email</th>
                        <th className="sticky-top bg-body">Full Name</th>
                        <th className="sticky-top bg-body">Message</th>
                        <th className="sticky-top bg-body">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={5} className="text-center text-muted py-4">
                            Loading...
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan={5} className="text-center text-danger py-4">
                            {error}
                          </td>
                        </tr>
                      ) : contacts.length ? (
                        contacts.map((c, i) => (
                          <tr key={c.id}>
                            <td>{i + 1}</td>
                            <td>{c.email}</td>
                            <td>{`${c.firstName} ${c.lastName}`}</td>
                            <td>{c.message}</td>
                            <td>{c.createdAt ? new Date(c.createdAt).toLocaleString() : "-"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center text-muted py-4">
                            No contact messages
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </main>

      <div className="offcanvas offcanvas-start" tabIndex={-1} id="mobileSidebar">
        <div className="offcanvas-header">
          <a className="d-flex align-items-center text-decoration-none">
            <img src={LOGO_ICON} alt="logo" className="me-2" style={{ width: 28 }} />
            <img src={LOGO_FULL} alt="SmartPath" className="img-fluid" style={{ maxWidth: 140 }} />
          </a>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>

        <div className="offcanvas-body d-flex flex-column">
          <ul className="nav nav-pills flex-column gap-1">
            {sections.map((s) => {
              const meta = navMeta[s.key] ?? { label: s.label, icon: "bi-dot" };
              const active = activeSection === s.key;
              return (
                <li key={s.key} className="nav-item">
                  <button
                    onClick={() => {
                      setActiveSection(s.key);
                      (document.querySelector("#mobileSidebar .btn-close") as HTMLButtonElement)?.click();
                    }}
                    className={`nav-link d-flex align-items-center gap-3 w-100 ${active ? "active" : ""}`}
                  >
                    <i className={`bi ${meta.icon} fs-5`} />
                    <span className="text-truncate">{meta.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto pt-3">
            <button className="btn btn-outline-danger w-100" onClick={onLogout}>
              <i className="bi bi-box-arrow-right me-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

 <style jsx>{`
  @media (min-width: 768px) {
    main { margin-left: 260px !important; }
  }
`}</style>
    </div>
  );
}
