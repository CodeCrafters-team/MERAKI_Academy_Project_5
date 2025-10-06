"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useRouter } from "next/navigation";
import axios from "axios";
import Loading from "./loading";

const API_BASE = "http://localhost:5000";
const THEME = { primary: "#77b0e4", secondary: "#f6a531" };

type Review = {
  id: number; user_id: number; rating: number; comment: string | null; created_at: string;
  first_name?: string; last_name?: string; avatar_url?: string | null;
};

type CourseWithReviews = {
  course_id: number;
  course_title: string;
  cover_url: string | null;
  price: number | string;
  is_published: boolean;
  student_count: number;
  review_count: number;
  avg_rating: number | string;
  reviews: Review[];
  created_at?: string | null; 
};

type ApiResponse<T> = { success: boolean; message: string; data: T };

function Stars({ value }: { value: number }) {
  return (
    <div style={{ display: "flex", gap: 4, cursor: "default" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ fontSize: 18, color: s <= value ? THEME.secondary : "#cfcfcf", lineHeight: 1 }}>
          ★
        </span>
      ))}
    </div>
  );
}

const fmtMoney = (v: number | string) =>
  `$${Number(v || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

export default function Page() {
  const router = useRouter();
  const auth = useSelector((s: RootState) => s.auth);
  const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token") || ""}` });
  console.log(auth)

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<CourseWithReviews[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newCover, setNewCover] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!auth.userId) return;
    setLoading(true); setError(null);
    axios
      .get<ApiResponse<CourseWithReviews[]>>(`${API_BASE}/reviews/instructors/${auth.userId}`)
      .then((res) => {
        const list = res.data?.data || [];
        const sorted = [...list].sort((a, b) => {
          const earningA = Number(a.price || 0) * Number(a.student_count || 0);
          const earningB = Number(b.price || 0) * Number(b.student_count || 0);
          return earningB - earningA;
        });
        setCourses(sorted);
      })
      .catch((err) => setError(err?.message || "Failed to fetch instructor reviews"))
      .finally(() => setLoading(false));
  }, [auth.userId]);

  const totalStudents = courses.reduce((s, c) => s + Number(c.student_count || 0), 0);
  const avgRating = courses.length
    ? courses.reduce((s, c) => s + (Number(c.avg_rating) || 0), 0) / courses.length
    : 0;
  const totalEarnings = courses.reduce((s, c) => s + Number(c.price || 0) * Number(c.student_count || 0), 0);

  const createCourse = async () => {
    if (!newTitle.trim()) return alert("Title is required");
    setCreating(true);
    try {
      const { data } = await axios.post(
        `${API_BASE}/courses`,
        {
          title: newTitle.trim(),
          description: (newDesc || "").trim(),
          price: Number(newPrice) || 0,
          cover_url: newCover || null,
          created_by: Number(auth.userId),
        },
        { headers: authHeader() }
      );
      const newId = data?.data?.id ?? data?.id;
      if (newId) router.push(`/courses/${newId}/edit`);
      else setAddOpen(false);
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to create course");
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="bg-light min-vh-100">
        <div className="container py-4">

          <div className="card border-0 shadow-sm rounded-3 mb-4">
            <div className="card-body p-4 d-flex justify-content-between align-items-center">
              <div className="pe-3" style={{ maxWidth: 680 }}>
                <h1 className="h4 fw-bold mb-1">Welcome back{auth.firstName ? `, ${auth.firstName}` : ""}</h1>
                <p className="text-muted mb-0">Keep inspiring minds and growing your impact every day.</p>
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
                  <img
                    className="rounded-3 shadow"
                    src={String(auth.avatarUrl || "")}
                    alt="avatar"
                    style={{ width: 82, height: 82, objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2 className="h6 mb-1">Overview</h2>
              <small className="text-muted">Here’s your overview today!</small>
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
                    <div className="fs-4 fw-bold">{courses.length}</div>
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
                    <div className="text-muted small">Total Students</div>
                    <div className="fs-4 fw-bold">{totalStudents.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card h-100 border-0 shadow-sm rounded-3">
                <div className="card-body d-flex align-items-center gap-3">
                  <div className="rounded-3 bg-warning-subtle text-warning d-inline-grid justify-content-center" style={{ width: 46, height: 46 }}>
                    <span className="bi bi-star-fill align-self-center" />
                  </div>
                  <div>
                    <div className="text-muted small">Av. Ratings</div>
                    <div className="fs-4 fw-bold">{avgRating.toFixed(2)}</div>
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
          </div>

          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body">
              <h5 className="m-2">Courses Statistics</h5>
              <div className="table-responsive overflow-auto" style={{ maxHeight: "48vh" }}>
                <table className="table align-middle mb-0">
                  <thead>
                    <tr className="text-muted small">
                      <th className="sticky-top bg-body">Rank</th>
                      <th className="sticky-top bg-body">Course Name</th>
                      <th className="sticky-top bg-body">Students</th>
                      <th className="sticky-top bg-body">Rating</th>
                      <th className="sticky-top bg-body">Earning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((row, i) => (
                      <tr key={row.course_id}>
                        <td className="fw-semibold">{i + 1}</td>
                        <td className="text-truncate" style={{ maxWidth: 280 }}>{row.course_title}</td>
                        <td>{Number(row.student_count || 0).toLocaleString()}</td>
                        <td><Stars value={Number(row.avg_rating || 0)} /></td>
                        <td className="fw-semibold" style={{ color: "green" }}>
                          {fmtMoney(Number(row.price || 0) * Number(row.student_count || 0))}
                        </td>
                      </tr>
                    ))}
                    {courses.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center text-muted py-4">No data</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="card border-0 shadow-sm rounded-3 mt-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="m-0">My Courses</h5>
                <button className="btn btn-primary border-0" onClick={() => setAddOpen(true)}>
                  <i className="bi bi-plus-lg me-1" /> Add Course
                </button>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              {courses.length === 0 ? (
                <div className="alert alert-light border">No courses yet. Create your first one!</div>
              ) : (
                <div className="row g-3">
                  {courses.map((c) => (
                    <div key={c.course_id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                      <div className="card h-100 border-0 shadow-sm rounded-3">
                        <div className="ratio ratio-16x9 bg-light rounded-top">
                          {c.cover_url ? (
                            <img
                              src={c.cover_url}
                              alt={c.course_title}
                              className="rounded-top"
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <div className="d-flex align-items-center justify-content-center text-muted">No cover</div>
                          )}
                        </div>
                        <div className="card-body">
                          <div className="fw-semibold text-truncate mb-1" title={c.course_title}>
                            {c.course_title || "Untitled course"}
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold" style={{color:"green"}}>{fmtMoney(c.price)}</span>
                            <span className={`badge ${c.is_published ? "text-bg-success" : "text-bg-secondary"}`}>
                              {c.is_published ? "Published" : "Draft"}
                            </span>
                          </div>
                        </div>
                        <div className="card-footer bg-body d-flex justify-content-end">
                          <a className="btn btn-sm btn-primary border-0" href={`/courses/${c.course_id}/edit`}>
                            Management
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {addOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,.45)", zIndex: 1050 }}
          onClick={() => !creating && setAddOpen(false)}
        >
          <div
            className="card shadow-lg border-0 w-100 rounded-3"
            style={{ maxWidth: 560 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-header bg-body">
              <strong>Add Course</strong>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input className="form-control" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={3} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
              </div>
            +
            </div>
            <div className="card-footer d-flex justify-content-end gap-2">
              <button className="btn btn-secondary" onClick={() => setAddOpen(false)} disabled={creating}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={createCourse} disabled={creating}>
                {creating ? "Creating..." : "Create & Manage"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
