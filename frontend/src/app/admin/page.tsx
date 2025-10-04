"use client";
import React, { useState, useEffect, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
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

const rolesMap: Record<number, string> = {
  1: "admin",
  2: "instructor",
  3: "student",
};

const sections: { key: string; label: string }[] = [
  { key: "stats", label: "Statistics" },
  { key: "users", label: "Users" },
  { key: "courses", label: "Courses" },
  { key: "contact", label: "Contact" },
];

function Stars({ value, onChange, readOnly = false }: { value: number; onChange?: (v: number) => void; readOnly?: boolean }) {
  return (
    <div className="animate__animated animate__fadeIn" style={{ display: "flex", gap: 4, cursor: readOnly ? "default" : "pointer" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          onClick={() => !readOnly && onChange?.(s)}
          className="animate__animated animate__zoomIn"
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
  const [activeSection, setActiveSection] = useState("users");
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [searchBan, setSearchBan] = useState("");
  const [searchCourseName, setSearchCourseName] = useState("");
  const [searchInstructor, setSearchInstructor] = useState("");
  const [searchRating, setSearchRating] = useState("");

  const userCounts = useMemo(() => {
    const counts = { total: users.length, admin: 0, instructor: 0, student: 0, active: 0, banned: 0 };
    users.forEach(u => {
      if (u.isActive) counts.active++;
      else counts.banned++;
      if (rolesMap[u.roleId] === "admin") counts.admin++;
      if (rolesMap[u.roleId] === "instructor") counts.instructor++;
      if (rolesMap[u.roleId] === "student") counts.student++;
    });
    return counts;
  }, [users]);

  const courseCounts = useMemo(() => {
    let published = 0, draft = 0;
    courses.forEach(c => {
      if (c.is_published) published++;
      else draft++;
    });
    return { total: courses.length, published, draft };
  }, [courses]);

  const certificatesCount = 0;

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const nameMatch = `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchName.toLowerCase());
      const roleMatch = searchRole ? (rolesMap[user.roleId] === searchRole) : true;
      const banMatch = searchBan === "" ? true : (searchBan === "active" ? user.isActive : !user.isActive);
      return nameMatch && roleMatch && banMatch;
    });
  }, [users, searchName, searchRole, searchBan]);

  useEffect(() => {
    if (activeSection === "users") {
      setLoading(true);
      fetch("http://localhost:5000/users")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUsers(data.users);
            setError("");
          } else {
            setError("Failed to fetch users");
          }
        })
        .catch(() => setError("Server connection error"))
        .finally(() => setLoading(false));
    }
    if (activeSection === "courses") {
      setLoading(true);
      fetch("http://localhost:5000/courses/admin/all")
        .then((res) => res.json())
        .then((data) => {
          if (data.data && Array.isArray(data.data)) {
            setCourses(data.data);
            setError("");
          } else {
            setError("Failed to fetch courses");
          }
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
          } else {
            setError("Failed to fetch contact messages");
          }
        })
        .catch(() => setError("Server connection error"))
        .finally(() => setLoading(false));
    }
  }, [activeSection]);

  const handleDeleteCourse = (courseId: number) => {
    const prev = courses;
    setCourses((p) => p.filter((c) => c.course_id !== courseId));
    fetch(`http://localhost:5000/courses/${courseId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success('Course deleted');
        } else {
          setCourses(prev);
          toast.error(data.message || 'Failed to delete course');
        }
      })
      .catch((err) => {
        setCourses(prev);
        console.error(err);
        toast.error('Server error while deleting course');
      });
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const nameMatch = course.course_title.toLowerCase().includes(searchCourseName.toLowerCase());
      const instructorMatch = searchInstructor ? `${course.creator_first_name || ""} ${course.creator_last_name || ""}`.toLowerCase().includes(searchInstructor.toLowerCase()) : true;
      const ratingMatch = searchRating ? (Number(course.avg_rating || 0) >= Number(searchRating)) : true;
      return nameMatch && instructorMatch && ratingMatch;
    });
  }, [courses, searchCourseName, searchInstructor, searchRating]);


  const roleNameToId: Record<string, number> = { admin: 1, instructor: 2, student: 3 };
  const handleRoleChange = (userId: number, newRole: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    const roleKey = newRole.toLowerCase().trim();
    const newRoleId = roleNameToId[roleKey];
    if (!newRoleId) {
      toast.error("Invalid role. Use: admin, instructor, or student.");
      return;
    }
    const prev = users;
    setUsers((p) => p.map((u) => (u.id === userId ? { ...u, roleId: newRoleId } : u)));
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    fetch(`http://localhost:5000/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ roleId: newRoleId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success('Role updated');
        } else {
          setUsers(prev);
          toast.error(data.message || 'Failed to update role');
        }
      })
      .catch((err) => {
        setUsers(prev);
        console.error(err);
        toast.error('Server error while updating role');
      });
  };

  const handleBan = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    const prev = users;
    setUsers((p) => p.map((u) => (u.id === userId ? { ...u, isActive: false } : u)));
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    fetch(`http://localhost:5000/users/${userId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ isActive: false }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success('User banned');
        } else {
          setUsers(prev);
          toast.error(data.message || 'Failed to ban user');
        }
      })
      .catch((err) => {
        setUsers(prev);
        console.error(err);
        toast.error('Server error while banning user');
      });
  };

  const handleUnban = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    const prev = users;
    setUsers((p) => p.map((u) => (u.id === userId ? { ...u, isActive: true } : u)));
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    fetch(`http://localhost:5000/users/${userId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ isActive: true }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success('User unbanned');
        } else {
          setUsers(prev);
          toast.error(data.message || 'Failed to unban user');
        }
      })
      .catch((err) => {
        setUsers(prev);
        console.error(err);
        toast.error('Server error while unbanning user');
      });
  };

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100 bg-light">
      <aside className="bg-dark text-white p-3 p-md-4" style={{ minWidth: 220 }}>
        <h2 className="mb-4 fs-4 fw-bold text-center text-md-start">Admin Dashboard</h2>
        <nav>
          <ul className="list-unstyled">
            {sections.map((section) => (
              <li key={section.key} className="mb-2">
                <button
                  className={`w-100 btn btn-sm ${activeSection === section.key ? "btn-primary" : "btn-outline-light"}`}
                  style={{ textAlign: "left", fontWeight: activeSection === section.key ? "bold" : "normal" }}
                  onClick={() => setActiveSection(section.key)}
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
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
                    onChange={e => setSearchName(e.target.value)}
                  />
                </div>
                <div className="col-md-3 mb-2 mb-md-0">
                  <select
                    className="form-select"
                    value={searchRole}
                    onChange={e => setSearchRole(e.target.value)}
                  >
                    <option value="">All Roles</option>
                    <option value="admin">admin</option>
                    <option value="instructor">instructor</option>
                    <option value="student">student</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={searchBan}
                    onChange={e => setSearchBan(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, idx) => (
                      <tr key={user.id}>
                        <td>{idx + 1}</td>
                        <td className="text-truncate" style={{ maxWidth: 180 }}>{user.firstName} {user.lastName}</td>
                        <td>{user.email}</td>
                        <td>{rolesMap[user.roleId] || user.roleId}</td>
                        <td className={user.isActive ? "text-success" : "text-danger"}>{user.isActive ? "Active" : "Banned"}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <select
                              className="form-select form-select-sm"
                              style={{ width: 110 }}
                              value={rolesMap[user.roleId]}
                              onChange={e => handleRoleChange(user.id, e.target.value)}
                            >
                              <option value="admin">admin</option>
                              <option value="instructor">instructor</option>
                              <option value="student">student</option>
                            </select>
                            {user.isActive ? (
                              <button className="btn btn-sm btn-outline-danger" onClick={() => handleBan(user.id)}>
                                Ban
                              </button>
                            ) : (
                              <button className="btn btn-sm btn-outline-success" onClick={() => handleUnban(user.id)}>
                                Unban
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center text-muted py-4">No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
        {activeSection === "courses" && (
          <section>
            <h1>Course Management</h1>
            <div className="row mb-3">
              <div className="col-md-4 mb-2 mb-md-0">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by course name..."
                  value={searchCourseName}
                  onChange={e => setSearchCourseName(e.target.value)}
                />
              </div>
              <div className="col-md-4 mb-2 mb-md-0">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter by instructor..."
                  value={searchInstructor}
                  onChange={e => setSearchInstructor(e.target.value)}
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
                  onChange={e => setSearchRating(e.target.value)}
                />
              </div>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : (
              <table className="table align-middle mb-0" style={{ width: "100%", background: "#fff", borderCollapse: "collapse" }}>
                <thead>
                  <tr className="text-muted small" style={{ background: "#eee" }}>
                    <th className="sticky-top bg-body" style={{ padding: "8px", border: "1px solid #ddd" }}>Rank</th>
                    <th className="sticky-top bg-body" style={{ padding: "8px", border: "1px solid #ddd" }}>Course Name</th>
                    <th className="sticky-top bg-body" style={{ padding: "8px", border: "1px solid #ddd" }}>Students</th>
                    <th className="sticky-top bg-body" style={{ padding: "8px", border: "1px solid #ddd" }}>Rating</th>
                    <th className="sticky-top bg-body" style={{ padding: "8px", border: "1px solid #ddd" }}>Earning</th>
                    <th className="sticky-top bg-body" style={{ padding: "8px", border: "1px solid #ddd" }}>Creator</th>
                    <th className="sticky-top bg-body" style={{ padding: "8px", border: "1px solid #ddd" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((row, i) => (
                    <tr key={row.course_id}>
                      <td className="fw-semibold" style={{ padding: "8px", border: "1px solid #ddd" }}>{i + 1}</td>
                      <td className="text-truncate" style={{ maxWidth: 280, padding: "8px", border: "1px solid #ddd" }}>{row.course_title}</td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>{Number(row.student_count || 0).toLocaleString()}</td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}><Stars value={Number(row.avg_rating || 0)} /></td>
                      <td className="fw-semibold" style={{ color: "green", padding: "8px", border: "1px solid #ddd" }}>
                        {fmtMoney(Number(row.price || 0) * Number(row.student_count || 0))}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>{row.creator_first_name} {row.creator_last_name}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteCourse(row.course_id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredCourses.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center text-muted py-4">No data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </section>
        )}
        {activeSection === "certificates" && (
          <section>
            <h1>Certificate Management</h1>
            <ul>
              <li>Show certificate owner</li>
              <li>Delete certificate</li>
            </ul>
          </section>
        )}
        {activeSection === "stats" && (
          <section>
            <h1 className="mb-4">Overview / Statistics</h1>
            <div className="row mb-4">
              <div className="col-md-3 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title">Total Users</h5>
                    <p className="display-6 fw-bold mb-0">{userCounts.total}</p>
                    <small className="text-muted">Active: {userCounts.active} / Banned: {userCounts.banned}</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title">Admins</h5>
                    <p className="display-6 fw-bold mb-0">{userCounts.admin}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title">Instructors</h5>
                    <p className="display-6 fw-bold mb-0">{userCounts.instructor}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title">Students</h5>
                    <p className="display-6 fw-bold mb-0">{userCounts.student}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col-md-4 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title">Total Courses</h5>
                    <p className="display-6 fw-bold mb-0">{courseCounts.total}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title">Published Courses</h5>
                    <p className="display-6 fw-bold mb-0 text-success">{courseCounts.published}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title">Draft Courses</h5>
                    <p className="display-6 fw-bold mb-0 text-secondary">{courseCounts.draft}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col-md-4 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title">Certificates</h5>
                    <p className="display-6 fw-bold mb-0">{certificatesCount}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col-md-6 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Users Distribution</h5>
                    <Pie
                      data={{
                        labels: ['Admins', 'Instructors', 'Students'],
                        datasets: [
                          {
                            data: [userCounts.admin, userCounts.instructor, userCounts.student],
                            backgroundColor: ['#77b0e4', '#f6a531', '#6c757d'],
                          },
                        ],
                      }}
                      options={{ plugins: { legend: { position: 'bottom' } } }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Courses Status</h5>
                    <Bar
                      data={{
                        labels: ['Published', 'Draft'],
                        datasets: [
                          {
                            label: 'Courses',
                            data: [courseCounts.published, courseCounts.draft],
                            backgroundColor: ['#198754', '#6c757d'],
                          },
                        ],
                      }}
                      options={{
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true } },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        {activeSection === "settings" && (
          <section>
            <h1>Site Settings</h1>
            <ul>
              <li>Edit general site settings</li>
            </ul>
          </section>
        )}
        {activeSection === "contact" && (
          <section>
            <h1>Contact Messages</h1>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Email</th>
                      <th>Full Name</th>
                      <th>Message</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((c, i) => (
                      <tr key={c.id}>
                        <td>{i + 1}</td>
                        <td>{c.email}</td>
                        <td>{`${c.firstName} ${c.lastName}`}</td>
                        <td>{c.message}</td>
                        <td>{c.createdAt ? new Date(c.createdAt).toLocaleString() : "-"}</td>
                      </tr>
                    ))}
                    {contacts.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center text-muted py-4">No contact messages</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </main>
    </div>
  );
}
